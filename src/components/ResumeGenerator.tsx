import { Camera, CheckCircle2, FileText, RefreshCcw, ScanFace, ShieldCheck } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import type { GeneratedResume, UserProfile } from "../types";

type FaceStatus = "idle" | "searching" | "aligned" | "error";

type DetectedFace = {
  boundingBox: DOMRectReadOnly;
};

type FaceDetectorInstance = {
  detect: (source: CanvasImageSource) => Promise<DetectedFace[]>;
};

type FaceDetectorConstructor = new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => FaceDetectorInstance;

declare global {
  interface Window {
    FaceDetector?: FaceDetectorConstructor;
  }
}

interface ResumeForm {
  email: string;
  phone: string;
  targetRole: string;
  training: string;
  experience: string;
}

type CameraCheckKey = "face" | "lighting" | "centering" | "sharpness" | "stability";

interface CameraCheck {
  key: CameraCheckKey;
  label: string;
  passed: boolean;
  detail: string;
}

interface CameraReadiness {
  score: number;
  ready: boolean;
  method: string;
  summary: string;
  checks: CameraCheck[];
}

interface FrameMetrics {
  guideMean: number;
  guideContrast: number;
  edgeMean: number;
  massCenterX: number;
  massCenterY: number;
  guideMassRatio: number;
}

interface CameraSignature {
  centerX: number;
  centerY: number;
  size: number;
  luma: number;
  detail: number;
}

interface ReadinessHistory {
  lastSignature: CameraSignature | null;
  stableFrames: number;
}

const defaultTraining = "Basic digital skills, school projects, and community readiness activities";
const defaultExperience = "Assisted with school or community tasks that required communication, organization, and basic digital tools";
const stableFrameTarget = 2;

