"use client";
import React, { useState, useRef, useCallback } from "react";
import { Resource } from "@shared/schemas/config.schema";
import { apiClient } from "@/lib/api/client";

interface Mapping { csvHeader: string; fieldName: string; }
type Step = "upload"|"map"|"importing"|"done"|"error";
interface State { step: Step; importId?: string; headers?: string[]; preview?: Record<string,string>[]; totalRows?: number; mappings: Mapping[]; result?: { successRows:number; errorRows:number; errors?:any[] }; error?: string; }

export function CSVImport({ resource, onComplete }: { resource: Resource; onComplete?: () => void }) {
  const [state, setState] = useState<State>({ step:"upload", mappings:[] });
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout|null>(null);

  const resourceFields = resource.fields.filter(f=>!f.hidden&&!f.readonly);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) { setState(s=>({...s,step:"error",error:"Only CSV files accepted"})); return; }
    setState(s=>({...s,step:"upload",error:undefined}));
    try {
      const r = await apiClient.uploadCSV(resource.name, file);
      if (!r.success) throw new Error((r as any).error||"Upload failed");
      const autoMap: Mapping[] = [];
      for (const h of (r as any).headers||[]) {
        const norm = (s:string) => s.toLowerCase().replace(/[\s_\-]/g,"");
        const match = resourceFields.find(f=>norm(f.name)===norm(h)||(f.label&&norm(f.label)===norm(h)));
        if (match) autoMap.push({ csvHeader:h, fieldName:match.name });
      }
      setState({ step:"map", importId:(r as any).importId, headers:(r as any).headers, preview:(r as any).preview, totalRows:(r as any).totalRows, mappings:autoMap });
    } catch(e:any) { setState(s=>({...s,step:"error",error:e.message})); }
  }, [resource]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleImport = async () => {
    if (!state.importId) return;
    setState(s=>({...s,step:"importing"}));
    const r = await apiClient.executeImport(resource.name, state.importId, state.mappings);
    if (!(r as any).success) { setState(s=>({...s,step:"error",error:(r as any).error})); return; }
    pollRef.current = setInterval(async () => {
      const s = await apiClient.getImportStatus(resource.name, state.importId!) as any;
      const d = s.data;
      if (d?.status==="done"||d?.status==="failed") {
        if (pollRef.current) clearInterval(pollRef.current);
        setState(prev=>({...prev,step:"done",result:{successRows:d.successRows,errorRows:d.errorRows,errors:d.errors}}));
        if (d.status==="done") onComplete?.();
      }
    }, 1500);
  };

  const reset = () => { if (pollRef.current) clearInterval(pollRef.current); setState({step:"upload",mappings:[]}); if (fileRef.current) fileRef.current.value=""; };

  const zone = (
    <div onDrop={handleDrop} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onClick={()=>fileRef.current?.click()}
      style={{ border:`2px dashed ${dragging?"var(--accent-violet)":"var(--border)"}`, borderRadius:"var(--radius)", padding:"48px 24px", textAlign:"center", cursor:"pointer", transition:"all 0.2s", background:dragging?"rgba(139,92,246,0.05)":"rgba(255,255,255,0.01)" }}>
      <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])}/>
      <div style={{ width:48, height:48, borderRadius:14, background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:22 }}>📊</div>
      <p style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)", marginBottom:4 }}>Drop your CSV file here</p>
      <p style={{ fontSize:11, color:"var(--text-muted)" }}>or click to browse · max 10MB</p>
    </div>
  );

  if (state.step==="upload"||state.step==="error") return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {zone}
      {state.error&&<div style={{ padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", fontSize:12, color:"#f87171" }}>{state.error}</div>}
      <div className="glass" style={{ padding:"14px 16px" }}>
        <p style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--text-muted)", marginBottom:10 }}>Expected fields for <strong style={{ color:"var(--text-primary)" }}>{resource.label||resource.name}</strong></p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {resourceFields.map(f=>(
            <span key={f.name} style={{ padding:"2px 8px", borderRadius:100, fontSize:11, fontWeight:500, background:f.required?"rgba(139,92,246,0.12)":"rgba(255,255,255,0.05)", color:f.required?"#a78bfa":"var(--text-muted)", border:`1px solid ${f.required?"rgba(139,92,246,0.2)":"var(--border)"}` }}>
              {f.label||f.name}{f.required?" *":""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (state.step==="map") {
    const reqFields = resourceFields.filter(f=>f.required);
    const mappedReq = reqFields.filter(f=>state.mappings.some(m=>m.fieldName===f.name));
    const canImport = mappedReq.length===reqFields.length;
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>Map Columns</p>
            <p style={{ fontSize:11, color:"var(--text-muted)" }}>{state.totalRows} rows · {state.mappings.length} of {state.headers?.length} mapped</p>
          </div>
          <button onClick={reset} className="btn-ghost" style={{ fontSize:11, padding:"5px 12px" }}>Start over</button>
        </div>
        {/* Preview table */}
        <div className="glass" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto", maxHeight:120 }}>
            <table style={{ width:"100%", fontSize:11, borderCollapse:"separate", borderSpacing:0 }}>
              <thead><tr>{state.headers?.map(h=><th key={h} style={{ padding:"6px 12px", textAlign:"left", color:"var(--text-muted)", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {state.preview?.slice(0,3).map((row,i)=>(
                  <tr key={i}>{state.headers?.map(h=><td key={h} style={{ padding:"5px 12px", color:"var(--text-secondary)", maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row[h]}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mappings */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {state.headers?.map(h=>{
            const cur = state.mappings.find(m=>m.csvHeader===h);
            return (
              <div key={h} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <code style={{ flex:1, padding:"6px 10px", borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", fontSize:11, color:"var(--text-secondary)", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h}</code>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color:"var(--text-muted)", flexShrink:0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                <select value={cur?.fieldName||""} onChange={e=>{const v=e.target.value; setState(s=>({ ...s, mappings:s.mappings.filter(m=>m.csvHeader!==h).concat(v?[{csvHeader:h,fieldName:v}]:[]) }));}}
                  style={{ flex:1, padding:"6px 10px", background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", borderRadius:6, fontSize:12, color:"var(--text-primary)", outline:"none", cursor:"pointer" }}>
                  <option value="" style={{ background:"var(--bg-deep)" }}>— Skip —</option>
                  {resourceFields.map(f=><option key={f.name} value={f.name} style={{ background:"var(--bg-deep)" }}>{f.label||f.name}{f.required?" *":""}</option>)}
                </select>
              </div>
            );
          })}
        </div>
        {!canImport&&(
          <div style={{ padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)", fontSize:12, color:"#fbbf24" }}>
            Map required fields: {reqFields.filter(f=>!mappedReq.includes(f)).map(f=>f.label||f.name).join(", ")}
          </div>
        )}
        <button onClick={handleImport} disabled={!canImport} className="btn-primary" style={{ width:"100%", justifyContent:"center", padding:"11px 22px" }}>
          Import {state.totalRows} Rows →
        </button>
      </div>
    );
  }

  if (state.step==="importing") return (
    <div style={{ padding:"60px 20px", textAlign:"center" }}>
      <div style={{ width:48, height:48, borderRadius:"50%", border:"3px solid rgba(139,92,246,0.2)", borderTopColor:"var(--accent-violet)", animation:"spin-slow 1s linear infinite", margin:"0 auto 16px" }}/>
      <p style={{ fontSize:13, fontWeight:500, color:"var(--text-primary)" }}>Importing records…</p>
      <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>This may take a moment</p>
    </div>
  );

  if (state.step==="done"&&state.result) {
    const { successRows, errorRows, errors } = state.result;
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ padding:"16px 18px", borderRadius:"var(--radius)", background:successRows>0?"rgba(52,211,153,0.07)":"rgba(248,113,113,0.07)", border:`1px solid ${successRows>0?"rgba(52,211,153,0.2)":"rgba(248,113,113,0.2)"}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:successRows>0?"rgba(52,211,153,0.15)":"rgba(248,113,113,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              {successRows>0?"✅":"❌"}
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>Import {successRows>0?"complete":"failed"}</p>
              <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{successRows} imported · {errorRows} failed</p>
            </div>
          </div>
        </div>
        {errors&&errors.length>0&&(
          <div className="glass" style={{ overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"#f87171" }}>Row Errors</div>
            <div style={{ maxHeight:160, overflowY:"auto" }}>
              {errors.slice(0,20).map((e:any,i:number)=>(
                <div key={i} style={{ padding:"8px 14px", borderBottom:"1px solid rgba(248,113,113,0.08)", fontSize:12 }}>
                  <span style={{ color:"#f87171", fontWeight:600 }}>Row {e.row}:</span>{" "}
                  <span style={{ color:"var(--text-muted)" }}>{Array.isArray(e.errors)?e.errors.join(", "):e.errors}</span>
                </div>
              ))}
              {errors.length>20&&<div style={{ padding:"8px 14px", fontSize:11, color:"var(--text-muted)" }}>…and {errors.length-20} more</div>}
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={reset} className="btn-ghost" style={{ flex:1, justifyContent:"center" }}>Import Another</button>
          {onComplete&&<button onClick={onComplete} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>View Records →</button>}
        </div>
      </div>
    );
  }

  return null;
}
