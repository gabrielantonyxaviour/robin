import { NextResponse } from "next/server";

const API_URL = JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "true")
  ? "http://localhost:" + process.env.NEXT_PUBLIC_LOCAL_AI_PORT
  : process.env.NEXT_PUBLIC_ROBINX_AI_ENDPOINT;
export async function POST(request: Request) {
  try {
    const { quiz, responses, address, pollId } = await request.json();

    console.log(`${API_URL}/api/calc-score`);
    console.log(
      JSON.stringify({
        quiz,
        responses,
        address,
        pollId,
      })
    );

    const response = await fetch(`${API_URL}/api/calc-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz,
        responses,
      }),
      cache: "no-store",
    });

    const data = await response.json();
    console.log("SCORE");
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error}` },
      { status: 500 }
    );
  }
}
