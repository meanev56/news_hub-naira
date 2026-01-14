"use client";

import { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import Link from "next/link";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-light">
      <span className="text-sm font-medium">Share:</span>
      <Link
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </Link>
      <Link
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
          title
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </Link>
      <Link
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </Link>
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title, url });
          } else {
            navigator.clipboard.writeText(url);
          }
        }}
        className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
