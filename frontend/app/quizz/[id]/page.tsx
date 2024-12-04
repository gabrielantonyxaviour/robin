import type { Metadata } from "next";
import Landing from "@/components/landing";
import Quizz from "@/components/quizz";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: "RobinX | Quizz",
    description:
      "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
    other: {
      ...(await fetchMetadata(
        new URL(
          "/quizz/" + params.id,
          !JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false")
            ? `https://robinx-ai.vercel.app`
            : "http://localhost:3000"
        )
      )),
    },
  };
}

export default function QuizzPage() {
  return <Quizz />;
}
