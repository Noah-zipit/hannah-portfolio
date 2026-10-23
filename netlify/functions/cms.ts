// Hannah portfolio CMS API — runs as a Netlify Function.
// Every request must carry a Netlify Identity JWT (the /admin page sends it).
// Identity validates the token; Netlify exposes the user on context.clientContext.
// Saves commit src/content/site.json (and uploads commit images) to the GitHub
// repo, which triggers the normal Netlify rebuild — the site stays static & fast.

const OWNER = "Noah-zipit";
const REPO = "hannah-portfolio";
const BRANCH = "main";
const CONTENT_PATH = "src/content/site.json";
const IMAGE_DIR = "public/work";
const REQUIRED_KEYS = ["seo", "profile", "nav", "hero", "marquee", "stats", "stories", "about", "workSection", "work", "proofSection", "proof", "reports", "experience", "roles", "skills", "skillGroups", "packagesSection", "packages", "contact"];

type GhFile = { sha: string; content?: string };

function ghHeaders() {
  const token = process.env.CMS_GITHUB_TOKEN;
  if (!token) throw new Error("CMS_GITHUB_TOKEN is not configured on the site.");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "hannah-portfolio-cms",
  };
}

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
    ...init,
    headers: { ...ghHeaders(), ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function getFile(path: string): Promise<GhFile> {
  return gh(`/contents/${path}?ref=${BRANCH}`);
}

function fromB64(b64: string): string {
  return Buffer.from(b64.replace(/\n/g, ""), "base64").toString("utf-8");
}
function toB64(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64");
}

async function actionGet() {
  const file = await getFile(CONTENT_PATH);
  const content = JSON.parse(fromB64(file.content || ""));
  return { content, sha: file.sha };
}

async function actionSave(body: { content: unknown; sha: string }, email: string) {
  const content = body.content as Record<string, unknown>;
  if (!content || typeof content !== "object") throw new Error("Content must be a JSON object.");
  const missing = REQUIRED_KEYS.filter((k) => !(k in content));
  if (missing.length) throw new Error(`Content is missing sections: ${missing.join(", ")}`);
  const text = JSON.stringify(content, null, 2) + "\n";
  if (text.length > 900_000) throw new Error("Content is too large.");
  const res = await gh(`/contents/${CONTENT_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Content update via admin (${email})`,
      content: toB64(text),
      sha: body.sha,
      branch: BRANCH,
    }),
  });
  return { sha: res.content?.sha, commit: res.commit?.sha };
}

async function actionImages() {
  const items = (await gh(`/contents/${IMAGE_DIR}?ref=${BRANCH}`)) as { name: string; path: string; type: string }[];
  return {
    images: items
      .filter((i) => i.type === "file" && /\.(jpe?g|png|webp|gif)$/i.test(i.name))
      .map((i) => ({ name: i.name, path: `/work/${i.name}` })),
  };
}

async function actionUpload(body: { name: string; dataBase64: string }, email: string) {
  const clean = (body.name || "upload.jpg").split("/").pop()!.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  if (!/\.(jpe?g|png|webp|gif)$/i.test(clean)) throw new Error("Only JPG, PNG, WebP or GIF images.");
  if (!body.dataBase64 || body.dataBase64.length > 7_000_000) throw new Error("Image missing or too large (max ~5MB).");
  const path = `${IMAGE_DIR}/${clean}`;
  let sha: string | undefined;
  try {
    sha = (await getFile(path)).sha;
  } catch {
    sha = undefined; // new file
  }
  await gh(`/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Image upload via admin (${email}): ${clean}`,
      content: body.dataBase64,
      sha,
      branch: BRANCH,
    }),
  });
  return { path: `/work/${clean}` };
}

export const handler = async (event: { httpMethod: string; body?: string | null }, context: { clientContext?: { user?: { email?: string } } }) => {
  const json = (statusCode: number, data: unknown) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    const user = context.clientContext?.user;
    if (!user?.email) return json(401, { error: "Not logged in." });
    if (event.httpMethod !== "POST") return json(405, { error: "POST only." });
    const body = JSON.parse(event.body || "{}");
    switch (body.action) {
      case "get":
        return json(200, await actionGet());
      case "save":
        return json(200, await actionSave(body, user.email));
      case "images":
        return json(200, await actionImages());
      case "upload":
        return json(200, await actionUpload(body, user.email));
      case "whoami":
        return json(200, { email: user.email });
      default:
        return json(400, { error: `Unknown action: ${body.action}` });
    }
  } catch (err) {
    return json(500, { error: err instanceof Error ? err.message : "Unknown error" });
  }
};
