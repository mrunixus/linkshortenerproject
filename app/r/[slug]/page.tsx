import { getLinkBySlug } from "@/data/links";
import { redirect, notFound } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = await getLinkBySlug(slug);

  if (!link) {
    notFound();
  }

  redirect(link.originalUrl);
}
