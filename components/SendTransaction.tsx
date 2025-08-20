"use client";

import { useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import Link from "next/link";

export default function SendTransaction() {
    const [to, setTo] = useState<`0x${string}` | "">("");
    const [amount, setAmount] = useState("");

    const { data: txHash, isPending, sendTransaction, error } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash: txHash, // hash of transaction
        });

    const handleSend = async () => {
        try {
            await sendTransaction({
                to: to as `0x${string}`,
                value: parseEther(amount), // convert ETH string to wei
            });
        } catch (err) {
            console.error("Transaction failed:", err);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-4 rounded">
            <h2 className="text-lg font-semibold">Send ETH</h2>

            <input
                type="text"
                placeholder="Recipient address (0x...)"
                value={to}
                onChange={(e) => setTo(e.target.value as `0x${string}` | "")}
                className="w-full p-2 border rounded"
            />

            <input
                type="text"
                placeholder="Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
            />

            <button
                onClick={handleSend}
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {isPending ? "Sending..." : "Send"}
            </button>

            {/* Transaction States */}
            {isPending && <p className="text-yellow-600">⏳ Transaction is being sent...</p>}
            {isConfirming && <p className="text-blue-600">⏳ Waiting for confirmation...</p>}
            {isConfirmed && (
                <p className="text-green-600">
                    ✅ Transaction confirmed!
                </p>
            )}

            {/* Transaction Details */}
            {txHash && (
                <div className="mt-2 space-y-2">
                    <p className="text-sm break-all">
                        🔗 Tx Hash: {txHash}
                    </p>
                    <Link
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        className="underline text-blue-600"
                    >
                        View on Etherscan
                    </Link>
                    <br />
                    <Link
                        href={`/dashboard`}
                        className="underline text-purple-600"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">
                    ❌ Error: {error.message}
                </p>
            )}
        </div>
    );
}
