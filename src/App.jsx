import { useState, useEffect, useCallback } from "react";
import MasterPinAuth from "./components/MasterPinAuth";
import Header from "./components/Header";
import MetricsBar from "./components/MetricsBar";
import ClientCard from "./components/ClientCard";
import AddClientModal from "./components/AddClientModal";
import RenewModal from "./components/RenewModal";
import { getStoredClients, saveClients } from "./services/clientStorage";
import { fetchClientStatus, renewClientRemote } from "./services/remoteApi";
import { Search, Filter, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ambba_master_session") === "authenticated";
  });

  const [clients, setClients] = useState(() => getStoredClients());
  const [telemetry, setTelemetry] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [renewTarget, setRenewTarget] = useState(null);

  // Ping all clients
  const refreshFleet = useCallback(async (fleetList = clients) => {
    setIsRefreshing(true);
    const results = {};
    await Promise.all(
      fleetList.map(async (client) => {
        const res = await fetchClientStatus(client);
        results[client.id] = res;
      })
    );
    setTelemetry(results);
    setIsRefreshing(false);
  }, [clients]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshFleet();
      // Auto-poll fleet every 5 minutes
      const interval = setInterval(() => refreshFleet(), 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshFleet]);

  // Handle Quick Renewal
  const handleQuickRenew = async (client, days, isSuspended = false) => {
    const res = await renewClientRemote(client, { days, isSuspended });
    if (res.success) {
      // Re-fetch this client
      const updated = await fetchClientStatus(client);
      setTelemetry((prev) => ({ ...prev, [client.id]: updated }));
    }
    return res;
  };

  // Handle Custom Renew from Modal
  const handleCustomRenew = async (client, payload) => {
    const res = await renewClientRemote(client, payload);
    if (res.success) {
      const updated = await fetchClientStatus(client);
      setTelemetry((prev) => ({ ...prev, [client.id]: updated }));
    }
    return res;
  };

  // Add Client
  const handleAddClient = (newClient) => {
    const updated = [newClient, ...clients];
    setClients(updated);
    saveClients(updated);
    refreshFleet(updated);
  };

  // Delete Client
  const handleDeleteClient = (clientId) => {
    const target = clients.find((c) => c.id === clientId);
    const clientName = target ? target.name : "this venue";
    if (window.confirm(`⚠️ REMOVE ESTABLISHMENT:\n\nAre you sure you want to remove "${clientName}" from your Master Portal dashboard?\n\nThis will remove it from your telemetry fleet view.`)) {
      const updated = clients.filter((c) => c.id !== clientId);
      setClients(updated);
      saveClients(updated);
    }
  };

  // Lock portal
  const handleLockPortal = () => {
    sessionStorage.removeItem("ambba_master_session");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <MasterPinAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // Calculate Metrics
  const stats = {
    total: clients.length,
    active: 0,
    warning: 0,
    grace: 0,
    expired: 0,
  };

  clients.forEach((c) => {
    const data = telemetry[c.id];
    const s = data?.status || "offline";
    if (s === "active") stats.active++;
    else if (s === "warning") stats.warning++;
    else if (s === "grace") stats.grace++;
    else if (s === "expired") stats.expired++;
  });

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPhone?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;
    const s = telemetry[c.id]?.status || "offline";
    return s === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top command header */}
      <Header
        clientCount={clients.length}
        onAddClient={() => setAddModalOpen(true)}
        onRefreshAll={() => refreshFleet()}
        isRefreshing={isRefreshing}
        onLockPortal={handleLockPortal}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Telemetry Metrics */}
        <MetricsBar stats={stats} />

        {/* Search, Filter & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-md">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by venue name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-9 pr-3 py-2 text-xs font-bold text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Venues" },
              { id: "active", label: "Active" },
              { id: "warning", label: "Due Soon" },
              { id: "grace", label: "Grace Period" },
              { id: "expired", label: "Expired" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  filterStatus === f.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Client Grid */}
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white">No establishments found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No clients match your search criteria. Add a new client or clear the search filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                liveData={telemetry[client.id]}
                onRenewQuick={handleQuickRenew}
                onOpenCustomRenew={(c) => setRenewTarget(c)}
                onDeleteClient={handleDeleteClient}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        AmbbaTech RBMS Master SaaS Telemetry • Confidential Internal Vendor Portal
      </footer>

      {/* Modals */}
      <AddClientModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddClient}
      />

      <RenewModal
        isOpen={Boolean(renewTarget)}
        onClose={() => setRenewTarget(null)}
        client={renewTarget}
        onRenew={handleCustomRenew}
      />
    </div>
  );
}
