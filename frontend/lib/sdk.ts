// @ts-expect-error Typescript not supported
import { OCAuthSandbox } from "@opencampus/ocid-connect-js";

let sdk: any = undefined;

export const getSdk = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (typeof sdk === "undefined") {
    sdk = new OCAuthSandbox({
      redirectUri: JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false")
        ? `http://localhost:3001/redirect`
        : "https://robinx-ai.vercel.app/redirect",
    });
  }

  return sdk;
};
