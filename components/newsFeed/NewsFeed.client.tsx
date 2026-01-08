"use client";

import { useState } from "react";
import Link from "next/link";
import { WPPost, WPCategory } from "@/services/api";
import FeedItem from "./FeedItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../SectionHeader";

interface Props {
  title: string;
  posts: WPPost[];
  category?: WPCategory | null;
  showTabs?: boolean;
  tabLabels?: string[];
}

export default function NewsFeedClient({
  title,
  posts,
  category,
  showTabs,
  tabLabels,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);

  const postsPerPage = 6;

  const tabContent = [
    { label: tabLabels?.[0] || "Last 2 hours", posts },
    { label: tabLabels?.[1] || "Last 6 hours", posts },
    { label: tabLabels?.[2] || "Last 24 hours", posts },
  ];

  const activePosts = showTabs
    ? tabContent[activeTab].posts
    : posts;

  const totalPages = Math.ceil(activePosts.length / postsPerPage);

  const visiblePosts = activePosts.slice(
    page * postsPerPage,
    (page + 1) * postsPerPage
  );

  return (
    <section className="py-6">
      {/* Header */}
      {showTabs ? (
        <div className="mb-4 border-b border-border-light flex gap-4">
          {tabContent.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(i);
                setPage(0);
              }}
              className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
                activeTab === i
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex justify-between mb-4">
          <SectionHeader>{title}</SectionHeader>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-sm text-primary hover:underline"
            >
              View All →
            </Link>
          )}
        </div>
      )}

      {/* Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {visiblePosts.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
