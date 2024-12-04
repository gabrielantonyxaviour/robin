const Heurist = require("heurist");

export async function imageGen(prompt) {
  const heurist = new Heurist({
    apiKey: process.env["HEURIST_API_KEY"],
  });

  try {
    const defaultConfig = {
      model: "FLUX.1-dev",
      width: 1024,
      height: 768,
      stylization_level: 3,
      //   detail_level: 4,
      color_level: 4,
      lighting_level: 3,
      //   quality: "high",
      guidance_scale: 3,
    };

    const finalConfig = {
      ...defaultConfig,
      prompt,
    };

    console.log(finalConfig);

    const response = await heurist.images.generate(finalConfig);
    return response.url;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}
