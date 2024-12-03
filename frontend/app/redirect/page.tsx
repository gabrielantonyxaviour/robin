import Redirect from "@/components/redirect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RobinX | Login Callback",
  description:
    "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
};

export default function RedirectPage() {
  return <Redirect />;
}
