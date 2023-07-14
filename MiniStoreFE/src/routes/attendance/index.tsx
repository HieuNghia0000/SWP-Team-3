import { createResource, createSignal, For, ResourceFetcher, Show } from "solid-js";
import Breadcrumbs from "~/components/Breadcrumbs";
import { useAuth } from "~/context/Auth";
import moment from "moment";
import axios from "axios";
import { DataResponse, Staff } from "~/types";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { shiftTimes } from "~/components/shift-planning/utils/shiftTimes";
import ResourceWrapper from "~/components/ResourceWrapper";

const fetcher: ResourceFetcher<number, Staff> = async (source) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const { data } = await axios.get<DataResponse<Staff>>(
      `${getEndPoint()}/shift-planning?from=${today}&to=${today}&staffId=${source}`
    );

    return data.content;
  } catch (e) {
    throw new Error(handleFetchError(e));
  }
};

export default function Attendance() {
  const { user } = useAuth();
  const [ data ] = createResource(() => user()?.staffId, fetcher);
  const [ curTime, setCurTime ] = createSignal(moment().format('MMMM Do YYYY, h:mm:ss a'));

  setInterval(() => setCurTime(moment().format('MMMM Do YYYY, h:mm:ss a')), 1000);

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Attendance</h1>
      <Breadcrumbs linkList={[ { name: "Attendance" } ]}/>
      <ResourceWrapper data={data}>
        <div class="bg-white mx-auto p-[60px] shadow-xl rounded-md border border-gray-300 max-w-xl">
          <p>{user()?.staffName}</p>
          <p>{curTime()}</p>
          <p>Associated Shift: </p>
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
          <br/>
          <p>Check In Time: <span>Not yet</span></p>
          <p>Check Out Time: <span>Not yet</span></p>
          <p>Note Title: </p>
          <p>Note Description: </p>
          <button>Check In/Out</button>
        </div>
      </ResourceWrapper>
    </main>
  );
}
