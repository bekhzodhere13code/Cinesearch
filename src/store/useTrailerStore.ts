import { create } from "zustand";

interface State {
  open: boolean;
  loading: boolean;
  videoKey: string | null; // YouTube video id
  close: () => void;
}

export const useTrailerStore = create<State>((set) => ({
  open: false,
  loading: false,
  videoKey: null,
  close: () => set({ open: false, loading: false, videoKey: null }),
}));
