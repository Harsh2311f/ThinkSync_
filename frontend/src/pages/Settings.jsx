import useLegacyPage from "../hooks/useLegacyPage.js";

function Settings() {
  useLegacyPage({
    title: "Settings | ThinkSync",
    stylesheet: "/legacy/settings.css",
    script: "/legacy/settings.js",
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

      {/* 1.2 Navigation Menu Links (All 10 Core Application Modules) */}
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
        <a href="/alerts" className="nav-item" data-tab="alerts" data-tooltip="Alerts">
          <i className="fa-solid fa-bell"></i>
          <span className="nav-label">Alerts</span>
        </a>
        <a href="/settings" className="nav-item active" data-tab="settings" data-tooltip="Settings">
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
            <input type="text" id="global-search" placeholder="Search settings, permissions, APIs..." autoComplete="off" />
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

      {/* 2.2 SETTINGS CONTENT CANVAS (100% Data-Driven Architecture) */}
      <main className="settings-page-main" id="settings-page-main">
        
        {/* SUBHEADER TOOLBAR: Page Title, Subtitle, and ThinkSync Branding */}
        <section className="settings-subheader-toolbar" id="settings-subheader-toolbar">
          <div className="settings-subheader-left">
            <div className="settings-icon-badge">
              <i className="fa-solid fa-gear"></i>
            </div>
            <div className="settings-title-wrap">
              <h2 className="settings-title">Settings</h2>
              <p className="settings-subtitle">Manage your account, preferences, and system configuration for a seamless railway operations experience.</p>
            </div>
          </div>
          
          <div className="settings-subheader-right">
            <span className="thinksync-brand">ThinkSync</span>
            <span className="thinksync-sub">Indian Railways | Smart Infrastructure | Connected India</span>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* ROW 1: USER PROFILE, ACCESS & NOTIFICATIONS (3-COLUMN GRID)           */}
        {/* Col 1: User Profile Card                                             */}
        {/* Col 2: Roles & Permissions Card                                      */}
        {/* Col 3: Notification Preferences Card                                 */}
        {/* ==================================================================== */}
        <section className="settings-row-grid settings-row1-grid">
          
          {/* Col 1: User Profile */}
          <div className="dashboard-card settings-card" id="card-user-profile">
            {/* Populated dynamically by renderUserProfileCard() in settings.js */}
          </div>

          {/* Col 2: Roles & Permissions */}
          <div className="dashboard-card settings-card" id="card-roles-permissions">
            {/* Populated dynamically by renderRolesPermissionsCard() in settings.js */}
          </div>

          {/* Col 3: Notification Preferences */}
          <div className="dashboard-card settings-card" id="card-notification-prefs">
            {/* Populated dynamically by renderNotificationPrefsCard() in settings.js */}
          </div>

        </section>

        {/* ==================================================================== */}
        {/* ROW 2: DATA SOURCES, VISUALS & OPERATIONAL DEFAULTS (3-COLUMN GRID)  */}
        {/* Col 1: Data Source Settings Card                                     */}
        {/* Col 2: Theme & Appearance Card                                       */}
        {/* Col 3: Planning Defaults Card                                        */}
        {/* ==================================================================== */}
        <section className="settings-row-grid settings-row2-grid">
          
          {/* Col 1: Data Source Settings */}
          <div className="dashboard-card settings-card" id="card-data-sources">
            {/* Populated dynamically by renderDataSourcesCard() in settings.js */}
          </div>

          {/* Col 2: Theme & Appearance */}
          <div className="dashboard-card settings-card" id="card-theme-appearance">
            {/* Populated dynamically by renderThemeAppearanceCard() in settings.js */}
          </div>

          {/* Col 3: Planning Defaults */}
          <div className="dashboard-card settings-card" id="card-planning-defaults">
            {/* Populated dynamically by renderPlanningDefaultsCard() in settings.js */}
          </div>

        </section>

        {/* ==================================================================== */}
        {/* ROW 3: INTEGRATIONS & SYSTEM CONFIGURATION (2-COLUMN GRID)            */}
        {/* Left (~45%): Integrations & APIs Card                                */}
        {/* Right (~55%): System Configuration Card                              */}
        {/* ==================================================================== */}
        <section className="settings-row-grid settings-row3-grid">
          
          {/* Left: Integrations & APIs */}
          <div className="dashboard-card settings-card" id="card-integrations-apis">
            {/* Populated dynamically by renderIntegrationsCard() in settings.js */}
          </div>

          {/* Right: System Configuration */}
          <div className="dashboard-card settings-card" id="card-system-config">
            {/* Populated dynamically by renderSystemConfigCard() in settings.js */}
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

  {/* 3.1 Edit Profile Modal Dialog */}
  <div className="settings-modal-overlay" id="edit-profile-modal" role="dialog" aria-modal="true" aria-labelledby="modal-profile-title">
    <div className="settings-modal-dialog">
      <div className="settings-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon blue-theme">
            <i className="fa-solid fa-user-pen"></i>
          </div>
          <div>
            <h3 className="settings-modal-title" id="modal-profile-title">Edit User Profile</h3>
            <p className="settings-modal-subtitle">Update personal credentials and divisional assignment</p>
          </div>
        </div>
        <button className="settings-modal-close-btn" id="modal-profile-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <form className="settings-modal-body" id="edit-profile-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name-input">Full Name *</label>
            <input type="text" id="profile-name-input" className="form-control" value="Harsh Singh" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-emp-input">Employee ID</label>
            <input type="text" id="profile-emp-input" className="form-control" value="TS-001" readonly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-email-input">Official Email *</label>
            <input type="email" id="profile-email-input" className="form-control" value="harsh.singh@thinksync.in" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-team-input">Organization Unit</label>
            <input type="text" id="profile-team-input" className="form-control" value="Team ThinkSync" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-dept-input">Department</label>
            <select id="profile-dept-input" className="form-control">
              <option value="Operations Planning" selected>Operations Planning</option>
              <option value="Track Engineering">Track Engineering (P-Way)</option>
              <option value="Signal & Telecom">Signal &amp; Telecom</option>
              <option value="Traction & TRD">Traction &amp; TRD</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-loc-input">Location</label>
            <input type="text" id="profile-loc-input" className="form-control" value="Ranchi, Jharkhand" />
          </div>
        </div>

        <div className="settings-modal-footer">
          <button type="button" className="btn btn-secondary" id="modal-profile-cancel-btn">Cancel</button>
          <button type="submit" className="btn btn-primary" id="modal-profile-submit-btn">
            <i className="fa-solid fa-floppy-disk"></i> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* 3.2 Manage Users Modal Dialog */}
  <div className="settings-modal-overlay" id="manage-users-modal" role="dialog" aria-modal="true" aria-labelledby="modal-users-title">
    <div className="settings-modal-dialog" style={{ maxWidth: "640px" }}>
      <div className="settings-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon blue-theme">
            <i className="fa-solid fa-users-gear"></i>
          </div>
          <div>
            <h3 className="settings-modal-title" id="modal-users-title">Manage Division Users &amp; Roles</h3>
            <p className="settings-modal-subtitle">Configure module permissions and access tiers</p>
          </div>
        </div>
        <button className="settings-modal-close-btn" id="modal-users-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <div className="settings-modal-body" id="modal-users-body">
        {/* Rendered dynamically */}
      </div>
    </div>
  </div>

  {/* 3.3 Manage APIs Modal Dialog */}
  <div className="settings-modal-overlay" id="manage-apis-modal" role="dialog" aria-modal="true" aria-labelledby="modal-apis-title">
    <div className="settings-modal-dialog">
      <div className="settings-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon purple-theme">
            <i className="fa-solid fa-plug-circle-bolt"></i>
          </div>
          <div>
            <h3 className="settings-modal-title" id="modal-apis-title">Manage Integrations &amp; Webhooks</h3>
            <p className="settings-modal-subtitle">Configure external API endpoints and security keys</p>
          </div>
        </div>
        <button className="settings-modal-close-btn" id="modal-apis-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <form className="settings-modal-body" id="manage-apis-form">
        <div className="form-group" style={{ marginBottom: "0.85rem" }}>
          <label className="form-label" htmlFor="webhook-url-input">Disaster Management Webhook Endpoint</label>
          <input type="url" id="webhook-url-input" className="form-control" placeholder="https://api.railways.gov.in/v1/webhook" style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #CBD5E1" }} />
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label" htmlFor="api-secret-input">API Secret Key</label>
          <input type="password" id="api-secret-input" className="form-control" value="••••••••••••••••••••••••" style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #CBD5E1" }} />
        </div>

        <div className="settings-modal-footer">
          <button type="button" className="btn btn-secondary" id="modal-apis-cancel-btn">Cancel</button>
          <button type="submit" className="btn btn-primary" id="modal-apis-submit-btn">
            <i className="fa-solid fa-link"></i> Save Integration
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* 3.4 System Logs Modal Dialog */}
  <div className="settings-modal-overlay" id="system-logs-modal" role="dialog" aria-modal="true" aria-labelledby="modal-logs-title">
    <div className="settings-modal-dialog" style={{ maxWidth: "700px" }}>
      <div className="settings-modal-header">
        <div className="modal-title-wrap">
          <div className="modal-badge-icon blue-theme">
            <i className="fa-solid fa-file-waveform"></i>
          </div>
          <div>
            <h3 className="settings-modal-title" id="modal-logs-title">System Configuration &amp; Audit Logs</h3>
            <p className="settings-modal-subtitle">Chronological ledger of security and config changes</p>
          </div>
        </div>
        <button className="settings-modal-close-btn" id="modal-logs-close-btn" aria-label="Close dialog">&times;</button>
      </div>

      <div className="settings-modal-body" id="modal-logs-body">
        {/* Rendered dynamically */}
      </div>
    </div>
  </div>

  {/* Toast Notification Container */}
  <div className="toast-container" id="toast-container"></div>

  {/* Dynamic Application Engine */}
    </>
  );
}

export default Settings;
