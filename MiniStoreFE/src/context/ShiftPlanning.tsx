import {
  Accessor,
  Setter,
  createContext,
  useContext,
  InitializedResource,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { DataTable, FetcherData } from "~/routes/shift-planning";
import { WorkSchedule, Staff, Shift } from "~/types";

type SPModalContext = {
  shiftModalData: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  setShiftModalData: Setter<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  showShiftModal: Accessor<boolean>;
  setShowShiftModal: Setter<boolean>;
  staffModalData: Accessor<Staff | undefined>;
  setStaffModalData: Setter<Staff | undefined>;
  showStaffModal: Accessor<boolean>;
  setShowStaffModal: Setter<boolean>;
  newShiftModalData: Accessor<{ staff: Staff; date: string } | undefined>;
  setNewShiftModalData: Setter<{ staff: Staff; date: string } | undefined>;
  showNewShiftModal: Accessor<boolean>;
  setShowNewShiftModal: Setter<boolean>;
  shiftTemplateModalData: Accessor<Shift | undefined>;
  setShiftTemplateModalData: Setter<Shift | undefined>;
  showShiftTemplateModal: Accessor<boolean>;
  setShowShiftTemplateModal: Setter<boolean>;
};
type SPDataContext = {
  tableData: DataTable;
  setTableData: SetStoreFunction<DataTable>;
  fetchedData: InitializedResource<FetcherData>;
  resetTableData: () => void;
};

export const ModalContext = createContext<SPModalContext>();

export function useShiftPlanningModals(): SPModalContext {
  return useContext(ModalContext)!;
}

export const PageDataContext = createContext<SPDataContext>();

export function useSPData(): SPDataContext {
  return useContext(PageDataContext)!;
}
