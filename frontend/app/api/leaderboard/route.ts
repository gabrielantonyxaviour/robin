import { NextResponse } from "next/server";

const API_URL = JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "true")
  ? "http://localhost:" + process.env.NEXT_PUBLIC_LOCAL_AI_PORT
  : process.env.NEXT_PUBLIC_ROBINX_AI_ENDPOINT;
export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/leaderboard`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
