const { uploadJsonToPinata } = require("../utils/uploadJsonToPinata");

const response = [
  "A secret code",
  "In a secure offline wallet",
  "To help access to the wallet",
];

async function main() {
  const uri = await uploadJsonToPinata("resps", response);
  console.log(uri);
}

main();
