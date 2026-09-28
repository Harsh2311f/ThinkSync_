import * as API from "./api.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate, timeoutMs = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const value = predicate();
    if (value) return value;
    await sleep(100);
  }
  return null;
}

function asDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function fmtDate(value) {
  const date = asDate(value);
  return date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
}

function fmtTime(value) {
  const date = asDate(value);
  return date ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "—";
}

function sourceClass(value = "") {
  const name = String(value).toLowerCase();
  return ["tms", "smms", "tdms"].includes(name) ? name : "tms";
}

function priorityClass(value = "") {
  const name = String(value).toLowerCase();
  if (name === "critical" || name === "high") return "high";
  if (name === "medium") return "medium";
  return "low";
}

function statusClass(value = "") {
  const name = String(value).toLowerCase();
  if (name.includes("overdue")) return "overdue";
  if (name.includes("progress")) return "progress";
  if (name.includes("complete")) return "completed";
  return "planned";
}

function mapTask(task) {
  const overdueHours = Number(task?.schedule?.overdue_hours || 0);
  const overdue = Boolean(task?.schedule?.is_overdue);
  const route = [task?.geo?.origin_station, task?.geo?.destination_station].filter(Boolean).join(" – ") || task.section_id || "Unknown section";
  const severity = task?.labels?.severity || "Medium";
  const status = overdue ? "Overdue" : (task.workflow_status || "Planned");
  return {
    id: task.task_id,
    source: task.source_system || "TMS",
    sourceClass: sourceClass(task.source_system),
    description: task?.asset?.defect_type || `${task?.asset?.type || "Asset"} maintenance`,
    section: route,
    location: task?.geo?.district_corridor || task.section_id || "—",
    department: task.department || "Engineering",
    priority: severity,
    priorityClass: priorityClass(severity),
    status,
    statusClass: statusClass(status),
    dueDate: fmtDate(task?.schedule?.due_date),
    daysLeft: overdue ? -Math.max(1, Math.ceil(overdueHours / 24)) : 0,
    detailedSummary: `${task?.asset?.type || "Asset"} • Risk score ${task?.labels?.risk_score ?? "—"} • Readiness ${Math.round(Number(task?.readiness?.readiness_score || 0) * 100)}%`,
    fullDescription: `${task?.asset?.defect_type || "Maintenance task"} on ${route}. Previous failures: ${task?.context?.previous_failures_12m ?? 0}; traffic density: ${task?.context?.traffic_density ?? "—"}.`,
    daysOverdueText: overdue ? `${Math.ceil(overdueHours / 24)} days` : "On Schedule",
    createdOn: fmtDate(task.event_datetime),
    createdBy: `${task.source_system || "TMS"} / ThinkSync database`,
    attachments: [],
  };
}

function mapMovement(item) {
  const delay = Number(item.delay_minutes || 0);
  const route = [item?.geo?.origin_station, item?.geo?.destination_station].filter(Boolean).join(" → ") || item.section_id || "—";
  const category = String(item.train_category || "passenger").toLowerCase();
  const type = category === "goods" ? "Freight" : (category === "freight" ? "Freight" : "Passenger");
  const onTime = delay <= 5;
  const trainNo = item.train_id || item.movement_id;
  const currentLocation = item?.geo?.origin_station || item.section_id || "In Transit";
  const nextStation = item?.geo?.destination_station || "—";
  const eta = fmtTime(item.scheduled_exit || item.scheduled_entry);
  return {
    trainNo,
    trainName: item.train_type || `${type} Service`,
    type,
    statusType: onTime ? "ontime" : "delayed",
    statusDot: onTime ? "green" : (delay > 30 ? "red" : "orange"),
    fromTo: route,
    currentLocation,
    currentLocationCode: item.section_id || "JH",
    nextStation,
    status: onTime ? "On Time" : "Delayed",
    statusClass: onTime ? "ontime" : "delayed",
    delay: delay ? `+${delay} min` : "0 min",
    delayClass: delay ? "delayed" : "zero",
    eta,
    speed: "Telemetry N/A",
    scheduledArrival: eta,
    expectedArrival: delay ? `${eta} (+${delay} min)` : `${eta} (On Time)`,
    nextHalt: nextStation,
    lastUpdated: fmtDate(item.actual_entry || item.scheduled_entry),
    locoSpecs: `${item.priority || "Normal"} priority • ${item.direction || "—"} direction`,
    locoPhoto: "train_banner.jpg",
    milestones: [
      { station: item?.geo?.origin_station || "Origin", time: fmtTime(item.scheduled_entry), status: "completed" },
      { station: item?.geo?.destination_station || "Destination", time: fmtTime(item.scheduled_exit), status: "active", note: delay ? `Delay ${delay} min` : "On time" },
    ],
    fullRouteMilestones: [
      { station: item?.geo?.origin_station || "Origin", time: fmtTime(item.scheduled_entry), status: "completed" },
      { station: item?.geo?.destination_station || "Destination", time: fmtTime(item.scheduled_exit), status: "active", note: item.corridor_status || "Available" },
    ],
  };
}

