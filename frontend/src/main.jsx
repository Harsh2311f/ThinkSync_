import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import * as ThinkSyncAPI from "./services/api.js";
import { bootLiveDataBridge } from "./services/liveBridge.js";

// StrictMode is intentionally omitted during the compatibility migration because
// the preserved legacy page engines attach DOM listeners during mount.
window.ThinkSyncAPI = ThinkSyncAPI;
createRoot(document.getElementById("root")).render(<App />);

// The bridge waits for each preserved page engine, then replaces mock/demo records
// with live FastAPI + MongoDB data without rewriting the team's page structure.
setTimeout(() => bootLiveDataBridge(window.location.pathname), 0);
