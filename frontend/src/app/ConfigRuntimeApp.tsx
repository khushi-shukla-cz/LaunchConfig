"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

/* ─── inline styles (no external CSS needed) ─────────────────────────────── */
const S = {
  void_bg: "#04030a",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(139,92,246,0.4)",
  textPrimary: "#f0eeff",
  textSecondary: "rgba(240,238,255,0.55)",
  textMuted: "rgba(240,238,255,0.28)",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  pink: "#ec4899",
  amber: "#f59e0b",
  green: "#34d399",
  red: "#f87171",
  radius: "12px",
  radiusSm: "8px",
  fontDisplay: "'Syne', system-ui, sans-serif",
  fontBody: "'DM Sans', system-ui, sans-serif",
};

/* ─── 3D canvas ────────────────────────────────────────────────────────────── */
function Scene3D() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    let id: number;
    (async () => {
      const T = await import("three").catch(() => null);
      if (!T) return;
      const renderer = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      cam.position.z = 5;

      /* particles */
      const count = 2500; const pos = new Float32Array(count * 3); const col = new Float32Array(count * 3);
      const palette = [[139, 92, 246], [99, 102, 241], [34, 211, 238], [236, 72, 153], [167, 139, 250]];
      for (let i = 0; i < count; i++) {
        const θ = Math.random() * Math.PI * 2; const φ = Math.acos(2 * Math.random() - 1); const r = 3 + Math.random() * 8;
        pos[i * 3] = r * Math.sin(φ) * Math.cos(θ); pos[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ); pos[i * 3 + 2] = r * Math.cos(φ) - 2;
        const [pr, pg, pb] = palette[Math.floor(Math.random() * palette.length)];
        col[i * 3] = pr / 255; col[i * 3 + 1] = pg / 255; col[i * 3 + 2] = pb / 255;
      }
      const pg = new T.BufferGeometry();
      pg.setAttribute("position", new T.BufferAttribute(pos, 3));
      pg.setAttribute("color", new T.BufferAttribute(col, 3));
      const pts = new T.Points(pg, new T.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false }));
      scene.add(pts);

      /* wireframe icosahedron */
      const ico = new T.Mesh(new T.IcosahedronGeometry(2.2, 1), new T.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.07 }));
      scene.add(ico);

      /* torus rings */
      const t1 = new T.Mesh(new T.TorusGeometry(3, 0.35, 8, 60), new T.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.04 }));
      t1.rotation.x = Math.PI / 3; scene.add(t1);
      const t2 = new T.Mesh(new T.TorusGeometry(2.2, 0.25, 8, 50), new T.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.04 }));
      t2.rotation.y = Math.PI / 4; scene.add(t2);

      /* floating orbs */
      const orbCols = [0x8b5cf6, 0x22d3ee, 0xec4899, 0xa78bfa, 0x6366f1, 0xf59e0b];
      const orbs: any[] = [];
      for (let i = 0; i < 6; i++) {
        const o = new T.Mesh(new T.SphereGeometry(0.05 + Math.random() * 0.04, 8, 8), new T.MeshBasicMaterial({ color: orbCols[i] }));
        o.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3);
        (o as any)._off = Math.random() * Math.PI * 2; (o as any)._spd = 0.3 + Math.random() * 0.5;
        orbs.push(o); scene.add(o);
      }

      let mx = 0, my = 0;
      const onMM = (e: MouseEvent) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = -(e.clientY / window.innerHeight - 0.5) * 2; };
      const onR = () => { cam.aspect = window.innerWidth / window.innerHeight; cam.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
      window.addEventListener("mousemove", onMM); window.addEventListener("resize", onR);

      const clock = new T.Clock();
      const tick = () => {
        id = requestAnimationFrame(tick); const t = clock.getElapsedTime();
        pts.rotation.y = t * 0.02; pts.rotation.x = t * 0.008;
        ico.rotation.x = t * 0.04; ico.rotation.y = t * 0.07;
        t1.rotation.z = t * 0.03; t2.rotation.z = -t * 0.025;
        orbs.forEach(o => { o.position.y += Math.sin(t * o._spd + o._off) * 0.002; o.position.x += Math.cos(t * o._spd * 0.7 + o._off) * 0.001; });
        cam.position.x += (mx * 0.3 - cam.position.x) * 0.04; cam.position.y += (my * 0.2 - cam.position.y) * 0.04; cam.lookAt(scene.position);
        renderer.render(scene, cam);
      };
      tick();
      return () => { cancelAnimationFrame(id); window.removeEventListener("mousemove", onMM); window.removeEventListener("resize", onR); renderer.dispose(); };
    })();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", width: "100%", height: "100%" }} />;
}

