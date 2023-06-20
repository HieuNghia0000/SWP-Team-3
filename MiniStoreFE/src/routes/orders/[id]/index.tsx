import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";

export default function Invoice() {
  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Invoice</h1>
      <Breadcrumbs
        linkList={[
          { name: "Orders", link: routes.orders },
          { name: "Invoice" },
        ]}
      />
    </main>
  );
}
