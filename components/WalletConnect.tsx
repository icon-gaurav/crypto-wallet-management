"use client"
import { useState } from "react"
import {useAccount, useConnect, useDisconnect} from "wagmi";

export default function WalletConnect({ onAddWallet, onConnectWallet }: {
    onAddWallet: (address: string) => void
}) {
    const [address, setAddress] = useState("")
    const { address:connectedAddress, isConnected } = useAccount()
    const {connectAsync, connectors, } = useConnect();
    const { disconnect } = useDisconnect();
    const handleConnect = async () => {
        try {
            disconnect(); // Disconnect any existing connection
            const connector = connectors[0]; // Assuming the first connector is the one we want
            const data = await connectAsync({ connector });
            console.log(data?.accounts)
            onAddWallet(data?.accounts?.[0]);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            console.log(error)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Wallet</h2>

            {/* Option 1: Add manually */}
            {/*<div className="mb-6">*/}
            {/*    <label className="block text-sm font-medium text-gray-700 mb-2">*/}
            {/*        Enter Wallet Address*/}
            {/*    </label>*/}
            {/*    <div className="flex gap-2">*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            placeholder="0x123..."*/}
            {/*            value={address}*/}
            {/*            onChange={(e) => setAddress(e.target.value)}*/}
            {/*            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"*/}
            {/*        />*/}
            {/*        <button*/}
            {/*            onClick={() => onAddWallet(address)}*/}
            {/*            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"*/}
            {/*        >*/}
            {/*            Save*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className="flex items-center gap-2 mb-6">*/}
            {/*    <div className="flex-grow border-t border-gray-300"></div>*/}
            {/*    <span className="text-sm text-gray-500">OR</span>*/}
            {/*    <div className="flex-grow border-t border-gray-300"></div>*/}
            {/*</div>*/}

            {/* Option 2: Connect wallet */}
            <div className="text-center">
                <button
                    onClick={handleConnect}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Connect Using External Wallet
                </button>
            </div>
        </div>
    )
}
