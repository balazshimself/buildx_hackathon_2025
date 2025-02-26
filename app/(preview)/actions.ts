"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const generateQuizTitle = async (file: string) => {
  const result = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the files provided as context",
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following file names. Try and extract as much info from the file names as possible. If the file names are just numbers or incoherent, just return quiz.\n\n " + file,
  });
  return result.object.title;
};
