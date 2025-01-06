import { PinataSDK } from "pinata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { quiz, responses } = await request.json();

    const response = await fetch(
      JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "true")
        ? "http://localhost:" +
            process.env.NEXT_PUBLIC_LOCAL_AI_PORT +
            "/api/calc-score"
        : process.env.NEXT_PUBLIC_ROBINX_AI_ENDPOINT || "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz,
          responses,
        }),
      }
    );

    const data = await response.json();
    console.log("SCORE");
    console.log(data.score);
    return NextResponse.json({ score: data.score });
  } catch (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error}` },
      { status: 500 }
    );
  }
}
