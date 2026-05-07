import { existsSync, readFileSync } from "node:fs";

const requiredPaths = [
  "AGENTS.md",
  "DESIGN.md",
  "README.md",
  "specs/bayanihan-bridge-mvp.md",
  "plans/PLAN_MVP.md",
  "docs/ARCHITECTURE.md",
  "pitch/PITCH_SCRIPT.md",
  "src/lib/opportunityEngine.ts",
];

const missing = requiredPaths.filter((path) => !existsSync(path));

if (missing.length > 0) {
  console.error(`Missing factory artifacts:\n${missing.map((path) => `- ${path}`).join("\n")}`);
  process.exit(1);
}

const readme = readFileSync("README.md", "utf8");
const requiredReadmeTerms = ["SDG 4", "SDG 8", "SDG 10", "SDG 11", "Demo Flow"];
const missingTerms = requiredReadmeTerms.filter((term) => !readme.includes(term));

if (missingTerms.length > 0) {
  console.error(`README is missing expected terms: ${missingTerms.join(", ")}`);
  process.exit(1);
}

console.log("Factory validation passed.");
