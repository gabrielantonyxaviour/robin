require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const Heurist = require("heurist");
const app = express();
app.use(express.json());
const { PinataSDK } = require("pinata");
const fetch = require("node-fetch");
const { gameGen } = require("./utils/gameGen");
const { uploadJsonToPinata } = require("./utils/uploadJsonToPinata");
const { createPollTx } = require("./utils/createPollTx");
const { addQuizz } = require("./utils/addQuizz");

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
});

const openai = new OpenAI({
  apiKey: process.env["HEURIST_API_KEY"],
  baseURL: "https://llm-gateway.heurist.xyz",
});

const THEMES = [
  "pirate adventure on a mysterious blockchain sea",
  "cyberpunk metropolis with digital assets",
  "post-apocalyptic crypto survival",
  "space colony managing digital resources",
  "medieval crypto kingdom",
  "ninja academy teaching blockchain arts",
  "western frontier of digital gold rush",
  "underwater civilization using blockchain",
  "steampunk city with mechanical wallets",
  "ancient temple hiding crypto secrets",
];
function getSystemPrompt(index) {
  return `You are RobinX, an educational AI game master inspired by Nico Robin from One Piece. Create immersive Web3 educational games with diverse characters and settings.

  Scene requirements:
  - Vivid anime scene description with full environment and character positioning (no close portraits)
  - Introduct unique dynamic character interactions (Atleast 2, including but not limited to Nico Robin) 
  - Min. 2 questions per scene
  - Min. 3 scenes total
  - 3 options for multiple choice questions
  - Image prompt must have anime and within 120 characters
  - Speaker name should be one word
  - Use this theme for the game: ${THEMES[index]}
  
  Expected output format:
  {
  "topic": string,
  "gameTitle": string,
  "theme": string,
  "introduction": string,
  "scenes": [{
    "sceneId": number,
    "sceneDescription": string, 
    "imagePrompt": string,
    "conversations": [{
      "speaker": string,
      "dialogue": string
    }],
    "questions": [{
      "type": "multiple_choice" | "text_response",
      "questionText": string,
      "options": string[],
      "correctAnswer": string,
      "explanation": string
    }]
  }],
  "conclusion": string
}`;
}

app.post("/api/image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const url = await generateImage(prompt);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate-game", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });
    const currentDate = new Date().toISOString();

    const games = gameGen(topic, currentDate);

    // if (!validateGameData(gameData)) {
    //   throw new Error("Generated game data failed validation");
    // }
    const quizzes_url = await uploadJsonToPinata(
      currentDate + "_quizzes",
      games
    );
    const metadata_url = await uploadJsonToPinata(currentDate + "_metadata", {
      name: "RobinX",
      description:
        "An autonomous AI agent that teaches web3 to users in the form of gamified quests.",
      topic: topic,
      date: currentDate,
    });

    const { txHash, pollId } = await createPollTx(metadata_url);

    await addQuizz(pollId, quizzes_url);

    res.json({
      quizzes_url,
      metadata_url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate game" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
