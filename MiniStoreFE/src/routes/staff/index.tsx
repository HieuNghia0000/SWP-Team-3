import Breadcrumbs from "~/components/Breadcrumbs";

export default function Staff() {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Staff Management</h1>
      <Breadcrumbs linkList={[{ name: "Staff Management" }]} />
    </main>
  );
}
