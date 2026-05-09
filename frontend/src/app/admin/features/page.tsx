"use client";
import React, { useState } from "react";
import { useConfigStore } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

const FEATURES = [
  { name:"csv-import", label:"CSV Import", icon:"📊", desc:"Upload CSV files, map columns, bulk import with row-level error reporting.", config:{} },
  { name:"i18n", label:"Multi-language", icon:"🌍", desc:"Runtime locale switching, config-driven translations, fallback chains.", config:{}, schema:[{key:"defaultLocale",label:"Default Locale",type:"text",default:"en"}] },
  { name:"github-export", label:"GitHub Export", icon:"📦", desc:"Generate complete Next.js + Express + Prisma project as a ZIP.", config:{} },
  { name:"notifications", label:"Email Notifications", icon:"📧", desc:"Transactional emails for OTP, welcome messages, import completion.", config:{}, schema:[{key:"smtpHost",label:"SMTP Host",type:"text",default:""}] },
  { name:"audit-log", label:"Audit Log", icon:"🔍", desc:"Track all mutations per user with timestamps, diffs, and IP addresses.", config:{ retentionDays:90 } },
  { name:"api-keys", label:"API Keys", icon:"🔑", desc:"Programmatic access via long-lived API keys as JWT alternatives.", config:{} },
];

export default function AdminFeaturesPage() {
  const { config, updateConfig, user } = useConfigStore();
  const router = useRouter();
  const [saving, setSaving] = useState<string|null>(null);
  const [cfgOverrides, setCfgOverrides] = useState<Record<string,Record<string,unknown>>>({});
  const [success, setSuccess] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  if (!config) return null;
  if (user?.role!=="admin") { router.push("/"); return null; }

  const enabled = new Set(config.features.map(f=>f.name));

  const toggle = async (feat: typeof FEATURES[0], enable: boolean) => {
    setSaving(feat.name); setError(null); setSuccess(null);
    let updated = [...config.features];
    if (enable) updated.push({ name:feat.name, enabled:true, config:{ ...feat.config, ...(cfgOverrides[feat.name]||{}) } });
    else updated = updated.filter(f=>f.name!==feat.name);
    updateConfig({ ...config, features:updated } as any);
    const r = await apiClient.post("/api/v1/config/reload",{}) as any;
    setSaving(null);
    if (r.success) { setSuccess(`${feat.label} ${enable?"enabled":"disabled"}.`); setTimeout(()=>setSuccess(null),3500); }
    else setError(r.error||"Failed");
  };

  return (
    <AppShell config={config}>
      <div style={{ maxWidth:760 }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18, color:"var(--text-primary)" }}>Feature Management</h1>
          <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:4 }}>Toggle features on/off. Changes apply immediately to the running app.</p>
        </div>

        {success&&<div style={{ marginBottom:14, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(52,211,153,0.07)", border:"1px solid rgba(52,211,153,0.2)", fontSize:12, color:"#34d399" }}>✅ {success}</div>}
        {error&&<div style={{ marginBottom:14, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", fontSize:12, color:"#f87171" }}>{error}</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {FEATURES.map(feat=>{
            const on = enabled.has(feat.name);
            const saving_ = saving===feat.name;
            return (
              <div key={feat.name} className="glass glass-hover" style={{ padding:"18px 20px", borderColor:on?"var(--border-glow)":"var(--border)", background:on?"rgba(139,92,246,0.05)":"var(--bg-card)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:14, flex:1 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{feat.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontFamily:"var(--font-display)", fontWeight:600, fontSize:13, color:"var(--text-primary)" }}>{feat.label}</span>
                        {on&&<span className="badge badge-green" style={{ fontSize:9 }}>Active</span>}
                      </div>
                      <p style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.5 }}>{feat.desc}</p>
                    </div>
                  </div>
                  <button onClick={()=>toggle(feat,!on)} disabled={saving_}
                    style={{ padding:"6px 14px", borderRadius:"var(--radius-sm)", fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.2s", border:"1px solid", flexShrink:0,
                      background:on?"transparent":"rgba(139,92,246,0.15)",
                      borderColor:on?"var(--border)":"rgba(139,92,246,0.3)",
                      color:on?"var(--text-muted)":"var(--accent-violet)",
                      opacity:saving_?0.5:1 }}>
                    {saving_?"…":on?"Disable":"Enable"}
                  </button>
                </div>
                {on&&(
                  <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid var(--border)" }}>
                    <code style={{ fontSize:10, color:"var(--text-muted)", background:"rgba(255,255,255,0.04)", padding:"2px 8px", borderRadius:4 }}>
                      {JSON.stringify(config.features.find(f=>f.name===feat.name)?.config||{})}
                    </code>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop:20, padding:"16px 18px", borderRadius:"var(--radius)", background:"rgba(34,211,238,0.05)", border:"1px solid rgba(34,211,238,0.1)" }}>
          <p style={{ fontSize:12, fontWeight:600, color:"var(--accent-cyan)", marginBottom:6 }}>💡 Adding a custom feature</p>
          <p style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.6 }}>
            Implement <code style={{ background:"rgba(255,255,255,0.06)", padding:"1px 5px", borderRadius:3, fontSize:11 }}>PluginInterface</code> in{" "}
            <code style={{ background:"rgba(255,255,255,0.06)", padding:"1px 5px", borderRadius:3, fontSize:11 }}>backend/src/features/</code>{" "}
            and register it in{" "}
            <code style={{ background:"rgba(255,255,255,0.06)", padding:"1px 5px", borderRadius:3, fontSize:11 }}>plugins/registry.ts</code>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
