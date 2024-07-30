import { create } from 'zustand';

const useStore = create((set) => ({
  // search
  activeText: 'text1',
  setActiveText: (text) => set({ activeText: text }),
  resetActiveText: () => set({ activeText: 'text1' }),

  // walk
  time: 0, // 총 시간(초) 상태
  isActive: false, // 스톱워치 활성 상태
  isPaused: false, // 스톱워치 일시 정지 상태
  startStopwatch: () => set({ isActive: true, isPaused: false }),
  stopStopwatch: () => set({ isActive: false, isPaused: false }),
  pauseStopwatch: () => set({ isPaused: true }),
  resetStopwatch: () => set({ time: 0, isActive: false, isPaused: false }),
  incrementTime: () => set((state) => ({ time: state.time + 1 })),
}));

export default useStore;
