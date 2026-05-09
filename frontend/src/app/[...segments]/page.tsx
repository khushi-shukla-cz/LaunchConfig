"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConfigStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { DynamicTable } from "@/components/tables/DynamicTable";
import { DynamicForm } from "@/components/forms/DynamicForm";
import { CSVImport } from "@/components/features/CSVImport";
import { useResourceStore } from "@/lib/store";

export default function DynamicResourcePage() {
  const params = useParams();
  const router = useRouter();
  const { config, user } = useConfigStore();
  const [tab, setTab] = useState<"list"|"import">("list");

  const segments = Array.isArray(params.segments) ? params.segments : [params.segments].filter(Boolean) as string[];
  const resourceName = segments[0];
  const second = segments[1];
  const third = segments[2];
  const isNew = second==="new";
  const isEdit = third==="edit";
  const isDetail = !!second&&!isNew&&!isEdit&&!third;
  const isList = !second;
  const recordId = isEdit ? second : isDetail ? second : undefined;

  useEffect(() => { if (!user) router.push("/auth/login"); }, [user]);
  if (!config||!user) return null;

  const resource = config.resources.find(r=>r.name===resourceName);

  if (!resource) return (
    <AppShell config={config}>
      <div style={{ maxWidth:560, margin:"60px auto", textAlign:"center" }}>
        <div style={{ width:60, height:60, borderRadius:16, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 20px" }}>⚠️</div>
        <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:20, color:"var(--text-primary)", marginBottom:10 }}>Resource not found</h2>
        <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:24 }}>
          <code style={{ background:"rgba(255,255,255,0.06)", padding:"2px 6px", borderRadius:4, fontSize:12 }}>{resourceName}</code> is not defined in your config.
        </p>
        <button onClick={()=>router.push("/")} className="btn-ghost">← Go Home</button>
      </div>
    </AppShell>
  );

  const title = isNew ? `New ${resource.label}` : isEdit ? `Edit ${resource.label}` : isDetail ? resource.label : (resource.pluralLabel||resource.label);

  return (
    <AppShell config={config}>
      <div style={{ maxWidth:1100 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {(isNew||isEdit||isDetail)&&(
              <button onClick={()=>router.push(`/${resourceName}`)} style={{ width:32, height:32, borderRadius:"var(--radius-sm)", background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--text-muted)", transition:"all 0.15s", flexShrink:0 }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border-glow)"; (e.currentTarget as HTMLElement).style.color="var(--text-primary)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)"; (e.currentTarget as HTMLElement).style.color="var(--text-muted)";}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <div>
              <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18, color:"var(--text-primary)", lineHeight:1.2 }}>{title}</h1>
              {isList&&<p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{resource.fields.filter(f=>!f.hidden).length} fields · {resource.softDelete?"soft delete":"hard delete"}</p>}
            </div>
          </div>
          {isList&&(
            <div style={{ display:"flex", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden" }}>
              {["list","import"].map(t=>(
                <button key={t} onClick={()=>setTab(t as any)} style={{ padding:"6px 14px", fontSize:12, border:"none", cursor:"pointer", transition:"all 0.15s", fontFamily:"var(--font-display)", fontWeight:500,
                  background:tab===t?"rgba(139,92,246,0.15)":"transparent",
                  color:tab===t?"var(--accent-violet)":"var(--text-muted)" }}>
                  {t==="list"?"Records":"CSV Import"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {isList&&tab==="list"&&<DynamicTable resource={resource} onNew={()=>router.push(`/${resourceName}/new`)}/>}

        {isList&&tab==="import"&&(
          <div className="glass" style={{ padding:"24px" }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"var(--text-primary)", marginBottom:18 }}>Import {resource.pluralLabel||resource.name} from CSV</h2>
            <CSVImport resource={resource} onComplete={()=>setTab("list")}/>
          </div>
        )}

        {(isNew||isEdit)&&(
          <div className="glass" style={{ padding:"28px" }}>
            <FormView resourceName={resourceName} recordId={recordId} isEdit={isEdit} resource={resource}/>
          </div>
        )}

        {isDetail&&(
          <div className="glass" style={{ padding:"28px" }}>
            <DetailView resourceName={resourceName} recordId={recordId!} resource={resource}/>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FormView({ resourceName, recordId, isEdit, resource }: any) {
  const router = useRouter();
  const store = useResourceStore(resourceName);
  const [initial, setInitial] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [serverErrors, setServerErrors] = useState({});
  const [submitError, setSubmitError] = useState<string|null>(null);

  useEffect(() => {
    if (isEdit&&recordId) store.fetchOne(recordId).then((d:any)=>{ if(d) setInitial(d); setLoading(false); });
  }, [recordId]);

  if (loading) return <div style={{ display:"flex", flexDirection:"column", gap:14 }}>{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton" style={{ height:44, borderRadius:"var(--radius-sm)" }}/>)}</div>;

  const handleSubmit = async (data: Record<string,unknown>) => {
    setSubmitError(null); setServerErrors({});
    const r: any = isEdit&&recordId ? await store.update(recordId,data) : await store.create(data);
    if (r.success) router.push(`/${resourceName}`);
    else if (r.errors&&typeof r.errors==="object") setServerErrors(r.errors);
    else setSubmitError(r.error||"An error occurred");
  };

  return (
    <>
      {submitError&&<div style={{ marginBottom:18, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", fontSize:12, color:"#f87171" }}>{submitError}</div>}
      <DynamicForm resource={resource} initialData={initial} onSubmit={handleSubmit} onCancel={()=>router.push(`/${resourceName}`)} mode={isEdit?"edit":"create"} serverErrors={serverErrors}/>
    </>
  );
}

function DetailView({ resourceName, recordId, resource }: any) {
  const router = useRouter();
  const store = useResourceStore(resourceName);
  const [rec, setRec] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { store.fetchOne(recordId).then((d:any)=>{ setRec(d); setLoading(false); }); }, [recordId]);

  if (loading) return <div style={{ display:"flex", flexDirection:"column", gap:10 }}>{Array.from({length:5}).map((_,i)=><div key={i} className="skeleton" style={{ height:36, borderRadius:"var(--radius-sm)" }}/>)}</div>;
  if (!rec) return <p style={{ color:"var(--text-muted)", fontSize:13 }}>Record not found.</p>;

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px 28px", marginBottom:28 }}>
        {resource.fields.filter((f:any)=>!f.hidden).map((f:any)=>(
          <div key={f.name}>
            <dt style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:5 }}>{f.label||f.name}</dt>
            <dd style={{ fontSize:13, color:"var(--text-secondary)" }}>
              {rec[f.name]!==null&&rec[f.name]!==undefined
                ? f.type==="boolean" ? (rec[f.name]?"Yes":"No")
                  : f.type==="json" ? <pre style={{ fontFamily:"monospace", fontSize:11, background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", padding:"8px 10px", borderRadius:"var(--radius-sm)", overflowX:"auto" }}>{JSON.stringify(rec[f.name],null,2)}</pre>
                  : String(rec[f.name])
                : <span style={{ color:"var(--text-muted)", fontStyle:"italic" }}>—</span>
              }
            </dd>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, paddingTop:20, borderTop:"1px solid var(--border)" }}>
        <button onClick={()=>router.push(`/${resourceName}/${recordId}/edit`)} className="btn-primary" style={{ padding:"8px 18px" }}>Edit</button>
        <button onClick={()=>router.back()} className="btn-ghost">Back</button>
      </div>
    </div>
  );
}
