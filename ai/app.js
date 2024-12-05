require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
// const { gameGen } = require("./utils/gameGen");
const { uploadJsonToPinata } = require("./utils/uploadJsonToPinata");
const { createPollTx } = require("./utils/createPollTx");
const { addQuizz } = require("./utils/addQuizz");
const { tweet } = require("./utils/tweet");
const { calcScore } = require("./utils/calcScore");
const OpenAI = require("openai");
const { imageGen } = require("./utils/imageGen");
const { uploadImageToPinata } = require("./utils/uploadImageToPinata");

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
    - Vivid anime scene description with full environment and character positioning (MUST HAVE no close portraits)
    - Introduct unique dynamic character interactions (Atleast 2, including but not limited to Nico Robin) 
    - Must have 3 scenes total
    - Must have 2 converstations per scene and 1 question per scene
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

app.post("/api/calc-score", async (req, res) => {
  console.log(req.body);
  try {
    const score = await calcScore(req.body);
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate-game", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });
    const currentDate = new Date().toISOString();

    const games = [];
    console.log("Starting Game Gen");
    for (let i = 0; i < 1; i++) {
      const response = await openai.chat.completions.create({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: getSystemPrompt(i) },
          {
            role: "user",
            content: `Generate a complete educational game about: ${topic}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 20000,
      });
      console.log("Generated Game ", i);
      const gameData = JSON.parse(
        response.choices[0]?.message?.content || "{}"
      );
      console.log(gameData);
      for (const scene of gameData.scenes) {
        const image = await imageGen(scene.imagePrompt);
        console.log("Image Generated");
        console.log(image);
        scene.imageUrl = await uploadImageToPinata(
          currentDate + "_" + scene.sceneId,
          image
        );
        console.log(scene.imageUrl);
      }
      games.push(gameData);
    }

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

    const tweetId = await tweet(
      "Today's Quest is ready! 🎮🎉 Play now and earn $RX rewards: https://robinx-ai.vercel.app/quizz/" +
        pollId
    );

    await addQuizz(
      pollId,
      quizzes_url,
      "https://x.com/EduRobinX/status/" + tweetId
    );

    res.json({
      pollId,
      quizzes_url,
      metadata_url,
      tx: "https://edu-chain-testnet.blockscout.com/tx/" + txHash,
      tweet: "https://x.com/EduRobinX/status/" + tweetId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate game" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
