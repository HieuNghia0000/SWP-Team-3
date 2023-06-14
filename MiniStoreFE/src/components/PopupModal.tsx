import { CgClose } from "solid-icons/cg";
import { Component, JSX, Show } from "solid-js";

type Props = {
  open: () => boolean;
  close: () => void;
  title: string;
  children: JSX.Element;
  footer: JSX.Element;
};

const PopupModal: Component<Props> = ({
  open,
  close,
  children,
  title,
  footer,
}) => {
  return (
    <Show when={open()}>
      <div
        class="fixed inset-0 z-40 bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden sm:justify-end sm:p-5"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.ariaModal) close();
        }}
      >
        <div class="zoom-in col-span-1 bg-white shadow-md w-[600px] min-w-fit min-h-[100px] rounded-md mx-auto my-8 flex flex-col">
          {/* Header */}
          <div class="py-3.5 px-5 rounded-t-md flex justify-between items-center flex-wrap font-semibold border-b border-gray-300 text-gray-600 bg-gray-50">
            {title}
            <button onClick={close} class="text-xl hover:text-indigo-700">
              <CgClose />
            </button>
          </div>

          {/* Body */}
          <div class="flex-1 p-5">
            <div class="p-5 -m-5">{children}</div>
          </div>

          {/* Footer */}
          <div class="rounded-b-md px-5 py-3.5 border-t border-gray-300 flex items-center justify-start bg-gray-50">
            {footer}
          </div>
        </div>
      </div>
    </Show>
  );
};

export default PopupModal;
