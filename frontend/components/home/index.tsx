"use client";

import Image from "next/image";
import { useState } from "react";
import Quests from "./quests";
import Completed from "./completed";
import World from "./world";
import Leaderboard from "./leaderboard";

export default function Home() {
  const nav = [
    {
      id: 1,
      name: "Quests",
      image: "/home/search.png",
    },
    {
      id: 2,
      name: "Completed",
      image: "/home/done.png",
    },
    {
      id: 3,
      name: "Worldcoin",
      image: "/home/bot.png",
    },
    {
      id: 4,
      name: "Leaderboard",
      image: "/home/trophy.png",
    },
  ];

  const [showWindows, setShowWindows] = useState([false, false, false, false]);
  return (
    <div className="flex justify-between h-screen">
      <div className="flex flex-col h-full justify-center space-y-12  px-6">
        {nav.map((i) => (
          <div
            key={i.id}
            className="relative bg-black w-[130px] h-[100px] rounded-sm"
          >
            <div
              onClick={() => {
                setShowWindows((prev) =>
                  prev.map((val, index) => (index === i.id - 1 ? !val : val))
                );
              }}
              className={`absolute flex flex-col items-center -top-[4px] -left-[4px] w-[130px] h-[100px] space-y-2 sen  rounded-sm text-sm border border-[2px] border-black p-2 cursor-pointer ${
                showWindows[i.id - 1]
                  ? "bg-[#ffd75f] text-black font-bold"
                  : "bg-[#131beb] text-white"
              }`}
            >
              <Image src={i.image} width={50} height={50} alt={i.name} />
              <p>{i.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex my-auto space-x-4 h-[80%] px-4">
        {showWindows[0] && (
          <Quests
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 0 ? !val : val))
              );
            }}
          />
        )}
        {showWindows[1] && (
          <Completed
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 1 ? !val : val))
              );
            }}
          />
        )}

        {showWindows[3] && (
          <Leaderboard
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 3 ? !val : val))
              );
            }}
          />
        )}
        {showWindows[2] && (
          <World
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 2 ? !val : val))
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
