import { A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";

type Staff = {
  id?: number;
  username?: string;
  name: string;
  image?: string;
  status?: number;
};

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key) => {
      // const response = await fetch(
      //   `https://hogwarts.deno.dev/${key[0]}/${key[1]}`
      // );
      // return await response.json();
      return {
        id: Number.parseInt(key[1]),
        name: "Nguyen Van A",
        username: "nguyenvana",
        image: "",
        status: 1,
      } as Staff;
    },
    { key: () => ["staffs", params.id] }
  );
}

export default function EditStaffImage() {
  const data = useRouteData<typeof routeData>();
  const [avatar, setAvatar] = createSignal(data()?.image || "");

  const onAvatarInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setAvatar(value);
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Edit staff image</h1>
      <Breadcrumbs
        linkList={[
          { name: "Staff Management", link: routes.staffs },
          { name: "Edit Staff Image" },
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
            <p class="font-medium text-lg">{data()?.name}</p>
            <p class="font-medium text-sm text-gray-500">@{data()?.username}</p>
          </div>
          <div class="border my-5 w-full"></div>
          <div class="flex flex-col gap-3">
            <A
              href={routes.staffEdit(data()?.id!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update profile details
            </A>
            <A
              href={routes.staffImageEdit(data()?.id!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update profile image
            </A>
            <A
              href={routes.staffChangePassword(data()?.id!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update password
            </A>
            <A
              href={routes.staffUpdateSchedule(data()?.id!)}
              class="text-base font-medium"
              activeClass="text-gray-500 cursor-default"
              inactiveClass="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
              end
            >
              Update work schedule
            </A>
            <A
              href={routes.staffDisable(data()?.id!)}
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
              <h4 class="text-lg font-medium">Staff avatar</h4>
            </div>
            <div>
              <div class="aspect-square w-40 rounded-full bg-gray-200 overflow-hidden grid place-items-center mx-auto">
                <img
                  src={avatar() || "/user_default.png"}
                  alt="user avatar"
                  class="object-contain w-36"
                  classList={{ "w-36": !avatar(), "w-40": !!avatar() }}
                />
              </div>
              <div class="text-center mt-4">
                <div class="text-gray-600 text-sm truncate italic">
                  Image preview
                </div>
              </div>
            </div>
            <div class="mb-8">
              <label class="block text-gray-600 font-medium mb-2" for="avatar">
                Avatar link
              </label>
              <input
                class="w-full px-4 py-2 text-gray-600 border rounded outline-none focus:border-indigo-500 focus:shadow"
                classList={{
                  "ring-1 ring-red-400 focus:outline-none": data.error,
                }}
                id="avatar"
                name="avatar"
                type="text"
                placeholder="Enter your avatar link"
                onInput={onAvatarInput}
              />
              <Show when={data.error}>
                <p class="text-sm text-red-400">{data.error.message}</p>
              </Show>
            </div>
            <div>
              <button
                class="block ml-auto p-2 px-6 py-2 text-center text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white"
                type="submit"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
