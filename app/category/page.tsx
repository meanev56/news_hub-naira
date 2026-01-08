"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  WPPost,
  WPCategory,
  fetchPosts,
  fetchCategoryBySlug,
  FetchPostsResult,
} from "@/services/api";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { ArticleCardSkeleton } from "@/components/Skeleton";

export default function CategoryPage() {
  const params = useParams<{ slug: string; parent?: string }>();
  const slug = params?.slug || "";
  const parent = params?.parent;

  const [category, setCategory] = useState<WPCategory | null>(null);
  const [postsData, setPostsData] = useState<FetchPostsResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const categorySlug = slug;

  // Reset page on category change
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  // Fetch category and posts
  useEffect(() => {
    const loadData = async () => {
      if (!categorySlug) return;

      setIsLoading(true);
      try {
        const cat = await fetchCategoryBySlug(categorySlug);
        setCategory(cat);

        if (cat) {
          const data = await fetchPosts({
            page: currentPage,
            perPage: 12,
            categories: [cat.id],
          });
          setPostsData(data);
        }
      } catch (error) {
        console.error("Failed to load category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [categorySlug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            {parent && (
              <>
                <Link
                  href={`/category/${parent}`}
                  className="hover:text-primary transition-colors capitalize"
                >
                  {parent.replace(/-/g, " ")}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground capitalize">
              {category?.name || categorySlug.replace(/-/g, " ")}
            </span>
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {category?.name || categorySlug.replace(/-/g, " ")}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground">{category.description}</p>
            )}
            {postsData && (
              <p className="text-sm text-muted-foreground mt-2">
                {postsData.total} articles found
              </p>
            )}
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : postsData && postsData.posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postsData.posts.map((post: WPPost) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    showExcerpt
                    showCategory={false}
                    showAuthor
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={postsData.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>

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
