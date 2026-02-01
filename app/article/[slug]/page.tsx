import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, User, ChevronLeft } from "lucide-react";

import {
  fetchPost,
  getFeaturedImageUrl,
  getAuthorName,
  getPostCategories,
  formatDate,
  stripHtml,
} from "@/services/api";

import ShareButtons from "./ShareButtons";
import Sidebar from "@/components/Sidebar";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ NEXT.JS 15 FIX
  const { slug } = await params;

  const post = await fetchPost(slug);
  if (!post) notFound();

  const imageUrl = getFeaturedImageUrl(post);
  const authorName = getAuthorName(post);
  const categories = getPostCategories(post);
  const title = stripHtml(post.title.rendered);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN */}
        <article className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav className="text-sm mb-4 flex gap-2">
            <Link href="/">Home</Link>
            {categories[0] && (
              <>
                <span>/</span>
                <Link href={`/category/${categories[0].slug}`}>
                  {categories[0].name}
                </Link>
              </>
            )}
          </nav>

          {/* Category */}
          {categories[0] && (
            <Link
              href={`/category/${categories[0].slug}`}
              className="category-badge mb-4 inline-block"
            >
              {categories[0].name}
            </Link>
          )}

          {/* Title */}
          <h1
            className="text-3xl lg:text-4xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Meta */}
          <div className="flex gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {authorName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {formatDate(post.date)}
            </span>
          </div>

          {/* Image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={800}
              height={500}
              priority
              className="rounded-lg mb-6"
            />
          )}

          {/* Share (client-only) */}
          <ShareButtons title={title} />

          {/* CONTENT — SERVER RENDERED */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Back */}
          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </article>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="sticky top-[120px]">
            <Sidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
