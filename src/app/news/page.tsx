import type { Metadata } from "next";
import NewsClient from "./NewsClient";
import { getNewsPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Media",
  description: "Community updates, student highlights, and success stories.",
};

export default async function NewsPage() {
  const posts = await getNewsPosts();
  return <NewsClient posts={posts} />;
}