function mapCongestion(sections, movements) {
  const count = new Map();
  movements.forEach((m) => count.set(m.section_id, (count.get(m.section_id) || 0) + 1));
  const maxCount = Math.max(1, ...count.values());
  return sections.slice(0, 12).map((s) => {
    const movementCount = count.get(s.section_id) || 0;
    const capacityPct = Math.min(100, Math.round((movementCount / maxCount) * 100));
    return {
      id: s.section_id,
      section: `${s.origin_station || "—"} – ${s.destination_station || "—"}`,
      code: s.section_id,
      trains: movementCount,
      capacityPct,
      colorClass: capacityPct >= 80 ? "red" : capacityPct >= 60 ? "orange" : "green",
      status: capacityPct >= 80 ? "High Load" : capacityPct >= 60 ? "Moderate" : "Normal",
    };
  });
}

function mapResources(resources, sections) {
  const crews = resources.filter((r) => String(r.resource_type).toLowerCase() === "crew").slice(0, 12).map((r) => ({
    id: r.resource_id,
    name: r.skill_or_item || "Maintenance Crew",
    initials: (r.skill_or_item || "MC").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
    role: r.department || "Engineering",
    depot: r.depot_id || "Jharkhand Depot",
    division: String(r?.geo?.division || "all").toLowerCase(),
    status: r.status || "Available",
    statusCode: String(r.status || "available").toLowerCase() === "available" ? "available" : "deployed",
    currentAssignment: r.section_id || "Standby",
  }));
  const machines = resources.filter((r) => String(r.resource_type).toLowerCase() === "machine").slice(0, 12).map((r) => ({
    id: r.resource_id,
    code: `${r.skill_or_item || "Machine"} (${r.resource_id})`,
    type: r.skill_or_item || "Railway Machine",
    division: String(r?.geo?.division || "all").toLowerCase(),
    status: r.status || "Available",
    statusCode: String(r.status || "available").toLowerCase() === "available" ? "available" : "deployed",
    readiness: r.is_usable ? 95 : 55,
    iconClass: "fa-solid fa-gears",
  }));
  const materials = resources.filter((r) => String(r.resource_type).toLowerCase() === "material").slice(0, 12).map((r) => ({
    id: r.resource_id,
    material: r.skill_or_item || "Maintenance Material",
    availableStock: String(r.quantity ?? 0),
    unit: "Units",
    threshold: "Operational requirement",
    status: r.status === "Available" ? "Adequate" : r.status || "Check",
    statusCode: r.status === "Available" ? "adequate" : "low",
    iconClass: "fa-solid fa-boxes-stacked",
  }));
  const sectionRows = sections.slice(0, 10).map((s) => ({
    id: s.section_id,
    code: s.section_id,
    section: `${s.origin_station || "—"} – ${s.destination_station || "—"}`,
    division: String(s.division || "all").toLowerCase(),
    crews: resources.filter((r) => r.section_id === s.section_id && r.resource_type === "Crew" && r.status === "Available").length,
    machines: resources.filter((r) => r.section_id === s.section_id && r.resource_type === "Machine" && r.status === "Available").length,
    materials: resources.filter((r) => r.section_id === s.section_id && r.resource_type === "Material" && r.status === "Available").length,
    readiness: Math.round((resources.filter((r) => r.section_id === s.section_id && r.status === "Available").length / Math.max(1, resources.filter((r) => r.section_id === s.section_id).length)) * 100),
  }));
  const byDepot = new Map();
  resources.forEach((r) => {
    const key = r.depot_id || "Jharkhand Depot";
    const row = byDepot.get(key) || { total: 0, available: 0, division: String(r?.geo?.division || "all").toLowerCase() };
    row.total += 1;
    if (r.status === "Available") row.available += 1;
    byDepot.set(key, row);
  });
  const depots = [...byDepot.entries()].slice(0, 8).map(([name, row], i) => ({
    id: `depot-${i}`,
    name,
    division: row.division,
    readiness: Math.round((row.available / Math.max(1, row.total)) * 100),
    people: Math.round((row.available / Math.max(1, row.total)) * 100),
    machines: Math.round((row.available / Math.max(1, row.total)) * 100),
    materials: Math.round((row.available / Math.max(1, row.total)) * 100),
  }));
  return { crews, machines, materials, sections: sectionRows, depots };
}

