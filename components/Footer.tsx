"use client";

import Link from "next/link";
import { Facebook, Twitter, Youtube, Linkedin, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const socialLinks: { href: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { href: "https://facebook.com/nairametrics", icon: Facebook },
  { href: "https://twitter.com/nairametrics", icon: Twitter },
  { href: "https://youtube.com/nairametrics", icon: Youtube },
  { href: "https://linkedin.com/company/nairametrics", icon: Linkedin },
];

const categories = [
  { label: "Economy", path: "/category/economy" },
  { label: "Markets", path: "/markets" },
  { label: "Sectors", path: "/category/industries" },
  { label: "Financial Literacy", path: "/category/financial-literacy-for-nigerians" },
  { label: "Exclusives", path: "/category/exclusives" },
];

const quickLinks = [
  { label: "Business News", path: "/category/nigeria-business-news" },
  { label: "Stock Market", path: "/markets/equities" },
  { label: "Cryptocurrency", path: "/markets/cryptocurrency-news" },
  { label: "Tech News", path: "/category/tech-news" },
  { label: "Opinions", path: "/category/opinion-editorials" },
];

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
              {socialLinks.map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
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
              <FooterLink label="Privacy Policy" href="#" />
              <FooterLink label="Terms of Service" href="#" />
              <FooterLink label="About Us" href="#" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="hover:text-primary-foreground transition-colors">
      {label}
    </Link>
  );
}
