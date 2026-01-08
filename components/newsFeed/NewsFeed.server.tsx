import {
  fetchPosts,
  fetchCategoryBySlug,
  WPCategory,
} from "@/services/api";
import NewsFeedClient from "./NewsFeed.client";

interface Props {
  title: string;
  categorySlug?: string;
  showTabs?: boolean;
  tabLabels?: string[];
}

export default async function NewsFeed({
  title,
  categorySlug,
  showTabs,
  tabLabels,
}: Props) {
  let category: WPCategory | null = null;
  let categoryId: number | undefined;

  if (categorySlug) {
    category = await fetchCategoryBySlug(categorySlug);
    categoryId = category?.id;
  }

  const { posts } = await fetchPosts({
    perPage: 12,
    categories: categoryId ? [categoryId] : undefined,
  });

  if (!posts || posts.length === 0) return null;

  return (
    <NewsFeedClient
      title={title}
      posts={posts}
      category={category}
      showTabs={showTabs}
      tabLabels={tabLabels}
    />
  );
}
