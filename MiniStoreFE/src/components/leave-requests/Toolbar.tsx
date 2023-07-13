import { AiOutlineSearch } from "solid-icons/ai";
import { RiSystemAddFill } from "solid-icons/ri";
import { useSearchParams } from "@solidjs/router";
import { ParamType } from "~/components/leave-requests/types";
import DropDownBtn from "~/components/DropDownBtn";
import { BiRegularSlider } from "solid-icons/bi";
import { Component, createSignal, Setter } from "solid-js";

const  ToolBar:Component<{
  setShowCreateModal: Setter<boolean>;
}>=({setShowCreateModal})=> {
  const [ searchParams, setSearchParams ] = useSearchParams<ParamType>();
  const [ amountFrom, setAmountFrom ] = createSignal<number>(
    Number.parseInt(searchParams.amount_from || "0")
  );
  const [ amountTo, setAmountTo ] = createSignal<number>(
    Number.parseInt(searchParams.amount_to || "0")
  );

  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search: encodeURIComponent(search) });
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
      </div>
      <div class="flex justify-center items-center">
        <button
          class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          onClick={[ setShowCreateModal, true ]}
        >
            <span class="text-lg">
              <RiSystemAddFill/>
            </span>
          <span>New Leave Request</span>
        </button>
      </div>
    </div>
  )
}

export default ToolBar;