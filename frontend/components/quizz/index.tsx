"use client";

import Image from "next/image";
import { FrameMetadata } from "@coinbase/onchainkit/frame";
import { useState } from "react";

export default function Quizz() {
  const [showWindows, setShowWindows] = useState([false, false, false, false]);
  return (
    <div className="flex justify-between h-screen">
      <FrameMetadata
        buttons={[
          {
            label: "Tell me the story",
          },
          {
            action: "link",
            label: "Link to Google",
            target: "https://www.google.com",
          },
          {
            action: "post_redirect",
            label: "Redirect to cute pictures",
          },
        ]}
        image={{
          src: "https://robinx-ai.vercel.app/frames/rules.png",
          aspectRatio: "1.91:1",
        }}
        input={{
          text: "Tell me a boat story",
        }}
        state={{
          counter: 1,
        }}
        postUrl="https://robinx-ai.vercel.app"
      />
      <div className="flex flex-col h-full justify-center space-y-12  px-6"></div>
    </div>
  );
}
