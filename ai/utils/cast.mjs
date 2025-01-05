import {
  makeCastAdd,
  makeCastRemove,
  makeLinkAdd,
  makeLinkRemove,
  makeReactionAdd,
  makeReactionRemove,
  makeUserDataAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  getInsecureHubRpcClient,
  UserDataType,
} from "@farcaster/hub-nodejs";
import dotenv from "dotenv";
dotenv.config();

async function cast() {
  const FC_NETWORK = FarcasterNetwork.MAINNET;
  const FID = 895939;
  const dataOptions = {
    fid: FID,
    network: FC_NETWORK,
  };
  const client = getInsecureHubRpcClient("hub.pinata.cloud");
  const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY;
  const ed25519Signer = new NobleEd25519Signer(APP_PRIVATE_KEY);
  const castResults = [];

  // const cast = await makeCastAdd(
  //   {
  //     text: "",
  //     embeds: [{ url: "https://robinx-ai.vercel.app/quiz/2" }],
  //     embedsDeprecated: [],
  //   },
  //   dataOptions,
  //   ed25519Signer
  // );
  // console.log(cast);

  // castResults.push(cast);

  const usernameUpdate = await makeUserDataAdd(
    {
      type: UserDataType.USERNAME,
      value: "edurobinx",
    },
    dataOptions,
    ed25519Signer
  );
  console.log(usernameUpdate);
  castResults.push(usernameUpdate);

  const bioUpdate = await makeUserDataAdd(
    {
      type: UserDataType.BIO,
      value: "spreading web3 awareness, one quiz at a time.",
    },
    dataOptions,
    ed25519Signer
  );
  console.log(bioUpdate);
  castResults.push(bioUpdate);
  const rrespo = await client.submitMessage(usernameUpdate);
  const rseefs = await client.submitMessage(bioUpdate);
  console.log(rrespo);
  console.log(rseefs);
  // castResults.map((castAddResult) =>
  //   castAddResult.map((castAdd) => client.submitMessage(castAdd))
  // );

  client.close();
}

cast().then(() => console.log("done"));
