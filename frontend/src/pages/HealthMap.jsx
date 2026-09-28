import useLegacyPage from "../hooks/useLegacyPage.js";

function HealthMap() {
  useLegacyPage({
    title: "Railway Health Map | ThinkSync",
    stylesheet: "/legacy/map.css",
    script: "/legacy/map.js",
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
        <a href="/" className="nav-item" data-tab="dashboard" data-tooltip="Dashboard">
          <i className="fa-solid fa-house"></i>
          <span className="nav-label">Dashboard</span>
        </a>
        <a href="/map" className="nav-item active" data-tab="map" data-tooltip="Railway Health Map">
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
      {/* Purpose: Injected dynamically by renderSidebarAndFooter() in map.js */}
      <div className="sidebar-train-card" id="sidebar-train-card">
        {/* Dynamic content: Train background image, 'Better Planning Safer Journeys' and Indian Flag */}
      </div>
      
    </aside>

    {/* ======================================================================== */}
    {/* 2. MAIN WORKSPACE WRAPPER (Top Header + Map Dashboard + Footer)          */}
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
                <h4>System Notifications</h4>
                <button className="text-btn" id="mark-all-read">Mark all read</button>
              </div>
              <div className="notif-list" id="notif-list">
                {/* Notifications injected dynamically by JS */}
              </div>
            </div>
          </div>

          {/* User Profile Pill */}
          <div className="user-profile" id="user-profile-container"></div>

        </div>
      </header>

      {/* ====================================================================== */}
      {/* 2.2 MAIN CONTENT AREA: RAILWAY HEALTH MAP WORKSPACE                     */}
      {/* Contains Subheader, 5 KPI Cards, Middle Map Grid, and Bottom Analytics */}
      {/* ALL DATA IS INJECTED DYNAMICALLY VIA JAVASCRIPT                         */}
      {/* ====================================================================== */}
      <main className="dashboard-main map-page-main">
        
        {/* ==================================================================== */}
        {/* PART A: MAP SUBHEADER & FILTER TOOLBAR                               */}
        {/* Displays 'Railway Health Map' title, Network View, Time Range & Live */}
        {/* Injected dynamically by renderMapSubheader() in map.js               */}
        {/* ==================================================================== */}
        <section className="map-subheader-card" id="map-subheader-container">
          {/* Populated by map.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART B: TOP 5 HEALTH KPI CARDS ROW                                   */}
        {/* Total Sections, Healthy, Moderate, Critical, Under Maintenance       */}
        {/* Injected dynamically by renderHealthKpis() in map.js                 */}
        {/* ==================================================================== */}
        <section className="health-kpi-grid" id="health-kpi-container">
          {/* Populated by map.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART C: MIDDLE MAIN GRID (Interactive Map, Details & Zones)          */}
        {/* 3-Column Layout: Live Map Canvas | Section Details | Vulnerabilities */}
        {/* ==================================================================== */}
        <div className="map-middle-grid">
          
          {/* C.1 Large Interactive Jharkhand Railway Network Map Card */}
          <div className="dashboard-card map-view-card">
            
            {/* Map Card Header with Coming Soon Badge & Notify Control */}
            <div className="card-header map-card-header">
              <div className="card-title-group" style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                <span className="map-title-icon"><i className="fa-solid fa-train"></i></span>
                <h3 className="card-title">Jharkhand Railway Network &ndash; Live Health Map</h3>
                <span className="badge badge-warning" id="map-status-pill">
                  <i className="fa-solid fa-clock"></i> Coming Soon
                </span>
                <span className="timestamp" id="map-timestamp" style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Telemetry Module Under Deployment</span>
              </div>
              
              <div className="map-header-actions">
                <button className="icon-btn-sm" id="notify-map-btn" title="Get Notified Upon Release" style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <i className="fa-solid fa-bell"></i>
                </button>
              </div>
            </div>

            {/* Status ribbon banner: Populated dynamically by map.js */}
            <div className="map-legend" id="map-legend-container" style={{ padding: "0.45rem 1rem", background: "#FFFBEB", borderBottom: "1px solid #FEF3C7", fontSize: "0.7rem" }}></div>

            {/* Coming Soon Container: Populated dynamically by renderRailwayMap() in map.js */}
            <div className="map-canvas-wrapper" id="map-canvas-wrapper" style={{ minHeight: "380px" }}>
              {/* 'Coming Soon' graphic and description rendered via JavaScript */}
            </div>

          </div>

          {/* C.2 Active Section Details Card */}
          <div className="dashboard-card section-details-card" id="section-details-card">
            {/* Populated dynamically by renderSectionDetails() in map.js */}
          </div>

          {/* C.3 Far Right Column: Vulnerability Zones & Live Health Indicators */}
          <div className="map-right-column">
            
            {/* C.3.1 Vulnerability Zones Card */}
            <div className="dashboard-card vuln-zones-card" id="vuln-zones-card">
              {/* Populated dynamically by renderVulnerabilityZones() in map.js */}
            </div>

            {/* C.3.2 Live Health Indicators (Circular Progress Gauges) */}
            <div className="dashboard-card health-indicators-card" id="health-indicators-card">
              {/* Populated dynamically by renderHealthIndicators() in map.js */}
            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* PART D: BOTTOM ANALYTICS ROW (Overview Donut, Critical Table, AI)    */}
        {/* 3-Column Layout: Network Donut | Top 5 Critical | AI Recommendations */}
        {/* ==================================================================== */}
        <div className="bottom-analytics-grid">
          
          {/* D.1 Network Health Overview Donut Card */}
          <div className="dashboard-card network-donut-card" id="network-donut-card">
            {/* Populated dynamically by renderDonutChart() in map.js */}
          </div>

          {/* D.2 Top 5 Most Critical Sections Table Card */}
          <div className="dashboard-card critical-sections-card" id="critical-sections-card">
            {/* Populated dynamically by renderCriticalSectionsTable() in map.js */}
          </div>

          {/* D.3 AI Insights & Recommendations Card */}
          <div className="dashboard-card ai-insights-card" id="ai-insights-card">
            {/* Populated dynamically by renderAiInsights() in map.js */}
          </div>

        </div>

      </main>

      {/* ====================================================================== */}
      {/* 2.3 BOTTOM FOOTER BANNER                                               */}
      {/* Executive motto and Indian Railways brand partnership statement        */}
      {/* Injected dynamically by renderSidebarAndFooter() in map.js             */}
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
  
  {/* 3.1 Create Maintenance Task Modal */}
  <div className="modal-backdrop" id="task-modal">
    <div className="modal-card">
      <div className="modal-header">
        <div className="modal-title-group">
          <span className="modal-badge badge-warning" id="modal-task-badge">Maintenance Request</span>
          <h3 className="modal-title" id="modal-task-title">Schedule Track Maintenance Task</h3>
        </div>
        <button className="modal-close" id="modal-task-close-btn">&times;</button>
      </div>

      <div className="modal-body" id="modal-task-body">
        {/* Form injected dynamically by map.js */}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" id="modal-task-cancel-btn">Cancel</button>
        <button className="btn btn-primary" id="modal-task-submit-btn">Confirm &amp; Schedule Task</button>
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

export default HealthMap;
