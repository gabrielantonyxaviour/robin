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
      "https://heurist-images.s3.us-east-1.amazonaws.com/sdk-image-2f687ad6ad_test-flux-7_ea8cb329-d437-433d-af5a-d9c3361fbd2d.jpg?x-id=GetObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWOPEZTMXKJKQSPG5%2F20250108%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250108T122149Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=bea979ad5e1e8a47d36733946eb7359d5f8337d3819128e29ad6af4f585eeff1";

    // Download the image and create a File object
    await uploadImageToPinata("goodgd", imageUrl);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().then(() => console.log("Done"));
