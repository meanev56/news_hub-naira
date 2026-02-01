"use client";

import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  return (
    <div className="flex gap-3 mb-6">
      <Link href={`https://facebook.com/sharer/sharer.php?u=${url}`} target="_blank">
        <Facebook />
      </Link>
      <Link
        href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
        target="_blank"
      >
        <Twitter />
      </Link>
      <Link
        href={`https://www.linkedin.com/shareArticle?url=${url}&title=${title}`}
        target="_blank"
      >
        <Linkedin />
      </Link>
      <button
        onClick={() => navigator.clipboard.writeText(url)}
      >
        <Share2 />
      </button>
    </div>
  );
}
