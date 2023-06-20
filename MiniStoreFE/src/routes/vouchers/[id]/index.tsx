import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import { TextInput } from "~/components/form/TextInput";
import { CgClose } from "solid-icons/cg";
import { Select } from "~/components/form/Select";
import { OcPencil3 } from "solid-icons/oc";
import { A } from "solid-start";

export default function VoucherDetails() {
  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Voucher Details</h1>
      <Breadcrumbs
        linkList={[
          { name: "Voucher List", link: routes.vouchers },
          { name: "Voucher Details" },
        ]}
      />
      <div class="flex-1 min-w-[800px] space-y-6">
        <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h4 class="mb-3.5 text-lg font-medium text-gray-600">
            General Inforamtion
          </h4>
          <div class="space-y-2">
            <div class="space-y-2">
              <TextInput
                disabled
                id="voucherCode"
                name="voucherCode"
                label="Voucher Code"
                placeholder="Enter Voucher Code"
              />
            </div>
            <div class="flex flex-row gap-3.5 justify-center items-center">
              <TextInput
                disabled
                id="discount"
                type="number"
                min={0}
                value={0}
                name="discount"
                label="Discount Value"
                placeholder="Enter Discount Value"
                classList={{ "flex-1": true }}
              />
              <Select
                disabled
                id="discountType"
                name="discountType"
                label="Discount Type"
                value={"PERCENTAGE"}
                class="flex-1"
                options={[
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "AMOUNT", label: "Amount" },
                ]}
              />
            </div>
            <div>
              <TextInput
                disabled
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                step={1000}
                min={0}
                value={0}
                label="Max Discount"
                placeholder="Enter Max Discount"
              />
            </div>
          </div>
        </div>
        <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h4 class="mb-3.5 text-lg font-medium text-gray-600">Date</h4>
          <div class="flex flex-row gap-3.5 justify-stretch items-center">
            <TextInput
              disabled
              id="validFrom"
              name="validFrom"
              label="Valid From"
              type="date"
              placeholder="From Date"
              classList={{ "flex-1": true }}
            />
            <TextInput
              disabled
              id="validTo"
              name="validTo"
              label="Valid To"
              type="date"
              placeholder="To Date"
              classList={{ "flex-1": true }}
            />
          </div>
        </div>
        <div class="pb-4 flex flex-row justify-end items-center gap-3">
          <button
            type="button"
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-gray-500 bg-white border border-gray-500 font-medium rounded-lg hover:border-black hover:text-black"
          >
            <span class="text-lg">
              <CgClose />
            </span>
            <span>Cancel</span>
          </button>
          <A
            href={routes.voucherEdit("NEWTEST2023")}
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 border border-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          >
            <span class="text-lg">
              <OcPencil3 />
            </span>
            <span>Update Voucher</span>
          </A>
        </div>
      </div>
    </main>
  );
}
