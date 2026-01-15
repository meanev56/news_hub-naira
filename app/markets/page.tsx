"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import SectionHeader from "@/components/SectionHeader";
import { ArticleCardSkeleton } from "@/components/Skeleton";

const marketSubcategories = [
  { label: "All Markets", slug: "market-news" },
  { label: "Currencies", slug: "naira-dollar-exchange-rate" },
  { label: "Cryptos", slug: "cryptocurrency-news" },
  { label: "Commodities", slug: "commodities" },
  { label: "Equities", slug: "equities" },
  { label: "Fixed Income", slug: "fixed-income" },
];

// Mock market data
const mockMarketData = [
  { name: "NGX ASI", value: "98,234.56", change: "+1.24%", trend: "up" as const },
  { name: "USD/NGN", value: "1,570.00", change: "-0.32%", trend: "down" as const },
  { name: "Brent Crude", value: "$82.45", change: "+0.85%", trend: "up" as const },
  { name: "Bitcoin", value: "$97,234", change: "+2.15%", trend: "up" as const },
  { name: "Gold", value: "$2,645.30", change: "0.00%", trend: "neutral" as const },
];

export default function MarketsPage() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;
  const [category, setCategory] = useState<WPCategory | null>(null);
  const [postsData, setPostsData] = useState<FetchPostsResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const activeSlug = slug || "market-news";

  // Reset page on slug change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSlug]);

  // Load posts & category
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cat = await fetchCategoryBySlug(activeSlug);
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
        console.error("Failed to load markets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeSlug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-8">
      {/* Market Ticker */}
      <div className="mb-8 p-4 bg-secondary rounded-lg">
        <div className="flex items-center gap-8 overflow-x-auto custom-scrollbar pb-2">
          {mockMarketData.map((item) => (
            <div key={item.name} className="flex items-center gap-3 flex-shrink-0">
              <div>
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{item.value}</span>
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      item.trend === "up"
                        ? "text-green-600"
                        : item.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : item.trend === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/markets" className="hover:text-primary transition-colors">
              Markets
            </Link>
            {slug && (
              <>
                <span>/</span>
                <span className="text-foreground capitalize">
                  {slug.replace(/-/g, " ")}
                </span>
              </>
            )}
          </nav>

          {/* Market Subcategories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {marketSubcategories.map((subcat) => (
              <Link
                key={subcat.slug}
                href={subcat.slug === "market-news" ? "/markets" : `/markets/${subcat.slug}`}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  activeSlug === subcat.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {subcat.label}
              </Link>
            ))}
          </div>

          {/* Header */}
          <SectionHeader>{category?.name || "Markets"}</SectionHeader>

          {postsData && (
            <p className="text-sm text-muted-foreground mb-6">
              {postsData.total} articles found
            </p>
          )}

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
                    showCategory
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
              <p className="text-muted-foreground">No market news found.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[120px]">
            {/* <Sidebar /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
