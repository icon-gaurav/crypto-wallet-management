"use client"
import { useState } from "react"
import {useAccount, useConnect, useDisconnect} from "wagmi";

export default function WalletConnect({ onAddWallet }: {
    onAddWallet: (address: string) => void
}) {
    const {connectAsync, connectors, status , reset, error} = useConnect();
    const { disconnect } = useDisconnect();
    const handleConnect = async () => {
        try {
            disconnect(); // Disconnect any existing connection
            const connector = connectors[0]; // Assuming the first connector is the one we want
            const data = await connectAsync({ connector });
            onAddWallet(data?.accounts?.[0]);
        } catch (error) {
            reset()
            console.error("Failed to connect wallet:", error);
            console.log(error)
        }
    }


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Wallet</h2>

            {/* Option 2: Connect wallet */}
            <div className="text-center">
                <button
                    onClick={handleConnect}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    {status === 'pending'? 'Connecting...' :'Connect Using External Wallet'}
                </button>

                {error && <p className="text-red-600 mt-2">{error.message}</p>}
            </div>
        </div>
    )
}