function mapAlert(a) {
  const stamp = asDate(a.timestamp) || new Date();
  const sev = a.severity || "Medium";
  return {
    id: a.alert_id,
    type: sev,
    title: a.title || a.alert_type || "Operational alert",
    desc: a.message || "ThinkSync generated alert",
    riskScore: sev === "Critical" ? 90 : sev === "High" ? 75 : sev === "Medium" ? 55 : 35,
    category: String(a.alert_type || "operations").toLowerCase().includes("resource") ? "resources" : "operations",
    division: "all",
    sectionId: a.section_id || "Network",
    sectionName: a.section_id || "Jharkhand network",
    relatedTo: a.source_id || a.alert_id,
    raisedDate: stamp.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    raisedTime: stamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    status: "Open",
    checked: false,
  };
}

function mapBlocks(blocks) {
  return blocks.slice(0, 35).map((b, idx) => {
    const start = asDate(b.block_start) || new Date();
    const duration = Number(b.planned_duration_min || 0);
    const end = new Date(start.getTime() + duration * 60000);
    const dept = (b.departments || ["Engineering"])[0] || "Engineering";
    return {
      id: b.block_id,
      code: b.section_id,
      section: [b?.geo?.origin_station, b?.geo?.destination_station].filter(Boolean).join(" – ") || b.section_id,
      locationDetail: b?.geo?.district_corridor || b.section_id,
      dayIndex: idx % 7,
      slotIndex: Math.min(5, Math.floor(start.getHours() / 4)),
      time: `${fmtTime(start)} – ${fmtTime(end)}`,
      duration: `${Math.round(duration / 6) / 10} hrs`,
      dateFormatted: fmtDate(start),
      dateKey: start.toISOString().slice(0, 10),
      startTimestamp: start.toISOString(),
      endTimestamp: end.toISOString(),
      department: dept,
      deptClass: String(dept).toLowerCase().replace(/[^a-z]/g, "") || "engineering",
      deptBadge: dept,
      status: b.block_outcome || "Completed",
      sectionLength: b.section_id,
      workDescription: `${b.block_type || "Maintenance Block"}; ${b.tasks_count || 0} maintenance task(s).`,
      relatedTasks: b.tasks_count || 0,
      resourcePlan: `${b.resource_readiness_pct ?? "—"}% resource readiness`,
      aiSuggestion: b.overrun_flag ? `Historical overrun: ${b.overrun_min ?? 0} min. Treat as higher-risk window.` : "Historical block completed without flagged overrun.",
      isConflict: Number(b.train_conflicts || 0) > 2,
    };
  });
}

