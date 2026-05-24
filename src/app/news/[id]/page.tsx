import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsPostById } from "@/lib/queries";
import NewsArticle from "./NewsArticle";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getNewsPostById(id);
  return { title: post ? post.title : "News" };
}

export default async function NewsPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getNewsPostById(id);
  if (!post) notFound();
  return <NewsArticle post={post} />;
}
