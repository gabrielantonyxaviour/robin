require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const Heurist = require("heurist");
const app = express();
app.use(express.json());

const heurist = new Heurist({
  apiKey: process.env["HEURIST_API_KEY"],
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

const SYSTEM_PROMPT = `You are RobinX, an educational AI game master inspired by Nico Robin from One Piece. Create immersive Web3 educational games with diverse characters and settings.

Scene requirements:
- Vivid scene description with full environment and character positioning (no close portraits)
- Dynamic character interactions (including but not limited to Nico Robin)
- Min. 2 questions per scene 
- Min. 3 scenes total

Image generation parameters:
{
 description: string,
 width: 1024,
 height: 768,
 image_model: 'FLUX-1-dev',
 stylization_level: 3,
 detail_level: 4, 
 color_level: 4,
 lighting_level: 3,
 must_include: 'scene with characters, environment elements',
 quality: 'high',
 guidance_scale: 3
}

Response format:
{
 topic: string,
 gameTitle: string,
 theme: string,
 introduction: string,
 scenes: [{
   sceneId: number,
   sceneDescription: string,
   imagePrompt: string,
   imageConfig: {
     // Include relevant image parameters
   },
   conversations: [{
     speaker: string,
     dialogue: string
   }],
   questions: [{
     type: 'multiple_choice' | 'text_response', 
     questionText: string,
     options?: string[],
     correctAnswer: string,
     explanation: string
   }]
 }],
 conclusion: string
}`;

async function generateImage(prompt, config = {}) {
  try {
    const defaultConfig = {
      model: "FLUX-1-dev",
      width: 1024,
      height: 768,
      stylization_level: 3,
      detail_level: 4,
      color_level: 4,
      lighting_level: 3,
      guidance_scale: 3,
    };

    const finalConfig = {
      ...defaultConfig,
      ...config,
      prompt,
    };

    const response = await heurist.smartgen.generateImage(finalConfig);
    return response.url;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}

function validateGameData(data) {
  if (!data.topic || !data.gameTitle || !data.introduction || !data.conclusion)
    return false;
  if (!Array.isArray(data.scenes) || data.scenes.length < 3) return false;

  return data.scenes.every((scene) => {
    if (!scene.sceneId || !scene.sceneDescription || !scene.imagePrompt)
      return false;
    if (!Array.isArray(scene.conversations) || scene.conversations.length < 1)
      return false;
    if (!Array.isArray(scene.questions) || scene.questions.length < 2)
      return false;
    if (!scene.imageConfig) return false;

    return scene.questions.every((question) => {
      if (!question.type || !question.questionText || !question.correctAnswer)
        return false;
      if (
        question.type === "multiple_choice" &&
        (!Array.isArray(question.options) || question.options.length !== 4)
      )
        return false;
      return true;
    });
  });
}

app.post("/api/image", async (req, res) => {
  const { prompt, config } = req.body;
  try {
    const url = await generateImage(prompt, config);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate-game", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const response = await openai.chat.completions.create({
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate a complete educational game about: ${topic}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const gameData = JSON.parse(response.choices[0]?.message?.content || "{}");

    if (!validateGameData(gameData)) {
      throw new Error("Generated game data failed validation");
    }

    // Generate images for each scene
    for (const scene of gameData.scenes) {
      scene.imageUrl = await generateImage(
        scene.imagePrompt,
        scene.imageConfig
      );
    }

    res.json(gameData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate game" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
