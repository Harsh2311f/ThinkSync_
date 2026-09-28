import useLegacyPage from "../hooks/useLegacyPage.js";

function BlockCalendar() {
  useLegacyPage({
    title: "Block Calendar | ThinkSync",
    stylesheet: "/legacy/calendar.css",
    script: "/legacy/calendar.js",
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
        <a href="/map" className="nav-item" data-tab="map" data-tooltip="Railway Health Map">
          <i className="fa-solid fa-location-dot"></i>
          <span className="nav-label">Railway Health Map</span>
        </a>
        <a href="/calendar" className="nav-item active" data-tab="calendar" data-tooltip="Block Calendar">
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

      {/* 1.3 Bottom Train Branding Card */}
      {/* Purpose: Injected dynamically by renderSidebarAndFooter() in calendar.js */}
      <div className="sidebar-train-card" id="sidebar-train-card">
        {/* Dynamic content: Train background image, 'Better Planning Safer Journeys' and Indian Flag */}
      </div>
      
    </aside>

    {/* ======================================================================== */}
    {/* 2. MAIN WORKSPACE WRAPPER (Top Header + Calendar Grid + Footer)          */}
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

          {/* User Profile Badge: Injected dynamically by calendar.js */}
          <div className="user-profile" id="user-profile-container">
            {/* Dynamic avatar, user name, role, and dropdown arrow */}
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 2.2 CALENDAR CONTENT CANVAS                                            */}
      {/* No data is hardcoded here. Every container is populated by JavaScript! */}
      {/* When data is not available, it displays 'Not Found' gracefully         */}
      {/* ====================================================================== */}
      <main className="calendar-page-main" id="calendar-page-main">
        
        {/* ==================================================================== */}
        {/* PART A: ACTION SUBHEADER TOOLBAR CARD                                */}
        {/* Title, month navigator, view switchers (Week/Month/Timeline), button */}
        {/* Injected dynamically by renderCalendarSubheader() in calendar.js     */}
        {/* ==================================================================== */}
        <section className="dashboard-card calendar-subheader-card" id="calendar-subheader-card">
          {/* Populated by calendar.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART B: TOP 5 KPI SUMMARY METRIC CARDS ROW                           */}
        {/* Total Blocks, Planned Blocks, In Progress, Conflicts, Departments    */}
        {/* Injected dynamically by renderCalendarKpis() in calendar.js          */}
        {/* ==================================================================== */}
        <section className="calendar-kpi-grid" id="calendar-kpi-container">
          {/* Populated by calendar.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART C: FILTER TOOLBAR CARD                                          */}
        {/* Section, Department, Block Type, Status dropdowns & Search filter    */}
        {/* Injected dynamically by renderFilterToolbar() in calendar.js         */}
        {/* ==================================================================== */}
        <section className="dashboard-card calendar-filter-toolbar" id="calendar-filter-toolbar">
          {/* Populated by calendar.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART D: MIDDLE CALENDAR & DETAILS 2-COLUMN LAYOUT                    */}
        {/* Col 1: Interactive Week Calendar Grid | Col 2: Active Block Details  */}
        {/* ==================================================================== */}
        <div className="calendar-middle-layout">
          
          {/* D.1 Interactive Week Schedule Calendar Card */}
          <div className="dashboard-card calendar-grid-card" id="calendar-grid-card">
            {/* Populated dynamically by renderCalendarGrid() in calendar.js */}
          </div>

          {/* D.2 Active Block Details Panel Card */}
          <div className="dashboard-card block-details-card" id="block-details-card">
            {/* Populated dynamically by renderBlockDetails() in calendar.js */}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* PART E: BOTTOM ANALYTICS ROW                                         */}
        {/* 3-Column Layout: Block Summary Donut | Conflicts & Alerts | Upcoming */}
        {/* ==================================================================== */}
        <div className="calendar-bottom-analytics-grid">
          
          {/* E.1 Block Summary Donut Card (This Week) */}
          <div className="dashboard-card block-summary-card" id="block-summary-card">
            {/* Populated dynamically by renderBlockSummaryDonut() in calendar.js */}
          </div>

          {/* E.2 Conflicts & Alerts Card */}
          <div className="dashboard-card conflicts-alerts-card" id="conflicts-alerts-card">
            {/* Populated dynamically by renderConflictsAndAlerts() in calendar.js */}
          </div>

          {/* E.3 Upcoming Scheduled Blocks Card */}
          <div className="dashboard-card upcoming-blocks-card" id="upcoming-blocks-card">
            {/* Populated dynamically by renderUpcomingBlocks() in calendar.js */}
          </div>

        </div>

      </main>

      {/* ====================================================================== */}
      {/* 2.3 BOTTOM FOOTER BANNER                                               */}
      {/* Executive motto and Indian Railways brand partnership statement        */}
      {/* Injected dynamically by renderSidebarAndFooter() in calendar.js        */}
      {/* ====================================================================== */}
      <footer className="bottom-footer" id="app-bottom-footer">
        <div className="footer-quote" id="footer-quote-container"></div>
        <div className="footer-links" id="footer-links-container"></div>
      </footer>

    </div>

  </div>

  {/* ========================================================================== */}
  {/* MODAL: CREATE NEW MAINTENANCE BLOCK                                        */}
  {/* Interactive popup dialog for scheduling blocks                             */}
  {/* ========================================================================== */}
  <div className="modal-backdrop" id="create-block-modal" style={{ display: "none" }}>
    <div className="modal-dialog">
      <div className="modal-header">
        <div className="modal-title-group">
          <span className="modal-icon"><i className="fa-solid fa-calendar-plus"></i></span>
          <h3>Schedule New Maintenance Block</h3>
        </div>
        <button className="modal-close-btn" id="close-modal-btn" aria-label="Close dialog">&times;</button>
      </div>
      <form className="modal-form" id="create-block-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="block-section-input">Railway Section *</label>
            <select id="block-section-input" required>
              <option value="">Select Section</option>
              <option value="Bokaro – Chandrapura">JH-BOK-002: Bokaro – Chandrapura</option>
              <option value="Dhanbad – KumerDubi">JH-DHN-007: Dhanbad – KumerDubi</option>
              <option value="Ranchi – Namkum">JH-RNC-004: Ranchi – Namkum</option>
              <option value="Latehar – Daltonganj">JH-LDH-008: Latehar – Daltonganj</option>
              <option value="Chakradharpur – Rourkela">JH-CKP-005: Chakradharpur – Rourkela</option>
              <option value="Gumla – Lohardaga">JH-GML-003: Gumla – Lohardaga</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="block-dept-input">Department *</label>
            <select id="block-dept-input" required>
              <option value="Engineering">Engineering (Track & P-Way)</option>
              <option value="S&T">S&T (Signals & Telecom)</option>
              <option value="TRD">TRD (Traction & OHE)</option>
              <option value="Joint">Joint Block (Multiple Depts)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="block-date-input">Block Date *</label>
            <input type="date" id="block-date-input" value="2026-09-16" required />
          </div>
          <div className="form-group">
            <label htmlFor="block-duration-input">Duration (Hours) *</label>
            <input type="number" id="block-duration-input" min="1" max="12" value="3" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="block-start-time">Start Time *</label>
            <input type="time" id="block-start-time" value="01:30" required />
          </div>
          <div className="form-group">
            <label htmlFor="block-end-time">End Time *</label>
            <input type="time" id="block-end-time" value="04:30" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="block-desc-input">Work Description *</label>
          <textarea id="block-desc-input" rows="2" placeholder="e.g. Ultrasonic flaw detection, rail renewal, OHE bond tightening..." required></textarea>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" id="cancel-block-btn">Cancel</button>
          <button type="submit" className="btn-submit"><i className="fa-solid fa-check"></i> Schedule Block</button>
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

export default BlockCalendar;
