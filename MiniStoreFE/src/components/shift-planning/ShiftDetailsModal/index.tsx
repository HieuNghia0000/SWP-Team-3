import {
  Accessor,
  Component,
  Match,
  Setter,
  Switch,
  createSignal,
} from "solid-js";
import PopupModal from "../../PopupModal";
import Details from "./Details";
import Edit from "./Edit";
import Errors from "./Errors";
import Copy from "./Copy";
import { ShiftCard } from "~/context/ShiftPlanning";

export type Tabs = "details" | "edit" | "errors" | "copy";

const ShiftDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<ShiftCard | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  const [state, setState] = createSignal<Tabs>("details");

  const onCloseModal = () => {
    setShowModal(false);
    setState("details");
  };

  return (
    <PopupModal.Wrapper
      title={state() === "details" ? "Shift Details" : "Edit Shift"}
      close={onCloseModal}
      open={showModal}
      headerTabs={[
        {
          name: "Details",
          stateName: "details",
          onClick: () => setState("details"),
        },
        {
          name: (
            <>
              <span>Errors</span>
              <div class="h-3.5 w-3.5 inline-block text-[10px] leading-[14px] text-center font-semibold ml-1 rounded-full text-white bg-red-600">
                1
              </div>
            </>
          ),
          stateName: "errors",
          onClick: () => setState("errors"),
        },
        {
          name: "Copy",
          stateName: "copy",
          onClick: () => setState("copy"),
        },
      ]}
      headerTabSelected={state}
    >
      <Switch>
        <Match when={state() === "details"}>
          <Details shift={modalData} setState={setState} />
        </Match>
        <Match when={state() === "edit"}>
          <Edit
            modalState={state}
            setModalState={setState}
            modalData={modalData}
          />
        </Match>
        <Match when={state() === "errors"}>
          <Errors shift={modalData} setModalState={setState} />
        </Match>
        <Match when={state() === "copy"}>
          <Copy shiftCard={modalData} setModalState={setState} />
        </Match>
      </Switch>
    </PopupModal.Wrapper>
  );
};

export default ShiftDetailsModal;
