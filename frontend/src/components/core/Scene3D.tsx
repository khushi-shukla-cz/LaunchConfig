"use client";
import { useEffect, useRef } from "react";

export function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: any;

    (async () => {
      // Dynamically import Three.js to avoid SSR issues
      THREE = await import("three").catch(() => null);
      if (!THREE) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // ── Particle nebula ────────────────────────────────────────────────────
      const particleCount = 2800;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const palette = [
        new THREE.Color("#8b5cf6"), // violet
        new THREE.Color("#6366f1"), // indigo
        new THREE.Color("#22d3ee"), // cyan
        new THREE.Color("#ec4899"), // pink
        new THREE.Color("#a78bfa"), // light violet
      ];

      for (let i = 0; i < particleCount; i++) {
        // Distribute in a sphere with clustering
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 8;

        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi) - 2;

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3]     = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2.5 + 0.5;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const particleMat = new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // ── Floating wireframe shapes ──────────────────────────────────────────
      const shapeMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });

      const icosaGeo = new THREE.IcosahedronGeometry(2.2, 1);
      const icosa = new THREE.Mesh(icosaGeo, shapeMat);
      scene.add(icosa);

      const torusGeo = new THREE.TorusGeometry(3, 0.4, 8, 60);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 3;
      scene.add(torus);

      // ── Small floating orbs ────────────────────────────────────────────────
      const orbColors = [0x8b5cf6, 0x22d3ee, 0xec4899];
      const orbs: any[] = [];
      for (let i = 0; i < 6; i++) {
        const orbGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 8, 8);
        const orbMat = new THREE.MeshBasicMaterial({
          color: orbColors[i % orbColors.length],
          transparent: true,
          opacity: 0.9,
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3
        );
        (orb as any)._offset = Math.random() * Math.PI * 2;
        (orb as any)._speed = 0.3 + Math.random() * 0.5;
        orbs.push(orb);
        scene.add(orb);
      }

      // ── Mouse parallax ─────────────────────────────────────────────────────
      let mouseX = 0, mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Resize ─────────────────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      // ── Animation loop ─────────────────────────────────────────────────────
      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        particles.rotation.y = t * 0.02;
        particles.rotation.x = t * 0.008;

        icosa.rotation.x = t * 0.04;
        icosa.rotation.y = t * 0.07;

        torus.rotation.z = t * 0.03;
        torus.rotation.y = t * 0.015;

        orbs.forEach((orb) => {
          orb.position.y += Math.sin(t * orb._speed + orb._offset) * 0.002;
          orb.position.x += Math.cos(t * orb._speed * 0.7 + orb._offset) * 0.001;
        });

        // Smooth camera parallax
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.04;
        camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    })();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
