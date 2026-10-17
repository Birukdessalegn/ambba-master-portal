import { useState } from "react";
import { 
  Building2, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Plus, 
  Settings, 
  Trash2, 
  Lock, 
  Unlock,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff
} from "lucide-react";

export default function ClientCard({ client, liveData, onRenewQuick, onOpenCustomRenew, onDeleteClient }) {
  const [loadingAction, setLoadingAction] = useState(false);

  const status = liveData?.status || "offline";
  const daysRemaining = liveData?.daysRemaining ?? "--";
  const expiresAt = liveData?.expiresAt;
  const isOnline = liveData?.online;

  // Status Badge styling
  let badgeClasses = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  let statusText = "Active";

  if (status === "warning") {
    badgeClasses = "bg-amber-500/15 text-amber-400 border-amber-500/30";
    statusText = "Expiring Soon";
  } else if (status === "grace") {
    badgeClasses = "bg-orange-500/20 text-orange-400 border-orange-500/40 animate-pulse";
    statusText = `Grace Period (${liveData?.graceDaysRemaining ?? 0}d left)`;
  } else if (status === "expired") {
    badgeClasses = "bg-rose-500/20 text-rose-400 border-rose-500/40";
    statusText = "Expired / Locked";
  } else if (status === "offline") {
    badgeClasses = "bg-slate-700/30 text-slate-400 border-slate-700/50";
    statusText = liveData?.error || "Offline / Unreachable";
  }

    const handleQuick = async (days) => {
    const label = days === 30 ? "+1 Month (30 Days)" : days === 90 ? "+3 Months (90 Days)" : `${days} Days`;
    const confirmed = window.confirm(
      `Confirm Extension:\n\nAre you sure you want to add ${label} to ${client.name}?\n\nThis will remotely activate and extend their license immediately.`
    );
    if (!confirmed) return;

    setLoadingAction(true);
    const res = await onRenewQuick(client, days, false);
    setLoadingAction(false);
    if (res?.success) {
      alert(`✅ ${client.name}:\n\nExtended successfully by ${label}!\n${res.message || ""}`);
    } else {
      alert(`❌ Error for ${client.name}:\n\n${res?.message || "Failed to renew"}`);
    }
  };

  const handleToggleSuspend = async () => {
    const isCurrentlyExpired = status === "expired";
    const confirmMsg = isCurrentlyExpired
      ? `Reactivate Client:\n\nAre you sure you want to UNLOCK and REACTIVATE ${client.name} with +30 days?`
      : `⚠️ EMERGENCY LOCK WARNING:\n\nAre you sure you want to SUSPEND and LOCK ${client.name}?\n\nAll staff and terminals at ${client.name} will be immediately locked out until you reactivate them!`;

    if (!window.confirm(confirmMsg)) return;

    setLoadingAction(true);
    const res = isCurrentlyExpired
      ? await onRenewQuick(client, 30, false)
      : await onRenewQuick(client, 0, true);

    setLoadingAction(false);
    if (res?.success) {
      alert(`✅ ${client.name}:\n\n${isCurrentlyExpired ? "System reactivated successfully!" : "System is now SUSPENDED / LOCKED!"}`);
    } else {
      alert(`❌ Error for ${client.name}:\n\n${res?.message || "Failed to update status"}`);
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-slate-900/90 group flex flex-col justify-between">
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/30 font-black text-sm">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white tracking-wide">{client.name}</h3>
                {isOnline ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400" title="Server is reachable">
                    <Wifi size={11} />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500" title="Server unreachable">
                    <WifiOff size={11} />
                  </span>
                )}
              </div>
              <a
                href={client.apiUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 transition"
              >
                <span className="truncate max-w-[200px]">{client.apiUrl}</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${badgeClasses}`}>
            {statusText}
          </span>
        </div>

        {/* Countdown card */}
        <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/60 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={13} className="text-blue-400" /> Days Left:
            </span>
            <span className="font-black text-white text-sm">
              {daysRemaining !== "--" ? `${daysRemaining} Days` : "--"}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={13} className="text-amber-400" /> Expiry Date:
            </span>
            <span className="font-bold text-slate-200">
              {expiresAt ? new Date(expiresAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
            </span>
          </div>

          {client.contactPhone && (
            <div className="flex items-center justify-between text-slate-400 border-t border-white/5 pt-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Phone size={13} className="text-emerald-400" /> Contact:
              </span>
              <span className="font-semibold text-slate-300">
                {client.contactPhone}
              </span>
            </div>
          )}
        </div>

        {client.notes && (
          <p className="mt-2 text-[11px] text-slate-400 italic truncate" title={client.notes}>
            "{client.notes}"
          </p>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
        {/* Quick extension buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loadingAction}
            onClick={() => handleQuick(30)}
            className="flex items-center justify-center gap-1 rounded-xl bg-blue-600/20 border border-blue-500/30 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition cursor-pointer active:scale-95 disabled:opacity-50"
            title="Extend license by 30 days (+1 Month)"
          >
            <Plus size={13} /> +1 Month
          </button>

          <button
            type="button"
            disabled={loadingAction}
            onClick={() => handleQuick(90)}
            className="flex items-center justify-center gap-1 rounded-xl bg-indigo-600/20 border border-indigo-500/30 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer active:scale-95 disabled:opacity-50"
            title="Extend license by 90 days (+3 Months)"
          >
            <Plus size={13} /> +3 Months
          </button>
        </div>

        {/* Secondary controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => onOpenCustomRenew(client)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <Settings size={12} /> Custom / Reset
          </button>

          <button
            type="button"
            onClick={handleToggleSuspend}
            disabled={loadingAction}
            className={`rounded-xl border p-2 text-xs font-bold transition cursor-pointer ${
              status === "expired"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
            }`}
            title={status === "expired" ? "Unlock & Reactivate Client" : "Emergency Lock Client System"}
          >
            {status === "expired" ? <Unlock size={14} /> : <Lock size={14} />}
          </button>

          <button
            type="button"
            onClick={() => onDeleteClient(client.id)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Remove from Master Portal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
