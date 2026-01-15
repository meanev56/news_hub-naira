"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  WPPost,
  WPCategory,
  fetchPosts,
  fetchCategoryBySlug,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
} from "@/services/api";
import SectionHeader from "./SectionHeader";
import { ArticleCardSkeleton } from "./Skeleton";

interface NewsFeedProps {
  title: string;
  categorySlug?: string;
  showTabs?: boolean;
  tabLabels?: string[];
}

export default function NewsFeed({
  title,
  categorySlug,
  showTabs,
  tabLabels,
}: NewsFeedProps) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [category, setCategory] = useState<WPCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        let categoryId: number | undefined;

        if (categorySlug) {
          const cat = await fetchCategoryBySlug(categorySlug);
          setCategory(cat || null);
          categoryId = cat?.id;
        }

        const { posts: fetchedPosts } = await fetchPosts({
          perPage: 6,
          categories: categoryId ? [categoryId] : undefined,
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to load news feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <section className="py-6" suppressHydrationWarning>
        <SectionHeader>{title}</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ArticleCardSkeleton key={i} variant="small" />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  const tabContent = [
    { label: tabLabels?.[0] || "Last 2 hours", posts: posts.slice(0, 6) },
    { label: tabLabels?.[1] || "Last 6 hours", posts: posts.slice(0, 6) },
    { label: tabLabels?.[2] || "Last 24 hours", posts: posts.slice(0, 6) },
  ];

  return (
    <section className="py-6" suppressHydrationWarning>
      {showTabs ? (
        <div className="mb-4">
          <div className="flex items-center gap-4 border-b border-border-light">
            {tabContent.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === index
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4">
          <SectionHeader>{title}</SectionHeader>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All →
            </Link>
          )}
        </div>
      )}

      <NewsFeedContent posts={showTabs ? tabContent[activeTab].posts : posts} />
    </section>
  );
}

function NewsFeedContent({ posts }: { posts: WPPost[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const visiblePosts = posts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {visiblePosts.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function FeedItem({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post);

  return (
    <article className="article-card flex gap-3 group py-2 border-b border-border-light last:border-0">
      <Link
        href={`/article/${post.slug}`}
        className="flex-shrink-0 w-[120px] h-[86px] overflow-hidden rounded relative"
      >
        <Image
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          fill
          className="object-cover transition-transform duration-300"
          sizes="120px"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <h3 className="article-title text-sm font-bold leading-snug line-clamp-3 mb-2">
          <Link
            href={`/article/${post.slug}`}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}
