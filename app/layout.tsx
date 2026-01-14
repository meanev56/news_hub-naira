// app/layout.tsx
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/ReactQueryProvider"; // client wrapper
import './globals.css';
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: 'Nairametrics Clone',
  description: 'Nairametrics clone built with Next.js, Tailwind CSS, and Clerk',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {/* ClerkProvider must wrap all components needing auth */}
        <AuthProvider>
          {/* React Query provider for data fetching */}
          <ReactQueryProvider>
            {/* Tooltip provider */}
            <TooltipProvider>
              {/* Global toaster */}
              <Toaster />
              {/* Header */}
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
