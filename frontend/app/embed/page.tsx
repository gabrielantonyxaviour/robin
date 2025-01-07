import type { Metadata } from "next";

export const metadata = {
  title: "RobinX | Gamified Quests",
  description:
    "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
  openGraph: {
    title: "RobinX | Gamified Quests",
    description:
      "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
    images: ["https://robinx-ai.vercel.app/robin.jpg"],
  },
  other: {
    "twitter:player": `https://robinx-ai.vercel.app/embed/0x1`,
    "x-frame-options": "ALLOWALL",
    "content-security-policy":
      "frame-ancestors 'self' https://twitter.com https://x.com;",
  },
  twitter: {
    card: "player",
    site: "https://x.com/EduRobinX",
    title: "RobinX | Gamified Quests",
    images: ["https://robinx-ai.vercel.app/robin.jpg"],
    description:
      "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
    players: [
      {
        playerUrl: `https://robinx-ai.vercel.app/embed/0x1`,
        streamUrl: `https://robinx-ai.vercel.app/embed/0x1`,
        width: 360,
        height: 560,
      },
    ],
  },
};
export default function EmbedPage() {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <iframe
        src={`https://robinx-ai.vercel.app/quiz/0x1`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        allow="fullscreen; web3"
      ></iframe>
    </div>
  );
}
