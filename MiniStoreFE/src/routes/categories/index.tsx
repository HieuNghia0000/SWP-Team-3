import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { AiOutlineSearch } from "solid-icons/ai";
import { FaSolidPencil } from "solid-icons/fa";
import { IoEyeOutline, IoTrashOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { RiSystemAddFill } from "solid-icons/ri";
import { Accessor, Component, For, Setter, Show, createSignal } from "solid-js";
import { A, createRouteData, useRouteData, useSearchParams } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import { TextArea } from "~/components/form/TextArea";
import { TextInput } from "~/components/form/TextInput";
import { Category, DataResponse } from "~/types";
import routes from "~/utils/routes";
import * as yup from "yup";
import { CgClose } from "solid-icons/cg";

type ParamType = {
  search?: string;
  perPage?: string;
  curPage?: string;
};

export function routeData() {
  const [searchParams] = useSearchParams<ParamType>();

  return createRouteData(
    async ([perPage, curPage]) => {
      const response = await fetch(`http://localhost:3000/categories.json`);
      const data = (await response.json()) as DataResponse<Category[]>;
      return data.content;
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const data = useRouteData<typeof routeData>();
  const [showCreateModal, setShowCreateModal] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);
  const [editMode, setEditMode] = createSignal(false);
  const [modalData, setModalData] = createSignal<Category | undefined>(
    undefined
  );

  const totalItems = () => data()?.length ?? 0;

  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search });
  };

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Categories</h1>
      <Breadcrumbs linkList={[{ name: "Categories" }]} />

      {/* Search bar */}
      <div class="mb-4 flex flex-row justify-between">
        <div class="flex flex-row gap-5 items-center">
          <form class="relative" onSubmit={onSearchSubmit}>
            <input
              type="text"
              class="w-96 max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
              placeholder="Search (type text, then press Enter)"
              name="search"
              value=""
            />
            <button
              class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
              type="submit"
              title="Search"
            >
              <AiOutlineSearch />
            </button>
          </form>
        </div>
        <div class="flex justify-center items-center mr-5">
          <button
            type="button"
            onClick={[setShowCreateModal, true]}
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          >
            <span class="text-lg">
              <RiSystemAddFill />
            </span>
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 w-1/3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sales
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          {/* <!-- Table row --> */}
          <tbody class="">
            <For each={data()}>
              {(item, index) => (
                <tr class="hover:bg-gray-200 odd:bg-white even:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <A
                      href={routes.category(item.categoryId)}
                      class="hover:text-indigo-500"
                    >
                      {item.name}
                    </A>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.sales}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.stock}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <div class="flex flex-row gap-1">
                      <div class="relative flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setModalData(item);
                            setShowModal(true);
                            setEditMode(false);
                          }}
                          class="peer text-base text-gray-500 hover:text-indigo-500"
                        >
                          <IoEyeOutline />
                        </button>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Details
                        </span>
                      </div>
                      <div class="relative flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setModalData(item);
                            setShowModal(true);
                            setEditMode(true);
                          }}
                          class="peer text-base text-gray-500 hover:text-indigo-500"
                        >
                          <OcPencil3 />
                        </button>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Edit
                        </span>
                      </div>
                      <div class="relative flex justify-center items-center">
                        <A
                          href={"/"}
                          class="peer text-base text-gray-500 hover:text-indigo-500"
                        >
                          <IoTrashOutline />
                        </A>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems}/>

      <CategoryModal
        showModal={showModal}
        modalData={modalData}
        setShowModal={setShowModal}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <CreateCategoryModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
      />
    </main>
  );
}

type FormValues = {
  name: string;
  description?: string;
};

const schema: yup.Schema<FormValues> = yup.object({
  name: yup.string().required("Vui lòng nhập tên"),
  description: yup.string(),
});

