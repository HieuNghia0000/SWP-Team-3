import Breadcrumbs from "~/components/Breadcrumbs";

export default function Schedule() {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Schedule</h1>
      <Breadcrumbs linkList={[{ name: "Schedule" }]} />
    </main>
  );
}
