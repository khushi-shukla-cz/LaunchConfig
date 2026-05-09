"use client";
import React, { useState, useEffect } from "react";
import { useConfigStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/client";
import { ConfigParser } from "@shared/utils/config.engine";

export default function AdminConfigPage() {
  const { config, updateConfig } = useConfigStore();
  const [raw, setRaw] = useState("");
  const [errors, setErrors] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => { if (config) setRaw(JSON.stringify(config,null,2)); }, [config]);

  const validate = () => {
    try {
      const parsed = JSON.parse(raw);
      const parser = new ConfigParser();
      const result = parser.parse(parsed);
      setErrors(result.errors); setWarnings(result.warnings);
      return result;
    } catch(e:any) {
      setErrors([{ path:"root", message:"Invalid JSON: "+e.message, code:"INVALID_JSON", severity:"error" }]);
      setWarnings([]); return null;
    }
  };

  const handleApply = async () => {
    const result = validate();
    if (!result||result.errors.some((e:any)=>e.severity==="error")) return;
    setApplying(true);
    updateConfig(result.normalized);
    const r = await apiClient.post("/api/v1/config/reload",{}) as any;
    setApplying(false);
    if (r.success) { setSaved(true); setTimeout(()=>setSaved(false),3000); }
  };

  if (!config) return null;

  return (
    <AppShell config={config}>
      <div style={{ maxWidth:1000 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18, color:"var(--text-primary)" }}>Live Config Editor</h1>
            <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>Changes apply immediately · v{config.configVersion}</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={validate} className="btn-ghost" style={{ padding:"7px 16px", fontSize:12 }}>Validate</button>
            <button onClick={handleApply} disabled={applying} className="btn-primary" style={{ padding:"7px 16px", fontSize:12 }}>
              {applying?"Applying…":saved?"✅ Applied!":"Apply Changes"}
            </button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:14, alignItems:"start" }}>
          <textarea value={raw} onChange={e=>{setRaw(e.target.value);setErrors([]);setWarnings([]);}} spellCheck={false}
            style={{ width:"100%", height:600, background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"16px 18px", fontFamily:"monospace", fontSize:12, color:"var(--text-primary)", outline:"none", resize:"none", lineHeight:1.7 }}
            onFocus={e=>{e.target.style.borderColor="var(--accent-violet)"; e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.1)";}}
            onBlur={e=>{e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none";}}/>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {errors.length>0&&(
              <div className="glass" style={{ overflow:"hidden" }}>
                <div style={{ padding:"10px 14px", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"#f87171" }}>{errors.length} Error{errors.length>1?"s":""}</div>
                <div style={{ maxHeight:200, overflowY:"auto" }}>
                  {errors.map((e:any,i:number)=>(
                    <div key={i} style={{ padding:"10px 14px", borderBottom:"1px solid rgba(248,113,113,0.08)" }}>
                      <p style={{ fontSize:11, fontWeight:600, color:"#f87171" }}>{e.path}</p>
                      <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{e.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {warnings.length>0&&(
              <div className="glass" style={{ overflow:"hidden" }}>
                <div style={{ padding:"10px 14px", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"#fbbf24" }}>{warnings.length} Warning{warnings.length>1?"s":""}</div>
                <div style={{ maxHeight:160, overflowY:"auto" }}>
                  {warnings.map((w:any,i:number)=>(
                    <div key={i} style={{ padding:"10px 14px", borderBottom:"1px solid rgba(245,158,11,0.08)" }}>
                      <p style={{ fontSize:11, fontWeight:600, color:"#fbbf24" }}>{w.path}</p>
                      <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{w.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.length===0&&warnings.length===0&&(
              <div className="glass" style={{ padding:"16px", textAlign:"center" }}>
                <p style={{ fontSize:11, color:"var(--text-muted)" }}>Click Validate to check config</p>
              </div>
            )}
            <div className="glass" style={{ padding:"14px 16px" }}>
              <p style={{ fontSize:11, fontWeight:600, color:"var(--text-secondary)", marginBottom:10, fontFamily:"var(--font-display)" }}>Config Structure</p>
              {[["resources[]","data models"],["ui","pages + nav + theme"],["auth","providers + roles"],["i18n","translations"],["features[]","plugins"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", gap:8, marginBottom:7 }}>
                  <code style={{ fontSize:10, color:"var(--accent-cyan)", background:"rgba(34,211,238,0.08)", padding:"2px 5px", borderRadius:3, whiteSpace:"nowrap" }}>{k}</code>
                  <span style={{ fontSize:11, color:"var(--text-muted)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
