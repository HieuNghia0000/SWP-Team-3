import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import * as yup from "yup";
import Breadcrumbs from "~/components/Breadcrumbs";
import { TextInput } from "~/components/form/TextInput";
import routes from "~/utils/routes";

type Schema = {
  name: string;
  phone_number: string;
  full_address: string;
  classCategory: number;
  subject?: string;
  learning_time?: string;
  numb_of_student?: string;
  tutor_gender: number;
  tutor_title: number;
  note_for_tutor?: string;
  tuition_fee?: string;
};

const schema: yup.Schema<Schema> = yup.object({
  name: yup.string().required("Vui lòng nhập họ tên"),
  phone_number: yup.string().required("Vui lòng nhập số điện thoại"),
  full_address: yup.string().required("Vui lòng nhập địa chỉ"),
  classCategory: yup.number().required("Vui lòng chọn lớp học"),
  subject: yup.string(),
  learning_time: yup.string(),
  numb_of_student: yup.string(),
  tutor_gender: yup.number().required("Vui lòng chọn giới tính"),
  tutor_title: yup.number().required("Vui lòng chọn trình độ"),
  note_for_tutor: yup.string(),
  tuition_fee: yup.string(),
});

export default function StaffEdit() {
  const formHandler = useFormHandler(yupSchema(schema), {
    validateOn: ["change"],
  });
  const { formData } = formHandler;

  const submit = async (event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      alert("Data sent with success: " + JSON.stringify(formData()));
      formHandler.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.resetForm();
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Staff Management</h1>
      <Breadcrumbs
        linkList={[
          { name: "Staff Management", link: routes.staffs },
          { name: "Edit Staff" },
        ]}
      />

      <div class="flex flex-col bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <div class="flex flex-auto px-6 pt-6">
          <h4 class="text-2xl font-medium">General Information</h4>
        </div>
        <div class="p-6">
          <form class="space-y-4" onSubmit={submit}>
            <TextInput
              id="name"
              name="name"
              label="Staff name"
              placeholder="Enter staff name"
              formHandler={formHandler}
            />
            <div class="flex-auto">
              <label
                class="inline-block mb-2 text-gray-600"
                for="customlastname"
              >
                Last name
              </label>
              <div class="relative flex w-full">
                <input
                  type="text"
                  class="w-full px-4 py-2 text-gray-600 border rounded outline-none focus:border-blue-500 focus:shadow hover:border-blue-500 dark:bg-dark-card dark:border-gray-600"
                  id="customlastname"
                  autocomplete="off"
                />
              </div>
              <div id="customlnamemsg" class="hidden text-green-400">
                {" "}
                Looks Good
              </div>
            </div>
            <div class="flex-auto">
              <label
                class="inline-block mb-2 text-gray-600"
                for="customusername"
              >
                Username
              </label>
              <div class="relative flex w-full">
                <span
                  class="flex text-gray-600 items-center px-4 py-2 border-t border-b border-l rounded dark:border-gray-600"
                  id="basic-addon1"
                >
                  @
                </span>
                <input
                  type="email"
                  class="w-full text-gray-600 px-4 py-2 border outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                  id="customusername"
                  autocomplete="off"
                />
              </div>
              <div id="customusermsg" class="hidden text-red-400">
                Please choose a username.
              </div>
            </div>
            <div class="flex-auto">
              <label class="inline-block mb-2 text-gray-600" for="customcity">
                City
              </label>
              <div class="relative flex w-full">
                <input
                  type="text"
                  class="w-full px-4 py-2 text-gray-600 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                  id="customcity"
                  autocomplete="off"
                />
              </div>
              <div id="customcitymsg" class="hidden text-red-400">
                Please provide a valid city.
              </div>
            </div>
            <div class="flex-auto">
              <label class="inline-block mb-2 text-gray-600" for="customstate">
                State
              </label>
              <select
                id="customstate"
                class="inline-block w-full py-2 px-4 text-gray-600 border rounded outline-none hover:border-blue-500 dark:bg-dark-card dark:border-gray-600"
              >
                <option value="noselect" selected>
                  Choose...
                </option>
                <option value="1">...</option>
              </select>
              <div id="customstatemsg" class="hidden text-red-400">
                Please select a valid state.
              </div>
            </div>
            <div class="flex-auto">
              <label class="inline-block mb-2 text-gray-600" for="customzip">
                Zip
              </label>
              <div class="flex relative w-full">
                <input
                  type="number"
                  class="w-full px-4 py-2 text-gray-600 border rounded-tl outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                  id="customzip"
                  autocomplete="off"
                />
              </div>
              <div id="customzipmsg" class="hidden text-red-400">
                Please provide a valid zip.
              </div>
            </div>
            <div class="pl-6 mb-2">
              <input
                id="customvalidationcheckbox"
                class="float-left w-4 h-4 mt-1 -ml-6 border border-blue-500 rounded"
                type="checkbox"
              />
              <label
                id="customcheckboxlabel"
                class="text-gray-600"
                for="customvalidationcheckbox"
              >
                Agree to terms and conditions
              </label>
              <div id="customterms&condn" class="hidden text-red-400">
                You must agree before submitting.
              </div>
            </div>
            <button
              type="submit"
              class="inline-block p-2 px-6 py-2 text-center text-white transition-all duration-500 ease-in-out bg-blue-500 border border-blue-500 rounded shadow-md hover:bg-blue-600 hover:text-white"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
