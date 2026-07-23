import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"

const plannerSchema = z.object({
  study_hours: z.coerce.number({ invalid_type_error: "Required" }).min(0.5, "At least 0.5 hours").max(24, "24 hours or less"),
  mood: z.string().min(2, "Please tell us how you're feeling").max(200, "Keep it brief, under 200 characters"),
  diet: z.string().min(2, "Please share what you've eaten").max(200, "Keep it brief, under 200 characters"),
})

export type PlannerFormValues = z.infer<typeof plannerSchema>

interface PlannerFormProps {
  onSubmit: (data: PlannerFormValues) => void;
  isLoading: boolean;
}

export function PlannerForm({ onSubmit, isLoading }: PlannerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: { study_hours: undefined, mood: "", diet: "" }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="study_hours" className="text-base font-serif">How much time do you have today?</Label>
        <p className="text-sm text-muted-foreground mb-2">Be realistic about your available hours.</p>
        <div className="relative">
          <Input 
            id="study_hours" 
            type="number" 
            step="0.5" 
            placeholder="e.g. 4.5"
            className="pl-4 pr-12 text-lg font-medium"
            disabled={isLoading}
            {...register("study_hours")} 
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            hrs
          </span>
        </div>
        {errors.study_hours && <p className="text-sm text-destructive font-medium">{errors.study_hours.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood" className="text-base font-serif">How are you feeling right now?</Label>
        <p className="text-sm text-muted-foreground mb-2">Are you energized, anxious, groggy?</p>
        <Textarea 
          id="mood" 
          placeholder="I'm feeling a bit overwhelmed by my upcoming physics exam..."
          className="resize-none text-base min-h-[110px]"
          disabled={isLoading}
          {...register("mood")} 
        />
        {errors.mood && <p className="text-sm text-destructive font-medium">{errors.mood.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="diet" className="text-base font-serif">What have you been eating or drinking?</Label>
        <p className="text-sm text-muted-foreground mb-2">This helps us suggest brain-food adjustments.</p>
        <Textarea 
          id="diet" 
          placeholder="Two cups of coffee and a pastry so far..."
          className="resize-none text-base min-h-[110px]"
          disabled={isLoading}
          {...register("diet")} 
        />
        {errors.diet && <p className="text-sm text-destructive font-medium">{errors.diet.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full text-base gap-2 group mt-4" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
        )}
        {isLoading ? "Crafting your plan..." : "Create my study plan"}
      </Button>
    </form>
  )
}
