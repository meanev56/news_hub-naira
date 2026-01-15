import TrendingBar from "@/components/TrendingBar";
import HeroSlider from "@/components/HeroSlider";
import NewsFeed from "@/components/NewsFeed";
import CategorySection from "@/components/CategorySection";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      {/* Trending Bar */}
      <TrendingBar />

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-8">
          {/* Main Content */}
          <main className="lg:col-span-8 space-y-8">
            <HeroSlider />

            <NewsFeed
              title="Latest News"
              showTabs
              tabLabels={["Last 2 hours", "Last 6 hours", "Last 24 hours"]}
            />

            <CategorySection title="Economy" categorySlug="economy" layout="featured" />
            <CategorySection title="Markets" categorySlug="market-news" layout="grid" />
            <CategorySection title="Business News" categorySlug="nigeria-business-news" layout="grid" />
            <CategorySection title="Sectors" categorySlug="industries" layout="grid" />
            <CategorySection title="Financial Literacy" categorySlug="financial-literacy-for-nigerians" layout="list" />
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
