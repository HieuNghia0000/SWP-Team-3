import { AiOutlineSearch } from "solid-icons/ai";
import { useSearchParams } from "@solidjs/router";
import { ParamType } from "~/components/payroll/types";
import DropDownBtn from "~/components/DropDownBtn";
import { BiRegularSlider } from "solid-icons/bi";
import { Component, createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import { FiCalendar } from "solid-icons/fi";
import flatpickr from "flatpickr";
import moment from "moment";

const ToolBar: Component = ({}) => {
  const [ searchParams, setSearchParams ] = useSearchParams<ParamType>();
  const [ dateStr, setDateStr ] = createSignal<string>("");
  const [ amountFrom, setAmountFrom ] = createSignal<number>(
    Number.parseInt(searchParams.amount_from || "0")
  );
  const [ amountTo, setAmountTo ] = createSignal<number>(
    Number.parseInt(searchParams.amount_to || "0")
  );
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;

  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search: encodeURIComponent(search) });
  };

  createEffect(
    on(
      [ () => searchParams.from, () => searchParams.to ],
      () => {
        if (searchParams.from === undefined || searchParams.to === undefined)
          fp?.setDate(moment().toDate(), true);
      }
    )
  );

  onMount(() => {
    let from = searchParams.from
      ? moment(searchParams.from).format("YYYY-MM-DD")
      : moment().subtract(1, "month").format("YYYY-MM-DD");
    let to = moment(searchParams.to).format("YYYY-MM-DD");

    fp = flatpickr(dateRef!, {
      mode: "range",
      dateFormat: "Y-m-d",
      defaultDate: [ from, to ],
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
      setSearchParams({ from: undefined, to: undefined });
      setDateStr("");
    }
    if (selectedDates.length === 2) {
      const from = moment(selectedDates[0]);
      const to = moment(selectedDates[1]);
      setSearchParams({ from: from.format("YYYY-MM-DD"), to: to.format("YYYY-MM-DD") });
      const start = instance.formatDate(from.toDate(), "F j");
      const end = instance.formatDate(to.toDate(), "F j, Y");
      setDateStr(`${start} - ${end}`);
    }
  };

  return (
    <div class="mb-4 flex flex-row justify-between">
      <div class="flex flex-row gap-5 items-center">
        <form class="relative" onSubmit={onSearchSubmit}>
          <input
            type="text"
            class="w-96 max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
            placeholder="Search (type text, then press Enter)"
            name="search"
            value={decodeURIComponent(searchParams.search ?? "")}
          />
          <button
            class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
            type="submit"
            title="Search"
          >
            <AiOutlineSearch/>
          </button>
        </form>

        <DropDownBtn text="Filters" icon={<BiRegularSlider/>}>
          <div class="flex flex-col gap-2 justify-center items-center p-3 text-sm">
            <div class="w-full">
              <label for="amount_from" class="block">
                From: {amountFrom()} ₫
              </label>
              <input
                type="range"
                step={1000}
                min={0}
                max={1000000}
                id="amount_from"
                name="amount_from"
                value={searchParams.amount_from ?? "0"}
                onInput={(e) => {
                  const value = Number.parseInt(e.currentTarget.value);
                  setAmountFrom(value);
                  if (amountTo() < value) setAmountTo(value);
                }}
                class="w-full"
              />
            </div>
            <div class="w-full">
              <label for="amount_to" class="block">
                To: {amountTo() < amountFrom() ? amountFrom() : amountTo()} ₫
              </label>
              <input
                type="range"
                step={1000}
                min={amountFrom()}
                max={2000000}
                id="amount_to"
                name="amount_to"
                value={searchParams.amount_to ?? "0"}
                onInput={(e) => {
                  const value = Number.parseInt(e.currentTarget.value);
                  if (amountTo() < amountFrom()) setAmountTo(amountFrom());
                  else setAmountTo(value);
                }}
                class="w-full"
              />
            </div>
            <div class="w-full flex justify-end items-center">
              <button
                type="button"
                onClick={() => {
                  setAmountFrom(0);
                  setAmountTo(0);
                  setSearchParams({
                    amount_from: undefined,
                    amount_to: undefined,
                  });
                }}
                class="inline-block px-3 py-1 text-gray-600 text-center hover:text-black"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchParams({
                    amount_from: amountFrom(),
                    amount_to: amountTo(),
                  });
                }}
                class="inline-block px-3 py-1 font-medium text-center text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </DropDownBtn>

        <button
          ref={dateRef}
          type="button"
          class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
        >
          <FiCalendar/>
          {dateStr() || "Select Dates"}
        </button>

      </div>
    </div>
  )
}

export default ToolBar;
