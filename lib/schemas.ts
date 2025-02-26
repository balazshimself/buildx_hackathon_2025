import { z } from "zod";

export const questionsSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    answer: z.enum(["A", "B", "C", "D", "E"]),
    explanation: z.string(),
    subtopic: z.number(),
  })

export type Question = z.infer<typeof questionsSchema>;

export const responseSchema = z.array(questionsSchema);
