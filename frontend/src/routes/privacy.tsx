import { createFileRoute } from "@tanstack/react-router";
import { Container, LegalDraftNotice, PageHeader } from "@/components/layout/Page";

const T = "Privacy Policy — QRForge";
const D = "How QRForge handles your data: QR codes are generated locally in your browser.";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: T }, { name: "description", content: D }, { property: "og:title", content: T }, { property: "og:description", content: D }] }),
  component: () => (
    <Container>
      <PageHeader title="Privacy Policy" />
      <LegalDraftNotice />
      <div className="max-w-3xl space-y-4 text-muted-foreground">
        <p><strong className="text-foreground">Local processing.</strong> QR codes are generated in your browser. The content you enter is not sent to our servers.</p>
        <p><strong className="text-foreground">Local storage.</strong> We store your free-generation count, demo plan setting and (in Pro demo) your QR history in your browser's local storage. You can clear it at any time from your browser settings.</p>
        <p><strong className="text-foreground">Advertising.</strong> The free plan may display advertisements in the future. Ad partners may use cookies; this policy will be updated before any ad network is enabled.</p>
        <p><strong className="text-foreground">Contact.</strong> Questions? Reach us via the contact page.</p>
      </div>
    </Container>
  ),
});
