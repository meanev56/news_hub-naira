"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

import { WPPost, WPCategory, fetchPosts, fetchCategoryBySlug, FetchPostsResult } from "@/services/api";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { ArticleCardSkeleton } from "@/components/Skeleton";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const parent = params?.parent as string | undefined;

  const [category, setCategory] = useState<WPCategory | null>(null);
  const [postsData, setPostsData] = useState<FetchPostsResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Load category + posts
  useEffect(() => {
    if (authChecking || !slug) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const cat = await fetchCategoryBySlug(slug);
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
  }, [slug, currentPage, authChecking]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoryName = category?.name || slug.replace(/-/g, " ");

  // Which categories require login?
  const protectedSlugs = ["financial-literacy-for-nigerians", "industries"]; // ← edit this list
  const isProtected = protectedSlugs.includes(slug.toLowerCase());

  // Still checking auth → show spinner
  if (authChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Protected category + not logged in → show gate
  if (isProtected && !user) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Lock className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Premium Content</h1>
          <p className="text-lg text-muted-foreground mb-8">
            This section is available only to registered members.
            Sign in or create an account to continue reading.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/category/${slug}`)}`}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal category rendering (public or logged-in protected)
  return (
    <div className="container py-8 md:py-10 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
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
            <span className="text-foreground font-medium capitalize">{categoryName}</span>
          </nav>

          {/* Category Header */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryName}</h1>
            {category?.description && (
              <p className="text-lg text-muted-foreground">{category.description}</p>
            )}
            {postsData && !isLoading && (
              <p className="text-sm text-muted-foreground mt-3">
                {postsData.total.toLocaleString()} articles
              </p>
            )}
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : postsData && postsData.posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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

              {postsData.totalPages > 1 && (
                <div className="mt-10 md:mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={postsData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <p className="text-xl text-muted-foreground">
                No articles found in this category yet.
              </p>
              <p className="text-muted-foreground mt-2">
                Check back later or explore other sections.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[100px] lg:top-[120px]">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}