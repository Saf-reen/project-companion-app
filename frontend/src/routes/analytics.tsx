import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Container, PageHeader, ProLocked } from "@/components/layout/Page";
import { Badge } from "@/components/ui/badge";
import { useUsage } from "@/hooks/use-app-state";
import { getDemoAnalytics } from "@/services/analyticsService";

const T = "Scan Analytics (Demo) — QRForge Pro";
const D = "Preview the QRForge Pro analytics dashboard with sample scan, device and location data.";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: AnalyticsPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
const DemoTag = () => <Badge className="bg-pro text-pro-foreground hover:bg-pro">Demo Data</Badge>;

function AnalyticsPage() {
  const { plan } = useUsage();
  const data = useMemo(() => getDemoAnalytics(), []);
  return (
    <Container>
      <PageHeader
        title="Scan analytics"
        badge={<DemoTag />}
        subtitle="All figures below are sample data. QRForge does not currently track real scans — that requires dynamic QR redirects and a backend."
      />
      {plan === "free" ? (
        <ProLocked feature="Scan analytics" description="See how many people scan your dynamic QR codes, on which devices, and where. Available with Pro." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Total scans (14 days)">
            <p className="font-display text-5xl font-bold">{data.total.toLocaleString()}</p>
          </Card>
          <Card title="Scans over time" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.overTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Device types">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.devices} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
                  {data.devices.map((d, i) => <Cell key={d.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Top countries" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.geo} layout="vertical">
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="country" width={110} fontSize={11} />
                <Tooltip />
                <Bar dataKey="scans" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </Container>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 ${className ?? ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Demo Data</span>
      </div>
      {children}
    </div>
  );
}