function mapReports(weekly, monthly) {
  const total = weekly?.tasks?.total || 0;
  const overdue = weekly?.tasks?.overdue || 0;
  const available = weekly?.resources?.available || 0;
  const resourceTotal = weekly?.resources?.total || 0;
  const readiness = Math.round(Number(weekly?.resources?.readiness_pct || 0));
  const overrunRate = weekly?.blocks?.total ? Math.round((weekly.blocks.overruns / weekly.blocks.total) * 100) : 0;
  return {
    kpis: [
      { id: "kpi-tasks", label: "Weekly Maintenance Tasks", value: String(total), iconClass: "fa-solid fa-list-check", iconTheme: "red", trendVal: `${overdue} overdue`, trendDirection: overdue ? "up" : "down", subtext: "Live MongoDB report" },
      { id: "kpi-completed", label: "Non-Overdue Tasks", value: String(Math.max(0, total - overdue)), iconClass: "fa-solid fa-circle-check", iconTheme: "green", trendVal: `${total ? Math.round(((total-overdue)/total)*100) : 0}%`, trendDirection: "up", subtext: "Within due window" },
      { id: "kpi-downtime", label: "Blocks / Avg Overrun", value: `${weekly?.blocks?.total || 0}`, iconClass: "fa-solid fa-clock", iconTheme: "blue", trendVal: `${weekly?.blocks?.avg_overrun_min ?? 0} min`, trendDirection: "down", subtext: "Historical execution" },
      { id: "kpi-trains", label: "Train Movements", value: String(weekly?.traffic?.total || 0), iconClass: "fa-solid fa-train", iconTheme: "blue", trendVal: `${weekly?.traffic?.avg_delay_min ?? 0} min avg`, trendDirection: "down", subtext: "Observed in period" },
      { id: "kpi-savings", label: "Resource Readiness", value: `${readiness}%`, iconClass: "fa-solid fa-chart-line", iconTheme: "purple", trendVal: `${available}/${resourceTotal} available`, trendDirection: "up", subtext: "Current readiness" },
    ],
    weeklyPlan: [
      { week: "Current Week", completed: Math.max(0, total-overdue), scheduled: total, pending: overdue, completionPct: total ? Math.round(((total-overdue)/total)*100) : 0 },
    ],
    monthlyTrend: [
      { month: "30 Days", planned: monthly?.tasks?.total || 0, completed: Math.max(0, (monthly?.tasks?.total || 0) - (monthly?.tasks?.overdue || 0)), completionPct: monthly?.tasks?.total ? Math.round((((monthly.tasks.total || 0)-(monthly.tasks.overdue || 0))/monthly.tasks.total)*100) : 0 },
    ],
    kpiDonuts: [
      { id: "gauge-completion", label: "Tasks Within Due Window", pct: total ? Math.round(((total-overdue)/total)*100) : 0, strokeColor: "#10B981", trendText: `${overdue} overdue`, trendColor: "#059669" },
      { id: "gauge-utilization", label: "Resource Readiness", pct: readiness, strokeColor: "#2563EB", trendText: `${available}/${resourceTotal} available`, trendColor: "#059669" },
      { id: "gauge-delays", label: "Block Overrun Rate", pct: overrunRate, strokeColor: "#F59E0B", trendText: `${weekly?.blocks?.overruns || 0} overruns`, trendColor: "#059669" },
      { id: "gauge-ontime", label: "Operational Readiness", pct: Math.max(0, 100-overrunRate), strokeColor: "#8B5CF6", trendText: "Derived from block history", trendColor: "#059669" },
    ],
  };
}

