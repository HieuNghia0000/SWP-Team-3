const routes = {
  login: "/login",
  logout: "/logout",
  dashboard: "/",
  products: "/products",
  staffs: "/staffs",
  staff: (id: string | number) => `/staffs/${id}`,
  staffAdd: "/staffs/add",
  staffEdit: (id: string | number) => `/staffs/${id}/edit`,
  staffImageEdit: (id: string | number) => `/staffs/${id}/edit-image`,
  staffChangePassword: (id: string | number) => `/staffs/${id}/change-password`,
  staffUpdateSchedule: (id: string | number) => `/staffs/${id}/update-schedule`,
  staffDisable: (id: string | number) => `/staffs/${id}/disable`,
  categories: "/categories",
  orders: "/orders",
  orderAdd: "/orders/add",
};

export const apiRoutes = {
  login: "/auth/login",
  currentUser: "/auth/current-staff",
};

export default routes;
