import { FaSolidPencil } from "solid-icons/fa";
import { Accessor, Setter, Component } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { Role } from "~/types";
import { Tabs } from ".";
import moment from "moment";
import { ShiftCard } from "~/context/ShiftPlanning";

interface DetailsProps {
  shift: Accessor<ShiftCard | undefined>;
  setState: Setter<Tabs>;
}
const Details: Component<DetailsProps> = ({ shift, setState }) => {
  return (
    <>
      <PopupModal.Body>
        <div class="text-xl font-semibold text-center text-gray-800">
          {shift()?.shiftTemplate.name}
        </div>
        <div
          class="text-sm mb-2.5 font-semibold text-center italic text-gray-500"
          classList={{ "text-green-600": shift()?.published }}
        >
          {shift()?.published ? "Published" : "Not Published"}
        </div>
        <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Team Member:</span>
              <span>{shift()?.staff!.staffName}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">
                Salary Coefficient:
              </span>
              <span>{shift()?.shiftTemplate.salaryCoefficient}</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Required Role:</span>
              <span
                class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
                classList={{
                  "bg-blue-200 text-blue-700":
                    shift()?.shiftTemplate.role === Role.CASHIER,
                  "bg-yellow-200 text-yellow-700":
                    shift()?.shiftTemplate.role === Role.GUARD,
                  "bg-red-200 text-red-700":
                    shift()?.shiftTemplate.role === Role.MANAGER,
                  "bg-gray-200 text-gray-700":
                    shift()?.shiftTemplate.role === Role.ADMIN,
                }}
              >
                {shift()?.shiftTemplate.role}
              </span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Date:</span>
              <span>{moment(shift()?.date).format("ddd MMM D, YYYY")}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Start Time:</span>
              <span>
                {moment(shift()?.shiftTemplate.startTime, "h:mm:ss").format(
                  "h:mma"
                )}
              </span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">End Time:</span>
              <span>
                {moment(shift()?.shiftTemplate.endTime, "h:mm:ss").format(
                  "h:mma"
                )}
              </span>
            </div>
          </div>
          <div class="flex">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Status:</span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Check-in Time:</span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Check-out Time:</span>
              <span>Not yet</span>
            </div>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <button
          onClick={[setState, "edit"]}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Shift
        </button>
      </PopupModal.Footer>
    </>
  );
};

export default Details;
