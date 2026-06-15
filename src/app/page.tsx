"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/button";
import Accordion from "@/components/ui/accordion";
import { products } from "@/lib/products";

// Animated Counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 1.2;
    const incrementTime = Math.max(Math.floor((duration * 1000) / end), 30);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const faqItems = [
  {
    id: "faq-1",
    title: "Which tax package should I choose if I only have employment income?",
    content: "If you only have salary employment income (T4) and/or student tuition slips (T2202) with no custom deductions, you qualify for our Free package. It supports standard personal filings at zero cost.",
  },
  {
    id: "faq-2",
    title: "Do I need a self-employed plan for ride-sharing or freelance writing?",
    content: "Yes. Reporting income from sole proprietorships, Uber, SkipTheDishes, freelance writing, or contracting requires filing a T2125 schedule. Our Self-Employed package fully supports these income streams and business expense write-offs.",
  },
  {
    id: "faq-3",
    title: "Can I talk to a real accountant on TaxWise?",
    content: "Absolutely. Selecting either the Expert Assist or Expert Full Service packages grants you access to real Canadian tax professionals. Expert Assist includes chat/video consultations and a professional final return review, while Full Service prepares and files everything for you.",
  },
  {
    id: "faq-4",
    title: "What is a Nil Corporate Return?",
    content: "A Nil Corporate Return is a specialized, low-cost filing ($175) for incorporated businesses that did not generate any active operational revenue, operations, or transactions during the fiscal tax year but are still legally required to file a T2 return to the CRA.",
  },
  {
    id: "faq-5",
    title: "Can the AI Assistant guarantee my CRA refund amount?",
    content: "No. TaxWise is a recommendation tool to help select the correct software filing tier. Under CRA compliance and safety guidelines, no platform can guarantee tax refund amounts. Always check actual CRA forms before submitting your filing.",
  },
  {
    id: "faq-6",
    title: "How does the recommendation wizard work?",
    content: "Our wizard asks a series of questions about your filing type, income sources, and deductions. Based on your answers, our rule-based engine matches you to the most appropriate tax software package with high accuracy.",
  },
];

const steps = [
  {
    number: "01",
    title: "Select your filing type",
    description: "Choose between personal, self-employed, or corporate tax filing based on your situation.",
  },
  {
    number: "02",
    title: "Answer a few questions",
    description: "Tell us about your income sources and deductions for a precise recommendation.",
  },
  {
    number: "03",
    title: "Get your match",
    description: "Receive your recommended plan with pricing, features, and optional upgrades.",
  },
];

export default function LandingPage() {
  const previewProducts = products.filter((p) => ["free", "self-employed", "premier", "expert-assist"].includes(p.id));


  return (
    <div className="relative overflow-hidden bg-[var(--background)] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
        
        {/* Blue orb behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--primary)] opacity-[0.12] blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.12)] mb-8"
          >
            <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[var(--accent)]">
              AI-Powered Tax Guidance
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-[40px] md:text-[72px] leading-[1.05] font-extrabold tracking-[-0.03em] text-[var(--text-primary)]"
          >
            Find the right tax software.{" "}
            <span className="text-[var(--text-secondary)]">No confusion.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 text-[18px] text-[var(--text-secondary)] max-w-[520px] mx-auto leading-[1.7]"
          >
            Take our rule-based diagnostic quiz or chat with our AI assistant to find the perfect Canadian tax software for your situation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/recommend">
              <Button className="gap-2 group">
                <span>Start the Quiz</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button variant="ghost">
                Compare Plans
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-8 text-[13px] text-[var(--text-muted)]"
          >
            Trusted by 10,000+ Canadians
          </motion.p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-[var(--border)]">
            <div className="text-center px-8">
              <div className="text-[48px] font-bold text-[var(--primary)] tracking-tight">
                <AnimatedCounter value={8} />
              </div>
              <p className="mt-2 text-[14px] text-[var(--text-muted)]">Plans</p>
            </div>
            <div className="text-center px-8">
              <div className="text-[48px] font-bold text-[var(--primary)] tracking-tight">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <p className="mt-2 text-[14px] text-[var(--text-muted)]">Rule-Based</p>
            </div>
            <div className="text-center px-8">
              <div className="text-[48px] font-bold text-[var(--primary)] tracking-tight">
                AI
              </div>
              <p className="mt-2 text-[14px] text-[var(--text-muted)]">Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[40px] font-semibold tracking-tight text-[var(--text-primary)]"
          >
            Three steps to clarity
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative"
              >
                {/* Large step number background */}
                <span className="absolute -top-4 -left-2 text-[80px] font-extrabold text-[var(--text-primary)] opacity-[0.04] select-none pointer-events-none">
                  {step.number}
                </span>
                
                <div className="relative">
                  <h3 className="text-[20px] font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-[var(--text-secondary)] leading-[1.6]">
                    {step.description}
                  </p>
                </div>

                {/* Dashed connector line (desktop only, not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 border-t border-dashed border-[var(--border)]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="relative py-32 px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[40px] font-semibold tracking-tight text-[var(--text-primary)]"
          >
            Every situation. One right answer.
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewProducts.map((product, index) => {
              const isMostPopular = product.id === "self-employed";
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.08, y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 }}
                    className={`relative bg-[var(--surface)] border rounded-[16px] p-7 cursor-pointer transition-shadow duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35),0_0_60px_rgba(34,211,238,0.15)] ${
                      isMostPopular
                        ? "border-[var(--primary)] shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                  {/* Most Popular badge */}
                  {isMostPopular && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-[var(--primary)] text-white text-[11px] font-medium tracking-[0.08em] uppercase rounded-[6px]">
                      Most Popular
                    </div>
                  )}

                  {/* Price badge top right */}
                  <div className={`absolute top-6 right-6 px-2.5 py-1 rounded-[6px] text-[12px] font-medium ${
                    product.price === 0 
                      ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(34,211,238,0.35)]" 
                      : "bg-[rgba(59,130,246,0.15)] text-[#93c5fd] border border-[rgba(59,130,246,0.35)]"
                  }`}>
                    {product.price === 0 ? "Free" : `$${product.price}`}
                  </div>

                  {/* Product name */}
                  <h3 className="text-[20px] font-semibold text-[var(--text-primary)] pr-16">
                    {product.name}
                  </h3>

                  {/* Feature tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(product.supports)
                      .filter(([, supported]) => supported)
                      .slice(0, 3)
                      .map(([key]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.03)] border border-[var(--border)] rounded-[6px] text-[11px] text-[var(--text-secondary)]"
                        >
                          <Check className="h-3 w-3 text-[var(--success)]" />
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).slice(0, 20)}
                        </span>
                      ))}
                  </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12">
            <Link href="/products">
              <Button variant="ghost" className="gap-2 group">
                <span>View all plans</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="mx-auto max-w-[680px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[40px] font-semibold tracking-tight text-[var(--text-primary)]"
          >
            Questions, answered
          </motion.h2>

          <div className="mt-12">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>
    </div>
  );
}
