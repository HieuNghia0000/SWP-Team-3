import { Accessor, createContext, Setter, useContext, } from "solid-js";

type PRModalContext = {
  chosenId: Accessor<number>;
  setChosenId: Setter<number>;
  showModal: Accessor<boolean>;
  setShowModal: Setter<boolean>;
};

export const ModalContext = createContext<PRModalContext>();

export function usePRContext(): PRModalContext {
  return useContext(ModalContext)!;
}
