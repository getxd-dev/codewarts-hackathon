import type { DocumentType, OcrResult, UserProfile } from "../types";

const sampleTextByType: Record<DocumentType, string> = {
  Resume:
    "Resume text detected: typing, data entry, basic computer skills, email, school project records, volunteer experience, customer service exposure, and interest in remote entry-level work.",
  Certificate:
    "Certificate text detected: basic digital skills, computer literacy, online learning completion, attendance record, communication practice, and community training participation.",
  "School Record":
    "School record text detected: senior high school graduate, English communication, mathematics, report card, attention to detail, attendance, and adviser remarks.",
  "Handwritten Form":
    "Handwritten form text detected: low income household, shared device, limited internet access, wants work training, can type, can use mobile phone, needs resume and interview support.",
};

export async function extractTextFromDocument(
  file: File,
  documentType: DocumentType,
  profile?: UserProfile,
): Promise<OcrResult> {
  const readableText = await readPlainTextFile(file);
  const profileContext = profile
    ? ` Profile context: ${profile.educationLevel}, ${profile.employmentStatus}, ${profile.currentSkills}, interested in ${profile.careerInterest}, from ${profile.location}.`
    : "";
  const extractedText = readableText || `${sampleTextByType[documentType]} File name: ${file.name}.${profileContext}`;
  const confidence = readableText ? 94 : confidenceForType(documentType);

  await delay(700);

  return {
    extractedText,
    confidence,
    method: readableText ? "Direct text extraction" : "Mock OCR fallback for demo CV flow",
    detectedDocumentType: documentType,
    highlights: buildHighlights(extractedText),
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

function confidenceForType(documentType: DocumentType): number {
  switch (documentType) {
    case "Resume":
      return 88;
    case "Certificate":
      return 84;
    case "School Record":
      return 81;
    case "Handwritten Form":
      return 73;
  }
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
  ];
  const normalized = text.toLowerCase();

  return highlightTerms
    .filter((term) => normalized.includes(term.toLowerCase()))
    .slice(0, 5)
    .map((term) => term.replace(/\b\w/g, (letter) => letter.toUpperCase()));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
