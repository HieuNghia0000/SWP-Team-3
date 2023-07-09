import { A, useRouteData } from "@solidjs/router";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { RouteDataArgs, createRouteData } from "solid-start";
import * as yup from "yup";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Select } from "~/components/form/Select";
import { TextInput } from "~/components/form/TextInput";
import { Role, Staff, StaffStatus } from "~/types";
import routes from "~/utils/routes";

const role = [
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.MANAGER, label: "Manager" },
  { value: Role.CASHIER, label: "Cashier" },
  { value: Role.GUARD, label: "Guard" },
];

const schema: yup.Schema = yup.object({
  name: yup.string().required("Vui lòng nhập họ tên"),
  phone: yup.string().required("Vui lòng nhập số điện thoại"),
  role: yup.string().required("Vui lòng chọn role"),
  salary: yup.string().required("Vui lòng nhập lương cơ bản"),
});

export function routeData({ params }: RouteDataArgs) {
  return createRouteData(
    async (key) => {
      // const response = await fetch(
      //   `https://hogwarts.deno.dev/${key[0]}/${key[1]}`
      // );
      // return await response.json();
      return {
        staffId: Number.parseInt(key[1]),
        staffName: "Nguyen Van A",
        username: "nguyenvana",
        phoneNumber: "0123456789",
        role: Role.ADMIN,
        workDays: "TUE, THU, SAT, SUN",
        status: StaffStatus.ACTIVATED,
        salary: { hourlyWage: 80000 },
        image: "",
      } as Staff;
    },
    { key: () => ["staffs", params.id] }
  );
}

export default function StaffEdit() {
  const data = useRouteData<typeof routeData>();
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
    formHandler.fillForm(data()!);
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Edit staff</h1>
      <Breadcrumbs
        linkList={[
          { name: "Staff Management", link: routes.staffs },
          { name: "Edit Staff" },
        ]}
      />

      <div class="flex flex-row gap-5 items-start">
        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm p-6 min-w-[265px]">
          <div class="aspect-square w-40 rounded-full bg-gray-200 overflow-hidden grid place-items-center">
            <img
              src={data()?.image || "/user_default.png"}
              alt="user avatar"
              class="object-contain"
              classList={{ "w-36": !data()?.image, "w-40": !!data()?.image }}
            />
          </div>
          <div class="mt-2 text-center">
            <p class="font-medium text-lg">{data()?.staffName}</p>
            <p class="font-medium text-sm text-gray-500">@{data()?.username}</p>
          </div>
          <div class="border my-5 w-full"></div>
          <div class="flex flex-col gap-3">
            <A
              href={routes.staffEdit(data()?.staffId!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update profile details
            </A>
            <A
              href={routes.staffImageEdit(data()?.staffId!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update profile image
            </A>
            <A
              href={routes.staffChangePassword(data()?.staffId!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update password
            </A>
            <A
              href={routes.staffUpdateSchedule(data()?.staffId!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update work schedule
            </A>
            <A
              href={routes.staffDisable(data()?.staffId!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Disable account
            </A>
          </div>
        </div>

        <div class="flex flex-col bg-white border border-gray-200 rounded-lg min-w-[440px] max-w-5xl flex-1 shadow-sm">
          <div class="flex flex-auto px-6 pt-6">
            <h4 class="text-lg font-medium">General Information</h4>
          </div>
          <div class="p-6">
            <form class="space-y-4" onSubmit={submit}>
              <TextInput
                id="name"
                name="name"
                label="Staff name"
                value={data()?.staffName}
                placeholder="Enter staff name"
                formHandler={formHandler}
              />

              <TextInput
                id="username"
                name="username"
                label="Username"
                value={data()?.username}
                disabled
                placeholder="Enter staff username"
                formHandler={formHandler}
              />

              <TextInput
                id="phone"
                name="phone"
                label="Phone number"
                value={data()?.phoneNumber}
                placeholder="Enter staff phone number"
                formHandler={formHandler}
              />

              <Select
                id="role"
                name="role"
                label="Role"
                value={data()?.role}
                options={role}
                formHandler={formHandler}
              />

              <TextInput
                id="salary"
                name="salary"
                label="Base salary"
                value={data()?.salary?.hourlyWage}
                type="number"
                step={1000}
                placeholder="Enter staff base salary"
                formHandler={formHandler}
              />

              <TextInput
                id="workDays"
                name="workDays"
                label="Work days"
                value={data()?.workDays}
                disabled
                placeholder="None"
                formHandler={formHandler}
              />
              <div class="space-x-3">
                <p class="inline-block mb-2 text-gray-600">Status</p>
                <span
                  class="inline-block whitespace-nowrap px-2 py-0.5 text-sm text-center font-bold text-white rounded-full"
                  classList={{
                    "bg-green-500": data()?.status === StaffStatus.ACTIVATED,
                    "bg-red-500": data()?.status === StaffStatus.DISABLED,
                  }}
                >
                  {data()?.status === StaffStatus.ACTIVATED
                    ? "Active"
                    : "Disabled"}
                </span>
              </div>

              <div class="space-x-3">
                <button
                  type="button"
                  onClick={reset}
                  class="inline-block p-2 px-6 py-2 text-center text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white"
                >
                  Discard changes
                </button>
                <button
                  type="submit"
                  class="inline-block p-2 px-6 py-2 text-center text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
