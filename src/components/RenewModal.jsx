import { useState } from "react";
import { X, Calendar, Check, AlertTriangle, ShieldCheck, RotateCcw } from "lucide-react";

export default function RenewModal({ isOpen, onClose, client, onRenew }) {
  const [days, setDays] = useState(30);
  const [customDate, setCustomDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !client) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const durationLabel = customDate ? `Custom Expiry (${customDate})` : `+${days} Days`;
    const confirmed = window.confirm(
      `Confirm License Update:\n\nAre you sure you want to apply ${durationLabel} to ${client.name}?\n\nPayment notes: ${notes.trim() || "None"}`
    );
    if (!confirmed) return;

    setSubmitting(true);
    setResult(null);

    const res = await onRenew(client, {
      days: customDate ? undefined : Number(days),
      newExpiryDate: customDate || undefined,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);
    setResult(res);

    if (res.success) {
      setTimeout(() => {
        onClose();
        setResult(null);
      }, 1500);
    }
  };

  const handleClearResetDate = async () => {
    const confirmed = window.confirm(
      `⚠️ DANGER: CLEAR & RESET LICENSE\n\nAre you sure you want to completely CLEAR all assigned dates for "${client.name}" and reset them to 0 DAYS (Unactivated/Expired)?\n\nThis will immediately wipe their active days and lock the client system until you renew it.`
    );
    if (!confirmed) return;

    setSubmitting(true);
    setResult(null);

    const res = await onRenew(client, {
      reset: true,
      notes: notes.trim() || "Cleared & Reset to 0 Days by AmbbaTech Master Portal",
    });

    setSubmitting(false);
    setResult(res);

    if (res.success) {
      alert(`✅ ${client.name}:\n\nSubscription date has been cleared and reset to 0 Days!`);
      setTimeout(() => {
        onClose();
        setResult(null);
      }, 1200);
    } else {
      alert(`❌ Failed to clear date for ${client.name}:\n\n${res.message || "Unknown error"}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-md font-bold">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">{client.name}</h2>
            <p className="text-xs text-slate-400">Remote License Extension & Settings</p>
          </div>
        </div>

        {result && (
          <div className={`mt-4 rounded-xl p-3 text-xs font-bold flex items-center gap-2 border ${
            result.success
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
          }`}>
            {result.success ? <Check size={16} /> : <AlertTriangle size={16} />}
            <span>{result.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Extension Duration:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "+1 Month", val: 30 },
                { label: "+3 Months", val: 90 },
                { label: "+1 Year", val: 365 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    setDays(opt.val);
                    setCustomDate("");
                  }}
                  className={`rounded-xl border py-2 font-bold transition cursor-pointer ${
                    days === opt.val && !customDate
                      ? "border-blue-500 bg-blue-600/30 text-blue-300 shadow-sm"
                      : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Or Specific Expiration Date:</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-bold text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Payment Reference / Transaction Log:</label>
            <input
              type="text"
              placeholder="e.g. Paid via CBE Ref: 98124 / 8,000 ETB"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 font-bold text-slate-400 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {submitting ? "Transmitting..." : "Apply & Unlock Remote"}
            </button>
          </div>

          {/* Danger Zone: Clear Date to 0 Days */}
          <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-center justify-between bg-rose-500/5 -mx-6 -mb-6 p-4 rounded-b-3xl">
            <div>
              <p className="text-[11px] font-black text-rose-400">Clear & Reset Expiration</p>
              <p className="text-[10px] text-slate-400">Wipe all days back to 0 (Unactivated/Expired)</p>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={handleClearResetDate}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
              title="Clear date and reset to 0 Days"
            >
              <RotateCcw size={13} /> Clear Date (0 Days)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
