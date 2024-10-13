import { CurrentDate, Interval } from "@/types/violation";
import { create } from "zustand";

interface DashboardModeState {
  isActive: boolean;
  toggleActive: () => void;
  from: Date;
  to: Date;

  setFrom: (from: Date) => void;
  setTo: (to: Date) => void;

  current: CurrentDate;
  setCurrent: (current: CurrentDate) => void;

  interval: Interval;
  setInterval: (interval: Interval) => void;
}
export const useDashboardMode = create<DashboardModeState>(set => ({
  isActive: false,
  toggleActive: () => set(state => ({ isActive: !state.isActive })),
  from: new Date(),
  to: new Date(),
  setFrom: from => set({ from }),
  setTo: to => set({ to }),

  current: CurrentDate.day,
  setCurrent: current => set({ current }),

  interval: Interval.daily,
  setInterval: interval => set({ interval }),
}));
