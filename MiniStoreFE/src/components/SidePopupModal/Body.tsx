import { JSX, Component } from "solid-js";

type PopupModalBodyProps = {
  children: JSX.Element;
};
const Body: Component<PopupModalBodyProps> = (props) => {
  return <div class="flex-1 p-5 overflow-y-scroll">{props.children}</div>;
};
export default Body;
