require("dotenv").config();
const { imageGen } = require("./imageGen");
const { uploadImageToPinata } = require("./uploadImageToPinata");
const OpenAI = require("openai");

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

export async function gameGen(topic, currentDate) {
  const games = [];

  for (let i = 0; i < 3; i++) {
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

    const gameData = JSON.parse(response.choices[0]?.message?.content || "{}");
    console.log(gameData);
    for (const scene of gameData.scenes) {
      scene.imageUrl = await uploadImageToPinata(
        currentDate + "_" + scene.sceneId,
        await imageGen(scene.imagePrompt)
      );
      console.log(scene.imageUrl);
    }
    games.push(gameData);
  }
  return games;
}
