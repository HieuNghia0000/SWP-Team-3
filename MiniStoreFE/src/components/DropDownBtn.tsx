import Dismiss from "solid-dismiss";
import { RiSystemArrowDownSLine, RiSystemArrowUpSLine } from "solid-icons/ri";
import { Component, JSX, Show, createSignal } from "solid-js";

const DropDownBtn: Component<{
  text: string;
  icon?: JSX.Element;
  children: JSX.Element;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  let btnEl;

  return (
    <div class="relative">
      <button
        type="button"
        ref={btnEl}
        class="flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 pl-3.5 pr-1 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
      >
        <Show when={props.icon}>{props.icon}</Show>
        {props.text}
        <span class="text-lg">
          <Show when={!open()} fallback={<RiSystemArrowUpSLine />}>
            <RiSystemArrowDownSLine />
          </Show>
        </span>
      </button>
      <Dismiss menuButton={btnEl} open={open} setOpen={setOpen}>
        <div class="origin-top-right absolute right-0 top-11 z-40 min-w-[200px] rounded-lg shadow-lg border border-gray-200 bg-white shadow-xs">
          {props.children}
        </div>
      </Dismiss>
    </div>
  );
};
export default DropDownBtn;
