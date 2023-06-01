import { Component, JSX, Show, children, createSignal } from "solid-js";
import { TiThLargeOutline } from "solid-icons/ti";
import { BiRegularShoppingBag } from "solid-icons/bi";
import { RiSystemArrowDownSLine, RiSystemArrowUpSLine } from "solid-icons/ri";
import { BsPeople } from "solid-icons/bs";
import { A } from "@solidjs/router";
import { Transition } from "solid-transition-group";

type NavbarProps = {
  isOpen: () => boolean;
  setIsNavOpen: (value: boolean) => void;
};

const Navbar: Component<NavbarProps> = (props) => {
  const { isOpen } = props;

  return (
    <section
      class="w-64 h-screen bg-white z-10 overflow-x-hidden transition-all duration-300 flex flex-col items-start border-r-1 border-gray-200 shadow-lg"
      classList={{ "w-[76px]": !isOpen() }}
    >
      <A
        href="/"
        class="flex justify-start items-center py-2 px-5 gap-2.5 w-full h-16"
      >
        <img src="/Logo.png" alt="logo" />
        <span class="font-bold text-2xl" classList={{ hidden: !isOpen() }}>
          MiniStore
        </span>
      </A>
      <ul class="w-full flex flex-col items-start gap-2 px-[18px] py-6">
        {/* Dashboard */}
        <NavbarLink
          href="/"
          icon={<TiThLargeOutline />}
          text="Dashboard"
          isOpen={isOpen}
        />

        {/* Product */}
        <NavbarDropDown
          href="/products"
          isOpen={isOpen}
          icon={<BiRegularShoppingBag />}
          text="Products"
        >
          <NavbarLink
            href="/products"
            text="Product&nbsp;List"
            isOpen={isOpen}
          />
          <NavbarLink
            href="/products/categories"
            text="Categories"
            isOpen={isOpen}
          />
        </NavbarDropDown>

        {/* Staff */}
        <NavbarLink
          href="/staff"
          icon={<BsPeople />}
          text="Staff&nbsp;Management"
          isOpen={isOpen}
        />
      </ul>
    </section>
  );
};

export default Navbar;

interface NavbarLinkProps {
  href: string;
  isOpen: () => boolean;
  icon?: JSX.Element;
  text?: string;
}

const NavbarLink: Component<NavbarLinkProps> = (props) => {
  const { href, isOpen, icon, text } = props;

  return (
    <li class="w-full">
      <A
        href={href}
        class="flex flex-row items-center py-2 px-[11px] gap-2 rounded-lg w-full font-semibold"
        classList={{
          "py-[11px]": !isOpen(),
        }}
        activeClass="bg-indigo-600 text-white"
        inactiveClass="text-gray-600 hover:bg-[#EFEFFD] hover:text-indigo-600"
        end
      >
        <Show when={icon}>{<span class="text-lg">{icon}</span>}</Show>
        <Show when={isOpen()}>
          <span>{text}</span>
        </Show>
      </A>
    </li>
  );
};

interface NavbarDropDownProps extends NavbarLinkProps {
  children?: JSX.Element | JSX.Element[];
}

const NavbarDropDown: Component<NavbarDropDownProps> = (props) => {
  const { href, isOpen, icon, text } = props;
  const [isDropdownOpen, setDropdownOpen] = createSignal(true);
  const child = children(() => props.children);

  const toggleProductDropdown = () => setDropdownOpen(!isDropdownOpen());

  return (
    <>
      <li class="w-full relative">
        <A
          href={href}
          class="text-gray-600 flex flex-row items-center py-2 px-[11px] gap-2 rounded-lg w-full font-semibold z-20"
          classList={{
            "py-[11px]": !isOpen(),
            "bg-[#EFEFFD] text-indigo-600": isDropdownOpen() && isOpen(),
          }}
          activeClass={
            !isOpen() || !isDropdownOpen()
              ? "bg-indigo-600 text-white"
              : "bg-[#EFEFFD] text-indigo-600"
          }
          inactiveClass="hover:bg-[#EFEFFD] hover:text-indigo-600"
        >
          <Show when={icon}>{<span class="text-lg">{icon}</span>}</Show>
          <span classList={{ hidden: !isOpen() }}>{text}</span>
        </A>
        <Transition
          onEnter={(el, done) => {
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 300,
            });
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 100,
            });
            a.finished.then(done);
          }}
        >
          <Show when={isOpen()}>
            <button
              onClick={toggleProductDropdown}
              class="rounded text-lg hover:bg-indigo-300 absolute right-[11px] top-1/2 -translate-y-1/2"
            >
              <span class="text-lg">
                <Show
                  when={!isDropdownOpen()}
                  fallback={<RiSystemArrowUpSLine />}
                >
                  <RiSystemArrowDownSLine />
                </Show>
              </span>
            </button>
          </Show>
        </Transition>
      </li>
      <Show when={isOpen() && isDropdownOpen()}>{child()}</Show>
    </>
  );
};
