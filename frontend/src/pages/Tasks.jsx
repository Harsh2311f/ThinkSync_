import useLegacyPage from "../hooks/useLegacyPage.js";

function Tasks() {
  useLegacyPage({
    title: "Maintenance Tasks | ThinkSync",
    stylesheet: "/legacy/tasks.css",
    script: "/legacy/tasks.js",
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
    {/* Contains Hamburger Show/Hide Toggle, Navigation Tabs, and Bottom Card    */}
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
        <a href="/tasks" className="nav-item active" data-tab="tasks" data-tooltip="Maintenance Tasks">
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

      {/* 1.3 Bottom Train Branding Card (Injected dynamically) */}
      <div className="sidebar-train-card" id="sidebar-train-card"></div>
      
    </aside>

    {/* ======================================================================== */}
    {/* 2. MAIN WORKSPACE WRAPPER (Top Header + Tasks Content + Footer)          */}
    {/* ======================================================================== */}
    <div className="main-wrapper">
      
      {/* ====================================================================== */}
      {/* 2.1 TOP HEADER BAR                                                     */}
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
            <div className="search-results-dropdown" id="search-dropdown"></div>
          </div>

          {/* Notification Bell with Counter Badge */}
          <div className="notification-wrapper">
            <button className="icon-btn" id="notif-btn" aria-label="View System Notifications">
              <i className="fa-solid fa-bell"></i>
              <span className="notif-badge" id="header-notif-badge"></span>
            </button>
            
            {/* Notification Dropdown Panel */}
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

          {/* User Profile Badge: Injected dynamically by tasks.js */}
          <div className="user-profile" id="user-profile-container"></div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 2.2 TASKS CONTENT CANVAS (100% Data-Driven Architecture)               */}
      {/* All containers populated via tasks.js; graceful fallback if empty      */}
      {/* ====================================================================== */}
      <main className="tasks-page-main" id="tasks-page-main">
        
        {/* ==================================================================== */}
        {/* PART A: ACTION SUBHEADER TOOLBAR CARD                                */}
        {/* Title, subtitle, "+ Create Task" and "Export" action buttons        */}
        {/* Injected dynamically by renderTasksSubheader() in tasks.js           */}
        {/* ==================================================================== */}
        <section className="dashboard-card tasks-subheader-card" id="tasks-subheader-card">
          {/* Populated dynamically by tasks.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART B: TOP 5 KPI SUMMARY METRIC CARDS ROW                           */}
        {/* Total Tasks, Overdue Tasks, High Priority, In Progress, Completed    */}
        {/* Injected dynamically by renderTasksKpis() in tasks.js                */}
        {/* ==================================================================== */}
        <section className="tasks-kpi-grid" id="tasks-kpi-container">
          {/* Populated dynamically by tasks.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART C: FILTER TOOLBAR CARD                                          */}
        {/* Section, Severity, Department, Overdue Status, Date Range, Buttons   */}
        {/* Injected dynamically by renderFilterToolbar() in tasks.js            */}
        {/* ==================================================================== */}
        <section className="dashboard-card tasks-filter-toolbar" id="tasks-filter-toolbar">
          {/* Populated dynamically by tasks.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART D: 2-COLUMN MAIN WORKSPACE LAYOUT                               */}
        {/* Col 1: Charts (Priority, Dept, Status) + Task Table List             */}
        {/* Col 2: Task Details Panel Card                                       */}
        {/* ==================================================================== */}
        <div className="tasks-workspace-layout">
          
          {/* LEFT COLUMN: Analytics Charts Row + Task List Table Card */}
          <div className="tasks-left-column">
            
            {/* D.1 3-Column Analytics Charts Row */}
            <div className="tasks-analytics-grid">
              
              {/* Chart 1: Tasks by Priority (Donut Chart) */}
              <div className="dashboard-card task-chart-card" id="chart-priority-card">
                {/* Populated dynamically by renderPriorityChart() in tasks.js */}
              </div>

              {/* Chart 2: Tasks by Department (SVG Bar Chart) */}
              <div className="dashboard-card task-chart-card" id="chart-dept-card">
                {/* Populated dynamically by renderDeptChart() in tasks.js */}
              </div>

              {/* Chart 3: Task Status (Donut Chart) */}
              <div className="dashboard-card task-chart-card" id="chart-status-card">
                {/* Populated dynamically by renderStatusChart() in tasks.js */}
              </div>

            </div>

            {/* D.2 Maintenance Task List Table Card (TMS + SMMS + TDMS) */}
            <div className="dashboard-card tasks-table-card" id="tasks-table-card">
              {/* Populated dynamically by renderTasksTable() in tasks.js */}
            </div>

          </div>

          {/* RIGHT COLUMN: Active Task Details Panel Card */}
          <div className="tasks-right-column">
            <div className="dashboard-card task-details-card" id="task-details-card">
              {/* Populated dynamically by renderTaskDetails() in tasks.js */}
            </div>
          </div>

        </div>

      </main>

      {/* ====================================================================== */}
      {/* 2.3 BOTTOM FOOTER BANNER                                               */}
      {/* Executive motto and Indian Railways brand partnership statement        */}
      {/* Injected dynamically by renderSidebarAndFooter() in tasks.js           */}
      {/* ====================================================================== */}
      <footer className="bottom-footer" id="app-bottom-footer">
        <div className="footer-quote" id="footer-quote-container"></div>
        <div className="footer-links" id="footer-links-container"></div>
      </footer>

    </div>

  </div>

  {/* ========================================================================== */}
  {/* MODAL: CREATE NEW MAINTENANCE TASK                                         */}
  {/* Interactive popup dialog for scheduling a new task                         */}
  {/* ========================================================================== */}
  <div className="modal-backdrop" id="create-task-modal" style={{ display: "none" }}>
    <div className="modal-dialog">
      <div className="modal-header">
        <div className="modal-title-group">
          <span className="modal-icon"><i className="fa-solid fa-circle-plus"></i></span>
          <h3>Create New Maintenance Task</h3>
        </div>
        <button className="modal-close-btn" id="close-modal-btn" aria-label="Close dialog">&times;</button>
      </div>
      <form className="modal-form" id="create-task-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-source-input">Source System *</label>
            <select id="task-source-input" required>
              <option value="TMS">TMS (Track Management System)</option>
              <option value="SMMS">SMMS (Signal & Telecom Maintenance)</option>
              <option value="TDMS">TDMS (Traction & Rolling Stock)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="task-dept-input">Department *</label>
            <select id="task-dept-input" required>
              <option value="Track">Track (Engineering)</option>
              <option value="S&T">S&T (Signals & Telecom)</option>
              <option value="Mechanical">Mechanical (Loco & Rolling Stock)</option>
              <option value="Electrical">Electrical (TRD & OHE)</option>
              <option value="Civil">Civil (Bridges & Works)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-section-input">Railway Section *</label>
            <select id="task-section-input" required>
              <option value="Ranchi – Dhanbad">JH-RDH-001: Ranchi – Dhanbad</option>
              <option value="Bokaro – Chandrapura">JH-BOK-002: Bokaro – Chandrapura</option>
              <option value="Dhanbad – Koderma">JH-DKD-003: Dhanbad – Koderma</option>
              <option value="Hatia – Asansol">JH-HAS-004: Hatia – Asansol</option>
              <option value="Gumla – Lohardaga">JH-GML-005: Gumla – Lohardaga</option>
              <option value="Latehar – Garhwa">JH-LTG-006: Latehar – Garhwa</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="task-location-input">Location / Chainage *</label>
            <input type="text" id="task-location-input" placeholder="e.g. Km 312/4-5 or Hatia Yard" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority-input">Priority Level *</label>
            <select id="task-priority-input" required>
              <option value="High">High Priority</option>
              <option value="Medium" selected>Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="task-due-input">Due Date *</label>
            <input type="date" id="task-due-input" value="2026-09-22" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="task-desc-input">Task Description *</label>
          <input type="text" id="task-desc-input" placeholder="e.g. Ultrasonic flaw testing, axle counter calibration..." required />
        </div>

        <div className="form-group">
          <label htmlFor="task-details-input">Detailed Scope & Requirements</label>
          <textarea id="task-details-input" rows="2" placeholder="Describe work order, traffic block requirement, gang assignment..."></textarea>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" id="cancel-task-btn">Cancel</button>
          <button type="submit" className="btn-submit"><i className="fa-solid fa-check"></i> Create Task</button>
        </div>
      </form>
    </div>
  </div>

  {/* Interactive Toast Notification Container */}
  <div className="toast-container" id="toast-container"></div>

  {/* Page Logic & Mock Data Script */}
    </>
  );
}

export default Tasks;
