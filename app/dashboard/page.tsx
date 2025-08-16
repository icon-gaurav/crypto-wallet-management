"use client";
import {useAccount, useBalance, useConnect, useDisconnect} from 'wagmi';
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import WalletConnect from "@/components/WalletConnect";

export default function DashboardPage() {
    const [newWalletAddress, setNewWalletAddress] = useState("");
    const {address, isConnected} = useAccount();

    const supabase = createClient();
    const [wallets, setWallets] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    async function saveWallet() {
        // Placeholder for saving wallet logic
        console.log("Saving wallet:", address);
        // save to supabase wallets table
        try {
            const {error} = await supabase.from('wallets').upsert([{address: address}]).select();
            if (error) throw error;
            console.log("Wallet saved successfully");
        } catch (error) {
            console.error("Error saving wallet:", error);
        }
    }


    // 🔹 Save wallet manually
    const handleAddWallet = async (address: string) => {
        const {error} = await supabase.from("wallets").insert([{address}])
        if (!error) {
            setWallets((prev) => [...prev, address])
        }
    }

    // 🔹 Connect wallet using MetaMask
    const handleConnectWallet = async () => {
        // wagmi connectAsync() logic goes here
        // For now, we’ll mock it:
        const mockAddress = "0x1234567890abcdef..."
        await handleAddWallet(mockAddress)
    }

    // 🔹 Navigate to wallet detail page
    const goToWallet = (address: string) => {
        router.push(`/wallet/${address}`)
    }

    useEffect(() => {
        const fetchWallets = async () => {
            setLoading(true)
            const {data, error} = await supabase.from("wallets").select("id,address,created_at")
            if (!error && data) {
                setWallets(data.map((w) => w.address))
            }
            setLoading(false)
        }
        fetchWallets()
    }, [])


    return (
        <div className="min-h-screen p-6 min-w-screen">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            {/* Add Wallet Section */}
            {loading ? (
                <p>Loading...</p>
            ) : wallets.length > 0 ? (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Recent Connected Wallets</h2>
                    <ul className="space-y-2">
                        {wallets.map((addr) => (
                            <li
                                key={addr}
                                className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition"
                            >
                                {/* Wallet address */}
                                <span
                                    onClick={() => goToWallet(addr)}
                                    className="cursor-pointer text-gray-800 font-mono text-sm truncate"
                                >
      {addr}
    </span>

                                {/* Action buttons */}
                                <div className="flex space-x-2">
                                    {/* View History */}
                                    <button
                                        onClick={() => goToWallet(addr)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        View History
                                    </button>

                                    {/* Copy address */}
                                    <button
                                        onClick={() => navigator.clipboard.writeText(addr)}
                                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                                    >
                                        Copy
                                    </button>

                                    {/* Remove address */}
                                    <button
                                        onClick={async () => {
                                            const {error} = await supabase.from("wallets").delete().eq("address", addr)
                                            if (!error) {
                                                setWallets((prev) => prev.filter((w) => w !== addr))
                                            }
                                        }}
                                        className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500">No wallets connected yet.</p>
            )}

            {/* Connect Wallet Section */}
            <WalletConnect
                onAddWallet={handleAddWallet}
            />
        </div>
    );
}
