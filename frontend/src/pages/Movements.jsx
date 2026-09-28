import useLegacyPage from "../hooks/useLegacyPage.js";

function Movements() {
  useLegacyPage({
    title: "Train Movements | ThinkSync",
    stylesheet: "/legacy/movements.css",
    script: "/legacy/movements.js",
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
        <a href="/movements" className="nav-item active" data-tab="movements" data-tooltip="Train Movements">
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
    {/* 2. MAIN WORKSPACE WRAPPER (Top Header + Movements Content + Footer)      */}
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

          {/* User Profile Badge: Injected dynamically by movements.js */}
          <div className="user-profile" id="user-profile-container"></div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 2.2 TRAIN MOVEMENTS CANVAS (100% Data-Driven Architecture)             */}
      {/* All containers populated via movements.js; fallback if empty           */}
      {/* ====================================================================== */}
      <main className="movements-page-main" id="movements-page-main">
        
        {/* ==================================================================== */}
        {/* PART A: TOP 6 KPI SUMMARY METRIC CARDS ROW                           */}
        {/* Total Movements, Passenger, Freight, Avg Delay, Sections, Punctuality*/}
        {/* Injected dynamically by renderMovementsKpis() in movements.js        */}
        {/* ==================================================================== */}
        <section className="movements-kpi-grid" id="movements-kpi-container">
          {/* Populated dynamically by movements.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART B: 2-COLUMN MAIN WORKSPACE GRID                                 */}
        {/* Col 1: Live Train Movements Map (Coming Soon Telemetry Screen)       */}
        {/* Col 2: Live & Upcoming Train Movements Interactive Table             */}
        {/* ==================================================================== */}
        <div className="movements-main-grid">
          
          {/* LEFT COLUMN: Live Train Movements – Jharkhand Railway Network Card */}
          <div className="dashboard-card movements-map-card" id="movements-map-card">
            
            {/* Map Card Header with Title, Status & Live View Dropdown */}
            <div className="movements-card-header">
              <div className="movements-card-title-group">
                <h3 className="movements-card-title">Live Train Movements – Jharkhand Railway Network</h3>
              </div>
              <div className="movements-header-controls">
                <div className="live-view-dropdown-wrapper">
                  <span className="live-view-pulse"></span>
                  <select id="live-view-select" aria-label="Live View Selector">
                    <option value="live">Live View</option>
                    <option value="delayed">Delayed Only</option>
                    <option value="freight">Freight Corridors</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Map Status & Legend Ribbon */}
            <div className="movements-legend-bar" id="movements-legend-container">
              {/* Populated dynamically by renderMovementsLegend() in movements.js */}
            </div>

            {/* Map Viewport: Coming Soon Telemetry Radar Deployment View */}
            {/* Per user instruction: "and you know waht show in map place" */}
            <div className="movements-map-viewport" id="movements-map-viewport">
              {/* Populated dynamically by renderMovementsMap() in movements.js */}
            </div>

          </div>

          {/* RIGHT COLUMN: Live & Upcoming Train Movements Table Card */}
          <div className="dashboard-card movements-table-card" id="movements-table-card">
            {/* Populated dynamically by renderTrainTable() in movements.js */}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* PART C: BOTTOM 3-COLUMN ANALYTICS GRID                               */}
        {/* Col 1: Section Congestion (Live) with Progress Bars                  */}
        {/* Col 2: Train Timeline (12810 Howrah-NDLS Exp) Milestone Tracker      */}
        {/* Col 3: Train Details Card with Locomotive Specs and Live Speed       */}
        {/* ==================================================================== */}
        <div className="movements-bottom-grid">
          
          {/* Bottom Col 1: Section Congestion (Live) */}
          <div className="dashboard-card congestion-card" id="congestion-card">
            {/* Populated dynamically by renderSectionCongestion() in movements.js */}
          </div>

          {/* Bottom Col 2: Train Timeline Milestone Route Tracker */}
          <div className="dashboard-card timeline-card" id="timeline-card">
            {/* Populated dynamically by renderTrainTimeline() in movements.js */}
          </div>

          {/* Bottom Col 3: Train Details Card */}
          <div className="dashboard-card train-details-card" id="train-details-card">
            {/* Populated dynamically by renderTrainDetails() in movements.js */}
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

    </div>
  </div>

  {/* ========================================================================== */}
  {/* MODAL: DYNAMIC TRAIN STOPPAGE (Created & Calculated via JavaScript)         */}
  {/* ========================================================================== */}
  <div className="modal-backdrop" id="add-stoppage-modal" style={{ display: "none" }}>
    <div className="modal-dialog">
      <div className="modal-header">
        <div className="modal-title-group">
          <span className="modal-icon"><i className="fa-solid fa-route"></i></span>
          <h3>Add Intermediate Stoppage</h3>
        </div>
        <button className="modal-close-btn" id="close-stoppage-modal-btn" aria-label="Close dialog">&times;</button>
      </div>
      <form className="modal-form" id="add-stoppage-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stoppage-station-input">Station / Junction Name *</label>
            <input type="text" id="stoppage-station-input" placeholder="e.g. Barkakana, Koderma, Muri..." required />
          </div>
          <div className="form-group">
            <label htmlFor="stoppage-time-input">Scheduled Arrival Time *</label>
            <input type="text" id="stoppage-time-input" placeholder="e.g. 14:45" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stoppage-status-select">Status along Route *</label>
            <select id="stoppage-status-select" required>
              <option value="upcoming" selected>Upcoming Station (Pending)</option>
              <option value="active">Active (Train Currently Arriving)</option>
              <option value="completed">Completed (Departed Station)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="stoppage-halt-input">Halt Duration *</label>
            <input type="text" id="stoppage-halt-input" placeholder="e.g. 2 min" value="2 min" required />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" id="cancel-stoppage-btn">Cancel</button>
          <button type="submit" className="btn-submit" id="submit-stoppage-btn">
            <i className="fa-solid fa-plus"></i> Add Stoppage to Timeline
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* Toast Notification Container for interactive user feedback */}
  <div className="toast-container" id="toast-container" aria-live="polite"></div>

  {/* ========================================================================== */}
  {/* SCRIPTS EXECUTION                                                          */}
  {/* movements.js contains comments written first, master train store,           */}
  {/* telemetry coming-soon renderer, interactive table filters & dynamic timeline*/}
  {/* ========================================================================== */}
    </>
  );
}

export default Movements;
