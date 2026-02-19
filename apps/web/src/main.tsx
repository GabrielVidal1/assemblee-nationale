import { createRoot } from "react-dom/client";
import { HemicycleWithAislesPlayground } from "./components/HemicycleWithAislesPlayground";
import "./style.css";

const App = () => (
  <div>
    <HemicycleWithAislesPlayground />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
