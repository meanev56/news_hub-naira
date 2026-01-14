"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  WPPost,
  fetchPosts,
  fetchPopularPosts,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
} from "@/services/api";
import SectionHeader from "./SectionHeader";
import { SidebarSkeleton } from "./Skeleton";

export default function Sidebar() {
  const [latestPosts, setLatestPosts] = useState<WPPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        const latest = await fetchPosts({ perPage: 5 });
        const popular = await fetchPopularPosts();

        setLatestPosts(Array.isArray(latest) ? latest : []);
        setPopularPosts(Array.isArray(popular) ? popular : []);
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
    <aside className="space-y-8">
      <section>
        <SectionHeader>Metrics</SectionHeader>
        <div className="space-y-4">
          {latestPosts.slice(0, 4).map((post) => (
            <SidebarPost key={post.id} post={post} showComments />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Analysis</SectionHeader>
        <div className="space-y-4">
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

function SidebarPost({ post, showComments }: SidebarPostProps) {
  const imageUrl = getFeaturedImageUrl(post);

  return (
    <article className="flex gap-3 group">
      <Link
        href={`/article/${post.slug}`}
        className="relative w-[80px] h-[60px] shrink-0"
      >
        <Image
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          fill
          className="object-cover rounded"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold leading-snug line-clamp-2 mb-1">
          <Link href={`/article/${post.slug}`}>
            <span
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </Link>
        </h4>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          {showComments && (
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>0</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
