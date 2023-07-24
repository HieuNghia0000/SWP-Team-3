import {FaSolidCoins} from "solid-icons/fa";
import {BiRegularWorld} from "solid-icons/bi";
import {Line} from "solid-chartjs";
import {FiArrowUp} from "solid-icons/fi";
import {Chart, Colors, Legend, Tooltip, Title} from "chart.js";
import {onMount} from "solid-js";

export default function Page() {

    onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors)
    });

    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Rice',
                data: [43, 48, 40, 54, 67, 73, 70],
                backgroundColor: '#cc0eed',
                borderColor: '#cc0eed',
            },
            {
                label: 'Milk',
                data: [24, 50, 64, 74, 52, 51, 65],
                backgroundColor: '#2f2830',
                borderColor: '#2f2830',
            },
        ],
    }
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cubicInterpolationMode: 'monotone',
        elements: {
            point: {
                radius: 0
            },
            line: {
                borderJoinStyle: 'round',
                borderWidth: 2
            }
        },
        hover: {
            mode: 'index',
            intersect: false
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false
                }
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false
            },
        }
    };


    return (
      <main class="min-w-fit">

        {/*Card*/}
        <div class="w-full px-2 py-2 mx-auto">
            {/*Row Card*/}
            <div class="flex justify-center mx-3">
                {/*Card 1*/}
                <div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border shadow-lg">
                        <div class="flex-auto p-4">
                            <div class="flex flex-row -mx-3">
                                <div class="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p class="mb-0 font-sans font-bold leading-normal text-sm">Total Revenue</p>
                                        <h5 class="mb-0 mt-1 font-bold text-lg">
                                            $24,500
                                            <span class="leading-normal text-sm font-weight-bolder text-lime-500 ml-1">+10%</span>
                                        </h5>
                                    </div>
                                </div>
                                <div class="px-3 text-right basis-1/3">
                                    <div
                                        class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-blue-400">
                                        <span class="leading-none text-lg relative top-3.5 left-3.5 text-white">
                                            <FaSolidCoins />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Card 2*/}
                <div class="w-full max-w-full px-3 mb-6 sm:w-1/3 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border shadow-lg">
                        <div class="flex-auto p-4">
                            <div class="flex flex-row -mx-3">
                                <div class="flex-none w-7/10 max-w-full px-3">
                                    <div>
                                        <p class="mb-0 font-sans font-bold leading-normal text-sm">Daily Sales</p>
                                        <h5 class="mb-0 mt-1 font-bold text-lg">
                                            2,300 invoices
                                            <span class="leading-normal text-sm font-weight-bolder text-lime-500 ml-2">+3%</span>
                                        </h5>
                                    </div>
                                </div>
                                <div class="px-3 text-right basis-1/2">
                                    <div
                                        class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-blue-400">
                                        <span class="leading-none text-lg relative top-3.5 left-3.5 text-white">
                                            <BiRegularWorld />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Card 3*/}
                <div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div
                        class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border shadow-lg">
                        <div class="flex-auto p-4">
                            <div class="flex flex-row -mx-3">
                                <div class="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p class="mb-0 font-sans font-bold leading-normal text-sm">Stock on hand</p>
                                        <h5 class="mb-0 mt-1 font-bold text-xl">
                                            3,462
                                            <span class="leading-normal text-red-600 text-sm font-weight-bolder ml-2">-2%</span>
                                        </h5>
                                    </div>
                                </div>
                                <div class="px-3 text-right basis-1/3">
                                    <div
                                        class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-blue-400">
                                        <span class="leading-none text-lg relative top-3.5 left-3.5 text-white">
                                            <FaSolidCoins />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Chart*/}
            <div class="flex flex-wrap mt-6 -mx-3">
                <div class="w-full max-w-full px-3 mt-0 lg:w-100 lg:flex-none">
                    <div
                        class="border-black/12.5 shadow-soft-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border shadow-lg">
                        <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid bg-white p-6 pb-0">
                            <h2 class="text-lg font-bold mb-1">Sales overview</h2>
                            <div class="flex gap-6">
                                <p class="leading-normal text-sm flex">
                                    <span class="text-lime-500 text-lg"><FiArrowUp/></span>
                                    <span class="font-semibold mr-1">4% more</span> Last month
                                </p>
                                <p class="leading-normal text-sm flex">
                                    <span class="text-lime-500 text-lg"><FiArrowUp/></span>
                                    <span class="font-semibold mr-1">4% more</span> This month
                                </p>
                            </div>
                        </div>
                        <div class="flex-auto p-4">
                            <div>
                                <Line data={chartData} options={chartOptions} height={300} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
  );
}
