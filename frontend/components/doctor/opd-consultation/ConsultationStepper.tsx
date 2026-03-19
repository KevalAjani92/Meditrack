"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

const steps = ["Profile", "Consultation", "Prescription", "Tests", "Follow Up", "Summary"];

export default function ConsultationStepper({ currentStep, setStep }: { currentStep: number, setStep: (s: number) => void }) {
  
  // Calculate exact percentage based on current step
  const safeStep = Math.min(Math.max(currentStep, 1), steps.length);
  const progressPercentage = ((safeStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-6 overflow-x-auto no-scrollbar bg-card border-b border-border">
      <div className="flex items-center justify-between relative min-w-[600px] max-w-4xl mx-auto px-4">
        
        {/* FIX: The track wrapper.
          Parent has px-4 (1rem padding). Circles are w-8 (2rem width).
          Center of first circle = 1rem + 1rem = 2rem (which is left-8 in Tailwind).
          We span the background track exactly from center to center.
        */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full">
          
          {/* Animated Active Progress Track */}
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(stepNum)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isActive 
                      ? "bg-background border-primary text-primary scale-110 shadow-sm" 
                      : "bg-background border-muted text-muted-foreground"
                }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-xs font-semibold absolute -bottom-6 whitespace-nowrap transition-colors duration-300 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}