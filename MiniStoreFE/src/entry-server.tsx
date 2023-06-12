import { redirect } from "solid-start";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import routes from "./utils/routes";
import getCookie from "./utils/getCookie";

const protectedRoutes = [];
const publicRoutes = [routes.login];

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const cookie = event.request.headers.get("Cookie");
      const token = getCookie(cookie, "token");

      // if user accesses a non public route, and he does not have token string - redirect him to the login page
      if (
        !publicRoutes.includes(new URL(event.request.url).pathname) &&
        !token
      ) {
        return redirect(routes.login);
      }

      // if user accesses a public route, and he has token string - redirect him to the main page
      if (publicRoutes.includes(new URL(event.request.url).pathname) && token) {
        return redirect(routes.dashboard);
      }

      return forward(event); // if we got here, and the pathname is inside the `protectedPaths` array - a user is logged in
    };
  },
  renderAsync((event) => {
    // set the endpoint cookie. Cause we can't use the env variable in the browser
    event.responseHeaders.set(
      "Set-Cookie",
      `endpoint=${process.env.API_ENDPOINT}; path=/`
    );
    return <StartServer event={event} />;
  })
);
