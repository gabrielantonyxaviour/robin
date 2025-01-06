// app/api/quiz/[pollId]/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch quiz: ${error}` },
      { status: 500 }
    );
  }
}
