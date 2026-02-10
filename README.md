Modern content + marketplace platform built with **Next.js 14+** (App Router)

> A clean, fast website featuring curated articles, categorized content, and a marketplace section.

## Pages / Routes

| Route                        | Description                              | Purpose                              |
|------------------------------|------------------------------------------|--------------------------------------|
| `/`                          | Home page                                | Landing page, featured content       |
| `/market`                    | Market overview                          | Main marketplace landing             |
| `/[category]`                | Category page (dynamic)                  | Lists articles/items in a category   |
| `/[category]/[slug]`         | Article / Product detail                 | Single article or market item page   |

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: dotenv

## Features (current)

- SSR / SSG / ISR ready pages
- Dynamic routes for categories & articles
- Responsive design (mobile-first)
- Basic JWT-based auth infrastructure
- SEO-friendly structure

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/meanev56/news_hub-naira.git

# 2. Install dependencies
npm install
# or
yarn install
# or
pnpm install

Create a .env.local file in the root of the project:

# Required
NEXT_PUBLIC_SITE_URL=http://localhost:3000
JWT_SECRET=              # Change this in production!

# Optional / future use
# DATABASE_URL=postgresql://...
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

Development

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

Open http://localhost:3000 in your browser.
Available Scripts

npm run dev         # start dev server
npm run build       # build for production
npm run start       # run production build
npm run lint        # run ESLint
npm run format      # format code with Prettier


Project Structure

├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                # Home page
│   │   ├── market/
│   │   │   └── page.tsx            # /market
│   │   ├── [category]/
│   │   │   ├── page.tsx            # /[category]
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # /[category]/[slug]
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
├── lib/
│   └── auth.ts                     # JWT helpers (if implemented)
├── public/
├── styles/
├── .env.local                      # (not in git)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json


Deployment
Recommended platforms:

Vercel (easiest & best for Next.js)
Netlify
Render
Railway

Make sure to set the environment variables in your hosting platform:

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
JWT_SECRET=your-very-long-random-secret-here

Security Notes

Change JWT_SECRET to a strong, random 32+ character string
Use HTTPS in production
Consider adding rate limiting & proper auth middleware

Todo / Planned Features

 User authentication & profiles
 Search functionality
 Comments / reactions on articles
 Marketplace listings & filters
 Admin dashboard
 Dark mode
 Newsletter signup

Contributing
Feel free to open issues and pull requests.