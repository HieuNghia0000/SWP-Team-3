import { Component, JSX, createSignal } from "solid-js";
import HeadBar from "~/components/HeadBar";
import Navbar from "~/components/Navbar";

const DashboardLayout: Component<{ children: JSX.Element }> = (props) => {
  const [isNavOpen, setIsNavOpen] = createSignal(true);

  return (
    <div class="flex flex-row h-screen">
      <Navbar isOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      <div class="flex-1 overflow-x-auto flex flex-col">
        <HeadBar isOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        <div class="relative flex-1 overflow-auto">
          <div class="py-8 px-6 h-full">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
