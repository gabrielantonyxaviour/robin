import { PinataSDK } from "pinata";

export async function uploadJsonToPinata(
  name: string,
  jsonObject: Record<string, any>
): Promise<string> {
  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT || "",
    pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
  });

  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonObject, null, 2);

  // Create a File object from the JSON string
  const file = new File([jsonString], `${name}.json`, {
    type: "application/json",
  });

  // Upload to Pinata
  const upload = await pinata.upload.file(file);
  console.log("Upload successful:", upload);

  // Generate a signed URL
  const url: string = await pinata.gateways.createSignedURL({
    cid: upload.cid,
    expires: 99999999999,
  });

  console.log(url);
  return url;
}
