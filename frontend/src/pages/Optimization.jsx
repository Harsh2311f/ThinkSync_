import useLegacyPage from "../hooks/useLegacyPage.js";

function Optimization() {
  useLegacyPage({
    title: "Optimization | ThinkSync",
    stylesheet: "/legacy/optimization.css",
    script: "/legacy/optimization.js",
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
        <a href="/optimization" className="nav-item active" data-tab="optimization" data-tooltip="Optimization">
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
            <input type="text" id="global-search" placeholder="Search optimization plans, corridor, rules..." autoComplete="off" />
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

      {/* 2.2 OPTIMIZATION CONTENT CANVAS */}
      <main className="optimization-page-main" id="optimization-page-main">
        
        {/* SUBHEADER TOOLBAR: Page Title, Subtitle, and AI Value Badge */}
        <section className="opt-subheader-toolbar" id="opt-subheader-toolbar">
          <div className="opt-subheader-left">
            <div className="opt-title-wrap">
              <div className="opt-title-icon-badge">
                <i className="fa-solid fa-diagram-project"></i>
              </div>
              <div>
                <h2 className="opt-title">Optimization</h2>
                <p className="opt-subtitle">Generate and compare optimized maintenance plans using AI to minimize disruption and maximize network performance.</p>
              </div>
            </div>
          </div>
          <div className="opt-subheader-right">
            <div className="opt-ai-banner-card">
              <div className="opt-ai-banner-icon">
                <i className="fa-solid fa-chart-column"></i>
              </div>
              <div className="opt-ai-banner-text">
                <span className="opt-banner-heading">Smarter Decisions. Greater Network Value.</span>
                <span className="opt-banner-sub">AI-driven optimization for a more reliable railway.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* PART 1: OPTIMIZATION INPUTS & FILTERS CONTROL BAR                    */}
        {/* ==================================================================== */}
        <section className="dashboard-card opt-controls-card" id="opt-controls-container">
          {/* Populated dynamically by renderOptimizationControls() in optimization.js */}
        </section>

        {/* ==================================================================== */}
        {/* PART 2: GENERATED PLANS & AI RECOMMENDATION GRID                     */}
        {/* Left: 3 Plans (Plan A, Plan B, Plan C)                               */}
        {/* Right: Why Plan A is Recommended + Key Assumptions                   */}
        {/* ==================================================================== */}
        <div className="opt-plans-main-grid">
          
          {/* LEFT 3 COLUMNS: Generated Plans */}
          <section className="opt-generated-plans-section">
            <div className="opt-section-header">
              <div className="opt-header-titles">
                <h3 className="opt-section-title">Generated Plans</h3>
                <p className="opt-section-subtitle">AI has generated 3 optimized maintenance plans based on your inputs.</p>
              </div>
              <div className="opt-header-meta">
                <span className="opt-gen-timestamp" id="opt-gen-timestamp">Ready for live optimization</span>
                <button className="btn-regenerate-pill" id="btn-regenerate" title="Regenerate Plans">
                  <i className="fa-solid fa-arrows-rotate"></i> Regenerate
                </button>
              </div>
            </div>

            {/* 3 Plan Cards Container (Plan A, Plan B, Plan C) */}
            <div className="opt-plan-cards-grid" id="opt-plan-cards-container">
              {/* Populated dynamically by renderPlanCards() in optimization.js */}
            </div>
          </section>

          {/* RIGHT COLUMN: AI Recommendation & Key Assumptions */}
          <aside className="opt-recommendations-sidebar">
            
            {/* Why Plan A is Recommended Card */}
            <div className="dashboard-card opt-why-card" id="opt-why-card">
              {/* Populated dynamically by renderWhyPlanA() in optimization.js */}
            </div>

            {/* Key Assumptions Card */}
            <div className="dashboard-card opt-assumptions-card" id="opt-assumptions-card">
              {/* Populated dynamically by renderKeyAssumptions() in optimization.js */}
            </div>

          </aside>

        </div>

        {/* ==================================================================== */}
        {/* PART 3: BOTTOM COMPARISON ANALYTICS ROW (4-COLUMN GRID)              */}
        {/* Col 1: Train Delay Comparison                                        */}
        {/* Col 2: Maintenance Value Score                                       */}
        {/* Col 3: Risk & Confidence                                             */}
        {/* Col 4: Plan Comparison Summary Table                                 */}
        {/* ==================================================================== */}
        <section className="opt-bottom-analytics-grid" id="opt-bottom-analytics-container">
          
          {/* Col 1: Train Delay Comparison Bar Chart */}
          <div className="dashboard-card opt-analytics-card" id="card-delay-comparison">
            {/* Populated dynamically by renderDelayComparison() in optimization.js */}
          </div>

          {/* Col 2: Maintenance Value Score Bar Chart */}
          <div className="dashboard-card opt-analytics-card" id="card-maint-score">
            {/* Populated dynamically by renderMaintScore() in optimization.js */}
          </div>

          {/* Col 3: Risk & Confidence Dual Bar Chart */}
          <div className="dashboard-card opt-analytics-card" id="card-risk-confidence">
            {/* Populated dynamically by renderRiskConfidence() in optimization.js */}
          </div>

          {/* Col 4: Plan Comparison Summary Table */}
          <div className="dashboard-card opt-analytics-card" id="card-plan-summary">
            {/* Populated dynamically by renderPlanSummaryTable() in optimization.js */}
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

  {/* 3.1 Plan Details Modal Dialog */}
  <div className="opt-modal-overlay" id="plan-details-modal" role="dialog" aria-modal="true" aria-labelledby="modal-plan-title">
    <div className="opt-modal-dialog">
      <div className="opt-modal-header" id="modal-plan-header">
        <div className="opt-modal-title-wrap">
          <div className="modal-plan-badge" id="modal-plan-badge-icon"></div>
          <div>
            <h3 className="opt-modal-title" id="modal-plan-title">Plan Details</h3>
            <p className="opt-modal-subtitle" id="modal-plan-subtitle">Operational overview &amp; block schedule configuration</p>
          </div>
        </div>
        <button className="opt-modal-close-btn" id="modal-close-btn" aria-label="Close dialog">&times;</button>
      </div>
      
      <div className="opt-modal-body" id="modal-plan-body">
        {/* Dynamically injected plan details content */}
      </div>

      <div className="opt-modal-footer">
        <button type="button" className="btn btn-secondary" id="modal-dismiss-btn">Close</button>
        <button type="button" className="btn btn-primary" id="modal-apply-btn">
          <i className="fa-solid fa-check"></i> Apply Plan to Division
        </button>
      </div>
    </div>
  </div>

  {/* 3.2 Advanced Optimization Options Modal */}
  <div className="opt-modal-overlay" id="advanced-options-modal" role="dialog" aria-modal="true" aria-labelledby="modal-adv-title">
    <div className="opt-modal-dialog">
      <div className="opt-modal-header">
        <div className="opt-modal-title-wrap">
          <div className="modal-plan-badge blue-theme">
            <i className="fa-solid fa-sliders"></i>
          </div>
          <div>
            <h3 className="opt-modal-title" id="modal-adv-title">Advanced AI Optimization Parameters</h3>
            <p className="opt-modal-subtitle">Fine-tune heuristics, penalties, and objective balance</p>
          </div>
        </div>
        <button className="opt-modal-close-btn" id="modal-adv-close-btn" aria-label="Close dialog">&times;</button>
      </div>
      
      <form className="opt-modal-body" id="advanced-options-form">
        <div className="form-group">
          <label className="form-label" htmlFor="adv-delay-penalty">Passenger Train Delay Penalty Weight (0–100)</label>
          <input type="range" id="adv-delay-penalty" min="10" max="100" value="85" className="slider-input" />
          <span className="slider-val-tag" id="adv-delay-val">85% (High Penalty)</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="adv-track-urgency">Track Urgency Weight (0–100)</label>
          <input type="range" id="adv-track-urgency" min="10" max="100" value="70" className="slider-input" />
          <span className="slider-val-tag" id="adv-urgency-val">70% (Standard Safety Factor)</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="adv-overrun-tolerance">Max Allowed Overrun Risk Threshold</label>
          <select id="adv-overrun-tolerance" className="form-control">
            <option value="15">Strict: Maximum 15% Overrun Risk</option>
            <option value="25" selected>Balanced: Maximum 25% Overrun Risk</option>
            <option value="40">Aggressive: Maximum 40% Overrun Risk</option>
          </select>
        </div>

        <div className="opt-modal-footer" style={{ paddingTop: "14px", marginTop: "10px" }}>
          <button type="button" className="btn btn-secondary" id="modal-adv-cancel-btn">Reset Defaults</button>
          <button type="submit" className="btn btn-primary" id="modal-adv-save-btn">
            <i className="fa-solid fa-save"></i> Save Parameters
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

export default Optimization;
