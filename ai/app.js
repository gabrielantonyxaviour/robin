require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const { gameGen } = require("./utils/gameGen");
const { uploadJsonToPinata } = require("./utils/uploadJsonToPinata");
const { createPollTx } = require("./utils/createPollTx");
const { addQuizz } = require("./utils/addQuizz");
const { tweet } = require("./utils/tweet");
const { calcScore } = require("./utils/calcScore");

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
