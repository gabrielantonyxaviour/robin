import * as ed from "@noble/ed25519";
import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  getInsecureHubRpcClient,
  makeUserDataAdd,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  BUNDLER_ADDRESS,
  bundlerABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  makeUserNameProofClaim,
  FarcasterNetwork,
  UserDataType,
} from "@farcaster/hub-nodejs";
import { bytesToHex, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";
import dotenv from "dotenv";
import axios from "axios";
import {
  NeynarAPIClient,
  Configuration,
  isApiErrorResponse,
} from "@neynar/nodejs-sdk";

dotenv.config();
const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY, // Replace with your Neynar API Key.
});
const hubClient = new NeynarAPIClient(config);
const submitMessage = async (resultPromise) => {
  const result = await resultPromise;
  if (result.isErr()) {
    throw new Error(`Error creating message: ${result.error}`);
  }
  const messageSubmitResult = await hubClient.updateUser(result.value);
  if (messageSubmitResult.isErr()) {
    throw new Error(
      `Error submitting message to hub: ${messageSubmitResult.error}`
    );
  }
};

async function registerFName() {
  const app = privateKeyToAccount("0x" + process.env.APP_PRIVATE_KEY);
  const appAccountKey = new ViemLocalEip712Signer(app);
  const timestamp = Math.floor(Date.now() / 1000);
  console.log(timestamp);
  const claim = makeUserNameProofClaim({
    name: "edurobinx",
    owner: app.address,
    timestamp,
  });
  console.log(claim);
  const signature = (await appAccountKey.signUserNameProofClaim(claim)).value;
  console.log(bytesToHex(signature));
  const response = await axios.post("https://fnames.farcaster.xyz/transfers", {
    name: "edurobinx", // Name to register
    from: 0, // Fid to transfer from (0 for a new registration)
    to: 895939, // Fid to transfer to (0 to unregister)
    fid: 895939, // Fid making the request (must match from or to)
    owner: app.address, // Custody address of fid making the request
    timestamp: timestamp, // Current timestamp in seconds
    signature: bytesToHex(signature), // EIP-712 signature signed by the current custody address of the fid
  });
  console.log(response);
}

async function main() {
  const FID = 895939;
  console.log("0x" + process.env.APP_PRIVATE_KEY);

  const fname = "edurobinx";
  const app = privateKeyToAccount("0x" + process.env.APP_PRIVATE_KEY);
  console.log("UESSS");
  //   const appAccountKey = new ViemLocalEip712Signer(app);
  const ed25519Signer = new NobleEd25519Signer(process.env.APP_PRIVATE_KEY);
  const dataOptions = {
    fid: FID,
    network: FarcasterNetwork.MAINNET,
  };
  const userDataPfpBody = {
    type: UserDataType.USERNAME,
    value: fname,
  };

  await submitMessage(
    makeUserDataAdd(userDataPfpBody, dataOptions, ed25519Signer)
  );
}

main().then(() => console.log("done"));
