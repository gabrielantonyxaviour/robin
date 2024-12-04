// @ts-expect-error Typescript not supported
import { OCAuthSandbox } from "@opencampus/ocid-connect-js";

let sdk: any = undefined;

export const getSdk = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (typeof sdk === "undefined") {
    sdk = new OCAuthSandbox({
      redirectUri: process.env.NEXT_PUBLIC_IS_LOCAL
        ? `http://localhost:3000/redirect`
        : "https://robinx-ai.vercel.app/redirect",
    });
  }

  return sdk;
};
