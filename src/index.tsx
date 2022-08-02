/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { ConvexContext, ConvexSolidClient } from "./cvxsolid";

const convex = new ConvexSolidClient();

render(
  () => (
    <ConvexContext.Provider value={convex}>
      <App />
    </ConvexContext.Provider>
  ),
  document.getElementById("root") as HTMLElement
);
