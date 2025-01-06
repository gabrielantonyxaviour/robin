import { PinataSDK } from "pinata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, jsonObject } = await request.json();

    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT || "",
      pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
    });

    const jsonString = JSON.stringify(jsonObject, null, 2);
    const file = new File([jsonString], `${name}.json`, {
      type: "application/json",
    });

    const upload = await pinata.upload.file(file);
    const url: string = await pinata.gateways.createSignedURL({
      cid: upload.cid,
      expires: 99999999999,
    });

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error}` },
      { status: 500 }
    );
  }
}
