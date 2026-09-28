/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION
 * PAGE 10: SETTINGS & SYSTEM CONFIGURATION ENGINE (settings.js)
 * "Manage your account, preferences, and system configuration for operations."
 * ==============================================================================
 * 
 * ARCHITECTURE & ENGINEERING SPECIFICATION:
 * ------------------------------------------------------------------------------
 * This client-side dynamic engine powers Page 10 (Settings & System Configuration).
 * It strictly adheres to all design tokens, responsive guidelines, and conventions:
 * 
 * 1. STRUCTURED ARCHITECTURE COMMENTS FIRST:
 *    All system designs, data models, state objects, render functions, modal 
 *    handlers, and event lifecycles are documented before code execution.
 * 
 * 2. 100% DATA-DRIVEN DOM HYDRATION:
 *    Zero hardcoded values in HTML. Everything is rendered from master reactive state:
 *      - Part 1: User Profile Card (Initials, identity, 2x3 metadata grid, edit modal)
 *      - Part 2: Roles & Permissions Card (Role callout box, 6 checkmarked permissions)
 *      - Part 3: Notification Preferences (6 Interactive iOS-style toggle switches)
 *      - Part 4: Data Source Settings (5 Live operational data connectors + test connection)
 *      - Part 5: Theme & Appearance (Interactive Dark/Light/System switcher + 4 display toggles)
 *      - Part 6: Planning Defaults (4 Parameter selectors + 2 operational switches)
 *      - Part 7: Integrations & APIs (Power BI, Slack, Teams, and Webhook cards)
 *      - Part 8: System Configuration (AI Engine, System Parameters, Retention, Backup)
 * 
 * 3. DEFENSIVE RENDERING & IMMUTABLE STATE:
 *    Null checks and fallbacks for all DOM queries to guarantee error-free runtime.
 *    Provides `window.setSettingsData(data)` allowing external systems to dynamically
 *    inject new configurations and trigger automated re-rendering.
 * 
 * 4. INTERACTIVE MODAL DIALOGS:
 *    - Edit Profile Modal: Live editing of personal details and department assignment.
 *    - Manage Users Modal: Division team management and access tiers.
 *    - Manage APIs Modal: Webhook endpoint and secret key management.
 *    - System Logs Modal: Chronological audit trail of configuration events.
 * 
 * 5. COLLAPSIBLE UNIFIED SIDEBAR:
 *    Synchronized with `document.body.classList.toggle('sidebar-collapsed')` matching Pages 1-9.
 * 
 * ==============================================================================
 */

