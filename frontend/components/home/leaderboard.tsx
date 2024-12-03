"use client";

import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockData = [
  {
    position: 1,
    wallet: "0x1234...5678",
    attempted: 45,
    avgScore: 92.5,
    rewards: "1500",
  },
  {
    position: 2,
    wallet: "0x8765...4321",
    attempted: 42,
    avgScore: 89.3,
    rewards: "1000",
  },
  {
    position: 3,
    wallet: "0x9876...1234",
    attempted: 38,
    avgScore: 85.7,
    rewards: "500",
  },
  {
    position: 4,
    wallet: "0x2468...1357",
    attempted: 36,
    avgScore: 84.2,
    rewards: "400",
  },
  {
    position: 5,
    wallet: "0x1357...2468",
    attempted: 35,
    avgScore: 83.1,
    rewards: "300",
  },
  {
    position: 6,
    wallet: "0x3579...2468",
    attempted: 33,
    avgScore: 82.5,
    rewards: "200",
  },
  {
    position: 7,
    wallet: "0x4680...1359",
    attempted: 31,
    avgScore: 81.8,
    rewards: "150",
  },
  {
    position: 8,
    wallet: "0x5791...2468",
    attempted: 30,
    avgScore: 80.4,
    rewards: "100",
  },
  {
    position: 9,
    wallet: "0x6802...1357",
    attempted: 28,
    avgScore: 79.6,
    rewards: "75",
  },
  {
    position: 10,
    wallet: "0x7913...2468",
    attempted: 27,
    avgScore: 78.9,
    rewards: "50",
  },
  {
    position: 11,
    wallet: "0x8024...1357",
    attempted: 25,
    avgScore: 77.5,
    rewards: "40",
  },
  {
    position: 12,
    wallet: "0x9135...2468",
    attempted: 24,
    avgScore: 76.8,
    rewards: "30",
  },
];

export default function Leaderboard({ close }: { close: () => void }) {
  return (
    <div className="w-[900px] h-[540px] absolute top-24 left-[18%] bg-black rounded-sm">
      <div className="absolute w-[900px] h-[540px] flex flex-col -top-[1%] -left-[1%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#ffd75f] text-black">
        <div className="flex justify-between items-center w-full px-6">
          <p className="font-bold text-lg">Leaderboard</p>
          <X className="cursor-pointer hover:text-gray-700" onClick={close} />
        </div>
        <Separator className="bg-black" />

        <ScrollArea className="h-[450px] px-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-2 border-black sticky top-0 bg-[#ffd75f]">
                <th className="py-3 font-bold">Position</th>
                <th className="py-3 font-bold">Wallet Address</th>
                <th className="py-3 font-bold">Attempted</th>
                <th className="py-3 font-bold">Average Score</th>
                <th className="py-3 font-bold">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr
                  key={item.position}
                  className="border-b border-black/20 hover:bg-black/5"
                >
                  <td className="py-4 pl-3">{item.position}</td>
                  <td className="py-4 font-mono">{item.wallet}</td>
                  <td className="py-4">{item.attempted}</td>
                  <td className="py-4">{item.avgScore}%</td>
                  <td className="py-4 font-bold">{item.rewards} RX</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
}
