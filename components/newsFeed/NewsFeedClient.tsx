"use client";

import { useState } from "react";
import FeedItem from "./FeedItem";

export default function NewsFeedClient({
  posts,
  showTabs,
  tabLabels,
}: {
  posts: any[];
  showTabs?: boolean;
  tabLabels?: string[];
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);

  const POSTS_PER_PAGE = 6;

  const tabContent = [
    posts.slice(0, 6),
    posts.slice(0, 6),
    posts.slice(0, 6),
  ];

  const activePosts = showTabs ? tabContent[activeTab] : posts;

  const visible = activePosts.slice(
    page * POSTS_PER_PAGE,
    (page + 1) * POSTS_PER_PAGE
  );

  return (
    <>
      {showTabs && (
        <div className="flex gap-4 border-b mb-4">
          {(tabLabels ?? ["Last 2h", "Last 6h", "Last 24h"]).map((label, i) => (
            <button
              key={label}
              onClick={() => {
                setActiveTab(i);
                setPage(0);
              }}
              className={`py-2 text-sm border-b-2 ${
                activeTab === i
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
