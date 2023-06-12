import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";

export default function Categories() {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Categories</h1>
      <Breadcrumbs
        linkList={[
          { name: "Products", link: routes.products },
          { name: "Categories" },
        ]}
      />
    </main>
  );
}
