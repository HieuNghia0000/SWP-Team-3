import { A } from "@solidjs/router";
import { FaSolidPencil } from "solid-icons/fa";
import { Role, Staff, Status } from "~/types";
import PopupModal from "../PopupModal";
import { Accessor, Component, Setter } from "solid-js";
import routes from "~/utils/routes";

const StaffDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<Staff | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  return (
    <PopupModal
      title="Staff Details"
      close={() => setShowModal(false)}
      open={showModal}
      footer={
        <A
          href={routes.staffEdit(modalData()?.staffId ?? 0)}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Staff
        </A>
      }
    >
      <div class="text-lg mb-2.5 font-semibold text-center text-gray-800">
        {modalData()?.staffName}
      </div>
      <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Email:</span>
            <span>{modalData()?.email}</span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Phone Number:</span>
            <span>{modalData()?.phoneNumber}</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Hourly Wage:</span>
            <span>{modalData()?.baseSalary}</span>
          </div>
        </div>
        <div class="flex">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Role:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
              classList={{
                "bg-blue-200 text-blue-700": modalData()?.role === Role.CASHIER,
                "bg-yellow-200 text-yellow-700":
                  modalData()?.role === Role.GUARD,
                "bg-red-200 text-red-700": modalData()?.role === Role.MANAGER,
                "bg-gray-200 text-gray-700": modalData()?.role === Role.ADMIN,
              }}
            >
              {modalData()?.role}
            </span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Status:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-white rounded-full"
              classList={{
                "bg-green-500": modalData()?.status === Status.ACTIVATED,
                "bg-red-500": modalData()?.status === Status.DISABLED,
              }}
            >
              {true ? "Activated" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default StaffDetailsModal;
