import { create } from "zustand";

type State = {
  data: "REAL" | "DUMMY";

  toggleData: () => void;
};

export const useData = create<State>(set => ({
  data: "REAL",
  toggleData: () =>
    set(state => ({ data: state.data === "REAL" ? "DUMMY" : "REAL" })),
}));
