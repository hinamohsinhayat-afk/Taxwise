import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { Message } from "@/lib/types";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const systemPrompt = `You are TaxWise AI, a helpful Canadian tax software assistant.
Your goal is to answer questions about which tax software package to choose and guide users based on their tax filing situation.

Our 8 products are:
1. Free ($0 CAD): Best for simple tax returns with only salary or student income, no deductions, and no expert help.
2. Deluxe ($30 CAD): Adds medical expenses, donations, and employment expenses.
3. Premier ($50 CAD): Adds investment income, capital gains, rental income, and foreign income.
4. Self-Employed ($70 CAD): Adds freelance income, gig work income, business expenses, home-office expenses, and vehicle expenses.
5. Expert Assist ($120 CAD): Adds expert live chat, video consultation, and a professional review of personal returns.
6. Expert Full Service ($250 CAD): A dedicated tax expert prepares, reviews, and files your return from start to finish.
7. Business Corporate ($400 CAD): Incorporations filing a corporate tax return (T2) with active operations/revenue.
8. Nil Corporate Return ($175 CAD): Incorporations filing a corporate return with zero operations/revenue in the tax year.

Recommendation engine priority order (highest priority wins):
1. Incorporated + no revenue -> Nil Corporate Return ($175)
2. Incorporated + revenue -> Business Corporate ($400)
3. Wants expert to prepare and file (helpPreference === "expert-file") -> Expert Full Service ($250)
4. Wants expert review/help (helpPreference === "expert-help") -> Expert Assist ($120)
5. Freelance/Gig/Business Expenses/Home-Office/Vehicle -> Self-Employed ($70)
6. Investment/Capital Gains/Rental/Foreign -> Premier ($50)
7. Medical/Donations/Employment Expenses -> Deluxe ($30)
8. Otherwise (Salary/Student only, no custom deductions, self-file) -> Free ($0)

STRICT SAFETY AND COMPLIANCE POLICIES:
- Never guarantee tax refunds or specific refund amounts.
- Never provide formal legal, financial, or tax preparation advice. Always advise consulting a certified tax professional or the Canada Revenue Agency (CRA) for complex filing.
- Always include a standard safety disclaimer.
- Always prefix product reasoning/explanations with "Based on the provided product rules...".
- Do not invent unsupported product features; strictly follow the provided product capabilities.

You MUST respond ONLY with a JSON object. Do not include markdown codeblocks or any text outside of the JSON object. The JSON structure must be:
{
  "answer": "Your detailed answer answering the user's question, addressing their concerns directly, while explaining product choices.",
  "recommendedProduct": {
    "id": "free | deluxe | premier | self-employed | expert-assist | expert-full-service | business-corporate | nil-corporate-return",
    "name": "Free | Deluxe | Premier | Self-Employed | Expert Assist | Expert Full Service | Business Corporate | Nil Corporate Return",
    "price": 0 | 30 | 50 | 70 | 120 | 250 | 400 | 175
  } or null,
  "confidence": "low | medium | high",
  "reasons": ["List of specific reasons based on their inputs that point to this recommendation"],
  "disclaimer": "Standard safety disclaimer text"
}`;

export async function POST(req: NextRequest) {
  try {
    const { question, conversationHistory = [] } = await req.json() as {
      question: string;
      conversationHistory: Message[];
    };

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Question parameter is required" }, { status: 400 });
    }

    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json({ error: "conversationHistory must be an array." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Check if Groq API key is present; if not, run simulation fallback for easy review/testing
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      console.warn("GROQ_API_KEY not set. Using rule-based local simulation for TaxWise AI.");
      const simulatedResponse = simulateResponse(question);
      return NextResponse.json(simulatedResponse);
    }

    // Prepare message history
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((m): ChatCompletionMessageParam => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: question.trim() },
    ];

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Failed to generate response from Groq." }, { status: 500 });
    }

    try {
      const parsedJson = JSON.parse(content);
      return NextResponse.json(normalizeAssistantPayload(parsedJson));
    } catch (parseErr) {
      console.error("JSON parsing error on Groq content:", content, parseErr);
      return NextResponse.json({
        answer: content,
        recommendedProduct: null,
        confidence: "medium",
        reasons: ["Failed to format structured reasons."],
        disclaimer: "Tax advice is not provided. Recommendations are for informational purposes only.",
      });
    }
  } catch (error: unknown) {
    console.error("Assistant API Error:", error);
    return NextResponse.json({ error: "Failed to get AI assistant response." }, { status: 500 });
  }
}

function normalizeAssistantPayload(payload: unknown) {
  const fallbackDisclaimer =
    "TaxWise AI provides product guidance only. It does not provide legal, financial, or tax advice, and it cannot guarantee refunds. Consult a certified tax professional or the CRA for complex filing questions.";

  if (!payload || typeof payload !== "object") {
    return {
      answer: "Based on the provided product rules, I could not format a complete product recommendation. Please share your filing type, income sources, deductions, and help preference.",
      recommendedProduct: null,
      confidence: "low",
      reasons: ["The assistant response was not structured."],
      disclaimer: fallbackDisclaimer,
    };
  }

  const value = payload as {
    answer?: unknown;
    recommendedProduct?: unknown;
    confidence?: unknown;
    reasons?: unknown;
    disclaimer?: unknown;
  };

  const answer =
    typeof value.answer === "string" && value.answer.startsWith("Based on the provided product rules")
      ? value.answer
      : `Based on the provided product rules, ${typeof value.answer === "string" ? value.answer : "I can help match your situation to a TaxWise AI product."}`;

  return {
    answer,
    recommendedProduct: value.recommendedProduct ?? null,
    confidence: value.confidence === "low" || value.confidence === "medium" || value.confidence === "high" ? value.confidence : "medium",
    reasons: Array.isArray(value.reasons) ? value.reasons.filter((reason) => typeof reason === "string") : [],
    disclaimer: typeof value.disclaimer === "string" && value.disclaimer.trim() ? value.disclaimer : fallbackDisclaimer,
  };
}

