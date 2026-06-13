"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, HelpCircle, AlertCircle } from "lucide-react";
import { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import Button from "@/components/ui/button";

const starterQuestions = [
  "Which software fits a salary-only worker with no deductions?",
  "I do freelance writing and have home-office expenses. What matches?",
  "What is a Nil Corporate Return and who qualifies for it?",
  "Do you guarantee I will get a maximum tax refund?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [extraInfoMap, setExtraInfoMap] = useState<
    Record<
      string,
      {
        answer: string;
        recommendedProduct?: { id: string; name: string; price: number } | null;
        reasons?: string[];
        disclaimer?: string;
      }
    >
  >({});
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem("taxwise_chat_history");
    const savedMap = localStorage.getItem("taxwise_chat_extra_info");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
    if (savedMap) {
      try {
        setExtraInfoMap(JSON.parse(savedMap));
      } catch (e) {
        console.error("Failed to load extra info", e);
      }
    }
  }, []);

  const saveChatState = (
    newMsgs: Message[],
    newMap: Record<
      string,
      {
        answer: string;
        recommendedProduct?: { id: string; name: string; price: number } | null;
        reasons?: string[];
        disclaimer?: string;
      }
    >
  ) => {
    setMessages(newMsgs);
    setExtraInfoMap(newMap);
    localStorage.setItem("taxwise_chat_history", JSON.stringify(newMsgs));
    localStorage.setItem("taxwise_chat_extra_info", JSON.stringify(newMap));
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleClearChat = () => {
    saveChatState([], {});
  };

  const simulateTypingEffect = (
    fullText: string,
    messageId: string,
    onComplete: () => void
  ) => {
    const words = fullText.split(" ");
    let currentWordIdx = 0;
    let typedText = "";

    const timer = setInterval(() => {
      if (currentWordIdx < words.length) {
        typedText += (currentWordIdx === 0 ? "" : " ") + words[currentWordIdx];
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content: typedText } : msg))
        );
        currentWordIdx++;
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 30);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    saveChatState(updatedMessages, extraInfoMap);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          conversationHistory: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact server");
      }

      const data = await response.json();

      const botMsgId = `bot-${Date.now()}`;
      const botMsgPlaceholder: Message = {
        id: botMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        recommendedProduct: data.recommendedProduct || undefined,
      };

      saveChatState([...updatedMessages, botMsgPlaceholder], {
        ...extraInfoMap,
        [botMsgId]: data,
      });

      simulateTypingEffect(data.answer, botMsgId, () => {
        setIsTyping(false);
        setMessages((prev) => {
          const completedMessages = prev.map((msg) => (msg.id === botMsgId ? { ...msg, content: data.answer } : msg));
          localStorage.setItem("taxwise_chat_history", JSON.stringify(completedMessages));
          return completedMessages;
        });
      });
    } catch (err) {
      console.error(err);
      setIsTyping(false);

      const errorMsgId = `err-${Date.now()}`;
      const errorMsg: Message = {
        id: errorMsgId,
        role: "assistant",
        content: "Sorry, I encountered an issue. Please check your connection and try again.",
        timestamp: new Date(),
      };
      saveChatState([...updatedMessages, errorMsg], extraInfoMap);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">AI Assistant</h2>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">Ask about tax software and filing options</p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--error)] border border-[rgba(248,113,113,0.25)] rounded-[8px] hover:bg-[rgba(248,113,113,0.08)] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto min-h-0 space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">
              Ask TaxWise AI
            </h3>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">
              Describe your situation to find the right tax software.
            </p>
            
            {/* Suggested questions as chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {starterQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="px-4 py-2 text-[13px] text-[var(--text-secondary)] border border-[var(--border)] rounded-[10px] hover:border-[var(--border-hover)] hover:bg-[var(--surface)] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                recommendedProductInfo={extraInfoMap[msg.id]}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="space-y-2">
                  <span className="text-[11px] font-medium text-[var(--text-muted)]">
                    TaxWise AI
                  </span>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px_18px_18px_4px] px-5 py-4">
                    <div className="flex gap-1.5 items-center h-4">
                      <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] typing-dot" />
                      <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] typing-dot" />
                      <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-[var(--border)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-end gap-3"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={isTyping}
            rows={1}
            className="flex-grow resize-none rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] disabled:opacity-50 transition-all"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-[44px] w-[44px] p-0 flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>AI provides product guidance only, not tax advice</span>
        </div>
      </div>
    </div>
  );
}
