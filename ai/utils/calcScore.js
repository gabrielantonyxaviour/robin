require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env["HEURIST_API_KEY"],
  baseURL: "https://llm-gateway.heurist.xyz",
});

const PROMPT = `  
You are an AI grading assistant. Your task is to evaluate quiz responses based on the following input structure:

{
 "quiz": {
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
 },
 "responses": string[]  // Array of responses matching questions in order
}

Evaluation criteria:
- For multiple choice questions: Score 100 for exact match, 0 for no match
- For text responses: Score 0-100 based on semantic similarity and inclusion of key concepts from the correct answer

You must return only a JSON object with this exact structure:
{
 "score": number  // Average score across all questions, 0-100
}

No other text or explanations should be included in your response.
  `;

async function calcScore(inputData) {
  const response = await openai.chat.completions.create({
    model: "mistralai/mixtral-8x7b-instruct",
    messages: [
      { role: "system", content: PROMPT },
      {
        role: "user",
        content: JSON.stringify(inputData),
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  const scoreData = JSON.parse(response.choices[0]?.message?.content || "{}");
  return scoreData;
}

module.exports = {
  calcScore,
};
