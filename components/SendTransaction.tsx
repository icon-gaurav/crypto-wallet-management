"use client";

import { useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import Link from "next/link";

export default function SendTransaction() {
    const [to, setTo] = useState<`0x${string}` | "">("")
    const [amount, setAmount] = useState("");

    const { data, isPending, sendTransaction, error } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash:data,
        })

    const handleSend = async () => {
        try {
            await sendTransaction({
                to:to as `0x${string}`,
                value: parseEther(amount), // convert ETH string to wei
            });
        } catch (err) {
            console.error("Transaction failed:", err);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto space-y-4">
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
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && <p>Transaction confirmed.</p>}
            {data && (
                <p className="text-sm text-green-600">
                    ✅ Transaction sent! {data}
                    <Link
                        href={`/dashboard`}
                        className="underline"
                    >
                        Click here to view history
                    </Link>
                </p>
            )}
            {error && (
                <p className="text-sm text-red-600">
                    ❌ Error: {error.message}
                </p>
            )}
        </div>
    );
}
