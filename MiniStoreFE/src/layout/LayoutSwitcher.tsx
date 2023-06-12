import { Component, JSX, Show } from "solid-js";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "~/context/Auth";

const LayoutSwitcher: Component<{ children: JSX.Element }> = (props) => {
  const { user } = useAuth();

  return (
    <Show when={!user.error && user()} fallback={props.children} keyed>
      <DashboardLayout>{props.children}</DashboardLayout>
    </Show>
  );
};

export default LayoutSwitcher;
