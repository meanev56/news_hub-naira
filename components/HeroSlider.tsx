"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  WPPost,
  fetchPosts,
  getFeaturedImageUrl,
  getPostCategories,
  formatDate,
  stripHtml,
} from "@/services/api";
import { FeaturedSkeleton } from "./Skeleton";

export default function HeroSlider() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { posts } = await fetchPosts({ perPage: 5 });
        setPosts(posts);
      } catch (error) {
        console.error("Failed to load hero posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeaturedSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <FeaturedSkeleton />
          <FeaturedSkeleton />
          <FeaturedSkeleton />
          <FeaturedSkeleton />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const mainPost = posts[currentIndex];
  const sidePostsStart = (currentIndex + 1) % posts.length;

  const sidePosts = [
    posts[sidePostsStart % posts.length],
    posts[(sidePostsStart + 1) % posts.length],
    posts[(sidePostsStart + 2) % posts.length],
    posts[(sidePostsStart + 3) % posts.length],
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Main Featured Post */}
      <div className="relative group">
        <HeroCard post={mainPost} isMain />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Side Posts */}
      <div className="grid grid-cols-2 gap-4">
        {sidePosts.map((post) => (
          <HeroCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

interface HeroCardProps {
  post: WPPost;
  isMain?: boolean;
}

function HeroCard({ post, isMain }: HeroCardProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const categories = getPostCategories(post);
  const primaryCategory = categories[0];

  return (
    <article className="article-card relative overflow-hidden rounded-lg group h-full">
      <Link
        href={`/article/${post.slug}`}
        className={`block relative aspect-[4/3] h-full`}
      >
        <img
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          className="article-image absolute inset-0 w-full h-full object-cover transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div
          className={`absolute bottom-0 left-0 right-0 ${
            isMain ? "p-6" : "p-4"
          }`}
        >
          {primaryCategory && (
            <span className="category-badge mb-2 inline-block text-xs">
              {primaryCategory.name}
            </span>
          )}

          <h2
            className={`text-white font-bold leading-tight mb-2 ${
              isMain
                ? "text-xl md:text-2xl line-clamp-3"
                : "text-sm line-clamp-2"
            }`}
            dangerouslySetInnerHTML={{
              __html: post.title.rendered,
            }}
          />

          <div className="flex items-center gap-2 text-white/70 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
