"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { getSdk } from "@/lib/sdk";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  return (
    <div className="h-screen w-screen">
      <div className="fixed w-screen flex justify-end p-4">
        {!authSdk || !authSdk.isAuthenticated() ? (
          <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
            <Button
              className="absolute -top-[4px] -left-[4px] flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
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
          </div>
        ) : (
          <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
            <Button
              className="absolute -top-[4px] -left-[4px] flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
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
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
