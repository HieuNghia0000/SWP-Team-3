import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";

export default function StaffDetails() {
  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Staff Management</h1>
      <Breadcrumbs
        linkList={[
          { name: "Staff Management", link: routes.staffs },
          { name: "Staff Details" },
        ]}
      />
    </main>
  );
}