/* ─── components ─────────────────────────────────────────────────────────── */

function GlassCard({ children, style, hover, onClick }: any) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)} onMouseLeave={() => hover && setH(false)}
      style={{ background: h ? "rgba(255,255,255,0.06)" : S.surface, border: `1px solid ${h ? S.borderHover : S.border}`, borderRadius: S.radius, backdropFilter: "blur(20px)", transition: "all 0.2s", boxShadow: h ? "0 0 30px rgba(139,92,246,0.2)" : "none", cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled, style }: any) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: `linear-gradient(135deg, ${S.violet}, #6366f1)`, border: "none", borderRadius: S.radiusSm, fontFamily: S.fontDisplay, fontWeight: 600, fontSize: 13, color: "#fff", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, transform: h && !disabled ? "translateY(-1px)" : "none", boxShadow: h && !disabled ? "0 8px 28px rgba(139,92,246,0.5)" : "0 4px 18px rgba(139,92,246,0.35)", transition: "all 0.15s", ...style }}>
      {children}
    </button>
  );
}

function BtnGhost({ children, onClick, style }: any) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "transparent", border: `1px solid ${h ? S.borderHover : S.border}`, borderRadius: S.radiusSm, fontFamily: S.fontBody, fontSize: 13, color: h ? S.textPrimary : S.textSecondary, cursor: "pointer", transition: "all 0.2s", ...style }}>
      {children}
    </button>
  );
}

function FieldInput({ label, type = "text", value, onChange, placeholder, required, error, disabled, options }: any) {
  const [f, setF] = useState(false);
  const base: React.CSSProperties = { width: "100%", padding: "10px 14px", background: error ? "rgba(248,113,113,0.06)" : f ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(248,113,113,0.4)" : f ? S.violet : S.border}`, borderRadius: S.radiusSm, fontFamily: S.fontBody, fontSize: 13, color: S.textPrimary, outline: "none", transition: "all 0.2s", boxShadow: f ? `0 0 0 3px rgba(139,92,246,0.15)` : "none", opacity: disabled ? 0.5 : 1, colorScheme: "dark" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: error ? "rgba(248,113,113,0.8)" : S.textMuted, marginBottom: 6, fontFamily: S.fontDisplay }}>
        {label}{required && <span style={{ color: S.violet, marginLeft: 2 }}>*</span>}
      </label>
      {type === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ ...base, appearance: "none", cursor: "pointer" }}>
          <option value="" style={{ background: "#080615" }}>Select…</option>
          {options?.map((o: string) => <option key={o} value={o} style={{ background: "#080615" }}>{o}</option>)}
        </select>
      ) : type === "boolean" ? (
        <button type="button" onClick={() => onChange(!value)} disabled={disabled}
          style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", transition: "all 0.25s", background: value ? S.violet : "rgba(255,255,255,0.12)", position: "relative", boxShadow: value ? `0 0 12px rgba(139,92,246,0.5)` : "none" }}>
          <span style={{ position: "absolute", top: 3, left: value ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
        </button>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={3} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} onFocus={() => setF(true)} onBlur={() => setF(false)} style={base} />
      )}
      {error && <p style={{ fontSize: 11, color: S.red, marginTop: 5 }}>{error}</p>}
    </div>
  );
}

function Badge({ children, color = "violet" }: any) {
  const map: any = {
    violet: { bg: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "rgba(139,92,246,0.25)" },
    cyan: { bg: "rgba(34,211,238,0.1)", color: S.cyan, border: "rgba(34,211,238,0.2)" },
    green: { bg: "rgba(52,211,153,0.1)", color: S.green, border: "rgba(52,211,153,0.2)" },
    amber: { bg: "rgba(245,158,11,0.1)", color: S.amber, border: "rgba(245,158,11,0.2)" },
    red: { bg: "rgba(248,113,113,0.1)", color: S.red, border: "rgba(248,113,113,0.2)" },
  };
  const t = map[color] || map.violet;
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 500, background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>{children}</span>;
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ height: 40, borderRadius: S.radiusSm, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
        </div>
      ))}
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

