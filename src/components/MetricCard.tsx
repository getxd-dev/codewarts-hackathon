import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "green",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "green" | "blue" | "gold" | "red";
}) {
  const toneStyles = {
    green: "bg-bayanihan-green/10 text-bayanihan-green",
    blue: "bg-bayanihan-blue/10 text-bayanihan-blue",
    gold: "bg-bayanihan-gold/15 text-amber-700",
    red: "bg-bayanihan-red/10 text-bayanihan-red",
  };

  return (
    <div className="rounded-lg border border-bayanihan-border bg-white p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-md ${toneStyles[tone]}`}>
          <Icon size={22} aria-hidden="true" />
        </span>
        <div>
          <div className="text-2xl font-bold text-bayanihan-ink">{value}</div>
          <div className="text-sm text-bayanihan-muted">{label}</div>
        </div>
      </div>
    </div>
  );
}
