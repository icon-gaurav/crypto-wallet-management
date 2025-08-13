// Navbar component for the application

import React from 'react';
import Link from 'next/link';
import {createClient} from '@/lib/supabase/server';

export default async function Navbar() {
    const supabase = await createClient();
    const {data: {user}, error} = await supabase.auth.getUser()
    return (
        <nav className="w-full  px-6 py-4 flex justify-between items-center bg-white shadow-md">
            <h1 className="text-2xl font-bold text-indigo-600">Crypto Wallet</h1>
            <div className="flex space-x-4">
                {user ? (
                    <>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/signin"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
