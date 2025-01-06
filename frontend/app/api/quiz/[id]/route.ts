import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_ROBINX_AI_ENDPOINT || "http://localhost:3001";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/api/quiz/${params.id}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
