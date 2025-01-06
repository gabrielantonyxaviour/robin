const { calcScore } = require("../utils/calcScore");

const response = {
  quiz: {
    topic: "Private Key Safety",
    gameTitle: "One Piece Blockchain Pirates: RobinX's Secret Vault",
    theme: "pirate adventure on a mysterious blockchain sea",
    introduction:
      "Join RobinX, the pirate scholar, on a thrilling adventure to learn about Private Key Safety! Sail the blockchain sea, solve puzzles, and unlock the secrets of the private key vault!",
    scenes: [
      {
        sceneId: 1,
        sceneDescription:
          "The game begins on a mystical island, where RobinX stands near a wooden ship, pointing towards the horizon. A parrot named Polly perches on RobinX's shoulder.",
        imagePrompt: "RobinX & Polly on a ship",
        conversations: [
          {
            speaker: "RobinX",
            dialogue:
              "Ahoy, mate! Welcome to my island. We must prepare for our journey on the blockchain sea. First, let's discuss private key safety.",
          },
          {
            speaker: "Polly",
            dialogue: "Pretty key! Pretty key!",
          },
        ],
        questions: [
          {
            type: "multiple_choice",
            questionText: "What is a private key?",
            options: ["A password", "A digital signature", "A secret code"],
            correctAnswer: "A secret code",
            explanation:
              "A private key is a secret code that allows you to access your cryptocurrency wallet.",
          },
        ],
        imageUrl:
          "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/files/bafybeibnlsx5ft7eke4eynox5kucp3nrvhiijnle2su3mpu3amnrquxqm4?X-Algorithm=PINATA1&X-Date=1736152526&X-Expires=99999999999&X-Method=GET&X-Signature=cdb6981c5cfeb68ae9280a1cc0f2aa48e651faef0054c1388a85ffa1e1044b37",
      },
      {
        sceneId: 2,
        sceneDescription:
          "RobinX and Polly stand near a treasure chest, surrounded by a dense jungle. Suddenly, a monkey swings down from a tree, snatches the treasure chest key, and scampers away.",
        imagePrompt: "RobinX, Polly, and a mischievous monkey",
        conversations: [
          {
            speaker: "RobinX",
            dialogue:
              "That monkey took the treasure chest key! We need to keep our private keys safe, just like that key.",
          },
          {
            speaker: "Polly",
            dialogue: "Key! Key! Key!",
          },
        ],
        questions: [
          {
            type: "multiple_choice",
            questionText: "Where should you store your private key?",
            options: [
              "On a website",
              "On your computer",
              "In a secure offline wallet",
            ],
            correctAnswer: "In a secure offline wallet",
            explanation:
              "Storing your private key in a secure offline wallet is the safest option, as it is not connected to the internet and less susceptible to hacking.",
          },
        ],
        imageUrl:
          "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/files/bafybeigzpf5q3nbmskdkeh7xr3np57tuxejea4cbpu5dcbejua3qkbxuee?X-Algorithm=PINATA1&X-Date=1736152542&X-Expires=99999999999&X-Method=GET&X-Signature=888e247f6214e593c8f8eca239606ff46ae780dcbab657f7e5cd0e745654a9db",
      },
      {
        sceneId: 3,
        sceneDescription:
          "RobinX and Polly finally reach the private key vault, protected by a massive steel door. A mysterious figure, cloaked in shadows, steps forward and challenges them.",
        imagePrompt: "RobinX, Polly, and the vault guardian",
        conversations: [
          {
            speaker: "RobinX",
            dialogue:
              "Step aside, stranger! We've come to learn about private key safety.",
          },
          {
            speaker: "Vault Guardian",
            dialogue:
              "Reveal your true intentions, or I shall not let you pass.",
          },
        ],
        questions: [
          {
            type: "text_response",
            questionText: "Why is it important to keep your private key safe?",
            correctAnswer:
              "To prevent unauthorized access to your cryptocurrency wallet.",
            explanation:
              "Keeping your private key safe is crucial to protecting your digital assets from theft and unauthorized access.",
          },
        ],
        imageUrl:
          "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/files/bafybeieazbzgd4upeloyvmti6mzlnnu7ukkr3jkczryrpb6aq6acu2d2ha?X-Algorithm=PINATA1&X-Date=1736152561&X-Expires=99999999999&X-Method=GET&X-Signature=fe07fb06ea94d4c3033d702dbe9d30811ca0f5d2dfe85d3adc5b6088327714ba",
      },
    ],
    conclusion:
      "Congratulations, mate! You've learned the importance of private key safety. Remember, your private key is your treasure. Keep it safe and secure on your blockchain adventure!",
  },
  responses: [
    "A secret code",
    "In a secure offline wallet",
    "To help access to the wallet",
  ],
};

async function main() {
  calcScore(response);
}

main();
