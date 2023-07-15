import { createEffect, createResource, createSignal, For, onCleanup, onMount, ResourceFetcher, Show } from "solid-js";
import Breadcrumbs from "~/components/Breadcrumbs";
import { useAuth } from "~/context/Auth";
import moment from "moment";
import axios from "axios";
import { DataResponse, Staff } from "~/types";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { shiftTimes } from "~/components/shift-planning/utils/shiftTimes";
import { useSearchParams } from "@solidjs/router";
import { TextArea } from "~/components/form/TextArea";
import { TextInput } from "~/components/form/TextInput";

const fetcher: ResourceFetcher<boolean, Staff> = async (source) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const { data } = await axios.get<DataResponse<Staff>>(
      `${getEndPoint()}/shift-planning?from=${today}&to=${today}&staffId=1`
    );
    console.log(data.content, source);

    return data.content;
  } catch (e) {
    throw new Error(handleFetchError(e));
  }
};

export default function Attendance() {
  const { user } = useAuth();
  const [ start, setStart ] = createSignal(false);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ data ] = createResource(() => start() && searchParams.staffId !== undefined, fetcher);
  const [ curTime, setCurTime ] = createSignal(moment().format('h:mm:ss a'));
  let interval: any;

  onMount(() => {
    setStart(true);
    setSearchParams({ staffId: user()?.staffId });
  })
  createEffect(() => {
    if (data.state === "ready")
      interval = setInterval(() => setCurTime(moment().format('h:mm:ss a')), 1000);
  })

  onCleanup(() => clearInterval(interval));

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Attendance</h1>
      <Breadcrumbs linkList={[ { name: "Attendance" } ]}/>
      <Show when={!data.error && data() !== undefined}>
        <div class="bg-white mx-auto p-[60px] shadow-xl rounded-md border border-gray-300 max-w-xl">
          <div class="text-2xl mb-5 font-semibold text-center text-gray-800">
            {user()?.staffName}
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Current Date:</span>
              <span>{moment().format('MMMM Do YYYY')}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Time:</span>
              <span>{curTime()}</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 flex flex-row py-2.5 overflow-hidden gap-1.5">
              <span class="font-semibold text-gray-500">
                Associated Shift:
              </span>
              <Show when={data()!.shifts.length > 0} fallback={<p>No shift available</p>}>
                <select>
                  <For each={data()?.shifts}>
                    {shift => (
                      <option value={shift.shiftId}>
                        {shift.name} ({shiftTimes(shift.startTime, shift.endTime)})
                      </option>
                    )}
                  </For>
                </select>
              </Show>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="flex-1 py-2.5 flex flex-row gap-1.5 overflow-hidden">
              <span class="inline-block mb-1.5 text-gray-600 font-semibold">Check In Time: </span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 flex flex-row gap-1.5 overflow-hidden">
              <span class="inline-block mb-1.5 text-gray-600 font-semibold">Check Out Time: </span>
              <span>Not yet</span>
            </div>
          </div>
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <TextInput
                id="noteTitle"
                name="noteTitle"
                label="Note Title"
                placeholder="Give your note a title..."
                // formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <TextArea
                id="noteDescription"
                name="noteDescription"
                label="Note Description"
                placeholder="e.g. Any other information you want to include..."
                // formHandler={formHandler}
              />
            </div>
          </div>
          <div class="w-full flex justify-end items-center gap-2">
            <button
              type="button"
              class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
            >
              Check In
            </button>
          </div>
        </div>
      </Show>
    </main>
  );
}
