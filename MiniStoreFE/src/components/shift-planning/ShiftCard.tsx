import { Component, splitProps } from "solid-js";
import { Role } from "~/types";

interface ShiftCardProps {
  isActiveDraggable?: boolean;
  published: boolean;
  isOrigin: boolean;
  role: Role;
  shiftDuration: string;
  shiftName: string;
  loading: boolean;
  isOverlay?: boolean;
  onClick?: () => void;
  draggable?: any;
  style?: any;
}

const ShiftCard: Component<ShiftCardProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "isActiveDraggable",
    "published",
    "isOrigin",
    "role",
    "shiftDuration",
    "shiftName",
    "loading",
    "isOverlay",
    "draggable",
  ]);

  const fs = () => {};
  const draggable = local.draggable || fs; // DO NOT REMOVE THIS LINE

  return (
    <button
      {...rest}
      // @ts-ignore
      use:draggable
      type="button"
      class="rounded mx-0.5 px-1.5 py-1 relative text-left select-none"
      classList={{
        "opacity-25": local.isActiveDraggable,
        "bg-white hover:bg-[#edf2f7] text-black border border-gray-200":
          local.published && local.isOrigin,
        "bg-blue-100 hover:bg-blue-200 text-blue-500 border border-blue-100":
          local.published && !local.isOrigin,
        "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eff4f8_5px,#eff4f8_10px)] hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)] border border-gray-200":
          !local.published && local.isOrigin,
        "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] hover:bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#bfeaff_5px,#bfeaff_10px)] border border-blue-100":
          !local.published && !local.isOrigin,
        "animate-pulse": local.loading,
        "z-40": local.isOverlay,
      }}
    >
      <i
        class="absolute top-1 left-1 bottom-1 w-1.5 rounded"
        classList={{
          "bg-blue-500": local.role === Role.CASHIER,
          "bg-yellow-500": local.role === Role.GUARD,
          "bg-red-500": local.role === Role.MANAGER,
          "bg-gray-500": local.role === Role.ADMIN,
        }}
      ></i>
      <p class="ml-3 font-semibold text-sm">{local.shiftDuration}</p>
      <p class="ml-3 font-normal text-xs text-gray-600">{local.shiftName}</p>
    </button>
  );
};
export default ShiftCard;
