import { StateCreator } from "zustand";
interface GlobalState {
  robinXBalance: number;
}

interface GlobalActions {
  setRobinXBalance: (robinXBalance: number) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  robinXBalance: 0,
};

export const createGlobalSlice: StateCreator<
  GlobalSlice,
  [],
  [],
  GlobalSlice
> = (set) => ({
  ...initialGlobalState,
  setRobinXBalance: (robinXBalance) => {
    set(() => ({ robinXBalance }));
  },
});
