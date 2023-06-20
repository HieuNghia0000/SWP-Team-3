import Breadcrumbs from "~/components/Breadcrumbs";
import { useSearchParams, createRouteData } from "solid-start";
import { DataResponse, TimeClock } from "~/types";
import {AiOutlineSearch} from "solid-icons/ai";


type ParamType = {
    search?: string;
    perPage?: string;
    curPage?: string;
    amount_from?: string;
    amount_to?: string;
};

export function routeData() {
    const [ searchParams ] = useSearchParams<ParamType>();

    return createRouteData (
        async ([perPage, curPage]) => {
            const response =await fetch(`http://localhost:3000/time-clock.json`);
            const data = (await response.json()) as DataResponse<TimeClock[]>;
            return data.content;
        },
        { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
    );
}

export default function TimeClocks() {
    const [searchParams, setSearchParams] = useSearchParams<ParamType>();

    const onSearchSubmit = (e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const search = formData.get("search") as string;
        setSearchParams({ search });
    }

    return (
        <main>
            <h1 class="mb-2 text-2xl font-medium">Time Clock</h1>
            <Breadcrumbs linkList={[{ name: "Time Clock" }]} />

            {/* Toolbar */}
            <div>
                <div class="flex justify-center items-center">
                    <form class="relative" onSubmit={onSearchSubmit}>
                        <input type="text"
                               class="w-96 max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
                               placeholder="Search schedule (type text, number, then press Enter)...."
                               name="search"
                               value=""/>
                        <button
                            class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
                            type="submit"
                            title="Search"
                        ><AiOutlineSearch/></button>
                    </form>
                </div>
            </div>
        </main>
    )
}