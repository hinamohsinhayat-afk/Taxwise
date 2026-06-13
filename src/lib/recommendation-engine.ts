import { WizardAnswers, RecommendationResult } from "./types";
import { products } from "./products";

// Priority: corporate (nil < active) > expert-file > expert-help > self-employed > premier > deluxe > free
export function recommendProduct(answers: WizardAnswers): RecommendationResult {
  const matchedInputs: string[] = [];
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (!answers.filingType) warnings.push("Filing type is required.");
  if (!answers.incomeSources?.length) warnings.push("At least one income source is required.");
  if (!answers.helpPreference) warnings.push("Help preference is required.");
  if (answers.filingType === "incorporated" && answers.hasRevenue === undefined) {
    warnings.push("Revenue indicator is required for corporate filings.");
  }

  // "none" + specific deductions is a contradiction — specific ones win
  let deductions = [...(answers.deductions || [])];
  if (deductions.includes("none") && deductions.some((d) => d !== "none")) {
    warnings.push("You selected 'No special deductions' but also selected specific deductions. We prioritized your specific deductions.");
    deductions = deductions.filter((d) => d !== "none");
  }

  let productId = "free";

  if (answers.filingType === "incorporated") {
    if (answers.hasRevenue === false) {
      productId = "nil-corporate-return";
      matchedInputs.push("Filing Type: Incorporated", "Revenue: None ($0)");
      reasons.push("Incorporated companies with zero revenue qualify for our streamlined Nil Corporate Return.");
    } else {
      productId = "business-corporate";
      matchedInputs.push("Filing Type: Incorporated", "Revenue: Active revenue");
      reasons.push("Incorporated companies with active revenue require a complete T2 Corporate return filing.");
    }
  } else if (answers.helpPreference === "expert-file") {
    productId = "expert-full-service";
    matchedInputs.push("Help Preference: Expert Files For Me");
    reasons.push("You chose to hand over your tax preparation entirely to a certified tax professional.");
  } else if (answers.helpPreference === "expert-help") {
    productId = "expert-assist";
    matchedInputs.push("Help Preference: Live Expert Assist");
    reasons.push("You requested live chat/video help and a full professional review of your tax return.");
  } else {
    const hasSelfEmployedIncome = answers.incomeSources.some((i) => i === "freelance" || i === "gig");
    const hasSelfEmployedDeductions = deductions.some((d) => d === "business" || d === "home_office" || d === "vehicle");
    const hasPremierIncome = answers.incomeSources.some((i) => i === "investment" || i === "capital_gains" || i === "rental" || i === "foreign");
    const hasDeluxeDeductions = deductions.some((d) => d === "medical" || d === "donations" || d === "employment");

    if (answers.filingType === "self-employed" || hasSelfEmployedIncome || hasSelfEmployedDeductions) {
      productId = "self-employed";
      if (answers.filingType === "self-employed") matchedInputs.push("Filing Type: Self-Employed / Sole Proprietor");
      if (hasSelfEmployedIncome) {
        const matching = answers.incomeSources.filter((i) => i === "freelance" || i === "gig");
        matchedInputs.push(`Income: ${matching.map((i) => i === "freelance" ? "Freelance" : "Gig work").join(", ")}`);
      }
      if (hasSelfEmployedDeductions) {
        const matching = deductions.filter((d) => d === "business" || d === "home_office" || d === "vehicle");
        matchedInputs.push(`Expenses: ${matching.map((d) => d === "business" ? "Business" : d === "home_office" ? "Home Office" : "Vehicle").join(", ")}`);
      }
      reasons.push("Reporting freelance/gig income and writing off business, vehicle, or home office expenses requires a Self-Employed filing.");
    } else if (hasPremierIncome) {
      productId = "premier";
      const matching = answers.incomeSources.filter((i) => i === "investment" || i === "capital_gains" || i === "rental" || i === "foreign");
      matchedInputs.push(`Income: ${matching.map((i) => i === "investment" ? "Investments" : i === "capital_gains" ? "Capital Gains" : i === "rental" ? "Rental Property" : "Foreign").join(", ")}`);
      reasons.push("Investments, capital gains, rental properties, and foreign income require Premier forms to file correctly.");
    } else if (hasDeluxeDeductions) {
      productId = "deluxe";
      const matching = deductions.filter((d) => d === "medical" || d === "donations" || d === "employment");
      matchedInputs.push(`Deductions: ${matching.map((d) => d === "medical" ? "Medical" : d === "donations" ? "Donations" : "Employment").join(", ")}`);
      reasons.push("Claiming medical bills, donations, or employment expenses qualifies you for Deluxe to optimize your refunds.");
    } else {
      productId = "free";
      matchedInputs.push("Filing Type: Personal", "Income: Salary/Student", "Deductions: Standard Only");
      reasons.push("A simple return with only salary or student income and no custom deductions qualifies for our Free tax software.");
    }
  }

  const product = products.find((p) => p.id === productId) || products[0];

  let upgrade: RecommendationResult["optionalUpgrade"] = undefined;
  if (["free", "deluxe", "premier", "self-employed"].includes(productId)) {
    upgrade = { productId: "expert-assist", productName: "Expert Assist", reason: "Get a professional review of your tax return line-by-line via live video chat to ensure maximum savings and total peace of mind." };
  } else if (productId === "expert-assist") {
    upgrade = { productId: "expert-full-service", productName: "Expert Full Service", reason: "Avoid all tax filing stress. Upgrade to full service to have a certified tax accountant prepare and file everything for you." };
  }

  return {
    recommendedProductId: product.id,
    recommendedProductName: product.name,
    price: product.price,
    confidence: "high",
    reasons,
    matchedInputs,
    optionalUpgrade: upgrade,
    warnings: warnings.length ? warnings : undefined,
    disclaimer: "TaxWise recommendations are based on rules and your questionnaire inputs. Actual tax filing requirements depend on your detailed tax documents. Tax advice is not provided.",
  };
}
