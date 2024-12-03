"use client";
import Image from "next/image";
import Hero from "./hero";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { FrameMetadata } from "@coinbase/onchainkit/frame";
// @ts-expect-error tsx not supported
import { useOCAuth } from "@opencampus/ocid-connect-js";
export default function Home() {
  const { authState } = useOCAuth();
  return (
    <div className="w-screen h-screen flex flex-col justify-center pt-2">
      {/* <FrameMetadata
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
          src: "https://nami-ai.vercel.app/logo.jpg",
          aspectRatio: "1:1",
        }}
        input={{
          text: "Tell me a boat story",
        }}
        state={{
          counter: 1,
        }}
        postUrl="https://nami-ai.vercel.app"
      />
      <img src={"/hero.png"} alt="hero" className="w-screen absolute" />
      <Hero /> */}
      <div className="relative bg-black w-[700px] h-[80%] rounded-xl mx-auto">
        <div className="absolute flex flex-col justify-center -top-[4px] -left-[4px] bg-[#ffd75f] w-[700px] mx-auto h-full rounded-xl border-[1px] border-black">
          <div className="flex justify-between items-center p-2"></div>
          <Image src={"/hero.jpg"} alt="hero" width={700} height={400} />
          <p className="text-center pt-2 font-bold text-xl sen tracking-wide">
            RobinX
          </p>
          <p className="text-center text-xs sen ">
            An autonomous AI agent that teaches web3 to users in the form of
            gamified quests.
          </p>
          <div className="flex justify-center py-2 ">
            <Button
              disabled={!authState?.isAuthenticated}
              variant={"outline"}
              className="rounded-sm bg-transparent border-0 hover:bg-transparent hover:border-2 hover:border-black hover:font-bold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
