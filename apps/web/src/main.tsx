import { HemicyclePlayground } from "@repo/ui";
import { createRoot } from "react-dom/client";
import "./style.css";

const App = () => (
  <div>
    <HemicyclePlayground />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
