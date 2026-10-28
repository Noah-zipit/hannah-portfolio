// Hannah portfolio CMS API — runs as a Netlify Function.
// Login is a single admin password (env CMS_ADMIN_PASSWORD). A successful
// login returns a signed session token (HMAC, 7-day expiry) that the /admin
// page sends as a Bearer token on every other call.
// Saves commit src/content/site.json (and uploads commit images) to the GitHub
// repo, which triggers the normal Netlify rebuild — the site stays static & fast.

import { createHmac, createHash, timingSafeEqual } from "node:crypto";

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

// ---------- password login + session tokens ----------
function sessionKey(): string {
  const k = process.env.CMS_GITHUB_TOKEN;
  if (!k) throw new Error("CMS_GITHUB_TOKEN is not configured on the site.");
  return k;
}
function signToken(exp: number): string {
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", sessionKey()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", sessionKey()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
function passwordOk(candidate: string): boolean {
  const real = process.env.CMS_ADMIN_PASSWORD;
  if (!real) throw new Error("CMS_ADMIN_PASSWORD is not set yet — the site owner needs to set it in Netlify.");
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(real).digest();
  return timingSafeEqual(a, b);
}

async function actionGet() {
  const file = await getFile(CONTENT_PATH);
  const content = JSON.parse(fromB64(file.content || ""));
  return { content, sha: file.sha };
}

async function actionSave(body: { content: unknown; sha: string }) {
  const content = body.content as Record<string, unknown>;
  if (!content || typeof content !== "object") throw new Error("Content must be a JSON object.");
  const missing = REQUIRED_KEYS.filter((k) => !(k in content));
  if (missing.length) throw new Error(`Content is missing sections: ${missing.join(", ")}`);
  const text = JSON.stringify(content, null, 2) + "\n";
  if (text.length > 900_000) throw new Error("Content is too large.");
  const res = await gh(`/contents/${CONTENT_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Content update via admin`,
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

async function actionUpload(body: { name: string; dataBase64: string }) {
  const clean = (body.name || "upload.jpg").split("/").pop()!.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const isVideo = /\.(mp4|webm|mov)$/i.test(clean);
  if (!isVideo && !/\.(jpe?g|png|webp|gif)$/i.test(clean)) throw new Error("Only JPG, PNG, WebP, GIF images or MP4/WebM/MOV video.");
  if (!body.dataBase64 || body.dataBase64.length > 7_000_000) throw new Error(isVideo ? "Video missing or too large (max ~5MB — keep clips short/compressed)." : "Image missing or too large (max ~5MB).");
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
      message: `Image upload via admin: ${clean}`,
      content: body.dataBase64,
      sha,
      branch: BRANCH,
    }),
  });
  return { path: `/work/${clean}` };
}

export const handler = async (event: { httpMethod: string; body?: string | null; headers?: Record<string, string | undefined> }) => {
  const json = (statusCode: number, data: unknown) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    if (event.httpMethod !== "POST") return json(405, { error: "POST only." });
    const body = JSON.parse(event.body || "{}");
    if (body.action === "login") {
      if (typeof body.password !== "string" || !passwordOk(body.password))
        return json(401, { error: "Wrong password." });
      return json(200, { token: signToken(Date.now() + 7 * 24 * 3600 * 1000) });
    }
    const auth = event.headers?.authorization || event.headers?.Authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
    if (!verifyToken(token)) return json(401, { error: "Not logged in." });
    switch (body.action) {
      case "get":
        return json(200, await actionGet());
      case "save":
        return json(200, await actionSave(body));
      case "images":
        return json(200, await actionImages());
      case "upload":
        return json(200, await actionUpload(body));
      default:
        return json(400, { error: `Unknown action: ${body.action}` });
    }
  } catch (err) {
    return json(500, { error: err instanceof Error ? err.message : "Unknown error" });
  }
};
