import { fetchPosts, fetchCategoryBySlug } from "@/services/api";
import SectionHeader from "@/components/SectionHeader";
import NewsFeedClient from "./NewsFeedClient";

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
  let categoryId: number | undefined;

  if (categorySlug) {
    const category = await fetchCategoryBySlug(categorySlug);
    categoryId = category?.id;
  }

  const { posts } = await fetchPosts({
    perPage: 12,
    categories: categoryId ? [categoryId] : undefined,
  });

  if (!posts.length) return null;

  return (
    <section className="py-6">
      <SectionHeader>{title}</SectionHeader>

      <NewsFeedClient
        posts={posts}
        showTabs={showTabs}
        tabLabels={tabLabels}
      />
    </section>
  );
}
