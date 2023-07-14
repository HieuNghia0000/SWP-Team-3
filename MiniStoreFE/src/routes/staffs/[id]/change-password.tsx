import { A, useRouteData } from "@solidjs/router";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { RouteDataArgs, createRouteData } from "solid-start";
import * as yup from "yup";
import Breadcrumbs from "~/components/Breadcrumbs";
import { TextInput } from "~/components/form/TextInput";
import { Staff, StaffStatus } from "~/types";
import routes from "~/utils/routes";

type Password = {
  curPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const schema: yup.Schema<Password> = yup.object({
  curPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
  newPassword: yup.string().required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: yup.string().required("Vui lòng nhập lại mật khẩu mới"),
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
        image: "",
        status: StaffStatus.ACTIVATED,
        role: "ADMIN",
        leaveBalance: 10,
        shifts: [],
        leaveRequests: [],

      } as Staff;
    },
    { key: () => ["staffs", params.id] }
  );
}

export default function ChangeStaffPassword() {
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
    formHandler.resetForm();
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Change password</h1>
      <Breadcrumbs
        linkList={[
          { name: "Staff Management", link: routes.staffs },
          { name: "Change Staff Password" },
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
            <h4 class="text-lg font-medium">
              Keep your account safe with a strong password.
            </h4>
          </div>
          <div class="p-6">
            <form class="space-y-4" onSubmit={submit}>
              <TextInput
                type="password"
                id="curPassword"
                name="curPassword"
                label="Current password"
                placeholder="Enter current password"
                formHandler={formHandler}
              />

              <TextInput
                type="password"
                id="newPassword"
                name="newPassword"
                label="New password"
                placeholder="Enter new password"
                formHandler={formHandler}
              />

              <TextInput
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Re-enter new password"
                placeholder="Enter new password again"
                formHandler={formHandler}
              />

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
