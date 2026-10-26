"use client";

/** Plain card shell — tilt/zoom removed per Hannah's feedback (Nov 2026).
 *  Keeps the same bordered panel look, no motion on hover. */
export default function TiltCard({
  children,
  className = "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  max,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  return (
    <div className={className}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-line bg-coal">
        {children}
      </div>
    </div>
  );
}
