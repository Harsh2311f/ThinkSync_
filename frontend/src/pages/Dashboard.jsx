import useLegacyPage from "../hooks/useLegacyPage.js";

function Dashboard() {
  useLegacyPage({
    title: "ThinkSync Dashboard",
    stylesheet: null,
    script: "/legacy/script.js",
  });

  return (
    <>
  
  {/* ========================================================================== */}
  {/* MAIN APPLICATION LAYOUT WRAPPER                                            */}
  {/* Splits screen into Left Sidebar and Right Main Content Area                */}
  {/* ========================================================================== */}
  <div className="app-layout">
    
    {/* ======================================================================== */}
    {/* 1. LEFT SIDEBAR NAVIGATION                                               */}
    {/* Contains Brand Logo, Navigation Tabs, and Bottom Indian Railways Card     */}
    {/* All navigation and bottom card data is managed via JavaScript/CSS        */}
    {/* ======================================================================== */}
    <aside className="sidebar" id="sidebar">
      
      {/* 1.1 Sidebar Header: Hamburger Show & Hide Toggle Button */}
      <div className="sidebar-header-toggle" id="sidebar-header-toggle">
        <button className="sidebar-toggle-btn" id="sidebar-toggle-btn" aria-label="Toggle Navigation Sidebar" title="Show / Hide Sidebar">
          <i className="fa-solid fa-bars"></i>
        </button>
        <span className="sidebar-toggle-label">Navigation</span>
      </div>

      {/* 1.2 Navigation Menu Links */}
      <nav className="sidebar-nav" id="sidebar-nav-container" aria-label="Main navigation">
        <a href="/" className="nav-item active" data-tab="dashboard" data-tooltip="Dashboard">
          <i className="fa-solid fa-house"></i>
          <span className="nav-label">Dashboard</span>
        </a>
        <a href="/map" className="nav-item" data-tab="map" data-tooltip="Railway Health Map">
          <i className="fa-solid fa-location-dot"></i>
          <span className="nav-label">Railway Health Map</span>
        </a>
        <a href="/calendar" className="nav-item" data-tab="calendar" data-tooltip="Block Calendar">
          <i className="fa-solid fa-calendar-days"></i>
          <span className="nav-label">Block Calendar</span>
        </a>
        <a href="/tasks" className="nav-item" data-tab="tasks" data-tooltip="Maintenance Tasks">
          <i className="fa-solid fa-clipboard-list"></i>
          <span className="nav-label">Maintenance Tasks</span>
        </a>
        <a href="/movements" className="nav-item" data-tab="movements" data-tooltip="Train Movements">
          <i className="fa-solid fa-train"></i>
          <span className="nav-label">Train Movements</span>
        </a>
        <a href="/resources" className="nav-item" data-tab="resources" data-tooltip="Resources">
          <i className="fa-solid fa-network-wired"></i>
          <span className="nav-label">Resources</span>
        </a>
        <a href="/optimization" className="nav-item" data-tab="optimization" data-tooltip="Optimization">
          <i className="fa-solid fa-chart-line"></i>
          <span className="nav-label">Optimization</span>
        </a>
        <a href="/reports" className="nav-item" data-tab="reports" data-tooltip="Reports">
          <i className="fa-solid fa-file-lines"></i>
          <span className="nav-label">Reports</span>
        </a>
        <a href="/alerts" className="nav-item" data-tab="alerts" data-tooltip="Alerts">
          <i className="fa-solid fa-bell"></i>
          <span className="nav-label">Alerts</span>
        </a>
        <a href="/settings" className="nav-item" data-tab="settings" data-tooltip="Settings">
          <i className="fa-solid fa-gear"></i>
          <span className="nav-label">Settings</span>
        </a>
      </nav>

      {/* 1.3 Bottom Train Card (Indian Railways Image, Slogan & National Flag) */}
      {/* Purpose: Injected dynamically by renderSidebarAndFooter() in script.js */}
      <div className="sidebar-train-card" id="sidebar-train-card">
        {/* Dynamic content: Train background image, 'Better Planning Safer Journeys' and Indian Flag */}
      </div>
      
    </aside>

    {/* ======================================================================== */}
    {/* 2. MAIN WORKSPACE WRAPPER (Top Header + Dashboard Grid + Footer)         */}
    {/* ======================================================================== */}
    <div className="main-wrapper">
      
      {/* ====================================================================== */}
      {/* 2.1 TOP HEADER BAR                                                     */}
      {/* Displays division mission statement, live search, notifications, & user*/}
      {/* ====================================================================== */}
      <header className="top-header">
        
        {/* Header Left */}
        <div className="header-left"></div>

        {/* Header Right: Search, Notifications, Profile */}
        <div className="header-right">
          
          {/* Live Interactive Search Box */}
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="global-search" placeholder="Search section, station, train, task..." autoComplete="off" />
            {/* Search dropdown suggestions container populated by JavaScript */}
            <div className="search-results-dropdown" id="search-dropdown"></div>
          </div>

          {/* Notification Bell with Counter Badge */}
          <div className="notification-wrapper">
            <button className="icon-btn" id="notif-btn" aria-label="View System Notifications">
              <i className="fa-solid fa-bell"></i>
              {/* Notification counter badge populated dynamically by JS */}
              <span className="notif-badge" id="header-notif-badge"></span>
            </button>
            
            {/* Notification Dropdown Panel */}
            <div className="notif-dropdown" id="notif-dropdown">
              <div className="notif-header">
                <h3>System Notifications</h3>
                <span className="badge badge-danger" id="notif-dropdown-count"></span>
              </div>
              {/* Notification items injected by JavaScript */}
              <div className="notif-list" id="notif-list-container"></div>
              <div className="notif-footer">
                <a href="/alerts" id="view-all-notifs">View All Alerts &rarr;</a>
              </div>
            </div>
          </div>

          {/* User Profile Badge: Injected dynamically by renderUserProfile() in script.js */}
          <div className="user-profile" id="user-profile-container">
            {/* Dynamic avatar, user name, role, and dropdown arrow */}
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 2.2 DASHBOARD CONTENT CANVAS                                           */}
      {/* No data is hardcoded here. Every container is populated by JavaScript! */}
      {/* When data is not available, it displays 'Not Found' gracefully         */}
      {/* ====================================================================== */}
      <main className="dashboard-content" id="dashboard-content">
        
        {/* ==================================================================== */}
        {/* ROW 1: TOP 6 KPI METRIC CARDS                                        */}
        {/* Container for Total Sections, Pending Tasks, Blocks, Trains Affected, */}
        {/* Resource Utilization, and Carbon Impact                              */}
        {/* Injected dynamically by renderKPICards() in script.js                 */}
        {/* ==================================================================== */}
        <section className="kpi-grid" id="kpi-grid-container">
          {/* 6 Metric Cards injected via JavaScript (or 'Not Found' fallback) */}
        </section>

        {/* ==================================================================== */}
        {/* ROW 2: MIDDLE SECTION (3 MAIN COLUMNS)                               */}
        {/* Col 1: Jharkhand Railway Network Live Health Map (Coming Soon)       */}
        {/* Col 2: Critical Alerts                                               */}
        {/* Col 3: Executive Summary & AI Plan Suggestions                       */}
        {/* ==================================================================== */}
        <section className="middle-layout">
          
          {/* ------------------------------------------------------------------ */}
          {/* MIDDLE COL 1: LIVE RAILWAY HEALTH MAP WIDGET (COMING SOON)         */}
          {/* Map removed per user request: Displays professional 'Coming Soon'  */}
          {/* Injected dynamically by renderRailwayMap() in script.js            */}
          {/* ------------------------------------------------------------------ */}
          <div className="card map-widget">
            <div className="card-header">
              <div className="card-title-group">
                <h2 className="card-title">Jharkhand Railway Network &ndash; Live Health Map</h2>
                <span className="badge badge-warning" id="map-status-pill">
                  <i className="fa-solid fa-clock"></i> Coming Soon
                </span>
                {/* Telemetry integration status updated by JS */}
                <span className="timestamp" id="map-timestamp">Telemetry Module Under Deployment</span>
              </div>
              <div className="card-actions">
                <button className="icon-btn-sm" id="notify-map-btn" title="Get Notified Upon Release">
                  <i className="fa-solid fa-bell"></i>
                </button>
              </div>
            </div>

            {/* Status ribbon banner: Populated dynamically by JS */}
            <div className="map-legend" id="map-legend-container"></div>

            {/* Coming Soon Container: Populated dynamically by renderRailwayMap() */}
            <div className="map-viewport" id="map-viewport">
              {/* 'Coming Soon' graphic and description rendered via JavaScript */}
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* MIDDLE COL 2: CRITICAL ALERTS WIDGET                               */}
          {/* Displays high risk sections, machine shortages, replanning triggers*/}
          {/* Populated dynamically by renderCriticalAlerts() in script.js       */}
          {/* Shows 'Not Found' if no alert data is available                    */}
          {/* ------------------------------------------------------------------ */}
          <div className="card alerts-widget">
            <div className="card-header">
              <h2 className="card-title">Critical Alerts</h2>
              <a href="/alerts" className="view-all-link">View All <i className="fa-solid fa-arrow-right"></i></a>
            </div>

            {/* Dynamic Alerts List Container */}
            <div className="alerts-list" id="critical-alerts-container">
              {/* Alert cards injected dynamically by JavaScript */}
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* MIDDLE COL 3: EXECUTIVE SUMMARY & AI PLAN SUGGESTIONS              */}
          {/* Populated dynamically by renderExecutiveSummary() & renderAIPlans()*/}
          {/* Shows 'Not Found' if data is missing without breaking the cards    */}
          {/* ------------------------------------------------------------------ */}
          <div className="right-column-stack">
            
            {/* 3.1 Today's Executive Summary Card */}
            <div className="card summary-card">
              <div className="card-header border-none">
                <h2 className="card-title">Today's Executive Summary</h2>
                {/* Date updated dynamically by live calendar logic in JS */}
                <span className="date-text" id="exec-date"></span>
              </div>

              {/* Status Banner (e.g. Network is Stable) injected by JS */}
              <div className="summary-status-box" id="exec-status-box"></div>

              {/* 4 Mini KPI Badges (Critical, Moderate, Blocks, On-Time) injected by JS */}
              <div className="mini-kpi-grid" id="exec-mini-kpis"></div>
            </div>

            {/* 3.2 AI Plan Suggestions Card (Plan A, Plan B, Plan C) */}
            <div className="card plan-card">
              <div className="card-header">
                <h2 className="card-title">AI Plan Suggestions</h2>
                <a href="/optimization" className="view-all-link">View All <i className="fa-solid fa-arrow-right"></i></a>
              </div>

              {/* 3 Side-by-Side AI Plan Option Cards injected dynamically by JS */}
              <div className="plans-grid" id="ai-plans-container">
                {/* Plan A, Plan B, and Plan C cards rendered via JavaScript */}
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================================== */}
        {/* ROW 3: BOTTOM ROW (3 EQUAL / PROPORTIONAL COLUMNS)                   */}
        {/* Col 1: Maintenance Task Overview (Donut Chart)                       */}
        {/* Col 2: Train Movements (Next 24 Hours Table)                         */}
        {/* Col 3: Optimization Summary (4 KPI Tiles)                            */}
        {/* Shows 'Not Found' for missing data while preserving cards and layout */}
        {/* ==================================================================== */}
        <section className="bottom-layout">
          
          {/* ------------------------------------------------------------------ */}
          {/* BOTTOM COL 1: MAINTENANCE TASK OVERVIEW                            */}
          {/* Visual SVG Donut chart with priority breakdown                     */}
          {/* Injected dynamically by renderTaskDonutChart() in script.js        */}
          {/* ------------------------------------------------------------------ */}
          <div className="card task-overview-card">
            <div className="card-header">
              <h2 className="card-title">Maintenance Task Overview</h2>
              <a href="/tasks" className="view-all-link">View All <i className="fa-solid fa-arrow-right"></i></a>
            </div>

            {/* Dynamic Donut Chart Container (SVG Slices & Legend) */}
            <div className="donut-chart-container" id="donut-chart-container">
              {/* Donut SVG and priority legend injected dynamically via JavaScript */}
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* BOTTOM COL 2: TRAIN MOVEMENTS (NEXT 24 HOURS)                      */}
          {/* Real-time train schedules, routes, status badges, and ETA          */}
          {/* Injected dynamically by renderTrainMovements() in script.js        */}
          {/* ------------------------------------------------------------------ */}
          <div className="card train-movements-card">
            <div className="card-header">
              <h2 className="card-title">Train Movements (Next 24 Hours)</h2>
              <a href="/movements" className="view-all-link">View All <i className="fa-solid fa-arrow-right"></i></a>
            </div>

            <div className="table-responsive">
              <table className="data-table" id="trains-table">
                <thead>
                  <tr>
                    <th>Train No.</th>
                    <th>Type</th>
                    <th>From &rarr; To</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                {/* Table rows generated dynamically by JavaScript */}
                <tbody id="trains-table-body">
                  {/* Injected via JavaScript */}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* BOTTOM COL 3: OPTIMIZATION SUMMARY                                 */}
          {/* 4 Grid tiles: Delay Reduction, Cost Savings, Carbon, Feasibility   */}
          {/* Injected dynamically by renderOptimizationSummary() in script.js   */}
          {/* ------------------------------------------------------------------ */}
          <div className="card optimization-summary-card">
            <div className="card-header">
              <h2 className="card-title">Optimization Summary</h2>
              <a href="/optimization" className="view-all-link">View Details <i className="fa-solid fa-arrow-right"></i></a>
            </div>

            {/* 4 Optimization Tiles injected dynamically by JavaScript */}
            <div className="opt-tiles-grid" id="opt-tiles-container">
              {/* 4 metric tiles injected via JavaScript */}
            </div>
          </div>

        </section>
      </main>

      {/* ====================================================================== */}
      {/* 2.3 BOTTOM FOOTER BANNER                                               */}
      {/* Executive motto and Indian Railways brand partnership statement        */}
      {/* Injected dynamically by renderSidebarAndFooter() in script.js          */}
      {/* ====================================================================== */}
      <footer className="bottom-footer" id="app-bottom-footer">
        <div className="footer-quote" id="footer-quote-container"></div>
        <div className="footer-links" id="footer-links-container"></div>
      </footer>

    </div>
  </div>

  {/* ========================================================================== */}
  {/* 3. INTERACTIVE MODALS & DIALOGS                                            */}
  {/* ========================================================================== */}
  
  {/* 3.1 AI Plan Detail & Execution Modal */}
  <div className="modal-backdrop" id="plan-modal">
    <div className="modal-card">
      <div className="modal-header">
        <div className="modal-title-group">
          <span className="modal-badge" id="modal-plan-badge"></span>
          <h3 className="modal-title" id="modal-plan-title"></h3>
        </div>
        <button className="modal-close" id="modal-close-btn">&times;</button>
      </div>

      <div className="modal-body">
        <div className="modal-metrics-bar">
          <div className="metric-box">
            <span className="m-val" id="m-blocks"></span>
            <span className="m-lbl">Total Maintenance Blocks</span>
          </div>
          <div className="metric-box">
            <span className="m-val" id="m-delay"></span>
            <span className="m-lbl">Avg. Passenger Delay</span>
          </div>
          <div className="metric-box">
            <span className="m-val" id="m-res"></span>
            <span className="m-lbl">Resource Efficiency</span>
          </div>
          <div className="metric-box">
            <span className="m-val" id="m-impact"></span>
            <span className="m-lbl">Overall Network Impact</span>
          </div>
        </div>

        <h4 className="modal-sub-heading">Proposed Schedule &amp; Block Windows</h4>
        <div className="block-timeline-list" id="modal-timeline"></div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" id="modal-cancel-btn">Close</button>
        <button className="btn btn-primary" id="modal-execute-btn">Apply Plan to Division</button>
      </div>
    </div>
  </div>

  {/* 3.2 Toast Notification Container */}
  <div className="toast-container" id="toast-container"></div>

  {/* ========================================================================== */}
  {/* 4. JAVASCRIPT LOGIC ENGINE                                                 */}
  {/* Injects ALL data into the empty containers above & handles interactivity   */}
  {/* ========================================================================== */}
    </>
  );
}

export default Dashboard;
