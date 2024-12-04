/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";
import fs from "fs/promises";
import path from "path";

const frames = createFrames({
  basePath: "/frames",
  initialState: {
    currentState: 0,
    questionState: 0,
    quizData: {},
  },
  imageRenderingOptions: async () => {
    const senVariableFontData = await fs.readFile(
      path.join(
        path.resolve(process.cwd(), "public"),
        "Sen-VariableFont_wght.ttf"
      )
    );

    return {
      imageOptions: {
        fonts: [
          {
            name: "Sen",
            data: senVariableFontData,
          },
        ],
      },
    };
  },
});

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <span>
        {ctx.pressedButton
          ? `I clicked ${ctx.searchParams.value}`
          : `Click some button`}
      </span>
    ),
    buttons: [
      <Button action="post" target={{ query: { value: "Yes" } }}>
        Say Yes
      </Button>,
      <Button action="post" target={{ query: { value: "No" } }}>
        Say No
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
