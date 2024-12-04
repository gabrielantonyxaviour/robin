"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { getSdk } from "@/lib/sdk";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { educhainTestnet, shortenAddress } from "@/lib/utils";
import { injected } from "wagmi/connectors";
import { getBalance } from "@wagmi/core";
import { config } from "@/lib/config";
import { ROBINX_ADDRESS } from "@/lib/constants";
import { useEnvironmentStore } from "./context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { robinXBalance, setRobinXBalance } = useEnvironmentStore(
    (store) => store
  );
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { data: balance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();
  const authSdk = getSdk();
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    await authSdk.logout(
      process.env.NEXT_PUBLIC_IS_LOCAL
        ? "http://localhost:3000"
        : "https://robinx-ai.vercel.app"
    );
  }, []);

  useEffect(() => {
    if (!authSdk || !authSdk.isAuthenticated()) router.push("/");
  }, [authSdk]);

  useEffect(() => {
    if (address) {
      getBalance(config, {
        address: address,
        token: ROBINX_ADDRESS,
        chainId: educhainTestnet.id,
      }).then((b) => setRobinXBalance(parseFloat(b.formatted)));
    }
  }, [address]);
  return (
    <div className="h-screen w-screen">
      <div className="fixed w-screen flex justify-end space-x-4 p-4">
        {isConnected && address != null && balance && (
          <>
            <div className="relative w-[130px] bg-black h-[40px] rounded-sm">
              <Button className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#131beb] border-black mr-[2px]">
                <Image
                  src={"/robin.jpg"}
                  width={25}
                  height={25}
                  alt="robin"
                  className="rounded-full"
                />
                <p> {robinXBalance.toFixed(2)} RX</p>
              </Button>
            </div>
            <div className="relative w-[130px] bg-black h-[40px] rounded-sm">
              <Button className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#131beb] border-black mr-[2px]">
                <Image
                  src={
                    chainId == educhainTestnet.id
                      ? "/chains/educhain.png"
                      : "/chains/eth.png"
                  }
                  width={25}
                  height={25}
                  alt="educhain"
                  className="rounded-full"
                />
                <p>
                  {" "}
                  {parseFloat(balance?.formatted).toFixed(2)}{" "}
                  {chainId == educhainTestnet.id ? "tEDU" : "tETH"}
                </p>
              </Button>
            </div>
          </>
        )}
        {!isConnected || address == null ? (
          <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
            <Button
              className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
              onClick={async () => {
                await connectAsync({
                  chainId: educhainTestnet.id,
                  connector: injected(),
                });
                // await authSdk.signInWithRedirect({
                //   state: "opencampus",
                // });
              }}
            >
              <p> {"Connect Wallet"}</p>
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
                <Button
                  className="absolute -top-[4px] -left-[4px] flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                  onClick={() => {
                    // handleLogout();
                    // disconnect();
                  }}
                >
                  <Image
                    src="/metamask.png"
                    width={30}
                    height={30}
                    alt="metamask"
                    className="rounded-full"
                  />
                  <p>{shortenAddress(address as `0x${string}`)}</p>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] p-0 m-0 bg-transparent border-0 flex flex-col space-y-2">
              <DropdownMenuItem className="p-0 m-0 w-[180px]">
                {!authSdk || !authSdk.isAuthenticated() ? (
                  <Button
                    className="w-full flex p-5 m-0 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black"
                    onClick={async () => {
                      await authSdk.signInWithRedirect({
                        state: "opencampus",
                      });
                    }}
                  >
                    <Image
                      src="/chains/educhain.png"
                      width={30}
                      height={30}
                      alt="educhain"
                      className="rounded-full"
                    />
                    <p> {"Connect OCID"}</p>
                  </Button>
                ) : (
                  <Button
                    className="w-full flex p-5 m-0 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <Image
                      src="/chains/educhain.png"
                      width={30}
                      height={30}
                      alt="educhain"
                      className="rounded-full"
                    />
                    <p>{authSdk.OCId}</p>
                  </Button>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 w-[180px] hover:bg-transparent">
                <Button
                  variant={"destructive"}
                  className="w-full flex p-5 space-x-2 hover:bg-destructive border-[1px] border-black mr-[2px]"
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect Wallet
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {children}
    </div>
  );
}
