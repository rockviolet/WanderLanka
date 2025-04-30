import { tourPlanSchema } from "@/schemas/tour-plan";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type TourPlanSchema = z.infer<typeof tourPlanSchema>;

export async function POST(request: Request) {
  try {
    // Validate the request body
    const body = await request.json();
    const validatedData = tourPlanSchema.parse(body);

    // Calculate trip duration in days
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    const tripDuration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Prepare the prompt for OpenAI
    const prompt = `Create a detailed tour plan for a trip in Sri Lanka with these parameters:
- Start location: ${validatedData.startLocation}
- End location: ${validatedData.endLocation}
- Duration: ${tripDuration} days (${validatedData.startDate} to ${
      validatedData.endDate
    })
- Vehicle type: ${validatedData.vehicle}
- Number of travelers: ${validatedData.numOfMembers}
- Travel type: ${validatedData.travelType}
${
  validatedData.description
    ? `- Additional notes: ${validatedData.description}`
    : ""
}

The response should be in JSON format with this structure:
{
  "summary": "Brief overview of the tour",
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "from": "Starting point",
      "to": "Destination",
      "activities": ["Activity 1", "Activity 2"],
      "accommodation": "Recommended place to stay",
      "travelTime": "Estimated travel duration",
      "notes": "Any important notes"
    }
  ],
  "recommendations": {
    "packingTips": ["Item 1", "Item 2"],
    "diningSuggestions": ["Place 1", "Place 2"],
    "safetyTips": ["Tip 1", "Tip 2"]
  },
  "estimatedCost": {
    "transportation": "Estimated cost",
    "accommodation": "Estimated cost",
    "activities": "Estimated cost",
    "total": "Total estimated cost"
  }
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable Sri Lanka tour guide. Provide detailed, practical tour plans in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse and validate the response
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    const tourPlan = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      data: tourPlan,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
