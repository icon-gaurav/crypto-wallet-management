"use client"
import {redirect, RedirectType} from "next/navigation";
import WalletConnect from "@/components/WalletConnect";
import {useAccount} from "wagmi";
import Link from "next/link";


export default function Home() {
    const { isConnected } = useAccount()

    if(isConnected){
        // Redirect to dashboard if user is already logged in
        redirect('/dashboard', RedirectType.push)
    }

    return (
        <div className="flex flex-col items-center justify-center px-6">

            {/* ===== Hero Section with Wallet Connect ===== */}
            <section className="text-center mt-20 max-w-3xl">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Manage Your Crypto with Ease 🚀
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Create wallets, send & receive Ethereum, and track transactions —
                    all in one secure, easy-to-use app.
                </p>

                {/* Connect CTA */}
                <div className="mt-6">
                    <WalletConnect onAddWallet={() => redirect('/dashboard')}/>
                    <p className="text-sm text-gray-500 mt-3">
                        Don’t have a wallet yet? Install{" "}
                        <Link
                            href="https://metamask.io/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            MetaMask
                        </Link>{" "}
                        to get started.
                    </p>
                </div>
            </section>

            {/* ===== Features Section ===== */}
            <section className="bg-gray-50 rounded-xl p-8 shadow-md mt-16 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center">
                    <span className="mr-2">🔥</span> What You Can Do
                </h2>
                <ul className="space-y-4 text-gray-700 text-left">
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✔️</span>
                        View wallet details: address, balance, and avatar.
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✔️</span>
                        Send Ethereum instantly with just a few clicks.
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✔️</span>
                        Track incoming & outgoing transactions with statuses.
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✔️</span>
                        Access transaction history in a clean, paginated format.
                    </li>
                </ul>
            </section>

            {/* ===== Networks Section ===== */}
            <section className="mt-12 text-center max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">🌐 Supported Networks</h3>
                <p className="text-gray-600">
                    Currently, we support the <span className="font-bold">Ethereum Sepolia Testnet</span>.
                    More networks like Polygon, Arbitrum, and Optimism are coming soon!
                </p>
            </section>


        </div>
    );
}
