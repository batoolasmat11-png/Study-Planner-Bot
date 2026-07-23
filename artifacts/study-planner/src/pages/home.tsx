import { useState } from "react";
import { PlannerForm, type PlannerFormValues } from "@/components/PlannerForm";
import { PlannerResults } from "@/components/PlannerResults";
import { useGeneratePlan, type PlannerResult } from "@workspace/api-client-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Home() {
  const [results, setResults] = useState<PlannerResult | null>(null);
  const [resetCount, setResetCount] = useState(0);
  
  const { mutate: generatePlan, isPending } = useGeneratePlan({
    mutation: {
      onSuccess: (data) => {
        setResults(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (error) => {
        console.error("Failed to generate plan:", error);
        toast.error("We couldn't generate your plan right now.", {
          description: "Please check your connection and try again.",
        });
      }
    }
  });

  const handleSubmit = (data: PlannerFormValues) => {
    setResults(null);
    generatePlan({ data });
  };

  const handleReset = () => {
    setResults(null);
    setResetCount(c => c + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-primary/20">
      <div className="w-full max-w-5xl">
        <header className={cn(
          "text-center transition-all duration-1000 ease-in-out",
          results ? "mb-8 lg:mb-12" : "mb-12 lg:mb-16"
        )}>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-4">
            Study & Wellness
          </h1>
          <p className="text-muted-foreground font-sans text-lg sm:text-xl max-w-xl mx-auto font-light leading-relaxed">
            A calm corner to plan your day. Tell us where you are right now, and we'll help map the way forward.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className={cn(
            "bg-card border border-border/60 shadow-sm rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 ease-in-out z-10 relative",
            results ? "lg:col-span-4" : "lg:col-span-8 lg:col-start-3"
          )}>
            <div className={cn("transition-opacity duration-500", isPending && "opacity-50 pointer-events-none")}>
               <PlannerForm key={resetCount} onSubmit={handleSubmit} isLoading={isPending} />
            </div>
          </div>

          {/* Results Column */}
          {results && (
            <div className="lg:col-span-8">
               <PlannerResults results={results} onReset={handleReset} />
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative background elements to enhance the 'calm corner' vibe */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>
    </div>
  );
}
