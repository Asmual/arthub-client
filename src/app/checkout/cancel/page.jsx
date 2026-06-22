export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#243239] text-white flex items-center justify-center">
      <div className="text-center p-8 bg-[#1e262b] rounded-2xl border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black text-red-500 mb-2">❌ Payment Canceled</h1>
        <p className="text-white/60">The transaction was aborted. No charges were made.</p>
        <a href="/checkout" className="inline-block mt-6 bg-white/10 px-6 py-2.5 rounded-xl text-sm font-bold">Try Again</a>
      </div>
    </div>
  );
}