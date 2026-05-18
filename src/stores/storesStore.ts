import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Store } from "@/types";

// Default stores configuration
const DEFAULT_STORES: Store[] = [
  { id: "mercadolibre", name: "MercadoLibre.com.ar", logo: "", enabled: true },
  { id: "fravega", name: "Fravega", logo: "", enabled: true },
  { id: "cetrogar", name: "Cetrogar", logo: "", enabled: true },
  { id: "oncity", name: "On City", logo: "", enabled: true },
  { id: "megatone", name: "Megatone", logo: "", enabled: true },
  { id: "whirlpool", name: "Whirlpool", logo: "", enabled: true },
];

// Merge persisted stores with new defaults
function mergeWithDefaults(persisted: Store[] | undefined): Store[] {
  if (!persisted || persisted.length === 0) return DEFAULT_STORES;
  const existingIds = new Set(persisted.map((s) => s.id));
  const newStores = DEFAULT_STORES.filter((s) => !existingIds.has(s.id));
  return [...persisted, ...newStores];
}

interface StoresState {
  stores: Store[];
  toggleStore: (id: string) => void;
  setStores: (stores: Store[]) => void;
  isStoreEnabled: (id: string) => boolean;
}

export const useStoresStore = create<StoresState>()(
  persist(
    (set, get) => ({
      // Use mergeWithDefaults to add any missing stores from defaults
      stores: mergeWithDefaults(undefined),

      toggleStore: (id: string) => {
        set((state) => ({
          stores: state.stores.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s,
          ),
        }));
      },

      setStores: (stores: Store[]) => {
        set({ stores: mergeWithDefaults(stores) });
      },

      isStoreEnabled: (id: string) => {
        return get().stores.find((s) => s.id === id)?.enabled ?? false;
      },
    }),
    {
      name: "stores-storage-v2",
    },
  ),
);
