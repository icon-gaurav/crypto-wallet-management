"use client"
import {createConfig, http, WagmiProvider} from 'wagmi'
import {mainnet, sepolia} from 'wagmi/chains'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {metaMask} from "@wagmi/connectors";
import {injected} from "wagmi/connectors";

const queryClient = new QueryClient();
export const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        metaMask(),
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})

export function Web3Provider({children}: { children: React.ReactNode }) {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider></WagmiProvider>;
}
