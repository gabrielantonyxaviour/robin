"use client";

import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import { IDKitWidget, ISuccessResult, useIDKit } from "@worldcoin/idkit";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
  useSwitchChain,
} from "wagmi";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { sepolia } from "viem/chains";
import { shortenAddress, shortenNullifier } from "@/lib/utils";

export default function World({ close }: { close: () => void }) {
  // const { address, chainId } = useAccount();
  // const { switchChainAsync } = useSwitchChain();
  // const { toast } = useToast();
  // const { setOpen } = useIDKit();
  // const [done, setDone] = useState(false);
  // const {
  //   data: hash,
  //   isPending,
  //   error,
  //   writeContractAsync,
  // } = useWriteContract();
  // const [nullifier, setNullifier] = useState(0);

  // const submitTx = async (proof: ISuccessResult) => {
  //   try {
  //     if (chainId != sepolia.id) {
  //       await switchChainAsync({
  //         chainId: sepolia.id,
  //       });
  //     }
  //     await writeContractAsync({
  //       address: ROBINX_VERIFIER_ADDRESS as `0x${string}`,
  //       account: address,
  //       abi: ROBINX_VERIFIER_ABI,
  //       functionName: "verifyAndExecute",
  //       args: [
  //         address as `0x${string}`,
  //         BigInt(proof.merkle_root),
  //         BigInt(proof.nullifier_hash),
  //         decodeAbiParameters(
  //           parseAbiParameters("uint256[8]"),
  //           proof.proof as `0x${string}`
  //         )[0],
  //       ],
  //     });
  //   } catch (error) {
  //     throw new Error((error as BaseError).shortMessage);
  //   }
  // };

  // useEffect(() => {
  //   if (hash) {
  //     toast({
  //       title: "Transcaction Success",
  //       description: "Your WorldId has been verified on Sepolia.",
  //       action: (
  //         <ToastAction
  //           className="bg-[#e7ccfc] hover:bg-[#e7ccfc] text-black hover:text-black border-[2px] border-black mr-[2px] rounded-sm"
  //           altText="view tx"
  //           onClick={() => {
  //             window.open(
  //               "hhttps://eth-sepolia.blockscout.com/tx/" + hash,
  //               "_blank"
  //             );
  //           }}
  //         >
  //           View Tx
  //         </ToastAction>
  //       ),
  //     });
  //   }
  // }, [hash]);
  return (
    <div className="w-[400px] h-[240px] absolute top-[32%] left-[38%] bg-black rounded-sm">
      {/* <IDKitWidget
        app_id={process.env.WORLDCOIN_APP_ID as `app_${string}`}
        action={process.env.WORLDCOIN_ACTION as string}
        signal={address}
        onSuccess={submitTx}
        autoClose
      /> */}
      {/* <div
        onClick={() => {}}
        className={`absolute w-[400px] h-[240px] flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#ffd75f] text-black`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">
            {nullifier != 0 ? "Verified Human!" : "Verify Human"}
          </p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        <Separator className="bg-black" />
        <div className="flex flex-col h-full w-full justify-center items-center">
          <div className="relative bg-black w-[220px] h-[40px] rounded-sm p-5">
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
          </div>
        </div>
      </div> */}
    </div>
  );
}
