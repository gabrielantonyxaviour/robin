require("dotenv").config();
const { PinataSDK } = require("pinata");
const fetch = require("node-fetch");

async function uploadImageToPinata(name, imageUrl) {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
  });

  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract filename from URL or use a default name
  const fileName = name + ".png";

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

module.exports = {
  uploadImageToPinata,
};
