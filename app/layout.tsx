// app/layout.tsx
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/ReactQueryProvider"; // client wrapper
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Nairametrics Clone",
  description: "Nairametrics clone built with Next.js 13, Tailwind CSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
 {/* suppressHydrationWarning applied to body to prevent hydration errors */}
      <body suppressHydrationWarning className="bg-background text-foreground">        {/* Providers */}
        <AuthProvider>
          <ReactQueryProvider>
            <TooltipProvider>
              <Toaster />
              {/* Header - usually a server component */}
              <Header />
              {/* Main content */}
              <main className="flex-1">{children}</main>
              {/* Footer */}
              <Footer />
            </TooltipProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
