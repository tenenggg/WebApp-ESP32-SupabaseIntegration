import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ViewData from "./components/ViewData";
import ViewOptimisedLevel from "./components/ViewOptimisedLevel";
import ViewGraph from "./components/ViewGraph";
import SelectPlant from "./components/SelectPlant";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view-data" element={<ViewData />} />
          <Route path="/view-optimised-level" element={<ViewOptimisedLevel />} />
          <Route path="/view-graph" element={<ViewGraph />} />
          <Route path="/select-plant" element={<SelectPlant />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
