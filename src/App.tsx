import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const AssessmentPage = lazy(() => import("./pages/AssessmentPage").then((module) => ({ default: module.AssessmentPage })));
const UploadPage = lazy(() => import("./pages/UploadPage").then((module) => ({ default: module.UploadPage })));
const ResultsPage = lazy(() => import("./pages/ResultsPage").then((module) => ({ default: module.ResultsPage })));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage").then((module) => ({ default: module.OpportunitiesPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));

export default function App() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 text-bayanihan-muted">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
