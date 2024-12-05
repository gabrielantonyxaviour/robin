import { createFrames } from "frames.js/next";
import fs from "fs/promises";
import path from "path";

export const frames = createFrames({
  basePath: "/quizz",
  initialState: {
    currentState: 0,
    currentScene: 0,
    questionState: 0,
    gameSeed: -1,
    quizData: "",
    responses: [],
  },
  // imageRenderingOptions: async () => {
  //   const senVariableFontData = await fs.readFile(
  //     path.join(
  //       path.resolve(process.cwd(), "public", "fonts"),
  //       "Sen-VariableFont_wght.ttf"
  //     )
  //   );

  //   return {
  //     imageOptions: {
  //       fonts: [
  //         {
  //           name: "Sen",
  //           data: senVariableFontData,
  //         },
  //       ],
  //     },
  //   };
  // },
  debug: JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false"),
  baseUrl: !JSON.parse(process.env.NEXT_PUBLIC_IS_LOCAL || "false")
    ? "https://robinx-ai.vercel.app"
    : "http://localhost:3000",
});
