'use client'

import { useState, useEffect } from "react";
import Link  from "next/link";
import { Clock } from "lucide-react";
import { WPPost, WPCategory, fetchPosts, fetchCategoryBySlug, getFeaturedImageUrl, getPostCategories, formatDate, stripHtml } from "@/services/api";
import SectionHeader from "./SectionHeader";
import { ArticleCardSkeleton } from "./Skeleton";

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  layout?: "grid" | "list" | "featured";
}

export default function CategorySection({ title, categorySlug, layout = "grid" }: CategorySectionProps) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [category, setCategory] = useState<WPCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cat = await fetchCategoryBySlug(categorySlug);
        setCategory(cat);
        
        if (cat) {
          const { posts: fetchedPosts } = await fetchPosts({
            perPage: layout === "featured" ? 5 : 4,
            categories: [cat.id],
          });
          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error(`Failed to load ${categorySlug} posts:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [categorySlug, layout]);

  if (isLoading) {
    return (
      <section className="py-6">
        <SectionHeader>{title}</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <SectionHeader>{title}</SectionHeader>
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All →
          </Link>
        )}
      </div>

      {layout === "featured" ? (
        <FeaturedLayout posts={posts} />
      ) : layout === "list" ? (
        <ListLayout posts={posts} />
      ) : (
        <GridLayout posts={posts} />
      )}
    </section>
  );
}

function GridLayout({ posts }: { posts: WPPost[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <GridCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function ListLayout({ posts }: { posts: WPPost[] }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ListCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function FeaturedLayout({ posts }: { posts: WPPost[] }) {
  const [mainPost, ...sidePosts] = posts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Post */}
      <div className="lg:col-span-2">
        <MainFeaturedCard post={mainPost} />
      </div>

      {/* Side Posts */}
      <div className="space-y-4">
        {sidePosts.map((post) => (
          <SideCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function GridCard({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post);
  const categories = getPostCategories(post);
  const primaryCategory = categories[0];

  return (
    <article className="article-card group">
      <Link
        href={`/article/${post.slug}`}
        className="block overflow-hidden rounded mb-3"
      >
        <img
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          className="article-image w-full aspect-[16/10] object-cover transition-transform duration-300"
        />
      </Link>
      {primaryCategory && (
        <Link
          href={`/category/${primaryCategory.slug}`}
          className="category-badge mb-2 inline-block text-xs"
        >
          {primaryCategory.name}
        </Link>
      )}
      <h3 className="article-title text-sm font-bold leading-snug line-clamp-2 mb-2">
        <Link
          href={`/article/${post.slug}`}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </h3>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{formatDate(post.date)}</span>
      </div>
    </article>
  );
}

function ListCard({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post);

  return (
    <article className="article-card flex gap-4 group py-3 border-b border-border-light last:border-0">
      <Link
        href={`/article/${post.slug}`}
        className="flex-shrink-0 w-[160px] h-[100px] overflow-hidden rounded"
      >
        <img
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          className="article-image w-full h-full object-cover transition-transform duration-300"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <h3 className="article-title text-base font-bold leading-snug line-clamp-2 mb-2">
          <Link
            href={`/article/${post.slug}`}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}

function MainFeaturedCard({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post);
  const categories = getPostCategories(post);
  const primaryCategory = categories[0];

  return (
    <article className="article-card group">
      <Link
        href={`/article/${post.slug}`}
        className="block overflow-hidden rounded mb-4"
      >
        <img
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          className="article-image w-full aspect-[16/9] object-cover transition-transform duration-300"
        />
      </Link>
      {primaryCategory && (
        <Link
          href={`/category/${primaryCategory.slug}`}
          className="category-badge mb-3 inline-block"
        >
          {primaryCategory.name}
        </Link>
      )}
      <h3 className="article-title text-xl font-bold leading-snug line-clamp-2 mb-3">
        <Link
          href={`/article/${post.slug}`}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </h3>
      <p className="text-muted-foreground line-clamp-3 mb-3">
        {stripHtml(post.excerpt.rendered)}
      </p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{formatDate(post.date)}</span>
      </div>
    </article>
  );
}

function SideCard({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post);

  return (
    <article className="article-card flex gap-3 group">
      <Link
        href={`/article/${post.slug}`}
        className="flex-shrink-0 w-[100px] h-[70px] overflow-hidden rounded"
      >
        <img
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          className="article-image w-full h-full object-cover transition-transform duration-300"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <h4 className="article-title text-sm font-bold leading-snug line-clamp-2 mb-1">
          <Link
            href={`/article/${post.slug}`}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}
