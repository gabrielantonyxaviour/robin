import { NextRequest } from "next/server";
import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getQuizz } from "@/lib/supabase/getQuizz";
import { FC } from "react";

interface GameState {
  currentState: number;
  currentScene: number;
  questionState: number;
  gameSeed: number;
  quizData: string;
  responses: never[];
}

interface ImageProps {
  gameTitle?: string;
}

const RulesImage: FC = () => (
  <div className="font-semibold h-full w-full flex flex-col items-center justify-end bg-[#2c6cc3]">
    <img
      src="https://robinx-ai.vercel.app/frames/rules.png"
      className="w-full h-full"
      alt="Game Rules"
    />
  </div>
);

const GameImage: FC<ImageProps> = ({ gameTitle }) => (
  <div className="font-semibold h-full w-full flex flex-col items-center justify-end bg-[#2c6cc3]">
    <img
      src="https://robinx-ai.vercel.app/frames/base.png"
      className="w-full h-full"
      alt="Game Base"
    />
    <p className="flex absolute left-[30px] top-[40%] font-semibold text-2xl">
      {new Date().toLocaleDateString()}
    </p>
    <p className="absolute left-[30px] top-[45%] font-semibold text-[50px] max-w-[600px] break-words">
      {gameTitle}
    </p>
    <div className="flex items-center absolute right-[20%] top-[1%]">
      <p className="text-[28px] font-semibold mr-3 whitespace-nowrap">
        Earn upto
      </p>
      <img
        src="https://robinx-ai.vercel.app/frames/robin.jpg"
        className="w-[60px] h-[60px] rounded-full mr-3"
        alt="Robin"
      />
      <p className="text-[28px] font-semibold whitespace-nowrap">22 $RX</p>
    </div>
  </div>
);

const ErrorImage: FC = () => (
  <div className="h-full w-full flex items-center justify-center bg-[#2c6cc3]">
    <p className="text-white text-2xl">Error loading quiz</p>
  </div>
);

const initialState: GameState = {
  currentState: 0,
  currentScene: 0,
  questionState: 0,
  gameSeed: 0,
  quizData: "",
  responses: [],
};

const handler = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const response = await frames(async (ctx) => {
    // Initialize state if not present
    const currentState = ctx.state || initialState;
    let updatedState = { ...currentState };

    // Fetch quiz data if not already present
    if (!updatedState.quizData) {
      try {
        const quizz = await getQuizz(id);
        updatedState = {
          ...updatedState,
          quizData: JSON.stringify(quizz), // Convert to string as per state type
          gameSeed: Math.floor(Math.random() * 3),
        };
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        return {
          title: "Error",
          description: "Failed to load quiz data",
          image: <ErrorImage />,
          buttons: [
            <Button action="post" target={{ pathname: id }}>
              Retry
            </Button>,
          ],
          state: initialState,
        };
      }
    }

    // Update state based on button press
    if (ctx.pressedButton) {
      updatedState = {
        ...updatedState,
        currentState: updatedState.currentState + 1,
      };

      // Update scene if needed
      if (updatedState.currentState === 2) {
        updatedState.currentScene = 1;
      }
    }

    // Parse quiz data
    let gameData;
    try {
      const parsedQuizData = JSON.parse(updatedState.quizData);
      gameData = parsedQuizData[updatedState.gameSeed];
    } catch (error) {
      console.error("Failed to parse quiz data:", error);
      return {
        title: "Error",
        description: "Failed to parse quiz data",
        image: <ErrorImage />,
        buttons: [
          <Button action="post" target={{ pathname: id }}>
            Retry
          </Button>,
        ],
        state: initialState,
      };
    }

    return {
      title: "RobinX | Quizz",
      description:
        "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
      image:
        updatedState.currentState === 1 ? (
          <RulesImage />
        ) : (
          <GameImage gameTitle={gameData?.gameTitle} />
        ),
      buttons: [
        <Button action="post" target={{ pathname: id }}>
          {updatedState.currentState === 0 ? "Play" : "Start Game"}
        </Button>,
      ],
      state: updatedState,
    };
  })(req);

  return response;
};

export const GET = handler;
export const POST = handler;
