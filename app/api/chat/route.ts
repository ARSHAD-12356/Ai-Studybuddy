import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, documentContext, chatHistory } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Get the generative model (try different models if one fails)
    let model
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    } catch (error) {
      // Fallback to older model if flash is unavailable
      model = genAI.getGenerativeModel({ model: "gemini-pro" })
    }

    // Prepare the system prompt for study assistance
    const systemPrompt = `You are an AI study assistant designed to help students learn and understand their study materials. Your role is to:

1. Help explain complex concepts in simple, easy-to-understand terms
2. Answer questions about study materials and documents
3. Create study guides, summaries, and flashcards
4. Provide helpful learning strategies and tips
5. Encourage active learning and critical thinking

Guidelines:
- Be encouraging and supportive
- Break down complex topics into digestible parts
- Use examples and analogies when helpful
- Ask follow-up questions to ensure understanding
- If you don't know something, admit it and suggest how to find the answer
- Keep responses focused on educational content

${documentContext ? `Context from document: ${documentContext}` : ""}

Please respond to the student's question in a helpful, educational manner.`

    // Prepare conversation history for context
    let conversationHistory = []
    
    // Add system prompt
    conversationHistory.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    })
    
    conversationHistory.push({
      role: "model",
      parts: [{ text: "Hello! I'm your AI study assistant. I'm here to help you understand your study materials, answer questions, and support your learning journey. What would you like to learn about today?" }]
    })

    // Add previous chat history if provided
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        if (msg.sender === "user") {
          conversationHistory.push({
            role: "user",
            parts: [{ text: msg.content }]
          })
        } else if (msg.sender === "ai") {
          conversationHistory.push({
            role: "model",
            parts: [{ text: msg.content }]
          })
        }
      })
    }

    // Add current message
    conversationHistory.push({
      role: "user",
      parts: [{ text: message }]
    })

    // Start chat session with history
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1), // All except the last message
    })

    // Send the message and get response
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error in chat API:", error)
    
    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid API key configuration" },
          { status: 401 }
        )
      }
      if (error.message.includes("quota") || error.message.includes("overloaded")) {
        return NextResponse.json(
          { error: "AI service is currently busy. Please try again in a moment." },
          { status: 429 }
        )
      }
      if (error.message.includes("503") || error.message.includes("Service Unavailable")) {
        return NextResponse.json(
          { error: "AI service is temporarily unavailable. Please try again shortly." },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    )
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: "Gemini AI Chat API is running",
    status: "active"
  })
}