import type { Metadata } from "next";
import Landing from "@/components/landing";

export const metadata: Metadata = {
  title: "RobinX | Landing",
  description:
    "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
};

export default function LandingPage() {
  return <Landing />;
}
