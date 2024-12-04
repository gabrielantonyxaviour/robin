export async function validateGameData(data) {
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