/* ─── sample config data (simulates loaded config) ───────────────────────── */
const DEMO_CONFIG = {
  name: "Acme CRM", version: "1.0.0",
  resources: [
    {
      name: "contacts", label: "Contact", pluralLabel: "Contacts",
      fields: [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "company", label: "Company", type: "text" },
        { name: "status", label: "Status", type: "select", options: ["lead", "prospect", "customer", "churned"], defaultValue: "lead" },
        { name: "isActive", label: "Active", type: "boolean", defaultValue: true },
        { name: "notes", label: "Notes", type: "textarea" },
      ]
    },
    {
      name: "deals", label: "Deal", pluralLabel: "Deals",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "value", label: "Value ($)", type: "number", required: true },
        { name: "stage", label: "Stage", type: "select", options: ["discovery", "proposal", "negotiation", "won", "lost"], defaultValue: "discovery" },
        { name: "closeDate", label: "Close Date", type: "date" },
      ]
    },
  ],
  auth: { providers: ["email", "otp"] },
  features: [{ name: "csv-import" }, { name: "i18n" }, { name: "github-export" }],
};

const DEMO_RECORDS: Record<string, any[]> = {
  contacts: [
    { id: "1", firstName: "Alice", lastName: "Walker", email: "alice@acme.com", company: "Acme Inc", status: "customer", isActive: true },
    { id: "2", firstName: "Bob", lastName: "Chen", email: "bob@startup.io", company: "Startup.io", status: "lead", isActive: true },
    { id: "3", firstName: "Carol", lastName: "Davis", email: "carol@bigco.com", company: "BigCo", status: "prospect", isActive: false },
    { id: "4", firstName: "Dan", lastName: "Kim", email: "dan@agency.co", company: "Agency Co", status: "customer", isActive: true },
    { id: "5", firstName: "Eve", lastName: "Martin", email: "eve@tech.dev", company: "TechDev", status: "churned", isActive: false },
  ],
  deals: [
    { id: "1", title: "Enterprise Licence", value: 48000, stage: "proposal", closeDate: "2025-06-30" },
    { id: "2", title: "Starter Plan", value: 1200, stage: "won", closeDate: "2025-05-01" },
    { id: "3", title: "Pro Upgrade", value: 8400, stage: "negotiation", closeDate: "2025-07-15" },
  ],
};

/* ─── Navigation ─────────────────────────────────────────────────────────── */
type View = "dashboard" | "resource-list" | "resource-new" | "resource-edit" | "auth";

