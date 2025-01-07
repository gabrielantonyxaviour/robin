import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { id: string };
}): Promise<Metadata> {
  const { id } = searchParams;
  return {
    title: "RobinX | Gamified Quests",
    description: "Daily Quiz " + parseInt(id, 16).toString(),
    openGraph: {
      title: "RobinX | Gamified Quests",
      description: "Daily Quiz " + parseInt(id, 16).toString(),
      images: ["https://robinx-ai.vercel.app/robin.jpg"],
    },
    other: {
      "twitter:player": `https://robinx-ai.vercel.app/quiz/${id}`,
      "x-frame-options": "ALLOWALL",
      "content-security-policy":
        "frame-ancestors 'self' https://twitter.com https://x.com;",
    },
    twitter: {
      card: "player",
      site: "https://x.com/EduRobinX",
      images: ["https://robinx-ai.vercel.app/robin.jpg"],
      title: "RobinX | Gamified Quests",
      description: "Daily Quiz " + parseInt(id, 16).toString(),
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
