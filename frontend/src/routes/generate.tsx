import { createFileRoute } from "@tanstack/react-router";
import { AdSlot } from "@/components/ads/AdSlot";
import { Container, PageHeader } from "@/components/layout/Page";
import { QrGenerator } from "@/components/qr/QrGenerator";

const T = "QR Code Generator Workspace — QRForge";
const D = "Generate URL, text, Wi-Fi and WhatsApp QR codes with colors, size, margin and error correction controls.";

export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: () => (
    <Container>
      <PageHeader title="QR workspace" subtitle="Choose a type, fill in the details, customize and download." />
      <QrGenerator />
      <AdSlot slot="generate-footer" className="mt-12" />
    </Container>
  ),
});
