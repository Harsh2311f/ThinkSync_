import useLegacyPage from "../hooks/useLegacyPage.js";

function Reports() {
  useLegacyPage({
    title: "Reports | ThinkSync",
    stylesheet: "/legacy/reports.css",
    script: "/legacy/reports.js",
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
        <a href="/reports" className="nav-item active" data-tab="reports" data-tooltip="Reports">
          <i className="fa-solid fa-chart-column"></i>
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
            <input type="text" id="global-search" placeholder="Search reports, metrics, departments..." autoComplete="off" />
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
                <a href="/alerts" id="view-all-notifs">View All Alerts &rarr;</a>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="user-profile" id="user-profile-container"></div>
        </div>
      </header>

      {/* 2.2 REPORTS CONTENT CANVAS (100% Data-Driven Architecture) */}
      <main className="reports-page-main" id="reports-page-main">
        
        {/* SUBHEADER TOOLBAR: Page Title, Subtitle, and Filter Controls */}
        <section className="reports-subheader-toolbar" id="reports-subheader-toolbar">
          <div className="reports-subheader-left">
            <div className="reports-icon-badge">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <div className="reports-title-wrap">
              <h2 className="reports-title">Reports</h2>
              <p className="reports-subtitle">Data-driven insights for a safer, stronger railway network.</p>
            </div>
          </div>
          
          <div className="reports-subheader-controls">
            {/* Date Range Selector */}
            <div className="reports-select-wrapper">
              <i className="fa-regular fa-calendar-days select-icon"></i>
              <select id="reports-date-filter" aria-label="Date Range Selector">
                <option value="sep-2026" selected>01 Sep 2026 – 30 Sep 2026</option>
                <option value="aug-2026">01 Aug 2026 – 31 Aug 2026</option>
                <option value="q3-2026">Q3 2026 (Jul – Sep 2026)</option>
                <option value="custom">Custom Date Range...</option>
              </select>
            </div>

            {/* Division Selector */}
            <div className="reports-select-wrapper">
              <select id="reports-division-filter" aria-label="Division Selector">
                <option value="all" selected>All Divisions</option>
                <option value="dhanbad">Dhanbad Division</option>
                <option value="ranchi">Ranchi Division</option>
                <option value="chakradharpur">Chakradharpur Division</option>
              </select>
            </div>

            {/* Generate Report Button */}
            <button type="button" className="btn-generate-report" id="btn-generate-report">
              <i className="fa-solid fa-file-circle-plus"></i> Generate Report
            </button>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* ROW 1: TOP 5 KPI SUMMARY METRIC CARDS                                 */}
        {/* Total Tasks, Completed, Downtime, Trains Affected, Cost Savings      */}
        {/* ==================================================================== */}
        <section className="reports-kpi-grid" id="reports-kpi-container">
          {/* Populated dynamically by renderReportsKpis() in reports.js */}
        </section>

        {/* ==================================================================== */}
        {/* ROW 2: ANALYTICS & TRENDS (3-COLUMN GRID)                            */}
        {/* Col 1: Weekly Maintenance Plan Summary (Mixed Bar + Line Chart)      */}
        {/* Col 2: Monthly Performance Trend (Dual-Axis Chart)                   */}
        {/* Col 3: Key Performance Indicators (4 Circular Donut Gauges)          */}
        {/* ==================================================================== */}
        <section className="reports-row-grid reports-row2-grid">
          
          {/* Col 1: Weekly Maintenance Plan Summary */}
          <div className="dashboard-card reports-card" id="card-weekly-plan">
            {/* Populated dynamically by renderWeeklyPlanChart() in reports.js */}
          </div>

          {/* Col 2: Monthly Performance Trend */}
          <div className="dashboard-card reports-card" id="card-monthly-trend">
            {/* Populated dynamically by renderMonthlyTrendChart() in reports.js */}
          </div>

          {/* Col 3: Key Performance Indicators (KPIs) */}
          <div className="dashboard-card reports-card" id="card-kpi-donuts">
            {/* Populated dynamically by renderKpiDonuts() in reports.js */}
          </div>

        </section>

        {/* ==================================================================== */}
        {/* ROW 3: OPERATIONAL BREAKDOWNS & DOCUMENTS (3-COLUMN GRID)            */}
        {/* Col 1: Department-wise Task Completion (Stacked Progress Bars)       */}
        {/* Col 2: Downtime Trends (Dual Area Curve Chart)                       */}
        {/* Col 3: Recent Report Cards (Downloadable Items List)                 */}
        {/* ==================================================================== */}
        <section className="reports-row-grid reports-row3-grid">
          
          {/* Col 1: Department-wise Task Completion */}
          <div className="dashboard-card reports-card" id="card-dept-completion">
            {/* Populated dynamically by renderDeptCompletion() in reports.js */}
          </div>

          {/* Col 2: Downtime Trends */}
          <div className="dashboard-card reports-card" id="card-downtime-trends">
            {/* Populated dynamically by renderDowntimeTrends() in reports.js */}
          </div>

          {/* Col 3: Recent Report Cards */}
          <div className="dashboard-card reports-card" id="card-recent-reports">
            {/* Populated dynamically by renderRecentReports() in reports.js */}
          </div>

        </section>

        {/* ==================================================================== */}
        {/* ROW 4: BOTTOM INSIGHTS & EXPORT TOOLBAR                              */}
        {/* Left (2/3 width): Historical Insights                                */}
        {/* Right (1/3 width): Export Reports Controls                           */}
        {/* ==================================================================== */}
        <section className="reports-row-grid reports-row4-grid">
          
          {/* Left: Historical Insights Banner */}
          <div className="dashboard-card reports-card" id="card-historical-insights">
            {/* Populated dynamically by renderHistoricalInsights() in reports.js */}
          </div>

          {/* Right: Export Reports Actions */}
          <div className="dashboard-card reports-card" id="card-export-reports">
            {/* Populated dynamically by renderExportSection() in reports.js */}
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

  {/* 3.1 Custom Report Generation Modal Dialog */}
  <div className="reports-modal-overlay" id="generate-report-modal" role="dialog" aria-modal="true" aria-labelledby="modal-gen-title">
    <div className="reports-modal-dialog">
      <div className="reports-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon blue-theme">
            <i className="fa-solid fa-file-waveform"></i>
          </div>
          <div>
            <h3 className="reports-modal-title" id="modal-gen-title">Generate Custom Executive Report</h3>
            <p className="reports-modal-subtitle">Configure parameters and compile division telemetry</p>
          </div>
        </div>
        <button className="reports-modal-close-btn" id="modal-gen-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <form className="reports-modal-body" id="generate-report-form">
        <div className="form-group">
          <label className="form-label" htmlFor="report-type-select">Report Category *</label>
          <select id="report-type-select" className="form-control" required>
            <option value="executive">Monthly Executive Maintenance Summary</option>
            <option value="block">Corridor &amp; Block Utilization Deep Dive</option>
            <option value="downtime">Downtime Analysis &amp; Speed Restrictions</option>
            <option value="resource">Resource &amp; Machinery Operational Efficiency</option>
            <option value="safety">Track Safety &amp; Defect Rectification Audit</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="report-division-select">Division Scope</label>
            <select id="report-division-select" className="form-control">
              <option value="all">Entire Jharkhand Network</option>
              <option value="dhanbad">Dhanbad Division</option>
              <option value="ranchi">Ranchi Division</option>
              <option value="chakradharpur">Chakradharpur Division</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="report-format-select">Format</label>
            <select id="report-format-select" className="form-control">
              <option value="pdf">Adobe PDF (.pdf)</option>
              <option value="csv">Comma-Separated Values (.csv)</option>
              <option value="excel">Microsoft Excel (.xlsx)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="report-email-input">Send Automated Copy To (Optional)</label>
          <input type="email" id="report-email-input" className="form-control" placeholder="e.g. dom.ranchi@indianrailways.gov.in" />
        </div>

        <div className="reports-modal-footer">
          <button type="button" className="btn btn-secondary" id="modal-gen-cancel-btn">Cancel</button>
          <button type="submit" className="btn btn-primary" id="modal-gen-submit-btn">
            <i className="fa-solid fa-bolt"></i> Compile &amp; Download Report
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* 3.2 Schedule Automated Reports Modal */}
  <div className="reports-modal-overlay" id="schedule-report-modal" role="dialog" aria-modal="true" aria-labelledby="modal-sched-title">
    <div className="reports-modal-dialog">
      <div className="reports-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon purple-theme">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div>
            <h3 className="reports-modal-title" id="modal-sched-title">Schedule Automated Recurring Reports</h3>
            <p className="reports-modal-subtitle">Auto-generate and email divisional summaries</p>
          </div>
        </div>
        <button className="reports-modal-close-btn" id="modal-sched-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <form className="reports-modal-body" id="schedule-report-form">
        <div className="form-group">
          <label className="form-label" htmlFor="sched-frequency-select">Dispatch Cadence *</label>
          <select id="sched-frequency-select" className="form-control">
            <option value="daily">Daily Morning Briefing (07:00 IST)</option>
            <option value="weekly" selected>Weekly Executive Digest (Every Monday 09:00 IST)</option>
            <option value="monthly">Monthly Division Audit (1st of Month)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sched-recipients-input">Recipient Mailing List *</label>
          <input type="text" id="sched-recipients-input" className="form-control" value="divisional-officers@jharkhand.ir.gov.in" required />
          <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "block" }}>Comma-separated railway official email addresses</span>
        </div>

        <div className="reports-modal-footer">
          <button type="button" className="btn btn-secondary" id="modal-sched-cancel-btn">Cancel</button>
          <button type="submit" className="btn btn-primary" id="modal-sched-submit-btn">
            <i className="fa-solid fa-calendar-check"></i> Activate Automated Schedule
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

export default Reports;
