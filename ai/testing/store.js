const { PinataSDK } = require("pinata");
require("dotenv").config();
const fetch = require("node-fetch");

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
      "https://heurist-images.s3.us-east-1.amazonaws.com/sdk-image-e48f1bf3b9_test-flux-3_e31971d6-0518-4231-b613-1dbdf7569d9a.jpg?x-id=GetObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWOPEZTMXKJKQSPG5%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T185522Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=95646f9a270800dbb7d581e713efbbe062394d062a96cdd0491bbdd25a9adda2";

    // Download the image and create a File object
    await uploadToPinata(imageUrl);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().then(() => console.log("Done"));
