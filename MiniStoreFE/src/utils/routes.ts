const routes = {
  dashboard: "/",
  products: "/products",
  staffs: "/staffs",
  staff: (id: string | number) => `/staffs/${id}`,
  staffAdd: "/staffs/add",
  staffEdit: (id: string | number) => `/staffs/${id}/edit`,
  categories: "/categories",
  logout: "/logout",
};

export default routes;
