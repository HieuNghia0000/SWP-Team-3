import { flatten } from "lodash";
import {
  Accessor,
  Component,
  For,
  ResourceFetcher,
  Show,
  Suspense,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import ResourceWrapper from "~/components/ResourceWrapper";
import SidePopupModal from "~/components/SidePopupModal";
import { ScheduleTemplateModalState, useSPData } from "~/context/ShiftPlanning";
import { DataResponse, Role, Staff } from "~/types";
import { shiftDetailsTime } from "../utils/shiftTimes";
import { roles } from "~/utils/roles";
import flatpickr from "flatpickr";
import moment from "moment";
import {
  getWeekDateStings,
  getWeekFirstAndLastDates,
} from "~/utils/getWeekDates";
import { transformData } from "../utils/dataTransformer";
import { DataTable } from "../utils/types";
import Spinner from "~/components/Spinner";

interface CopyProps {
  modalState: Accessor<ScheduleTemplateModalState>;
}

const fetcher: ResourceFetcher<
  string | undefined,
  DataTable,
  { state: ScheduleTemplateModalState }
> = async (source) => {
  const dates = getWeekDateStings(source as string);
  const from = dates[0];
  const to = dates[dates.length - 1];
  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(
    `http://localhost:3000/shift-planning-${source}.json`
  );
  const data: DataResponse<Staff[]> = await response.json();

  return transformData({ dates, staffs: data.content }, true);
};

const Copy: Component<CopyProps> = ({ modalState }) => {
  const [datePicked, setDatePicked] = createSignal<string | undefined>();
  const [dateStr, setDateStr] = createSignal<string>("");
  const [data, { refetch, mutate }] = createResource(datePicked, fetcher);
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;

  const shiftIds = () =>
    !data.error && data() ? flatten(Object.values(data()!.cells)) : [];

  onMount(() => {
    const defaultDate = moment().format("YYYY-MM-DD");
    setDatePicked(defaultDate);
    fp = flatpickr(dateRef!, {
      mode: "single",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange: updateDateStr,
      onReady: updateDateStr,
    });
  });

  onCleanup(() => {
    fp?.destroy();
  });

  const updateDateStr = (
    selectedDates: Date[],
    dateStr: string,
    instance: flatpickr.Instance
  ) => {
    if (selectedDates.length === 0) {
      setDatePicked(undefined);
      setDateStr("");
    }
    if (selectedDates.length === 1) {
      const pickedDate = dateStr;
      const [from, to] = getWeekFirstAndLastDates(pickedDate);
      const start = instance.formatDate(from.toDate(), "F j");
      const end = instance.formatDate(to.toDate(), "F j, Y");
      console.log(pickedDate);
      setDatePicked(pickedDate);
      setDateStr(`${start} - ${end}`);
    }
  };

  const submit = async () => {
    try {
      alert("submit");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SidePopupModal.Body>
        <div class="text-sm mb-2">
          <label class="inline-block mb-1.5 text-gray-600 font-semibold">
            Week to Copy
          </label>
          <button
            ref={dateRef}
            type="button"
            class="range_flatpicker shadow-inner w-full px-4 py-2 text-left text-gray-600 border rounded outline-none focus:border-indigo-500 focus:shadow"
          >
            {dateStr() || "Select Dates"}
          </button>
        </div>
        <div class="text-sm mb-4 text-gray-400 leading-[1.5] tracking-wide">
          The week you want to copy to this week.
        </div>
        <div class="text-[#637286] bg-[#f8fafc] font-semibold py-2.5 px-5 border-y border-[#d5dce6] -mx-5 mt-5 mb-3.5 text-sm">
          Targeted Shifts
        </div>
        <ResourceWrapper data={data}>
          <div class="text-sm mb-4 text-gray-400 leading-[1.5] tracking-wide">
            You are targeting{" "}
            <span class="font-bold">{shiftIds().length} Shifts</span> with the
            filters you have set:
          </div>
          <For each={shiftIds()}>
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
                      data()!.shifts[shift].shiftTemplate.role === Role.CASHIER,
                    "bg-yellow-500":
                      data()!.shifts[shift].shiftTemplate.role === Role.GUARD,
                    "bg-red-500":
                      data()!.shifts[shift].shiftTemplate.role === Role.MANAGER,
                    "bg-gray-600":
                      data()!.shifts[shift].shiftTemplate.role === Role.ADMIN,
                    "bg-gray-400":
                      data()!.shifts[shift].shiftTemplate.role ===
                      Role.ALL_ROLES,
                  }}
                ></i>
                <p class="ml-3.5 font-semibold text-sm tracking-wider">
                  {shiftDetailsTime(
                    data()!.shifts[shift].date || "",
                    data()!.shifts[shift].shiftTemplate.startTime || "",
                    data()!.shifts[shift].shiftTemplate.endTime || ""
                  )}
                </p>
                <p class="ml-3.5 font-normal text-xs text-[13px] tracking-wider">
                  {data()!.shifts[shift].staff?.staffName ||
                    "No staff assigned"}{" "}
                  •{" "}
                  {
                    roles.find(
                      (r) =>
                        r.value === data()!.shifts[shift].shiftTemplate.role
                    )?.label
                  }
                </p>
              </div>
            )}
          </For>
        </ResourceWrapper>
      </SidePopupModal.Body>
      <SidePopupModal.Footer>
        <div class="w-full flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={dateStr() === ""}
            class="py-1.5 px-3 font-semibold text-white border border-blue-400 bg-[#00a8ff] text-sm rounded hover:bg-blue-400 transition-colors disabled:bg-blue-400"
          >
            Copy {shiftIds().length} Shifts
          </button>
        </div>
      </SidePopupModal.Footer>
    </>
  );
};
export default Copy;
