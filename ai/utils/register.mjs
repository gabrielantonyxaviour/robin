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
  const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY;
  const ROBINX_PRIVATE_KEY = process.env.ROBINX_PRIVATE_KEY;
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: optimism,
    transport: http(),
  });
  const app = privateKeyToAccount(APP_PRIVATE_KEY);
  const appAccountKey = new ViemLocalEip712Signer(app);

  const alice = privateKeyToAccount(ALICE_PRIVATE_KEY);
  const aliceAccountKey = new ViemLocalEip712Signer(alice);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // Set the signatures' deadline to 1 hour from now

  const WARPCAST_RECOVERY_PROXY = "0x4300A3760B05B7D8e7b4A0135E356F91385C257c";

  const price = await publicClient.readContract({
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: "price",
    args: [0n],
  });

  /**
   *  Call `register` to register an FID to the app account.
   */
  const { request } = await publicClient.simulateContract({
    account: app,
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: "register",
    args: [WARPCAST_RECOVERY_PROXY, 0n],
    value: price,
  });
  await walletClient.writeContract(request);

  /**
   *  Read the app fid from the Id Registry contract.
   */
  const APP_FID = await publicClient.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "idOf",
    args: [app.address],
  });

  let nonce = await publicClient.readContract({
    address: KEY_GATEWAY_ADDRESS,
    abi: keyGatewayABI,
    functionName: "nonces",
    args: [robinx.address],
  });

  console.log("Nonce");
  console.log(nonce);

  const registerSignatureResult = await robinxAccountKey.signRegister({
    to: robinx.address,
    recovery: "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
    nonce,
    deadline,
  });

  let registerSignature;
  if (registerSignatureResult.isOk()) {
    registerSignature = registerSignatureResult.value;
    console.log("Register Signature");
    console.log(registerSignature);
  } else {
    throw new Error("Failed to generate register signature");
  }

  const privateKeyBytes = ed.utils.randomPrivateKey();
  const accountKey = new NobleEd25519Signer(privateKeyBytes);

  let accountPubKey = new Uint8Array();
  const accountKeyResult = await accountKey.getSignerKey();
  if (accountKeyResult.isOk()) {
    accountPubKey = accountKeyResult.value;

    const signedKeyRequestMetadata =
      await appAccountKey.getSignedKeyRequestMetadata({
        requestFid: APP_FID,
        key: accountPubKey,
        deadline,
      });

    if (signedKeyRequestMetadata.isOk()) {
      const metadata = bytesToHex(signedKeyRequestMetadata.value);
      /**
       *  3. Read Alice's nonce from the Key Gateway.
       */
      nonce = await publicClient.readContract({
        address: KEY_GATEWAY_ADDRESS,
        abi: keyGatewayABI,
        functionName: "nonces",
        args: [robinx.address],
      });

      /**
       *  Then, collect her `Add` signature.
       */
      const addSignatureResult = await robinxAccountKey.signAdd({
        owner: robinx.address,
        keyType: 1,
        key: accountPubKey,
        metadataType: 1,
        metadata,
        nonce,
        deadline,
      });

      if (addSignatureResult.isOk()) {
        const addSignature = addSignatureResult.value;
        /**
         *  Read the current registration price.
         */
        const price = await publicClient.readContract({
          address: BUNDLER_ADDRESS,
          abi: bundlerABI,
          functionName: "price",
          args: [0n],
        });

        const { request } = await publicClient.simulateContract({
          account: app,
          address: BUNDLER_ADDRESS,
          abi: bundlerABI,
          functionName: "register",
          args: [
            {
              to: robinx.address,
              recovery: "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
              sig: bytesToHex(registerSignature),
              deadline,
            },
            [
              {
                keyType: 1,
                key: bytesToHex(accountPubKey),
                metadataType: 1,
                metadata: metadata,
                sig: bytesToHex(addSignature),
                deadline,
              },
            ],
            0n,
          ],
          value: price,
        });
        await walletClient.writeContract(request);
      }
    }
  }
}

main().then(() => console.log("done"));
