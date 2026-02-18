import { Hemicycle } from "@repo/ui";
import { createRoot } from "react-dom/client";
import "./style.css";

const App = () => (
  <div>
    <Hemicycle
      rows={13}
      data={[]}
      innerRadius={40}
      outerRadius={200}
      totalAngle={200}
      // rowMargin={3}
      totalSeats={500}
    />
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
