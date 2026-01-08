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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Section */}
            <HeroSlider />

            {/* Latest News Tabs */}
            <NewsFeed
              title="Latest News"
              showTabs
              tabLabels={["Last 2 hours", "Last 6 hours", "Last 24 hours"]}
            />

            {/* Economy Section */}
            <CategorySection
              title="Economy"
              categorySlug="economy"
              layout="featured"
            />

            {/* Markets Section */}
            <CategorySection
              title="Markets"
              categorySlug="market-news"
              layout="grid"
            />

            {/* Business News */}
            <CategorySection
              title="Business News"
              categorySlug="nigeria-business-news"
              layout="grid"
            />

            {/* Sectors */}
            <CategorySection
              title="Sectors"
              categorySlug="industries"
              layout="grid"
            />

            {/* Financial Literacy */}
            <CategorySection
              title="Financial Literacy"
              categorySlug="financial-literacy-for-nigerians"
              layout="list"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-30">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
