import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Add system message to guide the AI's responses
    const conversation = [
      {
        role: "system",
        content: `You are a helpful Sri Lanka travel guide assistant. Provide accurate, friendly information about:
- Tourist destinations in Sri Lanka
- Cultural sites and historical places
- Best times to visit different regions
- Transportation options
- Hotel and accommodation recommendations
- Local customs and etiquette
- Food and cuisine recommendations
- Travel tips and safety advice

Be concise but informative in your responses. If you don't know something, say you don't know rather than making up information.`,
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      temperature: 0.7,
    });

    return NextResponse.json({
      content:
        completion.choices[0]?.message?.content ||
        "I couldn't generate a response.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
