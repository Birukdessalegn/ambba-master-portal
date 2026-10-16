const STORAGE_KEY = "ambba_master_fleet_v1";

const DEFAULT_FLEET = [
  {
    id: "the-oak-club",
    name: "The Oak Club",
    apiUrl: "https://theoakapi.ambbatech.com",
    vendorKey: "AMBBA-RBMS-MASTER-2026",
    contactPerson: "Branch Manager",
    contactPhone: "+251 91 123 4567",
    monthlyRate: "8,000 ETB / month",
    notes: "Primary flagship venue - Monthly purchase",
    createdAt: new Date().toISOString(),
  }
];

export function getStoredClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FLEET));
      return DEFAULT_FLEET;
    }
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FLEET));
      return DEFAULT_FLEET;
    }

    // Auto-migrate any client still pointing to localhost or missing vendorKey
    let changed = false;
    parsed = parsed.map((c) => {
      if (c.id === "the-oak-club" && (!c.apiUrl || c.apiUrl.includes("localhost"))) {
        changed = true;
        return {
          ...c,
          apiUrl: "https://theoakapi.ambbatech.com",
          vendorKey: c.vendorKey || "AMBBA-RBMS-MASTER-2026",
        };
      }
      return c;
    });

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (e) {
    return DEFAULT_FLEET;
  }
}

export function saveClients(clients) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error("Failed to save fleet to localStorage", e);
  }
}