export default function ConfigRuntimeApp() {
  const [view, setView] = useState<View>("auth");
  const [activeResource, setActiveResource] = useState("contacts");
  const [editRecord, setEditRecord] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counter, setCounter] = useState(0); // force re-render after login

  const config = DEMO_CONFIG;
  const resource = config.resources.find(r => r.name === activeResource)!;

  const nav = (v: View, res?: string, rec?: any) => {
    if (res) setActiveResource(res);
    if (rec !== undefined) setEditRecord(rec);
    setView(v);
    setSidebarOpen(false);
  };

  if (view === "auth") return <AuthScreen onLogin={(u: any) => { setUser(u); setView("dashboard"); setCounter(c => c + 1); }} />;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: S.void_bg, fontFamily: S.fontBody, position: "relative" }}>
      <Scene3D />

      {/* Sidebar */}
      <SidebarNav
        config={config} user={user} activeResource={activeResource} currentView={view}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        onNav={nav} onLogout={() => { setUser(null); setView("auth"); }}
      />

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 10 }}>
        <TopBar title={view === "dashboard" ? `Welcome back, ${user?.name || "User"}` : view === "resource-list" ? resource?.pluralLabel : view === "resource-new" ? `New ${resource?.label}` : `Edit ${resource?.label}`}
          onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", animation: "fadeUp 0.4s ease forwards" }}>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
            {view === "dashboard" && <Dashboard config={config} onNav={nav} />}
            {view === "resource-list" && <ResourceList resource={resource} records={DEMO_RECORDS[activeResource] || []} onNew={() => nav("resource-new")} onEdit={r => nav("resource-edit", undefined, r)} />}
            {view === "resource-new" && <ResourceForm resource={resource} mode="create" onCancel={() => nav("resource-list")} onSave={() => nav("resource-list")} />}
            {view === "resource-edit" && <ResourceForm resource={resource} mode="edit" initial={editRecord} onCancel={() => nav("resource-list")} onSave={() => nav("resource-list")} />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Auth Screen ─────────────────────────────────────────────────────────── */
function AuthScreen({ onLogin }: any) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin1234!");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email || !password) { setError("Email and password are required"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ id: "1", email, name: name || email.split("@")[0], role: "admin" });
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: S.void_bg, position: "relative", overflow: "hidden" }}>
      <Scene3D />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,92,246,0.07), transparent 65%)", pointerEvents: "none" }} />

      {/* Left hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", zIndex: 10 }}>
        <h1 style={{ fontFamily: S.fontDisplay, fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", color: S.textPrimary, textAlign: "center", lineHeight: 1.1, marginBottom: 16 }}>
          Build anything,{" "}
          <span style={{ background: `linear-gradient(135deg, #a78bfa, ${S.cyan}, ${S.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            config-driven
          </span>
        </h1>
        <p style={{ fontSize: 15, color: S.textMuted, textAlign: "center", maxWidth: 380, lineHeight: 1.8, marginBottom: 32 }}>
          Drop a JSON config. Get a fully working app — UI, APIs, database, auth, and plugins — instantly.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {["Config-driven", "Zero hardcoding", "Plugin system", "CSV Import", "i18n", "GitHub Export"].map(t => (
            <Badge key={t} color="violet">{t}</Badge>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", position: "relative", zIndex: 10, borderLeft: `1px solid ${S.border}`, backdropFilter: "blur(20px)", background: "rgba(8,6,21,0.7)" }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${S.violet}, #6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.fontDisplay, fontWeight: 800, fontSize: 15, color: "#fff", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>C</div>
            <span style={{ fontFamily: S.fontDisplay, fontWeight: 700, fontSize: 16, color: S.textPrimary }}>ConfigRuntime</span>
          </div>
          <h2 style={{ fontFamily: S.fontDisplay, fontWeight: 800, fontSize: 22, color: S.textPrimary, marginBottom: 6 }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 24 }}>{mode === "login" ? "Sign in to continue" : "Get started for free"}</p>

          {error && <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: S.radiusSm, background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", fontSize: 12, color: S.red }}>{error}</div>}

          <form onSubmit={handle}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
              {mode === "register" && <FieldInput label="Name" value={name} onChange={setName} placeholder="Your name" />}
              <FieldInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
              <FieldInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
            </div>
            <BtnPrimary style={{ width: "100%", justifyContent: "center", padding: "12px 22px" }} disabled={loading}>
              {loading ? "Signing in…" : mode === "login" ? "Sign In →" : "Create Account →"}
            </BtnPrimary>
          </form>
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: S.textMuted }}>
            {mode === "login" ? "No account? " : "Have an account? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", cursor: "pointer", color: S.violet, fontWeight: 600, fontSize: 12 }}>
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function SidebarNav({ config, user, activeResource, currentView, open, onClose, onNav, onLogout }: any) {
  const navStyle = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: S.radiusSm,
    fontSize: 13, color: active ? S.textPrimary : S.textMuted, cursor: "pointer", transition: "all 0.15s",
    background: active ? "rgba(139,92,246,0.12)" : "transparent",
    border: `1px solid ${active ? "rgba(139,92,246,0.18)" : "transparent"}`,
    fontWeight: active ? 500 : 400, textDecoration: "none", position: "relative" as const,
  });

  const sidebar = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,6,21,0.92)", backdropFilter: "blur(24px)", borderRight: `1px solid ${S.border}` }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${S.violet}, #6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.fontDisplay, fontWeight: 800, fontSize: 14, color: "#fff", boxShadow: "0 0 16px rgba(139,92,246,0.35)", flexShrink: 0 }}>C</div>
          <div><div style={{ fontFamily: S.fontDisplay, fontWeight: 700, fontSize: 13, color: S.textPrimary }}>{config.name}</div><div style={{ fontSize: 10, color: S.textMuted }}>v{config.version}</div></div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        <div onClick={() => onNav("dashboard")} style={navStyle(currentView === "dashboard")}>
          <span style={{ fontSize: 15 }}>⬡</span><span style={{ fontSize: 12 }}>Dashboard</span>
          {currentView === "dashboard" && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2, background: S.violet, borderRadius: "0 2px 2px 0", boxShadow: `0 0 8px ${S.violet}` }} />}
        </div>
        <div style={{ margin: "12px 0 6px 10px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.textMuted, fontFamily: S.fontDisplay }}>Resources</div>
        {config.resources.map((r: any) => {
          const active = currentView === "resource-list" && activeResource === r.name;
          return (
            <div key={r.name} onClick={() => onNav("resource-list", r.name)} style={navStyle(active)}>
              <span style={{ fontSize: 14 }}>🗄</span><span style={{ fontSize: 12 }}>{r.pluralLabel}</span>
              {active && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2, background: S.violet, borderRadius: "0 2px 2px 0", boxShadow: `0 0 8px ${S.violet}` }} />}
            </div>
          );
        })}
        <div style={{ margin: "12px 0 6px 10px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.textMuted, fontFamily: S.fontDisplay }}>Admin</div>
        {[["⚡", "Features"], ["📦", "Export"], ["⚙️", "Config"], ["📊", "Logs"]].map(([icon, label]) => (
          <div key={label as string} style={navStyle(false)}>
            <span style={{ fontSize: 14 }}>{icon}</span><span style={{ fontSize: 12 }}>{label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: "12px 10px", borderTop: `1px solid ${S.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: S.radiusSm, background: "rgba(255,255,255,0.03)", border: `1px solid ${S.border}` }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${S.violet}, ${S.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: S.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || user?.email}</div>
            <div style={{ fontSize: 10, color: S.violet, textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", color: S.textMuted, fontSize: 14, padding: 2 }} title="Logout">↩</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ width: 220, flexShrink: 0, position: "relative", zIndex: 10, display: "none" }} id="sb-desk">
        <style>{`@media(min-width:768px){#sb-desk{display:block!important}}`}</style>
        {sidebar}
      </div>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} onClick={onClose} />
          <div style={{ position: "relative", width: 220, height: "100%" }}>{sidebar}</div>
        </div>
      )}
    </>
  );
}

/* ─── TopBar ──────────────────────────────────────────────────────────────── */
function TopBar({ title, onMenuClick }: any) {
  return (
    <header style={{ height: 52, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", background: "rgba(8,6,21,0.7)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${S.border}` }}>
      <button onClick={onMenuClick} style={{ background: "none", border: "none", cursor: "pointer", color: S.textMuted, padding: 4, fontSize: 18 }} id="menu-btn">
        <style>{`@media(min-width:768px){#menu-btn{display:none!important}}`}</style>
        ☰
      </button>
      <span style={{ fontFamily: S.fontDisplay, fontWeight: 600, fontSize: 14, color: S.textPrimary, flex: 1 }}>{title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: S.textMuted }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: S.green, boxShadow: `0 0 8px ${S.green}` }} />
        <span>Live</span>
      </div>
    </header>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
function Dashboard({ config, onNav }: any) {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  useEffect(() => {
    const targets = [config.resources.length, config.resources.reduce((a: number, r: any) => a + r.fields.length, 0), config.features.length, config.auth.providers.length];
    const interval = setInterval(() => {
      setCounts(prev => prev.map((v, i) => v >= targets[i] ? targets[i] : v + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Resources", value: counts[0], accent: S.violet },
    { label: "Total Fields", value: counts[1], accent: S.cyan },
    { label: "Features", value: counts[2], accent: S.pink },
    { label: "Auth Methods", value: counts[3], accent: S.amber },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: S.violet, marginBottom: 6, fontFamily: S.fontDisplay }}>ConfigRuntime Platform</div>
        <h1 style={{ fontFamily: S.fontDisplay, fontWeight: 800, fontSize: "clamp(20px,3vw,32px)", color: S.textPrimary, marginBottom: 6 }}>
          Welcome back, <span style={{ background: `linear-gradient(135deg, #a78bfa, ${S.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin</span>
        </h1>
        <p style={{ fontSize: 13, color: S.textMuted }}>Acme CRM · 3 resources · 3 features active</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        {stats.map(s => (
          <GlassCard key={s.label} style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 70, height: 70, borderRadius: "50%", background: s.accent, filter: "blur(28px)", opacity: 0.15 }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: S.textMuted, marginBottom: 10, fontFamily: S.fontDisplay }}>{s.label}</div>
            <div style={{ fontFamily: S.fontDisplay, fontWeight: 800, fontSize: 30, color: S.textPrimary, lineHeight: 1 }}>{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {config.resources.map((r: any, i: number) => {
          const accents = [S.violet, S.cyan, S.pink, S.amber];
          const acc = accents[i % accents.length];
          return (
            <GlassCard key={r.name} hover style={{ padding: 18, cursor: "pointer", borderColor: `${acc}22` }} onClick={() => onNav("resource-list", r.name)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${acc}22`, border: `1px solid ${acc}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄</div>
                <span style={{ fontSize: 13, color: S.textMuted }}>→</span>
              </div>
              <div style={{ fontFamily: S.fontDisplay, fontWeight: 700, fontSize: 14, color: S.textPrimary, marginBottom: 4 }}>{r.pluralLabel}</div>
              <div style={{ fontSize: 11, color: S.textMuted, marginBottom: 12 }}>{r.fields.length} fields configured</div>
              <div style={{ display: "flex", gap: 6, paddingTop: 10, borderTop: `1px solid ${S.border}` }}>
                {["+ New", "Import CSV"].map((lbl, j) => (
                  <div key={j} onClick={e => { e.stopPropagation(); onNav(j === 0 ? "resource-new" : "resource-list", r.name); }}
                    style={{ flex: 1, padding: "5px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${S.border}`, fontSize: 11, color: S.textMuted, textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"}>
                    {lbl}
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <GlassCard style={{ padding: "18px 20px" }}>
          <div style={{ fontFamily: S.fontDisplay, fontWeight: 700, fontSize: 13, color: S.textPrimary, marginBottom: 14 }}>Active Features</div>
          {config.features.map((f: any) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 7, background: "rgba(255,255,255,0.03)", border: `1px solid ${S.border}`, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: S.green, boxShadow: `0 0 6px ${S.green}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: S.textSecondary, flex: 1 }}>{f.name}</span>
              <Badge color="green">ON</Badge>
            </div>
          ))}
        </GlassCard>

        <GlassCard style={{ padding: "18px 20px" }}>
          <div style={{ fontFamily: S.fontDisplay, fontWeight: 700, fontSize: 13, color: S.textPrimary, marginBottom: 14 }}>System Status</div>
          {[["API Server", "online", S.green], ["Database", "connected", S.green], ["Config", "v1.0", "#a78bfa"], ["Environment", "development", S.amber]].map(([lbl, val, col]) => (
            <div key={lbl as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 7, background: "rgba(255,255,255,0.03)", border: `1px solid ${S.border}`, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: S.textMuted }}>{lbl}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: col as string, boxShadow: `0 0 5px ${col}` }} />
                <span style={{ fontSize: 11, color: col as string }}>{val}</span>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* ─── Resource List ───────────────────────────────────────────────────────── */
function ResourceList({ resource, records, onNew, onEdit }: any) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localRecs, setLocalRecs] = useState(records);
  const visibleFields = resource.fields.filter((f: any) => !f.hidden).slice(0, 5);
  const filtered = localRecs.filter((r: any) =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const CellVal = ({ field, value }: any) => {
    if (value === null || value === undefined) return <span style={{ color: S.textMuted, fontStyle: "italic" }}>—</span>;
    if (field.type === "boolean") return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 500, background: value ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)", color: value ? S.green : S.textMuted, border: `1px solid ${value ? "rgba(52,211,153,0.2)" : S.border}` }}>{value ? "Yes" : "No"}</span>;
    if (field.type === "select") return <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 500, background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>{String(value)}</span>;
    if (field.type === "email") return <span style={{ color: S.cyan, fontSize: 12 }}>{String(value)}</span>;
    const s = String(value); return <span style={{ fontSize: 13, color: S.textSecondary }}>{s.length > 40 ? s.slice(0, 40) + "…" : s}</span>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: S.textMuted, fontSize: 13 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${resource.pluralLabel}…`}
            style={{ paddingLeft: 30, paddingRight: 14, paddingTop: 8, paddingBottom: 8, width: 220, background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontSize: 12, color: S.textPrimary, outline: "none" }}
            onFocus={e => { e.target.style.borderColor = S.violet; e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.12)`; }}
            onBlur={e => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: S.textMuted }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
          <BtnPrimary onClick={onNew} style={{ padding: "7px 16px", fontSize: 12 }}>+ New {resource.label}</BtnPrimary>
        </div>
      </div>

      <GlassCard style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 480 }}>
            <thead>
              <tr>
                {visibleFields.map((f: any) => (
                  <th key={f.name} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: S.textMuted, borderBottom: `1px solid ${S.border}`, whiteSpace: "nowrap", fontFamily: S.fontDisplay }}>{f.label}</th>
                ))}
                <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: S.textMuted, borderBottom: `1px solid ${S.border}`, fontFamily: S.fontDisplay }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={visibleFields.length + 1} style={{ padding: "48px 16px", textAlign: "center", color: S.textMuted, fontSize: 13 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>🗄</span>
                    <span>No {resource.pluralLabel} found</span>
                    <BtnGhost onClick={onNew} style={{ fontSize: 12, padding: "6px 14px" }}>+ Create first</BtnGhost>
                  </div>
                </td></tr>
              ) : filtered.map((rec: any) => (
                <tr key={rec.id} style={{ cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  {visibleFields.map((f: any) => (
                    <td key={f.name} style={{ padding: "12px 16px", borderBottom: `1px solid rgba(255,255,255,0.03)` }} onClick={() => onEdit(rec)}>
                      <CellVal field={f} value={rec[f.name]} />
                    </td>
                  ))}
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => onEdit(rec)} style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${S.border}`, cursor: "pointer", fontSize: 11, color: S.textMuted, transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = S.borderHover; (e.currentTarget as HTMLElement).style.color = S.violet; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = S.border; (e.currentTarget as HTMLElement).style.color = S.textMuted; }}>
                        Edit
                      </button>
                      {deleteId === rec.id ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setLocalRecs((r: any[]) => r.filter(x => x.id !== rec.id)); setDeleteId(null); }} style={{ padding: "5px 8px", borderRadius: 6, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", cursor: "pointer", fontSize: 11, color: S.red }}>Yes</button>
                          <button onClick={() => setDeleteId(null)} style={{ padding: "5px 8px", borderRadius: 6, background: S.surface, border: `1px solid ${S.border}`, cursor: "pointer", fontSize: 11, color: S.textMuted }}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteId(rec.id)} style={{ padding: "5px 8px", borderRadius: 6, background: "transparent", border: "1px solid transparent", cursor: "pointer", fontSize: 11, color: S.textMuted, transition: "all 0.15s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.2)"; (e.currentTarget as HTMLElement).style.color = S.red; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.color = S.textMuted; }}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

/* ─── Resource Form ───────────────────────────────────────────────────────── */
function ResourceForm({ resource, mode, initial, onCancel, onSave }: any) {
  const [data, setData] = useState<any>(() => {
    const d: any = {};
    resource.fields.forEach((f: any) => { d[f.name] = initial?.[f.name] ?? f.defaultValue ?? ""; });
    return d;
  });
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (name: string, value: any) => { setData((p: any) => ({ ...p, [name]: value })); setErrors((e: any) => { const n = { ...e }; delete n[name]; return n; }); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: any = {};
    resource.fields.forEach((f: any) => { if (f.required && !data[f.name]) errs[f.name] = `${f.label} is required`; });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(onSave, 600); }, 800);
  };

  const visibleFields = resource.fields.filter((f: any) => !f.hidden);

  return (
    <form onSubmit={handleSubmit}>
      {saved && <div style={{ marginBottom: 18, padding: "10px 14px", borderRadius: S.radiusSm, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", fontSize: 12, color: S.green }}>✅ {mode === "create" ? "Created" : "Updated"} successfully!</div>}

      <GlassCard style={{ padding: "24px 26px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {visibleFields.map((f: any) => (
            <div key={f.name} style={f.type === "textarea" ? { gridColumn: "1/-1" } : {}}>
              <FieldInput
                label={f.label} type={f.type} value={data[f.name]} onChange={(v: any) => set(f.name, v)}
                placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}`} required={f.required}
                error={errors[f.name]} disabled={saving} options={f.options}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      <div style={{ display: "flex", gap: 10 }}>
        <BtnPrimary disabled={saving} style={{ padding: "10px 22px" }}>
          {saving ? "Saving…" : mode === "create" ? "Create →" : "Save Changes →"}
        </BtnPrimary>
        <BtnGhost onClick={onCancel}>Cancel</BtnGhost>
      </div>
    </form>
  );
}
