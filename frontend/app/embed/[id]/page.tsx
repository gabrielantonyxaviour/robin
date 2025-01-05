export const metadata = {
  title: "Embedded Content",
};

export default function EmbedPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <iframe
        src={"https://robinx-ai.vercel.app/quiz/" + params.id}
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
