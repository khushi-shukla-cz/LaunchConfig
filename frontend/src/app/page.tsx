"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/client";

function StatCard({ label, value, icon, color, delay }: any) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (typeof value !== "number") return;
    const steps = 40; let step = 0;
    const iv = setInterval(() => { step++; setN(Math.round(value * step / steps)); if (step >= steps) clearInterval(iv); }, 20);
    return () => clearInterval(iv);
  }, [value]);
  return (
    <div className="glass glass-hover" style={{ padding: "20px 22px", position: "relative", overflow: "hidden", opacity: 0, animation: `fadeUp 0.5s ease ${delay}s forwards` }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, filter: "blur(30px)", opacity: 0.15 }}/>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10, fontFamily: "var(--font-display)" }}>{label}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, lineHeight: 1, color: "var(--text-primary)" }}>{typeof value === "number" ? n : value}</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: color, opacity: 0.18, fontSize: 18 }}><span style={{ opacity: 1/0.18, filter: "none" }}>{icon}</span></div>
      </div>
    </div>
  );
}

function ResourceCard({ resource, index }: any) {
  const router = useRouter();
  const grads = ["linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.04))","linear-gradient(135deg,rgba(34,211,238,0.1),rgba(99,102,241,0.04))","linear-gradient(135deg,rgba(236,72,153,0.1),rgba(139,92,246,0.04))","linear-gradient(135deg,rgba(245,158,11,0.1),rgba(99,102,241,0.04))"];
  const borders = ["rgba(139,92,246,0.2)","rgba(34,211,238,0.15)","rgba(236,72,153,0.15)","rgba(245,158,11,0.15)"];
  const glows = ["0 12px 40px rgba(139,92,246,0.15)","0 12px 40px rgba(34,211,238,0.12)","0 12px 40px rgba(236,72,153,0.12)","0 12px 40px rgba(245,158,11,0.12)"];
  return (
    <div onClick={() => router.push(`/${resource.name}`)} className="glass" style={{ padding: 20, cursor: "pointer", background: grads[index%4], borderColor: borders[index%4], transition: "all 0.25s", opacity: 0, animation: `fadeUp 0.5s ease ${0.1+index*0.07}s forwards` }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = glows[index%4]; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: borders[index%4], border: `1px solid ${borders[index%4]}` }}>🗄</div>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--text-muted)" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{resource.pluralLabel || resource.label || resource.name}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>{resource.fields?.filter((f:any)=>!f.hidden).length} fields</div>
      <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
        {["+ New","Import CSV"].map((lbl, i) => (
          <a key={i} href={i===0?`/${resource.name}/new`:`/${resource.name}?tab=import`} onClick={e=>e.stopPropagation()} style={{ flex:1, padding:"5px 8px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)", fontSize:11, color:"var(--text-muted)", textAlign:"center", textDecoration:"none", transition:"all 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")} onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>{lbl}</a>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { config, user } = useConfigStore();
  const router = useRouter();
  const [health, setHealth] = useState<any>(null);
  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    apiClient.health().then(setHealth).catch(()=>{});
  }, [user]);
  if (!config || !user) return null;
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return (
    <AppShell config={config}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 36, opacity: 0, animation: "fadeUp 0.6s ease 0.05s forwards" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-violet)", marginBottom: 6, fontFamily: "var(--font-display)" }}>ConfigRuntime Platform</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,4vw,34px)", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: 8 }}>
            {greeting}, <span className="gradient-text">{user.name || user.email.split("@")[0]}</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{config.description || `${config.resources.length} resources · ${config.features.length} features active`}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 32 }}>
          <StatCard label="Resources" value={config.resources.length} icon="🗄" color="rgba(139,92,246,1)" delay={0.1}/>
          <StatCard label="Fields" value={config.resources.reduce((a:number,r:any)=>a+r.fields.length,0)} icon="🔧" color="rgba(34,211,238,1)" delay={0.15}/>
          <StatCard label="Features" value={config.features.length} icon="⚡" color="rgba(236,72,153,1)" delay={0.2}/>
          <StatCard label="Auth Methods" value={config.auth.providers.length} icon="🔐" color="rgba(245,158,11,1)" delay={0.25}/>
        </div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Resources</h2>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{config.resources.length} configured</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
            {config.resources.map((r:any,i:number) => <ResourceCard key={r.name} resource={r} index={i}/>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="glass" style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginBottom: 14 }}>Active Features</div>
            {config.features.length === 0 ? <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No features enabled.</p> :
              config.features.map((f:any) => (
                <div key={f.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", marginBottom:6 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 6px #34d399" }}/>
                  <span style={{ fontSize:12, color:"var(--text-secondary)", flex:1 }}>{f.name}</span>
                  <span className="badge badge-green" style={{ fontSize:9 }}>ON</span>
                </div>
              ))}
          </div>
          <div className="glass" style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginBottom: 14 }}>System Status</div>
            {[{label:"API",v:health?"online":"checking",c:health?"#34d399":"#fbbf24"},{label:"Database",v:health?.db==="ok"?"connected":health?"error":"...",c:health?.db==="ok"?"#34d399":health?"#f87171":"#fbbf24"},{label:"Config",v:`v${config.configVersion}`,c:"#a78bfa"},{label:"Env",v:config.environment,c:config.environment==="production"?"#34d399":"#fbbf24"}].map(it=>(
              <div key={it.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", marginBottom:6 }}>
                <span style={{ fontSize:12, color:"var(--text-muted)" }}>{it.label}</span>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:it.c, boxShadow:`0 0 6px ${it.c}` }}/>
                  <span style={{ fontSize:11, color:it.c, textTransform:"capitalize" }}>{it.v}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {config.environment === "development" && (
          <div style={{ marginTop:18, padding:"12px 16px", borderRadius:"var(--radius)", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", display:"flex", alignItems:"center", gap:10, opacity:0, animation:"fadeIn 0.5s ease 0.5s forwards" }}>
            <span>⚡</span>
            <span style={{ fontSize:12, color:"var(--text-muted)" }}>Dev mode · <code style={{ background:"rgba(255,255,255,0.06)", padding:"1px 5px", borderRadius:4, fontSize:10 }}>config/app.config.json</code></span>
          </div>
        )}
      </div>
    </AppShell>
  );
}
