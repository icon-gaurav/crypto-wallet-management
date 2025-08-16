"use client"
import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
import {useBalance} from "wagmi";
import Link from "next/link";
import {createClient} from "@/lib/supabase/client";

interface Transaction {
    hash: string
    from: string
    to: string
    value: string
    timeStamp: string
}

export default function WalletDetail() {
    const {address} = useParams()
    const [txs, setTxs] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient();
    const {data, isError, isLoading} = useBalance({
        address: address as `0x${string}`,
    });

    useEffect(() => {
        const fetchTxs = async () => {
            setLoading(true)
            // Fetch from Etherscan API (Sepolia)
            const res = await fetch(
                `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
            )
            const json = await res.json()
            if (json.status === "1") {
                setTxs(json.result)
            }
            setLoading(false)
        }
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

        if (address) {
            fetchTxs()
            saveWallet()
        }
    }, [address])

    return (
        <div className="min-h-screen min-w-screen p-6">
            <h1 className="text-xl font-bold mb-4">Wallet Details</h1>

            {/* Wallet address */}
            <p className="text-gray-700">Address: {address}</p>

            {/* Balance section */}
            <div className="mt-4 p-4  rounded-lg bg-gray-50 shadow">
                {isLoading && <p>Fetching balance...</p>}
                {isError && <p className="text-red-500">Error fetching balance.</p>}
                {data && (
                    <p className="text-lg font-semibold">
                        Balance: {data.formatted} {data.symbol}
                    </p>
                )}
            </div>


            {loading ? (
                <p>Loading transactions...</p>
            ) : txs.length === 0 ? (
                <p>No transactions found for this wallet.</p>
            ) : (
                <div className="bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {txs.map((tx) => (
                            <tr key={tx.hash}>
                                <td className="px-6 py-4 text-sm text-green-600 truncate">
                                    {tx.from.toLowerCase() === address ? "Sent" : "Received"}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link href={`/wallet/${tx.from}`}
                                          className="text-blue-500 hover:underline">
                                        {tx.from}

                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link href={`/wallet/${tx.from}`}
                                          className="text-blue-500 hover:underline">
                                        {tx.to}

                                    </Link></td>
                                <td className="px-6 py-4 text-sm">{tx.value} Wei</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
