// 📁 src/pages/AccountSettings/sections/SubscriptionBilling.tsx

import { useState } from "react";

const billingHistory = [
  { date: "Oct 1, 2025", amount: "$15.00", status: "Paid" },
  { date: "Sep 1, 2025", amount: "$15.00", status: "Paid" },
];

const SubscriptionSection = () => {
  const [autoRenew, setAutoRenew] = useState(false);

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
            Subscription & Billing
          </h3>
          <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
            Manage your plan and payment details.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-body text-xs font-semibold">
          Active Plan
        </span>
      </div>

      <div className="space-y-5">

        {/* Current Plan */}
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #3D52C4, #4F6AF5)" }}
        >
          <div>
            <p className="font-body text-[10px] text-white/60 uppercase tracking-widest font-semibold mb-1">
              Current Plan
            </p>
            <p className="font-display text-xl font-bold text-white">
              Storyteller Premium
            </p>
            <p className="font-body text-xs text-white/70 mt-0.5">
              $15.00 / month • Renews on Nov 1st, 2023
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white font-body text-xs font-semibold hover:bg-white/30 transition-all">
            Change Plan
          </button>
        </div>

        {/* Auto Renew */}
        <div className="flex items-center justify-between py-3 border-b border-light-outline-secondary dark:border-dark-primary-30 opacity-80">
          <div>
            <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
              Enable Auto Renew
            </p>
            <p className="font-body text-xs text-light-text dark:text-dark-text opacity-100 mt-0.5 max-w-sm">
              This option, if checked, will renew your subscription when the current plan expires.
            </p>
          </div>
          {/* Toggle */}
          <button
            onClick={() => setAutoRenew(!autoRenew)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0
              ${autoRenew
                ? "bg-light-primary dark:bg-dark-primary"
                : "bg-light-outline-secondary dark:bg-dark-primary-30"
              }
            `}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300
              ${autoRenew ? "left-5" : "left-0.5"}
            `} />
          </button>
        </div>

        {/* Payment Method */}
        <div>
          <p className="font-body text-xs font-bold text-light-outline dark:text-dark-text opacity-80 uppercase tracking-widest mb-3">
            Payment Method
          </p>
          <div className="flex items-center justify-between p-3 rounded-xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-5 rounded bg-light-outline-secondary/30 flex items-center justify-center">
                <svg width="14" height="10" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" rx="2" fill="#E5E7EB"/>
                  <rect y="5" width="24" height="4" fill="#9CA3AF"/>
                </svg>
              </div>
              <div>
                <p className="font-body text-sm text-light-text dark:text-dark-text font-medium">
                  Visa ending in 4242
                </p>
                <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-50">
                  Expiry 12/2024
                </p>
              </div>
            </div>
            <button className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary hover:underline underline-offset-2">
              Edit
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div>
          <p className="font-body text-xs font-bold text-light-outline dark:text-dark-text opacity-80 uppercase tracking-widest mb-3">
            Billing History
          </p>
          <div className="rounded-xl  border-light-outline-secondary dark:border-dark-primary-30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10">
                  {["Date", "Amount", "Status", "Invoice"].map((h) => (
                    <th key={h} className="py-2.5 px-4 font-body text-xs font-semibold text-light-outline dark:text-dark-text opacity-100 text-left uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((row, i) => (
                  <tr
                    key={i}
                    className={`${i !== billingHistory.length - 1 ? "border-b border-light-outline-secondary dark:border-dark-primary-30 opacity-80" : ""}`}
                  >
                    <td className="py-3 px-4 font-body text-sm text-light-text dark:text-dark-text">{row.date}</td>
                    <td className="py-3 px-4 font-body text-sm text-light-text dark:text-dark-text">{row.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-body text-xs font-semibold">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="flex items-center gap-1.5 font-body text-xs font-semibold text-light-primary dark:text-dark-primary hover:underline">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionSection;
