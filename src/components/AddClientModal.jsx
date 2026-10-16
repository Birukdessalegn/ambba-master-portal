import { useState } from "react";
import { X, Building2, Globe, Phone, KeyRound, DollarSign, FileText } from "lucide-react";

export default function AddClientModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("http://localhost:5000");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("8,000 ETB / month");
  const [vendorKey, setVendorKey] = useState("AMBBA-RBMS-MASTER-2026");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !apiUrl.trim()) return;

    const newClient = {
      id: "client-" + Date.now(),
      name: name.trim(),
      apiUrl: apiUrl.trim(),
      contactPerson: contactPerson.trim(),
      contactPhone: contactPhone.trim(),
      monthlyRate: monthlyRate.trim(),
      vendorKey: vendorKey.trim() || "AMBBA-RBMS-MASTER-2026",
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onSave(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Add Client Establishment</h2>
            <p className="text-xs text-slate-400">Onboard a restaurant, lounge, or club to your master dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Establishment Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. The Oak Club, Sky Lounge, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-bold text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Backend Server API URL *</label>
            <input
              type="url"
              required
              placeholder="e.g. http://localhost:5000 or https://the-oak-backend.onrender.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="Manager Name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+251 9..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Monthly Billing Plan</label>
              <input
                type="text"
                placeholder="e.g. 8,000 ETB / month"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Master Vendor Key</label>
              <input
                type="text"
                value={vendorKey}
                onChange={(e) => setVendorKey(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Notes / Location Details</label>
            <textarea
              rows={2}
              placeholder="e.g. Bole Medhanialem branch, contract signed Oct 2026"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 font-semibold text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 font-bold text-slate-400 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
            >
              Add to Fleet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
