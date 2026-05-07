import { Buffer } from "node:buffer";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), geminiProxyPlugin(env)],
  };
});

function geminiProxyPlugin(env: Record<string, string>): Plugin {
  return {
    name: "bayanihan-gemini-proxy",
    configureServer(server) {
      server.middlewares.use("/api/gemini/analyze-document", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }

        const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          sendJson(res, 501, { error: "GEMINI_API_KEY is not configured." });
          return;
        }

        try {
          const payload = await readJsonBody(req);
          const model = env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.1-pro-preview";
          const prompt = buildDocumentPrompt(payload);
          const parts =
            String(payload.mimeType).startsWith("text/") || String(payload.mimeType).includes("csv")
              ? [
                  { text: prompt },
                  { text: Buffer.from(String(payload.base64), "base64").toString("utf8") },
                ]
              : [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: payload.mimeType || "application/octet-stream",
                      data: payload.base64,
                    },
                  },
                ];

          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseJsonSchema: documentSchema,
                },
              }),
            },
          );

          if (!geminiResponse.ok) {
            sendJson(res, geminiResponse.status, {
              error: "Gemini request failed.",
              detail: await geminiResponse.text(),
            });
            return;
          }

          const geminiJson = await geminiResponse.json();
          const text = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            sendJson(res, 502, { error: "Gemini returned no structured text." });
            return;
          }

          sendJson(res, 200, { ...JSON.parse(text), model });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : "Unexpected Gemini proxy error." });
        }
      });

      server.middlewares.use("/api/gemini/recommendations", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }

        const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          sendJson(res, 501, { error: "GEMINI_API_KEY is not configured." });
          return;
        }

        try {
          const payload = await readJsonBody(req);
          const model = env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.1-pro-preview";
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: buildRecommendationPrompt(payload) }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseJsonSchema: recommendationSchema,
                },
              }),
            },
          );

          if (!geminiResponse.ok) {
            sendJson(res, geminiResponse.status, {
              error: "Gemini recommendation request failed.",
              detail: await geminiResponse.text(),
            });
            return;
          }

          const geminiJson = await geminiResponse.json();
          const text = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            sendJson(res, 502, { error: "Gemini returned no recommendation text." });
            return;
          }

          sendJson(res, 200, { ...JSON.parse(text), model });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : "Unexpected Gemini recommendation error." });
        }
      });
    },
  };
}

function buildDocumentPrompt(payload: Record<string, unknown>): string {
  return [
    "You are an expert Filipino-market talent assessor.",
    "Analyze the uploaded resume accurately.",
    "Extract only information that is visible or explicitly stated in the resume.",
    "Do not invent names, schools, work history, skills, grades, income, or certifications.",
    "If text is unreadable or absent, say so in warnings and lower confidence.",
    "Return concise JSON matching the schema.",
    "Upload mode: Resume only.",
    `File name: ${payload.fileName}`,
    `User profile context: ${JSON.stringify(payload.profile ?? {})}`,
  ].join("\n");
}

function buildRecommendationPrompt(payload: Record<string, unknown>): string {
  return [
    "You are a Filipino-market talent matching analyst.",
    "Use the resume analysis, profile, baseline score, and provided local market dataset.",
    "Rank only from the provided jobs, courses, and support programs. Do not invent opportunity names.",
    "Use only source URLs present in the provided dataset. If a support item has no URL, leave sourceUrl empty.",
    "Explain why each recommendation fits the candidate using resume evidence, skill gaps, access constraints, and Philippine market fit.",
    "Keep explanations practical, concise, and suitable for a hackathon demo.",
    `Payload JSON: ${JSON.stringify(payload)}`,
  ].join("\n");
}

const documentSchema = {
  type: "object",
  properties: {
    extractedText: {
      type: "string",
      description: "Readable text transcribed from the document. Include uncertain text only if marked as uncertain.",
    },
    confidence: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "Estimated confidence that the extracted text and signals reflect the document accurately.",
    },
    candidateName: {
      type: "string",
      description: "Candidate name only if clearly visible in the document, otherwise empty.",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description: "Skills clearly visible or strongly implied by listed work, school, or certificate evidence.",
    },
    educationSignals: {
      type: "array",
      items: { type: "string" },
      description: "Visible education level, school record, certificate, course, grade, or training signals.",
    },
    experienceSignals: {
      type: "array",
      items: { type: "string" },
      description: "Visible work, project, volunteer, internship, or role signals.",
    },
    warnings: {
      type: "array",
      items: { type: "string" },
      description: "Caveats about blurry pages, handwriting uncertainty, missing sections, or unsupported content.",
    },
  },
  required: ["extractedText", "confidence", "candidateName", "skills", "educationSignals", "experienceSignals", "warnings"],
};

const recommendationSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "One concise paragraph summarizing the candidate's readiness and best market direction.",
    },
    pathway: {
      type: "string",
      description: "A personalized opportunity pathway based on profile, resume, and local market data.",
    },
    nextSteps: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
    documentInsights: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
    topJobs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          matchPercentage: { type: "integer", minimum: 0, maximum: 100 },
          reason: { type: "string" },
          sourceLabel: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: ["title", "matchPercentage", "reason", "sourceLabel", "sourceUrl"],
      },
      minItems: 3,
      maxItems: 3,
    },
    topCourses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          relevancePercentage: { type: "integer", minimum: 0, maximum: 100 },
          reason: { type: "string" },
          sourceLabel: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: ["name", "relevancePercentage", "reason", "sourceLabel", "sourceUrl"],
      },
      minItems: 3,
      maxItems: 3,
    },
    topSupportPrograms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          relevancePercentage: { type: "integer", minimum: 0, maximum: 100 },
          reason: { type: "string" },
          sourceLabel: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: ["name", "relevancePercentage", "reason", "sourceLabel", "sourceUrl"],
      },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ["summary", "pathway", "nextSteps", "documentInsights", "topJobs", "topCourses", "topSupportPrograms"],
};

function readJsonBody(req: import("node:http").IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) {
        reject(new Error("Uploaded file payload is too large for the local Gemini proxy."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(JSON.parse(body)));
    req.on("error", reject);
  });
}

function sendJson(res: import("node:http").ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
