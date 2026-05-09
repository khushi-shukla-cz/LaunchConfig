"use client";
import React, { useState, useCallback } from "react";
import { Resource, Field } from "@shared/schemas/config.schema";
import { useConfigStore } from "@/lib/store";

function FieldInput({ field, value, onChange, error, disabled }: { field: Field; value: unknown; onChange: (n: string, v: unknown) => void; error?: string; disabled?: boolean }) {
  const { t } = useConfigStore();
  const label = field.i18nKey ? t(field.i18nKey) : (field.label || field.name);
  const id = `field-${field.name}`;
  const isErr = !!error;

  const baseStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: isErr ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${isErr ? "rgba(248,113,113,0.4)" : "var(--border)"}`,
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-primary)",
    outline: "none", transition: "all 0.2s",
    opacity: disabled ? 0.5 : 1,
  };

  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.target as HTMLElement;
    el.style.borderColor = "var(--accent-violet)";
    el.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.15)";
    el.style.background = "rgba(255,255,255,0.06)";
  };
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.target as HTMLElement;
    el.style.borderColor = isErr ? "rgba(248,113,113,0.4)" : "var(--border)";
    el.style.boxShadow = "none";
    el.style.background = isErr ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.04)";
  };

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return <textarea id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} placeholder={field.placeholder} disabled={disabled||field.readonly} rows={4} onFocus={onFocus as any} onBlur={onBlur as any} style={{ ...baseStyle, resize:"vertical", fontFamily:"inherit" }}/>;

      case "boolean":
        return (
          <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
            <button type="button" role="switch" aria-checked={!!value} onClick={()=>onChange(field.name,!value)} disabled={disabled||field.readonly}
              style={{ width:40, height:22, borderRadius:11, border:"none", cursor:"pointer", transition:"all 0.25s", background: value ? "var(--accent-violet)" : "rgba(255,255,255,0.1)", position:"relative", flexShrink:0, boxShadow: value ? "0 0 12px rgba(139,92,246,0.5)" : "none" }}>
              <span style={{ position:"absolute", top:3, left: value ? 21 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
            </button>
            <span style={{ fontSize:12, color:"var(--text-secondary)" }}>{value ? "Yes" : "No"}</span>
          </label>
        );

      case "select":
        return (
          <select id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} disabled={disabled||field.readonly}
            onFocus={onFocus as any} onBlur={onBlur as any}
            style={{ ...baseStyle, appearance:"none", cursor:"pointer", backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(240,238,255,0.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}>
            <option value="" style={{ background:"var(--bg-deep)" }}>{field.placeholder||`Select ${label}…`}</option>
            {field.options?.map(o=>{ const v=typeof o==="string"?o:o.value; const l=typeof o==="string"?o:o.label; return <option key={v} value={v} style={{ background:"var(--bg-deep)" }}>{l}</option>; })}
          </select>
        );

      case "multiselect":
        const sel = Array.isArray(value)?value:[];
        return (
          <div style={{ border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"6px 8px", maxHeight:140, overflowY:"auto", background:"rgba(255,255,255,0.02)" }}>
            {field.options?.map(o=>{const v=typeof o==="string"?o:o.value; const l=typeof o==="string"?o:o.label; const on=sel.includes(v); return (
              <label key={v} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 6px", borderRadius:6, cursor:"pointer", transition:"background 0.15s" }} onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.04)")} onMouseLeave={e=>(e.currentTarget.style.background="")}>
                <div onClick={()=>onChange(field.name,on?sel.filter((x:string)=>x!==v):[...sel,v])} style={{ width:14, height:14, borderRadius:4, border:`1px solid ${on?"var(--accent-violet)":"var(--border)"}`, background:on?"var(--accent-violet)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s", boxShadow:on?"0 0 8px rgba(139,92,246,0.4)":"none", cursor:"pointer" }}>
                  {on&&<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </div>
                <span style={{ fontSize:12, color:"var(--text-secondary)" }}>{l}</span>
              </label>
            );})}
          </div>
        );

      case "date":
        return <input type="date" id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} disabled={disabled||field.readonly} onFocus={onFocus} onBlur={onBlur} style={{ ...baseStyle, colorScheme:"dark" }}/>;
      case "datetime":
        return <input type="datetime-local" id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} disabled={disabled||field.readonly} onFocus={onFocus} onBlur={onBlur} style={{ ...baseStyle, colorScheme:"dark" }}/>;
      case "number":
        return <input type="number" id={id} value={(value as number)??""} onChange={e=>onChange(field.name,e.target.valueAsNumber||null)} placeholder={field.placeholder} disabled={disabled||field.readonly} onFocus={onFocus} onBlur={onBlur} style={baseStyle}/>;
      case "password":
        return <input type="password" id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} placeholder={field.placeholder||"••••••••"} disabled={disabled||field.readonly} onFocus={onFocus} onBlur={onBlur} style={baseStyle}/>;
      case "email":
        return <input type="email" id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} placeholder={field.placeholder||"email@example.com"} disabled={disabled||field.readonly} onFocus={onFocus} onBlur={onBlur} style={baseStyle}/>;
      case "json":
        return <textarea id={id} value={typeof value==="string"?value:JSON.stringify(value,null,2)} onChange={e=>{try{onChange(field.name,JSON.parse(e.target.value));}catch{onChange(field.name,e.target.value);}}} placeholder="{}" disabled={disabled||field.readonly} rows={4} onFocus={onFocus as any} onBlur={onBlur as any} style={{ ...baseStyle, fontFamily:"monospace", fontSize:12, resize:"vertical" }}/>;
      default:
        return <input type="text" id={id} value={(value as string)||""} onChange={e=>onChange(field.name,e.target.value)} placeholder={field.placeholder} disabled={disabled||field.readonly} onFocus={onFocus} onBlur={onBlur} style={baseStyle}/>;
    }
  };

  if (field.hidden) return null;

  return (
    <div>
      <label htmlFor={field.type==="boolean"?undefined:id} style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color: error?"rgba(248,113,113,0.8)":"var(--text-muted)", marginBottom:7 }}>
        {label}{field.required&&<span style={{ color:"var(--accent-violet)", marginLeft:2 }}>*</span>}
      </label>
      {renderInput()}
      {field.helpText&&!error&&<p style={{ fontSize:11, color:"var(--text-muted)", marginTop:5 }}>{field.helpText}</p>}
      {error&&<p style={{ fontSize:11, color:"#f87171", marginTop:5 }}>{error}</p>}
    </div>
  );
}

interface DynamicFormProps {
  resource: Resource;
  initialData?: Record<string,unknown>;
  onSubmit: (data: Record<string,unknown>) => Promise<void>;
  onCancel?: () => void;
  mode?: "create"|"edit";
  isLoading?: boolean;
  serverErrors?: Record<string,string[]>;
}

export function DynamicForm({ resource, initialData={}, onSubmit, onCancel, mode="create", isLoading=false, serverErrors={} }: DynamicFormProps) {
  const [data, setData] = useState<Record<string,unknown>>(initialData);
  const [clientErrors, setClientErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((name: string, value: unknown) => {
    setData(p=>({...p,[name]:value}));
    setClientErrors(p=>{ const n={...p}; delete n[name]; return n; });
  }, []);

  const validate = () => {
    const errs: Record<string,string> = {};
    for (const f of resource.fields) {
      if (f.hidden||f.readonly) continue;
      const v = data[f.name];
      if (f.required&&(v===null||v===undefined||v==="")) errs[f.name]=`${f.label||f.name} is required`;
    }
    setClientErrors(errs);
    return Object.keys(errs).length===0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try { await onSubmit(data); } finally { setSubmitting(false); }
  };

  const visible = resource.fields.filter(f=>!f.hidden);
  const allErrors: Record<string,string> = { ...clientErrors };
  for (const [k,msgs] of Object.entries(serverErrors)) { if (!allErrors[k]) allErrors[k]=Array.isArray(msgs)?msgs[0]:msgs; }
  const busy = submitting||isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18, marginBottom:24 }}>
        {visible.map(f=>(
          <div key={f.name} style={f.type==="textarea"||f.type==="json"?{ gridColumn:"1/-1" }:{}}>
            <FieldInput field={f} value={data[f.name]??f.defaultValue??""} onChange={handleChange} error={allErrors[f.name]} disabled={busy}/>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10, paddingTop:4 }}>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy?(
            <span style={{ display:"flex", alignItems:"center", gap:8 }}>
              <svg style={{ animation:"spin-slow 1s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Saving…
            </span>
          ): mode==="create"?"Create →":"Save Changes →"}
        </button>
        {onCancel&&<button type="button" onClick={onCancel} disabled={busy} className="btn-ghost">Cancel</button>}
      </div>
    </form>
  );
}
