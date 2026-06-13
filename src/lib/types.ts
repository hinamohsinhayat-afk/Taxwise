export type Product = {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  description: string;
  bestFor: string[];
  supports: {
    salaryIncome: boolean;
    studentIncome: boolean;
    medicalExpenses: boolean;
    donations: boolean;
    employmentExpenses: boolean;
    investmentIncome: boolean;
    capitalGains: boolean;
    foreignIncome: boolean;
    rentalIncome: boolean;
    freelanceIncome: boolean;
    gigWorkIncome: boolean;
    businessExpenses: boolean;
    homeOfficeExpenses: boolean;
    vehicleExpenses: boolean;
    expertHelp: boolean;
    fullService: boolean;
    corporateFiling: boolean;
    nilCorporateReturn: boolean;
  };
};

export type WizardAnswers = {
  filingType: "personal" | "self-employed" | "incorporated";
  incomeSources: string[];
  deductions: string[];
  helpPreference: "self" | "expert-help" | "expert-file";
  hasRevenue?: boolean;
};

export type RecommendationResult = {
  recommendedProductId: string;
  recommendedProductName: string;
  price: number;
  confidence: "low" | "medium" | "high";
  reasons: string[];
  matchedInputs: string[];
  optionalUpgrade?: { productId: string; productName: string; reason: string };
  warnings?: string[];
  disclaimer: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendedProduct?: {
    id: string;
    name: string;
    price: number;
  };
};
