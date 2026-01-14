"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  User,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
} from "lucide-react";
import {
  WPPost,
  fetchPost,
  getFeaturedImageUrl,
  getAuthorName,
  getPostCategories,
  formatDate,
  stripHtml,
} from "@/services/api";
import Sidebar from "@/components/Sidebar";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [post, setPost] = useState<WPPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const fetchedPost = await fetchPost(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ArticleSkeleton />
          </div>
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{error || "Article not found"}</h1>
        <Link href="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const imageUrl = getFeaturedImageUrl(post);
  const authorName = getAuthorName(post);
  const categories = getPostCategories(post);
  const shareTitle = stripHtml(post.title.rendered);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            {categories[0] && (
              <>
                <Link
                  href={`/category/${categories[0].slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {categories[0].name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate max-w-[200px]">
              {stripHtml(post.title.rendered)}
            </span>
          </nav>

          {/* Category Badge */}
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
            className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border-light">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>by {authorName}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(post.date)}</span>
            </span>
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <Image
              src={imageUrl}
              alt={stripHtml(post.title.rendered)}
              className="w-full rounded-lg"
              width={800}
              height={500}
            />
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-light">
            <span className="text-sm font-medium">Share:</span>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
              )}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </Link>
            <Link
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                shareUrl
              )}&title=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: shareTitle, url: shareUrl });
                } else {
                  navigator.clipboard.writeText(shareUrl);
                }
              }}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-border-light">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[120px]">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-4 w-48" />
      <div className="skeleton h-6 w-24" />
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-10 w-3/4" />
      <div className="flex gap-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-32" />
      </div>
      <div className="skeleton w-full aspect-video rounded-lg" />
      <div className="space-y-3">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  );
}
