import Breadcrumbs from "~/components/Breadcrumbs";

export default function Products() {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Products</h1>
      <Breadcrumbs linkList={[{ name: "Products" }]} />
    </main>
  );
}
