import { ArrowRight, BriefcaseBusiness, ClipboardList, Database, Home, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assessment", label: "Profile", icon: ClipboardList },
  { to: "/upload", label: "Analyze", icon: Upload },
  { to: "/results", label: "Matches", icon: ArrowRight },
  { to: "/opportunities", label: "Market", icon: Database },
  { to: "/dashboard", label: "Employers", icon: BriefcaseBusiness },
];

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-bayanihan-ink">
      <header className="sticky top-0 z-30 border-b border-bayanihan-gold/30 bg-bayanihan-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <NavLink to="/" className="flex items-center gap-3" aria-label="OportuniPH home">
            <span className="flex h-14 w-56 items-center overflow-hidden rounded-md bg-white px-3 shadow-soft sm:w-64">
              <img src="/oportuniph-logo.png" alt="OportuniPH" className="h-auto w-full object-contain" />
            </span>
            <span className="sr-only">Filipino talent marketplace</span>
          </NavLink>
          <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition",
                    isActive
                      ? "bg-bayanihan-blue text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
              >
                <item.icon size={16} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-bayanihan-gold/30 bg-bayanihan-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-white/70 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>OportuniPH MVP. Walang maiiwan sa laylayan.</p>
          <p>Local-first screening, matching, employer offers, and skills pathways.</p>
        </div>
      </footer>
    </div>
  );
}
