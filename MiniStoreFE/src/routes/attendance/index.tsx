import { Component } from "solid-js";
import Breadcrumbs from "~/components/Breadcrumbs";

const Attendance: Component<{}> = () => {
  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Attendance</h1>
      <Breadcrumbs linkList={[ { name: "Attendance" } ]}/>


    </main>
  );
}

export default Attendance;