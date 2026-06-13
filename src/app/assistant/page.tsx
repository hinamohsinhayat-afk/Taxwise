"use client";

import React from "react";
import ChatInterface from "@/components/assistant/ChatInterface";

export default function AssistantPage() {
  return (
    <div className="h-[calc(100vh-64px)] bg-[var(--background)] px-6 lg:px-8 flex flex-col">
      <div className="mx-auto max-w-3xl w-full flex-1 flex flex-col py-6">
        <ChatInterface />
      </div>
    </div>
  );
}
