// components/GetTestEth.tsx
"use client";


export default function GetTestEth() {
    const faucetUrl = "https://sepoliafaucet.com/";

    return (
        <div className="mt-6 flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-700 shadow-md">
            <h2 className="text-lg font-semibold mb-2">Need Test ETH? 💧</h2>
            <p className="text-sm text-gray-400 mb-4 text-center">
                You’ll need Sepolia test ETH to make transactions.
                Use the faucet to top up your wallet.
            </p>
            <button
                onClick={() => window.open(faucetUrl, "_blank")}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition"
            >
                Get Test ETH
            </button>
        </div>
    );
}
