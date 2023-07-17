const routes = {
  login: "/login",
  logout: "/logout",
  dashboard: "/",
  shiftPlanning: "/shift-planning",
  staffs: "/staffs",
  staff: (id: string | number) => `/staffs/${id}`,
  staffAdd: "/staffs/add",
  staffEdit: (id: string | number) => `/staffs/${id}/edit`,
  staffImageEdit: (id: string | number) => `/staffs/${id}/edit-image`,
  staffChangePassword: (id: string | number) => `/staffs/${id}/change-password`,
  staffUpdateSchedule: (id: string | number) => `/staffs/${id}/update-schedule`,
  staffDisable: (id: string | number) => `/staffs/${id}/disable`,
  orders: "/orders",
  order: (id: string | number) => `/orders/${id}`,
  orderAdd: "/orders/add",
  products: "/products",
  product: (id: string | number) => `/products/${id}`,
  productEdit: (id: string | number) => `/products/${id}/edit`,
  productAdd: "/products/add",
  categories: "/categories",
  category: (id: string | number) => `/categories/${id}`,
  categoryEdit: (id: string | number) => `/categories/${id}/edit`,
  timeClock: "/time-clock",
  leaves: "/leave-requests",
  shiftCover: "/shift-cover-requests",
  attendance: "/attendance",
  attendanceId: (id: string | number) => `/attendance/${id}`,
  timesheets: "/timesheets",
  payroll: "/payroll",
};

export const apiRoutes = {
  login: "/auth/login",
  currentUser: "/auth/current-staff",
};

export default routes;
