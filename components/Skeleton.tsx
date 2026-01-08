export function ArticleCardSkeleton({ variant = "default" }: { variant?: "default" | "small" | "horizontal" }) {
  if (variant === "small") {
    return (
      <div className="flex gap-3">
        <div className="skeleton w-30 h-21.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4">
        <div className="skeleton w-50 h-35 shrink-0 rounded" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="skeleton w-full aspect-16/10 rounded" />
      <div className="skeleton h-4 w-20" />
      <div className="skeleton h-5 w-full" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-3 w-1/3" />
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="relative aspect-16/10 skeleton rounded-lg">
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="skeleton h-4 w-24 bg-white/20" />
        <div className="skeleton h-8 w-full bg-white/20" />
        <div className="skeleton h-8 w-3/4 bg-white/20" />
        <div className="skeleton h-4 w-1/3 bg-white/20" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-24" />
      {[...Array(5)].map((_, i) => (
        <ArticleCardSkeleton key={i} variant="small" />
      ))}
    </div>
  );
}
