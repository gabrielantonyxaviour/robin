/* eslint-disable react/jsx-key */
import { NextRequest } from "next/server";
import { Button, createFrames } from "frames.js/next";
import { frames } from "../frames";

// export const runtime = "edge";

// const senVariableFont = fetch(
//   new URL("/public/fonts/Sen-VariableFont_wght.ttf", import.meta.url)
// ).then((res) => res.arrayBuffer());

const handler = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const response = await frames(async (ctx) => {
    // const [senVariableFontData] = await Promise.all([senVariableFont]);
    return {
      title: "RobinX | Quizz",
      description:
        "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",

      image: ctx.pressedButton ? (
        <div
          style={{
            fontWeight: 600,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "#2c6cc3",
          }}
        >
          <img
            src="https://robinx-ai.vercel.app/frames/rules.png"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            fontWeight: 600,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "#2c6cc3",
          }}
        >
          <img
            src="https://robinx-ai.vercel.app/frames/base.png"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <p
            style={{
              display: "flex",
              position: "absolute",
              left: 30,
              top: "40%",
              fontWeight: 600,
              fontSize: 24,
            }}
          >
            4 December, 2024
          </p>
          <p
            style={{
              position: "absolute",
              left: "30px",
              top: "45%",
              fontWeight: 600,
              fontSize: "50px",
              maxWidth: "600px",
              wordWrap: "break-word",
            }}
          >
            Adventures of Private Key Safety
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center", // Center-align items vertically
              position: "absolute",
              right: "20%",
              top: "1%",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 600,
                marginRight: "12px",
                whiteSpace: "nowrap", // Prevent wrapping of text
              }}
            >
              Earn upto
            </p>
            <img
              src="https://robinx-ai.vercel.app/robin.jpg"
              style={{
                width: 60,
                height: 60,
                borderRadius: "100%",
                marginRight: "12px",
              }}
            />
            <p
              style={{
                fontSize: "28px",
                fontWeight: 600,
                whiteSpace: "nowrap", // Prevent wrapping of text
              }}
            >
              22 $RX
            </p>
          </div>
        </div>
      ),
      imageOptions: {
        // fonts: [
        //   {
        //     name: "Sen",
        //     data: senVariableFontData,
        //     weight: 600,
        //   },
        // ],
      },
      buttons: [
        <Button action="post" target={{ query: { value: "Yes" } }}>
          {ctx.pressedButton ? "Start Game" : "Play"}
        </Button>,
      ],
    };
  })(req);

  console.log(response);
  return response;
};

export const GET = handler;
export const POST = handler;
