"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useConfigStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

const CATS = ["all","config","validation","runtime","auth","api","db","feature","security"];
const LVLS = ["all","debug","info","warn","error"];
const LVL_COLORS: Record<string,string> = { debug:"var(--text-muted)", info:"var(--accent-cyan)", warn:"#fbbf24", error:"#f87171" };

export default function AdminLogsPage() {
  const { config, user } = useConfigStore();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [lvl, setLvl] = useState("all");
  const [auto, setAuto] = useState(false);

  if (user?.role!=="admin") { router.push("/"); return null; }

  const fetch = useCallback(async () => {
    const q = new URLSearchParams({ limit:"200" });
    if (cat!=="all") q.set("category",cat);
    if (lvl!=="all") q.set("level",lvl);
    const r = await apiClient.get(`/api/v1/logs?${q}`) as any;
    if (r.success) setLogs((r.data||[]).reverse());
    setLoading(false);
  }, [cat,lvl]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { if (!auto) return; const iv=setInterval(fetch,3000); return ()=>clearInterval(iv); }, [auto,fetch]);

  if (!config) return null;

  return (
    <AppShell config={config}>
      <div style={{ maxWidth:1100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18, color:"var(--text-primary)" }}>System Logs</h1>
            <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{logs.length} entries</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-muted)", cursor:"pointer" }}>
              <input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)} style={{ accentColor:"var(--accent-violet)" }}/>
              Auto-refresh
            </label>
            <button onClick={fetch} className="btn-ghost" style={{ padding:"6px 14px", fontSize:12 }}>Refresh</button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          {(["info","warn","error","debug"] as const).map(l=>(
            <button key={l} onClick={()=>setLvl(lvl===l?"all":l)}
              className="glass glass-hover"
              style={{ padding:"14px 16px", textAlign:"center", cursor:"pointer", borderColor:lvl===l?"var(--border-glow)":"var(--border)", background:lvl===l?"rgba(139,92,246,0.08)":"var(--bg-card)" }}>
              <p style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:24, color:LVL_COLORS[l] }}>{logs.filter(x=>x.level===l).length}</p>
              <p style={{ fontSize:11, color:"var(--text-muted)", textTransform:"capitalize", marginTop:2 }}>{l}</p>
            </button>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          <div style={{ display:"flex", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden" }}>
            {LVLS.map(l=>(
              <button key={l} onClick={()=>setLvl(l)} style={{ padding:"5px 10px", fontSize:11, border:"none", cursor:"pointer", fontFamily:"var(--font-display)", fontWeight:500, transition:"all 0.15s", textTransform:"capitalize",
                background:lvl===l?"rgba(139,92,246,0.15)":"transparent", color:lvl===l?"var(--accent-violet)":"var(--text-muted)" }}>{l}</button>
            ))}
          </div>
          <div style={{ display:"flex", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden" }}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"5px 9px", fontSize:11, border:"none", cursor:"pointer", transition:"all 0.15s",
                background:cat===c?"rgba(139,92,246,0.15)":"transparent", color:cat===c?"var(--accent-violet)":"var(--text-muted)" }}>{c}</button>
            ))}
          </div>
        </div>

        <div className="glass" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table className="data-table" style={{ fontFamily:"monospace" }}>
              <thead><tr>
                <th style={{ width:120 }}>Time</th>
                <th style={{ width:60 }}>Level</th>
                <th style={{ width:80 }}>Category</th>
                <th>Message</th>
                <th style={{ width:180 }}>Data</th>
              </tr></thead>
              <tbody>
                {loading ? Array.from({length:8}).map((_,i)=>(
                  <tr key={i}>{Array.from({length:5}).map((_,j)=><td key={j}><div className="skeleton" style={{ height:12, borderRadius:3, width:"80%" }}/></td>)}</tr>
                )) : logs.length===0 ? (
                  <tr><td colSpan={5} style={{ textAlign:"center", padding:"40px 20px", color:"var(--text-muted)", fontSize:12 }}>No logs match current filters</td></tr>
                ) : logs.map((log,i)=>(
                  <tr key={i} style={{ background:log.level==="error"?"rgba(248,113,113,0.03)":log.level==="warn"?"rgba(245,158,11,0.03)":"" }}>
                    <td style={{ fontSize:11, color:"var(--text-muted)", whiteSpace:"nowrap" }}>{new Date(log.ts).toLocaleTimeString()}</td>
                    <td><span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", color:LVL_COLORS[log.level]||"var(--text-muted)" }}>{log.level}</span></td>
                    <td style={{ color:"var(--accent-cyan)", fontSize:12 }}>{log.category}</td>
                    <td style={{ fontSize:12, maxWidth:360, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={log.message}>{log.message}</td>
                    <td style={{ fontSize:11, color:"var(--text-muted)", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={log.data?JSON.stringify(log.data):""}>
                      {log.data?JSON.stringify(log.data).slice(0,60):""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
