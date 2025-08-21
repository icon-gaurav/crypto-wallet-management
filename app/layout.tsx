import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {ThemeProvider} from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {Web3Provider} from "@/lib/web3/Web3Provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Crypto Wallet",
    description: "Check Balance & transaction of your crypto wallets",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Web3Provider>
                <div
                    className="w-full min-h-screen flex flex-col items-center  bg-gray-50 text-gray-800 pt-16">
                    <Navbar/>
                    {children}
                </div>
            </Web3Provider>
        </ThemeProvider>
        </body>
        </html>
    );
}
