import { responseSchema } from "@/lib/schemas"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Timeout to 30 seconds
export const maxDuration = 30



export async function POST(req: Request) {
  try {
    console.log("Beginning POST")
    const { files, mainTopic, subTopics } = await req.json()

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_API_KEY
    
    // Verify API key exists
    if (!apiKey) {
      console.error("Missing Google API Key")
      throw new Error("Google API Key is not configured")
    }

    // Initialize the Gemini API with your API key
    const genAI = new GoogleGenerativeAI(apiKey)    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })

    // Prepare file content
    const fileContents = files.map((file: { data: string; type: string; name: string }) => 
      `File: ${file.name}\nContent: ${file.data}\n\n`
    ).join("")

    // Create the prompt
    const prompt = `You are an expert teacher creating a multiple choice quiz. Follow these guidelines:
    1. Create concise, clear questions based on the provided documents
    2. Generate exactly 5 options per question with exactly one right answer
    3. Ensure options are similar in length and style
    4. Mark the correct answer as A, B, C, D or E
    5. Focus on key concepts from the documents
    6. Create 2-3 questions per subtopic
    7. Respond in valid JSON format that matches this schema:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
        "answer": "A", // One of: A, B, C, D, E
        "explanation": "Explanation of why this answer is correct",
        "subtopic": 1 // Subtopic index
      },
      // More questions...
    ]

    Create a multiple choice quiz covering:
    Main Topic: ${mainTopic}
    Subtopics: ${subTopics.join(", ")}
    
    Use the content from these documents to create relevant questions:
    ${fileContents}`

    console.log("REACHED THE CHECKPOINT - Sending to Gemini API")
    
    // Make direct API call
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      })
      
      const responseText = result.response.text()
      console.log("Received response from Gemini API")
      
      // Extract the JSON from the response
      let jsonData
      try {
        // Try to parse the raw response
        jsonData = JSON.parse(responseText)
      } catch (e) {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (jsonMatch && jsonMatch[1]) {
          jsonData = JSON.parse(jsonMatch[1].trim())
        } else {
          throw new Error("Failed to extract valid JSON from response")
        }
      }
      
      console.log(`Parsed JSON data: ${jsonData.length}`)
      
      // Validate the parsed data

      const validatedResponse = responseSchema.parse(jsonData)
      
      console.log("Validated data, sending response")
      
      return new Response(JSON.stringify(validatedResponse), {
        headers: { "Content-Type": "application/json" }
      })
    } catch (error) {
      console.error("Gemini API error:", error)
      throw error
    }
    
  } catch (error) {
    console.error("API error:", error)
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate quiz. Please try again.",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}