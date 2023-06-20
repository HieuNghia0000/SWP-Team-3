import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import Breadcrumbs from "~/components/Breadcrumbs";
import { TextInput } from "~/components/form/TextInput";
import routes from "~/utils/routes";
import * as yup from "yup";
import { Select } from "~/components/form/Select";
import { CgClose } from "solid-icons/cg";
import { FiSave } from "solid-icons/fi";

type FormValues = {
  productName: string;
  description?: string;
  price: number;
  barcode?: string;
  quantity: number;
  categoryId?: number;
};

const schema: yup.Schema<FormValues> = yup.object({
  productName: yup.string().required("Vui lòng nhập tên sản phẩm"),
  description: yup.string(),
  price: yup
    .number()
    .typeError("Dữ liệu không hợp lệ")
    .min(0, "Giá sản phẩm không được nhỏ hơn 0")
    .max(1000000, "Giá sản phẩm không được vượt quá 1 triệu")
    .required("Vui lòng nhập giá sản phẩm"),
  barcode: yup.string(),
  quantity: yup
    .number()
    .typeError("Dữ liệu không hợp lệ")
    .min(0, "Số lượng sản phẩm không được nhỏ hơn 0")
    .max(1000000, "Số lượng sản phẩm không được vượt quá 1 triệu")
    .required("Vui lòng nhập số lượng sản phẩm"),
  categoryId: yup.number(),
});

export default function EditProduct() {
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
    <main>
      <h1 class="mb-2 text-2xl font-medium">Edit Product</h1>
      <Breadcrumbs
        linkList={[
          { name: "Product List", link: routes.products },
          { name: "Edit Product" },
        ]}
      />

      <form class="flex flex-row gap-6 mb-4" onSubmit={submit}>
        <div class="flex-1 min-w-[800px] space-y-6">
          <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h4 class="mb-3.5 text-lg font-medium text-gray-600">
              General Inforamtion
            </h4>
            <div class="space-y-2">
              <TextInput
                id="productName"
                name="productName"
                label="Product Name"
                placeholder="Type product name here"
                formHandler={formHandler}
              />
              <TextInput
                id="description"
                name="description"
                label="Description"
                placeholder="Type product description here"
                formHandler={formHandler}
              />
              <TextInput
                id="price"
                type="number"
                min={0}
                step={1000}
                value={0}
                name="price"
                label="Price (VND)"
                placeholder="Type product price here"
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h4 class="mb-3.5 text-lg font-medium text-gray-600">Inventory</h4>
            <div class="flex flex-row gap-3.5 justify-stretch items-center">
              <TextInput
                id="barcode"
                name="barcode"
                label="Barcode"
                placeholder="Product barcode"
                formHandler={formHandler}
                classList={{ "flex-1": true }}
              />
              <TextInput
                id="quantity"
                type="number"
                min={0}
                value={0}
                name="quantity"
                label="Quantity"
                placeholder="Quantity"
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
        </div>
        <div class="w-60">
          <div class="p-6 mb-8 bg-white rounded-lg shadow-md border border-gray-200">
            <h4 class="mb-3.5 text-lg font-medium text-gray-600">Category</h4>
            <div>
              <Select
                id="category"
                name="categoryId"
                label="Product Category"
                value={0}
                options={[
                  { value: 0, label: "Select a category" },
                  { value: 1, label: "Watch" },
                  { value: 2, label: "Drink Water" },
                  { value: 3, label: "Food" },
                ]}
                formHandler={formHandler}
              />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
