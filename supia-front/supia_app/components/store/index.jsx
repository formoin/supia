import { createStore } from "zustand";
import { persist } from "zustand/middleware";

const useLoginStore = createStore(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "login state",
    }
  )
);

export default useLoginStore;