const CategoryModal: Component<{
  showModal: Accessor<boolean>;
  editMode: Accessor<boolean>;
  modalData: Accessor<Category | undefined>;
  setShowModal: Setter<boolean>;
  setEditMode: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal, editMode, setEditMode }) => {
  const formHandler = useFormHandler(yupSchema(schema), {
    validateOn: ["change"],
  });
  const { formData } = formHandler;

  const submit = async (event: Event) => {
    event.preventDefault();
    if (!editMode()) return;
    try {
      await formHandler.validateForm();
      alert("Data sent with success: " + JSON.stringify(formData()));
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.fillForm({
      name: modalData()?.name || "",
      description: modalData()?.description || "",
    });
  };

  return (
    <Show when={showModal()}>
      <div
        class="fixed inset-0 z-40 bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden sm:justify-end sm:p-5"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.ariaModal) setShowModal(false);
        }}
      >
        <form
          class="zoom-in col-span-1 bg-white shadow-md w-[600px] min-w-fit min-h-[100px] rounded-md mx-auto my-8 flex flex-col"
          onSubmit={submit}
        >
          {/* Header */}
          <div class="py-3.5 px-5 rounded-t-md flex justify-between items-center flex-wrap font-semibold border-b border-gray-300 text-gray-600 bg-gray-50">
            {editMode() ? "Edit Category" : "Category Details"}
            <button
              onClick={[setShowModal, false]}
              type="button"
              class="text-xl hover:text-indigo-700"
            >
              <CgClose />
            </button>
          </div>

          {/* Body */}
          <div class="flex-1 p-5">
            <div class="p-5 -m-5">
              <div class="space-y-3">
                <div class="space-y-1">
                  <label for="name" class="text-gray-700 font-medium">
                    Category Name
                  </label>
                  <TextInput
                    id="name"
                    name="name"
                    type="text"
                    disabled={!editMode()}
                    value={modalData()?.name || ""}
                    placeholder="Type category name here"
                    formHandler={formHandler}
                  />
                </div>
                <div class="space-y-1">
                  <label for="description" class="text-gray-700 font-medium">
                    Description
                  </label>
                  <TextArea
                    id="description"
                    name="description"
                    disabled={!editMode()}
                    value={modalData()?.description || ""}
                    placeholder="Type category description here"
                    formHandler={formHandler}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div class="rounded-b-md px-5 py-3.5 border-t border-gray-300 flex items-center justify-start bg-gray-50">
            <Show when={editMode()}>
              <div class="w-full flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditMode(false);
                  }}
                  class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </Show>
            <Show when={!editMode()}>
              <button
                type="button"
                onClick={[setEditMode, true]}
                class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
              >
                <span class="">
                  <FaSolidPencil />
                </span>
                Edit Shift
              </button>
            </Show>
          </div>
        </form>
      </div>
    </Show>
  );
};

const CreateCategoryModal: Component<{
  showModal: Accessor<boolean>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, setShowModal }) => {
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
    <Show when={showModal()}>
      <div
        class="fixed inset-0 z-40 bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden sm:justify-end sm:p-5"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.ariaModal) setShowModal(false);
        }}
      >
        <form
          class="zoom-in col-span-1 bg-white shadow-md w-[600px] min-w-fit min-h-[100px] rounded-md mx-auto my-8 flex flex-col"
          onSubmit={submit}
        >
          {/* Header */}
          <div class="py-3.5 px-5 rounded-t-md flex justify-between items-center flex-wrap font-semibold border-b border-gray-300 text-gray-600 bg-gray-50">
            New Category
            <button
              onClick={[setShowModal, false]}
              type="button"
              class="text-xl hover:text-indigo-700"
            >
              <CgClose />
            </button>
          </div>

          {/* Body */}
          <div class="flex-1 p-5">
            <div class="p-5 -m-5">
              <div class="space-y-3">
                <div class="space-y-1">
                  <label for="name" class="text-gray-700 font-medium">
                    Category Name
                  </label>
                  <TextInput
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Type category name here"
                    formHandler={formHandler}
                  />
                </div>
                <div class="space-y-1">
                  <label for="description" class="text-gray-700 font-medium">
                    Description
                  </label>
                  <TextArea
                    id="description"
                    name="description"
                    placeholder="Type category description here"
                    formHandler={formHandler}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div class="rounded-b-md px-5 py-3.5 border-t border-gray-300 flex items-center justify-start bg-gray-50">
            <div class="w-full flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={reset}
                class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
              >
                Discard
              </button>
              <button
                type="submit"
                class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </Show>
  );
};
