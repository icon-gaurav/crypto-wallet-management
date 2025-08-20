"use client";

import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {ExternalLink} from "lucide-react";

interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timeStamp: number;
}

export default function TransactionsPage() {
    const {address, isConnected} = useAccount();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // replace this with your provider API
    const fetchTransactions = async (pageNumber: number) => {
        if (!address) return;
        setLoading(true);

        try {
            // Example using Etherscan API (you can use Alchemy/Moralis/Blockscout too)
            const res = await fetch(
                `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${pageNumber}&offset=5&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
            );
            const data = await res.json();
            setTransactions(data.result);

        } catch (err) {
            console.error("Error fetching transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected) {
            fetchTransactions(page);
        }
    }, [page, isConnected]);

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-6 border rounded-lg shadow-md text-center">
                    <p className="text-lg font-semibold">No wallet connected</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Connect your wallet to view transactions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-6">Transactions</h1>

            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Sender</th>
                            <th className="px-4 py-2 text-left">Receiver</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Amount (ETH)</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx) => {
                            const type =
                                tx.from.toLowerCase() === address?.toLowerCase()
                                    ? "Sent"
                                    : "Received";

                            const date = new Date(
                                parseInt(tx.timeStamp.toString()) * 1000
                            ).toLocaleString();

                            const amount = (parseFloat(tx.value) / 1e18).toFixed(5);

                            return (
                                <tr key={tx.hash} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{tx.from}</td>
                                    <td className="px-4 py-2">{tx.to}</td>
                                    <td className="px-4 py-2 text-center">{type}</td>
                                    <td className="px-4 py-2">{date}</td>
                                    <td className="px-4 py-2">{amount}</td>
                                    <td className="px-4 py-2 text-center">
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            View <ExternalLink className="w-4 h-4"/>
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
