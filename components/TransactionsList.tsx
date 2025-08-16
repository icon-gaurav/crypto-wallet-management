"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

interface Transaction {
    hash: string;
    value: string;
    timeStamp: string;
    from: string;
    to: string;
}

export default function TransactionList() {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        if (!address) return;
        setLoading(true);
        setError("");

        try {
            const res = await axios.get(
                `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
            );

            if (res.data.status === "1") {
                setTransactions(res.data.result);
            } else {
                setTransactions([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (address) fetchTransactions();
    }, [address]);

    return (
        <div className="mt-6 p-4 border rounded-xl bg-white shadow-md">
            <h2 className="text-lg font-bold mb-2">Transaction History</h2>

            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && transactions.length === 0 && (
                <p className="text-gray-500">No transactions found for this wallet.</p>
            )}

            <ul className="space-y-3">
                {transactions.map((tx) => (
                    <li
                        key={tx.hash}
                        className="border p-3 rounded-lg shadow-sm bg-gray-50"
                    >
                        <p>
                            <span className="font-semibold">Hash:</span>{" "}
                            <a
                                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {tx.hash.slice(0, 10)}...
                            </a>
                        </p>
                        <p>
                            <span className="font-semibold">From:</span>{" "}
                            {tx.from.slice(0, 10)}...
                        </p>
                        <p>
                            <span className="font-semibold">To:</span> {tx.to.slice(0, 10)}...
                        </p>
                        <p>
                            <span className="font-semibold">Value:</span>{" "}
                            {parseFloat(tx.value) / 1e18} ETH
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
