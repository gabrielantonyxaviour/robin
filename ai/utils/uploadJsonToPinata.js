require("dotenv").config();
const { PinataSDK } = require("pinata");
async function uploadJsonToPinata(name, jsonObject) {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
  });

  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonObject, null, 2);

  // Create a File object from the JSON string
  const file = new File([jsonString], name + ".json", {
    type: "application/json",
  });

  // Upload to Pinata
  const upload = await pinata.upload.file(file);
  console.log("JSON Upload successful:", upload);
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
  uploadJsonToPinata,
};