function updateDashboardDom(summary, sections, movements) {
  const set = (id, value, subtext) => {
    const card = document.querySelector(`.kpi-card[data-kpi="${id}"]`);
    if (!card) return;
    const number = card.querySelector(".kpi-number");
    const sub = card.querySelector(".kpi-subtext");
    if (number) number.textContent = value;
    if (sub && subtext) sub.textContent = subtext;
  };
  set("sections", sections.length, "Live Jharkhand sections from MongoDB");
  set("tasks", summary?.tasks?.total_open ?? 0, `${summary?.tasks?.overdue_count ?? 0} overdue`);
  set("blocks", summary?.blocks?.total_blocks ?? 0, `${summary?.blocks?.overrun_count ?? 0} historical overruns`);
  set("trains", summary?.traffic?.total_movements ?? 0, "Recorded train movements");
  set("resources", `${Math.round(Number(summary?.resources?.readiness_pct || 0))}%`, `${summary?.resources?.total ?? 0} tracked resources`);
  const body = document.getElementById("trains-table-body");
  if (body && movements.length) {
    body.innerHTML = movements.slice(0, 5).map((m) => {
      const delay = Number(m.delay_minutes || 0);
      const route = [m?.geo?.origin_station, m?.geo?.destination_station].filter(Boolean).join(" → ") || m.section_id;
      return `<tr data-train="${m.train_id || m.movement_id}"><td class="font-mono" style="font-weight:700;">${m.train_id || m.movement_id}</td><td>${m.train_type || m.train_category || "Train"}</td><td>${route}</td><td><span class="badge ${delay > 5 ? "badge-danger-pill" : "badge-success-pill"}"><span class="dot ${delay > 5 ? "critical" : "good"}"></span>${delay > 5 ? `Delayed (${delay} min)` : "On Time"}</span></td><td class="font-mono" style="font-weight:600;">${fmtTime(m.scheduled_exit)}</td></tr>`;
    }).join("");
  }
}

async function hydrateDashboard() {
  const [summary, sections, movements] = await Promise.all([API.getDashboard(), API.getSections(), API.getTraffic("", 10)]);
  await waitFor(() => document.querySelector('.kpi-card[data-kpi="tasks"]'));
  updateDashboardDom(summary, sections, movements);
}

async function hydrateTasks() {
  const data = await API.getTasks("", 100);
  const setter = await waitFor(() => window.setTasksData);
  if (setter) setter(data.map(mapTask));
}

async function hydrateMovements() {
  const [movements, sections] = await Promise.all([API.getTraffic("", 100), API.getSections()]);
  const setter = await waitFor(() => window.updateMovementsData);
  if (setter) setter({ trains: movements.map(mapMovement), sections: mapCongestion(sections, movements) });
}

async function hydrateResources() {
  const [resources, sections] = await Promise.all([API.getResources("", 500), API.getSections()]);
  const setter = await waitFor(() => window.setResourcesData);
  if (setter) setter(mapResources(resources, sections));
}

async function hydrateHealthMap() {
  const data = await API.getHealthMap();
  const setter = await waitFor(() => window.setHealthMapData);
  if (setter) setter(data);
}

async function hydrateAlerts() {
  const data = await API.getAlerts("", 50);
  const setter = await waitFor(() => window.setAlertsData);
  if (setter) setter({ alerts: data.map(mapAlert) });
}

async function hydrateReports() {
  const [weekly, monthly] = await Promise.all([API.getWeeklyReports(), API.getMonthlyReports()]);
  const setter = await waitFor(() => window.setReportsData);
  if (setter) setter(mapReports(weekly, monthly));
}

async function hydrateCalendar() {
  const data = await API.getBlocks("", 100);
  const setter = await waitFor(() => window.setCalendarBlocks);
  if (setter) setter(mapBlocks(data));
}

export async function bootLiveDataBridge(pathname = window.location.pathname) {
  window.ThinkSyncAPI = API;
  try {
    const health = await API.getHealth();
    window.__THINKSYNC_BACKEND_HEALTH__ = health;
  } catch (error) {
    console.warn("ThinkSync backend is not reachable; preserved frontend data remains visible.", error);
    return;
  }

  const route = pathname.replace(/\.html$/, "");
  try {
    if (route === "" || route === "/" || route === "/index") await hydrateDashboard();
    else if (route === "/tasks") await hydrateTasks();
    else if (route === "/movements") await hydrateMovements();
    else if (route === "/resources") await hydrateResources();
    else if (route === "/map") await hydrateHealthMap();
    else if (route === "/alerts") await hydrateAlerts();
    else if (route === "/reports") await hydrateReports();
    else if (route === "/calendar") await hydrateCalendar();
  } catch (error) {
    console.error("ThinkSync live-data hydration failed:", error);
  }
}
