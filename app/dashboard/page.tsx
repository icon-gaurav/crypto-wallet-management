"use client";

import {useAccount, useBalance} from "wagmi";
import {useState} from "react";
import {Copy, Send, Wallet, ExternalLink, X} from "lucide-react";
import {redirect} from "next/navigation";
import SendTransaction from "@/components/SendTransaction";

export default function DashboardPage() {
    const {address, isConnected} = useAccount();
    const {data: balance} = useBalance({address});

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            alert("Wallet address copied!");
        }
    };

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-6 border rounded-lg shadow-md text-center">
                    <p className="text-lg font-semibold">No wallet connected</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Please connect your wallet to view your dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Wallet Info */}
            <div className="border rounded-lg shadow-md p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Wallet className="w-10 h-10 text-blue-600"/>
                    <div>
                        <p className="text-sm text-gray-500">Connected Wallet</p>
                        <p className="font-semibold">{address}</p>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-2 border rounded-lg hover:bg-gray-100"
                >
                    <Copy className="w-4 h-4"/>
                </button>
            </div>

            {/* Balance Info */}
            <div className="border rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-2xl font-bold mt-2">
                    {balance ? `${balance.formatted} ${balance.symbol}` : "Loading..."}
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Send className="w-4 h-4"/> Send Money
                </button>

                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                        onClick={() => redirect('/transactions')}>
                    <ExternalLink className="w-4 h-4"/> View All Transactions
                </button>

                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                        onClick={() => redirect('/transactions')}>
                    <ExternalLink className="w-4 h-4"/> Check Txn Status
                </button>
            </div>

            {/* Send Money Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                        {/*<h2 className="text-xl font-semibold mb-4">Send Money</h2>*/}
                        <SendTransaction/>
                    </div>
                </div>
            )}
        </div>
    );
}
