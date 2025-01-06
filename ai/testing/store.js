const { PinataSDK } = require("pinata");
require("dotenv").config();
const fetch = require("node-fetch");
const { uploadImageToPinata } = require("../utils/uploadImageToPinata");

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
});

async function downloadImageAndCreateFile(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract filename from URL or use a default name
  const fileName = "image.png";

  // Create a File object from the buffer
  return new File([buffer], fileName, { type: "image/png" });
}

async function uploadToPinata(imageUrl) {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract filename from URL or use a default name
  const fileName = "image.png";

  // Create a File object from the buffer
  const imageFile = new File([buffer], fileName, { type: "image/png" });
  const upload = await pinata.upload.file(imageFile);
  console.log("Upload successful:", upload);
  //   const data = await pinata.gateways.get(upload.cid);
  //   console.log(data);
  const url = await pinata.gateways.createSignedURL({
    cid: upload.cid,
    expires: 99999999999,
  });
  console.log(url);
  return url;
}

async function main() {
  try {
    const imageUrl =
      "https://heurist-images.s3.us-east-1.amazonaws.com/sdk-image-31d83c0b93_test-flux-3_e4aa5458-3093-441c-9533-94b2c6a1e699.jpg?x-id=GetObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWOPEZTMXKJKQSPG5%2F20250106%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250106T074925Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=a61e910241b3bc8def797addcb5a951cdb76b86878bf78c214c3304e650f21c1";

    // Download the image and create a File object
    await uploadImageToPinata("googd", imageUrl);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().then(() => console.log("Done"));
