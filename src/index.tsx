/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { ConvexContext } from "./cvxsolid";
import { ConvexClient } from "convex/browser";

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL!);

render(
  () => (
    <ConvexContext.Provider value={convex}>
      <App />
    </ConvexContext.Provider>
  ),
  document.getElementById("root") as HTMLElement
);
