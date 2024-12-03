import React from "react";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatEther } from "viem";

function formatTimeAgo(attemptedAt: string): string {
  const now = new Date().getTime();
  const attemptTime = new Date(attemptedAt).getTime();
  const diffSeconds = Math.floor((now - attemptTime) / 1000);

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
  if (diffSeconds < 2592000)
    return `${Math.floor(diffSeconds / 86400)} days ago`;
  return `${Math.floor(diffSeconds / 2592000)} months ago`;
}
function ScoreMeter({ score }: { score: number }) {
  const getScoreColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center px-2">
      <p className="text-sm text-gray-600">Score</p>
      <div className="relative w-14 h-8">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <path
            d="M10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke={getScoreColor().replace("bg-", "text-")}
            strokeWidth="10"
            strokeDasharray={`${score} 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <span className="font-bold text-xs">{score}%</span>
        </div>
      </div>
    </div>
  );
}
export default function Completed({ close }: { close: () => void }) {
  const completedQuests = [
    {
      id: 1,
      imageUrl: "https://picsum.photos/200",
      title: "Basics of Web3",
      attemptedAt: new Date(Date.now() - 2000).toISOString(),
      reward: "12000000000000000000",
      score: 88,
    },
    {
      id: 2,
      imageUrl: "https://picsum.photos/200",
      title: "Basics of Web3",
      attemptedAt: new Date(Date.now() - 2000).toISOString(),
      reward: "6000000000000000000",
      score: 35,
    },
    {
      id: 3,
      imageUrl: "https://picsum.photos/200",
      title: "Basics of Web3",
      attemptedAt: new Date(Date.now() - 2000).toISOString(),
      reward: "98000000000000000000",
      score: 50,
    },
    {
      id: 4,
      imageUrl: "https://picsum.photos/200",
      title: "Basics of Web3",
      attemptedAt: new Date(Date.now() - 2000).toISOString(),
      reward: "12000000000000000000",
      score: 92,
    },
  ];

  return (
    <div className="w-[50%] relative bg-black h-full rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute flex flex-col items-center -top-[4px] -left-[4px] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#ffd75f] text-black`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">Completed Quests</p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        <Separator className="bg-black" />
        <div className="flex flex-col h-full w-full px-4 overflow-y-auto">
          {completedQuests.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-700">No quests available</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {completedQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="bg-black w-full rounded-lg relative h-[90px]"
                >
                  <div className="absolute w-full flex items-center space-x-4 bg-[#e7ccfc] border-black border-[2px] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={quest.imageUrl}
                        alt={quest.title}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{quest.title}</h3>
                      <span className="text-xs text-gray-600">
                        Completed {formatTimeAgo(quest.attemptedAt)}
                      </span>
                    </div>
                    <ScoreMeter score={quest.score} />
                    <div className="flex flex-col items-center space-y-1">
                      <p className="text-sm text-gray-600">Rewards</p>
                      <div className="flex items-center space-x-1">
                        <img
                          src={"/robin.jpg"}
                          alt={"RX"}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="font-medium text-lg pl-2">
                          {formatEther(BigInt(quest.reward))} {"RX"}
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
