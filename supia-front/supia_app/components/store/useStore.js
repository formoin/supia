import { create } from 'zustand';

const useStore = create((set) => ({
  activeText: 'text1',
  setActiveText: (text) => set({ activeText: text }),
  resetActiveText: () => set({ activeText: 'text1' }),
}));

export default useStore;
