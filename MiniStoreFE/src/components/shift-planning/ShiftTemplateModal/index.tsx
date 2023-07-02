import {
  Accessor,
  Component,
  Match,
  ResourceFetcher,
  Setter,
  Switch,
  batch,
  createResource,
  createSignal,
} from "solid-js";
import PopupModal from "../../PopupModal";
import { DataResponse, ShiftTemplate } from "~/types";
import Spinner from "../../Spinner";
import Edit from "./Edit";
import List from "./List";
import Create from "./Create";

const fetcher: ResourceFetcher<
  boolean,
  ShiftTemplate[],
  { state: "list" | "edit" | "create" }
> = async () => {
  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(`http://localhost:3000/shifts.json`);
  const data: DataResponse<ShiftTemplate[]> = await response.json();

  return data.content;
};

const ShiftTemplateModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<ShiftTemplate | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  const [state, setState] = createSignal<"list" | "edit" | "create">("list");
  const [shiftTemplateFocus, setShiftTemplateFocus] =
    createSignal<ShiftTemplate>();
  const [shiftTemplates, { refetch, mutate }] = createResource(
    showModal,
    fetcher
  );

  return (
    <PopupModal.Wrapper
      title={
        state() === "list"
          ? "Shift Templates"
          : state() === "edit"
          ? "Edit Shift Template"
          : "New Shift Template"
      }
      close={() => {
        batch(() => {
          setState("list");
          setShowModal(false);
          setShiftTemplateFocus(undefined);
        });
      }}
      open={showModal}
    >
      <Switch fallback={<div class="text-center">Something went wrong.</div>}>
        <Match when={shiftTemplates.loading}>
          <div class="w-full min-h-[300px] grid place-items-center">
            <Spinner />
          </div>
        </Match>
        <Match when={state() === "list"}>
          <List
            setState={setState}
            shiftTemplates={shiftTemplates}
            setShiftTemplateFocus={setShiftTemplateFocus}
          />
        </Match>
        <Match when={state() === "create"}>
          <Create setState={setState} shiftTemplates={shiftTemplates} />
        </Match>
        <Match when={state() === "edit"}>
          <Edit
            setState={setState}
            shiftTemplates={shiftTemplates}
            shiftTemplateFocus={shiftTemplateFocus}
            setShiftTemplateFocus={setShiftTemplateFocus}
          />
        </Match>
      </Switch>
    </PopupModal.Wrapper>
  );
};

export default ShiftTemplateModal;
