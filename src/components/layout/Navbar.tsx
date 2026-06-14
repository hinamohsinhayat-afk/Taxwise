"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname?.startsWith(href + "/");
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/compare", label: "Compare" },
  { href: "/recommend", label: "Wizard" },
  { href: "/assistant", label: "Assistant" },
  { href: "/admin/products", label: "Admin", icon: Shield },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[rgba(5,10,20,0.8)] backdrop-blur-[12px] border-b border-[var(--border)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="TaxWise"
            width={128}
            height={32}
            sizes="128px"
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-[14px] font-medium rounded-[8px] transition-colors flex items-center gap-1.5 ${
                  active
                    ? "text-[var(--text-primary)] bg-[rgba(255,255,255,0.05)]"
                    : link.href === "/admin/products"
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link 
            href="/recommend" 
            className="hidden md:inline-flex px-4 py-2 text-[14px] font-medium bg-[var(--primary)] text-white rounded-[10px] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Get Started
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--border)] md:hidden text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[var(--border)] bg-[var(--background)] md:hidden w-full overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => {
                const active = isActiveLink(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center rounded-[10px] px-4 py-3 text-[15px] font-medium transition-colors ${
                      active
                        ? "bg-[rgba(37,99,235,0.1)] text-[var(--primary)] border border-[rgba(37,99,235,0.2)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
