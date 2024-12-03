import type { Metadata } from "next";
import Home from "@/components/home";

export const metadata: Metadata = {
  title: "RobinX | Home",
  description:
    "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
};

export default function HomePage() {
  return <Home />;
}
