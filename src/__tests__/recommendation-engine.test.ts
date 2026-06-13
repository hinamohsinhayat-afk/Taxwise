import { describe, it, expect } from "vitest";
import { recommendProduct } from "@/lib/recommendation-engine";
import { WizardAnswers } from "@/lib/types";

function makeAnswers(overrides: Partial<WizardAnswers> = {}): WizardAnswers {
  return {
    filingType: "personal",
    incomeSources: ["salary"],
    deductions: ["none"],
    helpPreference: "self",
    hasRevenue: undefined,
    ...overrides,
  };
}

describe("Salary only → Free", () => {
  it("maps salary + no deductions to free plan", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("free");
    expect(r.recommendedProductName).toBe("Free");
    expect(r.price).toBe(0);
    expect(r.confidence).toBe("high");
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.reasons[0]).toContain("Free");
    expect(r.disclaimer).toBeTruthy();
    expect(r.disclaimer.length).toBeGreaterThan(10);
  });

  it("maps student-only income to free", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["student"], deductions: ["none"] }));
    expect(r.recommendedProductId).toBe("free");
    expect(r.price).toBe(0);
  });

  it("maps salary + student with no deductions to free", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary", "student"], deductions: ["none"] }));
    expect(r.recommendedProductId).toBe("free");
  });
});

describe("Salary + donations → Deluxe", () => {
  it("maps salary + donations to deluxe", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["donations"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("deluxe");
    expect(r.recommendedProductName).toBe("Deluxe");
    expect(r.price).toBe(30);
    expect(r.reasons.some((x) => /donation|deluxe/i.test(x))).toBe(true);
  });

  it("maps medical expenses to deluxe", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary"], deductions: ["medical"] }));
    expect(r.recommendedProductId).toBe("deluxe");
  });

  it("maps employment expenses to deluxe", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary"], deductions: ["employment"] }));
    expect(r.recommendedProductId).toBe("deluxe");
  });

  it("maps medical + donations combo to deluxe", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary"], deductions: ["medical", "donations"] }));
    expect(r.recommendedProductId).toBe("deluxe");
  });
});

describe("Investment / Rental → Premier", () => {
  it("maps investment income to premier", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary", "investment"],
      deductions: ["none"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("premier");
    expect(r.recommendedProductName).toBe("Premier");
    expect(r.price).toBe(50);
  });

  it("maps rental income to premier", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary", "rental"], deductions: ["none"] }));
    expect(r.recommendedProductId).toBe("premier");
    expect(r.price).toBe(50);
  });

  it("maps capital gains to premier", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary", "capital_gains"], deductions: ["none"] }));
    expect(r.recommendedProductId).toBe("premier");
  });

  it("maps foreign income to premier", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary", "foreign"], deductions: ["none"] }));
    expect(r.recommendedProductId).toBe("premier");
  });

  it("premier wins over deluxe-level deductions", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary", "investment", "rental", "capital_gains"],
      deductions: ["donations"],
    }));
    expect(r.recommendedProductId).toBe("premier");
  });
});

describe("Freelance / Home-office → Self-Employed", () => {
  it("maps freelance income to self-employed", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary", "freelance"],
      deductions: ["none"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("self-employed");
    expect(r.recommendedProductName).toBe("Self-Employed");
    expect(r.price).toBe(70);
  });

  it("maps gig work to self-employed", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary", "gig"], deductions: ["none"] }));
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("maps home-office deduction to self-employed", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary"], deductions: ["home_office"] }));
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("maps vehicle deduction to self-employed", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary"], deductions: ["vehicle"] }));
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("maps business expense deduction to self-employed", () => {
    const r = recommendProduct(makeAnswers({ incomeSources: ["salary"], deductions: ["business"] }));
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("self-employed filingType with matching deductions", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "self-employed",
      incomeSources: ["salary", "freelance"],
      deductions: ["home_office", "vehicle"],
    }));
    expect(r.recommendedProductId).toBe("self-employed");
  });
});

describe("Expert help preference → Expert Assist override", () => {
  it("overrides free plan with expert-assist", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "expert-help",
    }));
    expect(r.recommendedProductId).toBe("expert-assist");
    expect(r.recommendedProductName).toBe("Expert Assist");
    expect(r.price).toBe(120);
  });

  it("overrides deluxe with expert-assist", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["donations", "medical"],
      helpPreference: "expert-help",
    }));
    expect(r.recommendedProductId).toBe("expert-assist");
  });

  it("overrides self-employed with expert-assist", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary", "freelance"],
      deductions: ["home_office"],
      helpPreference: "expert-help",
    }));
    expect(r.recommendedProductId).toBe("expert-assist");
  });
});

describe("Expert file preference → Expert Full Service override", () => {
  it("overrides free plan with expert-full-service", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "expert-file",
    }));
    expect(r.recommendedProductId).toBe("expert-full-service");
    expect(r.recommendedProductName).toBe("Expert Full Service");
    expect(r.price).toBe(250);
  });

  it("overrides premier with expert-full-service", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary", "investment", "rental"],
      deductions: ["donations"],
      helpPreference: "expert-file",
    }));
    expect(r.recommendedProductId).toBe("expert-full-service");
  });

  it("overrides self-employed with expert-full-service", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["freelance", "gig"],
      deductions: ["business", "vehicle"],
      helpPreference: "expert-file",
    }));
    expect(r.recommendedProductId).toBe("expert-full-service");
  });
});

