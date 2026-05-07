import type { SdgTag } from "../types";

const sdgStyles: Record<SdgTag, string> = {
  "SDG 4": "border-bayanihan-red/30 bg-bayanihan-red/10 text-bayanihan-red",
  "SDG 8": "border-bayanihan-blue/30 bg-bayanihan-blue/10 text-bayanihan-blue",
  "SDG 10": "border-bayanihan-gold/40 bg-bayanihan-gold/10 text-amber-700",
  "SDG 11": "border-bayanihan-leaf/30 bg-bayanihan-leaf/10 text-bayanihan-leaf",
};

export function SdgBadge({ tag }: { tag: SdgTag }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${sdgStyles[tag]}`}>
      {tag}
    </span>
  );
}
