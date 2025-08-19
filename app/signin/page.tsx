"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import Link from "next/link";

export default function SignInPage() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-indigo-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
