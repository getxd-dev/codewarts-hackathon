import { ArrowRight, BriefcaseBusiness, ClipboardList, Database, Home, Network, Upload } from "lucide-react";
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
      <header className="sticky top-0 z-30 border-b border-bayanihan-border bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-bayanihan-green text-white">
              <Network size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-bold">OportuniPH</span>
              <span className="block text-xs text-bayanihan-muted">Filipino talent marketplace</span>
            </span>
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
                      ? "bg-bayanihan-green text-white"
                      : "text-bayanihan-muted hover:bg-bayanihan-green/10 hover:text-bayanihan-ink",
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

      <footer className="border-t border-bayanihan-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-bayanihan-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>OportuniPH MVP. Local-first AI, CV, and marketplace demo.</p>
          <p>Built for Filipino-market screening, matching, employer offers, and skills pathways.</p>
        </div>
      </footer>
    </div>
  );
}
