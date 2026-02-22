import { createRoot } from "react-dom/client";
import { HemicycleWithAislesPlayground } from "./components/HemicyclePlayground";
import "./style.css";

const App = () => {
  return <HemicycleWithAislesPlayground />;
};

createRoot(document.getElementById("app")!).render(<App />);
