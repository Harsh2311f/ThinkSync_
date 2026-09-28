/* ==========================================================================
   THINKSYNC DASHBOARD ENGINE - JAVASCRIPT SYSTEM
   Architecture: Model - View - Controller (Data -> Render Functions -> Events)
   Indian Railways - Jharkhand Division Maintenance & Block Optimization
   
   HOW THIS CODE WORKS:
   1. All application data is stored in JavaScript objects & arrays (PART 1).
      No business data is hardcoded inside the HTML file!
   2. Dedicated render functions read this data and dynamically create HTML
      elements in the DOM on page load (PART 2).
   3. DEFENSIVE DATA FALLBACK: If ANY dataset is missing, null, undefined,
      or empty, the renderer shows a clean 'Not Found' / 'No Data Available'
      placeholder WITHOUT removing the card, header, or surrounding layout!
   4. MAP UPDATE: Jharkhand Railway Network Live Health Map is updated to
      display a modern 'Coming Soon' deployment screen instead of SVG map.
   5. User interactions (clicks, modals, search, zoom, toasts) are handled
      by interactive event listeners (PART 4).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     PART 1: DATA STORE (MODEL)
     All dashboard metrics, tables, alerts, and plan options are defined here.
     ========================================================================== */

  // --------------------------------------------------------------------------
  // 1.1 User Profile & Notifications Data
  // --------------------------------------------------------------------------
  const userProfileData = {
    name: 'Rajesh',
    role: 'Team ThinkSync',
    avatarText: 'HS',
    unreadAlertCount: 3
  };

  const notificationsData = [
    {
      id: 1,
      type: 'danger',
      icon: 'fa-triangle-exclamation',
      title: 'High Risk Track Geometry',
      desc: 'JH-DHN-007 risk score escalated to 87.',
      time: '10 mins ago'
    },
    {
      id: 2,
      type: 'warning',
      icon: 'fa-box-open',
      title: 'Resource Shortage Detected',
      desc: 'Ballast Tamping Machine required for JH-BOK-002.',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'info',
      icon: 'fa-route',
      title: 'Freight Schedule Trigger',
      desc: 'Freight 18625 delay recalculated block window.',
      time: '2 hours ago'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.2 Top 6 KPI Metrics Data
  // Values, percentage trends, subtitles, and icons matching the reference image
  // --------------------------------------------------------------------------
  const kpiData = [
    {
      id: 'sections',
      title: 'Total Sections',
      value: '28',
      trend: '↑ 12%',
      isPositive: true,
      subtext: 'In Jharkhand Division',
      iconSvg: '<svg class="kpi-track-svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v20"></path><path d="M19 2v20"></path><path d="M5 6h14"></path><path d="M5 12h14"></path><path d="M5 18h14"></path></svg>',
      icon: 'fa-route',
      colorClass: 'dark-blue'
    },
    {
      id: 'tasks',
      title: 'Pending Tasks',
      value: '156',
      trend: '↑ 18%',
      isPositive: false, // More pending tasks is red/negative
      subtext: 'Across TMS / SMMS / TDMS',
      icon: 'fa-clipboard-check',
      colorClass: 'orange'
    },
    {
      id: 'blocks',
      title: 'Blocks This Month',
      value: '42',
      trend: '↑ 10%',
      isPositive: true,
      subtext: 'Scheduled Blocks',
      icon: 'fa-clock',
      colorClass: 'blue'
    },
    {
      id: 'trains',
      title: 'Trains Affected (Est.)',
      value: '24',
      trend: '↓ 32%',
      isPositive: true, // Fewer trains affected is good (green)
      subtext: 'vs Manual Planning',
      icon: 'fa-train',
      colorClass: 'cyan'
    },
    {
      id: 'resources',
      title: 'Resource Utilization',
      value: '78%',
      trend: '↑ 6%',
      isPositive: true,
      subtext: 'Men + Machines + Materials',
      icon: 'fa-users',
      colorClass: 'purple'
    },
    {
      id: 'carbon',
      title: 'Carbon Impact',
      value: '-18%',
      trend: '↓ 10%',
      isPositive: true, // Lower carbon emissions is good (green)
      subtext: 'Estimated Emissions',
      icon: 'fa-leaf',
      colorClass: 'green'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.3 Critical Alerts Data (Matching Screenshot Visual Layout)
  // --------------------------------------------------------------------------
  const alertsData = [
    {
      id: 'alert-1',
      severity: 'critical',
      icon: 'fa-triangle-exclamation',
      title: 'High Risk Section',
      subTitle: 'JH-DHN-007',
      desc: 'Track geometry deviation high',
      riskScore: '87',
      time: '2 hours ago'
    },
    {
      id: 'alert-2',
      severity: 'warning',
      icon: 'fa-triangle-exclamation',
      title: 'Resource Shortage',
      subTitle: 'Ballast Tamping Machine',
      desc: 'Not available for JH-BOK-002',
      alternate: 'BTM-02',
      time: '5 hours ago'
    },
    {
      id: 'alert-3',
      severity: 'info',
      icon: 'fa-circle-info',
      title: 'Dynamic Replanning Trigger',
      subTitle: '',
      desc: 'Freight train rescheduled',
      metaDesc: 'Recalculating optimal plan...',
      time: '6 hours ago'
    },
    {
      id: 'alert-4',
      severity: 'warning',
      icon: 'fa-triangle-exclamation',
      title: 'Overdue Maintenance',
      subTitle: 'JH-RNC-013',
      desc: 'Routine track inspection overdue',
      time: '8 hours ago'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.4 Today's Executive Summary Data
  // --------------------------------------------------------------------------
  const executiveSummaryData = {
    date: 'Friday, 12 Sep 2026',
    statusTitle: 'Network is Stable',
    statusDesc: 'No critical disruptions. 3 sections under watch.',
    miniKpis: [
      { value: '1', label: 'Critical Section', colorClass: 'text-danger', boxClass: 'critical-box' },
      { value: '5', label: 'Sections Moderate', colorClass: 'text-warning', boxClass: 'moderate-box' },
      { value: '42', label: 'Planned Blocks', colorClass: 'text-primary', boxClass: 'blocks-box' },
      { value: '93%', label: 'On-Time Trains', colorClass: 'text-success', boxClass: 'ontime-box' }
    ]
  };

  // --------------------------------------------------------------------------
  // 1.5 AI Plan Suggestions Data (3 Side-by-Side Options: Plan A, B, C)
  // --------------------------------------------------------------------------
  const aiPlansData = [
    {
      key: 'A',
      title: 'Plan A – Optimal',
      isRecommended: true,
      cardClass: 'plan-a',
      icon: 'fa-lightbulb',
      iconColorClass: 'green',
      bullets: [
        'Total Blocks: 3',
        'Avg. Delay: 12 min',
        'Resource Utilization: 78%',
        'Impact Level: Low'
      ],
      btnText: 'View Plan A',
      btnClass: 'btn-green',
      modalData: {
        title: 'Plan A – Optimal AI Block Plan (Recommended)',
        blocks: '3',
        delay: '12 min',
        res: '78%',
        impact: 'Low',
        timeline: [
          { section: 'JH-DHN-007 (Dhanbad Link)', time: '11:30 AM - 01:45 PM (2.25 hrs)', desc: 'Track Geometry Realignment' },
          { section: 'JH-BOK-002 (Bokaro Line)', time: '02:00 PM - 04:00 PM (2.0 hrs)', desc: 'Ballast Tamping with BTM-02' },
          { section: 'JH-RNC-013 (Ranchi Track)', time: '04:30 PM - 06:00 PM (1.5 hrs)', desc: 'Overhead Equipment (OHE) Check' }
        ]
      }
    },
    {
      key: 'B',
      title: 'Plan B – Alternative',
      isRecommended: false,
      cardClass: 'plan-b',
      icon: 'fa-user-group',
      iconColorClass: 'blue',
      bullets: [
        'Total Blocks: 4',
        'Avg. Delay: 18 min',
        'Resource Utilization: 71%',
        'Impact Level: Medium'
      ],
      btnText: 'View Plan B',
      btnClass: 'btn-blue',
      modalData: {
        title: 'Plan B – Alternative Balanced Plan',
        blocks: '4',
        delay: '18 min',
        res: '71%',
        impact: 'Medium',
        timeline: [
          { section: 'JH-DHN-007', time: '12:00 PM - 02:30 PM (2.5 hrs)', desc: 'Section Maintenance' },
          { section: 'JH-KDR-001', time: '01:00 PM - 03:00 PM (2.0 hrs)', desc: 'Switch Point Overhaul' },
          { section: 'JH-BOK-002', time: '03:15 PM - 05:15 PM (2.0 hrs)', desc: 'Ballast Cleaning' },
          { section: 'JH-RNC-013', time: '05:30 PM - 07:00 PM (1.5 hrs)', desc: 'Inspection Walkthrough' }
        ]
      }
    },
    {
      key: 'C',
      title: 'Plan C – Emergency',
      isRecommended: false,
      cardClass: 'plan-c',
      icon: 'fa-triangle-exclamation',
      iconColorClass: 'red',
      bullets: [
        'Total Blocks: 5',
        'Avg. Delay: 9 min',
        'Resource Utilization: 85%',
        'Impact Level: High'
      ],
      btnText: 'View Plan C',
      btnClass: 'btn-red',
      modalData: {
        title: 'Plan C – Emergency Fast-Track Plan',
        blocks: '5',
        delay: '9 min',
        res: '85%',
        impact: 'High',
        timeline: [
          { section: 'JH-DHN-007', time: '11:00 AM - 01:00 PM (2.0 hrs)', desc: 'Urgent Rail Replacement' },
          { section: 'JH-BOK-002', time: '01:15 PM - 03:00 PM (1.75 hrs)', desc: 'Track Deep Tamping' },
          { section: 'JH-JMT-001', time: '03:15 PM - 04:45 PM (1.5 hrs)', desc: 'Signal Cable Replacement' },
          { section: 'JH-RNC-013', time: '05:00 PM - 06:30 PM (1.5 hrs)', desc: 'Routine Safety Audit' },
          { section: 'JH-PKR-001', time: '07:00 PM - 08:30 PM (1.5 hrs)', desc: 'Bridge Joint Reinforcement' }
        ]
      }
    }
  ];

  // --------------------------------------------------------------------------
  // 1.6 Maintenance Task Overview Data (Donut Chart & Priority Legend)
  // --------------------------------------------------------------------------
  const taskOverviewData = {
    total: 156,
    high: 42,
    medium: 68,
    low: 46
  };

  // --------------------------------------------------------------------------
  // 1.7 Train Movements (Next 24 Hours) Table Data
  // --------------------------------------------------------------------------
  const trainMovementsData = [
    {
      no: '12810',
      type: 'Passenger',
      route: 'Ranchi → Dhanbad',
      status: 'On Time',
      statusType: 'good',
      badgeClass: 'badge-success-pill',
      eta: '10:30'
    },
    {
      no: '13351',
      type: 'Express',
      route: 'Hatia → Asansol',
      status: 'Delayed (32 min)',
      statusType: 'critical',
      badgeClass: 'badge-danger-pill',
      eta: '11:45'
    },
    {
      no: '18111',
      type: 'Goods',
      route: 'Bokaro → Dhanbad',
      status: 'On Time',
      statusType: 'good',
      badgeClass: 'badge-success-pill',
      eta: '12:20'
    },
    {
      no: '18625',
      type: 'Freight',
      route: 'Tatanagar → Ranchi',
      status: 'On Time',
      statusType: 'good',
      badgeClass: 'badge-success-pill',
      eta: '14:10'
    },
    {
      no: '12020',
      type: 'Shatabdi',
      route: 'Ranchi → Howrah',
      status: 'On Time',
      statusType: 'good',
      badgeClass: 'badge-success-pill',
      eta: '16:35'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.8 Optimization Summary 4 Tiles Data
  // --------------------------------------------------------------------------
  const optimizationSummaryData = [
    {
      value: '12%',
      label: 'Total Delay Reduction',
      subtext: 'vs Manual Planning',
      icon: 'fa-chart-column',
      colorClass: 'green'
    },
    {
      value: '₹ 2.4 Cr',
      label: 'Estimated Cost Savings',
      subtext: '(This Quarter)',
      icon: 'fa-indian-rupee-sign',
      colorClass: 'blue'
    },
    {
      value: '18%',
      label: 'Lower Carbon Emissions',
      subtext: 'Estimated Impact',
      icon: 'fa-leaf',
      colorClass: 'purple'
    },
    {
      value: '95%',
      label: 'Plan Feasibility',
      subtext: 'AI Confidence',
      icon: 'fa-gears',
      colorClass: 'orange'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.9 Sidebar Train Card & Footer Data
  // --------------------------------------------------------------------------
  const sidebarCardData = {
    imageSrc: 'train_banner.jpg',
    sloganLine1: 'Better Planning',
    sloganLine2: 'Safer Journeys'
  };

  const footerData = {
    quote: '"Optimizing today for a safer, stronger tomorrow."',
    links: [
      'Indian Railways',
      'Smart Infrastructure',
      'Connected India',
      'ThinkSync'
    ]
  };

  // --------------------------------------------------------------------------
  // 1.10 Global Searchable Records Database
  // --------------------------------------------------------------------------
  const searchableRecords = [
    { title: 'JH-DHN-007 (Track Section)', sub: 'Critical – Deviation score 87 | Bokaro-Dhanbad', type: 'section' },
    { title: 'JH-BOK-002 (Bokaro Line)', sub: 'Resource Shortage – Needs BTM-02', type: 'section' },
    { title: 'JH-RNC-013 (Ranchi Track)', sub: 'Inspection Overdue – Moderate Health', type: 'section' },
    { title: 'Ranchi Junction (RNC)', sub: 'Major Division Hub Station | Optimal Health', type: 'station' },
    { title: 'Dhanbad Junction (DHN)', sub: 'High Freight Density | Critical Section Active', type: 'station' },
    { title: 'Train 12810 (Passenger)', sub: 'Ranchi → Dhanbad | On Time (ETA 10:30)', type: 'train' },
    { title: 'Train 13351 (Express)', sub: 'Hatia → Asansol | Delayed 32 min (ETA 11:45)', type: 'train' },
    { title: 'Train 18111 (Goods)', sub: 'Bokaro → Dhanbad | On Time (ETA 12:20)', type: 'train' },
    { title: 'Train 18625 (Freight)', sub: 'Tatanagar → Ranchi | On Time (ETA 14:10)', type: 'train' },
    { title: 'Train 12020 (Shatabdi)', sub: 'Ranchi → Howrah | On Time (ETA 16:35)', type: 'train' },
    { title: 'BTM-02 (Ballast Tamping)', sub: 'Available Machinery | Ready for Dispatch', type: 'resource' }
  ];


  /* ==========================================================================
     PART 2: RENDER FUNCTIONS (VIEW) WITH NOT-FOUND DEFENSIVE FALLBACKS
     Each function validates incoming data. If data is missing or empty,
     it displays 'Not Found' inside that widget without breaking layout.
     ========================================================================== */

  // --------------------------------------------------------------------------
  // 2.1 Render Header & User Profile
  // --------------------------------------------------------------------------
  function renderUserProfile(profile = userProfileData, notifs = notificationsData) {
    const profileContainer = document.getElementById('user-profile-container');
    if (profileContainer) {
      if (!profile || typeof profile !== 'object') {
        profileContainer.innerHTML = `
          <div class="user-avatar" title="Rajesh - Team ThinkSync">HS</div>
          <div class="user-info">
            <span class="user-name">Rajesh</span>
            <span class="user-role">Team ThinkSync</span>
          </div>
          <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
        `;
      } else {
        profileContainer.innerHTML = `
          <div class="user-avatar" title="${profile.name || 'Rajesh'} - ${profile.role || 'Team ThinkSync'}">${profile.avatarText || 'HS'}</div>
          <div class="user-info">
            <span class="user-name">${profile.name || 'Rajesh'}</span>
            <span class="user-role">${profile.role || 'Team ThinkSync'}</span>
          </div>
          <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
        `;
      }
    }

    // Notification badges
    const unreadCount = (profile && profile.unreadAlertCount !== undefined) ? profile.unreadAlertCount : 0;
    const headerNotifBadge = document.getElementById('header-notif-badge');
    const notifDropdownCount = document.getElementById('notif-dropdown-count');

    if (headerNotifBadge) headerNotifBadge.textContent = unreadCount;
    if (notifDropdownCount) notifDropdownCount.textContent = `${unreadCount} New`;

    // Notification dropdown items list
    const notifListContainer = document.getElementById('notif-list-container');
    if (notifListContainer) {
      if (!notifs || !Array.isArray(notifs) || notifs.length === 0) {
        notifListContainer.innerHTML = `
          <div class="not-found-state" style="border:none; min-height:80px;">
            <i class="fa-solid fa-bell-slash"></i>
            <span class="not-found-title">No Notifications Found</span>
          </div>
        `;
      } else {
        notifListContainer.innerHTML = notifs.map(n => `
          <div class="notif-item">
            <div class="notif-icon ${n.type || 'info'}">
              <i class="fa-solid ${n.icon || 'fa-info'}"></i>
            </div>
            <div class="notif-body">
              <p class="notif-title">${n.title || 'Notification'}</p>
              <p class="notif-desc">${n.desc || 'No description provided'}</p>
              <span class="notif-time">${n.time || ''}</span>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2.2 Render Top 6 KPI Metric Cards
  // If kpiData is empty or not available, displays clean 'Not Found' without
  // removing the section container or breaking the dashboard grid!
  // --------------------------------------------------------------------------
  function renderKPICards(metrics = kpiData) {
    const container = document.getElementById('kpi-grid-container');
    if (!container) return;

    // DEFENSIVE CHECK: When data is not available, show Not Found without removing container
    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      container.innerHTML = `
        <div class="not-found-state" style="grid-column: 1 / -1; min-height: 72px; flex-direction: row; gap: 0.75rem;">
          <i class="fa-solid fa-database" style="font-size: 1.1rem; margin: 0;"></i>
          <span class="not-found-title">KPI Metrics Data Not Found</span>
          <span class="not-found-desc">&bull; Telemetry stream unavailable</span>
        </div>
      `;
      return;
    }

    container.innerHTML = metrics.map(kpi => {
      // Fallback for individual missing fields
      const val = (kpi.value !== undefined && kpi.value !== null) ? kpi.value : 'Not Found';
      const title = kpi.title || 'Metric Not Found';
      const trend = kpi.trend || '--';
      const sub = kpi.subtext || '';
      const icon = kpi.icon || 'fa-chart-simple';
      const color = kpi.colorClass || 'dark-blue';
      const iconMarkup = kpi.iconSvg ? kpi.iconSvg : `<i class="fa-solid ${icon}"></i>`;

      return `
        <div class="kpi-card" data-kpi="${kpi.id || ''}">
          <div class="kpi-icon-box ${color}">
            ${iconMarkup}
          </div>
          <div class="kpi-details">
            <span class="kpi-label">${title}</span>
            <div class="kpi-value-row">
              <span class="kpi-number" data-target="${val}">${val}</span>
              <span class="kpi-change ${kpi.isPositive ? 'positive' : 'negative'}">
                ${trend}
              </span>
            </div>
            <span class="kpi-subtext">${sub}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 2.3 Render Jharkhand Railway Map (COMING SOON VIEW)
  // Replaces the SVG map with an animated, modern 'Coming Soon' presentation
  // while keeping the card container and header intact!
  // --------------------------------------------------------------------------
  function renderRailwayMap() {
    // 1. Status ribbon banner
    const legendContainer = document.getElementById('map-legend-container');
    if (legendContainer) {
      legendContainer.innerHTML = `
        <span class="legend-item" style="color:#D97706; font-weight:600; font-size:0.68rem;">
          <i class="fa-solid fa-satellite-dish" style="margin-right:4px;"></i> 
          Satellite GIS & Track Sensor Telemetry Integration Underway &bull; Phase 2 Deployment
        </span>
      `;
    }

    // 2. Coming Soon Viewport Presentation
    const viewport = document.getElementById('map-viewport');
    if (viewport) {
      viewport.innerHTML = `
        <div class="coming-soon-container">
          
          <!-- Animated Radar / Telemetry Beacon -->
          <div class="coming-soon-beacon">
            <i class="fa-solid fa-map-location-dot"></i>
          </div>

          <!-- Status Badge -->
          <div class="coming-soon-badge">
            <i class="fa-solid fa-clock"></i> Deployment in Progress
          </div>

          <!-- Main Title -->
          <h3 class="coming-soon-title">Jharkhand Railway Health Map &ndash; Coming Soon</h3>

          <!-- Explanatory Subtitle -->
          <p class="coming-soon-desc">
            The interactive GIS railway network map with real-time acoustic track sensors, 
            TMS geometry feeds, and live locomotive GPS tracking is currently being deployed for Jharkhand Division.
          </p>

          <!-- Feature Capability Pills -->
          <div class="coming-soon-features">
            <span class="coming-soon-pill">
              <i class="fa-solid fa-satellite"></i> Satellite GIS Mapping
            </span>
            <span class="coming-soon-pill">
              <i class="fa-solid fa-tower-broadcast"></i> IoT Track Sensors
            </span>
            <span class="coming-soon-pill">
              <i class="fa-solid fa-train"></i> Live Train GPS Feeds
            </span>
            <span class="coming-soon-pill">
              <i class="fa-solid fa-shield-halved"></i> Automated Block Alerts
            </span>
          </div>

        </div>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // 2.4 Render Critical Alerts List
  // If alertsData is empty or null, shows 'No Alerts Found' without removing card!
  // --------------------------------------------------------------------------
  function renderCriticalAlerts(alerts = alertsData) {
    const container = document.getElementById('critical-alerts-container');
    if (!container) return;

    // DEFENSIVE CHECK: When data is not available, show Not Found
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
      container.innerHTML = `
        <div class="not-found-state">
          <i class="fa-solid fa-bell-slash"></i>
          <span class="not-found-title">Critical Alerts Not Found</span>
          <span class="not-found-desc">All division track sections are operating within safe parameters</span>
        </div>
      `;
      return;
    }

    container.innerHTML = alerts.map(alert => {
      const title = alert.title || 'Alert Not Found';
      const desc = alert.desc || 'No description available';
      const severity = alert.severity || 'warning';
      const icon = alert.icon || 'fa-triangle-exclamation';

      return `
        <div class="alert-card-item ${severity}" data-id="${alert.id || ''}">
          <div class="alert-icon-square ${severity}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="alert-content-col">
            <div class="alert-title-main ${severity}">
              ${title}
            </div>
            ${alert.subTitle ? `<div class="alert-subtitle-bold">${alert.subTitle}</div>` : ''}
            <div class="alert-body-desc">${desc}</div>
            ${alert.metaDesc ? `<div class="alert-body-desc" style="color:#0284C7;">${alert.metaDesc}</div>` : ''}
            <div class="alert-meta-row">
              ${alert.riskScore ? `<span class="alert-risk-score">Risk Score: ${alert.riskScore}</span>` : ''}
              ${alert.alternate ? `<span style="font-size:0.62rem; color:#475569;">Suggested alternate: <strong>${alert.alternate}</strong></span>` : ''}
              <span class="alert-time-muted">${alert.time || ''}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 2.5 Render Today's Executive Summary
  // If summary data is empty or missing, shows 'Not Found' without breaking card
  // --------------------------------------------------------------------------
  function renderExecutiveSummary(summary = executiveSummaryData) {
    const dateEl = document.getElementById('exec-date');
    const statusBox = document.getElementById('exec-status-box');
    const miniKpisGrid = document.getElementById('exec-mini-kpis');

    if (!summary || typeof summary !== 'object') {
      if (dateEl) dateEl.textContent = 'Date Not Found';
      if (statusBox) {
        statusBox.innerHTML = `
          <div class="not-found-state" style="min-height:55px; border:none; background:transparent;">
            <span class="not-found-title">Executive Summary Data Not Found</span>
          </div>
        `;
      }
      if (miniKpisGrid) {
        miniKpisGrid.innerHTML = `
          <div class="not-found-state" style="grid-column: 1 / -1; min-height:50px;">
            <span class="not-found-desc">Summary metrics not available</span>
          </div>
        `;
      }
      return;
    }

    if (dateEl) dateEl.textContent = summary.date || 'Friday, 12 Sep 2026';

    if (statusBox) {
      statusBox.innerHTML = `
        <div class="target-icon-box">
          <i class="fa-solid fa-bullseye"></i>
        </div>
        <div class="summary-status-content">
          <h3 class="status-heading">${summary.statusTitle || 'Network Status Not Found'}</h3>
          <p class="status-sub">${summary.statusDesc || 'Telemetry monitoring active'}</p>
        </div>
      `;
    }

    if (miniKpisGrid) {
      if (!summary.miniKpis || !Array.isArray(summary.miniKpis) || summary.miniKpis.length === 0) {
        miniKpisGrid.innerHTML = `
          <div class="not-found-state" style="grid-column: 1 / -1; min-height:50px;">
            <span class="not-found-desc">No mini metrics found</span>
          </div>
        `;
      } else {
        miniKpisGrid.innerHTML = summary.miniKpis.map(kpi => `
          <div class="mini-kpi ${kpi.boxClass || ''}">
            <span class="mini-val ${kpi.colorClass || ''}">${kpi.value ?? 'N/A'}</span>
            <span class="mini-lbl">${kpi.label || 'Metric'}</span>
          </div>
        `).join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2.6 Render AI Plan Suggestions (3 Side-by-Side Cards)
  // If aiPlansData is empty or missing, shows 'Not Found' without removing card!
  // --------------------------------------------------------------------------
  function renderAIPlans(plans = aiPlansData) {
    const container = document.getElementById('ai-plans-container');
    if (!container) return;

    // DEFENSIVE CHECK: When data is not available, show Not Found
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      container.innerHTML = `
        <div class="not-found-state" style="grid-column: 1 / -1; min-height: 140px;">
          <i class="fa-solid fa-robot"></i>
          <span class="not-found-title">AI Plan Suggestions Not Found</span>
          <span class="not-found-desc">AI optimization engine is currently compiling block recommendations</span>
        </div>
      `;
      return;
    }

    container.innerHTML = plans.map(plan => `
      <div class="plan-column-box ${plan.cardClass || ''}">
        <div class="plan-col-header">
          <div class="plan-col-title-row">
            <span class="plan-col-icon ${plan.iconColorClass || 'green'}">
              <i class="fa-solid ${plan.icon || 'fa-lightbulb'}"></i>
            </span>
            <span class="plan-col-name">${plan.title || 'Plan Not Found'}</span>
          </div>
          ${plan.isRecommended ? '<span class="recommend-badge">Recommended</span>' : ''}
          <ul class="plan-col-bullets">
            ${(plan.bullets && Array.isArray(plan.bullets)) 
              ? plan.bullets.map(b => `<li>${b}</li>`).join('') 
              : '<li>Details Not Found</li>'}
          </ul>
        </div>
        <button class="btn-plan-col ${plan.btnClass || 'btn-green'}" data-plan="${plan.key || ''}">
          ${plan.btnText || 'View Plan'}
        </button>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 2.7 Render Maintenance Task Overview (Dynamic SVG Donut Chart & Legend)
  // If taskOverviewData is missing, shows 'Not Found' without breaking container
  // --------------------------------------------------------------------------
  function renderTaskDonutChart(taskData = taskOverviewData) {
    const container = document.getElementById('donut-chart-container');
    if (!container) return;

    // DEFENSIVE CHECK: When data is not available, show Not Found
    if (!taskData || typeof taskData !== 'object' || taskData.total === undefined || taskData.total === null || taskData.total === 0) {
      container.innerHTML = `
        <div class="not-found-state">
          <i class="fa-solid fa-chart-pie"></i>
          <span class="not-found-title">Maintenance Tasks Not Found</span>
          <span class="not-found-desc">No work order data available for this division</span>
        </div>
      `;
      return;
    }

    // Mathematics for SVG Donut slices (radius = 70, circumference = 2 * PI * 70 = 439.82)
    const radius = 70;
    const circumference = 2 * Math.PI * radius; // ~439.82
    const total = taskData.total;

    const highLength = ((taskData.high || 0) / total) * circumference;
    const mediumLength = ((taskData.medium || 0) / total) * circumference;
    const lowLength = ((taskData.low || 0) / total) * circumference;

    const highOffset = 0;
    const mediumOffset = -highLength;
    const lowOffset = -(highLength + mediumLength);

    container.innerHTML = `
      <div class="donut-svg-wrapper">
        <svg viewBox="0 0 200 200" class="donut-svg">
          <circle cx="100" cy="100" r="${radius}" class="donut-ring-bg" />
          
          <circle cx="100" cy="100" r="${radius}" 
                  class="donut-slice slice-high" 
                  stroke-dasharray="${highLength.toFixed(1)} ${circumference.toFixed(1)}" 
                  stroke-dashoffset="${highOffset.toFixed(1)}" />
                  
          <circle cx="100" cy="100" r="${radius}" 
                  class="donut-slice slice-medium" 
                  stroke-dasharray="${mediumLength.toFixed(1)} ${circumference.toFixed(1)}" 
                  stroke-dashoffset="${mediumOffset.toFixed(1)}" />
                  
          <circle cx="100" cy="100" r="${radius}" 
                  class="donut-slice slice-low" 
                  stroke-dasharray="${lowLength.toFixed(1)} ${circumference.toFixed(1)}" 
                  stroke-dashoffset="${lowOffset.toFixed(1)}" />
        </svg>

        <div class="donut-center-text">
          <span class="center-count">${total}</span>
          <span class="center-label">Tasks</span>
        </div>
      </div>

      <div class="donut-legend">
        <div class="legend-row" data-priority="high">
          <span class="legend-dot-square red"></span>
          <span class="legend-name">High Priority</span>
          <span class="legend-val">${taskData.high ?? 0}</span>
        </div>
        <div class="legend-row" data-priority="medium">
          <span class="legend-dot-square yellow"></span>
          <span class="legend-name">Medium Priority</span>
          <span class="legend-val">${taskData.medium ?? 0}</span>
        </div>
        <div class="legend-row" data-priority="low">
          <span class="legend-dot-square green"></span>
          <span class="legend-name">Low Priority</span>
          <span class="legend-val">${taskData.low ?? 0}</span>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 2.8 Render Train Movements Table
  // If trainMovementsData is empty or missing, shows 'Train Records Not Found'
  // --------------------------------------------------------------------------
  function renderTrainMovements(trains = trainMovementsData) {
    const tableBody = document.getElementById('trains-table-body');
    if (!tableBody) return;

    // DEFENSIVE CHECK: When data is not available, show Not Found row
    if (!trains || !Array.isArray(trains) || trains.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="not-found-row">
            <i class="fa-solid fa-train"></i> Train Movement Records Not Found
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = trains.map(train => `
      <tr data-train="${train.no || ''}">
        <td class="font-mono" style="font-weight:700;">${train.no || 'N/A'}</td>
        <td>${train.type || 'Passenger'}</td>
        <td>${train.route || 'Route Not Found'}</td>
        <td>
          <span class="badge ${train.badgeClass || 'badge-info'}">
            <span class="dot ${train.statusType || 'good'}"></span> ${train.status || 'Scheduled'}
          </span>
        </td>
        <td class="font-mono" style="font-weight:600;">${train.eta || '--:--'}</td>
      </tr>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 2.9 Render Optimization Summary (4 Horizontal Tiles)
  // If optimization data is missing, shows 'Not Found' without removing card
  // --------------------------------------------------------------------------
  function renderOptimizationSummary(tiles = optimizationSummaryData) {
    const container = document.getElementById('opt-tiles-container');
    if (!container) return;

    // DEFENSIVE CHECK: When data is not available, show Not Found
    if (!tiles || !Array.isArray(tiles) || tiles.length === 0) {
      container.innerHTML = `
        <div class="not-found-state" style="grid-column: 1 / -1; min-height: 120px;">
          <i class="fa-solid fa-chart-line"></i>
          <span class="not-found-title">Optimization Metrics Not Found</span>
          <span class="not-found-desc">Financial savings and carbon efficiency data is currently calculating</span>
        </div>
      `;
      return;
    }

    container.innerHTML = tiles.map(tile => {
      const val = tile.value ?? 'Not Found';
      const label = tile.label || 'Metric Not Found';
      const sub = tile.subtext || '';
      const icon = tile.icon || 'fa-chart-column';
      const color = tile.colorClass || 'green';

      return `
        <div class="opt-tile ${color}">
          <div class="opt-icon-box ${color}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="opt-val">${val}</div>
          <div class="opt-title">${label}</div>
          <div class="opt-sub">${sub}</div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 2.10 Render Sidebar Bottom Card & Footer Bar
  // --------------------------------------------------------------------------
  function renderSidebarAndFooter(cardData = sidebarCardData, fData = footerData) {
    // Sidebar Train Card
    const trainCardContainer = document.getElementById('sidebar-train-card');
    if (trainCardContainer) {
      if (!cardData) {
        trainCardContainer.innerHTML = `
          <div class="not-found-state" style="background:#111E33; border-color:rgba(255,255,255,0.1); color:#94A3B8;">
            <span>Card Data Not Found</span>
          </div>
        `;
      } else {
        trainCardContainer.innerHTML = `
          <img src="${cardData.imageSrc || 'train_banner.jpg'}" alt="Indian Railways Train on Tracks" class="sidebar-train-card-bg">
          <div class="sidebar-train-card-overlay"></div>
          <div class="sidebar-train-card-content">
            <span class="train-card-slogan">${cardData.sloganLine1 || 'Better Planning'}</span>
            <span class="train-card-sub">${cardData.sloganLine2 || 'Safer Journeys'}</span>
            <div class="train-card-flag-badge" title="Indian Railways - Proudly Serving India">
              <div class="flag-tiranga-icon">
                <div class="flag-saffron"></div>
                <div class="flag-white"></div>
                <div class="flag-green"></div>
              </div>
            </div>
          </div>
        `;
      }
    }

    // Bottom Footer Quote and Links
    const quoteContainer = document.getElementById('footer-quote-container');
    const linksContainer = document.getElementById('footer-links-container');

    if (quoteContainer) {
      quoteContainer.innerHTML = `
        <i class="fa-solid fa-quote-left quote-icon"></i>
        <span>${(fData && fData.quote) ? fData.quote : '"Optimizing today for a safer, stronger tomorrow."'}</span>
      `;
    }

    if (linksContainer) {
      const links = (fData && Array.isArray(fData.links)) ? fData.links : ['Indian Railways', 'ThinkSync'];
      linksContainer.innerHTML = links.map((link, idx) => `
        ${idx > 0 ? '<span class="sep">|</span>' : ''}
        <span class="${idx === links.length - 1 ? 'brand-highlight' : ''}">${link}</span>
      `).join('');
    }
  }


  /* ==========================================================================
     PART 3: APPLICATION INITIALIZATION
     Executes all rendering functions to populate the empty HTML containers.
     ========================================================================== */
  function initializeDashboard() {
    renderUserProfile(userProfileData, notificationsData);
    renderKPICards(kpiData);
    renderRailwayMap();
    renderCriticalAlerts(alertsData);
    renderExecutiveSummary(executiveSummaryData);
    renderAIPlans(aiPlansData);
    renderTaskDonutChart(taskOverviewData);
    renderTrainMovements(trainMovementsData);
    renderOptimizationSummary(optimizationSummaryData);
    renderSidebarAndFooter(sidebarCardData, footerData);

    // Attach event listeners after DOM is populated
    setupInteractions();
  }

  initializeDashboard();


  /* ==========================================================================
     PART 4: INTERACTIVE FEATURES & EVENT LISTENERS (CONTROLLER)
     Handles user clicks, modals, search suggestions, toasts, and real-time clock.
     ========================================================================== */
  function setupInteractions() {

    // ------------------------------------------------------------------------
    // 4.0 Hamburger Show & Hide Toggle Button (Sidebar Header)
    // Silky smooth collapse/expand of navigation sidebar into compact dock
    // Sidebar collapse/expand is centrally managed by theme-sync.js

    // ------------------------------------------------------------------------
    // 4.1 Notify Button for Coming Soon Map
    // ------------------------------------------------------------------------
    const notifyMapBtn = document.getElementById('notify-map-btn');
    if (notifyMapBtn) {
      notifyMapBtn.addEventListener('click', () => {
        showToast('You will be notified when the Live Railway Health Map goes live!', 'success');
      });
    }

    // ------------------------------------------------------------------------
    // 4.2 Sidebar Tab Selection
    // ------------------------------------------------------------------------
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const tabLabel = item.querySelector('.nav-label')?.textContent || 'Tab';
        showToast(`Switched view to ${tabLabel}`, 'info');
      });
    });

    // ------------------------------------------------------------------------
    // 4.3 Global Live Search Dropdown Filter (With 'Not Found' Fallback)
    // ------------------------------------------------------------------------
    const searchInput = document.getElementById('global-search');
    const searchDropdown = document.getElementById('search-dropdown');

    if (searchInput && searchDropdown) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          searchDropdown.classList.remove('active');
          return;
        }

        const matches = searchableRecords.filter(item => 
          item.title.toLowerCase().includes(query) || item.sub.toLowerCase().includes(query)
        );

        // When search data is not found, display clean Not Found message
        if (matches.length === 0) {
          searchDropdown.innerHTML = `
            <div class="search-item" style="cursor:default;">
              <div class="search-item-title" style="color:#F59E0B;">
                <i class="fa-solid fa-magnifying-glass" style="margin-right:6px;"></i> Not Found
              </div>
              <div class="search-item-sub">No matching sections, stations, trains, or tasks</div>
            </div>
          `;
        } else {
          searchDropdown.innerHTML = matches.map(item => `
            <div class="search-item" data-title="${item.title}">
              <div class="search-item-title">${item.title}</div>
              <div class="search-item-sub">${item.sub}</div>
            </div>
          `).join('');
        }
        searchDropdown.classList.add('active');
      });

      searchDropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.search-item');
        if (item && item.getAttribute('data-title')) {
          const title = item.getAttribute('data-title');
          searchInput.value = title;
          searchDropdown.classList.remove('active');
          showToast(`Selected: ${title}`, 'info');
        }
      });

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove('active');
        }
      });
    }

    // ------------------------------------------------------------------------
    // 4.4 Notification Bell Dropdown Toggle
    // ------------------------------------------------------------------------
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
          notifDropdown.classList.remove('active');
        }
      });
    }

    // ------------------------------------------------------------------------
    // 4.5 Critical Alerts Click Handler
    // ------------------------------------------------------------------------
    const alertItems = document.querySelectorAll('.alert-card-item');
    alertItems.forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('.alert-title-main')?.textContent?.trim() || 'Alert';
        showToast(`Inspecting: ${title}`, 'warning');
      });
    });

    // ------------------------------------------------------------------------
    // 4.6 AI Plan Suggestions Modal (View Plan A, B, C)
    // ------------------------------------------------------------------------
    const planModal = document.getElementById('plan-modal');
    const modalPlanBadge = document.getElementById('modal-plan-badge');
    const modalPlanTitle = document.getElementById('modal-plan-title');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalExecuteBtn = document.getElementById('modal-execute-btn');
    const modalTimeline = document.getElementById('modal-timeline');

    const mBlocks = document.getElementById('m-blocks');
    const mDelay = document.getElementById('m-delay');
    const mRes = document.getElementById('m-res');
    const mImpact = document.getElementById('m-impact');

    const planButtons = document.querySelectorAll('.btn-plan-col');
    planButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const planKey = btn.getAttribute('data-plan') || 'A';
        const plan = aiPlansData.find(p => p.key === planKey);
        if (!plan) return;

        if (modalPlanBadge) {
          modalPlanBadge.textContent = `PLAN ${plan.key}`;
          modalPlanBadge.className = `modal-badge badge-${plan.key.toLowerCase()}`;
        }
        if (modalPlanTitle) {
          modalPlanTitle.textContent = plan.modalData ? plan.modalData.title : plan.title;
        }

        if (mBlocks) mBlocks.textContent = plan.modalData ? plan.modalData.blocks : '3';
        if (mDelay) mDelay.textContent = plan.modalData ? plan.modalData.delay : '12 min';
        if (mRes) mRes.textContent = plan.modalData ? plan.modalData.res : '78%';
        if (mImpact) mImpact.textContent = plan.modalData ? plan.modalData.impact : 'Low';

        if (modalTimeline && plan.modalData && Array.isArray(plan.modalData.timeline)) {
          modalTimeline.innerHTML = plan.modalData.timeline.map(item => `
            <div class="timeline-item">
              <span class="t-sec"><i class="fa-solid fa-location-dot"></i> ${item.section}</span>
              <span class="t-time"><i class="fa-regular fa-clock"></i> ${item.time}</span>
            </div>
            <div style="font-size: 0.72rem; color: #64748B; margin: -0.25rem 0 0.25rem 0.5rem;" class="t-desc">
              ${item.desc}
            </div>
          `).join('');
        }

        if (planModal) planModal.classList.add('active');
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => planModal && planModal.classList.remove('active'));
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', () => planModal && planModal.classList.remove('active'));
    if (planModal) {
      planModal.addEventListener('click', (e) => {
        if (e.target === planModal) planModal.classList.remove('active');
      });
    }

    if (modalExecuteBtn) {
      modalExecuteBtn.addEventListener('click', () => {
        if (planModal) planModal.classList.remove('active');
        showToast('AI Plan broadcasted to Indian Railways Division Controllers!', 'success');
      });
    }

    // Auto-open plan modal if requested via URL (?showplan=a|b|c)
    if (window.location.search) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const targetPlan = urlParams.get('showplan');
        if (targetPlan) {
          setTimeout(() => {
            const targetBtn = document.querySelector(`.btn-plan-col[data-plan="${targetPlan.toUpperCase()}"]`);
            if (targetBtn) targetBtn.click();
          }, 150);
        }
      } catch (e) {}
    }

    // ------------------------------------------------------------------------
    // 4.7 Train Movements Table Row Highlighting
    // ------------------------------------------------------------------------
    const trainRows = document.querySelectorAll('#trains-table tbody tr');
    trainRows.forEach(row => {
      row.addEventListener('click', () => {
        const trainNo = row.getAttribute('data-train');
        if (trainNo) {
          showToast(`Tracking Train ${trainNo} on live division telemetry`, 'info');
          row.style.background = '#DBEAFE';
          setTimeout(() => { row.style.background = ''; }, 1200);
        }
      });
    });

    // ------------------------------------------------------------------------
    // 4.8 Toast Notification System
    // ------------------------------------------------------------------------
    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      let iconClass = 'fa-circle-info';
      if (type === 'success') iconClass = 'fa-circle-check';
      if (type === 'warning') iconClass = 'fa-triangle-exclamation';
      if (type === 'danger') iconClass = 'fa-circle-xmark';

      toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

  }

  // --------------------------------------------------------------------------
  // TEST UTILITY: Expose helper functions on window to test empty data states
  // User or developers can run `ThinkSync.simulateEmptyData()` or
  // `ThinkSync.restoreData()` in browser console or append `#empty` to the URL!
  // --------------------------------------------------------------------------
  window.ThinkSync = {
    // Tests what happens when data is empty/null: all widgets show 'Not Found'
    // without removing cards or breaking the layout!
    simulateEmptyData: () => {
      renderKPICards([]);
      renderCriticalAlerts([]);
      renderExecutiveSummary(null);
      renderAIPlans([]);
      renderTaskDonutChart({ total: 0 });
      renderTrainMovements([]);
      renderOptimizationSummary([]);
    },
    // Restores default datasets
    restoreData: () => {
      renderKPICards(kpiData);
      renderCriticalAlerts(alertsData);
      renderExecutiveSummary(executiveSummaryData);
      renderAIPlans(aiPlansData);
      renderTaskDonutChart(taskOverviewData);
      renderTrainMovements(trainMovementsData);
      renderOptimizationSummary(optimizationSummaryData);
      setupInteractions();
    }
  };

  // If URL has #empty or ?empty=true, automatically simulate empty data to verify Not Found states
  if (window.location.hash === '#empty' || window.location.search.includes('empty=true')) {
    window.ThinkSync.simulateEmptyData();
  }

});

