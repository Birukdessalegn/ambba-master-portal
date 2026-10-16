import { ShieldCheck, Plus, RefreshCw, Lock, Sparkles, Building2 } from "lucide-react";

export default function Header({ onAddClient, onRefreshAll, isRefreshing, onLockPortal, clientCount }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20">
          <ShieldCheck size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-wide text-white">AMBBATECH</span>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 ring-1 ring-blue-500/25">
              Super-Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Multi-Client Licensing & Telemetry Engine</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onRefreshAll}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
          title="Ping all client servers to refresh live statuses"
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin text-blue-400" : ""} />
          <span className="hidden sm:inline">Check Fleet</span>
        </button>

        <button
          type="button"
          onClick={onAddClient}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer active:scale-95"
        >
          <Plus size={14} />
          <span>Add Establishment</span>
        </button>

        <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />

        <button
          type="button"
          onClick={onLockPortal}
          className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition cursor-pointer"
          title="Lock Master Portal"
        >
          <Lock size={15} />
        </button>
      </div>
    </header>
  );
}
