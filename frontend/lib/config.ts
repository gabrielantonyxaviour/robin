import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { educhainTestnet } from "./utils";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, educhainTestnet],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [educhainTestnet.id]: http(),
  },
});
