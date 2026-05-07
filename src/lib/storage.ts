import type { OcrResult, OpportunityAnalysis, UserProfile } from "../types";

const keys = {
  profile: "bayanihan.v2.profile",
  ocr: "bayanihan.v2.documentAnalysis",
  analysis: "bayanihan.v2.analysis",
};

export function saveProfile(profile: UserProfile): void {
  writeJson(keys.profile, profile);
}

export function loadProfile(): UserProfile | null {
  return readJson<UserProfile>(keys.profile);
}

export function saveOcrResult(result: OcrResult): void {
  writeJson(keys.ocr, result);
}

export function loadOcrResult(): OcrResult | null {
  return readJson<OcrResult>(keys.ocr);
}

export function saveAnalysis(result: OpportunityAnalysis): void {
  writeJson(keys.analysis, result);
}

export function loadAnalysis(): OpportunityAnalysis | null {
  return readJson<OpportunityAnalysis>(keys.analysis);
}

export function clearDemoState(): void {
  Object.values(keys).forEach((key) => window.localStorage.removeItem(key));
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readJson<T>(key: string): T | null {
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
