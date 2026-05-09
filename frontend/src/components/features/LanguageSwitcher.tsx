"use client";
import React, { useEffect, useState } from "react";
import { AppConfig } from "@shared/schemas/config.schema";
import { useConfigStore } from "@/lib/store";

const LABELS: Record<string,string> = { en:"🇺🇸 EN", es:"🇪🇸 ES", fr:"🇫🇷 FR", de:"🇩🇪 DE", it:"🇮🇹 IT", pt:"🇵🇹 PT", ja:"🇯🇵 JA", zh:"🇨🇳 ZH", ar:"🇸🇦 AR", ru:"🇷🇺 RU", ko:"🇰🇷 KO", nl:"🇳🇱 NL" };

export function LanguageSwitcher({ config }: { config: AppConfig }) {
  const { locale, setLocale } = useConfigStore();
  const [open, setOpen] = useState(false);
  const supported = config.i18n.supportedLocales;

  useEffect(() => { setLocale(locale); }, []);

  if (supported.length<=1) return null;

  return (
    <div style={{ position:"relative" }}>
      <button onClick={()=>setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:6, width:"100%", padding:"6px 10px", borderRadius:"var(--radius-sm)", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", cursor:"pointer", fontSize:12, color:"var(--text-secondary)", transition:"all 0.15s" }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border-glow)"; (e.currentTarget as HTMLElement).style.color="var(--text-primary)";}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)"; (e.currentTarget as HTMLElement).style.color="var(--text-secondary)";}}>
        <span>{LABELS[locale]||locale.toUpperCase()}</span>
        <svg style={{ marginLeft:"auto", transition:"transform 0.2s", transform:open?"rotate(180deg)":"" }} width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
      </button>
      {open&&(
        <div style={{ position:"absolute", bottom:"calc(100% + 6px)", left:0, right:0, background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", padding:4, zIndex:50, animation:"fadeUp 0.15s ease" }}>
          {supported.map(code=>(
            <button key={code} onClick={()=>{setLocale(code);setOpen(false);}}
              style={{ display:"block", width:"100%", textAlign:"left", padding:"6px 10px", borderRadius:6, fontSize:12, cursor:"pointer", border:"none", transition:"all 0.15s",
                background:locale===code?"rgba(139,92,246,0.15)":"transparent",
                color:locale===code?"var(--accent-violet)":"var(--text-secondary)",
                fontWeight:locale===code?600:400 }}>
              {LABELS[code]||code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
