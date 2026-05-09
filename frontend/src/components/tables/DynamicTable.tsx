"use client";
import React, { useEffect, useState } from "react";
import { Resource, Field } from "@shared/schemas/config.schema";
import { useResourceStore } from "@/lib/store";
import { useRouter } from "next/navigation";

function CellValue({ field, value }: { field: Field; value: unknown }) {
  if (value === null || value === undefined)
    return <span style={{ color:"var(--text-muted)", fontStyle:"italic", fontSize:12 }}>—</span>;

  switch (field.type) {
    case "boolean":
      return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"2px 8px", borderRadius:100, fontSize:11, fontWeight:500,
          background: value ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)",
          color: value ? "#34d399" : "var(--text-muted)",
          border: `1px solid ${value ? "rgba(52,211,153,0.2)" : "var(--border)"}` }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background: value?"#34d399":"var(--text-muted)", flexShrink:0 }}/>
          {value ? "Yes" : "No"}
        </span>
      );
    case "date":
      try { return <span style={{ fontSize:12 }}>{new Date(value as string).toLocaleDateString()}</span>; } catch { return <span>{String(value)}</span>; }
    case "datetime":
      try { return <span style={{ fontSize:12 }}>{new Date(value as string).toLocaleString()}</span>; } catch { return <span>{String(value)}</span>; }
    case "select":
      return <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:100, fontSize:11, fontWeight:500, background:"rgba(139,92,246,0.12)", color:"#a78bfa", border:"1px solid rgba(139,92,246,0.2)" }}>{String(value)}</span>;
    case "email":
      return <a href={`mailto:${value}`} style={{ color:"var(--accent-cyan)", fontSize:12, textDecoration:"none" }} onClick={e=>e.stopPropagation()}>{String(value)}</a>;
    case "json":
      return <code style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"monospace" }}>{JSON.stringify(value).slice(0,48)}…</code>;
    default:
      const s = String(value);
      return <span style={{ fontSize:13 }} title={s}>{s.length>52 ? s.slice(0,52)+"…" : s}</span>;
  }
}

interface DynamicTableProps {
  resource: Resource;
  onRowClick?: (r: any) => void;
  onNew?: () => void;
}

