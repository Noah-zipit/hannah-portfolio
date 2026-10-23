"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

// ---------- path helpers ----------
function getPath(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj: any, path: string, value: any): any {
  const clone = structuredClone(obj);
  const keys = path.split(".");
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
  return clone;
}

// ---------- small field components ----------
const inputCls =
  "w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm text-cream placeholder:text-faint focus:border-cherry focus:outline-none";
const labelCls = "mb-1.5 block text-xs font-bold tracking-wider text-sand uppercase";

function T({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function TA({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea className={inputCls} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function Num({ label, value, onChange }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        className={inputCls}
        type="number"
        step="any"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </label>
  );
}
function Check({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-sand">
      <input type="checkbox" className="h-4 w-4 accent-[#810100]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function RowBtns({ onUp, onDown, onDelete, first, last }: { onUp: () => void; onDown: () => void; onDelete: () => void; first?: boolean; last?: boolean }) {
  const b = "rounded-lg border border-line px-2 py-1 text-xs font-bold text-sand transition-colors hover:border-cherry hover:text-cream disabled:opacity-30";
  return (
    <div className="flex shrink-0 gap-1.5">
      <button type="button" className={b} disabled={first} onClick={onUp} title="Move up">↑</button>
      <button type="button" className={b} disabled={last} onClick={onDown} title="Move down">↓</button>
      <button type="button" className={b} onClick={onDelete} title="Delete">✕</button>
    </div>
  );
}

function StringList({ label, items, onChange, addLabel = "Add item" }: { label: string; items: string[]; onChange: (v: string[]) => void; addLabel?: string }) {
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="space-y-2">
        {(items || []).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputCls}
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <RowBtns first={i === 0} last={i === items.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} onDelete={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
        ))}
        <button type="button" className="rounded-xl border border-dashed border-line px-4 py-2 text-sm font-bold text-sand transition-colors hover:border-cherry hover:text-cream" onClick={() => onChange([...(items || []), ""])}>
          + {addLabel}
        </button>
      </div>
    </div>
  );
}

// ---------- image picker ----------
type ApiFn = (action: string, extra?: Record<string, unknown>) => Promise<any>;

function ImageField({ label, value, onChange, api, note }: { label: string; value: string; onChange: (v: string, dims?: { w: number; h: number }) => void; api: ApiFn; note?: string }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<{ name: string; path: string }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const loadImages = async () => {
    try {
      const res = await api("images");
      setImages(res.images);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load images");
    }
  };
  useEffect(() => {
    if (open && !images) loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  const pick = (path: string) => {
    const img = new Image();
    img.onload = () => {
      onChange(path, { w: img.naturalWidth, h: img.naturalHeight });
      setOpen(false);
    };
    img.onerror = () => {
      onChange(path);
      setOpen(false);
    };
    img.src = path;
  };

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const res = await api("upload", { name: file.name, dataBase64: dataUrl.split(",")[1] });
      setImages(null);
      pick(res.path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-12 shrink-0 rounded-lg border border-line object-cover" />
        ) : (
          <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border border-line text-[10px] text-faint">none</div>
        )}
        <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="/work/image.jpg" />
        <button type="button" className="shrink-0 rounded-xl bg-cherry px-4 py-2.5 text-sm font-bold text-cream transition-transform hover:scale-[1.03] active:scale-95" onClick={() => setOpen(true)}>
          Choose
        </button>
      </div>
      {note && <p className="mt-1 text-xs text-faint">{note}</p>}
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-coal p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-cream">Choose an image</h3>
              <button type="button" className="rounded-lg border border-line px-3 py-1.5 text-sm font-bold text-sand hover:border-cherry" onClick={() => setOpen(false)}>Close</button>
            </div>
            {err && <p className="mb-3 rounded-xl border border-cherry bg-maroon/40 px-4 py-2 text-sm text-cream">{err}</p>}
            <label className="mb-5 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-line px-4 py-6 text-sm font-bold text-sand transition-colors hover:border-cherry hover:text-cream">
              {busy ? "Uploading…" : "＋ Upload a new image (JPG, PNG, WebP — max ~5MB)"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {!images && !err && <p className="text-sm text-faint">Loading images…</p>}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {(images || []).map((im) => (
                <button key={im.path} type="button" className={`overflow-hidden rounded-xl border-2 text-left ${value === im.path ? "border-cherry" : "border-line"}`} onClick={() => pick(im.path)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.path} alt={im.name} className="h-24 w-full object-cover" loading="lazy" />
                  <span className="block truncate px-2 py-1.5 text-[11px] text-sand">{im.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- generic object-list editor ----------
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "number" | "checkbox" | "image" | "strings"; rows?: number };

function ObjList({
  label, items, onChange, fields, blank, api, itemName,
}: {
  label: string;
  items: any[];
  onChange: (v: any[]) => void;
  fields: FieldDef[];
  blank: () => any;
  api: ApiFn;
  itemName: string;
}) {
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const setField = (i: number, key: string, v: any) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="space-y-4">
        {(items || []).map((item, i) => (
          <div key={i} className="rounded-2xl border border-line bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold tracking-wider text-rose uppercase">{itemName} {i + 1}</p>
              <RowBtns first={i === 0} last={i === items.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} onDelete={() => onChange(items.filter((_, j) => j !== i))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((fd) => {
                const v = item[fd.key];
                const set = (nv: any) => setField(i, fd.key, nv);
                if (fd.type === "textarea") return <div key={fd.key} className="sm:col-span-2"><TA label={fd.label} value={v ?? ""} rows={fd.rows ?? 3} onChange={set} /></div>;
                if (fd.type === "number") return <Num key={fd.key} label={fd.label} value={v} onChange={set} />;
                if (fd.type === "checkbox") return <div key={fd.key} className="flex items-end pb-1"><Check label={fd.label} value={v} onChange={set} /></div>;
                if (fd.type === "image")
                  return (
                    <div key={fd.key} className="sm:col-span-2">
                      <ImageField label={fd.label} value={v ?? ""} api={api} onChange={(path, dims) => { set(path); if (dims && "w" in item && "h" in item) { setField(i, "w", dims.w); setField(i, "h", dims.h); } }} />
                    </div>
                  );
                if (fd.type === "strings") return <div key={fd.key} className="sm:col-span-2"><StringList label={fd.label} items={v || []} onChange={set} /></div>;
                return <T key={fd.key} label={fd.label} value={v ?? ""} onChange={set} />;
              })}
            </div>
          </div>
        ))}
        <button type="button" className="rounded-xl border border-dashed border-line px-4 py-2.5 text-sm font-bold text-sand transition-colors hover:border-cherry hover:text-cream" onClick={() => onChange([...(items || []), blank()])}>
          + Add {itemName.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-coal p-6 sm:p-8">
      <h2 className="mb-6 font-display text-2xl font-bold text-cream">{title}</h2>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

// ---------- main admin ----------
const TABS = [
  { id: "profile", label: "Profile & About text" },
  { id: "seo", label: "Search & sharing (SEO)" },
  { id: "nav", label: "Menu & buttons" },
  { id: "hero", label: "Hero (top section)" },
  { id: "stats", label: "Marquee & numbers" },
  { id: "stories", label: "Flagship stories" },
  { id: "about", label: "About section" },
  { id: "gallery", label: "Gallery pieces" },
  { id: "proof", label: "Proof & reports" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "packages", label: "Packages" },
  { id: "contact", label: "Contact & footer" },
] as const;

const TOKEN_KEY = "hannah-cms-token";

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [sha, setSha] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const [tab, setTab] = useState<string>("profile");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  const api = useCallback<ApiFn>(async (action, extra = {}) => {
    const t = localStorage.getItem(TOKEN_KEY);
    const res = await fetch("/.netlify/functions/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && action !== "login") {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setContent(null);
      throw new Error("Your session expired — please log in again.");
    }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await api("login", { password });
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setContent(null);
  };

  const load = useCallback(async () => {
    setError("");
    setStatus("Loading your content…");
    try {
      const res = await api("get");
      setContent(res.content);
      setSha(res.sha);
      setSnapshot(JSON.stringify(res.content));
      setStatus("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load content.");
      setStatus("");
    }
  }, [api]);

  useEffect(() => {
    if (token && !content) load();
  }, [token, content, load]);

  const set = (path: string) => (v: any) => setContent((c: any) => setPath(c, path, v));
  const g = (path: string) => getPath(content, path);
  const dirty = content != null && JSON.stringify(content) !== snapshot;

  const publish = async () => {
    setPublishing(true);
    setError("");
    setStatus("Publishing…");
    try {
      const res = await api("save", { content, sha });
      setSha(res.sha);
      setSnapshot(JSON.stringify(content));
      setStatus("Published ✓ — the site rebuilds itself and goes live in about a minute.");
    } catch (e) {
      setError((e instanceof Error ? e.message : "Publish failed.") + " If the content changed elsewhere, use “Reload latest” and re-apply your change.");
      setStatus("");
    } finally {
      setPublishing(false);
    }
  };

  // ---------- login screen ----------
  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl border border-line bg-coal p-8 text-center">
          <p className="font-display text-3xl font-black">Hannah<span className="text-rose">.</span> <span className="text-lg font-bold text-sand">admin</span></p>
          <p className="mt-3 text-sm leading-relaxed text-sand">
            This is where you edit everything on your portfolio — words, numbers, pictures, prices. Enter the admin password to continue.
          </p>
          <input
            type="password"
            autoComplete="current-password"
            className={`${inputCls} mt-6 text-center`}
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && <p className="mt-3 rounded-xl border border-cherry bg-maroon/40 px-4 py-2 text-sm">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="mt-4 w-full rounded-full bg-cherry py-3.5 text-sm font-bold text-cream transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loggingIn ? "Checking…" : "Log in"}
          </button>
          <a href="/" className="mt-6 inline-block text-sm font-semibold text-rose">← Back to the site</a>
        </form>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-cream">
        <div className="text-center">
          <p className="text-lg font-semibold">{error || "Loading your content…"}</p>
          {error && (
            <button type="button" className="mt-4 rounded-full bg-cherry px-6 py-3 text-sm font-bold text-cream" onClick={load}>Try again</button>
          )}
        </div>
      </main>
    );
  }

  // ---------- editor ----------
  return (
    <main className="min-h-screen bg-ink pb-32 text-cream">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="font-display text-xl font-black">Hannah<span className="text-rose">.</span> <span className="text-sm font-bold text-sand">admin</span></p>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" target="_blank" className="font-semibold text-rose">View site ↗</a>
            <button type="button" className="rounded-full border border-line px-4 py-1.5 font-bold text-sand hover:border-cherry hover:text-cream" onClick={logout}>Log out</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${tab === t.id ? "bg-cherry text-cream" : "border border-line text-sand hover:border-cherry hover:text-cream"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {error && <p className="mb-5 rounded-2xl border border-cherry bg-maroon/40 px-5 py-3 text-sm">{error}</p>}

        {tab === "profile" && (
          <Section title="Profile & about text">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Full name" value={g("profile.name")} onChange={set("profile.name")} />
              <T label="Job title / role" value={g("profile.role")} onChange={set("profile.role")} />
              <T label="First name (big headline, part 1)" value={g("profile.firstName")} onChange={set("profile.firstName")} />
              <T label="Last name (big headline, part 2 — shown in red italic)" value={g("profile.lastName")} onChange={set("profile.lastName")} />
              <T label="Tagline (pill under the menu)" value={g("profile.tagline")} onChange={set("profile.tagline")} />
              <T label="Location" value={g("profile.location")} onChange={set("profile.location")} />
              <T label="Location note (next to the buttons)" value={g("profile.locationNote")} onChange={set("profile.locationNote")} />
              <T label="Email" value={g("profile.email")} onChange={set("profile.email")} />
              <T label="Phone (shown)" value={g("profile.phone")} onChange={set("profile.phone")} />
              <T label="Phone link (e.g. tel:+923001234567)" value={g("profile.phoneHref")} onChange={set("profile.phoneHref")} />
              <T label="LinkedIn URL" value={g("profile.linkedin")} onChange={set("profile.linkedin")} />
            </div>
            <TA label="About paragraph (also used in the About section)" rows={6} value={g("profile.about")} onChange={set("profile.about")} />
          </Section>
        )}

        {tab === "seo" && (
          <Section title="Search & sharing">
            <T label="Browser tab / Google title" value={g("seo.title")} onChange={set("seo.title")} />
            <TA label="Google description" rows={3} value={g("seo.description")} onChange={set("seo.description")} />
            <T label="Share title (WhatsApp / social preview)" value={g("seo.ogTitle")} onChange={set("seo.ogTitle")} />
            <TA label="Share description" rows={3} value={g("seo.ogDescription")} onChange={set("seo.ogDescription")} />
            <ImageField label="Share image" value={g("seo.ogImage")} api={api} onChange={set("seo.ogImage")} />
          </Section>
        )}

        {tab === "nav" && (
          <Section title="Menu & top button">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Top-right button text" value={g("nav.ctaLabel")} onChange={set("nav.ctaLabel")} />
              <T label="Top-right button link" value={g("nav.ctaHref")} onChange={set("nav.ctaHref")} />
            </div>
            <ObjList label="Menu links" itemName="Link" items={g("nav.links")} onChange={set("nav.links")} api={api}
              blank={() => ({ label: "", href: "#" })}
              fields={[{ key: "label", label: "Text", type: "text" }, { key: "href", label: "Link (e.g. #work)", type: "text" }]} />
          </Section>
        )}

        {tab === "hero" && (
          <Section title="Hero — the top of the page">
            <T label="Giant background word" value={g("hero.backdropWord")} onChange={set("hero.backdropWord")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TA label="Intro — opening words" rows={2} value={g("hero.introLead")} onChange={set("hero.introLead")} />
              <TA label="Intro — bold part 1" rows={2} value={g("hero.introBold1")} onChange={set("hero.introBold1")} />
              <TA label="Intro — middle words" rows={2} value={g("hero.introMiddle")} onChange={set("hero.introMiddle")} />
              <TA label="Intro — bold part 2" rows={2} value={g("hero.introBold2")} onChange={set("hero.introBold2")} />
              <TA label="Intro — closing words" rows={2} value={g("hero.introTail")} onChange={set("hero.introTail")} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Main button text" value={g("hero.primaryCta.label")} onChange={set("hero.primaryCta.label")} />
              <T label="Main button link" value={g("hero.primaryCta.href")} onChange={set("hero.primaryCta.href")} />
              <T label="Second button text" value={g("hero.secondaryCta.label")} onChange={set("hero.secondaryCta.label")} />
              <T label="Second button link" value={g("hero.secondaryCta.href")} onChange={set("hero.secondaryCta.href")} />
            </div>
            <ImageField label="Tall picture (top right)" value={g("hero.imageA.src")} api={api} onChange={set("hero.imageA.src")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Tall picture caption" value={g("hero.imageA.caption")} onChange={set("hero.imageA.caption")} />
              <T label="Tall picture description (for screen readers)" value={g("hero.imageA.alt")} onChange={set("hero.imageA.alt")} />
            </div>
            <ImageField label="Poster picture (bottom left)" value={g("hero.imageB.src")} api={api} onChange={set("hero.imageB.src")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Poster picture caption" value={g("hero.imageB.caption")} onChange={set("hero.imageB.caption")} />
              <T label="Poster picture description" value={g("hero.imageB.alt")} onChange={set("hero.imageB.alt")} />
              <T label="Small stat card — big number" value={g("hero.statCard.value")} onChange={set("hero.statCard.value")} />
              <T label="Small stat card — text" value={g("hero.statCard.text")} onChange={set("hero.statCard.text")} />
            </div>
          </Section>
        )}

        {tab === "stats" && (
          <Section title="Marquee & headline numbers">
            <StringList label="Marquee words (the red scrolling band)" items={g("marquee")} onChange={set("marquee")} addLabel="Add word" />
            <ObjList label="Numbers row (the first one is the giant hero number)" itemName="Number" items={g("stats.items")} onChange={set("stats.items")} api={api}
              blank={() => ({ value: 0, label: "", sub: "" })}
              fields={[
                { key: "value", label: "Number (e.g. 2213 or 0.05)", type: "number" },
                { key: "decimals", label: "Decimal places (optional)", type: "number" },
                { key: "prefix", label: "Prefix (e.g. $)", type: "text" },
                { key: "suffix", label: "Suffix (e.g. M or K)", type: "text" },
                { key: "label", label: "Label", type: "text" },
                { key: "sub", label: "Small print", type: "text" },
              ]} />
            <T label="Note after the giant number's small print" value={g("stats.heroNote")} onChange={set("stats.heroNote")} />
            <div className="grid gap-5 sm:grid-cols-3">
              <T label="Extra number — value (fixed, e.g. 324K)" value={g("stats.extra.value")} onChange={set("stats.extra.value")} />
              <T label="Extra number — label" value={g("stats.extra.label")} onChange={set("stats.extra.label")} />
              <T label="Extra number — small print" value={g("stats.extra.sub")} onChange={set("stats.extra.sub")} />
            </div>
          </Section>
        )}

        {tab === "stories" && (
          <Section title="Flagship stories">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow (small red label)" value={g("stories.eyebrow")} onChange={set("stories.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("stories.headingLead")} onChange={set("stories.headingLead")} />
              <T label="Heading — italic part" value={g("stories.headingAccent")} onChange={set("stories.headingAccent")} />
            </div>
            <ObjList label="Stories (numbered automatically)" itemName="Story" items={g("stories.items")} onChange={set("stories.items")} api={api}
              blank={() => ({ client: "", headline: "", accent: "", body: "", meta: "", img: "", alt: "" })}
              fields={[
                { key: "client", label: "Client / project", type: "text" },
                { key: "headline", label: "Headline", type: "text" },
                { key: "accent", label: "Headline — red italic part", type: "text" },
                { key: "body", label: "Story text", type: "textarea", rows: 5 },
                { key: "meta", label: "Small print line (skills · role · year)", type: "text" },
                { key: "img", label: "Picture", type: "image" },
                { key: "alt", label: "Picture description", type: "text" },
              ]} />
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Quote — line 1" value={g("stories.quote.line1")} onChange={set("stories.quote.line1")} />
              <T label="Quote — citation" value={g("stories.quote.cite")} onChange={set("stories.quote.cite")} />
              <T label="Quote — line 2 start" value={g("stories.quote.line2Before")} onChange={set("stories.quote.line2Before")} />
              <T label="Quote — line 2 red words" value={g("stories.quote.accent")} onChange={set("stories.quote.accent")} />
              <T label="Quote — line 2 end" value={g("stories.quote.line2After")} onChange={set("stories.quote.line2After")} />
            </div>
          </Section>
        )}

        {tab === "about" && (
          <Section title="About section">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow" value={g("about.eyebrow")} onChange={set("about.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("about.headingLead")} onChange={set("about.headingLead")} />
              <T label="Heading — italic part" value={g("about.headingAccent")} onChange={set("about.headingAccent")} />
            </div>
            <ImageField label="Picture" value={g("about.image")} api={api} onChange={set("about.image")} />
            <T label="Picture description" value={g("about.imageAlt")} onChange={set("about.imageAlt")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Card under picture — title" value={g("about.cardTitle")} onChange={set("about.cardTitle")} />
              <T label="Card 1 heading" value={g("about.currentlyTitle")} onChange={set("about.currentlyTitle")} />
              <TA label="Card under picture — text" rows={2} value={g("about.cardText")} onChange={set("about.cardText")} />
              <TA label="Card 1 text" rows={3} value={g("about.currentlyText")} onChange={set("about.currentlyText")} />
              <T label="Card 2 heading" value={g("about.educationTitle")} onChange={set("about.educationTitle")} />
              <span />
              <TA label="Card 2 text" rows={3} value={g("about.educationText")} onChange={set("about.educationText")} />
            </div>
          </Section>
        )}

        {tab === "gallery" && (
          <Section title="The gallery — your work pieces">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow" value={g("workSection.eyebrow")} onChange={set("workSection.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("workSection.headingLead")} onChange={set("workSection.headingLead")} />
              <T label="Heading — italic part" value={g("workSection.headingAccent")} onChange={set("workSection.headingAccent")} />
            </div>
            <TA label="Intro line under the heading" rows={2} value={g("workSection.sub")} onChange={set("workSection.sub")} />
            <ObjList label="Pieces (filters are built from the categories you use)" itemName="Piece" items={g("work")} onChange={set("work")} api={api}
              blank={() => ({ src: "", w: 1000, h: 1250, title: "", client: "", category: "Social", note: "" })}
              fields={[
                { key: "src", label: "Picture", type: "image" },
                { key: "title", label: "Title", type: "text" },
                { key: "client", label: "Client", type: "text" },
                { key: "category", label: "Category (Campaigns, Social, AI Content, Pinterest, Web…)", type: "text" },
                { key: "note", label: "Note under the title", type: "text" },
                { key: "w", label: "Image width (auto-set when you pick a picture)", type: "number" },
                { key: "h", label: "Image height (auto-set)", type: "number" },
              ]} />
          </Section>
        )}

        {tab === "proof" && (
          <Section title="Proof — before/after & reports">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Giant background word" value={g("proofSection.backdropWord")} onChange={set("proofSection.backdropWord")} />
              <T label="Eyebrow" value={g("proofSection.eyebrow")} onChange={set("proofSection.eyebrow")} />
              <T label="Heading — first part" value={g("proofSection.headingLead")} onChange={set("proofSection.headingLead")} />
              <T label="Heading — italic part" value={g("proofSection.headingAccent")} onChange={set("proofSection.headingAccent")} />
              <T label="“Before” label" value={g("proofSection.beforeLabel")} onChange={set("proofSection.beforeLabel")} />
              <T label="“After” label" value={g("proofSection.afterLabel")} onChange={set("proofSection.afterLabel")} />
              <T label="Reports heading" value={g("proofSection.reportsHeading")} onChange={set("proofSection.reportsHeading")} />
              <T label="Reports intro" value={g("proofSection.reportsSub")} onChange={set("proofSection.reportsSub")} />
            </div>
            <ObjList label="Before / after blocks" itemName="Block" items={g("proof")} onChange={set("proof")} api={api}
              blank={() => ({ title: "", metric: "", detail: "", before: "", after: "" })}
              fields={[
                { key: "title", label: "Title", type: "text" },
                { key: "metric", label: "Big metric", type: "text" },
                { key: "detail", label: "Detail", type: "textarea", rows: 2 },
                { key: "before", label: "Before picture", type: "image" },
                { key: "after", label: "After picture", type: "image" },
              ]} />
            <ObjList label="Report screenshots" itemName="Report" items={g("reports")} onChange={set("reports")} api={api}
              blank={() => ({ src: "", title: "", detail: "" })}
              fields={[
                { key: "src", label: "Screenshot", type: "image" },
                { key: "title", label: "Title", type: "text" },
                { key: "detail", label: "Detail line", type: "text" },
              ]} />
          </Section>
        )}

        {tab === "experience" && (
          <Section title="Experience timeline">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow" value={g("experience.eyebrow")} onChange={set("experience.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("experience.headingLead")} onChange={set("experience.headingLead")} />
              <T label="Heading — italic part" value={g("experience.headingAccent")} onChange={set("experience.headingAccent")} />
            </div>
            <ObjList label="Roles" itemName="Role" items={g("roles")} onChange={set("roles")} api={api}
              blank={() => ({ company: "", title: "", period: "", type: "", points: [""] })}
              fields={[
                { key: "company", label: "Company", type: "text" },
                { key: "title", label: "Job title", type: "text" },
                { key: "period", label: "Period (e.g. Sep 2026 — Present)", type: "text" },
                { key: "type", label: "Type (e.g. Full-time · Onsite, Karachi)", type: "text" },
                { key: "points", label: "Bullet points", type: "strings" },
              ]} />
          </Section>
        )}

        {tab === "skills" && (
          <Section title="Skills & tools">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow" value={g("skills.eyebrow")} onChange={set("skills.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("skills.headingLead")} onChange={set("skills.headingLead")} />
              <T label="Heading — italic part" value={g("skills.headingAccent")} onChange={set("skills.headingAccent")} />
            </div>
            <ObjList label="Skill groups" itemName="Group" items={g("skillGroups")} onChange={set("skillGroups")} api={api}
              blank={() => ({ title: "", items: [""] })}
              fields={[
                { key: "title", label: "Group title", type: "text" },
                { key: "items", label: "Skills", type: "strings" },
              ]} />
          </Section>
        )}

        {tab === "packages" && (
          <Section title="Creator packages (HeavenLabs)">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow" value={g("packagesSection.eyebrow")} onChange={set("packagesSection.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("packagesSection.headingLead")} onChange={set("packagesSection.headingLead")} />
              <T label="Heading — italic part" value={g("packagesSection.headingAccent")} onChange={set("packagesSection.headingAccent")} />
            </div>
            <TA label="Intro paragraph" rows={3} value={g("packagesSection.intro")} onChange={set("packagesSection.intro")} />
            <TA label="Footnote under the cards" rows={2} value={g("packagesSection.footnote")} onChange={set("packagesSection.footnote")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Badge on the featured package" value={g("packagesSection.badgeLabel")} onChange={set("packagesSection.badgeLabel")} />
              <T label="Button text starts with" value={g("packagesSection.ctaPrefix")} onChange={set("packagesSection.ctaPrefix")} />
              <T label="Currency label" value={g("packagesSection.currency")} onChange={set("packagesSection.currency")} />
              <T label="Per-period label" value={g("packagesSection.perLabel")} onChange={set("packagesSection.perLabel")} />
            </div>
            <ObjList label="Packages" itemName="Package" items={g("packages")} onChange={set("packages")} api={api}
              blank={() => ({ name: "", price: "", tag: "", line: "", features: [""], primary: false })}
              fields={[
                { key: "name", label: "Name", type: "text" },
                { key: "price", label: "Price (e.g. 35,000)", type: "text" },
                { key: "tag", label: "Small label above the name", type: "text" },
                { key: "line", label: "Italic line", type: "text" },
                { key: "features", label: "Feature list", type: "strings" },
                { key: "primary", label: "Featured package (red highlight)", type: "checkbox" },
              ]} />
          </Section>
        )}

        {tab === "contact" && (
          <Section title="Contact & footer">
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="Eyebrow" value={g("contact.eyebrow")} onChange={set("contact.eyebrow")} />
              <span />
              <T label="Heading — first part" value={g("contact.headingLead")} onChange={set("contact.headingLead")} />
              <T label="Heading — red italic part" value={g("contact.headingAccent")} onChange={set("contact.headingAccent")} />
            </div>
            <TA label="Text under the heading" rows={2} value={g("contact.text")} onChange={set("contact.text")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <T label="LinkedIn button text" value={g("contact.linkedinLabel")} onChange={set("contact.linkedinLabel")} />
              <T label="Footer line (very bottom)" value={g("contact.footerLine")} onChange={set("contact.footerLine")} />
            </div>
            <p className="text-sm text-faint">The email and phone buttons come from the Profile tab.</p>
          </Section>
        )}
      </div>

      {/* publish bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-coal/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-sm text-sand">
            {status || (dirty ? "You have unpublished changes." : "Everything is published.")}
          </p>
          <div className="flex gap-3">
            <button type="button" className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-sand hover:border-cherry hover:text-cream" onClick={load}>
              Reload latest
            </button>
            <button
              type="button"
              disabled={!dirty || publishing}
              className="rounded-full bg-cherry px-7 py-2.5 text-sm font-bold text-cream transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40"
              onClick={publish}
            >
              {publishing ? "Publishing…" : "Publish changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
