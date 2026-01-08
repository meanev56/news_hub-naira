// app/layout.tsx
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/ReactQueryProvider"; // client wrapper
import { ClerkProvider } from "@clerk/nextjs";
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClerkProvider>
          <ReactQueryProvider>
            <TooltipProvider>
              <Toaster />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </TooltipProvider>
          </ReactQueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
