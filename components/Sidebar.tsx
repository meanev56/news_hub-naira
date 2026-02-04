"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  WPPost,
  fetchSidebarLatestPosts,
  fetchSidebarPopularPosts,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
} from "@/services/api-sidebar";   // ← new import

import SectionHeader from "./SectionHeader";
import { SidebarSkeleton } from "./Skeleton";

export default function Sidebar() {
  const [latestPosts, setLatestPosts] = useState<WPPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        const [latest, popular] = await Promise.all([
          fetchSidebarLatestPosts(),
          fetchSidebarPopularPosts(),
        ]);

        setLatestPosts(latest);
        setPopularPosts(popular);
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  if (isLoading) {
    return (
      <aside className="space-y-8">
        <SidebarSkeleton />
        <SidebarSkeleton />
      </aside>
    );
  }

  return (
    <aside className="space-y-10">
      {/* Metrics Section */}
      <section>
        <SectionHeader>Metrics</SectionHeader>
        <div className="space-y-5 mt-4">
          {latestPosts.slice(0, 4).map((post) => (
            <SidebarPost key={post.id} post={post} showComments />
          ))}
        </div>
      </section>

      {/* Analysis Section */}
      <section>
        <SectionHeader>Analysis</SectionHeader>
        <div className="space-y-5 mt-4">
          {popularPosts.slice(0, 4).map((post) => (
            <SidebarPost key={post.id} post={post} showComments />
          ))}
        </div>
      </section>
    </aside>
  );
}

interface SidebarPostProps {
  post: WPPost;
  showComments?: boolean;
}

function SidebarPost({ post, showComments = true }: SidebarPostProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const titleText = stripHtml(post.title.rendered);
  const commentCount = post.comment_count ?? 0; // fallback to 0 if undefined

  return (
    <article className="group flex gap-3">
      <Link
        href={`/article/${post.slug}`}
        className="flex-shrink-0 w-[90px] h-[68px] overflow-hidden rounded-md"
        aria-label={`Read article: ${titleText}`}
      >
        <Image
          src={imageUrl}
          alt={titleText}
          width={90}
          height={68}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold leading-tight line-clamp-2 mb-1.5 hover:text-primary transition-colors">
          <Link href={`/article/${post.slug}`}>{titleText}</Link>
        </h4>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>

          {showComments && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">💬</span>
              <span>{commentCount}</span>
              <span className="sr-only">comments</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}