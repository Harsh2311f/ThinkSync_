import useLegacyPage from "../hooks/useLegacyPage.js";

function Alerts() {
  useLegacyPage({
    title: "Alerts | ThinkSync",
    stylesheet: "/legacy/alerts.css",
    script: "/legacy/alerts.js",
  });

  return (
    <>
  
  {/* ========================================================================== */}
  {/* MAIN APPLICATION LAYOUT WRAPPER                                            */}
  {/* ========================================================================== */}
  <div className="app-layout">
    
    {/* ======================================================================== */}
    {/* 1. LEFT SIDEBAR NAVIGATION                                               */}
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
        <a href="/" className="nav-item" data-tab="dashboard" data-tooltip="Dashboard">
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
          <i className="fa-solid fa-chart-column"></i>
          <span className="nav-label">Reports</span>
        </a>
        <a href="/alerts" className="nav-item active" data-tab="alerts" data-tooltip="Alerts">
          <i className="fa-solid fa-bell"></i>
          <span className="nav-label">Alerts</span>
        </a>
        <a href="/settings" className="nav-item" data-tab="settings" data-tooltip="Settings">
          <i className="fa-solid fa-gear"></i>
          <span className="nav-label">Settings</span>
        </a>
      </nav>

      {/* 1.3 Bottom Train Branding Card */}
      <div className="sidebar-train-card" id="sidebar-train-card"></div>
      
    </aside>

    {/* ======================================================================== */}
    {/* 2. MAIN WORKSPACE WRAPPER                                                */}
    {/* ======================================================================== */}
    <div className="main-wrapper">
      
      {/* 2.1 TOP HEADER BAR */}
      <header className="top-header">
        <div className="header-left"></div>

        <div className="header-right">
          {/* Search Box */}
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="global-search" placeholder="Search alerts, defects, sections..." autoComplete="off" />
            <div className="search-results-dropdown" id="search-dropdown"></div>
          </div>

          {/* Notification Bell */}
          <div className="notification-wrapper">
            <button className="icon-btn" id="notif-btn" aria-label="View System Notifications">
              <i className="fa-solid fa-bell"></i>
              <span className="notif-badge" id="header-notif-badge"></span>
            </button>
            <div className="notif-dropdown" id="notif-dropdown">
              <div className="notif-header">
                <h3>System Notifications</h3>
                <span className="badge badge-danger" id="notif-dropdown-count"></span>
              </div>
              <div className="notif-list" id="notif-list-container"></div>
              <div className="notif-footer">
                <a href="#all-activity" id="view-all-notifs">View All Alerts &rarr;</a>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="user-profile" id="user-profile-container"></div>
        </div>
      </header>

      {/* 2.2 ALERTS CONTENT CANVAS (100% Data-Driven Architecture) */}
      <main className="alerts-page-main" id="alerts-page-main">
        
        {/* SUBHEADER TOOLBAR: Page Title, Subtitle, Auto-Refresh Toggle & Export Button */}
        <section className="alerts-subheader-toolbar" id="alerts-subheader-toolbar">
          <div className="alerts-subheader-left">
            <div className="alerts-icon-badge">
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="alerts-title-wrap">
              <h2 className="alerts-title">Alerts</h2>
              <p className="alerts-subtitle">Real-time insights, early warnings and AI-driven alerts for safer, uninterrupted railway operations.</p>
            </div>
          </div>
          
          <div className="alerts-subheader-controls">
            {/* Auto-Refresh Control */}
            <div className="auto-refresh-wrap">
              <div className="auto-refresh-toggle-row">
                <span className="refresh-indicator-dot"></span>
                <span className="auto-refresh-label">Auto Refresh</span>
                <label className="switch-toggle" aria-label="Toggle live auto-refresh">
                  <input type="checkbox" id="auto-refresh-toggle" checked />
                  <span className="slider-round"></span>
                </label>
              </div>
              <span className="auto-refresh-subtext" id="last-updated-text">Last updated: 12 Sep 2026, 10:24 AM</span>
            </div>

            {/* Export Alerts Action Button */}
            <div className="export-dropdown-wrapper">
              <button type="button" className="btn-export-dropdown" id="btn-export-alerts" aria-expanded="false" aria-haspopup="true">
                Export Alerts <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.68rem", marginLeft: "4px" }}></i>
              </button>
              <div className="export-menu-dropdown" id="export-menu-dropdown">
                <a href="#export-pdf" id="menu-export-pdf"><i className="fa-solid fa-file-pdf" style={{ color: "#EF4444" }}></i> Export as PDF</a>
                <a href="#export-csv" id="menu-export-csv"><i className="fa-solid fa-file-csv" style={{ color: "#10B981" }}></i> Export as CSV</a>
                <a href="#export-excel" id="menu-export-excel"><i className="fa-solid fa-file-excel" style={{ color: "#2563EB" }}></i> Export as Excel</a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* ROW 1: TOP 6 KPI SUMMARY METRIC CARDS                                 */}
        {/* Critical, High, Medium, Low, Overdue Defects, Resource Shortages      */}
        {/* ==================================================================== */}
        <section className="alerts-kpi-grid" id="alerts-kpi-container">
          {/* Populated dynamically by renderAlertsKpis() in alerts.js */}
        </section>

        {/* ==================================================================== */}
        {/* ROW 2: MAIN ALERTS TABLE & RIGHT MONITORING CARDS (2-COLUMN GRID)     */}
        {/* Left (approx 75%): Main Alerts Table with Tabs and Dropdown Filters   */}
        {/* Right (approx 25%): Overdue Defects & Shortage Warnings Stacked Cards  */}
        {/* ==================================================================== */}
        <section className="alerts-row2-grid">
          
          {/* Left Main Alerts Table Card */}
          <div className="dashboard-card alerts-main-card" id="card-main-alerts">
            
            {/* Table Toolbar: Priority Tabs (Left) + Dropdown Selectors (Right) */}
            <div className="alerts-table-toolbar">
              {/* Priority Filter Tabs */}
              <div className="alerts-tabs-row" id="alerts-tabs-container">
                {/* Populated dynamically by renderTableTabs() in alerts.js */}
              </div>

              {/* Filter Dropdowns */}
              <div className="alerts-filter-dropdowns">
                <div className="alerts-filter-select-wrap">
                  <select id="alert-category-filter" aria-label="Filter by Category">
                    <option value="all" selected>All Categories</option>
                    <option value="track">Track &amp; Infrastructure</option>
                    <option value="resources">Resources</option>
                    <option value="operations">Operations</option>
                    <option value="weather">Weather &amp; External</option>
                    <option value="signals">Signals &amp; Telecom</option>
                  </select>
                </div>

                <div className="alerts-filter-select-wrap">
                  <select id="alert-division-filter" aria-label="Filter by Division">
                    <option value="all" selected>All Divisions</option>
                    <option value="dhanbad">Dhanbad Division</option>
                    <option value="ranchi">Ranchi Division</option>
                    <option value="chakradharpur">Chakradharpur Division</option>
                  </select>
                </div>

                <div className="alerts-filter-select-wrap">
                  <select id="alert-status-filter" aria-label="Filter by Status">
                    <option value="all" selected>All Status</option>
                    <option value="Open">Open</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="alerts-filter-select-wrap">
                  <i className="fa-regular fa-calendar select-filter-icon"></i>
                  <select id="alert-timeframe-filter" aria-label="Filter by Timeframe">
                    <option value="7d" selected>Last 7 Days</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky Scrollable Alerts Table Container */}
            <div className="alerts-table-viewport-wrapper">
              <table className="alerts-data-table" id="alerts-data-table">
                <thead>
                  <tr>
                    <th style={{ width: "38px", textAlign: "center" }}>
                      <input type="checkbox" id="select-all-alerts" aria-label="Select all alerts" />
                    </th>
                    <th style={{ width: "130px" }}>Alert ID</th>
                    <th style={{ width: "105px" }}>Type</th>
                    <th style={{ minWidth: "240px" }}>Title &amp; Description</th>
                    <th style={{ width: "165px" }}>Location / Section</th>
                    <th style={{ width: "135px" }}>Related To</th>
                    <th style={{ width: "125px" }}>Raised On</th>
                    <th style={{ width: "115px" }}>Status</th>
                    <th style={{ width: "85px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody id="alerts-tbody">
                  {/* Populated dynamically by renderAlertsTable() in alerts.js */}
                </tbody>
              </table>

              {/* Empty State Placeholder (when 0 records match search or filters) */}
              <div className="alerts-empty-state" id="alerts-empty-state" style={{ display: "none" }}>
                <i className="fa-solid fa-shield-halved empty-icon"></i>
                <h4 className="empty-title">No Alerts Found</h4>
                <p className="empty-desc">No telemetry alerts match your active filter criteria.</p>
                <button type="button" className="btn-clear-filters" id="btn-clear-filters">Reset All Filters</button>
              </div>
            </div>

          </div>{/* End .alerts-main-card */}

          {/* Right Column: Overdue Defects & Shortage Warnings Stacked */}
          <div className="alerts-side-column">
            
            {/* Side Card 1: Overdue Defects */}
            <div className="dashboard-card alerts-side-card" id="card-overdue-defects">
              {/* Populated dynamically by renderOverdueDefects() in alerts.js */}
            </div>

            {/* Side Card 2: Shortage Warnings */}
            <div className="dashboard-card alerts-side-card" id="card-shortage-warnings">
              {/* Populated dynamically by renderShortageWarnings() in alerts.js */}
            </div>

          </div>{/* End .alerts-side-column */}

        </section>

        {/* ==================================================================== */}
        {/* ROW 3: ANALYTICS & ACTIVITY FEED (4-COLUMN GRID)                     */}
        {/* Col 1: Alerts by Category (Multi-Segment Donut Chart)                */}
        {/* Col 2: Alert Status (Multi-Segment Donut Chart)                      */}
        {/* Col 3: Alerts Trend (7-Day Multi-Line SVG Trend Chart)               */}
        {/* Col 4: Recent Activity / Notifications (Chronological Event Feed)    */}
        {/* ==================================================================== */}
        <section className="alerts-row3-grid">
          
          {/* Col 1: Alerts by Category */}
          <div className="dashboard-card alerts-bottom-card" id="card-alerts-category">
            {/* Populated dynamically by renderCategoryDonut() in alerts.js */}
          </div>

          {/* Col 2: Alert Status */}
          <div className="dashboard-card alerts-bottom-card" id="card-alert-status">
            {/* Populated dynamically by renderStatusDonut() in alerts.js */}
          </div>

          {/* Col 3: Alerts Trend */}
          <div className="dashboard-card alerts-bottom-card" id="card-alerts-trend">
            {/* Populated dynamically by renderAlertsTrendChart() in alerts.js */}
          </div>

          {/* Col 4: Recent Activity / Notifications */}
          <div className="dashboard-card alerts-bottom-card" id="card-recent-activity">
            {/* Populated dynamically by renderRecentActivity() in alerts.js */}
          </div>

        </section>

      </main>

      {/* 2.3 APPLICATION FOOTER */}
      <footer className="bottom-footer" id="app-bottom-footer">
        <div className="footer-quote" id="footer-quote-container"></div>
        <div className="footer-links" id="footer-links-container"></div>
      </footer>

    </div>{/* End .main-wrapper */}

  </div>{/* End .app-layout */}

  {/* ========================================================================== */}
  {/* 3. INTERACTIVE MODAL DIALOGS                                               */}
  {/* ========================================================================== */}

  {/* 3.1 Alert Deep-Dive & Action Modal Dialog */}
  <div className="alerts-modal-overlay" id="alert-detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-alert-title">
    <div className="alerts-modal-dialog">
      <div className="alerts-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon red-theme" id="modal-alert-badge-icon">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h3 className="alerts-modal-title" id="modal-alert-title">Alert Details &amp; Operational Telemetry</h3>
            <p className="alerts-modal-subtitle" id="modal-alert-subtitle">Detailed risk breakdown and mitigation control</p>
          </div>
        </div>
        <button className="alerts-modal-close-btn" id="modal-alert-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <div className="alerts-modal-body" id="modal-alert-body">
        {/* Injected dynamically when user clicks 'View' on any alert row */}
      </div>
    </div>
  </div>

  {/* 3.2 Export Alerts Modal Dialog */}
  <div className="alerts-modal-overlay" id="export-alerts-modal" role="dialog" aria-modal="true" aria-labelledby="modal-export-title">
    <div className="alerts-modal-dialog" style={{ maxWidth: "480px" }}>
      <div className="alerts-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon blue-theme">
            <i className="fa-solid fa-file-export"></i>
          </div>
          <div>
            <h3 className="alerts-modal-title" id="modal-export-title">Export Alerts Telemetry</h3>
            <p className="alerts-modal-subtitle">Download filtered records for division review</p>
          </div>
        </div>
        <button className="alerts-modal-close-btn" id="modal-export-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <form className="alerts-modal-body" id="export-alerts-form">
        <div className="form-group" style={{ marginBottom: "0.85rem" }}>
          <label className="form-label" htmlFor="export-format-choice">Export Format *</label>
          <select id="export-format-choice" className="form-control" style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #CBD5E1" }}>
            <option value="PDF">Adobe Acrobat Document (.pdf)</option>
            <option value="CSV">Comma Separated Values (.csv)</option>
            <option value="Excel">Microsoft Excel Workbook (.xlsx)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="export-scope-choice">Records Scope</label>
          <select id="export-scope-choice" className="form-control" style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #CBD5E1" }}>
            <option value="active">Active Filtered Records Only</option>
            <option value="all">All 64 Alerts in Network</option>
            <option value="critical">Critical &amp; High Priority Only</option>
          </select>
        </div>

        <div className="alerts-modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem" }}>
          <button type="button" className="btn btn-secondary" id="modal-export-cancel-btn" style={{ padding: "0.45rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer" }}>Cancel</button>
          <button type="submit" className="btn btn-primary" id="modal-export-submit-btn" style={{ padding: "0.45rem 1rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "#FFFFFF", fontWeight: "700", cursor: "pointer" }}>
            <i className="fa-solid fa-download"></i> Download Export
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* Toast Notification Container */}
  <div className="toast-container" id="toast-container"></div>

  {/* Dynamic Application Engine */}
    </>
  );
}

export default Alerts;
