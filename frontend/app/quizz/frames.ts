import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/quizz",
  initialState: {
    currentState: 0,
    questionState: 0,
    quizData: {},
  },
  imagesRoute: null,
  debug: true,
  baseUrl: "http://localhost:3000",
});
