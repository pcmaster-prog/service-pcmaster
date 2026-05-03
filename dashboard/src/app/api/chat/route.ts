import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === "your_google_api_key_here") {
      return NextResponse.json(
        { error: "Google AI API Key no configurada. Por favor, añade tu clave en el archivo .env.local" },
        { status: 500 }
      );
    }

    // Get the model (Gemini 1.5 Flash is recommended for speed and efficiency)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Eres un asistente experto para 'Service PC Master', un taller de reparación de computadoras en Irapuato. Ayudas a los técnicos a gestionar órdenes, resumir fallas técnicas y dar consejos de reparación. Sé profesional, amable y conciso."
    });

    // Convert chat history for Gemini
    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Google AI Error:", error);
    return NextResponse.json({ error: "Error al comunicarse con Google AI Studio" }, { status: 500 });
  }
}