describe("Incorporated + revenue → Business Corporate", () => {
  it("maps incorporated with revenue to business-corporate", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "incorporated",
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "self",
      hasRevenue: true,
    }));
    expect(r.recommendedProductId).toBe("business-corporate");
    expect(r.recommendedProductName).toBe("Business Corporate");
    expect(r.price).toBe(400);
    expect(r.optionalUpgrade).toBeUndefined();
  });

  it("corporate overrides expert-help preference", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "incorporated",
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "expert-help",
      hasRevenue: true,
    }));
    expect(r.recommendedProductId).toBe("business-corporate");
  });

  it("corporate overrides expert-file preference", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "incorporated",
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "expert-file",
      hasRevenue: true,
    }));
    expect(r.recommendedProductId).toBe("business-corporate");
  });
});

describe("Incorporated + no revenue → Nil Corporate Return", () => {
  it("maps incorporated with zero revenue to nil-corporate-return", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "incorporated",
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "self",
      hasRevenue: false,
    }));
    expect(r.recommendedProductId).toBe("nil-corporate-return");
    expect(r.recommendedProductName).toBe("Nil Corporate Return");
    expect(r.price).toBe(175);
  });

  it("nil corporate overrides expert-file", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "incorporated",
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "expert-file",
      hasRevenue: false,
    }));
    expect(r.recommendedProductId).toBe("nil-corporate-return");
  });

  it("nil corporate overrides expert-help", () => {
    const r = recommendProduct(makeAnswers({
      filingType: "incorporated",
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "expert-help",
      hasRevenue: false,
    }));
    expect(r.recommendedProductId).toBe("nil-corporate-return");
  });
});

describe("Contradictory deductions edge case", () => {
  it("vehicle + none → self-employed with warning", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none", "vehicle"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("self-employed");
    expect(r.warnings).toBeDefined();
    expect(r.warnings!.some((w) => /no special deductions/i.test(w))).toBe(true);
  });

  it("donations + none → deluxe with warning", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none", "donations"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("deluxe");
    expect(r.warnings).toBeDefined();
    expect(r.warnings!.length).toBeGreaterThan(0);
  });

  it("home_office + none → self-employed with warning", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none", "home_office"],
      helpPreference: "self",
    }));
    expect(r.recommendedProductId).toBe("self-employed");
    expect(r.warnings).toBeDefined();
  });

  it("only 'none' produces no contradiction warning", () => {
    const r = recommendProduct(makeAnswers({
      incomeSources: ["salary"],
      deductions: ["none"],
      helpPreference: "self",
    }));
    expect(r.warnings).toBeUndefined();
  });
});

describe("Structural integrity", () => {
  it("always returns a disclaimer", () => {
    const r = recommendProduct(makeAnswers());
    expect(typeof r.disclaimer).toBe("string");
    expect(r.disclaimer.length).toBeGreaterThan(20);
  });

  it("confidence is always 'high' for deterministic engine", () => {
    const cases: Partial<WizardAnswers>[] = [
      { incomeSources: ["salary"], deductions: ["none"] },
      { incomeSources: ["freelance"], deductions: ["business"] },
      { incomeSources: ["investment"], deductions: ["none"] },
      { helpPreference: "expert-help" },
      { helpPreference: "expert-file" },
      { filingType: "incorporated", hasRevenue: true },
      { filingType: "incorporated", hasRevenue: false },
    ];
    for (const o of cases) {
      expect(recommendProduct(makeAnswers(o)).confidence).toBe("high");
    }
  });

  it("returns non-empty matchedInputs and reasons", () => {
    const r = recommendProduct(makeAnswers());
    expect(r.matchedInputs.length).toBeGreaterThan(0);
    expect(r.reasons.length).toBeGreaterThan(0);
  });

  it("suggests expert-assist upgrade for lower-tier plans", () => {
    const plans = [
      makeAnswers({ incomeSources: ["salary"], deductions: ["none"] }),
      makeAnswers({ incomeSources: ["salary"], deductions: ["donations"] }),
      makeAnswers({ incomeSources: ["investment"], deductions: ["none"] }),
      makeAnswers({ incomeSources: ["freelance"], deductions: ["none"] }),
    ];
    for (const a of plans) {
      const r = recommendProduct(a);
      expect(r.optionalUpgrade?.productId).toBe("expert-assist");
    }
  });

  it("suggests expert-full-service upgrade for expert-assist", () => {
    const r = recommendProduct(makeAnswers({ helpPreference: "expert-help" }));
    expect(r.optionalUpgrade?.productId).toBe("expert-full-service");
  });

  it("no upgrade for corporate or full-service plans", () => {
    expect(recommendProduct(makeAnswers({ filingType: "incorporated", hasRevenue: true })).optionalUpgrade).toBeUndefined();
    expect(recommendProduct(makeAnswers({ filingType: "incorporated", hasRevenue: false })).optionalUpgrade).toBeUndefined();
    expect(recommendProduct(makeAnswers({ helpPreference: "expert-file" })).optionalUpgrade).toBeUndefined();
  });

  it("correct price for every product tier", () => {
    const prices: Record<string, number> = {
      free: 0, deluxe: 30, premier: 50, "self-employed": 70,
      "expert-assist": 120, "expert-full-service": 250,
      "business-corporate": 400, "nil-corporate-return": 175,
    };
    const inputs: Partial<WizardAnswers>[] = [
      { incomeSources: ["salary"], deductions: ["none"] },
      { incomeSources: ["salary"], deductions: ["donations"] },
      { incomeSources: ["investment"], deductions: ["none"] },
      { incomeSources: ["freelance"], deductions: ["none"] },
      { helpPreference: "expert-help" },
      { helpPreference: "expert-file" },
      { filingType: "incorporated", hasRevenue: true },
      { filingType: "incorporated", hasRevenue: false },
    ];
    for (const o of inputs) {
      const r = recommendProduct(makeAnswers(o));
      expect(r.price).toBe(prices[r.recommendedProductId]);
    }
  });
});
