import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="TaxWise"
                width={128}
                height={32}
                sizes="128px"
                className="h-8 w-auto"
              />
            </Link>
            <p className="max-w-xs text-[14px] text-[var(--text-secondary)] leading-relaxed">
              AI-powered Canadian tax software selector. Find the right package for your filing needs.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-16">
            <div>
              <h3 className="text-[12px] font-medium text-[var(--text-muted)] tracking-[0.08em] uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Compare
                  </Link>
                </li>
                <li>
                  <Link href="/recommend" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Wizard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-medium text-[var(--text-muted)] tracking-[0.08em] uppercase mb-4">
                Tools
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/assistant" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} TaxWise. All rights reserved.
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
