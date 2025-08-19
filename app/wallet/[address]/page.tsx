"use client"
import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
import {useBalance} from "wagmi";
import Link from "next/link";

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

        if (address) {
            fetchTxs()
        }
    }, [address])

    return (
        <div className="min-h-screen min-w-screen p-6">
            <h1 className="text-xl font-bold mb-4">Wallet Details</h1>

            {/* Wallet address */}
            <p className="text-gray-700">Address: {address}</p>

            {/* Send Transaction button */}
            <div className="mt-4">
                <Link href={`/send/`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Send Transaction
                </Link>
            </div>

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
                            <th className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Time</th>
                            <th className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Hash</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {txs.map((tx) => (
                            <tr key={tx.hash}>
                                <td className="px-6 py-4 text-sm text-green-600 truncate">
                                    {tx?.from?.toLowerCase() == address?.toString()?.toLowerCase() ? "Sent" : "Received"}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link href={`/wallet/${tx.from}`}
                                          className="text-blue-500 hover:underline">
                                        {tx.from}

                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link href={`/wallet/${tx.to}`}
                                          className="text-blue-500 hover:underline">
                                        {tx.to}

                                    </Link></td>
                                <td className="px-6 py-4 text-sm">{tx.value} Wei</td>
                                <td className="px-6 py-4 text-sm">
                                    {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                          target="_blank"
                                          className="text-blue-500 hover:underline">
                                        {tx.hash.slice(0, 10)}...
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
