import * as ed from "@noble/ed25519";
import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  BUNDLER_ADDRESS,
  bundlerABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
} from "@farcaster/hub-nodejs";
import { bytesToHex, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const APP_FID = "895939";
  const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY;
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: optimism,
    transport: http(),
  });
  const app = privateKeyToAccount("0x" + APP_PRIVATE_KEY);
  const appAccountKey = new ViemLocalEip712Signer(app);
  console.log(process.env.AI_AGENT_PRIVATE_KEY);
  const aiAgent = privateKeyToAccount("0x" + process.env.AI_AGENT_PRIVATE_KEY);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
  let nonce = await publicClient.readContract({
    address: KEY_GATEWAY_ADDRESS,
    abi: keyGatewayABI,
    functionName: "nonces",
    args: ["0x5A6B842891032d702517a4E52ec38eE561063539"],
  });

  console.log("Nonce");
  console.log(nonce);

  const transferSignatureResult = await appAccountKey.signTransfer({
    fid: APP_FID,
    to: "0x5A6B842891032d702517a4E52ec38eE561063539",
    nonce,
    deadline,
  });

  let transferSignature;

  if (transferSignatureResult.isOk()) {
    transferSignature = transferSignatureResult.value;
    console.log("Transfer Signature");
    console.log(transferSignature);
  } else {
    throw new Error("Failed to generate register signature");
  }

  const { request } = await publicClient.simulateContract({
    account: aiAgent,
    address: ID_GATEWAY_ADDRESS,
    abi: idRegistryABI,
    functionName: "recover",
    args: [
      "0xEe3e96B1a4849ce98c0A975Fa88325BAa2224061",
      "0x5A6B842891032d702517a4E52ec38eE561063539",
      deadline,
      bytesToHex(transferSignature),
    ],
  });

  const recoverTx = await walletClient.writeContract(request);

  console.log("Recover Tx");
  console.log(recoverTx);
}

main().then(() => console.log("done"));
