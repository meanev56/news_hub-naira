"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { WPPost, fetchPosts, FetchPostsResult } from "@/services/api";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { ArticleCardSkeleton } from "@/components/Skeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [postsData, setPostsData] = useState<FetchPostsResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Sync search input and reset page when query changes
  useEffect(() => {
    setSearchInput(query);
    setCurrentPage(1);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    const searchPosts = async () => {
      if (!query.trim()) {
        setPostsData(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchPosts({
          page: currentPage,
          perPage: 12,
          search: query,
          orderby: "relevance",
        });
        setPostsData(data);
      } catch (error) {
        console.error("Search failed:", error);
        setPostsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    searchPosts();
  }, [query, currentPage]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchInput.trim());
      window.history.replaceState({}, "", url.toString());
      setCurrentPage(1);
    }
  };

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
            <span className="text-foreground">Search</span>
          </nav>

          {/* Search Form */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Search</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Search Results */}
          {query && (
            <div className="mb-4">
              <p className="text-muted-foreground">
                {isLoading ? (
                  "Searching..."
                ) : postsData ? (
                  <>
                    Found <strong>{postsData.total}</strong> results for "
                    <strong>{query}</strong>"
                  </>
                ) : (
                  "No results found"
                )}
              </p>
            </div>
          )}

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
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No articles found matching your search.
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse our categories.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter a search term to find articles.
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
