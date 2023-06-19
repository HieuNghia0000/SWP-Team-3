import {
  Accessor,
  Component,
  Setter,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { A, useSearchParams } from "solid-start";
import DropDownBtn from "../DropDownBtn";
import { IoCopySharp } from "solid-icons/io";
import {
  FaSolidAngleLeft,
  FaSolidAngleRight,
  FaSolidCheck,
} from "solid-icons/fa";
import { FiCalendar } from "solid-icons/fi";
import { ParamType } from "~/routes/shift-planning";
import moment from "moment";
import flatpickr from "flatpickr";
import { getWeekFirstAndLastDates } from "~/utils/getWeekDates";

type ToolBarProps = {
  datePicked: Accessor<string | undefined>;
  setDatePicked: Setter<string | undefined>;
};

const ToolBar: Component<ToolBarProps> = ({ datePicked, setDatePicked }) => {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const [dateStr, setDateStr] = createSignal<string>("");

  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;

  onMount(() => {
    const p = moment(searchParams.picked_date);
    const defaultDate = p.isValid()
      ? p.format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    setDatePicked(defaultDate);
    fp = flatpickr(dateRef!, {
      mode: "single",
      dateFormat: "Y-m-d",
      defaultDate: defaultDate,
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
      setSearchParams({ picked_date: undefined });
      setDateStr("");
    }
    if (selectedDates.length === 1) {
      const pickedDate = dateStr;
      const [from, to] = getWeekFirstAndLastDates(pickedDate);
      setDatePicked(pickedDate);
      setSearchParams({ picked_date: pickedDate });
      const start = instance.formatDate(from.toDate(), "F j");
      const end = instance.formatDate(to.toDate(), "F j, Y");
      setDateStr(`${start} - ${end}`);
    }
  };

  const goToPrevWeek = () => {
    const pickedDate = moment(datePicked()!);
    const [from] = getWeekFirstAndLastDates(
      pickedDate.subtract(1, "week").format()
    );
    fp?.setDate(from.toDate(), true);
  };

  const goToNextWeek = () => {
    const pickedDate = moment(datePicked()!);
    const [from] = getWeekFirstAndLastDates(pickedDate.add(1, "week").format());
    fp?.setDate(from.toDate(), true);
  };

  const clearFp = () => {
    fp?.clear();
  };

  return (
    <div class="mb-4 flex flex-row justify-between">
      <div class="flex flex-row gap-5 items-center">
        <div class="flex flex-row gap-1 bg-white border-gray-200 border rounded-lg p-1">
          <TableTypePicker
            active={() =>
              searchParams.rendition === undefined ||
              searchParams.rendition === "grid"
            }
            text="Grid"
            param="grid"
            cb={clearFp}
          />
          <TableTypePicker
            active={() => searchParams.rendition === "list"}
            text="List"
            param="list"
            cb={clearFp}
          />
        </div>
      </div>
      <div class="flex justify-center items-center gap-2">
        <button
          type="button"
          onClick={goToPrevWeek}
          class="flex justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
        >
          <FaSolidAngleLeft size={20} />
        </button>
        <button
          ref={dateRef}
          type="button"
          class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
        >
          <FiCalendar />
          {dateStr() || "Select Dates"}
        </button>
        <button
          type="button"
          onClick={goToNextWeek}
          class="flex justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
        >
          <FaSolidAngleRight size={20} />
        </button>
      </div>
      <div class="flex justify-center items-center gap-4">
        <button
          type="button"
          class="flex flex-row items-center gap-1 text-sm font-semibold text-white bg-indigo-600 py-2 px-3.5 rounded-lg hover:bg-indigo-700"
        >
          <span class="text-base">
            <FaSolidCheck />
          </span>
          Publish
        </button>
        <DropDownBtn text="Copy" icon={<IoCopySharp />}>
          <A
            href="/"
            class="py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap block"
          >
            Copy Previous Week
          </A>
          <A
            href="/"
            class="py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap block"
          >
            Create Week Template
          </A>
          <A
            href="/"
            class="py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap block"
          >
            Apply Week Template
          </A>
        </DropDownBtn>
      </div>
    </div>
  );
};

export default ToolBar;

function TableTypePicker(props: {
  active: () => boolean;
  text: string;
  param?: string;
  cb: () => void;
}) {
  const { active, text, param, cb } = props;
  const [, setSearchParams] = useSearchParams();

  return (
    <button
      class="py-1.5 px-3 font-semibold rounded-md text-sm"
      classList={{
        "bg-indigo-100 text-indigo-700": active(),
        "text-gray-500 hover:bg-indigo-50": !active(),
      }}
      onClick={() => {
        setSearchParams({ rendition: param });
        cb();
      }}
    >
      {text}
    </button>
  );
}
