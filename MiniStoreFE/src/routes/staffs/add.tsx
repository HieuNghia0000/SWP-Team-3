import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import {TextInput} from "~/components/form/TextInput";
import {Select} from "~/components/form/Select";
import {Radios} from "~/components/form/Radios";
import {Checkboxes} from "~/components/form/Checkboxes";

export default function AddStaff() {
    return (
        <main>
            <h1 class="mb-2 text-2xl font-medium">Create New Staff</h1>
            <Breadcrumbs linkList={[
                { name: "Staff Management", link: routes.staffs },
                { name: "Create New Staff" }
            ]}/>

            {/*Form create new staff*/}
            <form class="flex flex-row gap-6 mb-4">
                <div class="flex-1 min-w-[800px] space-y-6">
                    <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <h4 class="mb-3.5 text-lg font-medium text-gray-600">
                            General Information
                        </h4>
                        <div class="space-y-2">
                            <TextInput
                                id="staffName"
                                name="staffName"
                                label="Staff Name"
                                placeholder="Type your name here"

                            />
                            <TextInput
                                id="phone"
                                name="phone"
                                label="Phone"
                                placeholder="Type your telephone number here..."

                            />
                            <TextInput
                                id="email"
                                name="email"
                                label="Email"
                                placeholder="Type your email address here..."
                            />
                            <Select
                                id="role"
                                name="role"
                                label="Role"
                                value={"ADMIN"}
                                options={[
                                    {value: "ADMIN", label: "Admin"},
                                    {value: "MANAGER", label: "Manager"},
                                    {value: "CASHIER", label: "Cashier"},
                                    {value: "GUARD", label: "Guard"},
                                ]}
                            />
                            <Select
                                id="salary"
                                name="salary"
                                label="Salary per hour"
                                value={80000}
                                options={[
                                    {value: 10000, label: "10.000VND"},
                                    {value: 20000, label: "20.000VND"},
                                    {value: 50000, label: "50.000VND"},
                                    {value: 80000, label: "80.000VND"},
                                ]}
                            />
                            <Select
                                id="status"
                                name="status"
                                label="Status"
                                value={1}
                                options={[
                                    {value: 0, label: "Disabled"},
                                    {value: 1, label: "Activated"},
                                ]}
                            />
                            <Checkboxes
                                id="day"
                                name="day"
                                value={["monday", "tuesday"]}
                                class="text-gray-500 font-semibold"
                                options={[
                                    {value: "monday", label: "Monday", disabled: false},
                                    {value: "tuesday", label: "Tuesday", disabled: false},
                                    {value: "wednesday", label: "Wednesday", disabled: false},
                                    {value: "thursday", label: "Thursday", disabled: false},
                                    {value: "friday", label: "Friday", disabled: false},
                                    {value: "saturday", label: "Saturday", disabled: false},
                                    {value: "sunday", label: "sunday", disabled: false},
                                ]}
                            />

                            <div class="flex justify-center mt-8">
                                <button type="submit"
                                        class="pl-3 pr-3 py-2 border border-green-600 bg-green-600 rounded-lg hover:bg-green-700">
                                    <span class="font-semibold text-white">Create</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}