import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import * as yup from "yup";
import { TextInput } from "~/components/form/TextInput";
import { CgClose } from "solid-icons/cg";
import { Select } from "~/components/form/Select";
import { FiSave } from "solid-icons/fi";

type FormValues = {
  voucherCode: string;
  discount: number;
  discountType: string;
  maxDiscount: number;
  validFrom: string;
  validTo: string;
};

const schema: yup.Schema<FormValues> = yup.object({
  voucherCode: yup.string().required("Voucher Code is required"),
  discount: yup.number().required("Discount value is required"),
  discountType: yup.string().required("Discount type is required"),
  maxDiscount: yup.number().required("Max discount is required"),
  validFrom: yup.string().required("Valid from is required"),
  validTo: yup.string().required("Valid to is required"),
});
export default function EditVoucher() {
  const formHandler = useFormHandler(yupSchema(schema), {
    validateOn: ["change"],
  });
  const { formData } = formHandler;

  const submit = async (event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      alert("Data sent with success: " + JSON.stringify(formData()));
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.resetForm();
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Update Voucher</h1>
      <Breadcrumbs
        linkList={[
          { name: "Voucher List", link: routes.vouchers },
          { name: "Update Voucher" },
        ]}
      />
      <form class="flex-1 min-w-[800px] space-y-6" onSubmit={submit}>
        <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h4 class="mb-3.5 text-lg font-medium text-gray-600">
            General Inforamtion
          </h4>
          <div class="space-y-2">
            <div class="space-y-2">
              <TextInput
                id="voucherCode"
                name="voucherCode"
                label="Voucher Code"
                placeholder="Enter Voucher Code"
                formHandler={formHandler}
              />
            </div>
            <div class="flex flex-row gap-3.5 justify-center items-center">
              <TextInput
                id="discount"
                type="number"
                min={0}
                value={0}
                name="discount"
                label="Discount Value"
                placeholder="Enter Discount Value"
                formHandler={formHandler}
                classList={{ "flex-1": true }}
              />
              <Select
                id="discountType"
                name="discountType"
                label="Discount Type"
                value={"PERCENTAGE"}
                class="flex-1"
                options={[
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "AMOUNT", label: "Amount" },
                ]}
                formHandler={formHandler}
              />
            </div>
            <div>
              <TextInput
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                step={1000}
                min={0}
                value={0}
                label="Max Discount"
                placeholder="Enter Max Discount"
                formHandler={formHandler}
              />
            </div>
          </div>
        </div>
        <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h4 class="mb-3.5 text-lg font-medium text-gray-600">Date</h4>
          <div class="flex flex-row gap-3.5 justify-stretch items-center">
            <TextInput
              id="validFrom"
              name="validFrom"
              label="Valid From"
              type="date"
              placeholder="From Date"
              formHandler={formHandler}
              classList={{ "flex-1": true }}
            />
            <TextInput
              id="validTo"
              name="validTo"
              label="Valid To"
              type="date"
              placeholder="To Date"
              formHandler={formHandler}
              classList={{ "flex-1": true }}
            />
          </div>
        </div>
        <div class="pb-4 flex flex-row justify-end items-center gap-3">
          <button
            type="button"
            onClick={reset}
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-gray-500 bg-white border border-gray-500 font-medium rounded-lg hover:border-black hover:text-black"
          >
            <span class="text-lg">
              <CgClose />
            </span>
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 border border-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          >
            <span class="text-lg">
              <FiSave />
            </span>
            <span>Update</span>
          </button>
        </div>
      </form>
    </main>
  );
}
