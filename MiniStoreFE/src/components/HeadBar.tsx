import { RiSystemArrowDownSLine, RiSystemArrowUpSLine } from "solid-icons/ri";
import { Component, Show, createSignal } from "solid-js";

type HeadBarProps = {
  isOpen: () => boolean;
  setIsNavOpen: (value: boolean) => void;
};

const HeadBar: Component<HeadBarProps> = (props) => {
  const { isOpen, setIsNavOpen } = props;
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  return (
    <nav class="flex flex-row justify-between items-center py-4 px-6 gap-4 h-[72px] bg-white border-b-1 border-gray-200 shadow-md">
      <button onClick={() => setIsNavOpen(!isOpen())}>
        <img src="/buger_icon.svg" class="bx bx-menu"></img>
      </button>
      <div class="relative ml-3">
        <div class="h-full items-center flex">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen())}
            class="text-sm rounded-full flex items-center justify-center gap-3"
          >
            <img
              class="h-8 w-8 rounded-full bg-gray-400"
              src="https://api.dicebear.com/5.x/adventurer/svg?seed=admin"
              alt="Profile Image"
            />
            <div class="text-start">
              <p class="font-semibold">Jay Hargudson</p>
              <p class="text-xs text-gray-500 font-medium">Manager</p>
            </div>
            <span class="text-lg">
              <Show
                when={!isDropdownOpen()}
                fallback={<RiSystemArrowUpSLine />}
              >
                <RiSystemArrowDownSLine />
              </Show>
            </span>
          </button>
        </div>
        <Show when={isDropdownOpen()}>
          <div class="origin-top-right absolute right-0 top-16 z-10 w-48 rounded-md shadow-lg border border-gray-200">
            <div class="py-1 rounded-md bg-white shadow-xs">
              <a
                href="/logout"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </a>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  );
};

export default HeadBar;
