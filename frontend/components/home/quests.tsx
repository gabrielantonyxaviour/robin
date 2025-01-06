"use client";

import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import { title } from "process";
import { useEffect, useState } from "react";
import { formatEther, parseUnits } from "viem";
import { useEnvironmentStore } from "../context";
import { Quest } from "@/lib/type";
import { useRouter } from "next/navigation";

function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return "Expired";

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s remaining`;
  }
  return `${remainingSeconds}s remaining`;
}

function QuestTimer({
  createdAt,
  validity,
}: {
  createdAt: string;
  validity: number;
}) {
  const calculateTimeLeft = () => {
    const startTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    return Math.max(0, validity - elapsedSeconds);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, createdAt, validity]);

  const getTimerColor = () => {
    if (timeLeft <= 0) return "text-red-500";
    if (timeLeft < 3600) return "text-orange-500"; // less than 1 hour
    if (timeLeft < 86400) return "text-yellow-500"; // less than 1 day
    return "text-green-500";
  };

  return (
    <span className={`text-xs font-medium ${getTimerColor()}`}>
      {formatTimeLeft(timeLeft)}
    </span>
  );
}

export default function Quests({ close }: { close: () => void }) {
  // const quests = [
  //   {
  //     id: 1,
  //     imageUrl: "https://picsum.photos/300",
  //     title: "Introduction to DeFi",
  //     createdAt: new Date(Date.now() - 10000).toISOString(),
  //     validity: 7200,
  //     reward: "15000000000000000000",
  //   },
  //   {
  //     id: 2,
  //     imageUrl: "https://picsum.photos/400",
  //     title: "Understanding NFTs",
  //     createdAt: new Date(Date.now() - 5000).toISOString(),
  //     validity: 5400,
  //     reward: "8000000000000000000",
  //   },
  //   {
  //     id: 3,
  //     imageUrl: "https://picsum.photos/500",
  //     title: "Blockchain Basics",
  //     createdAt: new Date(Date.now() - 15000).toISOString(),
  //     validity: 3600,
  //     reward: "20000000000000000000",
  //   },
  //   {
  //     id: 4,
  //     imageUrl: "https://picsum.photos/600",
  //     title: "Crypto Wallets 101",
  //     createdAt: new Date(Date.now() - 8000).toISOString(),
  //     validity: 4800,
  //     reward: "1000000000000000000",
  //   },
  // ];

  const { active } = useEnvironmentStore((store) => store);
  const router = useRouter();
  return (
    <div className="w-[50%] relative bg-black h-full rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute flex flex-col items-center -top-[4px] -left-[4px] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#ffd75f] text-black`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">Current Quests</p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        <Separator className="bg-black" />
        <div className="flex flex-col h-full w-full px-4 overflow-y-auto">
          {active.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-700">No quests available</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {active.map((quest: Quest, i) => (
                <div
                  key={quest.id}
                  className="bg-black w-full rounded-lg relative h-[90px]"
                >
                  <div
                    className="absolute w-full flex items-center space-x-4 bg-[#e7ccfc] border-black border-[2px] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      router.push("/quiz/" + quest.questId);
                    }}
                  >
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={"https://picsum.photos/" + (300 + i * 100)}
                        alt={quest.title}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{quest.title}</h3>
                      <QuestTimer
                        createdAt={new Date(
                          Number(quest.createdAt + "000")
                        ).toISOString()}
                        validity={quest.validity}
                      />
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <p className="text-sm text-gray-600">Reward up to</p>
                      <div className="flex items-center space-x-1">
                        <img
                          src={"/robin.jpg"}
                          alt={"RX"}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="font-medium text-lg pl-2">
                          {formatEther(BigInt(quest.topScoreTokenReward))}{" "}
                          {"RX"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
