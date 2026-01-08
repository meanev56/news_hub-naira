"use client";

import Link from "next/link";
import { Facebook, Twitter, Youtube, Linkedin, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-header text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Nairametrics</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              Nairametrics is Nigeria's leading independent source for business, financial & economic news.
              We provide actionable insights for professionals and investors.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/nairametrics" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/nairametrics" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/nairametrics" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/nairametrics" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/economy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Economy
                </Link>
              </li>
              <li>
                <Link href="/markets" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link href="/category/industries" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sectors
                </Link>
              </li>
              <li>
                <Link href="/category/financial-literacy-for-nigerians" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Financial Literacy
                </Link>
              </li>
              <li>
                <Link href="/category/exclusives" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Exclusives
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/nigeria-business-news" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Business News
                </Link>
              </li>
              <li>
                <Link href="/markets/equities" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Stock Market
                </Link>
              </li>
              <li>
                <Link href="/markets/cryptocurrency-news" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Cryptocurrency
                </Link>
              </li>
              <li>
                <Link href="/category/tech-news" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Tech News
                </Link>
              </li>
              <li>
                <Link href="/category/opinion-editorials" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Opinions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@nairametrics.com" className="hover:text-primary-foreground transition-colors">
                  info@nairametrics.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="font-medium mb-3">Newsletter</h5>
              <p className="text-xs text-primary-foreground/60 mb-3">
                Get the latest business news delivered to your inbox.
              </p>
              <NewsletterForm variant="stacked" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20 py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/80">
            <p>© {currentYear} Nairametrics. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
