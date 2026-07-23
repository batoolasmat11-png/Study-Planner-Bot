import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { GeneratePlanBody, GeneratePlanResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/planner/generate", async (req, res): Promise<void> => {
  const parsed = GeneratePlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) {
    res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not configured. Please add it as a secret in your Replit project." });
    return;
  }

  const openai = new OpenAI({ apiKey });

  const { study_hours, mood, diet } = parsed.data;

  const prompt = `You are a helpful student wellness and productivity coach.

A student has shared the following about their day:
- Study hours available today: ${study_hours}
- Current mood: ${mood}
- Recent diet / food intake: ${diet}

Please provide the following three things:

1. STUDY PLAN: A practical, personalised study plan for the available ${study_hours} hours. Break it into focused sessions with short breaks. Tailor the intensity and structure to their current mood.

2. DIET SUGGESTION: Specific, actionable food and drink tips to help them maintain energy and focus during their study session, based on what they've already eaten.

3. MOTIVATION MESSAGE: A warm, personal, uplifting message (2-4 sentences) that acknowledges their mood and encourages them. Make it feel genuine, not generic.

Respond in the following JSON format only, with no extra text:
{
  "study_plan": "...",
  "diet_suggestion": "...",
  "motivation_message": "..."
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(500).json({ error: "No response from OpenAI." });
      return;
    }

    const raw = JSON.parse(content);
    const result = GeneratePlanResponse.safeParse(raw);
    if (!result.success) {
      req.log.error({ error: result.error.message }, "OpenAI response did not match expected schema");
      res.status(500).json({ error: "Unexpected response format from AI." });
      return;
    }

    res.json(result.data);
  } catch (err) {
    req.log.error({ err }, "OpenAI request failed");
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: `AI request failed: ${message}` });
  }
});

export default router;
