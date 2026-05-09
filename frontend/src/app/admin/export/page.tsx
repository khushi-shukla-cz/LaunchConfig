"use client";
import React, { useState } from "react";
import { useConfigStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function AdminExportPage() {
  const { config, user } = useConfigStore();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [override, setOverride] = useState("");
  const [overrideErr, setOverrideErr] = useState<string|null>(null);
  const [preview, setPreview] = useState<string[]|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [done, setDone] = useState(false);

  if (!config) return null;
  if (user?.role!=="admin") { router.push("/"); return null; }

  const handleExport = async () => {
    setExporting(true); setError(null); setDone(false);
    let cfg = config;
    if (override.trim()) {
      try { cfg = JSON.parse(override); setOverrideErr(null); }
      catch(e:any) { setOverrideErr("Invalid JSON: "+e.message); setExporting(false); return; }
    }
    try { await apiClient.downloadProjectZip(cfg as any); setDone(true); }
    catch(e:any) { setError(e.message); }
    finally { setExporting(false); }
  };

  const handlePreview = async () => {
    const r = await apiClient.get("/api/v1/export/github/preview") as any;
    if (r.success) setPreview(r.structure); else setError(r.error);
  };

  const features = [
    ["📁","Frontend","Next.js 14 App Router + TypeScript"],
    ["⚙️","Backend","Express + TypeScript REST API"],
    ["🗄","Database","Prisma + PostgreSQL schema"],
    ["🔐","Auth","JWT + Email/OTP flows"],
    ["📊","Resources",`${config.resources.length} resource modules`],
    ["📦","Config","Full app.config.json included"],
  ];

  return (
    <AppShell config={config}>
      <div style={{ maxWidth:780 }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18, color:"var(--text-primary)", marginBottom:6 }}>Export Project</h1>
          <p style={{ fontSize:13, color:"var(--text-muted)" }}>Generate a complete, runnable project from your config as a downloadable ZIP.</p>
        </div>

        {/* Features grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
          {features.map(([icon,label,desc])=>(
            <div key={label as string} className="glass" style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:18, marginBottom:8 }}>{icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-primary)", marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:11, color:"var(--text-muted)", lineHeight:1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Config override */}
        <div className="glass" style={{ padding:"20px 22px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <h2 style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", fontFamily:"var(--font-display)" }}>Config Override <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:400 }}>(optional)</span></h2>
            <button onClick={()=>setOverride(JSON.stringify(config,null,2))} className="btn-ghost" style={{ fontSize:11, padding:"4px 10px" }}>Load current</button>
          </div>
          <textarea value={override} onChange={e=>{setOverride(e.target.value);setOverrideErr(null);}} placeholder="Leave empty to export with current config…"
            rows={7} style={{ width:"100%", background:"rgba(255,255,255,0.03)", border:`1px solid ${overrideErr?"rgba(248,113,113,0.3)":"var(--border)"}`, borderRadius:"var(--radius-sm)", padding:"10px 14px", fontFamily:"monospace", fontSize:12, color:"var(--text-primary)", outline:"none", resize:"vertical" }}/>
          {overrideErr&&<p style={{ fontSize:11, color:"#f87171", marginTop:6 }}>{overrideErr}</p>}
        </div>

        {/* File tree preview */}
        {preview&&(
          <div className="glass" style={{ padding:"20px 22px", marginBottom:16 }}>
            <h2 style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", fontFamily:"var(--font-display)", marginBottom:12 }}>Project Structure</h2>
            <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:"var(--radius-sm)", padding:"16px 18px", maxHeight:200, overflowY:"auto", fontFamily:"monospace", fontSize:12 }}>
              {preview.map(f=>(
                <div key={f} style={{ color:"#a78bfa", lineHeight:1.8 }}>
                  {"  ".repeat(f.split("/").length-1)}<span style={{ color:"rgba(139,92,246,0.5)" }}>└─ </span>
                  <span style={{ color:f.endsWith(".ts")||f.endsWith(".tsx")?"#22d3ee":f.endsWith(".json")||f.endsWith(".prisma")?"#fbbf24":"#a78bfa" }}>{f.split("/").pop()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error&&<div style={{ marginBottom:14, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", fontSize:12, color:"#f87171" }}>{error}</div>}
        {done&&<div style={{ marginBottom:14, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(52,211,153,0.07)", border:"1px solid rgba(52,211,153,0.2)", fontSize:12, color:"#34d399" }}>✅ Project downloaded! Extract the ZIP and follow the README.</div>}

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handlePreview} className="btn-ghost" style={{ padding:"9px 18px", fontSize:12 }}>Preview Files</button>
          <button onClick={handleExport} disabled={exporting} className="btn-primary" style={{ padding:"9px 22px", fontSize:12, gap:8 }}>
            {exporting?(
              <><svg style={{ animation:"spin-slow 1s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Generating…</>
            ):<><svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download ZIP</>}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
