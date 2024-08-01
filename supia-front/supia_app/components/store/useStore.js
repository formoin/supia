import { create } from "zustand";

const useStore = create((set) => ({
  // search
  activeText: "text1",
  setActiveText: (text) => set({ activeText: text }),
  resetActiveText: () => set({ activeText: "text1" }),

  // walk
  time: 0, // 총 시간(초) 상태
  isActive: false, // 스톱워치 활성 상태
  isPaused: false, // 스톱워치 일시 정지 상태
  startStopwatch: () => set({ isActive: true, isPaused: false }),
  stopStopwatch: () => set({ isActive: false, isPaused: false }),
  pauseStopwatch: () => set({ isPaused: true }),
  resetStopwatch: () => set({ time: 0, isActive: false, isPaused: false }),
  incrementTime: () => set((state) => ({ time: state.time + 1 })),

  // 산책이 끝나고 산책 경로 표시
  routeWidth: 0,
  setRouteWidth: (value) => set({ routeWidth: value }),

  // 산책이 끝나고 산책 거리 표시
  finalDistance: 0,
  setFinalDistance: (distance) => set({ finalDistance: distance }),

  // Walk Button Press Time
  walkStartTime: null, // 산책 시작 시간을 저장할 상태
  setWalkStartTime: (time) => set({ walkStartTime: time }), // 산책 시작 시간 설정 함수

  // Walk End Time
  walkEndTime: null, // 산책 종료 시간을 저장할 상태
  setWalkEndTime: (time) => set({ walkEndTime: time }), // 산책 종료 시간 설정 함수

  // Current Location
  currentLocation: null, // 현재 위치를 저장할 상태
  setCurrentLocation: (location) => set({ currentLocation: location }), // 현재 위치 설정 함수
}));

export default useStore;