export function DynamicTable({ resource, onRowClick, onNew }: DynamicTableProps) {
  const store = useResourceStore(resource.name);
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const visible = resource.fields.filter(f=>!f.hidden).slice(0,6);
  const canEdit = resource.permissions?.update !== false;
  const canDelete = resource.permissions?.delete !== false;

  useEffect(() => { store.fetch(); }, [resource.name]);

  const handleSort = (name: string) => {
    if (!resource.sortable?.includes(name)) return;
    store.setSort(name, store.sortBy===name && store.sortOrder==="asc" ? "desc" : "asc");
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const r = await store.remove(id);
    if (!r.success) alert(r.error||"Delete failed");
    setDeleteId(null);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div style={{ position:"relative" }}>
          <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            type="text" value={store.search} onChange={e=>store.setSearch(e.target.value)}
            placeholder={`Search ${resource.pluralLabel||resource.name}…`}
            style={{ paddingLeft:34, paddingRight:14, paddingTop:8, paddingBottom:8, width:240, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", fontSize:12, color:"var(--text-primary)", outline:"none", transition:"all 0.2s" }}
            onFocus={e=>{e.target.style.borderColor="var(--accent-violet)"; e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.12)";}}
            onBlur={e=>{e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none";}}
          />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:11, color:"var(--text-muted)" }}>{store.total} record{store.total!==1?"s":""}</span>
          {onNew && (
            <button onClick={onNew} className="btn-primary" style={{ padding:"7px 16px", fontSize:12, gap:6 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
              New {resource.label}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {store.error && (
        <div style={{ padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", fontSize:12 }}>{store.error}</div>
      )}

      {/* Table */}
      <div className="glass" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="data-table" style={{ minWidth:560 }}>
            <thead>
              <tr>
                {visible.map(f=>(
                  <th key={f.name}
                    onClick={()=>handleSort(f.name)}
                    style={{ cursor: resource.sortable?.includes(f.name)?"pointer":"default", userSelect:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      {f.label}
                      {store.sortBy===f.name&&(
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color:"var(--accent-violet)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={store.sortOrder==="asc"?"M5 15l7-7 7 7":"M19 9l-7 7-7-7"}/>
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
                <th style={{ textAlign:"right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.loading ? (
                Array.from({length:5}).map((_,i)=>(
                  <tr key={i}>
                    {[...visible,{name:"_act"}].map(f=>(
                      <td key={f.name}><div className="skeleton" style={{ height:14, borderRadius:4, width: f.name==="_act"?"60px":"75%" }}/></td>
                    ))}
                  </tr>
                ))
              ) : store.records.length===0 ? (
                <tr>
                  <td colSpan={visible.length+1} style={{ textAlign:"center", padding:"52px 20px" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🗄</div>
                      <p style={{ fontSize:13, color:"var(--text-muted)" }}>No {resource.pluralLabel||resource.name} yet</p>
                      {onNew&&<button onClick={onNew} className="btn-ghost" style={{ fontSize:12, padding:"6px 14px" }}>+ Create first one</button>}
                    </div>
                  </td>
                </tr>
              ) : (
                store.records.map(rec=>(
                  <tr key={rec.id} onClick={()=>onRowClick?onRowClick(rec):router.push(`/${resource.name}/${rec.id}`)} style={{ cursor:"pointer" }}>
                    {visible.map(f=>(
                      <td key={f.name}><CellValue field={f} value={rec[f.name]}/></td>
                    ))}
                    <td onClick={e=>e.stopPropagation()}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4 }}>
                        {canEdit&&(
                          <button onClick={()=>router.push(`/${resource.name}/${rec.id}/edit`)}
                            style={{ padding:"5px 8px", borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text-muted)", fontSize:11, transition:"all 0.15s" }}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border-glow)"; (e.currentTarget as HTMLElement).style.color="var(--accent-violet)";}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)"; (e.currentTarget as HTMLElement).style.color="var(--text-muted)";}}>
                            Edit
                          </button>
                        )}
                        {canDelete&&(
                          deleteId===rec.id ? (
                            <div style={{ display:"flex", gap:4 }}>
                              <button onClick={e=>handleDelete(rec.id,e)} style={{ padding:"5px 8px", borderRadius:6, background:"rgba(248,113,113,0.15)", border:"1px solid rgba(248,113,113,0.3)", cursor:"pointer", color:"#f87171", fontSize:11 }}>Confirm</button>
                              <button onClick={e=>{e.stopPropagation();setDeleteId(null);}} style={{ padding:"5px 8px", borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text-muted)", fontSize:11 }}>Cancel</button>
                            </div>
                          ) : (
                            <button onClick={e=>{e.stopPropagation();setDeleteId(rec.id);}}
                              style={{ padding:"5px 8px", borderRadius:6, background:"transparent", border:"1px solid transparent", cursor:"pointer", color:"var(--text-muted)", fontSize:11, transition:"all 0.15s" }}
                              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(248,113,113,0.08)"; (e.currentTarget as HTMLElement).style.borderColor="rgba(248,113,113,0.2)"; (e.currentTarget as HTMLElement).style.color="#f87171";}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.borderColor="transparent"; (e.currentTarget as HTMLElement).style.color="var(--text-muted)";}}>
                              Delete
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {store.pages>1&&(
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:"var(--text-muted)" }}>Page {store.page} of {store.pages} · {store.total} records</span>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={()=>store.setPage(store.page-1)} disabled={store.page<=1}
              className="btn-ghost" style={{ padding:"5px 12px", fontSize:12, opacity:store.page<=1?0.4:1 }}>← Prev</button>
            {Array.from({length:Math.min(5,store.pages)},(_,i)=>{
              const p = store.page<=3 ? i+1 : store.page-2+i;
              if (p<1||p>store.pages) return null;
              return (
                <button key={p} onClick={()=>store.setPage(p)}
                  style={{ width:32, height:32, borderRadius:"var(--radius-sm)", border:"1px solid", fontSize:12, cursor:"pointer", transition:"all 0.15s",
                    borderColor: p===store.page?"var(--accent-violet)":"var(--border)",
                    background: p===store.page?"rgba(139,92,246,0.2)":"transparent",
                    color: p===store.page?"var(--accent-violet)":"var(--text-muted)" }}>
                  {p}
                </button>
              );
            })}
            <button onClick={()=>store.setPage(store.page+1)} disabled={store.page>=store.pages}
              className="btn-ghost" style={{ padding:"5px 12px", fontSize:12, opacity:store.page>=store.pages?0.4:1 }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