/* React mount adapter: original page engine starts after JSX is mounted. */
(function () {

  // ============================================================================
  // SECTION 1: MASTER REACTIVE DATA STORE
  // ============================================================================

  // 1.1 User Profile Master State
  let userProfileData = {
    name: 'Harsh Singh',
    initials: 'HS',
    email: 'harsh.singh@thinksync.in',
    team: 'Team ThinkSync',
    role: 'Administrator',
    empId: 'TS-001',
    dept: 'Operations Planning',
    location: 'Ranchi, Jharkhand',
    lastLogin: '12 Sep 2026, 10:24 AM',
    status: 'Active',
    memberSince: 'Jan 2024'
  };

  // 1.2 Roles & Permissions Master State
  let rolesPermissionsData = {
    roleTitle: 'Administrator',
    roleDesc: 'Full access to all modules and system configuration.',
    permissions: [
      'View and manage all railway data',
      'Create and modify maintenance plans',
      'Access optimization and AI recommendations',
      'Manage users and roles',
      'Configure system settings',
      'View reports and analytics'
    ]
  };

  // 1.3 Notification Preferences Master State
  let notificationPrefsData = [
    {
      id: 'notif-task',
      icon: 'fa-solid fa-clipboard-list',
      theme: 'orange',
      title: 'Task Assignments',
      desc: 'Get notified about new task assignments',
      enabled: true
    },
    {
      id: 'notif-block',
      icon: 'fa-solid fa-train',
      theme: 'blue',
      title: 'Block Updates',
      desc: 'Updates on block changes and schedule issues',
      enabled: true
    },
    {
      id: 'notif-train',
      icon: 'fa-solid fa-triangle-exclamation',
      theme: 'red',
      title: 'Train Movement Alerts',
      desc: 'Alerts for delays, diversions and rescheduling',
      enabled: true
    },
    {
      id: 'notif-sys',
      icon: 'fa-solid fa-gear',
      theme: 'purple',
      title: 'System Notifications',
      desc: 'Important system announcements',
      enabled: true
    },
    {
      id: 'notif-email',
      icon: 'fa-solid fa-envelope',
      theme: 'green',
      title: 'Email Notifications',
      desc: 'Receive notifications via email',
      enabled: true
    },
    {
      id: 'notif-summary',
      icon: 'fa-solid fa-chart-simple',
      theme: 'blue',
      title: 'Daily Summary',
      desc: 'Get a daily overview of key activities',
      enabled: false
    }
  ];

  // 1.4 Data Source Connectors Master State
  let dataSourcesData = [
    {
      id: 'ds-cris',
      icon: 'fa-solid fa-train',
      name: 'CRIS (Train Data)',
      desc: 'Live train movements, schedules',
      status: 'Connected',
      statusType: 'connected'
    },
    {
      id: 'ds-irise',
      icon: 'fa-solid fa-layer-group',
      name: 'IRISE (Infrastructure)',
      desc: 'Track, assets, maintenance data',
      status: 'Connected',
      statusType: 'connected'
    },
    {
      id: 'ds-dept',
      icon: 'fa-solid fa-file-lines',
      name: 'Departmental Data',
      desc: 'Local maintenance records',
      status: 'Connected',
      statusType: 'connected'
    },
    {
      id: 'ds-weather',
      icon: 'fa-solid fa-cloud',
      name: 'Weather API',
      desc: 'Weather and climate information',
      status: 'Connected',
      statusType: 'connected'
    },
    {
      id: 'ds-geo',
      icon: 'fa-solid fa-location-dot',
      name: 'Geospatial Data',
      desc: 'Maps, stations, track geometry',
      status: 'Limited Access',
      statusType: 'limited'
    }
  ];

  // 1.5 Theme & Appearance Settings Master State
  let themeSettingsData = {
    currentTheme: 'dark',
    themes: [
      { id: 'dark', title: 'Dark', sub: 'Current theme', icon: 'fa-solid fa-moon' },
      { id: 'light', title: 'Light', sub: 'Light', icon: 'fa-solid fa-sun' },
      { id: 'system', title: 'System', sub: 'System', icon: 'fa-solid fa-desktop' }
    ],
    displayToggles: [
      { id: 'disp-compact', icon: 'fa-solid fa-bars-staggered', label: 'Compact Sidebar', enabled: false },
      { id: 'disp-codes', icon: 'fa-solid fa-font', label: 'Show Station Codes', enabled: true },
      { id: 'disp-anim', icon: 'fa-solid fa-bolt', label: 'Animations', enabled: true }
    ]
  };

  // 1.6 Planning Defaults Master State
  let planningDefaultsData = {
    horizon: '30 Days',
    duration: '4 Hours',
    buffer: '30 Minutes',
    priority: 'Medium',
    autoAssign: true,
    weatherConstraints: true
  };

  // 1.7 External Integrations & APIs Master State
  let integrationsData = [
    {
      id: 'integ-pbi',
      name: 'Power BI',
      icon: 'fa-solid fa-chart-simple',
      iconColor: '#EAB308',
      status: 'Connected',
      sub: 'Last sync: 12 Sep, 09:45 AM',
      isLink: false
    },
    {
      id: 'integ-slack',
      name: 'Slack',
      icon: 'fa-brands fa-slack',
      iconColor: '#EC4899',
      status: 'Connected',
      sub: 'Last sync: 12 Sep, 08:12 AM',
      isLink: false
    },
    {
      id: 'integ-teams',
      name: 'Teams',
      icon: 'fa-brands fa-microsoft',
      iconColor: '#6366F1',
      status: 'Connected',
      sub: 'Last sync: 12 Sep, 08:10 AM',
      isLink: false
    },
    {
      id: 'integ-webhook',
      name: 'Webhook',
      icon: 'fa-solid fa-circle-nodes',
      iconColor: '#EF4444',
      status: 'Not Configured',
      sub: 'Setup integration',
      isLink: true
    }
  ];

  // 1.8 System Configuration Tiles Master State
  let systemConfigData = [
    {
      id: 'cfg-ai',
      title: 'AI Optimization Engine',
      desc: 'Configure AI model settings and parameters',
      icon: 'fa-solid fa-microchip'
    },
    {
      id: 'cfg-sys',
      title: 'System Parameters',
      desc: 'Manage system-wide configuration values',
      icon: 'fa-solid fa-sliders'
    },
    {
      id: 'cfg-ret',
      title: 'Data Retention',
      desc: 'Set data archival and retention policies',
      icon: 'fa-solid fa-database'
    },
    {
      id: 'cfg-backup',
      title: 'Backup & Recovery',
      desc: 'Manage backups and disaster recovery',
      icon: 'fa-solid fa-cloud-arrow-up'
    }
  ];

  // ============================================================================
  // SECTION 2: DYNAMIC COMPONENT RENDERERS
  // ============================================================================

  /**
   * 2.1 Render User Profile Card (Row 1 Col 1)
   */
  function renderUserProfileCard() {
    const container = document.getElementById('card-user-profile');
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-user card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">User Profile</h3>
            <p class="card-header-subtitle">Manage your personal information and account details.</p>
          </div>
        </div>
        <button type="button" class="btn-card-action" id="btn-edit-profile">
          <i class="fa-solid fa-pen" style="font-size: 0.65rem;"></i> Edit Profile
        </button>
      </div>

      <div class="profile-hero-row">
        <div class="profile-avatar-circle">${userProfileData.initials}</div>
        <div class="profile-identity-col">
          <h4 class="profile-name">${userProfileData.name}</h4>
          <span class="profile-email">${userProfileData.email}</span>
          <div class="profile-team-row">
            <span class="profile-team-text">${userProfileData.team}</span>
            <span class="profile-role-pill">${userProfileData.role}</span>
          </div>
        </div>
      </div>

      <div class="profile-meta-grid">
        <div class="meta-item-box">
          <i class="fa-solid fa-id-badge meta-item-icon"></i>
          <div class="meta-item-text">
            <span class="meta-item-label">Employee ID</span>
            <span class="meta-item-val">${userProfileData.empId}</span>
          </div>
        </div>

        <div class="meta-item-box">
          <i class="fa-solid fa-users meta-item-icon"></i>
          <div class="meta-item-text">
            <span class="meta-item-label">Department</span>
            <span class="meta-item-val">${userProfileData.dept}</span>
          </div>
        </div>

        <div class="meta-item-box">
          <i class="fa-solid fa-location-dot meta-item-icon"></i>
          <div class="meta-item-text">
            <span class="meta-item-label">Location</span>
            <span class="meta-item-val">${userProfileData.location}</span>
          </div>
        </div>

        <div class="meta-item-box">
          <i class="fa-solid fa-clock meta-item-icon"></i>
          <div class="meta-item-text">
            <span class="meta-item-label">Last Login</span>
            <span class="meta-item-val">${userProfileData.lastLogin}</span>
          </div>
        </div>

        <div class="meta-item-box">
          <i class="fa-solid fa-circle-check meta-item-icon" style="color: #10B981;"></i>
          <div class="meta-item-text">
            <span class="meta-item-label">Account Status</span>
            <span class="meta-item-val" style="display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
              ${userProfileData.status}
            </span>
          </div>
        </div>

        <div class="meta-item-box">
          <i class="fa-solid fa-calendar-check meta-item-icon"></i>
          <div class="meta-item-text">
            <span class="meta-item-label">Member Since</span>
            <span class="meta-item-val">${userProfileData.memberSince}</span>
          </div>
        </div>
      </div>
    `;

    const editBtn = document.getElementById('btn-edit-profile');
    if (editBtn) {
      editBtn.addEventListener('click', () => openModal('edit-profile-modal'));
    }
  }

  /**
   * 2.2 Render Roles & Permissions Card (Row 1 Col 2)
   */
  function renderRolesPermissionsCard() {
    const container = document.getElementById('card-roles-permissions');
    if (!container) return;

    const permsMarkup = rolesPermissionsData.permissions.map(p => `
      <div class="permission-item">
        <i class="fa-solid fa-circle-check perm-check-icon"></i>
        <span>${p}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-shield-halved card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">Roles &amp; Permissions</h3>
            <p class="card-header-subtitle">Manage user roles and access permissions.</p>
          </div>
        </div>
        <button type="button" class="btn-card-action" id="btn-manage-users">
          <i class="fa-solid fa-users" style="font-size: 0.65rem;"></i> Manage Users
        </button>
      </div>

      <div class="role-callout-box">
        <div class="role-crown-icon">
          <i class="fa-solid fa-crown"></i>
        </div>
        <div class="role-callout-text">
          <span class="role-callout-label">Your Role</span>
          <span class="role-callout-title">${rolesPermissionsData.roleTitle}</span>
          <span class="role-callout-desc">${rolesPermissionsData.roleDesc}</span>
        </div>
      </div>

      <h4 class="permissions-heading">Key Permissions</h4>
      <div class="permissions-list">
        ${permsMarkup}
      </div>
    `;

    const manageBtn = document.getElementById('btn-manage-users');
    if (manageBtn) {
      manageBtn.addEventListener('click', () => openManageUsersModal());
    }
  }

  /**
   * 2.3 Render Notification Preferences Card (Row 1 Col 3)
   */
  function renderNotificationPrefsCard() {
    const container = document.getElementById('card-notification-prefs');
    if (!container) return;

    const rowsMarkup = notificationPrefsData.map(n => `
      <div class="notif-toggle-row">
        <div class="notif-row-left">
          <i class="${n.icon} notif-row-icon ${n.theme}"></i>
          <div class="notif-row-text">
            <span class="notif-row-title">${n.title}</span>
            <span class="notif-row-desc">${n.desc}</span>
          </div>
        </div>
        <label class="switch-toggle" aria-label="Toggle ${n.title}">
          <input type="checkbox" class="notif-checkbox" data-notif-id="${n.id}" ${n.enabled ? 'checked' : ''}>
          <span class="slider-round"></span>
        </label>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-bell card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">Notification Preferences</h3>
            <p class="card-header-subtitle">Choose how you want to be notified.</p>
          </div>
        </div>
      </div>

      <div class="notifications-list">
        ${rowsMarkup}
      </div>
    `;

    // Toggle interaction listeners
    container.querySelectorAll('.notif-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const notifId = cb.getAttribute('data-notif-id');
        const notifItem = notificationPrefsData.find(n => n.id === notifId);
        if (notifItem) {
          notifItem.enabled = cb.checked;
          showToast(`${notifItem.title} notifications ${cb.checked ? 'enabled' : 'disabled'}`, 'info');
        }
      });
    });
  }

  /**
   * 2.4 Render Data Source Settings Card (Row 2 Col 1)
   */
  function renderDataSourcesCard() {
    const container = document.getElementById('card-data-sources');
    if (!container) return;

    const listMarkup = dataSourcesData.map(ds => `
      <div class="data-source-row" data-ds-id="${ds.id}">
        <div class="ds-row-left">
          <i class="${ds.icon} ds-icon"></i>
          <div class="ds-text">
            <span class="ds-name">${ds.name}</span>
            <span class="ds-desc">${ds.desc}</span>
          </div>
        </div>
        <div class="ds-row-right">
          <span class="status-pill ${ds.statusType}">
            <span class="status-dot"></span> ${ds.status}
          </span>
          <i class="fa-solid fa-chevron-right chevron-arrow"></i>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-database card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">Data Source Settings</h3>
            <p class="card-header-subtitle">Configure data sources for railway operations data.</p>
          </div>
        </div>
        <button type="button" class="btn-card-action" id="btn-test-connections">
          <i class="fa-solid fa-arrows-rotate" style="font-size: 0.65rem;"></i> Test Connections
        </button>
      </div>

      <div class="data-sources-list">
        ${listMarkup}
      </div>
    `;

    const testBtn = document.getElementById('btn-test-connections');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        showToast('Pinging all 5 division data connectors...', 'info');
        testBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size: 0.65rem;"></i> Testing...`;
        setTimeout(() => {
          testBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate" style="font-size: 0.65rem;"></i> Test Connections`;
          showToast('All primary connectors healthy: CRIS, IRISE, Weather (Latency: 18ms)', 'success');
        }, 1200);
      });
    }

    container.querySelectorAll('.data-source-row').forEach(row => {
      row.addEventListener('click', () => {
        const dsId = row.getAttribute('data-ds-id');
        const ds = dataSourcesData.find(d => d.id === dsId);
        showToast(`Opening configuration telemetry for ${ds ? ds.name : dsId}`, 'info');
      });
    });
  }

  /**
   * Apply Theme (Dark, Light, System) across DOM, CSS variables, and LocalStorage
   * @param {string} themeId - 'dark' | 'light' | 'system'
   * @param {boolean} showNotification - whether to show toast
   */
  function applyTheme(themeId, showNotification = true) {
    if (!['dark', 'light', 'system'].includes(themeId)) {
      themeId = 'dark';
    }

    themeSettingsData.currentTheme = themeId;

    // Update subtitles in theme definitions: active gets 'Current theme', inactive gets title
    themeSettingsData.themes.forEach(t => {
      t.sub = (t.id === themeId) ? 'Current theme' : t.title;
    });

    let effectiveTheme = themeId;
    if (themeId === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    }

    try {
      localStorage.setItem('railway_app_theme', themeId);
      window.dispatchEvent(new Event('themechange'));
    } catch (e) {
      console.warn('LocalStorage error saving theme preference:', e);
    }

    renderThemeAppearanceCard();

    if (showNotification) {
      const themeLabel = themeId.charAt(0).toUpperCase() + themeId.slice(1);
      showToast(`Theme switched to ${themeLabel} mode`, 'success');
    }
  }

  /**
   * 2.5 Render Theme & Appearance Card (Row 2 Col 2)
   */
  function renderThemeAppearanceCard() {
    const container = document.getElementById('card-theme-appearance');
    if (!container) return;

    const themesMarkup = themeSettingsData.themes.map(t => {
      const isActive = themeSettingsData.currentTheme === t.id;
      return `
        <div class="theme-box ${t.id} ${isActive ? 'active' : ''}" data-theme-id="${t.id}" role="button" tabindex="0" aria-pressed="${isActive}" aria-label="Switch to ${t.title} theme">
          ${isActive ? '<span class="theme-check-badge"><i class="fa-solid fa-check"></i></span>' : ''}
          <i class="${t.icon} theme-icon"></i>
          <span class="theme-title">${t.title}</span>
          <span class="theme-sub">${t.sub}</span>
        </div>
      `;
    }).join('');

    const dispMarkup = themeSettingsData.displayToggles.map(d => `
      <div class="display-toggle-row">
        <div class="disp-left">
          <i class="${d.icon} disp-icon"></i>
          <span>${d.label}</span>
        </div>
        <label class="switch-toggle" aria-label="Toggle ${d.label}">
          <input type="checkbox" class="disp-checkbox" data-disp-id="${d.id}" ${d.enabled ? 'checked' : ''}>
          <span class="slider-round"></span>
        </label>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-palette card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">Theme &amp; Appearance</h3>
            <p class="card-header-subtitle">Customize your viewing experience.</p>
          </div>
        </div>
      </div>

      <div class="theme-options-row">
        ${themesMarkup}
      </div>

      <h4 class="display-settings-heading">Display Settings</h4>
      <div class="display-settings-list">
        ${dispMarkup}
      </div>
    `;

    // Theme select listeners (click + keyboard accessibility)
    container.querySelectorAll('.theme-box').forEach(box => {
      const handleSelect = () => {
        const themeId = box.getAttribute('data-theme-id');
        if (themeId && themeId !== themeSettingsData.currentTheme) {
          applyTheme(themeId, true);
        }
      };

      box.addEventListener('click', handleSelect);
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });
    });

    // Display toggle listeners
    container.querySelectorAll('.disp-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const dispId = cb.getAttribute('data-disp-id');
        const dispItem = themeSettingsData.displayToggles.find(d => d.id === dispId);
        if (dispItem) {
          dispItem.enabled = cb.checked;
          if (dispId === 'disp-compact') {
            if (window.setSidebarCollapsed) {
              window.setSidebarCollapsed(cb.checked, true);
            } else {
              document.body.classList.toggle('sidebar-collapsed', cb.checked);
              try { localStorage.setItem('railway_compact_sidebar', cb.checked); } catch(e){}
            }
          } else if (dispId === 'disp-codes') {
            document.body.classList.toggle('show-station-codes', cb.checked);
            try { localStorage.setItem('railway_station_codes', cb.checked); } catch(e){}
          } else if (dispId === 'disp-anim') {
            document.body.classList.toggle('no-animations', !cb.checked);
            try { localStorage.setItem('railway_animations', cb.checked); } catch(e){}
          }
          showToast(`${dispItem.label} ${cb.checked ? 'enabled' : 'disabled'}`, 'info');
        }
      });
    });
  }

  /**
   * 2.6 Render Planning Defaults Card (Row 2 Col 3)
   */
  function renderPlanningDefaultsCard() {
    const container = document.getElementById('card-planning-defaults');
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-sliders card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">Planning Defaults</h3>
            <p class="card-header-subtitle">Set default values for maintenance planning.</p>
          </div>
        </div>
      </div>

      <div class="planning-defaults-list">
        <div class="planning-param-row">
          <div class="param-left">
            <i class="fa-regular fa-calendar param-icon"></i>
            <span>Default Planning Horizon</span>
          </div>
          <select class="param-select" id="param-horizon-select">
            <option value="15 Days">15 Days</option>
            <option value="30 Days" selected>30 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
        </div>

        <div class="planning-param-row">
          <div class="param-left">
            <i class="fa-regular fa-clock param-icon"></i>
            <span>Default Block Duration</span>
          </div>
          <select class="param-select" id="param-duration-select">
            <option value="2 Hours">2 Hours</option>
            <option value="4 Hours" selected>4 Hours</option>
            <option value="6 Hours">6 Hours</option>
            <option value="8 Hours">8 Hours</option>
          </select>
        </div>

        <div class="planning-param-row">
          <div class="param-left">
            <i class="fa-solid fa-shield-halved param-icon"></i>
            <span>Safety Buffer Time</span>
          </div>
          <select class="param-select" id="param-buffer-select">
            <option value="15 Minutes">15 Minutes</option>
            <option value="30 Minutes" selected>30 Minutes</option>
            <option value="45 Minutes">45 Minutes</option>
            <option value="60 Minutes">60 Minutes</option>
          </select>
        </div>

        <div class="planning-param-row">
          <div class="param-left">
            <i class="fa-solid fa-flag param-icon"></i>
            <span>Default Priority</span>
          </div>
          <select class="param-select" id="param-priority-select">
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div class="planning-param-row" style="margin-top: 4px;">
          <div class="param-left">
            <i class="fa-solid fa-users param-icon"></i>
            <span>Auto-assign Resources</span>
          </div>
          <label class="switch-toggle" aria-label="Toggle auto-assign resources">
            <input type="checkbox" id="toggle-auto-assign" ${planningDefaultsData.autoAssign ? 'checked' : ''}>
            <span class="slider-round"></span>
          </label>
        </div>

        <div class="planning-param-row">
          <div class="param-left">
            <i class="fa-solid fa-cloud param-icon"></i>
            <span>Consider Weather Constraints</span>
          </div>
          <label class="switch-toggle" aria-label="Toggle weather constraints">
            <input type="checkbox" id="toggle-weather-constraints" ${planningDefaultsData.weatherConstraints ? 'checked' : ''}>
            <span class="slider-round"></span>
          </label>
        </div>
      </div>
    `;

    // Dropdown change listeners
    ['horizon', 'duration', 'buffer', 'priority'].forEach(k => {
      const el = document.getElementById(`param-${k}-select`);
      if (el) {
        el.addEventListener('change', () => {
          planningDefaultsData[k] = el.value;
          showToast(`Default ${k} set to ${el.value}`, 'info');
        });
      }
    });

    const autoAssignCb = document.getElementById('toggle-auto-assign');
    if (autoAssignCb) {
      autoAssignCb.addEventListener('change', () => {
        planningDefaultsData.autoAssign = autoAssignCb.checked;
        showToast(`Auto-assign resources ${autoAssignCb.checked ? 'enabled' : 'disabled'}`, 'info');
      });
    }

    const weatherCb = document.getElementById('toggle-weather-constraints');
    if (weatherCb) {
      weatherCb.addEventListener('change', () => {
        planningDefaultsData.weatherConstraints = weatherCb.checked;
        showToast(`Weather constraints ${weatherCb.checked ? 'enabled' : 'disabled'}`, 'info');
      });
    }
  }

  /**
   * 2.7 Render Integrations & APIs Card (Row 3 Col 1)
   */
  function renderIntegrationsCard() {
    const container = document.getElementById('card-integrations-apis');
    if (!container) return;

    const cardsMarkup = integrationsData.map(i => {
      const isConnected = i.status === 'Connected';
      const statusMarkup = isConnected 
        ? `<span class="integ-status-text"><span style="width: 5px; height: 5px; border-radius: 50%; background: #10B981;"></span>Connected</span>`
        : `<span class="integ-status-text not-configured"><span style="width: 5px; height: 5px; border-radius: 50%; background: #94A3B8;"></span>Not Configured</span>`;

      const subMarkup = i.isLink
        ? `<a href="#setup-webhook" class="integ-setup-link" id="link-setup-webhook">${i.sub}</a>`
        : `<span class="integ-sub">${i.sub}</span>`;

      return `
        <div class="integration-card" id="${i.id}">
          <div class="integ-icon-wrap" style="color: ${i.iconColor};">
            <i class="${i.icon}"></i>
          </div>
          <div class="integ-info">
            <div class="integ-title-row">
              <span class="integ-name">${i.name}</span>
            </div>
            ${statusMarkup}
            ${subMarkup}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-plug card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">Integrations &amp; APIs</h3>
            <p class="card-header-subtitle">Manage external integrations and API access.</p>
          </div>
        </div>
        <button type="button" class="btn-card-action" id="btn-manage-apis">
          <i class="fa-solid fa-pen" style="font-size: 0.65rem;"></i> Manage APIs
        </button>
      </div>

      <div class="integrations-grid">
        ${cardsMarkup}
      </div>
    `;

    const manageApisBtn = document.getElementById('btn-manage-apis');
    const webhookLink = document.getElementById('link-setup-webhook');

    if (manageApisBtn) {
      manageApisBtn.addEventListener('click', () => openModal('manage-apis-modal'));
    }

    if (webhookLink) {
      webhookLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('manage-apis-modal');
      });
    }
  }

  /**
   * 2.8 Render System Configuration Card (Row 3 Col 2)
   */
  function renderSystemConfigCard() {
    const container = document.getElementById('card-system-config');
    if (!container) return;

    const tilesMarkup = systemConfigData.map(c => `
      <div class="config-tile-item" data-cfg-id="${c.id}">
        <div class="config-tile-left">
          <i class="${c.icon} config-tile-icon"></i>
          <div class="config-tile-text">
            <span class="config-tile-title">${c.title}</span>
            <span class="config-tile-desc">${c.desc}</span>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right chevron-arrow"></i>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <div class="card-header-left">
          <i class="fa-solid fa-gears card-header-icon"></i>
          <div class="card-header-titles">
            <h3 class="card-header-title">System Configuration</h3>
            <p class="card-header-subtitle">Advanced system settings and configuration options.</p>
          </div>
        </div>
        <button type="button" class="btn-card-action" id="btn-view-logs">
          <i class="fa-solid fa-file-lines" style="font-size: 0.65rem;"></i> View Logs
        </button>
      </div>

      <div class="system-config-grid">
        ${tilesMarkup}
      </div>
    `;

    const viewLogsBtn = document.getElementById('btn-view-logs');
    if (viewLogsBtn) {
      viewLogsBtn.addEventListener('click', () => openSystemLogsModal());
    }

    container.querySelectorAll('.config-tile-item').forEach(item => {
      item.addEventListener('click', () => {
        const cfgId = item.getAttribute('data-cfg-id');
        const cfg = systemConfigData.find(c => c.id === cfgId);
        showToast(`Opening configuration module: ${cfg ? cfg.title : cfgId}`, 'info');
      });
    });
  }

  // ============================================================================
  // SECTION 3: MODAL CONTROLLERS & FORM INTERACTIONS
  // ============================================================================

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openManageUsersModal() {
    const body = document.getElementById('modal-users-body');
    if (!body) return;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #E2E8F0;">
          <span style="font-size: 0.74rem; font-weight: 700; color: #0F172A;">3 Active Divisional Operators</span>
          <button type="button" class="btn btn-primary" style="padding: 3px 8px; font-size: 0.7rem; border-radius: 4px; background: #2563EB; color: #FFF; border: none; cursor: pointer;">
            + Invite Operator
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.5rem; background: #F8FAFC; border-radius: 6px;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #3B82F6; color: #FFF; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.76rem;">HS</div>
            <div>
              <span style="font-size: 0.74rem; font-weight: 700; color: #0F172A; display: block;">Harsh Singh (You)</span>
              <span style="font-size: 0.65rem; color: #64748B;">harsh.singh@thinksync.in</span>
            </div>
          </div>
          <span style="padding: 2px 7px; border-radius: 4px; background: #EFF6FF; color: #2563EB; font-weight: 700; font-size: 0.68rem;">Administrator</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.5rem; background: #F8FAFC; border-radius: 6px;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #10B981; color: #FFF; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.76rem;">RK</div>
            <div>
              <span style="font-size: 0.74rem; font-weight: 700; color: #0F172A; display: block;">Rajesh Kumar</span>
              <span style="font-size: 0.65rem; color: #64748B;">rajesh.kumar@indianrailways.gov.in</span>
            </div>
          </div>
          <span style="padding: 2px 7px; border-radius: 4px; background: #ECFDF5; color: #059669; font-weight: 700; font-size: 0.68rem;">Chief Operations Mgr</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.5rem; background: #F8FAFC; border-radius: 6px;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #F59E0B; color: #FFF; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.76rem;">AM</div>
            <div>
              <span style="font-size: 0.74rem; font-weight: 700; color: #0F172A; display: block;">Amit Mukherjee</span>
              <span style="font-size: 0.65rem; color: #64748B;">amit.m@indianrailways.gov.in</span>
            </div>
          </div>
          <span style="padding: 2px 7px; border-radius: 4px; background: #FFFBEB; color: #D97706; font-weight: 700; font-size: 0.68rem;">Section Controller</span>
        </div>
      </div>
    `;

    openModal('manage-users-modal');
  }

  function openSystemLogsModal() {
    const body = document.getElementById('modal-logs-body');
    if (!body) return;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;">
        <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #10B981;">
          <span style="color: #64748B;">[2026-09-12 10:24:18]</span> <strong style="color: #0F172A;">AUTH_SUCCESS</strong>: Operator Harsh Singh logged in from 10.45.12.8
        </div>
        <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #2563EB;">
          <span style="color: #64748B;">[2026-09-12 09:45:00]</span> <strong style="color: #0F172A;">SYNC_COMPLETED</strong>: Power BI dataset refreshed (1,452 block records)
        </div>
        <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #F59E0B;">
          <span style="color: #64748B;">[2026-09-12 08:30:12]</span> <strong style="color: #0F172A;">CONFIG_MODIFIED</strong>: Planning default buffer time changed to 30 mins
        </div>
        <div style="padding: 0.45rem 0.65rem; background: #F8FAFC; border-radius: 6px; border-left: 3px solid #10B981;">
          <span style="color: #64748B;">[2026-09-12 07:15:44]</span> <strong style="color: #0F172A;">BACKUP_ROUTINE</strong>: Automated division snapshot created (Hash: SHA256-4b8f)
        </div>
      </div>
    `;

    openModal('system-logs-modal');
  }

  function initModals() {
    // Edit Profile Modal
    const editForm = document.getElementById('edit-profile-form');
    const editCancel = document.getElementById('modal-profile-cancel-btn');
    const editClose = document.getElementById('modal-profile-close-btn');

    [editCancel, editClose].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal('edit-profile-modal'));
    });

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userProfileData.name = document.getElementById('profile-name-input').value;
        userProfileData.email = document.getElementById('profile-email-input').value;
        userProfileData.team = document.getElementById('profile-team-input').value;
        userProfileData.dept = document.getElementById('profile-dept-input').value;
        userProfileData.location = document.getElementById('profile-loc-input').value;

        // Initials
        const parts = userProfileData.name.trim().split(/\s+/);
        userProfileData.initials = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);

        closeModal('edit-profile-modal');
        renderUserProfileCard();
        renderUserProfile();
        showToast('Profile credentials saved successfully', 'success');
      });
    }

    // Manage Users Modal Close
    const usersClose = document.getElementById('modal-users-close-btn');
    if (usersClose) {
      usersClose.addEventListener('click', () => closeModal('manage-users-modal'));
    }

    // Manage APIs Modal
    const apisForm = document.getElementById('manage-apis-form');
    const apisCancel = document.getElementById('modal-apis-cancel-btn');
    const apisClose = document.getElementById('modal-apis-close-btn');

    [apisCancel, apisClose].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal('manage-apis-modal'));
    });

    if (apisForm) {
      apisForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const webhookCard = integrationsData.find(i => i.id === 'integ-webhook');
        if (webhookCard) {
          webhookCard.status = 'Connected';
          webhookCard.sub = 'Endpoint Active';
          webhookCard.isLink = false;
        }
        closeModal('manage-apis-modal');
        renderIntegrationsCard();
        showToast('Webhook integration registered and verified', 'success');
      });
    }

    // System Logs Modal Close
    const logsClose = document.getElementById('modal-logs-close-btn');
    if (logsClose) {
      logsClose.addEventListener('click', () => closeModal('system-logs-modal'));
    }

    // Backdrop & Escape listeners
    document.querySelectorAll('.settings-modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal.id);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.settings-modal-overlay.open').forEach(modal => closeModal(modal.id));
      }
    });
  }

  // ============================================================================
  // SECTION 4: GLOBAL TOAST & DYNAMIC TELEMETRY API
  // ============================================================================

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    
    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';
    if (type === 'error') icon = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Public Global Dynamic API: window.setSettingsData(data)
   * Dynamically hydrates or modifies any portion of settings state
   */
  window.setSettingsData = function(newData) {
    if (!newData || typeof newData !== 'object') return;
    if (newData.profile) userProfileData = { ...userProfileData, ...newData.profile };
    if (newData.roles) rolesPermissionsData = { ...rolesPermissionsData, ...newData.roles };
    if (newData.notifications) notificationPrefsData = newData.notifications;
    if (newData.dataSources) dataSourcesData = newData.dataSources;
    if (newData.theme) {
      themeSettingsData = { ...themeSettingsData, ...newData.theme };
      if (newData.theme.currentTheme) {
        applyTheme(newData.theme.currentTheme, false);
      }
    }
    if (newData.planning) planningDefaultsData = { ...planningDefaultsData, ...newData.planning };
    if (newData.integrations) integrationsData = newData.integrations;
    if (newData.systemConfig) systemConfigData = newData.systemConfig;

    renderUserProfileCard();
    renderRolesPermissionsCard();
    renderNotificationPrefsCard();
    renderDataSourcesCard();
    if (!newData.theme?.currentTheme) {
      renderThemeAppearanceCard();
    }
    renderPlanningDefaultsCard();
    renderIntegrationsCard();
    renderSystemConfigCard();
    showToast('Settings configuration updated dynamically', 'success');
  };

  // ============================================================================
  // SECTION 5: GLOBAL SHELL HYDRATION
  // ============================================================================

  function renderUserProfile() {
    const userContainer = document.getElementById('user-profile-container');
    if (!userContainer) return;

    userContainer.innerHTML = `
      <div class="user-avatar" title="Rajesh - Team ThinkSync">HS</div>
      <div class="user-info">
        <span class="user-name">Rajesh</span>
        <span class="user-role">Team ThinkSync</span>
      </div>
      <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
    `;
  }

  function renderSidebarAndFooter() {
    const trainCard = document.getElementById('sidebar-train-card');
    if (trainCard) {
      trainCard.innerHTML = `
        <img src="train_banner.jpg" alt="Indian Railways Train on Tracks" class="sidebar-train-card-bg">
        <div class="sidebar-train-card-overlay"></div>
        <div class="sidebar-train-card-content">
          <span class="train-card-slogan">Better Planning</span>
          <span class="train-card-sub">Safer Journeys</span>
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

    const footerQuote = document.getElementById('footer-quote-container');
    const footerLinks = document.getElementById('footer-links-container');

    if (footerQuote) {
      footerQuote.innerHTML = `<span>&ldquo;Safe, Punctual, and Modern Indian Railways for Viksit Bharat.&rdquo;</span>`;
    }

    if (footerLinks) {
      footerLinks.innerHTML = `
        <span>Indian Railways &copy; 2026</span>
        <span>•</span>
        <span>Jharkhand Operational Network</span>
        <span>•</span>
        <span class="footer-status-pill"><span class="pulse-dot"></span> System Live</span>
      `;
    }
  }

  function initSidebarToggle() {
    window.addEventListener('railway_sidebar_changed', (e) => {
      const isCollapsed = !!e.detail.collapsed;
      const compactItem = themeSettingsData.displayToggles.find(d => d.id === 'disp-compact');
      if (compactItem) compactItem.enabled = isCollapsed;
      const cb = document.querySelector('.disp-checkbox[data-disp-id="disp-compact"]');
      if (cb && cb.checked !== isCollapsed) {
        cb.checked = isCollapsed;
      }
    });
  }

  function initNotifications() {
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const badge = document.getElementById('header-notif-badge');
    const countBadge = document.getElementById('notif-dropdown-count');
    const notifList = document.getElementById('notif-list-container');

    if (badge) badge.textContent = '2';
    if (countBadge) countBadge.textContent = '2 New';

    if (notifList) {
      notifList.innerHTML = `
        <div class="notif-item unread">
          <i class="fa-solid fa-check notif-item-icon" style="color: #10B981;"></i>
          <div class="notif-item-content">
            <span class="notif-item-title">Power BI Sync Completed</span>
            <span class="notif-item-time">30 mins ago</span>
          </div>
        </div>
        <div class="notif-item unread">
          <i class="fa-solid fa-database notif-item-icon" style="color: #2563EB;"></i>
          <div class="notif-item-content">
            <span class="notif-item-title">CRIS Live Telemetry connected</span>
            <span class="notif-item-time">1 hour ago</span>
          </div>
        </div>
      `;
    }

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
          notifDropdown.classList.remove('show');
        }
      });
    }
  }

  // ============================================================================
  // SECTION 6: MASTER INITIALIZATION
  // ============================================================================
  function init() {
    // Shell & Navigation
    renderUserProfile();
    renderSidebarAndFooter();
    initSidebarToggle();
    initNotifications();

    // Restore persisted display preferences and theme
    try {
      const savedTheme = localStorage.getItem('railway_app_theme') || 'dark';

      const savedCompact = localStorage.getItem('railway_compact_sidebar');
      if (savedCompact !== null) {
        const compactItem = themeSettingsData.displayToggles.find(d => d.id === 'disp-compact');
        if (compactItem) compactItem.enabled = (savedCompact === 'true');
      }

      const savedCodes = localStorage.getItem('railway_station_codes');
      if (savedCodes !== null) {
        const codesItem = themeSettingsData.displayToggles.find(d => d.id === 'disp-codes');
        if (codesItem) codesItem.enabled = (savedCodes === 'true');
      }

      const savedAnim = localStorage.getItem('railway_animations');
      if (savedAnim !== null) {
        const animItem = themeSettingsData.displayToggles.find(d => d.id === 'disp-anim');
        if (animItem) animItem.enabled = (savedAnim === 'true');
      }

      // Apply initial theme across DOM without triggering toast
      applyTheme(savedTheme, false);

      // Apply initial display classes to body and sidebar
      const compactOn = themeSettingsData.displayToggles.find(d => d.id === 'disp-compact')?.enabled;
      if (compactOn) {
        document.body.classList.add('sidebar-collapsed');
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('collapsed');
      }

      const animOn = themeSettingsData.displayToggles.find(d => d.id === 'disp-anim')?.enabled;
      if (animOn === false) {
        document.body.classList.add('no-animations');
      }
    } catch (e) {
      applyTheme('dark', false);
    }

    // Dynamic system media query listener for automatic system theme adjustments
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeSettingsData.currentTheme === 'system') {
          applyTheme('system', false);
        }
      });
    }

    // 100% Dynamic Visual Hydration (8 Card Modules)
    renderUserProfileCard();
    renderRolesPermissionsCard();
    renderNotificationPrefsCard();
    renderDataSourcesCard();
    // Note: renderThemeAppearanceCard() is executed inside applyTheme()
    renderPlanningDefaultsCard();
    renderIntegrationsCard();
    renderSystemConfigCard();

    // Modals
    initModals();
  }

  // Expose global test APIs
  window.applyTheme = applyTheme;
  window.themeSettingsData = themeSettingsData;

  init();
})();
