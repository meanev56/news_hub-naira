import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import {
  WPPost,
  getFeaturedImageUrl,
  stripHtml,
  formatDate,
} from "@/services/api";

export default function FeedItem({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post);

  return (
    <article className="flex gap-3 py-2 border-b border-border-light last:border-0">
      <Link
        href={`/article/${post.slug}`}
        className="relative w-[120px] h-[86px] rounded overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={stripHtml(post.title.rendered)}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <h3
          className="text-sm font-bold line-clamp-3 mb-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          {formatDate(post.date)}
        </div>
      </div>
    </article>
  );
}
