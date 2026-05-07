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

const defaultTraining = "Basic digital skills, school projects, and community readiness activities";
const defaultExperience = "Assisted with school or community tasks that required communication, organization, and basic digital tools";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      setCameraMessage(detector ? "Align your face inside the guide." : "Local camera alignment active. Center your face inside the guide.");

      intervalId = window.setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) return;

        try {
          const aligned = detector
            ? await detectNativeFaceAlignment(detector, video)
            : estimateLocalFaceAlignment(video, canvasRef.current).aligned;
          setFaceStatus(aligned ? "aligned" : "searching");
          setCameraMessage(
            aligned
              ? "Face aligned. Hold steady and capture."
              : detector
                ? "Move your face into the oval guide."
                : estimateLocalFaceAlignment(video, canvasRef.current).hint,
          );
        } catch {
          const fallback = estimateLocalFaceAlignment(video, canvasRef.current);
          setFaceStatus(fallback.aligned ? "aligned" : "searching");
          setCameraMessage(fallback.aligned ? "Face aligned. Hold steady and capture." : fallback.hint);
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
      setCameraMessage("Align your face inside the guide.");
    } catch {
      setFaceStatus("error");
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

  const captureDisabled = !stream || faceStatus !== "aligned";

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
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-bayanihan-green px-5 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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
  captureDisabled,
  onOpenCamera,
  onCapturePhoto,
  onRetake,
}: {
  videoRef: RefObject<HTMLVideoElement>;
  photoDataUrl: string;
  faceStatus: FaceStatus;
  cameraMessage: string;
  captureDisabled: boolean;
  onOpenCamera: () => void;
  onCapturePhoto: () => void;
  onRetake: () => void;
}) {
  const guideTone = faceStatus === "aligned" ? "border-bayanihan-green" : faceStatus === "error" ? "border-red-400" : "border-white";

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
            <div className={`h-[72%] w-[58%] rounded-[50%] border-4 ${guideTone} shadow-[0_0_0_999px_rgba(15,23,42,0.38)]`} />
          </div>
        ) : null}
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-black/55 px-3 py-2 text-sm font-bold">
          {faceStatus === "aligned" ? <CheckCircle2 size={16} aria-hidden="true" /> : <ScanFace size={16} aria-hidden="true" />}
          {faceStatus === "aligned" ? "Face aligned" : "Face alignment"}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-200">{cameraMessage}</p>

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
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-bayanihan-green px-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-600"
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

async function detectNativeFaceAlignment(
  detector: FaceDetectorInstance,
  video: HTMLVideoElement,
): Promise<boolean> {
  const faces = await detector.detect(video);
  return faces.length === 1 && isFaceAligned(faces[0].boundingBox, video.videoWidth, video.videoHeight);
}

function estimateLocalFaceAlignment(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement | null,
): { aligned: boolean; hint: string } {
  if (!canvas || !video.videoWidth || !video.videoHeight) {
    return { aligned: false, hint: "Camera is warming up. Keep your face inside the oval guide." };
  }

  const width = 160;
  const height = Math.max(120, Math.round((width / video.videoWidth) * video.videoHeight));
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return { aligned: false, hint: "Camera frame could not be checked. Try again or upload a resume." };
  }

  context.drawImage(video, 0, 0, width, height);
  const frame = context.getImageData(0, 0, width, height).data;
  let guidePixels = 0;
  let guideSkinPixels = 0;
  let guideLumaSum = 0;
  let guideLumaSquared = 0;
  let outerPixels = 0;
  let outerLumaSum = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = frame[index];
      const green = frame[index + 1];
      const blue = frame[index + 2];
      const luma = 0.299 * red + 0.587 * green + 0.114 * blue;
      const normalizedX = (x / width - 0.5) / 0.28;
      const normalizedY = (y / height - 0.47) / 0.37;
      const inGuide = normalizedX * normalizedX + normalizedY * normalizedY <= 1;

      if (inGuide) {
        guidePixels += 1;
        guideLumaSum += luma;
        guideLumaSquared += luma * luma;
        if (isSkinLike(red, green, blue)) guideSkinPixels += 1;
      } else if (x > width * 0.1 && x < width * 0.9 && y > height * 0.08 && y < height * 0.92) {
        outerPixels += 1;
        outerLumaSum += luma;
      }
    }
  }

  if (!guidePixels || !outerPixels) {
    return { aligned: false, hint: "Move closer and center your face inside the oval guide." };
  }

  const guideMean = guideLumaSum / guidePixels;
  const outerMean = outerLumaSum / outerPixels;
  const guideVariance = guideLumaSquared / guidePixels - guideMean * guideMean;
  const guideContrast = Math.sqrt(Math.max(0, guideVariance));
  const skinRatio = guideSkinPixels / guidePixels;
  const subjectContrast = Math.abs(guideMean - outerMean);
  const aligned = (skinRatio > 0.08 && guideContrast > 18) || (skinRatio > 0.045 && subjectContrast > 14 && guideContrast > 12);

  if (aligned) {
    return { aligned: true, hint: "Face aligned. Hold steady and capture." };
  }

  if (guideMean < 35) {
    return { aligned: false, hint: "Move into better light, then center your face inside the guide." };
  }

  if (skinRatio < 0.045 && subjectContrast < 14) {
    return { aligned: false, hint: "Move closer so your face fills more of the oval guide." };
  }

  return { aligned: false, hint: "Keep your head centered inside the oval until the border turns green." };
}

function isSkinLike(red: number, green: number, blue: number): boolean {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  return red > 70 && green > 40 && blue > 25 && max - min > 12 && red > green * 0.9 && red > blue * 1.12;
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