// Local simulation fallback for testing without GROQ_API_KEY
function simulateResponse(question: string) {
  const q = question.toLowerCase();
  
  let answer = "";
  let recommendedProduct: { id: string; name: string; price: number } | null = null;
  let reasons: string[] = [];
  
  const disclaimer = "TaxWise AI provides product guidance only. It does not provide legal, financial, or tax advice, and it cannot guarantee refunds. Consult a certified tax professional or the CRA for complex filing questions.";

  if (q.includes("refund") || q.includes("guarantee") || q.includes("how much")) {
    answer = "Based on the provided product rules, we cannot guarantee refunds or specific return amounts. However, our software is designed to guide you through all eligible deductions to ensure you file accurately. If you would like a certified professional to review your deductions and help maximize your refund, we highly recommend Expert Assist or Expert Full Service.";
    reasons = ["CRA compliance rules prevent refund guarantees", "Deductions require professional review for verification"];
    recommendedProduct = { id: "expert-assist", name: "Expert Assist", price: 120 };
  } else if (q.includes("incorporat") || q.includes("corporate") || q.includes("company") || q.includes("business return")) {
    if (q.includes("no revenue") || q.includes("zero revenue") || q.includes("nil") || q.includes("inactive")) {
      answer = "Based on the provided product rules, if your corporation was inactive or generated no revenue this tax year, you can file using the Nil Corporate Return. This covers your T2 filing requirements at a lower price point.";
      reasons = ["Incorporated status selected", "No active revenue reported for the fiscal year"];
      recommendedProduct = { id: "nil-corporate-return", name: "Nil Corporate Return", price: 175 };
    } else {
      answer = "Based on the provided product rules, active corporations must file a T2 Corporate Tax Return. Our Business Corporate package supports full corporate return preparation with business expense claims.";
      reasons = ["Incorporated company status", "Active business operations and revenue"];
      recommendedProduct = { id: "business-corporate", name: "Business Corporate", price: 400 };
    }
  } else if (q.includes("freelance") || q.includes("gig") || q.includes("uber") || q.includes("skip") || q.includes("business expense") || q.includes("sole propriet")) {
    answer = "Based on the provided product rules, sole proprietors, contractors, and freelance/gig workers need to report self-employment income and write off business expenses (like vehicle or home-office). The Self-Employed tier includes these tax schedules.";
    reasons = ["Self-employment or gig income reported", "Write-offs for business, home-office, or vehicle expenses needed"];
    recommendedProduct = { id: "self-employed", name: "Self-Employed", price: 70 };
  } else if (q.includes("invest") || q.includes("capital gain") || q.includes("rental") || q.includes("foreign") || q.includes("stock") || q.includes("crypto")) {
    answer = "Based on the provided product rules, reporting investment transactions, crypto capital gains, foreign assets, or rental property income requires our Premier tier. This package unlocks the schedules needed to report these schedules.";
    reasons = ["Investment or capital gains reporting required", "Rental income or foreign assets declared"];
    recommendedProduct = { id: "premier", name: "Premier", price: 50 };
  } else if (q.includes("medical") || q.includes("donation") || q.includes("charity") || q.includes("employment expense") || q.includes("childcare")) {
    answer = "Based on the provided product rules, if you need to claim medical bills, charitable donations, or employment-related write-offs, you qualify for our Deluxe software. It helps optimize standard deductions.";
    reasons = ["Claiming medical expenses or donations", "Deductions for employment expenses"];
    recommendedProduct = { id: "deluxe", name: "Deluxe", price: 30 };
  } else if (q.includes("expert") || q.includes("help") || q.includes("professional") || q.includes("talk to") || q.includes("accountant")) {
    if (q.includes("prepare") || q.includes("file for me") || q.includes("do it for me") || q.includes("full")) {
      answer = "Based on the provided product rules, if you want a professional to prepare, review, and file your tax return from start to finish, you should select Expert Full Service. You just hand off the tax documents and our experts handle the rest.";
      reasons = ["Requested complete hand-off of tax filing", "Requires full preparation by a certified professional"];
      recommendedProduct = { id: "expert-full-service", name: "Expert Full Service", price: 250 };
    } else {
      answer = "Based on the provided product rules, if you prefer to prepare your own return but want access to a tax expert for live guidance, answers to questions, and a line-by-line review before you file, you should select Expert Assist.";
      reasons = ["Requested professional review support", "Requires access to expert chat or video consultations"];
      recommendedProduct = { id: "expert-assist", name: "Expert Assist", price: 120 };
    }
  } else if (q.includes("free") || q.includes("simple") || q.includes("student") || q.includes("salary") || q.includes("only w2") || q.includes("only t4")) {
    answer = "Based on the provided product rules, a simple tax return with only basic employment (T4/salary) or student status and no custom deductions qualifies for our Free tax software tier. It allows you to prepare and file at no cost.";
    reasons = ["Simple salary/student income profile", "No specialized deductions or investments claimed"];
    recommendedProduct = { id: "free", name: "Free", price: 0 };
  } else {
    answer = "Based on the provided product rules, I can help you choose the right tax filing software package. Please tell me a bit about your situation: Is it for a personal or corporate return? Do you have salary, investments, freelance work, or active corporate revenue? Would you like a tax expert to review or file it for you?";
    reasons = ["Awaiting specific tax situation details"];
  }

  return {
    answer,
    recommendedProduct,
    confidence: "high",
    reasons,
    disclaimer
  };
}
