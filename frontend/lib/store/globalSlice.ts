import { StateCreator } from "zustand";
import { Quest, QuestWithResponse } from "../type";
interface GlobalState {
  robinXBalance: number;
  active: Quest[];
  completed: QuestWithResponse[];
}

interface GlobalActions {
  setRobinXBalance: (robinXBalance: number) => void;
  setActive: (quests: Quest[]) => void;
  setCompleted: (quests: QuestWithResponse[]) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  robinXBalance: 0,
  active: [],
  completed: [],
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
  setActive: (quests) => {
    set(() => ({ active: quests }));
  },
  setCompleted: (quests) => {
    set(() => ({ completed: quests }));
  },
});
