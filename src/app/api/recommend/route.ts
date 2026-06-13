import { NextRequest, NextResponse } from "next/server";
import { recommendProduct } from "@/lib/recommendation-engine";
import { WizardAnswers } from "@/lib/types";

const filingTypes = new Set(["personal", "self-employed", "incorporated"]);
const helpPreferences = new Set(["self", "expert-help", "expert-file"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const answers = ("answers" in body ? (body as { answers?: unknown }).answers : body) as WizardAnswers;
    const { filingType, incomeSources, deductions, helpPreference, hasRevenue } = answers;

    // Validate request schema
    if (!filingType || !filingTypes.has(filingType)) {
      return NextResponse.json({ error: "Filing type is required." }, { status: 400 });
    }
    if (!incomeSources || !Array.isArray(incomeSources) || incomeSources.length === 0) {
      return NextResponse.json({ error: "At least one income source is required." }, { status: 400 });
    }
    if (!incomeSources.every((source) => typeof source === "string")) {
      return NextResponse.json({ error: "Income sources must be strings." }, { status: 400 });
    }
    if (!Array.isArray(deductions)) {
      return NextResponse.json({ error: "Deductions must be an array." }, { status: 400 });
    }
    if (!deductions.every((deduction) => typeof deduction === "string")) {
      return NextResponse.json({ error: "Deductions must be strings." }, { status: 400 });
    }
    if (!helpPreference || !helpPreferences.has(helpPreference)) {
      return NextResponse.json({ error: "Help preference is required." }, { status: 400 });
    }
    if (filingType === "incorporated" && typeof hasRevenue !== "boolean") {
      return NextResponse.json({ error: "Incorporated filing requires a revenue indicator." }, { status: 400 });
    }

    // Run pure recommendation rules
    const recommendation = recommendProduct(answers);

    return NextResponse.json(recommendation);
  } catch (error: unknown) {
    console.error("Recommendation API Error:", error);
    return NextResponse.json({ error: "Failed to evaluate recommendation." }, { status: 500 });
  }
}
