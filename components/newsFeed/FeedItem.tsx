import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { WPPost, getFeaturedImageUrl, stripHtml } from "@/services/api";

function formatDateStable(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

export default function FeedItem({ post }: { post: WPPost }) {
  const imageUrl = getFeaturedImageUrl(post) ?? "/placeholder.jpg";
  const title = stripHtml(post.title.rendered);

  return (
    <article className="flex gap-3 py-2 border-b border-border-light last:border-0">
      <Link
        href={`/article/${post.slug}`}
        className="relative w-[120px] h-[86px] rounded overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="120px"
          className="object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold line-clamp-3 mb-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>{formatDateStable(post.date)}</span>
        </div>
      </div>
    </article>
  );
}
