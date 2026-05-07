import { ArrowRight, FileSearch, ScanLine, UploadCloud } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { SectionHeader } from "../components/SectionHeader";
import { calculateOpportunityAnalysis } from "../lib/opportunityEngine";
import { extractTextFromDocument } from "../lib/ocr";
import { loadProfile, saveAnalysis, saveOcrResult } from "../lib/storage";
import type { DocumentType, OcrResult } from "../types";
import { demoProfile } from "../lib/demoProfile";

const documentTypes: DocumentType[] = ["Resume", "Certificate", "School Record", "Handwritten Form"];

export function UploadPage() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState<DocumentType>("Resume");
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const profile = loadProfile() ?? demoProfile;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setOcrResult(null);
  }

  function useSampleDocument() {
    const sample = new File(
      [
        "Resume: Mika Santos. Skills: typing, email, basic computer skills, data entry, Facebook page management. Interest: virtual assistant and data encoder. Needs Excel and interview readiness.",
      ],
      "sample-resume.txt",
      { type: "text/plain" },
    );
    setFile(sample);
    setDocumentType("Resume");
    setOcrResult(null);
  }

  async function handleExtract() {
    const uploadFile = file;
    if (!uploadFile) return;

    setIsExtracting(true);
    const result = await extractTextFromDocument(uploadFile, documentType, profile);
    const analysis = calculateOpportunityAnalysis(profile, result.extractedText);
    saveOcrResult(result);
    saveAnalysis(analysis);
    setOcrResult(result);
    setIsExtracting(false);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Computer Vision"
        title="Document upload and OCR"
        copy="Extract readable text from a resume, certificate, school record, or handwritten form, then generate a personalized pathway."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-bayanihan-blue/10 text-bayanihan-blue">
              <UploadCloud size={24} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-bayanihan-ink">Upload document</h2>
              <p className="text-sm text-bayanihan-muted">PDF, image, text file, certificate, or form</p>
            </div>
          </div>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-bold text-bayanihan-ink">Document type</span>
            <select
              className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3"
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value as DocumentType)}
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-bayanihan-green bg-bayanihan-green/5 px-4 py-8 text-center transition hover:bg-bayanihan-green/10">
            <ScanLine className="mb-3 text-bayanihan-green" size={34} aria-hidden="true" />
            <span className="font-bold text-bayanihan-ink">{file ? file.name : "Choose file"}</span>
            <span className="mt-2 text-sm text-bayanihan-muted">Text files are read directly; other files use mock OCR.</span>
            <input className="sr-only" type="file" accept=".txt,.md,.csv,.pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileChange} />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={useSampleDocument}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-bayanihan-border bg-white px-4 font-bold text-bayanihan-muted transition hover:border-bayanihan-green hover:text-bayanihan-green"
            >
              Use Sample
            </button>
            <button
              type="button"
              disabled={!file || isExtracting}
              onClick={handleExtract}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-bayanihan-green px-4 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <FileSearch size={18} aria-hidden="true" />
              {isExtracting ? "Extracting Text..." : "Run OCR"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-bayanihan-ink">Extracted signal</h2>
          {ocrResult ? (
            <div className="mt-5 space-y-5">
              <ProgressBar label={`${ocrResult.method} confidence`} value={ocrResult.confidence} tone="blue" />
              <div>
                <h3 className="mb-2 text-sm font-bold text-bayanihan-ink">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {ocrResult.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full bg-bayanihan-gold/15 px-3 py-1 text-sm font-semibold text-amber-700">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              <div className="max-h-72 overflow-auto rounded-md border border-bayanihan-border bg-bayanihan-mist p-4 text-sm leading-7 text-bayanihan-ink">
                {ocrResult.extractedText}
              </div>
              <button
                type="button"
                onClick={() => navigate("/results")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-bayanihan-blue px-5 font-bold text-white transition hover:bg-blue-800"
              >
                Generate Pathway
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-bayanihan-border bg-bayanihan-mist p-6">
              <p className="leading-7 text-bayanihan-muted">
                Upload or use the sample document, then run OCR to prepare the opportunity analysis.
              </p>
              <Link to="/assessment" className="mt-4 inline-flex font-bold text-bayanihan-green hover:text-teal-800">
                Edit assessment profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
