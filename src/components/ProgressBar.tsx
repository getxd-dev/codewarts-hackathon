export function ProgressBar({
  label,
  value,
  max = 100,
  tone = "green",
}: {
  label: string;
  value: number;
  max?: number;
  tone?: "green" | "blue" | "gold" | "red";
}) {
  const width = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const colors = {
    green: "bg-bayanihan-green",
    blue: "bg-bayanihan-blue",
    gold: "bg-bayanihan-gold",
    red: "bg-bayanihan-red",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-bayanihan-ink">{label}</span>
        <span className="text-bayanihan-muted">{value}/{max}</span>
      </div>
      <div className="h-3 rounded-full bg-bayanihan-border">
        <div className={`h-3 rounded-full ${colors[tone]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
