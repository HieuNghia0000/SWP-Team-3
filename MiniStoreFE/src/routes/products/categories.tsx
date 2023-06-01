import Breadcrumbs from "~/components/Breadcrumbs";

export default function Categories() {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Categories</h1>
      <Breadcrumbs
        linkList={[
          { name: "Products", link: "/products" },
          { name: "Categories" },
        ]}
      />
    </main>
  );
}
