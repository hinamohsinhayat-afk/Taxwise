"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Building2,
  TrendingUp,
  FileText,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { WizardAnswers, RecommendationResult as ResultType } from "@/lib/types";
import { products } from "@/lib/products";
import Button from "@/components/ui/button";
import WizardProgress from "@/components/wizard/WizardProgress";
import WizardStep from "@/components/wizard/WizardStep";
import RecommendationResult from "@/components/wizard/RecommendationResult";

function RecommendPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgradeParam = searchParams.get("upgrade");
  const planParam = searchParams.get("plan");

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>({
    filingType: "personal",
    incomeSources: [],
    deductions: [],
    helpPreference: "self",
    hasRevenue: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);

  // Map product ID to pre-filled wizard answers
  const getAnswersFromPlan = (planId: string): WizardAnswers => {
    const product = products.find((p) => p.id === planId);
    if (!product) return { filingType: "personal", incomeSources: [], deductions: [], helpPreference: "self", hasRevenue: undefined };

    const s = product.supports;
    let filingType: WizardAnswers["filingType"] = "personal";
    if (s.corporateFiling || s.nilCorporateReturn) filingType = "incorporated";
    else if (s.freelanceIncome || s.gigWorkIncome || s.businessExpenses) filingType = "self-employed";

    const incomeSources: string[] = [];
    if (s.salaryIncome) incomeSources.push("salary");
    if (s.studentIncome) incomeSources.push("student");
    if (s.investmentIncome) incomeSources.push("investment");
    if (s.capitalGains) incomeSources.push("capital_gains");
    if (s.rentalIncome) incomeSources.push("rental");
    if (s.foreignIncome) incomeSources.push("foreign");
    if (s.freelanceIncome) incomeSources.push("freelance");
    if (s.gigWorkIncome) incomeSources.push("gig");

    const deductions: string[] = [];
    if (s.medicalExpenses) deductions.push("medical");
    if (s.donations) deductions.push("donations");
    if (s.employmentExpenses) deductions.push("employment");
    if (s.businessExpenses) deductions.push("business");
    if (s.homeOfficeExpenses) deductions.push("home_office");
    if (s.vehicleExpenses) deductions.push("vehicle");
    if (deductions.length === 0) deductions.push("none");

    let helpPreference: WizardAnswers["helpPreference"] = "self";
    if (s.fullService) helpPreference = "expert-file";
    else if (s.expertHelp) helpPreference = "expert-help";

    const hasRevenue = s.nilCorporateReturn ? false : s.corporateFiling ? true : undefined;

    return { filingType, incomeSources, deductions, helpPreference, hasRevenue };
  };

  useEffect(() => {
    if (planParam) {
      const prefill = getAnswersFromPlan(planParam);
      setAnswers(prefill);
      const product = products.find((p) => p.id === planParam);
      setSelectedPlanName(product?.name ?? null);
      submitAnswers(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planParam]);

  useEffect(() => {
    if (upgradeParam) {
      handleUpgrade(upgradeParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeParam]);
  const isIncorporated = answers.filingType === "incorporated";
  
  const stepNames = isIncorporated
    ? ["Filing Type", "Income", "Deductions", "Help", "Revenue", "Result"]
    : ["Filing Type", "Income", "Deductions", "Help", "Result"];

  const totalSteps = stepNames.length;

  const toggleIncomeSource = (source: string) => {
    setAnswers((prev) => {
      const exists = prev.incomeSources.includes(source);
      const updated = exists
        ? prev.incomeSources.filter((s) => s !== source)
        : [...prev.incomeSources, source];
      return { ...prev, incomeSources: updated };
    });
  };

  const toggleDeduction = (deduction: string) => {
    setAnswers((prev) => {
      let updated = [...prev.deductions];
      
      if (deduction === "none") {
        updated = ["none"];
      } else {
        updated = updated.filter((d) => d !== "none");
        const exists = updated.includes(deduction);
        if (exists) {
          updated = updated.filter((d) => d !== deduction);
        } else {
          updated.push(deduction);
        }
      }
      return { ...prev, deductions: updated };
    });
  };

  const canGoNext = () => {
    if (currentStep === 1) return !!answers.filingType;
    if (currentStep === 2) return answers.incomeSources.length > 0;
    if (currentStep === 3) return answers.deductions.length > 0;
    if (currentStep === 4) return !!answers.helpPreference;
    if (currentStep === 5 && isIncorporated) return answers.hasRevenue !== undefined;
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;

    if (currentStep === 4 && !isIncorporated) {
      submitAnswers(answers);
    } else if (currentStep === 5 && isIncorporated) {
      submitAnswers(answers);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 6 && !isIncorporated) {
      setCurrentStep(4);
      setResult(null);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (currentStep === totalSteps) {
        setResult(null);
      }
    }
  };

  const submitAnswers = useCallback(async (payload: WizardAnswers) => {
    setIsLoading(true);
    setCurrentStep(totalSteps);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate recommendation");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to compile recommendation. Please try again.");
      setCurrentStep(4);
    } finally {
      setIsLoading(false);
    }
  }, [totalSteps]);

  const handleUpgrade = useCallback(async (upgradeId: string) => {
    setIsLoading(true);
    const upgradedAnswers: WizardAnswers = {
      ...answers,
      helpPreference: upgradeId === "expert-full-service" ? "expert-file" : "expert-help",
    };
    setAnswers(upgradedAnswers);
    await submitAnswers(upgradedAnswers);
  }, [answers, submitAnswers]);

  const restartQuiz = () => {
    setAnswers({
      filingType: "personal",
      incomeSources: [],
      deductions: [],
      helpPreference: "self",
      hasRevenue: undefined,
    });
    setResult(null);
    setSelectedPlanName(null);
    setCurrentStep(1);
    router.replace("/recommend");
  };

  // Option card component for single-select
  const OptionCard = ({ 
    selected, 
    onClick, 
    icon: Icon, 
    title, 
    description 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    icon: React.ComponentType<{ className?: string }>; 
    title: string; 
    description: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-[16px] border text-left transition-all duration-200 ${
        selected
          ? "border-[var(--primary)] bg-[rgba(59,130,246,0.1)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] shrink-0 ${
        selected ? "bg-[rgba(59,130,246,0.18)]" : "bg-[rgba(255,255,255,0.03)]"
      }`}>
        <Icon className={`h-5 w-5 ${selected ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-[16px] font-medium ${selected ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}>
          {title}
        </h3>
        <p className="mt-1 text-[13px] text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      </div>
      <div className={`h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 transition-all ${
        selected ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[var(--border)]"
      }`}>
        {selected && <Check className="h-full w-full text-white p-0.5" strokeWidth={3} />}
      </div>
    </button>
  );

  // Checkbox card for multi-select
  const CheckboxCard = ({ 
    selected, 
    onClick, 
    title, 
    description 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    title: string; 
    description: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-[12px] border text-left transition-all duration-200 ${
        selected
          ? "border-[var(--primary)] bg-[rgba(59,130,246,0.1)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-medium text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
          {description}
        </p>
      </div>
      {selected && (
        <div className="h-5 w-5 rounded-[6px] bg-[var(--primary)] flex items-center justify-center shrink-0">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] py-16 md:py-24 px-6">
      <div className="mx-auto max-w-[640px]">
        {/* Wizard Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] p-8 md:p-10">
          
          {/* Progress */}
          {!isLoading && !result && (
            <div className="mb-10">
              <WizardProgress
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepNames={stepNames}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative h-12 w-12 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">Analyzing your profile</h3>
                <p className="mt-2 text-[14px] text-[var(--text-muted)] max-w-xs">
                  Matching your answers to the right plan...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <RecommendationResult
                  result={result}
                  onRestart={restartQuiz}
                  onUpgrade={handleUpgrade}
                  selectedPlanName={selectedPlanName}
                />
              </motion.div>
            ) : (
              <div className="min-h-[360px]">
                {/* Step 1: Filing Type */}
                {currentStep === 1 && (
                  <WizardStep
                    title="What type of return are you filing?"
                    subtitle="Select the profile that matches your situation."
                  >
                    <div className="space-y-3">
                      <OptionCard
                        selected={answers.filingType === "personal"}
                        onClick={() => setAnswers({ ...answers, filingType: "personal" })}
                        icon={User}
                        title="Personal Return"
                        description="Salary income, students, investments, and common deductions."
                      />
                      <OptionCard
                        selected={answers.filingType === "self-employed"}
                        onClick={() => setAnswers({ ...answers, filingType: "self-employed" })}
                        icon={TrendingUp}
                        title="Self-Employed"
                        description="Freelancers, contractors, gig workers, and sole proprietors."
                      />
                      <OptionCard
                        selected={answers.filingType === "incorporated"}
                        onClick={() => setAnswers({ ...answers, filingType: "incorporated" })}
                        icon={Building2}
                        title="Incorporated Business"
                        description="Active corporations and holding companies filing T2 returns."
                      />
                    </div>
                  </WizardStep>
                )}

                {/* Step 2: Income Sources */}
                {currentStep === 2 && (
                  <WizardStep
                    title="Select all sources of income"
                    subtitle="Choose all that apply from your tax year."
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "salary", label: "Employment Salary (T4)", desc: "Standard salary or wage income" },
                        { id: "student", label: "Student Tuition", desc: "T2202 tuition slips" },
                        { id: "investment", label: "Investments & Dividends", desc: "T3/T5 slips and interest" },
                        { id: "capital_gains", label: "Capital Gains", desc: "Stocks, crypto, or assets" },
                        { id: "rental", label: "Rental Income", desc: "T776 rental property" },
                        { id: "foreign", label: "Foreign Income", desc: "Income from abroad" },
                        { id: "freelance", label: "Freelance / Sole Prop", desc: "Contracting and small business" },
                        { id: "gig", label: "Gig Work", desc: "Uber, DoorDash, etc." },
                      ].map((src) => (
                        <CheckboxCard
                          key={src.id}
                          selected={answers.incomeSources.includes(src.id)}
                          onClick={() => toggleIncomeSource(src.id)}
                          title={src.label}
                          description={src.desc}
                        />
                      ))}
                    </div>
                  </WizardStep>
                )}

                {/* Step 3: Deductions */}
                {currentStep === 3 && (
                  <WizardStep
                    title="What deductions do you have?"
                    subtitle="Select all that apply."
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "medical", label: "Medical Expenses", desc: "Prescriptions, dental, health plans" },
                        { id: "donations", label: "Charitable Donations", desc: "Official donation receipts" },
                        { id: "employment", label: "Employment Expenses", desc: "T2200 signed by employer" },
                        { id: "business", label: "Business Expenses", desc: "Operating costs and supplies" },
                        { id: "home_office", label: "Home Office", desc: "Workspace and internet" },
                        { id: "vehicle", label: "Vehicle Expenses", desc: "Fuel, lease, or mileage" },
                        { id: "none", label: "No special deductions", desc: "Standard deductions only" },
                      ].map((ded) => (
                        <CheckboxCard
                          key={ded.id}
                          selected={answers.deductions.includes(ded.id)}
                          onClick={() => toggleDeduction(ded.id)}
                          title={ded.label}
                          description={ded.desc}
                        />
                      ))}
                    </div>
                  </WizardStep>
                )}

                {/* Step 4: Help Preference */}
                {currentStep === 4 && (
                  <WizardStep
                    title="How would you like to file?"
                    subtitle="Choose your preferred level of assistance."
                  >
                    <div className="space-y-3">
                      <OptionCard
                        selected={answers.helpPreference === "self"}
                        onClick={() => setAnswers({ ...answers, helpPreference: "self" })}
                        icon={FileText}
                        title="File Yourself"
                        description="Follow guided steps to prepare and file your own return."
                      />
                      <OptionCard
                        selected={answers.helpPreference === "expert-help"}
                        onClick={() => setAnswers({ ...answers, helpPreference: "expert-help" })}
                        icon={MessageCircle}
                        title="Expert Guidance"
                        description="Chat/video support and professional review of your return."
                      />
                      <OptionCard
                        selected={answers.helpPreference === "expert-file"}
                        onClick={() => setAnswers({ ...answers, helpPreference: "expert-file" })}
                        icon={Sparkles}
                        title="Expert Prep & File"
                        description="An accountant prepares and files everything for you."
                      />
                    </div>
                  </WizardStep>
                )}

                {/* Step 5 (Conditional): Corporate Revenue */}
                {currentStep === 5 && isIncorporated && (
                  <WizardStep
                    title="Did the corporation earn revenue?"
                    subtitle="This determines your filing type."
                  >
                    <div className="space-y-3">
                      <OptionCard
                        selected={answers.hasRevenue === true}
                        onClick={() => setAnswers({ ...answers, hasRevenue: true })}
                        icon={TrendingUp}
                        title="Active Revenue"
                        description="The company earned revenue, has operations, or assets to file."
                      />
                      <OptionCard
                        selected={answers.hasRevenue === false}
                        onClick={() => setAnswers({ ...answers, hasRevenue: false })}
                        icon={Building2}
                        title="No Revenue ($0)"
                        description="Inactive, pre-revenue, or holding company with zero activity."
                      />
                    </div>
                  </WizardStep>
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!isLoading && !result && (
            <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="ghost"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="gap-2"
              >
                <span>
                  {(isIncorporated && currentStep === 5) || (!isIncorporated && currentStep === 4) 
                    ? "Get Match" 
                    : "Next"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecommendPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    }>
      <RecommendPageContent />
    </Suspense>
  );
}
