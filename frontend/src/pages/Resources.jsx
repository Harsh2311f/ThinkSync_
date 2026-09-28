import useLegacyPage from "../hooks/useLegacyPage.js";

function Resources() {
  useLegacyPage({
    title: "Resources | ThinkSync",
    stylesheet: "/legacy/resources.css",
    script: "/legacy/resources.js",
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
        <a href="/tasks" className="nav-item" data-tab="tasks" data-tooltip="Maintenance Tasks">
          <i className="fa-solid fa-clipboard-list"></i>
          <span className="nav-label">Maintenance Tasks</span>
        </a>
        <a href="/movements" className="nav-item" data-tab="movements" data-tooltip="Train Movements">
          <i className="fa-solid fa-train"></i>
          <span className="nav-label">Train Movements</span>
        </a>
        <a href="/resources" className="nav-item active" data-tab="resources" data-tooltip="Resources">
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
    {/* 2. MAIN WORKSPACE WRAPPER (Top Header + Resources Content + Footer)      */}
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
            <input type="text" id="global-search" placeholder="Search resources, crew, machines, materials..." autoComplete="off" />
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

          {/* User Profile Badge: Injected dynamically by resources.js */}
          <div className="user-profile" id="user-profile-container"></div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 2.2 RESOURCES CONTENT CANVAS (100% Data-Driven Architecture)           */}
      {/* All containers populated dynamically via resources.js                  */}
      {/* ====================================================================== */}
      <main className="resources-page-main" id="resources-page-main">
        
        {/* SUBHEADER TOOLBAR: Page Title, Subtitle, and Filter Controls */}
        <section className="resources-subheader-toolbar" id="resources-subheader-toolbar">
          <div className="resources-subheader-left">
            <h2 className="resources-title">Resources</h2>
            <p className="resources-subtitle">People. Machines. Materials. Always Ready for a Safer Tomorrow.</p>
          </div>
          <div className="resources-subheader-controls">
            <div className="resources-select-wrapper">
              <i className="fa-solid fa-map-location-dot select-icon"></i>
              <select id="division-filter-select" aria-label="Filter by Division">
                <option value="all">All Divisions</option>
                <option value="ranchi">Ranchi Division</option>
                <option value="dhanbad">Dhanbad Division</option>
                <option value="chakradharpur">Chakradharpur Division</option>
              </select>
            </div>
            <div className="resources-select-wrapper">
              <i className="fa-regular fa-calendar-days select-icon"></i>
              <select id="time-filter-select" aria-label="Filter by Time Range">
                <option value="30days">Last 30 Days</option>
                <option value="7days">Last 7 Days</option>
                <option value="quarter">This Quarter</option>
                <option value="year">Current Year</option>
              </select>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* ROW 0: TOP 5 KPI SUMMARY METRIC CARDS                                 */}
        {/* Total Crew, Total Machines, Material Items, Depots, Readiness Meter   */}
        {/* ==================================================================== */}
        <section className="resources-kpi-grid" id="resources-kpi-container">
          {/* Populated dynamically by renderResourcesKpis() in resources.js */}
        </section>

        {/* ==================================================================== */}
        {/* ROW 1: CREW AVAILABILITY & MACHINE INVENTORY (2-COLUMN GRID)          */}
        {/* ==================================================================== */}
        <div className="resources-row-grid resources-row1-grid">
          
          {/* Crew Availability Card */}
          <div className="dashboard-card resources-card" id="crew-card">
            {/* Populated dynamically by renderCrewTable() in resources.js */}
          </div>

          {/* Machine Inventory Card */}
          <div className="dashboard-card resources-card" id="machines-card">
            {/* Populated dynamically by renderMachineTable() in resources.js */}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* ROW 2: MATERIALS, UTILIZATION & ALERTS (3-COLUMN GRID)                */}
        {/* ==================================================================== */}
        <div className="resources-row-grid resources-row2-grid">
          
          {/* Col 1: Material Inventory Card */}
          <div className="dashboard-card resources-card" id="materials-card">
            {/* Populated dynamically by renderMaterialTable() in resources.js */}
          </div>

          {/* Col 2: Resource Utilization (Stacked Bar Chart) Card */}
          <div className="dashboard-card resources-card" id="utilization-card">
            {/* Populated dynamically by renderUtilizationChart() in resources.js */}
          </div>

          {/* Col 3: Shortage Alerts Card */}
          <div className="dashboard-card resources-card" id="alerts-card">
            {/* Populated dynamically by renderShortageAlerts() in resources.js */}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* ROW 3: ASSIGNABLE RESOURCES & DEPOT READINESS (2-COLUMN GRID)         */}
        {/* ==================================================================== */}
        <div className="resources-row-grid resources-row3-grid">
          
          {/* Left: Assignable Resources by Section Card */}
          <div className="dashboard-card resources-card" id="assignable-card">
            {/* Populated dynamically by renderAssignableSections() in resources.js */}
          </div>

          {/* Right: Depot-wise Resource Readiness Card */}
          <div className="dashboard-card resources-card" id="depot-readiness-card">
            {/* Populated dynamically by renderDepotReadiness() in resources.js */}
          </div>

        </div>

      </main>

      {/* ====================================================================== */}
      {/* 2.3 APPLICATION FOOTER                                                 */}
      {/* ====================================================================== */}
      <footer className="bottom-footer" id="app-bottom-footer">
        <div className="footer-quote" id="footer-quote-container"></div>
        <div className="footer-links" id="footer-links-container"></div>
      </footer>

    </div>{/* End .main-wrapper */}

  </div>{/* End .app-layout */}

  {/* ========================================================================== */}
  {/* 3. INTERACTIVE MODAL DIALOGS & OVERLAYS                                    */}
  {/* ========================================================================== */}
  
  {/* Assign Resources Modal Dialog */}
  <div className="resource-modal-overlay" id="assign-resources-modal" role="dialog" aria-modal="true" aria-labelledby="modal-section-title">
    <div className="resource-modal-dialog">
      <div className="resource-modal-header">
        <div className="modal-title-wrap">
          <i className="fa-solid fa-network-wired modal-title-icon"></i>
          <div>
            <h3 className="resource-modal-title" id="modal-section-title">Assign Resources to Section</h3>
            <p className="resource-modal-subtitle" id="modal-section-subtitle">Allocate available crews, machinery, and reserve materials</p>
          </div>
        </div>
        <button className="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">&times;</button>
      </div>
      
      <form className="resource-modal-body" id="assign-resources-form">
        {/* Target Section (Read-only display + hidden input) */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-section-input">Target Corridor / Section</label>
          <div className="input-with-icon">
            <i className="fa-solid fa-route input-icon"></i>
            <input type="text" id="form-section-input" className="form-control" readonly />
          </div>
        </div>

        {/* Available Crew Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-crew-select">Select Maintenance Crew Team</label>
          <select id="form-crew-select" className="form-control" required>
            {/* Injected dynamically */}
          </select>
        </div>

        {/* Heavy Machinery Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-machine-select">Assign Heavy Machinery</label>
          <select id="form-machine-select" className="form-control" required>
            {/* Injected dynamically */}
          </select>
        </div>

        {/* Materials Reserve Allocation */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-materials-select">Material Depot Package</label>
          <select id="form-materials-select" className="form-control">
            {/* Injected dynamically */}
          </select>
        </div>

        {/* Maintenance Window Block Time */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="form-time-window">Block Time Window</label>
            <select id="form-time-window" className="form-control">
              <option value="Night Block 23:30 - 04:30">Night Block (23:30 - 04:30 IST)</option>
              <option value="Morning Block 09:15 - 12:45">Morning Block (09:15 - 12:45 IST)</option>
              <option value="Afternoon Block 13:30 - 16:30">Afternoon Block (13:30 - 16:30 IST)</option>
              <option value="Emergency Window ASAP">Emergency Window (Immediate Dispatch)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="form-priority-select">Mission Priority</label>
            <select id="form-priority-select" className="form-control">
              <option value="High">🔴 High Priority (Safety Critical)</option>
              <option value="Routine" selected>🟢 Routine Maintenance</option>
              <option value="Emergency">⚡ Emergency Deployment</option>
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="resource-modal-footer">
          <button type="button" className="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button type="submit" className="btn btn-primary" id="modal-submit-btn">
            <i className="fa-solid fa-check"></i> Confirm Assignment
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* Global Toast Notification Container */}
  <div className="toast-container" id="toast-container"></div>

  {/* Dynamic Application Engine */}
    </>
  );
}

export default Resources;
