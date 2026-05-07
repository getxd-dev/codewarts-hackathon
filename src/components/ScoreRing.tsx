import type { CSSProperties } from "react";
import type { ReadinessLevel } from "../types";

const levelColor: Record<ReadinessLevel, string> = {
  "High support needed": "#dc2626",
  "Moderate support needed": "#f59e0b",
  "Opportunity-ready": "#16a34a",
};

export function ScoreRing({ score, level }: { score: number; level: ReadinessLevel }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="score-ring flex h-44 w-44 items-center justify-center rounded-full"
        style={{ "--score": score, "--ring-color": levelColor[level] } as CSSProperties}
        aria-label={`Opportunity score ${score} out of 100`}
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-bayanihan-ink">{score}</div>
          <div className="text-sm font-semibold text-bayanihan-muted">out of 100</div>
        </div>
      </div>
      <span className="mt-4 rounded-full border border-bayanihan-border bg-white px-4 py-2 text-sm font-semibold text-bayanihan-ink">
        {level}
      </span>
    </div>
  );
}
