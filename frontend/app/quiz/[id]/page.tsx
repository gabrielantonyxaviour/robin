import type { Metadata } from "next";
import Quiz from "@/components/quiz";

export const metadata: Metadata = {
  title: "RobinX | Quiz",
  description:
    "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
};

export default function QuizzPage({ params }: { params: { id: string } }) {
  return <Quiz id={params.id} />;
}
