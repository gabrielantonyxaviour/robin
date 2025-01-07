import type { Metadata } from "next";
import { useSearchParams } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { id: string };
}): Promise<Metadata> {
  const { id } = searchParams;
  return {
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
      "twitter:player": `https://robinx-ai.vercel.app/embed/${id}`,
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
          playerUrl: `https://robinx-ai.vercel.app/embed/${id}`,
          streamUrl: `https://robinx-ai.vercel.app/embed/${id}`,
          width: 360,
          height: 560,
        },
      ],
    },
  };
}
export default function EmbedPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <iframe
        src={`https://robinx-ai.vercel.app/quiz/${searchParams.id}`}
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