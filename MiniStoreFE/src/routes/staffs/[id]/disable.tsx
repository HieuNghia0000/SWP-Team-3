import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Staff, Status } from "~/types";
import routes from "~/utils/routes";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
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
        status: 0,
      } as Staff;
    },
    { key: () => ["staffs", params.id] }
  );
}

export default function DisablingStaff() {
  const data = useRouteData<typeof routeData>();

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Update status</h1>
      <Breadcrumbs
        linkList={[
          { name: "Staff Management", link: routes.staffs },
          { name: "Update Staff Status" },
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

        <div class="bg-white border border-gray-200 rounded-lg min-w-[440px] max-w-lg flex-1 shadow-sm p-6">
          <form class="space-y-6">
            <div>
              <h4 class="text-lg font-medium">Disable staff</h4>
            </div>
            <p class="text-gray-500 italic">
              {data()?.status === Status.ACTIVATED
                ? "This staff is currently enabled. You can disable this staff by clicking the button below."
                : "This staff is currently disabled. You can enable this staff by clicking the button below."}
            </p>
            <div>
              <Show
                when={data()?.status === Status.ACTIVATED}
                fallback={
                  <button
                    class="block ml-auto p-2 px-6 py-2 text-center text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white"
                    type="submit"
                  >
                    Enable
                  </button>
                }
              >
                <button
                  class="block ml-auto p-2 px-6 py-2 text-center text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white"
                  type="submit"
                >
                  Disable
                </button>
              </Show>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
