import Cookies from "js-cookie";

// Get the endpoint from the cookie (client-side)
export default () => Cookies.get("endpoint");
