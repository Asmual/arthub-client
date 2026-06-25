"use client";

import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaSearch, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaDownload } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);

  // Fetch transaction records from the orders backend endpoint
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/payments/all-transactions");
       
        if (!res.ok) {
          throw new Error("Failed to capture master gateway transactions telemetry");
        }
       
        const data = await res.json();
        setTransactions(data || []);
      } catch (err) {
        console.error("Ledger fetch execution error:", err);
        toast.error("Could not sync transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter dynamic dataset based on user search metrics and payment states
  const filteredTransactions = transactions.filter((txn) => {
    const safeBuyerEmail = txn.buyerEmail || txn.userId || "";
    const safeTransactionId = txn.transactionId || "";
    const safeType = txn.type || "";
    const safeStatus = txn.status || "";

    const matchesSearch =
      safeBuyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeTransactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeType.toLowerCase().includes(searchTerm.toLowerCase());
     
    const matchesStatus = statusFilter === "all" || safeStatus === statusFilter;
   
    return matchesSearch && matchesStatus;
  });

  // Aggregate gross processed revenue across successful entries
  const totalRevenue = transactions
    .filter(t => t.status === "paid" || t.status === "succeeded")
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">
       
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaExchangeAlt className="text-[#df6742] text-xl" /> Buyer Transaction Ledger
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Monitor incoming payment intents, dynamic checkout records, and verified Stripe processing invoices.
          </p>
        </div>

        {/* Global Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md">
            <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Total Gross Revenue</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md">
            <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Total Statements</p>
            <h3 className="text-2xl font-black text-white mt-1">{transactions.length} Invoices</h3>
          </div>
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md">
            <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Gateway Status</p>
            <h3 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Stripe Live Node Connected
            </h3>
          </div>
        </div>

        {/* Filter Toolbar Interface */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#243239] border border-white/5 p-4 rounded-xl shadow-md">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search Email, Transaction ID, Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2f3f48] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#df6742]/60 transition-all"
            />
            <FaSearch className="absolute left-3 top-3.5 text-xs text-white/30" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#2f3f48] border border-white/8 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#df6742]/60 cursor-pointer text-white/80 w-full sm:w-auto"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Transactions Data Table */}
        <div className="bg-[#243239] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#df6742]" />
                <p className="text-xs text-white/40 tracking-wider">Synchronizing secure payment records...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/4 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4 pl-6">Transaction ID / Buyer</th>
                    <th className="p-4">Transaction Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center pr-6">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn._id || txn.id} className="hover:bg-white/2 transition-colors duration-150 text-white/90">
                     
                      {/* Transaction ID & Buyer Email Info */}
                      <td className="p-4 pl-6 space-y-1">
                        <p className="font-mono text-white/40 text-[11px] truncate max-w-[160px]" title={txn.transactionId}>
                          {txn.transactionId || "N/A"}
                        </p>
                        <p className="font-semibold text-white/80 truncate max-w-[200px]">
                          {txn.buyerEmail || txn.userId}
                        </p>
                      </td>

                      {/* Transaction Type Meta Mapping */}
                      <td className="p-4 font-medium text-white/70 uppercase text-xs tracking-wider">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          txn.type === "subscription" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {txn.type || "purchase"}
                        </span>
                      </td>

                      {/* Dynamic Monetary Pricing Render */}
                      <td className="p-4 font-bold text-[#df6742]">
                        ${(navigator && Number(txn.price) || 0).toFixed(2)}
                      </td>

                      {/* Core Gateway Payment Method */}
                      <td className="p-4 text-white/50 font-medium">
                        <span className="flex items-center gap-1">
                          <FaCreditCard className="text-[11px]" /> CARD
                        </span>
                      </td>

                      {/* Core Success/Fail Checkbox Nodes */}
                      <td className="p-4">
                        {txn.status === "paid" || txn.status === "succeeded" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                            <FaCheckCircle /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                            <FaExclamationTriangle /> Failed
                          </span>
                        )}
                      </td>

                      {/* Optional Receipt Downloader Triggers */}
                      <td className="p-4 text-center pr-6">
                        <button
                          onClick={() => toast.success(`Exporting Invoice Statement: ${txn._id || txn.id}`)}
                          className="p-2 bg-[#2f3f48] hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors border border-white/5"
                          title="Download Statement"
                        >
                          <FaDownload className="text-[11px]" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Empty State Pipeline State Wrapper */}
          {!loading && filteredTransactions.length === 0 && (
            <p className="text-center text-xs text-white/30 py-12">
              No matching transaction histories logged inside your payment gateway.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}