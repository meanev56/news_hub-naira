import Link from "next/link";
import { Clock, MessageSquare } from "lucide-react";
import { WPPost, getFeaturedImageUrl, getAuthorName, getPostCategories, formatDate, stripHtml } from "@/services/api";

interface ArticleCardProps {
  post: WPPost;
  variant?: "default" | "featured" | "small" | "horizontal" | "minimal";
  showExcerpt?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  showComments?: boolean;
}

export default function ArticleCard({
  post,
  variant = "default",
  showExcerpt = true,
  showCategory = true,
  showAuthor = false,
  showComments = false,
}: ArticleCardProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const authorName = getAuthorName(post);
  const categories = getPostCategories(post);
  const primaryCategory = categories[0];
  const articleUrl = `/article/${post.slug}`;

  if (variant === "featured") {
    return (
      <article className="article-card group relative overflow-hidden rounded-lg">
        <Link href={articleUrl} className="block relative aspect-[16/10]">
          <img
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            className="article-image w-full h-full object-cover transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {showCategory && primaryCategory && (
              <span className="category-badge mb-3 inline-block">
                {primaryCategory.name}
              </span>
            )}
            <h2
              className="article-title text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-3"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className="flex items-center gap-4 text-white/80 text-sm">
              {showAuthor && (
                <span>by {authorName}</span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "small") {
    return (
      <article className="article-card flex gap-3 group">
        <Link href={articleUrl} className="flex-shrink-0 w-[120px] h-[86px] overflow-hidden rounded">
          <img
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            className="article-image w-full h-full object-cover transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="article-title text-sm font-bold leading-snug line-clamp-3 mb-2">
            <Link href={articleUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
            {showComments && (
              <>
                <MessageSquare className="w-3 h-3 ml-2" />
                <span>0</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="article-card flex gap-4 group">
        <Link href={articleUrl} className="flex-shrink-0 w-[200px] h-[140px] overflow-hidden rounded">
          <img
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            className="article-image w-full h-full object-cover transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {showCategory && primaryCategory && (
            <Link
              href={`/category/${primaryCategory.slug}`}
              className="category-badge mb-2 inline-block text-xs"
            >
              {primaryCategory.name}
            </Link>
          )}
          <h3 className="article-title text-lg font-bold leading-snug line-clamp-2 mb-2">
            <Link href={articleUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h3>
          {showExcerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {stripHtml(post.excerpt.rendered)}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {showAuthor && (
              <span>by {authorName}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(post.date)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "minimal") {
    return (
      <article className="article-card group">
        <h3 className="article-title text-sm font-medium leading-snug line-clamp-2 mb-1">
          <Link href={articleUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(post.date)}</span>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="article-card group">
      <Link href={articleUrl} className="block overflow-hidden rounded mb-3">
        <img
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          className="article-image w-full aspect-[16/10] object-cover transition-transform duration-300"
        />
      </Link>
      {showCategory && primaryCategory && (
        <Link
            href={`/category/${primaryCategory.slug}`}
          className="category-badge mb-2 inline-block text-xs"
        >
          {primaryCategory.name}
        </Link>
      )}
      <h3 className="article-title text-lg font-bold leading-snug line-clamp-2 mb-2">
        <Link href={articleUrl} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </h3>
      {showExcerpt && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {stripHtml(post.excerpt.rendered)}
        </p>
      )}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {showAuthor && (
          <span>by {authorName}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(post.date)}
        </span>
        {showComments && (
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            0
          </span>
        )}
      </div>
    </article>
  );
}
