import { Building2, ShieldCheck, AlertTriangle, Clock, ShieldAlert } from "lucide-react";

export default function MetricsBar({ stats }) {
  const cards = [
    {
      label: "Total Fleet",
      value: stats.total,
      sub: "Active installations",
      icon: Building2,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20",
    },
    {
      label: "Active & Good",
      value: stats.active,
      sub: "> 5 days left",
      icon: ShieldCheck,
      color: "from-emerald-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Expiring Soon",
      value: stats.warning,
      sub: "≤ 5 days left",
      icon: AlertTriangle,
      color: "from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      label: "In Grace Period",
      value: stats.grace,
      sub: "3-day buffer running",
      icon: Clock,
      color: "from-orange-500/20 to-orange-500/10 text-orange-400 border-orange-500/20",
    },
    {
      label: "Suspended / Expired",
      value: stats.expired,
      sub: "Locked access",
      icon: ShieldAlert,
      color: "from-rose-500/20 to-rose-500/10 text-rose-400 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`rounded-2xl border bg-gradient-to-br ${c.color} p-4 backdrop-blur-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</span>
              <Icon size={16} />
            </div>
            <div className="mt-2 text-2xl font-black text-white">{c.value}</div>
            <p className="mt-0.5 text-[10px] text-slate-400 font-medium">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
