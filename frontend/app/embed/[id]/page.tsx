import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: "Embedded Content",
    description:
      "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
    openGraph: {
      title: "RobinX | Gamified Quests",
      description:
        "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
      images: ["/robin.jpg"],
    },
    other: {
      "twitter:player": `https://robinx-ai.vercel.app/embed/${params.id}`,
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
          playerUrl: `https://robinx-ai.vercel.app/embed/${params.id}`,
          streamUrl: `https://robinx-ai.vercel.app/embed/${params.id}`,
          width: 360,
          height: 560,
        },
      ],
    },
  };
}
export default function EmbedPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <iframe
        src={`/quiz/${params.id}`}
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
