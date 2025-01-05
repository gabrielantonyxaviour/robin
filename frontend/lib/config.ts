import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { educhainTestnet } from "./utils";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [educhainTestnet],
  connectors: [injected()],
  transports: {
    [educhainTestnet.id]: http(),
  },
});
