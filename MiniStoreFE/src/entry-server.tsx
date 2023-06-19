import { redirect } from "solid-start";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import routes, { apiRoutes } from "./utils/routes";
import { createCookieVariable, getCookie } from "./utils/getCookie";
import { DataResponse, Staff } from "./types";

const protectedRoutes = [];
const publicRoutes = [routes.login];

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const cookie = event.request.headers.get("Cookie");
      // console.log(cookie);
      const token = getCookie(cookie, "token");
      let user: Staff | null = null;

      if (token) {
        try {
          const data = await fetch(
            process.env.API_ENDPOINT + apiRoutes.currentUser,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const { content } = (await data.json()) as DataResponse<Staff>;
          if (content) {
            // console.log(content);
            user = content;
          }
        } catch (error) {
          console.log(error);
        }
      }
      // if user accesses a non public route, and he is not authenticated - redirect him to the login page
      // if (
      //   !publicRoutes.includes(new URL(event.request.url).pathname) &&
      //   !user
      // ) {
      //   return redirect(routes.login);
      // }

      // if user accesses a public route, and he is authenticated - redirect him to the main page
      // if (publicRoutes.includes(new URL(event.request.url).pathname) && user) {
      //   return redirect(routes.dashboard);
      // }

      return forward(event); // if we got here, and the pathname is inside the `protectedPaths` array - a user is logged in
    };
  },
  renderAsync((event) => {
    // set the endpoint cookie. Cause we can't use the env variable in the browser
    event.responseHeaders.set(
      "Set-Cookie",
      createCookieVariable("endpoint", process.env.API_ENDPOINT!, 1)
    );

    return <StartServer event={event} />;
  })
);
