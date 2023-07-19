import { Accessor, createContext, Setter, useContext } from "solid-js";

type HModalContext = {
  chosenId: Accessor<number>;
  setChosenId: Setter<number>;
  showCreateModal: Accessor<boolean>;
  setShowCreateModal: Setter<boolean>;
  onDelete: (id: number) => Promise<void>;
};

export const ModalContext = createContext<HModalContext>();

export function useHContext(): HModalContext {
  return useContext(ModalContext)!;
}
