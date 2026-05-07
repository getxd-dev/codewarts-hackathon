import { BarChart3, BriefcaseBusiness, GraduationCap, Target, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "../components/MetricCard";
import { SectionHeader } from "../components/SectionHeader";
import { buildDashboardMetrics } from "../lib/opportunityEngine";
import { loadAnalysis } from "../lib/storage";

const pieColors = ["#dc2626", "#f59e0b", "#16a34a"];
const barColor = "#0f766e";
const matchColor = "#2563eb";

export function DashboardPage() {
  const metrics = buildDashboardMetrics(loadAnalysis() ?? undefined);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Data Science"
        title="Talent market dashboard"
        copy="Community metrics show how assessments can reveal readiness levels, skill gaps, role supply, course demand, and location needs."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total users assessed" value={metrics.totalUsers} icon={UsersRound} tone="green" />
        <MetricCard label="Average readiness score" value={metrics.averageScore} icon={Target} tone="gold" />
        <MetricCard label="Role matches generated" value={metrics.totalRoleMatches} icon={BriefcaseBusiness} tone="blue" />
        <MetricCard label="Course matches generated" value={metrics.totalCourseMatches} icon={GraduationCap} tone="green" />
        <MetricCard label="High-support users" value={metrics.highSupportUsers} icon={BarChart3} tone="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Users by readiness level">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={metrics.readinessChart} dataKey="value" nameKey="name" outerRadius={96} label>
                {metrics.readinessChart.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most common skill gaps">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.skillGapChart} layout="vertical" margin={{ left: 24, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={128} />
              <Tooltip />
              <Bar dataKey="value" fill={barColor} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Matching volume">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.matchChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill={matchColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Community and location insights">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.locationChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-bayanihan-border bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-xl font-bold text-bayanihan-ink">{title}</h2>
      {children}
    </section>
  );
}
