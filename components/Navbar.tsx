"use client";
// Navbar component for the application

import React from 'react';
import Link from 'next/link';
import {useAccount, useDisconnect} from "wagmi";

export default function Navbar() {
    const {isConnected} = useAccount()
    const {disconnect} = useDisconnect()
    return (
        <nav className="w-full  px-6 py-4 flex justify-between items-center bg-white shadow-md">
            <h1 className="text-2xl font-bold text-indigo-600">Crypto Wallet</h1>
            <div className="flex space-x-4">
                {isConnected ? (
                    <>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Dashboard
                        </Link>
                        <button className={"px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"}
                                onClick={() => {
                                    disconnect()
                                }}>
                            Disconnect
                        </button>


                    </>
                ) : (
                    <>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Connect Wallet
                        </Link>

                    </>
                )}
            </div>
        </nav>
    )
}
