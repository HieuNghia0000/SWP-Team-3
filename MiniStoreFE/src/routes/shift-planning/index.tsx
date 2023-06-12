import Breadcrumbs from "~/components/Breadcrumbs";

export default function ShiftPlanning() {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
      <Breadcrumbs linkList={[{ name: "Shift Planning" }]} />

      {/* Tool bar */}

      {/* Table */}
      <div class="w-full">
        <div class="min-w-[1024px]">
          {/* Header */}
          <div class="sticky top-0 z-30 flex shadow-sm border border-gray-200 rounded-t-md">
            <div class="sticky -left-6 z-30 px-3 py-2 flex flex-col justify-center border border-gray-200 w-52 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-[#f8fafc]"></div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Mon, Jun 5</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Tue, Jun 6</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Wed, Jun 7</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Thu, Jun 8</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Fri, Jun 9</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Sat, Jun 10</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Sun, Jun 11</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
          </div>

          {/* Drag container */}
          <div class="relative shadow-sm border border-gray-200">
            {/* Row */}
            <div class="flex">
              <div class="sticky -left-6 px-3 py-1.5 flex flex-col border border-t-0 border-gray-200 w-52 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-[#f8fafc]">
                <div class="font-semibold text-sm text-gray-500">
                  Open Shifts
                </div>
                <div class="font-normal text-sm text-gray-400">0 hrs / $0</div>
              </div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 overflow-hidden bg-white pt-0.5">
                <button class="rounded mx-0.5 px-1.5 py-1 relative text-left bg-blue-100 hover:bg-blue-200">
                  <i class="bg-blue-700 absolute top-1 left-1 bottom-1 w-1.5 rounded"></i>
                  <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
                  <p class="ml-3 font-normal text-xs text-gray-600">Cashier</p>
                </button>
              </div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 items-center overflow-hidden bg-white pt-0.5"></div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 items-center overflow-hidden bg-white pt-0.5"></div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 items-center overflow-hidden bg-white pt-0.5"></div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 items-center overflow-hidden bg-white pt-0.5"></div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 items-center overflow-hidden bg-white pt-0.5"></div>
              <div class="flex flex-col border-r border-b border-gray-200 flex-1 items-center overflow-hidden bg-white pt-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
