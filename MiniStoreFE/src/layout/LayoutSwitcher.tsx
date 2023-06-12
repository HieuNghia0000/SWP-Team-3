import { Component, JSX, Match, Switch } from "solid-js";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "~/context/Auth";
import { Navigate, useLocation } from "solid-start";
import routes from "~/utils/routes";

const LayoutSwitcher: Component<{ children: JSX.Element }> = (props) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Switch fallback={props.children}>
      <Match
        when={
          (user.state === "unresolved" || user.loading) &&
          location.pathname !== routes.login
        }
      >
        <div class="h-screen grid place-items-center">Loading...</div>
      </Match>

      {/* Navigate to login page when error occurs or user logged out */}
      <Match
        when={(user.error || !user()) && location.pathname !== routes.login}
        keyed
      >
        <Navigate href={routes.login} />
      </Match>

      {/* Navigate to Dashboard page when has valid user data */}
      <Match when={!user.error && user() && location.pathname === routes.login}>
        <Navigate href={routes.dashboard} />
      </Match>

      {/* Apply DashboardLayout for protected routes */}
      <Match
        when={!user.error && user() && location.pathname !== routes.login}
        keyed
      >
        <DashboardLayout>{props.children}</DashboardLayout>
      </Match>
    </Switch>
  );
};

export default LayoutSwitcher;
