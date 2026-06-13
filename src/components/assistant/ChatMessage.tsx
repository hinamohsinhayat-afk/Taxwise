"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { Message } from "@/lib/types";
import Link from "next/link";
import Button from "@/components/ui/button";

interface ChatMessageProps {
  message: Message;
  recommendedProductInfo?: {
    reasons?: string[];
    disclaimer?: string;
  };
}

export default function ChatMessage({ message, recommendedProductInfo }: ChatMessageProps) {
  const isUser = message.role === "user";

  const formatTimestamp = () => {
    const ts = message.timestamp;
    if (ts instanceof Date) {
      return ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const parsed = Date.parse(ts);
    if (!isNaN(parsed)) {
      return new Date(parsed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return ts;
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
        {/* Label for AI messages */}
        {!isUser && (
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            TaxWise AI
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`px-5 py-3.5 text-[15px] leading-relaxed transition-all ${
            isUser
              ? "bg-[var(--primary)] text-white rounded-[18px_18px_4px_18px]"
              : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-[18px_18px_18px_4px]"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Recommended Product */}
          {!isUser && message.recommendedProduct && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[rgba(59,130,246,0.18)] text-[#93c5fd] text-[10px] font-medium rounded-[4px]">
                  Recommended
                </span>
                <span className="text-[13px] font-medium text-[var(--text-primary)]">
                  {message.recommendedProduct.name}
                </span>
                <span className="text-[13px] text-[var(--text-secondary)]">
                  ${message.recommendedProduct.price}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href="/recommend" className="flex-1">
                  <Button size="sm" className="w-full text-[12px]">
                    Choose Plan
                  </Button>
                </Link>
                <Link href="/compare" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full text-[12px]">
                    Compare
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Reasons */}
          {!isUser && recommendedProductInfo?.reasons && recommendedProductInfo.reasons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Key Factors
              </p>
              <ul className="space-y-1">
                {recommendedProductInfo.reasons.map((r: string, index: number) => (
                  <li key={index} className="text-[12px] text-[var(--text-muted)] leading-relaxed flex gap-2">
                    <span className="text-[var(--primary)]">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className={`text-[11px] ${isUser ? "text-[var(--text-muted)] text-right block" : "text-[var(--text-muted)]"}`}>
          {formatTimestamp()}
        </span>

        {/* Disclaimer */}
        {!isUser && recommendedProductInfo?.disclaimer && (
          <div className="flex items-start gap-1.5 text-[10px] text-[var(--text-muted)] italic pl-1">
            <ShieldAlert className="h-3 w-3 shrink-0 text-[var(--warning)] mt-0.5" />
            <span>{recommendedProductInfo.disclaimer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
