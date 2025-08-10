import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface ProgressStep {
  id: string;
  title: string;
  completed: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  progress: number;
}

export const ProgressIndicator = ({ steps, currentStep, progress }: ProgressIndicatorProps) => {
  return (
    <div className="w-full bg-card p-6 rounded-xl shadow-card border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Assessment Progress</h3>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
      </div>
      
      <Progress value={progress} className="mb-6" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center gap-2 text-sm ${
              index === currentStep 
                ? 'text-primary font-medium' 
                : step.completed 
                  ? 'text-success' 
                  : 'text-muted-foreground'
            }`}
          >
            {step.completed ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <div className={`w-4 h-4 rounded-full border-2 ${
                index === currentStep 
                  ? 'border-primary bg-primary/20' 
                  : 'border-muted-foreground/30'
              }`} />
            )}
            <span className="whitespace-nowrap">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};