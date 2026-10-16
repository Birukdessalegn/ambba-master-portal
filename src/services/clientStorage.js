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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FLEET;
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
