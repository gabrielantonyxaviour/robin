"use client";
// @ts-ignore
import { LoginCallBack } from "@opencampus/ocid-connect-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Redirect() {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const onLoginSuccess = () => {
    router.push("/");
  };

  const onLoginError = () => {
    console.log("Error");
  };
  return (
    <LoginCallBack
      errorCallback={onLoginError}
      successCallback={onLoginSuccess}
    />
  );
}
