// app/api/quiz/[pollId]/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { formatEther } from "viem";

const API_URL = JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "true")
  ? "http://localhost:" + process.env.NEXT_PUBLIC_LOCAL_AI_PORT
  : process.env.NEXT_PUBLIC_ROBINX_AI_ENDPOINT;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      "https://zrphknbmflnjyezigmay.supabase.co",
      process.env.SUPABASE_PUBLIC_ANON_KEY!
    );
    const { data: fetchedData, error } = await supabase
      .from("quiz")
      .select("*")
      .eq("hex_id", params.id)
      .single();
    console.log(fetchedData);
    if (error) throw error;

    const response = await fetch(fetchedData.data);
    const data = await response.json();
    console.log(data);

    const rewardResponse = await fetch(
      `${API_URL}/api/quiz/${params.id}/top-score-token-reward`
    );
    const rewardData = await rewardResponse.json();
    return NextResponse.json({
      ...data[0],
      topScoreTokenReward: formatEther(
        BigInt(rewardData[0].topScoreTokenReward)
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch quiz: ${error}` },
      { status: 500 }
    );
  }
}
