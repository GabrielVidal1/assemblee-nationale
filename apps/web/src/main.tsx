import { HemicycleWithAislesPlayground } from "@repo/ui";
import { createRoot } from "react-dom/client";
import "./style.css";

const App = () => (
  <div>
    <HemicycleWithAislesPlayground />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
