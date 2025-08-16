"use client";
import axios from "axios"
import {useAccount, useBalance, useConnect, useDisconnect} from 'wagmi';

import { injected } from 'wagmi/connectors'
import {useState} from "react";
import TransactionList from "@/components/TransactionsList";
import GetTestEth from "@/components/GetTestEth";
import {createClient} from "@/lib/supabase/client";

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const { connectAsync, connectors } = useConnect();
    const { data: balance, isLoading } = useBalance({ address });
    const { disconnect } = useDisconnect();
    const supabase = createClient();

    const [txs, setTxs] = useState<any[]>([]);
    const [loadingTxs, setLoadingTxs] = useState(false);

    async function handleConnect() {
        try {
            // Pick the first available connector (usually MetaMask)
            const connector = connectors[0];
            if (!connector) throw new Error("No wallet connector found");

            const data = await connectAsync({ connector });
            console.log("Connected:", data);
            await saveWallet();
        } catch (error) {
            console.error("Connection failed:", error);
        }
    }

    async function saveWallet() {
        // Placeholder for saving wallet logic
        console.log("Saving wallet:", address);
        // save to supabase wallets table
        try{
            const { error } = await supabase.from('wallets').upsert([{ address: address }]).select();
            if (error) throw error;
            console.log("Wallet saved successfully");
        } catch (error) {
            console.error("Error saving wallet:", error);
        }
    }

    // Fetch transactions from Etherscan
    async function fetchTransactions() {
        if (!address) return;
        setLoadingTxs(true);

        try {
            const res = await axios.get(
                `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
            );
            setTxs(res.data.result);
        } catch (err) {
            console.error("Failed to fetch txs:", err);
        }

        setLoadingTxs(false);
    }

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen ">
                <h1 className="text-2xl font-bold mb-4">Wallet Not Connected</h1>
                <p className="mb-4 text-gray-600">
                    Please connect your wallet to access the dashboard.
                </p>
                <button
                    onClick={handleConnect}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <button
                        onClick={() => disconnect()}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Disconnect
                    </button>
                </div>

                {/* Wallet Info */}
                <div className="mb-6">
                    <p className="text-gray-600">Wallet Address:</p>
                    <p className="font-mono text-sm break-all">{address}</p>
                </div>

                {/* Balance */}
                <div className="mb-6">
                    <p className="text-gray-600">Balance:</p>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <p className="font-semibold">
                            {balance?.formatted} {balance?.symbol}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div>
                    <button
                        onClick={() => alert('Send Transaction flow coming soon!')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Send Transaction
                    </button>
                </div>
            </div>
            {/* Faucet Section */}
            <GetTestEth />
            <TransactionList />
        </div>
    );
}
