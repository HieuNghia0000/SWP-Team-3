import { flatten } from "lodash";
import { Component, For } from "solid-js";
import ResourceWrapper from "~/components/ResourceWrapper";
import SidePopupModal from "~/components/SidePopupModal";
import { TextArea } from "~/components/form/TextArea";
import { TextInput } from "~/components/form/TextInput";
import { useSPData } from "~/context/ShiftPlanning";
import { Role } from "~/types";
import { shiftDetailsTime } from "../utils/shiftTimes";
import { roles } from "~/utils/roles";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import * as yup from "yup";

type NewScheduleTemplateForm = {
  name: string;
  description?: string;
  numOfShifts: number;
  shiftInfos: {
    shiftTemplateId: number;
    date: string;
    staffName: string;
  }[];
};

const schema: yup.Schema<{ name: string; description?: string }> = yup.object({
  name: yup.string().required("Please enter a name"),
  description: yup.string(),
});

const Create: Component = ({}) => {
  const { tableData } = useSPData();
  const formHandler = useFormHandler(yupSchema(schema));
  const { formData, setFieldValue } = formHandler;

  const shiftIds = flatten(Object.values(tableData.cells));

  const submit = async () => {
    try {
      await formHandler.validateForm();
      alert(
        "Data sent with success: " +
          JSON.stringify({
            ...formData(),
            numOfShifts: shiftIds.length,
            shiftInfos: shiftIds.map((id) => ({
              shiftTemplateId:
                tableData.shifts[id].shiftTemplate.shiftTemplateId,
              date: tableData.shifts[id].date,
              staffName: tableData.shifts[id].staff?.staffName,
            })),
          })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SidePopupModal.Body>
        <div class="text-sm mb-4 text-gray-400 leading-[1.5] tracking-wide">
          Select the template that you would like to use from the list below.
          You will be able to preview the shifts that will be created in the
          next step.
        </div>
        <TextInput
          id="name"
          name="name"
          label="Name"
          placeholder="e.g. Default, Full Staff, etc."
          classList={{ "text-sm mb-4": true }}
          class="shadow-inner"
          formHandler={formHandler}
        />
        <TextArea
          id="description"
          name="description"
          label="Description"
          placeholder="Any information you want to include with this template..."
          classList={{ "text-sm mb-4": true }}
          class="shadow-inner"
          formHandler={formHandler}
        />
        <div class="text-[#637286] bg-[#f8fafc] font-semibold py-2.5 px-5 border-y border-[#d5dce6] -mx-5 mt-5 mb-3.5 text-sm">
          Targeted Shifts
        </div>
        <div class="text-sm mb-4 text-gray-400 leading-[1.5] tracking-wide">
          You are targeting{" "}
          <span class="font-bold">{shiftIds.length} Shifts</span> with the
          filters you have set:
        </div>
        <For each={shiftIds}>
          {(shift) => (
            <div
              class="rounded mx-1 p-2 relative text-left mb-1"
              classList={{
                "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)]":
                  true,
              }}
            >
              <i
                class="absolute top-1.5 left-1.5 bottom-1.5 w-1.5 rounded"
                classList={{
                  "bg-blue-500":
                    tableData.shifts[shift].shiftTemplate.role === Role.CASHIER,
                  "bg-yellow-500":
                    tableData.shifts[shift].shiftTemplate.role === Role.GUARD,
                  "bg-red-500":
                    tableData.shifts[shift].shiftTemplate.role === Role.MANAGER,
                  "bg-gray-600":
                    tableData.shifts[shift].shiftTemplate.role === Role.ADMIN,
                  "bg-gray-400":
                    tableData.shifts[shift].shiftTemplate.role ===
                    Role.ALL_ROLES,
                }}
              ></i>
              <p class="ml-3.5 font-semibold text-sm tracking-wider">
                {shiftDetailsTime(
                  tableData.shifts[shift].date || "",
                  tableData.shifts[shift].shiftTemplate.startTime || "",
                  tableData.shifts[shift].shiftTemplate.endTime || ""
                )}
              </p>
              <p class="ml-3.5 font-normal text-xs text-[13px] tracking-wider">
                {tableData.shifts[shift].staff?.staffName ||
                  "No staff assigned"}{" "}
                •{" "}
                {
                  roles.find(
                    (r) =>
                      r.value === tableData.shifts[shift].shiftTemplate.role
                  )?.label
                }
              </p>
            </div>
          )}
        </For>
      </SidePopupModal.Body>
      <SidePopupModal.Footer>
        <div class="w-full flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={submit}
            class="py-1.5 px-3 font-semibold text-white border border-blue-400 bg-[#00a8ff] text-sm rounded hover:bg-blue-400 transition-colors"
          >
            Create Template - {shiftIds.length} Shifts
          </button>
        </div>
      </SidePopupModal.Footer>
    </>
  );
};
export default Create;
