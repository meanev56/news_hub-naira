// src/services/api-sidebar.ts

import {
  WPPost,
  fetchPosts,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
} from "./api";

// Re-export WPPost so consumers can import it from here too
export type { WPPost };

// Fetch latest posts (Metrics section)
export async function fetchSidebarLatestPosts(): Promise<WPPost[]> {
  try {
    const { posts } = await fetchPosts({
      perPage: 5,
      orderby: "date",
      order: "desc",
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch latest posts for sidebar:", error);
    return [];
  }
}

// Fetch "popular" posts (Analysis section) with fallback
export async function fetchSidebarPopularPosts(): Promise<WPPost[]> {
  try {
    const { posts } = await fetchPosts({
      perPage: 5,
      orderby: "comment_count",
      order: "desc",
    });
    return posts;
  } catch (error) {
    console.warn("comment_count failed → using recent posts instead", error);

    const { posts } = await fetchPosts({
      perPage: 5,
      orderby: "date",
      order: "desc",
    });
    return posts;
  }
}

// Re-export the helper functions
export {
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
} from "./api";