import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import HealthMap from "./pages/HealthMap.jsx";
import BlockCalendar from "./pages/BlockCalendar.jsx";
import Tasks from "./pages/Tasks.jsx";
import Movements from "./pages/Movements.jsx";
import Resources from "./pages/Resources.jsx";
import Optimization from "./pages/Optimization.jsx";
import Reports from "./pages/Reports.jsx";
import Alerts from "./pages/Alerts.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/index.html" element={<Dashboard />} />
        <Route path="/map" element={<HealthMap />} />
        <Route path="/map.html" element={<HealthMap />} />
        <Route path="/calendar" element={<BlockCalendar />} />
        <Route path="/calendar.html" element={<BlockCalendar />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks.html" element={<Tasks />} />
        <Route path="/movements" element={<Movements />} />
        <Route path="/movements.html" element={<Movements />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources.html" element={<Resources />} />
        <Route path="/optimization" element={<Optimization />} />
        <Route path="/optimization.html" element={<Optimization />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports.html" element={<Reports />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alerts.html" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings.html" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
