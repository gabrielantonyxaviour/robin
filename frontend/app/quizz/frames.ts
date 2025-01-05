import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/quizz",
  initialState: {
    currentState: 0,
  },
  debug: JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false"),
  baseUrl: !JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false")
    ? "https://robinx-ai.vercel.app"
    : "http://localhost:3001",
});
