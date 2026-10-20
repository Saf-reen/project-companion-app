import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/layout/Page";
import { ComparisonTable, PlanCards } from "@/components/pricing/Pricing";

const T = "Pricing — Free & Pro QR Plans | QRForge";
const D = "Five free QR generations in total, or go Pro for unlimited codes, dynamic QR, analytics and branding.";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: () => (
    <Container>
      <div className="text-center">
        <PageHeader title="Simple, honest pricing" subtitle="Free static codes never expire. Pro is in demo mode — no real payments are taken." />
      </div>
      <PlanCards />
      <h2 className="mb-4 mt-16 text-2xl font-bold">Compare plans</h2>
      <ComparisonTable />
    </Container>
  ),
});
