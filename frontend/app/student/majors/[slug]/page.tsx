import type { Metadata } from "next";
import MajorDetail from "./MajorDetail";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replaceAll("-", " ")} | Guidely`,
  };
}

export default async function MajorDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  return <MajorDetail slug={slug} initialData={null} error={false} />;
}
