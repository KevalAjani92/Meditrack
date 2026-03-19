"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface BookingStepperProps {
  currentStep: number;
}

const steps = [
  "Hospital", "Department", "Doctor", "Date & Time", "Symptoms", "Review"
];

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
        
        {/* Animated Active Line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isActive 
                      ? "bg-background border-primary text-primary" 
                      : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium absolute -bottom-6 whitespace-nowrap ${
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