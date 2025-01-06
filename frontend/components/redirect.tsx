"use client";
import { getSdk } from "@/lib/sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Redirect() {
  const authSdk = getSdk();
  const router = useRouter();
  useEffect(() => {
    authSdk.handleLoginRedirect().then(() => {
      if (authSdk.OCId) router.push("/home");
    });
  }, []);

  return (
    <div className="w-screen h-screen bg-[#ffd75f] w-[700px] mx-auto flex flex-col justify-center items-center">
      <Image src={"/loading.gif"} alt="loading" width={200} height={200} />
    </div>
  );
}
