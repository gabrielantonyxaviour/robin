import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  const dataResponse = await fetch("/api/quiz/" + id);
  const metadata = await dataResponse.json();

  return {
    title: "Daily Quiz " + parseInt(id, 16).toString(),
    description: metadata.topic,
    openGraph: {
      title: "Daily Quiz " + parseInt(id, 16).toString(),
      description: metadata.topic,
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
      title: "Daily Quiz " + parseInt(id, 16).toString(),
      description: metadata.topic,
      images: ["https://robinx-ai.vercel.app/robin.jpg"],
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
export default function EmbedPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <iframe
        src={`https://robinx-ai.vercel.app/quiz/${params.id}`}
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
