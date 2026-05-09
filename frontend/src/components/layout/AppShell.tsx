"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppConfig, UINavItem } from "@shared/schemas/config.schema";
import { useConfigStore } from "@/lib/store";
import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/core/Scene3D").then(m => ({ default: m.Scene3D })), { ssr: false });

const ICONS: Record<string, JSX.Element> = {
  database: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>,
  home: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  users: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  settings: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  chart: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
};

function NavItem({ item, depth = 0 }: { item: UINavItem; depth?: number }) {
  const pathname = usePathname();
  const { t } = useConfigStore();
  const [open, setOpen] = useState(false);
  const isActive = item.path ? pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path + "/")) : false;
  const label = item.i18nKey ? t(item.i18nKey) : item.label;

  if (item.children?.length) {
    return (
      <div>
        <button onClick={() => setOpen(!open)} className={`nav-item w-full ${depth > 0 ? "pl-8" : ""} ${isActive ? "active" : ""}`}>
          <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{ICONS[item.icon || "database"]}</span>
          <span className="flex-1 text-left text-xs">{label}</span>
          <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" style={{ transform: open ? "rotate(90deg)" : "", transition: "transform 0.2s", color: "var(--text-muted)" }}>
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
          </svg>
        </button>
        {open && <div className="mt-1 space-y-0.5">{item.children.map((c, i) => <NavItem key={i} item={c} depth={depth + 1} />)}</div>}
      </div>
    );
  }

  return (
    <Link href={item.path || "#"} className={`nav-item ${depth > 0 ? "pl-8" : ""} ${isActive ? "active" : ""}`}>
      <span style={{ color: isActive ? "var(--accent-violet)" : "var(--text-muted)", flexShrink: 0 }}>{ICONS[item.icon || "database"]}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
}

interface AppShellProps { children: React.ReactNode; config: AppConfig; }

export function AppShell({ children, config }: AppShellProps) {
  const { user, logout, t } = useConfigStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const currentTitle = config.ui.pages.find(p => {
    if (p.path === pathname) return true;
    const pat = p.path.replace(/\[.*?\]/g, "[^/]+");
    return new RegExp(`^${pat}$`).test(pathname);
  })?.title || config.ui.appName;

  const appInitial = (config.ui.appName || config.name || "C").charAt(0).toUpperCase();

  const Sidebar = (
    <aside style={{ display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,6,21,0.9)", backdropFilter: "blur(24px)", borderRight: "1px solid var(--border)" }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent-violet), var(--accent-indigo))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: "#fff",
            boxShadow: "0 0 20px rgba(139,92,246,0.4)",
          }}>{appInitial}</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.2 }}>{config.ui.appName || config.name}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.05em" }}>v{config.version}</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        <div style={{ marginBottom: 4 }} className="space-y-0.5">
          {config.ui.navigation.map((item, i) => <NavItem key={i} item={item} />)}
        </div>
        {user?.role === "admin" && (
          <>
            <div style={{ margin: "16px 0 6px 10px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>Admin</div>
            <div className="space-y-0.5">
              <NavItem item={{ label: "Features", path: "/admin/features", icon: "settings" }} />
              <NavItem item={{ label: "Export", path: "/admin/export", icon: "database" }} />
              <NavItem item={{ label: "Config", path: "/admin/config", icon: "settings" }} />
              <NavItem item={{ label: "Logs", path: "/admin/logs", icon: "chart" }} />
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
        {config.i18n.enabled && <div style={{ marginBottom: 8 }}><LanguageSwitcher config={config} /></div>}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff",
            }}>{(user.name || user.email).charAt(0).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email.split("@")[0]}</div>
              <div style={{ fontSize: 10, color: "var(--accent-violet)", textTransform: "capitalize" }}>{user.role}</div>
            </div>
            <button onClick={async () => { await logout(); router.push("/auth/login"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2, borderRadius: 4 }} title="Logout">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Scene3D />

      {/* Desktop sidebar */}
      <div style={{ position: "relative", zIndex: 10, width: 220, flexShrink: 0, display: "none" }} className="md:block" id="sidebar-desktop">
        <style>{`@media(min-width:768px){#sidebar-desktop{display:block!important;}}`}</style>
        {Sidebar}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="md:hidden">
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: "relative", width: 220, height: "100%" }}>{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 52, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
          background: scrolled ? "rgba(8,6,21,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "all 0.3s",
        }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }} className="md:hidden">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTitle}</span>
          </div>
          {/* Status dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 11 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
            <span>Live</span>
          </div>
        </header>

        {/* Content */}
        <main ref={mainRef} style={{ flex: 1, overflowY: "auto", padding: "24px 24px", position: "relative" }}>
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
