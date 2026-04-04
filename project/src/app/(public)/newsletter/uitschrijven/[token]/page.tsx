import { UnsubscribePage } from "@/components/public/UnsubscribePage";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function NewsletterUitschrijvenPage({ params }: PageProps) {
  const { token } = await params;
  return <UnsubscribePage token={token} />;
}
