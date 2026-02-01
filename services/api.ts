const BASE_URL = "https://nairametrics.com/wp-json/wp/v2";

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  author: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      slug: string;
    }>;
    "wp:term"?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
  parent: number;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
}

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

export interface FetchPostsParams {
  page?: number;
  perPage?: number;
  categories?: number[];
  search?: string;
  orderby?: "date" | "comment_count" | "relevance";
  order?: "asc" | "desc";
}

export interface FetchPostsResult {
  posts: WPPost[];
  totalPages: number;
  total: number;
}

export async function fetchPosts(params: FetchPostsParams = {}): Promise<FetchPostsResult> {
  const {
    page = 1,
    perPage = 10,
    categories,
    search,
    orderby = "date",
    order = "desc",
  } = params;

  const urlParams = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    orderby,
    order,
    _embed: "true",
  });

  if (categories?.length) {
    urlParams.set("categories", categories.join(","));
  }

  if (search) {
    urlParams.set("search", search);
  }

  const url = `${BASE_URL}/posts?${urlParams.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const posts: WPPost[] = await response.json();
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1", 10);
  const total = parseInt(response.headers.get("X-WP-Total") || "0", 10);

  return { posts, totalPages, total };
}

export async function fetchPost(slug: string): Promise<WPPost | null> {
  const url = `${BASE_URL}/posts?slug=${slug}&_embed=true`;
  const posts = await fetchWithCache<WPPost[]>(url);
  return posts[0] || null;
}

export async function fetchCategories(): Promise<WPCategory[]> {
  const url = `${BASE_URL}/categories?per_page=100`;
  return fetchWithCache<WPCategory[]>(url);
}

export async function fetchCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const url = `${BASE_URL}/categories?slug=${slug}`;
  const categories = await fetchWithCache<WPCategory[]>(url);
  return categories[0] || null;
}

export async function fetchMedia(id: number): Promise<WPMedia | null> {
  if (!id) return null;
  const url = `${BASE_URL}/media/${id}`;
  try {
    return await fetchWithCache<WPMedia>(url);
  } catch {
    return null;
  }
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
  const url = `${BASE_URL}/search?search=${encodeURIComponent(query)}&per_page=20`;
  return fetchWithCache<SearchResult[]>(url);
}

export async function fetchPopularPosts(): Promise<WPPost[]> {
  // Approximate popular posts using comment_count ordering
  const { posts } = await fetchPosts({
    perPage: 5,
    orderby: "comment_count",
  });
  return posts;
}

export async function fetchTrendingPosts(): Promise<WPPost[]> {
  // Get recent posts for trending section
  const { posts } = await fetchPosts({
    perPage: 6,
  });
  return posts;
}

// Helper to extract featured image URL
export function getFeaturedImageUrl(post: WPPost): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url || "/placeholder.svg";
}

// Helper to extract author name
export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name || "Nairametrics";
}

// Helper to extract categories
export function getPostCategories(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.["wp:term"]?.[0];
  return terms || [];
}

// Helper to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to strip HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}


// Navigation structure
export interface NavItem {
  label: string;
  slug: string;
  path: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  { label: "HOME", slug: "", path: "/" },
  {
    label: "EXCLUSIVES",
    slug: "exclusives",
    path: "/category/exclusives",
    children: [
      { label: "Recapitalization", slug: "bank-recapitalization", path: "/category/bank-recapitalization" },
      { label: "Financial Analysis", slug: "financial", path: "/category/financial" },
      { label: "Corporate Stories", slug: "corporate-stories", path: "/category/corporate-stories" },
      { label: "Interviews", slug: "interviews", path: "/category/interviews" },
      { label: "Investigations", slug: "investigations", path: "/category/investigations" },
      { label: "Metrics", slug: "metrics", path: "/category/metrics" },
    ],
  },
  {
    label: "ECONOMY",
    slug: "economy",
    path: "/category/economy",
    children: [
      { label: "Business News", slug: "nigeria-business-news", path: "/category/nigeria-business-news" },
      { label: "Budget", slug: "budget", path: "/category/budget" },
      { label: "Public Debt", slug: "public-debt", path: "/category/public-debt" },
      { label: "Tax", slug: "tax", path: "/category/tax" },
    ],
  },
  {
    label: "MARKETS",
    slug: "market-news",
    path: "/markets",
    children: [
      { label: "Currencies", slug: "naira-dollar-exchange-rate", path: "/markets/naira-dollar-exchange-rate" },
      { label: "Cryptos", slug: "cryptocurrency-news", path: "/markets/cryptocurrency-news" },
      { label: "Commodities", slug: "commodities", path: "/markets/commodities" },
      { label: "Equities", slug: "equities", path: "/markets/equities" },
      { label: "Fixed Income", slug: "fixed-income", path: "/markets/fixed-income" },
    ],
  },
  {
    label: "SECTORS",
    slug: "industries",
    path: "/category/industries",
    children: [
      { label: "Agriculture", slug: "agriculture", path: "/category/agriculture" },
      { label: "Aviation", slug: "aviation", path: "/category/aviation" },
      { label: "Energy", slug: "energy", path: "/category/energy" },
      { label: "Tech News", slug: "tech-news", path: "/category/tech-news" },
      { label: "Financial Services", slug: "financial-services", path: "/category/financial-services" },
      { label: "Health", slug: "health", path: "/category/health" },
    ],
  },
  {
    label: "FINANCIAL LITERACY",
    slug: "financial-literacy-for-nigerians",
    path: "/category/financial-literacy-for-nigerians",
    children: [
      { label: "Career Tips", slug: "career-tips", path: "/category/career-tips" },
      { label: "Personal Finance", slug: "personal-finance", path: "/category/personal-finance" },
    ],
  },
  {
    label: "LIFESTYLE",
    slug: "lifestyle-entertainment",
    path: "/category/lifestyle-entertainment",
    children: [
      { label: "Billionaire Watch", slug: "billionaire-watch", path: "/category/billionaire-watch" },
      { label: "Profiles", slug: "profiles", path: "/category/profiles" },
    ],
  },
  {
    label: "OPINIONS",
    slug: "opinion-editorials",
    path: "/category/opinion-editorials",
    children: [
      { label: "Blurb", slug: "blurb", path: "/category/blurb" },
      { label: "Market Views", slug: "market-views", path: "/category/market-views" },
      { label: "Op-Eds", slug: "columnists", path: "/category/columnists" },
    ],
  },
];
