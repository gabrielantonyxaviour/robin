"use client";

// @ts-ignore
import { OCConnect } from "@opencampus/ocid-connect-js";
export default function OCConnectProvider({ children }) {
  return (
    <OCConnect
      opts={{
        redirectUri: JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false")
          ? "http://localhost:3000/redirect"
          : "https://robinx-ai.vercel.app/redirect",
        referralCode: "TEST123",
      }}
      sandboxMode={true}
    >
      {children}
    </OCConnect>
  );
}
