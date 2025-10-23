import { create } from "zustand";

interface SitesStore {
    sites: { value: string; label: string }[];
    setSites: (sites: { value: string; label: string }[]) => void;
}

export const useSitesStore = create<SitesStore>((set) => ({
    sites: [],
    setSites: (sites) => set({ sites }),
}));
