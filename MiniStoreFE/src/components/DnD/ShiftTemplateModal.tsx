import { Accessor, Component, Setter } from "solid-js";
import PopupModal from "../PopupModal";
import { Role, Shift } from "~/types";
import { Select } from "../form/Select";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import * as yup from "yup";
import { TextInput } from "../form/TextInput";

const schema: yup.Schema = yup.object({
  shiftName: yup.string().required("Vui lòng nhập họ tên"),
  startTime: yup.string().required("Vui lòng nhập họ tên"),
  endTime: yup.string().required("Vui lòng nhập số điện thoại"),
  salaryCoefficient: yup.number().required("Vui lòng nhập lương cơ bản"),
  role: yup.string().required("Vui lòng chọn role"),
});

const ShiftTemplateModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<Shift | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
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
    <PopupModal.Wrapper
      title="New Shift"
      close={() => setShowModal(false)}
      open={showModal}
    >
      <PopupModal.Body>
        <form class="text-sm" onSubmit={submit}>
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shift" class="text-gray-700 font-semibold">
                Shift Template
              </label>
              <Select
                id="shift"
                name="shift"
                value={0}
                options={[
                  { value: 0, label: "No Shift Template" },
                  { value: 1, label: "8:30am - 1:30pm" },
                  { value: 2, label: "10am - 5pm" },
                  { value: 3, label: "1:30pm - 10pm" },
                ]}
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="staff" class="text-gray-700 font-semibold">
                Staff Members
              </label>
              <Select
                id="staff"
                name="staff"
                value="hieuvo"
                options={[
                  { value: "hieuvo", label: "hieu vo" },
                  { value: "khoado", label: "Khoa Do" },
                ]}
                formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 max-w-[140px] flex flex-col gap-1 overflow-hidden">
              <label for="coefficient" class="text-gray-700 font-semibold">
                Salary Coefficient
              </label>
              <TextInput
                id="coefficient"
                name="coefficient"
                type="number"
                step={0.1}
                value={1}
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="role" class="text-gray-700 font-semibold">
                Role
              </label>
              <Select
                id="role"
                name="role"
                value="ADMIN"
                options={[
                  { value: Role.ADMIN, label: "Admin" },
                  { value: Role.MANAGER, label: "Manager" },
                  { value: Role.CASHIER, label: "Cashier" },
                  { value: Role.GUARD, label: "Guard" },
                ]}
                formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="date" class="text-gray-700 font-semibold">
                Salary Coefficient
              </label>
              <TextInput
                id="date"
                name="date"
                type="date"
                formHandler={formHandler}
              />
            </div>
          </div>
        </form>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-end items-center gap-2">
          <button
            type="button"
            class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
          >
            Save & Publish
          </button>
          <button
            type="button"
            class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </PopupModal.Footer>
    </PopupModal.Wrapper>
  );
};

export default ShiftTemplateModal;
