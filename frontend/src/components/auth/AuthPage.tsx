"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useConfigStore } from "@/lib/store";
import dynamic from "next/dynamic";

function AuthOrb3DComponent() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    let id: number;
    (async () => {
      const T = await import("three").catch(() => null);
      if (!T) return;
      const renderer = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(360, 360);
      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(60, 1, 0.1, 100);
      cam.position.z = 3.5;
      const sphere = new T.Mesh(new T.SphereGeometry(1.1,64,64), new T.MeshBasicMaterial({ color:0x8b5cf6, wireframe:true, transparent:true, opacity:0.1 }));
      scene.add(sphere);
      const ring1 = new T.Mesh(new T.TorusGeometry(1.7,0.008,8,100), new T.MeshBasicMaterial({ color:0x8b5cf6, transparent:true, opacity:0.35 }));
      ring1.rotation.x = Math.PI/4; scene.add(ring1);
      const ring2 = new T.Mesh(new T.TorusGeometry(2.1,0.005,8,100), new T.MeshBasicMaterial({ color:0x22d3ee, transparent:true, opacity:0.2 }));
      ring2.rotation.x = -Math.PI/6; ring2.rotation.y = Math.PI/4; scene.add(ring2);
      const ring3 = new T.Mesh(new T.TorusGeometry(1.3,0.006,8,100), new T.MeshBasicMaterial({ color:0xec4899, transparent:true, opacity:0.15 }));
      ring3.rotation.x = Math.PI/2; scene.add(ring3);
      const dotGeo = new T.SphereGeometry(0.04,8,8);
      const dotCols = [0x8b5cf6,0x22d3ee,0xec4899,0xa78bfa,0x6366f1];
      const dots: any[] = [];
      for (let i=0;i<10;i++) {
        const d = new T.Mesh(dotGeo, new T.MeshBasicMaterial({ color: dotCols[i%dotCols.length] }));
        (d as any)._a = (i/10)*Math.PI*2; (d as any)._r = 1.7; (d as any)._tilt = i*0.3;
        dots.push(d); scene.add(d);
      }
      const pCount = 800; const pPos = new Float32Array(pCount*3);
      for (let i=0;i<pCount;i++) { pPos[i*3]=(Math.random()-0.5)*10; pPos[i*3+1]=(Math.random()-0.5)*10; pPos[i*3+2]=(Math.random()-0.5)*10; }
      const pGeo = new T.BufferGeometry(); pGeo.setAttribute("position", new T.BufferAttribute(pPos,3));
      scene.add(new T.Points(pGeo, new T.PointsMaterial({ size:0.014, color:0x8b5cf6, transparent:true, opacity:0.4, blending:T.AdditiveBlending, depthWrite:false })));
      const clock = new T.Clock();
      const animate = () => {
        id = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        sphere.rotation.y = t*0.12; sphere.rotation.x = t*0.07;
        ring1.rotation.z = t*0.18; ring2.rotation.z = -t*0.13; ring3.rotation.y = t*0.22;
        dots.forEach(d => { const a=d._a+t*0.5; d.position.set(Math.cos(a)*d._r, Math.sin(a)*d._r*0.45, Math.sin(a*0.7)*0.4); });
        renderer.render(scene, cam);
      };
      animate();
    })();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{ width:280, height:280, opacity:0.9 }}/>;
}

const AuthOrb3D = dynamic(() => Promise.resolve(AuthOrb3DComponent), { ssr: false, loading: () => <div style={{ width:280, height:280 }}/> });

type Mode = "login"|"register"|"otp";

