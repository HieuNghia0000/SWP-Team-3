import {
  Accessor,
  Component,
  Match,
  Setter,
  Show,
  Switch,
  createMemo,
  createSignal,
} from "solid-js";
import PopupModal from "../../PopupModal";
import Details from "./Details";
import Edit from "./Edit";
import Errors from "./Errors";
import Copy from "./Copy";
import { ShiftCard } from "~/context/ShiftPlanning";
import toast from "solid-toast";
import DeleteConfirmation from "./DeleteConfirmation";

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

  const onDeleteShift = async () => {
    toast.custom(
      (t) => {
        return (
          <DeleteConfirmation
            t={t}
            onConfirm={() => {
              toast.dismiss(t.id);
              alert("delete");
            }}
          />
        );
      },
      { duration: Infinity }
    );
  };

  const numOfErrors = createMemo(() =>
    showModal() && modalData()
      ? modalData()!.rules.filter((rule) => !rule.passed).length
      : 0
  );

  return (
    <PopupModal.Wrapper
      title={
        state() === "details"
          ? "Shift Details"
          : state() === "edit"
          ? "Edit Shift"
          : state() === "errors"
          ? "Shift Errors"
          : "Copy Shift"
      }
      close={onCloseModal}
      open={showModal}
      headerTabs={[
        {
          name: "Details",
          stateName: "details",
          onClick: () => setState("details"),
        },
        {
          name: "Edit",
          stateName: "edit",
          onClick: () => setState("edit"),
        },
        {
          name: (
            <>
              <span>Errors</span>
              <Show when={numOfErrors() > 0}>
                <div class="h-3.5 w-3.5 inline-block text-[10px] leading-[14px] text-center font-semibold ml-1 rounded-full text-white bg-red-600">
                  {numOfErrors()}
                </div>
              </Show>
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
          <Details
            shiftCard={modalData}
            setState={setState}
            onDelete={onDeleteShift}
          />
        </Match>
        <Match when={state() === "edit"}>
          <Edit
            modalState={state}
            setModalState={setState}
            modalData={modalData}
            onDelete={onDeleteShift}
          />
        </Match>
        <Match when={state() === "errors"}>
          <Errors
            shiftCard={modalData}
            setModalState={setState}
            onDelete={onDeleteShift}
          />
        </Match>
        <Match when={state() === "copy"}>
          <Copy
            shiftCard={modalData}
            setModalState={setState}
            onDelete={onDeleteShift}
          />
        </Match>
      </Switch>
    </PopupModal.Wrapper>
  );
};

export default ShiftDetailsModal;
