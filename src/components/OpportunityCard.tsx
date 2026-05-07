import { ArrowUpRight } from "lucide-react";

export function OpportunityCard({
  title,
  subtitle,
  details,
  metric,
  href,
  actionLabel = "View",
}: {
  title: string;
  subtitle: string;
  details: string[];
  metric?: string;
  href?: string;
  actionLabel?: string;
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
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-bayanihan-border px-3 text-sm font-bold text-bayanihan-green transition hover:border-bayanihan-green"
        >
          {actionLabel}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      ) : null}
    </article>
  );
}
