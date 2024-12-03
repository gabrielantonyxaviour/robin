"use client";

import { X } from "lucide-react";
import { Separator } from "../ui/separator";

export default function World({ close }: { close: () => void }) {
  return (
    <div className="w-[400px] h-[240px] absolute top-[32%] left-[38%] bg-black h-full rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute w-[400px] h-[240px] flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#ffd75f] text-black`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">Verify Human</p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        <Separator className="bg-black" />
        <div className="flex w-full justify-center">
          <Separator className="bg-black px-4" orientation="vertical" />
        </div>
      </div>
    </div>
  );
}
