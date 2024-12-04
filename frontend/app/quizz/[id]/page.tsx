import type { Metadata } from "next";
import Landing from "@/components/landing";
import Quizz from "@/components/quizz";

export const metadata: Metadata = {
  title: "RobinX | Quizz",
  description:
    "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
};

export default function QuizzPage() {
  return <Quizz />;
}
