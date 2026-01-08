"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { WPPost, fetchTrendingPosts } from "@/services/api";

export default function TrendingBar() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchTrendingPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load trending posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [posts.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  if (isLoading || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div className="bg-secondary border-y border-border-light">
      <div className="container py-2">
        <div className="flex items-center gap-4">
          {/* Trending Badge */}
          <div className="trending-badge shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-red-500 text-white text-xs font-bold uppercase">
            <TrendingUp className="w-3 h-3" />
            <span>TRENDING</span>
          </div>

          {/* Post Title */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <Link
              href={`/article/${currentPost.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors truncate block"
              dangerouslySetInnerHTML={{ __html: currentPost.title.rendered }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={goToPrev}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
