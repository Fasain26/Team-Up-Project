import { type ReactNode } from "react";

/**
 * The brand panel + form layout used by both Login and Register.
 * On mobile the brand panel hides; on desktop it's a full-height showcase.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      {/* Brand / showcase panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 120% at 0% 0%, #047857 0%, #0f1413 55%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <span className="font-display text-2xl font-bold tracking-tight">TeamUp</span>
          <div className="max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Find the people who finish what you start.
            </h1>
            <p className="mt-4 text-white/70">
              Match with students by skill, build teams for hackathons, startups,
              and research — and actually ship.
            </p>
          </div>
          <p className="text-sm text-white/50">A student collaboration platform.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
