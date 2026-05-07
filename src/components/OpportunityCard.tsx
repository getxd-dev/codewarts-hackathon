import { ArrowUpRight } from "lucide-react";
import { SdgBadge } from "./SdgBadge";
import type { SdgTag } from "../types";

export function OpportunityCard({
  title,
  subtitle,
  details,
  sdg,
  metric,
}: {
  title: string;
  subtitle: string;
  details: string[];
  sdg: SdgTag[];
  metric?: string;
}) {
  return (
    <article className="rounded-lg border border-bayanihan-border bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-bayanihan-ink">{title}</h3>
          <p className="mt-1 text-sm text-bayanihan-muted">{subtitle}</p>
        </div>
        {metric ? (
          <span className="rounded-md bg-bayanihan-green/10 px-3 py-2 text-sm font-bold text-bayanihan-green">
            {metric}
          </span>
        ) : (
          <ArrowUpRight className="text-bayanihan-muted" size={20} aria-hidden="true" />
        )}
      </div>
      <ul className="space-y-2 text-sm text-bayanihan-muted">
        {details.map((detail) => (
          <li key={detail} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bayanihan-gold" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {sdg.map((tag) => (
          <SdgBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
