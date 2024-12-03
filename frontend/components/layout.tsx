"use client";
import { useRouter } from "next/navigation";
// @ts-ignore
import { LoginButton, useOCAuth } from "@opencampus/ocid-connect-js";
// @ts-ignore
import { OCAuthSandbox } from "@opencampus/ocid-connect-js";
import { useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { authState, ocAuth, OCId, ethAddress } = useOCAuth();
  const handleLogout = useCallback(async () => {
    const authSdk = new OCAuthSandbox();
    await authSdk.logout("http://localhost:3000");
  }, []);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) router.push("/");
  }, [authState]);
  return (
    <div className="h-screen w-screen">
      <div className="fixed w-screen flex justify-end p-4">
        {!authState || !authState.isAuthenticated ? (
          <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
            <Button
              className="absolute -top-[4px] -left-[4px] flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
              onClick={async () => {
                const authSdk = new OCAuthSandbox();
                await authSdk.signInWithRedirect({
                  state: "opencampus",
                });
              }}
            >
              <Image
                src="/educhain.png"
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
                src="/educhain.png"
                width={30}
                height={30}
                alt="educhain"
                className="rounded-full"
              />
              <p>{OCId}</p>
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
