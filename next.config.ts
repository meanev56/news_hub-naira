/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other Next.js configurations
  turbopack: {
    // Set this to the absolute or relative path of your actual project root.
    // Assuming your project is in 'C:\Users\DELL\Downloads\january\news_nairametrics_hub'
    root: './', 
    // or set it to the absolute path:
    // root: 'C:\\Users\\DELL\\Downloads\\january\\news_nairametrics_hub',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nairametrics.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
