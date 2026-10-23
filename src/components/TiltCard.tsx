"use client";

import { useRef, useState } from "react";

/** Card that tilts in 3D toward the cursor. Transform-only animation. */
export default function TiltCard({
  children,
  className = "",
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({
      rx: (0.5 - py) * max,
      ry: (px - 0.5) * max,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  }

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setT({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })}
        className="relative h-full w-full overflow-hidden rounded-2xl border border-line bg-coal"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? 1.015 : 1})`,
          transition: t.active ? "transform 80ms ease-out" : "transform 450ms cubic-bezier(.2,.8,.2,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: t.active ? 0.55 : 0,
            transition: "opacity 300ms ease",
            background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(244,236,220,0.14), transparent 55%)`,
          }}
        />
      </div>
    </div>
  );
}
