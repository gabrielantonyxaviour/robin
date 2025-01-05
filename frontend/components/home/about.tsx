"use client";

import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  useAccount,
  useWriteContract,
  type BaseError,
  useSwitchChain,
} from "wagmi";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ROBINX_VERIFIER_ABI, ROBINX_VERIFIER_ADDRESS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { sepolia } from "viem/chains";
import { shortenAddress, shortenNullifier } from "@/lib/utils";

export default function About({ close }: { close: () => void }) {
  return (
    <div className="w-[400px] h-[240px] absolute top-[32%] left-[38%] bg-black rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute w-[400px] h-[240px] flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#ffd75f] text-black`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">{"About RobinX"}</p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        <Separator className="bg-black" />
        <div className="flex flex-col h-full w-full justify-center items-center">
          {/* <div className="relative bg-black w-[220px] h-[40px] rounded-sm p-5">
            <Button
              className="absolute -top-[4px] -left-[4px] flex p-5 space-x-2 bg-[#e7ccfc] hover:bg-[#e7ccfc] text-black hover:text-black border-[1px] border-black mr-[2px]"
              onClick={() => {
                if (nullifier != 0) return;
                setOpen(true);
              }}
            >
              {nullifier != 0 ? (
                <>
                  <Image
                    src="/world.png"
                    width={30}
                    height={30}
                    alt="world"
                    className="rounded-full"
                  />
                  <p>{shortenNullifier(nullifier.toString())}</p>
                </>
              ) : (
                <>
                  <Image
                    src="/world.png"
                    width={30}
                    height={30}
                    alt="world"
                    className="rounded-full"
                  />
                  <p>Sign in with Worldcoin</p>
                </>
              )}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
