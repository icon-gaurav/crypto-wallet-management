
import Link from "next/link";
import {createClient} from "@/lib/supabase/server";


export default async function Home() {
    const supabase = await createClient();
    const {data:{user}, error} = await supabase.auth.getUser()


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">


            {!user && (
                <header className="mt-16 text-center max-w-2xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Manage Your Crypto with Ease 🚀
                    </h2>
                    <p className="text-lg text-gray-600">
                        Create wallets, send & receive Ethereum, track balances, and view
                        your transaction history — all in one secure and easy-to-use app.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/signup"
                            className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </header>
            )}
        </div>
    );
}
