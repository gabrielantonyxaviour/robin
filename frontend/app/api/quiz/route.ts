import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_ROBINX_AI_ENDPOINT || "http://localhost:3001";

export async function GET(request: Request) {
  try {
    const response = await fetch(`${API_URL}/api/quiz`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch active quizzes" },
      { status: 500 }
    );
  }
}
