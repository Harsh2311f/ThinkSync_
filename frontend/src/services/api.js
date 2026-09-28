/**
 * ThinkSync FastAPI client used by the migrated React shell and preserved page engines.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = "";
    try {
      const payload = await response.json();
      detail = payload?.detail ? `: ${payload.detail}` : "";
    } catch (_) {}
    throw new Error(`ThinkSync API request failed: ${response.status}${detail}`);
  }

  return response.json();
}

export const getHealth = () => apiRequest("/api/health");
export const getDashboard = (section = "") => apiRequest(`/api/dashboard${section ? `?section=${encodeURIComponent(section)}` : ""}`);
export const getSections = () => apiRequest("/api/sections");
export const getTasks = (section = "", limit = 100) => apiRequest(`/api/tasks?limit=${limit}${section ? `&section=${encodeURIComponent(section)}` : ""}`);
export const getResources = (section = "", limit = 100) => apiRequest(`/api/resources?limit=${limit}${section ? `&section=${encodeURIComponent(section)}` : ""}`);
export const getBlocks = (section = "", limit = 100) => apiRequest(`/api/blocks?limit=${limit}${section ? `&section=${encodeURIComponent(section)}` : ""}`);
export const getTraffic = (section = "", limit = 100) => apiRequest(`/api/traffic?limit=${limit}${section ? `&section=${encodeURIComponent(section)}` : ""}`);
export const getHealthMap = () => apiRequest("/api/health-map");
export const getAlerts = (section = "", limit = 50) => apiRequest(`/api/alerts?limit=${limit}${section ? `&section=${encodeURIComponent(section)}` : ""}`);
export const getPlan = (planId) => apiRequest(`/api/plans/${encodeURIComponent(planId)}`);
export const getWeeklyReports = (section = "") => apiRequest(`/api/reports/weekly${section ? `?section=${encodeURIComponent(section)}` : ""}`);
export const getMonthlyReports = (section = "") => apiRequest(`/api/reports/monthly${section ? `?section=${encodeURIComponent(section)}` : ""}`);

export const updateTaskStatus = (taskId, status) => apiRequest(`/api/tasks/${encodeURIComponent(taskId)}/status`, {
  method: "PATCH",
  body: JSON.stringify({ status }),
});

export const optimizePlan = (payload) => apiRequest("/api/optimize", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const replan = (payload) => apiRequest("/api/replan", {
  method: "POST",
  body: JSON.stringify(payload),
});

export { API_BASE_URL, apiRequest };
