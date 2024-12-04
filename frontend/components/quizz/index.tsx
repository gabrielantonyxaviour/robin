"use client";

import Image from "next/image";
import { useState } from "react";

export default function Quizz() {
  const [showWindows, setShowWindows] = useState([false, false, false, false]);
  return (
    <div className="flex justify-between h-screen">
      <div className="flex flex-col h-full justify-center space-y-12  px-6"></div>
    </div>
  );
}
