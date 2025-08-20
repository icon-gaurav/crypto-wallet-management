"use client"
import {redirect, RedirectType} from "next/navigation";
import WalletConnect from "@/components/WalletConnect";
import {useAccount} from "wagmi";


export default function Home() {
    const { isConnected } = useAccount()

    if(isConnected){
        // Redirect to dashboard if user is already logged in
        redirect('/dashboard', RedirectType.push)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">


            {!isConnected && (
                <header className="mt-16 text-center max-w-2xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Manage Your Crypto with Ease 🚀
                    </h2>
                    <p className="text-lg text-gray-600">
                        Create wallets, send & receive Ethereum, track balances, and view
                        your transaction history — all in one secure and easy-to-use app.
                    </p>
                    <div className="mt-6">
                       <WalletConnect onAddWallet={()=> redirect('/dashboard')}/>
                    </div>
                </header>
            )}
        </div>
    );
}
