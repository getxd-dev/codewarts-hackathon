import type { DocumentType, OcrResult, UserProfile } from "../types";

interface GeminiDocumentResponse {
  extractedText: string;
  confidence: number;
  candidateName?: string;
  skills: string[];
  educationSignals: string[];
  experienceSignals: string[];
  warnings: string[];
  model: string;
}

interface GeminiDocumentFailure {
  error: string;
  detail?: string;
  status: number;
}

export async function extractTextFromDocument(
  file: File,
  documentType: DocumentType,
  profile?: UserProfile,
): Promise<OcrResult> {
  const geminiResult = await analyzeWithGemini(file, documentType, profile);
  if (geminiResult && "error" in geminiResult) {
    const readableText = await readPlainTextFile(file);
    if (readableText && geminiResult.status === 501) {
      return buildLocalTextResult(readableText, documentType);
    }

    return {
      extractedText: [
        "Gemini document analysis did not complete.",
        `Reason: ${geminiResult.error}`,
        geminiResult.detail ? `Details: ${trimDetail(geminiResult.detail)}` : "",
        `File received: ${file.name}`,
      ]
        .filter(Boolean)
        .join("\n"),
      confidence: 0,
      method: "Gemini request failed",
      detectedDocumentType: documentType,
      highlights: [],
      analyzer: "Gemini",
      warnings: [geminiResult.error],
    };
  }

  if (geminiResult) {
    const highlights = unique([
      ...geminiResult.skills,
      ...geminiResult.educationSignals,
      ...geminiResult.experienceSignals,
    ]).slice(0, 6);

    return {
      extractedText: geminiResult.extractedText.trim(),
      confidence: clampConfidence(geminiResult.confidence),
      method: "Gemini document analysis",
      detectedDocumentType: documentType,
      highlights,
      analyzer: "Gemini",
      model: geminiResult.model,
      candidateName: geminiResult.candidateName,
      warnings: geminiResult.warnings,
    };
  }

  const readableText = await readPlainTextFile(file);
  if (readableText) {
    return buildLocalTextResult(readableText, documentType);
  }

  const fallbackText = [
    "Gemini analysis is not configured, so this uploaded file was not interpreted.",
    `File received: ${file.name}`,
    "Resume analysis is the active upload mode.",
    "Set GEMINI_API_KEY in .env.local and restart npm run dev for accurate resume PDF or image analysis.",
  ].join("\n");

  return {
    extractedText: fallbackText,
    confidence: 0,
    method: "Gemini not configured",
    detectedDocumentType: documentType,
    highlights: [],
    analyzer: "Configuration required",
    warnings: ["No document content was inferred from the uploaded binary file."],
  };
}

async function analyzeWithGemini(
  file: File,
  documentType: DocumentType,
  profile?: UserProfile,
): Promise<GeminiDocumentResponse | GeminiDocumentFailure | null> {
  try {
    const base64 = await fileToBase64(file);
    const response = await fetch("/api/gemini/analyze-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || inferMimeType(file.name),
        base64,
        documentType,
        profile,
      }),
    });

    if (!response.ok) {
      const failure = (await response.json().catch(() => ({}))) as Partial<GeminiDocumentFailure>;
      return {
        error: failure.error ?? `Gemini proxy returned HTTP ${response.status}.`,
        detail: failure.detail,
        status: response.status,
      };
    }

    const result = (await response.json()) as GeminiDocumentResponse;
    if (!result.extractedText) return null;
    return result;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to reach the Gemini analysis endpoint.",
      status: 0,
    };
  }
}

function buildLocalTextResult(readableText: string, documentType: DocumentType): OcrResult {
  return {
    extractedText: readableText,
    confidence: 92,
    method: "Direct text extraction",
    detectedDocumentType: documentType,
    highlights: buildHighlights(readableText),
    analyzer: "Local text reader",
    warnings: [],
  };
}

function readPlainTextFile(file: File): Promise<string> {
  const isTextLike =
    file.type.startsWith("text/") ||
    file.name.toLowerCase().endsWith(".txt") ||
    file.name.toLowerCase().endsWith(".md") ||
    file.name.toLowerCase().endsWith(".csv");

  if (!isTextLike) return Promise.resolve("");

  return file.text().then((text) => text.trim());
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function inferMimeType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".md")) return "text/markdown";
  if (lower.endsWith(".csv")) return "text/csv";
  return "application/octet-stream";
}

function buildHighlights(text: string): string[] {
  const highlightTerms = [
    "Excel",
    "typing",
    "data entry",
    "computer literacy",
    "English communication",
    "email",
    "limited internet",
    "shared device",
    "resume",
    "customer service",
    "Google Sheets",
    "Canva",
  ];
  const normalized = text.toLowerCase();

  return highlightTerms
    .filter((term) => normalized.includes(term.toLowerCase()))
    .slice(0, 6)
    .map((term) => term.replace(/\b\w/g, (letter) => letter.toUpperCase()));
}

function clampConfidence(confidence: number): number {
  return Math.max(0, Math.min(100, Math.round(confidence)));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function trimDetail(detail: string): string {
  return detail.length > 600 ? `${detail.slice(0, 600)}...` : detail;
}
