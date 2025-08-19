import SendTransaction from "@/components/SendTransaction";

export default function SendPage(){
    return (
        <div className="min-h-screen w-full p-6">
            <h2 className="text-lg font-bold mb-4">Send Transaction</h2>
            <SendTransaction/>
        </div>
    );
}
