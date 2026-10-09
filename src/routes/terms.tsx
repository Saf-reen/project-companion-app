import { createFileRoute } from "@tanstack/react-router";
import { Container, LegalDraftNotice, PageHeader } from "@/components/layout/Page";

const T = "Terms of Service — QRForge";
const D = "The terms that apply when you use the QRForge QR code generator.";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: () => (
    <Container>
      <PageHeader title="Terms of Service" />
      <LegalDraftNotice />
      <ol className="max-w-3xl list-decimal space-y-4 pl-5 text-muted-foreground">
        <li>You may generate up to five QR codes on the Free plan. Static codes you have created remain yours and do not expire.</li>
        <li>You are responsible for the content you encode. Do not create codes linking to illegal, harmful or deceptive content.</li>
        <li>Pro features are currently offered as a demonstration only. No subscription is sold and no payment is processed.</li>
        <li>The service is provided "as is" without warranties. Always test a code before printing it.</li>
      </ol>
    </Container>
  ),
});