export function ResumeGenerator({
  profile,
  onUseResume,
}: {
  profile: UserProfile;
  onUseResume: (resume: GeneratedResume) => void;
}) {
  const [form, setForm] = useState<ResumeForm>(() => ({
    email: buildEmail(profile.name),
    phone: "",
    targetRole: profile.careerInterest || "Entry-level digital work",
    training: defaultTraining,
    experience: defaultExperience,
  }));
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faceStatus, setFaceStatus] = useState<FaceStatus>("idle");
  const [cameraMessage, setCameraMessage] = useState("Open camera and align your face inside the guide.");
  const [readiness, setReadiness] = useState<CameraReadiness>(() => createIdleReadiness());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readinessHistoryRef = useRef<ReadinessHistory>({ lastSignature: null, stableFrames: 0 });

  const resumeText = useMemo(() => buildResumeText(profile, form, Boolean(photoDataUrl)), [form, photoDataUrl, profile]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!stream || !videoRef.current) return undefined;

    let isActive = true;
    let intervalId: number | undefined;

    async function watchFace() {
      if (!videoRef.current || !isActive) return;

      const detector = window.FaceDetector ? new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 }) : null;
      setFaceStatus("searching");
      setReadiness(createCheckingReadiness(detector ? "Face detector" : "Local camera checks"));
      setCameraMessage(detector ? "Camera is checking face position and frame quality." : "Camera is checking light, focus, centering, and steadiness.");

      intervalId = window.setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) return;

        try {
          const result = detector
            ? await analyzeNativeCameraReadiness(detector, video, canvasRef.current, readinessHistoryRef.current)
            : analyzeLocalCameraReadiness(video, canvasRef.current, readinessHistoryRef.current);
          readinessHistoryRef.current = result.history;
          setReadiness(result.readiness);
          setFaceStatus(result.readiness.ready ? "aligned" : "searching");
          setCameraMessage(result.readiness.summary);
        } catch {
          const fallback = analyzeLocalCameraReadiness(video, canvasRef.current, readinessHistoryRef.current);
          readinessHistoryRef.current = fallback.history;
          setReadiness(fallback.readiness);
          setFaceStatus(fallback.readiness.ready ? "aligned" : "searching");
          setCameraMessage(fallback.readiness.summary);
        }
      }, 650);
    }

    void watchFace();

    return () => {
      isActive = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [stream]);

  useEffect(() => {
    return () => stopCamera(stream);
  }, [stream]);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setFaceStatus("error");
      setReadiness(createErrorReadiness("Camera access is not available in this browser."));
      setCameraMessage("Camera access is not available in this browser.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
      });
      setPhotoDataUrl("");
      setStream(mediaStream);
      setFaceStatus("searching");
      readinessHistoryRef.current = { lastSignature: null, stableFrames: 0 };
      setReadiness(createCheckingReadiness("Camera checks"));
      setCameraMessage("Camera is checking light, focus, centering, and steadiness.");
    } catch {
      setFaceStatus("error");
      setReadiness(createErrorReadiness());
      setCameraMessage("Camera permission was not granted. You can still upload an existing resume.");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.9));
    setFaceStatus("aligned");
    setReadiness(createCapturedReadiness());
    setCameraMessage("Applicant photo captured and attached to the generated resume.");
    stopCamera(stream);
    setStream(null);
  }

  function useGeneratedResume() {
    onUseResume({
      templateName: "OportuniPH beginner role preset",
      generatedText: resumeText,
      photoDataUrl,
      createdAt: new Date().toISOString(),
    });
  }

  const captureDisabled = !stream || !readiness.ready;

  return (
    <div className="rounded-lg border border-bayanihan-border bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-bayanihan-blue/10 text-bayanihan-blue">
          <FileText size={24} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-bayanihan-ink">Generate resume</h2>
          <p className="text-sm text-bayanihan-muted">Preset from profile, career target, and captured applicant photo</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <CameraPanel
            videoRef={videoRef}
            photoDataUrl={photoDataUrl}
            faceStatus={faceStatus}
            cameraMessage={cameraMessage}
            readiness={readiness}
            captureDisabled={captureDisabled}
            onOpenCamera={openCamera}
            onCapturePhoto={capturePhoto}
            onRetake={() => {
              setPhotoDataUrl("");
              void openCamera();
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Email" name="email" value={form.email} onChange={updateField} placeholder="candidate@email.com" />
            <TextField label="Phone" name="phone" value={form.phone} onChange={updateField} placeholder="09XX XXX XXXX" />
            <TextField label="Target role" name="targetRole" value={form.targetRole} onChange={updateField} className="sm:col-span-2" />
            <TextArea label="Training or education highlights" name="training" value={form.training} onChange={updateField} />
            <TextArea label="Experience or community work" name="experience" value={form.experience} onChange={updateField} />
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-bayanihan-border bg-bayanihan-mist p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-bayanihan-ink">Resume preview</h3>
                <p className="text-sm text-bayanihan-muted">Generated beginner-role format</p>
              </div>
              {photoDataUrl ? (
                <img src={photoDataUrl} alt="Captured applicant" className="h-16 w-16 rounded-md object-cover" />
              ) : null}
            </div>
            <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-md border border-bayanihan-border bg-white p-4 text-sm leading-7 text-bayanihan-ink">
              {resumeText}
            </pre>
          </div>

          <button
            type="button"
            onClick={useGeneratedResume}
            disabled={!photoDataUrl}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-bayanihan-green px-5 font-bold text-white transition hover:bg-bayanihan-red disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <ShieldCheck size={18} aria-hidden="true" />
            Use Generated Resume
          </button>
          {!photoDataUrl ? (
            <p className="mt-2 text-sm text-bayanihan-muted">Capture a face-aligned applicant photo before using this generated resume.</p>
          ) : null}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}

function CameraPanel({
  videoRef,
  photoDataUrl,
  faceStatus,
  cameraMessage,
  readiness,
  captureDisabled,
  onOpenCamera,
  onCapturePhoto,
  onRetake,
}: {
  videoRef: RefObject<HTMLVideoElement>;
  photoDataUrl: string;
  faceStatus: FaceStatus;
  cameraMessage: string;
  readiness: CameraReadiness;
  captureDisabled: boolean;
  onOpenCamera: () => void;
  onCapturePhoto: () => void;
  onRetake: () => void;
}) {
  const guideTone = faceStatus === "error" ? "border-red-300" : "border-white/85";
  const readinessTone = readiness.ready ? "bg-bayanihan-green" : "bg-bayanihan-blue";

  return (
    <div className="rounded-lg border border-bayanihan-border bg-slate-950 p-4 text-white">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-slate-900">
        {photoDataUrl ? (
          <img src={photoDataUrl} alt="Captured applicant preview" className="h-full w-full object-cover" />
        ) : (
          <video ref={videoRef} className="h-full w-full scale-x-[-1] object-cover" autoPlay playsInline muted />
        )}
        {!photoDataUrl ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className={`h-[72%] w-[58%] rounded-[50%] border-4 border-dashed ${guideTone} shadow-[0_0_0_999px_rgba(15,23,42,0.38)]`} />
          </div>
        ) : null}
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-black/55 px-3 py-2 text-sm font-bold">
          {faceStatus === "aligned" ? <CheckCircle2 size={16} aria-hidden="true" /> : <ScanFace size={16} aria-hidden="true" />}
          {readiness.ready ? "Ready to capture" : "Checking frame"}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-200">{cameraMessage}</p>

      <div className="mt-3 rounded-md bg-white/10 p-3">
        <div className="flex items-center justify-between gap-3 text-sm font-bold">
          <span>{readiness.method}</span>
          <span>{readiness.score}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
          <div className={`h-full rounded-full ${readinessTone} transition-all`} style={{ width: `${readiness.score}%` }} />
        </div>
        <div className="mt-3 grid gap-2">
          {readiness.checks.map((check) => (
            <div key={check.key} className="flex items-start gap-2 rounded-md bg-black/20 px-3 py-2">
              <span
                className={[
                  "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                  check.passed ? "bg-bayanihan-green" : "bg-slate-500",
                ].join(" ")}
                aria-hidden="true"
              />
              <span>
                <span className="block text-sm font-bold">{check.label}</span>
                <span className="block text-xs leading-5 text-slate-300">{check.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {photoDataUrl ? (
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-white/20 px-3 font-bold text-white transition hover:bg-white/10"
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Retake
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-white/20 px-3 font-bold text-white transition hover:bg-white/10"
            >
              <Camera size={16} aria-hidden="true" />
              Open Camera
            </button>
            <button
              type="button"
              onClick={onCapturePhoto}
              disabled={captureDisabled}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-bayanihan-green px-3 font-bold text-white transition hover:bg-bayanihan-red disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              Capture Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  className = "",
  ...props
}: {
  label: string;
  name: keyof ResumeForm;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-2 block text-sm font-bold text-bayanihan-ink">{label}</span>
      <input className="min-h-11 w-full rounded-md border border-bayanihan-border bg-white px-3 text-bayanihan-ink" {...props} />
    </label>
  );
}

function TextArea({
  label,
  ...props
}: {
  label: string;
  name: keyof ResumeForm;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="mb-2 block text-sm font-bold text-bayanihan-ink">{label}</span>
      <textarea className="min-h-24 w-full rounded-md border border-bayanihan-border bg-white px-3 py-3 text-bayanihan-ink" {...props} />
    </label>
  );
}

function buildResumeText(profile: UserProfile, form: ResumeForm, hasPhoto: boolean): string {
  const skills = profile.currentSkills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .join(", ");

  return [
    profile.name || "Applicant Name",
    `${profile.location} | ${form.phone || "Phone available on request"} | ${form.email || "Email available on request"}`,
    hasPhoto ? "Applicant photo: captured with face-alignment guide." : "Applicant photo: pending camera capture.",
    "",
    "CAREER TARGET",
    form.targetRole || profile.careerInterest || "Entry-level digital or customer support role",
    "",
    "PROFILE SUMMARY",
    `${profile.name || "The applicant"} is a ${profile.age}-year-old ${profile.educationLevel.toLowerCase()} from ${profile.location}. Current status: ${profile.employmentStatus}. Access context: ${profile.internetAccess.toLowerCase()} internet and ${profile.deviceAccess.toLowerCase()} device access.`,
    "",
    "CORE SKILLS",
    skills || "Basic digital skills, communication, willingness to learn",
    "",
    "TRAINING AND EDUCATION HIGHLIGHTS",
    form.training,
    "",
    "EXPERIENCE AND COMMUNITY WORK",
    form.experience,
    "",
    "TARGET OPPORTUNITY PATHWAY",
    `Interested in ${profile.careerInterest || form.targetRole}. Recommended starting pathway: entry-level roles that value ${skills || "basic digital readiness"} with short training support.`,
  ].join("\n");
}

function buildEmail(name: string): string {
  const handle = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
  return handle ? `${handle}@email.com` : "";
}

async function analyzeNativeCameraReadiness(
  detector: FaceDetectorInstance,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement | null,
  history: ReadinessHistory,
): Promise<{ readiness: CameraReadiness; history: ReadinessHistory }> {
  const metrics = readFrameMetrics(video, canvas);
  if (!metrics) return { readiness: createWarmingReadiness("Face detector"), history: resetHistory() };

  const faces = await detector.detect(video);
  const face = faces[0];
  const faceAligned = Boolean(face && faces.length === 1 && isFaceAligned(face.boundingBox, video.videoWidth, video.videoHeight));
  const lighting = checkLighting(metrics);
  const sharpness = checkSharpness(metrics);
  const signature = face
    ? signatureFromFace(face.boundingBox, video.videoWidth, video.videoHeight, metrics)
    : signatureFromMetrics(metrics);
  const stability = updateStability(history, signature, faceAligned && lighting.passed && sharpness.passed);

  const checks: CameraCheck[] = [
    {
      key: "face",
      label: "Face detection",
      passed: faceAligned,
      detail: getNativeFaceDetail(faces, video),
    },
    lighting,
    {
      key: "centering",
      label: "Centered in guide",
      passed: faceAligned,
      detail: faceAligned ? "Face is positioned inside the oval guide." : getFacePositionHint(face?.boundingBox, video.videoWidth, video.videoHeight),
    },
    sharpness,
    {
      key: "stability",
      label: "Hold steady",
      passed: stability.passed,
      detail: stability.passed ? "Frame is steady enough for capture." : "Hold still for a moment before capturing.",
    },
  ];

  return {
    readiness: buildReadiness("Face detector", checks, "Ready. Capture the applicant photo now."),
    history: stability.history,
  };
}

function analyzeLocalCameraReadiness(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement | null,
  history: ReadinessHistory,
): { readiness: CameraReadiness; history: ReadinessHistory } {
  const metrics = readFrameMetrics(video, canvas);
  if (!metrics) return { readiness: createWarmingReadiness("Local camera checks"), history: resetHistory() };

  const lighting = checkLighting(metrics);
  const centering = checkLocalCentering(metrics);
  const sharpness = checkSharpness(metrics);
  const basePass = lighting.passed && centering.passed && sharpness.passed;
  const stability = updateStability(history, signatureFromMetrics(metrics), basePass);
  const checks: CameraCheck[] = [
    {
      key: "face",
      label: "Face guide",
      passed: centering.passed,
      detail: centering.passed
        ? "A clear subject is centered in the oval guide."
        : "Move your face closer and keep it inside the oval guide.",
    },
    lighting,
    centering,
    sharpness,
    {
      key: "stability",
      label: "Hold steady",
      passed: stability.passed,
      detail: stability.passed ? "Frame is steady enough for capture." : "Hold still for a moment before capturing.",
    },
  ];

  return {
    readiness: buildReadiness("Local camera checks", checks, "Ready. Capture the applicant photo now."),
    history: stability.history,
  };
}

function readFrameMetrics(video: HTMLVideoElement, canvas: HTMLCanvasElement | null): FrameMetrics | null {
  if (!canvas || !video.videoWidth || !video.videoHeight) {
    return null;
  }

  const width = 192;
  const height = Math.max(144, Math.round((width / video.videoWidth) * video.videoHeight));
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.drawImage(video, 0, 0, width, height);
  const frame = context.getImageData(0, 0, width, height).data;
  const lumas = new Float32Array(width * height);
  let frameLumaSum = 0;
  let guidePixels = 0;
  let guideLumaSum = 0;
  let guideLumaSquared = 0;
  let outerPixels = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = frame[index];
      const green = frame[index + 1];
      const blue = frame[index + 2];
      const luma = 0.299 * red + 0.587 * green + 0.114 * blue;
      const pixel = y * width + x;
      lumas[pixel] = luma;
      frameLumaSum += luma;
      const inGuide = isInsideGuide(x, y, width, height);

      if (inGuide) {
        guidePixels += 1;
        guideLumaSum += luma;
        guideLumaSquared += luma * luma;
      } else if (x > width * 0.1 && x < width * 0.9 && y > height * 0.08 && y < height * 0.92) {
        outerPixels += 1;
      }
    }
  }

  if (!guidePixels || !outerPixels) {
    return null;
  }

  const frameMean = frameLumaSum / (width * height);
  const guideMean = guideLumaSum / guidePixels;
  const guideVariance = guideLumaSquared / guidePixels - guideMean * guideMean;
  const guideContrast = Math.sqrt(Math.max(0, guideVariance));
  let guideEdgeSum = 0;
  let guideEdgePixels = 0;
  let subjectMass = 0;
  let subjectMassX = 0;
  let subjectMassY = 0;
  let guideMass = 0;
  let outsideMass = 0;

  for (let y = 1; y < height; y += 1) {
    for (let x = 1; x < width; x += 1) {
      const pixel = y * width + x;
      const luma = lumas[pixel];
      const inGuide = isInsideGuide(x, y, width, height);
      const edge = Math.abs(luma - lumas[pixel - 1]) + Math.abs(luma - lumas[pixel - width]);
      const contrastWeight = Math.max(0, Math.abs(luma - frameMean) - 8) + Math.max(0, edge - 8) * 0.6;

      if (inGuide) {
        guideEdgeSum += edge;
        guideEdgePixels += 1;
        guideMass += contrastWeight;
      } else if (x > width * 0.08 && x < width * 0.92 && y > height * 0.06 && y < height * 0.94) {
        outsideMass += contrastWeight;
      }

      if (contrastWeight > 0) {
        subjectMass += contrastWeight;
        subjectMassX += x * contrastWeight;
        subjectMassY += y * contrastWeight;
      }
    }
  }

  return {
    guideMean,
    guideContrast,
    edgeMean: guideEdgePixels ? guideEdgeSum / guideEdgePixels : 0,
    massCenterX: subjectMass ? subjectMassX / subjectMass / width : 0.5,
    massCenterY: subjectMass ? subjectMassY / subjectMass / height : 0.5,
    guideMassRatio: guideMass + outsideMass ? guideMass / (guideMass + outsideMass) : 0,
  };
}

function createIdleReadiness(): CameraReadiness {
  return {
    score: 0,
    ready: false,
    method: "Camera readiness",
    summary: "Open camera and align your face inside the guide.",
    checks: createPendingChecks("Open the camera to start checking the frame."),
  };
}

function createCheckingReadiness(method: string): CameraReadiness {
  return {
    score: 0,
    ready: false,
    method,
    summary: "Camera is checking light, focus, centering, and steadiness.",
    checks: createPendingChecks("Checking camera frame."),
  };
}

function createWarmingReadiness(method: string): CameraReadiness {
  return {
    score: 0,
    ready: false,
    method,
    summary: "Camera is warming up. Keep your face inside the oval guide.",
    checks: createPendingChecks("Waiting for a usable video frame."),
  };
}

function createErrorReadiness(summary = "Camera permission was not granted. You can still upload an existing resume."): CameraReadiness {
  return {
    score: 0,
    ready: false,
    method: "Camera unavailable",
    summary,
    checks: createPendingChecks(summary),
  };
}

function createCapturedReadiness(): CameraReadiness {
  return {
    score: 100,
    ready: true,
    method: "Photo captured",
    summary: "Applicant photo captured and attached to the generated resume.",
    checks: [
      { key: "face", label: "Applicant photo", passed: true, detail: "Photo is attached to the resume preview." },
      { key: "lighting", label: "Lighting", passed: true, detail: "Captured frame passed the readiness check." },
      { key: "centering", label: "Centered in guide", passed: true, detail: "Applicant was centered before capture." },
      { key: "sharpness", label: "Sharpness", passed: true, detail: "Captured frame had enough visual detail." },
      { key: "stability", label: "Hold steady", passed: true, detail: "Frame was steady enough for capture." },
    ],
  };
}

function createPendingChecks(detail: string): CameraCheck[] {
  return [
    { key: "face", label: "Applicant framing", passed: false, detail },
    { key: "lighting", label: "Lighting", passed: false, detail },
    { key: "centering", label: "Centered in guide", passed: false, detail },
    { key: "sharpness", label: "Sharpness", passed: false, detail },
    { key: "stability", label: "Hold steady", passed: false, detail },
  ];
}

function buildReadiness(method: string, checks: CameraCheck[], readySummary: string): CameraReadiness {
  const passedCount = checks.filter((check) => check.passed).length;
  const ready = passedCount === checks.length;
  const firstFailed = checks.find((check) => !check.passed);

  return {
    score: Math.round((passedCount / checks.length) * 100),
    ready,
    method,
    summary: ready ? readySummary : firstFailed?.detail ?? "Adjust the camera frame before capture.",
    checks,
  };
}

function checkLighting(metrics: FrameMetrics): CameraCheck {
  const passed = metrics.guideMean >= 48 && metrics.guideMean <= 225 && metrics.guideContrast >= 10;
  let detail = "Lighting has enough face detail.";

  if (metrics.guideMean < 48) {
    detail = "Move into better light so the applicant is visible.";
  } else if (metrics.guideMean > 225) {
    detail = "Reduce glare or move away from very bright light.";
  } else if (metrics.guideContrast < 10) {
    detail = "Face needs clearer light; avoid flat shadows or backlight.";
  }

  return { key: "lighting", label: "Lighting", passed, detail };
}

function checkSharpness(metrics: FrameMetrics): CameraCheck {
  const passed = metrics.edgeMean >= 6.5 || metrics.guideContrast >= 24;
  return {
    key: "sharpness",
    label: "Sharpness",
    passed,
    detail: passed ? "Frame has enough edge detail." : "Hold the device still or move into clearer focus.",
  };
}

function checkLocalCentering(metrics: FrameMetrics): CameraCheck {
  const centered = metrics.massCenterX > 0.34 && metrics.massCenterX < 0.66 && metrics.massCenterY > 0.2 && metrics.massCenterY < 0.76;
  const fillsGuide = metrics.guideMassRatio >= 0.43;
  const passed = centered && fillsGuide && metrics.guideContrast >= 12;
  let detail = "Applicant is centered inside the oval guide.";

  if (!centered) {
    detail = "Move the applicant to the center of the oval guide.";
  } else if (!fillsGuide) {
    detail = "Move closer so the face fills more of the oval guide.";
  } else if (metrics.guideContrast < 12) {
    detail = "Use clearer light so the camera can separate the applicant from the background.";
  }

  return { key: "centering", label: "Centered in guide", passed, detail };
}

function updateStability(
  history: ReadinessHistory,
  signature: CameraSignature,
  basePass: boolean,
): { passed: boolean; history: ReadinessHistory } {
  if (!basePass) {
    return { passed: false, history: { lastSignature: signature, stableFrames: 0 } };
  }

  const movement = history.lastSignature ? signatureMovement(history.lastSignature, signature) : Number.POSITIVE_INFINITY;
  const stableFrames = movement < 0.085 ? history.stableFrames + 1 : 1;
  const nextHistory = { lastSignature: signature, stableFrames };

  return { passed: stableFrames >= stableFrameTarget, history: nextHistory };
}

function resetHistory(): ReadinessHistory {
  return { lastSignature: null, stableFrames: 0 };
}

function signatureMovement(previous: CameraSignature, next: CameraSignature): number {
  const position = Math.hypot(previous.centerX - next.centerX, previous.centerY - next.centerY);
  const size = Math.abs(previous.size - next.size);
  const luma = Math.abs(previous.luma - next.luma) / 255;
  const detail = Math.abs(previous.detail - next.detail) / 120;
  return position * 1.8 + size * 0.9 + luma * 0.35 + detail * 0.2;
}

function signatureFromFace(
  box: DOMRectReadOnly,
  width: number,
  height: number,
  metrics: FrameMetrics,
): CameraSignature {
  return {
    centerX: width ? (box.x + box.width / 2) / width : 0.5,
    centerY: height ? (box.y + box.height / 2) / height : 0.5,
    size: width && height ? (box.width / width + box.height / height) / 2 : 0,
    luma: metrics.guideMean,
    detail: metrics.edgeMean,
  };
}

function signatureFromMetrics(metrics: FrameMetrics): CameraSignature {
  return {
    centerX: metrics.massCenterX,
    centerY: metrics.massCenterY,
    size: metrics.guideMassRatio,
    luma: metrics.guideMean,
    detail: metrics.edgeMean,
  };
}

function getNativeFaceDetail(faces: DetectedFace[], video: HTMLVideoElement): string {
  if (faces.length === 0) return "No face found yet. Move into the oval guide.";
  if (faces.length > 1) return "Only one applicant should be visible in the photo.";
  if (isFaceAligned(faces[0].boundingBox, video.videoWidth, video.videoHeight)) {
    return "One face found inside the guide.";
  }
  return getFacePositionHint(faces[0].boundingBox, video.videoWidth, video.videoHeight);
}

function getFacePositionHint(box: DOMRectReadOnly | undefined, width: number, height: number): string {
  if (!box || !width || !height) return "Move your face into the oval guide.";

  const centerX = (box.x + box.width / 2) / width;
  const centerY = (box.y + box.height / 2) / height;
  const faceWidth = box.width / width;
  const faceHeight = box.height / height;

  if (centerX < 0.34 || centerX > 0.66) return "Move toward the center of the oval guide.";
  if (centerY < 0.24) return "Move slightly lower in the frame.";
  if (centerY > 0.68) return "Move slightly higher in the frame.";
  if (faceWidth < 0.16 || faceHeight < 0.2) return "Move closer so your face fills the guide.";
  if (faceWidth > 0.58 || faceHeight > 0.72) return "Move a little farther from the camera.";
  return "Keep your face centered inside the guide.";
}

function isInsideGuide(x: number, y: number, width: number, height: number): boolean {
  const normalizedX = (x / width - 0.5) / 0.29;
  const normalizedY = (y / height - 0.47) / 0.37;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

function isFaceAligned(box: DOMRectReadOnly, width: number, height: number): boolean {
  if (!width || !height) return false;

  const centerX = (box.x + box.width / 2) / width;
  const centerY = (box.y + box.height / 2) / height;
  const faceWidth = box.width / width;
  const faceHeight = box.height / height;

  return centerX > 0.34 && centerX < 0.66 && centerY > 0.24 && centerY < 0.68 && faceWidth > 0.16 && faceWidth < 0.58 && faceHeight > 0.2 && faceHeight < 0.72;
}

function stopCamera(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