export function AuthPage() {
  const router = useRouter();
  const { login, register, config, user } = useConfigStore();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ email:"", password:"", name:"", code:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState("");

  const auth = config?.auth;
  useEffect(() => { if (user) router.push(auth?.redirectAfterLogin||"/"); }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => { setForm(p=>({...p,[k]:e.target.value})); setError(""); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const r = await login(form.email, form.password);
    setLoading(false);
    if (r.success) router.push(auth?.redirectAfterLogin||"/"); else setError(r.error||"Invalid credentials");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const r = await register(form.email, form.password, form.name||undefined);
    setLoading(false);
    if (r.success) { setSuccess("Account created! Sign in below."); setMode("login"); } else setError(r.error||"Registration failed");
  };

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { apiClient } = await import("@/lib/api/client");
    if (!otpSent) {
      const r = await apiClient.post("/api/v1/auth/otp/send",{email:form.email}) as any;
      setLoading(false);
      if (r.success) setOtpSent(true); else setError(r.error||"Failed");
    } else {
      const r = await apiClient.post("/api/v1/auth/otp/verify",{email:form.email,code:form.code}) as any;
      setLoading(false);
      if (r.success) { apiClient.setToken(r.data?.token||r.token); router.push(auth?.redirectAfterLogin||"/"); }
      else setError(r.error||"Invalid code");
    }
  };

  const providers = auth?.providers||["email"];
  const allowReg = auth?.allowRegistration!==false;
  const appName = config?.ui?.appName||config?.name||"ConfigRuntime";
  const appInitial = appName.charAt(0).toUpperCase();

  const inp = (label: string, k: string, type="text", placeholder="", opts: any={}) => (
    <div>
      <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:6 }}>{label}</label>
      <input className="field-input" type={type} value={(form as any)[k]} onChange={set(k)} placeholder={placeholder} {...opts}/>
    </div>
  );

  const spinStyle = { animation: "spin-slow 1s linear infinite" } as React.CSSProperties;

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg-void)", position:"relative", overflow:"hidden" }}>
      {/* Mesh bg */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,92,246,0.07), transparent 65%), radial-gradient(ellipse 50% 70% at 5% 80%, rgba(34,211,238,0.05), transparent 60%)"
      }}/>

      {/* Left 3D panel */}
      <div style={{ flex:1, display:"none", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px", position:"relative" }} className="lg-flex">
        <style>{`@media(min-width:1024px){.lg-flex{display:flex!important;}}`}</style>
        <div className="animate-float" style={{ position:"relative", marginBottom:24 }}>
          <AuthOrb3D/>
          <div style={{ position:"absolute", bottom:-30, left:"50%", transform:"translateX(-50%)", width:180, height:50, background:"radial-gradient(ellipse, rgba(139,92,246,0.45), transparent 70%)", filter:"blur(18px)" }}/>
        </div>
        <h2 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:26, color:"var(--text-primary)", textAlign:"center", marginBottom:10, lineHeight:1.2 }}>
          Build anything,<br/><span className="gradient-text">config-driven</span>
        </h2>
        <p style={{ fontSize:13, color:"var(--text-muted)", textAlign:"center", maxWidth:300, lineHeight:1.7, marginBottom:24 }}>
          Drop a JSON config. Get a fully working app — UI, APIs, database, auth, plugins — instantly.
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
          {["Config-driven","Zero hardcoding","Plugin system","CSV Import","i18n","GitHub Export"].map(t=>(
            <span key={t} className="badge badge-violet" style={{ fontSize:10 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width:"100%", maxWidth:420, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 28px", position:"relative", zIndex:10, borderLeft:"1px solid var(--border)" }}>
        <div style={{ width:"100%", maxWidth:340 }}>
          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,var(--accent-violet),var(--accent-indigo))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:800, fontSize:15, color:"#fff", boxShadow:"0 0 20px rgba(139,92,246,0.4)", flexShrink:0 }}>
              {appInitial}
            </div>
            <span style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"var(--text-primary)" }}>{appName}</span>
          </div>

          <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:22, color:"var(--text-primary)", marginBottom:6, lineHeight:1.2 }}>
            {mode==="login"?"Welcome back":mode==="register"?"Create account":"One-time sign in"}
          </h1>
          <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:24 }}>
            {mode==="login"?"Sign in to your account":mode==="register"?"Get started for free":"We'll email you a 6-digit code"}
          </p>

          {/* Tabs */}
          {providers.length>1 && (
            <div style={{ display:"flex", gap:3, padding:3, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", marginBottom:22 }}>
              {providers.includes("email") && (
                <button onClick={()=>setMode("login")} style={{ flex:1, padding:"6px 10px", borderRadius:7, fontSize:11, fontWeight:600, fontFamily:"var(--font-display)", cursor:"pointer", border:"none", background:mode!=="otp"?"rgba(255,255,255,0.09)":"transparent", color:mode!=="otp"?"var(--text-primary)":"var(--text-muted)", transition:"all 0.2s" }}>Password</button>
              )}
              {providers.includes("otp") && (
                <button onClick={()=>{setMode("otp");setOtpSent(false);}} style={{ flex:1, padding:"6px 10px", borderRadius:7, fontSize:11, fontWeight:600, fontFamily:"var(--font-display)", cursor:"pointer", border:"none", background:mode==="otp"?"rgba(255,255,255,0.09)":"transparent", color:mode==="otp"?"var(--text-primary)":"var(--text-muted)", transition:"all 0.2s" }}>Magic OTP</button>
              )}
            </div>
          )}

          {/* Alerts */}
          {error&&<div style={{ marginBottom:16, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", fontSize:12, color:"#f87171", lineHeight:1.5 }}>{error}</div>}
          {success&&<div style={{ marginBottom:16, padding:"10px 14px", borderRadius:"var(--radius-sm)", background:"rgba(52,211,153,0.07)", border:"1px solid rgba(52,211,153,0.2)", fontSize:12, color:"#34d399" }}>{success}</div>}

          {/* Email+password */}
          {(mode==="login"||mode==="register")&&(
            <form onSubmit={mode==="login"?handleLogin:handleRegister}>
              <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:18 }}>
                {mode==="register"&&inp("Name","name","text","Your name",{autoComplete:"name"})}
                {inp("Email","email","email","you@example.com",{required:true,autoComplete:"email"})}
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                    <label style={{ fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)" }}>Password</label>
                    {auth?.passwordPolicy&&<span style={{ fontSize:10, color:"var(--text-muted)" }}>min {auth.passwordPolicy.minLength} chars</span>}
                  </div>
                  <input className="field-input" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required autoComplete={mode==="login"?"current-password":"new-password"}/>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width:"100%", justifyContent:"center", padding:"11px 22px" }}>
                {loading?<><svg style={spinStyle} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>&nbsp;Please wait…</>:mode==="login"?"Sign In →":"Create Account →"}
              </button>
              {allowReg&&(
                <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:"var(--text-muted)" }}>
                  {mode==="login"?"No account? ":"Have an account? "}
                  <button type="button" onClick={()=>{setMode(mode==="login"?"register":"login");setError("");setSuccess("");}} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--accent-violet)", fontWeight:600, fontSize:12 }}>
                    {mode==="login"?"Register":"Sign in"}
                  </button>
                </p>
              )}
            </form>
          )}

          {/* OTP */}
          {mode==="otp"&&(
            <form onSubmit={handleOTP}>
              <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:18 }}>
                {inp("Email","email","email","you@example.com",{required:true,disabled:otpSent})}
                {otpSent&&(
                  <div>
                    <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:6 }}>6-digit code</label>
                    <input className="field-input" type="text" value={form.code} onChange={set("code")} placeholder="123456" required autoFocus style={{ letterSpacing:"0.35em", textAlign:"center", fontSize:20, fontFamily:"var(--font-display)" }}/>
                    <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:6 }}>Check your email · dev mode: check server logs</div>
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width:"100%", justifyContent:"center", padding:"11px 22px" }}>
                {loading?"Please wait…":otpSent?"Verify Code →":"Send Code →"}
              </button>
              {otpSent&&<button type="button" onClick={()=>setOtpSent(false)} className="btn-ghost" style={{ width:"100%", justifyContent:"center", marginTop:8 }}>← Different email</button>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
