import { PlannerResult } from "@workspace/api-client-react";
import { BookOpen, Coffee, Lightbulb, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

interface PlannerResultsProps {
  results: PlannerResult;
  onReset: () => void;
}

export function PlannerResults({ results, onReset }: PlannerResultsProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <section className="bg-card border border-border shadow-sm rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-primary/30 transition-colors">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60 rounded-l-2xl"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-2xl text-foreground">Your Plan</h3>
        </div>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
          {results.study_plan}
        </div>
      </section>

      <section className="bg-card border border-border shadow-sm rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-emerald-600/30 transition-colors">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600/50 rounded-l-2xl"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-600/10 rounded-xl">
            <Coffee className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
          </div>
          <h3 className="font-serif text-2xl text-foreground">Nourishment</h3>
        </div>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
          {results.diet_suggestion}
        </div>
      </section>

      <section className="bg-card border border-border shadow-sm rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/60 rounded-l-2xl"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          <h3 className="font-serif text-2xl text-foreground">A Thought For You</h3>
        </div>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-serif italic text-lg sm:text-xl text-foreground/80">
          "{results.motivation_message}"
        </div>
      </section>

      <div className="flex justify-center sm:justify-end mt-2">
        <Button variant="ghost" onClick={onReset} className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full px-6">
          <RefreshCcw className="w-4 h-4" />
          Plan Another Day
        </Button>
      </div>
    </div>
  )
}
