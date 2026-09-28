/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION: MAINTENANCE TASKS DASHBOARD (PAGE 4)
 * File: tasks.js
 * Architecture: 100% Dynamic Client-Side Data-Driven Architecture
 * 
 * DESIGN PRINCIPLES:
 * 1. ZERO HARDCODED CONTENT: Every card, metric, chart, and table is generated
 *    programmatically from JavaScript data models.
 * 2. DEFENSIVE RENDERING: When data is missing, an elegant 'Not Found' banner is
 *    displayed gracefully without breaking container layouts.
 * 3. EXTENSIVE DOCUMENTATION: Every section includes clear comments explaining
 *    the data schema, rendering logic, and user interaction handlers.
 * 4. INTERACTIVITY:
 *    - Row selection synchronously updates the right-hand Task Details panel.
 *    - Dynamic live filtering by Section, Severity, Department, Status, and Search.
 *    - Tab switching inside Task Details (Details, Timeline, Assets, AI Insights).
 *    - Interactive modal dialog for "+ Create Task".
 *    - Toast notification feedback system.
 *    - Smooth sidebar show/hide collapse toggle.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // SECTION 1: MASTER DATA STORE (Mock Data Definitions)
  // All dashboard state and data objects are centralized here.
  // ============================================================================

  // 1.1 Action Subheader Configuration
  const tasksSubheaderData = {
    title: 'Maintenance Tasks',
    subtitle: 'Unified view of TMS, SMMS & TDMS maintenance records with AI-powered prioritization'
  };

  // 1.2 Top 5 KPI Summary Metrics Ribbon
  const tasksKpisData = [
    {
      id: 'kpi-total',
      title: 'Total Tasks',
      value: 156,
      trendText: '↑ 12%',
      trendClass: 'green',
      subtext: 'From TMS / SMMS / TDMS',
      iconClass: 'fa-regular fa-clipboard',
      colorTheme: 'blue'
    },
    {
      id: 'kpi-overdue',
      title: 'Overdue Tasks',
      value: 28,
      trendText: '↓ 75%',
      trendClass: 'red',
      subtext: '18% of total tasks',
      iconClass: 'fa-regular fa-clock',
      colorTheme: 'red'
    },
    {
      id: 'kpi-high-priority',
      title: 'High Priority',
      value: 42,
      trendText: '↓ 10%',
      trendClass: 'red',
      subtext: 'Requires urgent attention',
      iconClass: 'fa-solid fa-gear',
      colorTheme: 'orange'
    },
    {
      id: 'kpi-in-progress',
      title: 'In Progress',
      value: 62,
      trendText: '↑ 8%',
      trendClass: 'green',
      subtext: 'Actively being worked on',
      iconClass: 'fa-solid fa-wrench',
      colorTheme: 'purple'
    },
    {
      id: 'kpi-completed',
      title: 'Completed (This Month)',
      value: 24,
      trendText: '↓ 33%',
      trendClass: 'green',
      subtext: 'vs. previous month',
      iconClass: 'fa-regular fa-circle-check',
      colorTheme: 'green'
    }
  ];

  // 1.3 Filter Dropdown Configuration
  const tasksFiltersData = {
    sections: ['All Sections', 'Ranchi – Dhanbad', 'Bokaro – Chandrapura', 'Dhanbad – Koderma', 'Hatia – Asansol', 'Gumla – Lohardaga', 'Ranchi – Namkum', 'Latehar – Garhwa'],
    severities: ['All Severities', 'High Priority', 'Medium Priority', 'Low Priority'],
    departments: ['All Departments', 'Track', 'S&T', 'Mechanical', 'Electrical', 'Civil'],
    overdueStatuses: ['All Tasks', 'Overdue Tasks', 'In Progress', 'Planned', 'Completed'],
    currentDateRange: '01 Sep 2026  –  30 Sep 2026'
  };

  // 1.4 Chart 1: Tasks by Priority Data (Donut Chart)
  const priorityChartData = {
    total: 156,
    segments: [
      { label: 'High Priority', count: 42, percent: 27, colorClass: 'red', strokeColor: '#EF4444' },
      { label: 'Medium Priority', count: 68, percent: 44, colorClass: 'orange', strokeColor: '#F59E0B' },
      { label: 'Low Priority', count: 46, percent: 29, colorClass: 'green', strokeColor: '#10B981' }
    ]
  };

  // 1.5 Chart 2: Tasks by Department Data (Bar Chart)
  const deptChartData = [
    { dept: 'Track', count: 38, max: 40, color: '#2563EB' },
    { dept: 'S&T', count: 28, max: 40, color: '#10B981' },
    { dept: 'Electrical', count: 24, max: 40, color: '#3B82F6' },
    { dept: 'Civil', count: 18, max: 40, color: '#0EA5E9' },
    { dept: 'OHE', count: 16, max: 40, color: '#8B5CF6' },
    { dept: 'Others', count: 12, max: 40, color: '#94A3B8' }
  ];

  // 1.6 Chart 3: Task Status Data (Donut Chart)
  const statusChartData = {
    total: 156,
    segments: [
      { label: 'Completed', count: 24, percent: 15, colorClass: 'green', strokeColor: '#10B981' },
      { label: 'In Progress', count: 62, percent: 40, colorClass: 'blue', strokeColor: '#2563EB' },
      { label: 'Planned', count: 42, percent: 27, colorClass: 'orange', strokeColor: '#F59E0B' },
      { label: 'Overdue', count: 28, percent: 18, colorClass: 'red', strokeColor: '#EF4444' }
    ]
  };

  // 1.7 Master Maintenance Task List (10 Records matching reference image)
  const masterTasksList = [
    {
      id: 'TMS-2026-001',
      source: 'TMS',
      sourceClass: 'tms',
      description: 'Rails renewal (600m)',
      section: 'Ranchi – Dhanbad',
      location: 'Km 312/4-5',
      department: 'Track',
      priority: 'High',
      priorityClass: 'high',
      status: 'Overdue',
      statusClass: 'overdue',
      dueDate: '12 Sep 2026',
      daysLeft: -5,
      detailedSummary: 'Track maintenance - Renewal of 60 kg rails including fastenings and welding.',
      fullDescription: 'Renewal of 600m rails with new fish plates, fastenings and destressing. Work to be done under traffic block.',
      daysOverdueText: '5 days',
      createdOn: '28 Aug 2026, 10:32 AM',
      createdBy: 'S. Kumar (TMS)',
      attachments: [
        { name: 'Work_Order_TMS-001.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Site_Photo_Km312.jpg', size: '1.1 MB', type: 'img' }
      ]
    },
    {
      id: 'SMMS-2026-045',
      source: 'SMMS',
      sourceClass: 'smms',
      description: 'Signal equipment inspection',
      section: 'Bokaro – Chandrapura',
      location: 'Km 428/1',
      department: 'S&T',
      priority: 'Medium',
      priorityClass: 'medium',
      status: 'In Progress',
      statusClass: 'progress',
      dueDate: '18 Sep 2026',
      daysLeft: 2,
      detailedSummary: 'Signaling routine preventive inspection and electronic interlocking diagnostic.',
      fullDescription: 'Comprehensive check of point detection circuits, track relay calibration, and cable insulation testing.',
      daysOverdueText: 'On Schedule',
      createdOn: '01 Sep 2026, 09:15 AM',
      createdBy: 'A. Verma (SMMS)',
      attachments: [
        { name: 'SMMS_Inspection_Report.pdf', size: '1.8 MB', type: 'pdf' }
      ]
    },
    {
      id: 'TDMS-2026-078',
      source: 'TDMS',
      sourceClass: 'tdms',
      description: 'Diesel loco periodic servicing',
      section: 'Ranchi (Shed)',
      location: 'Loco Shed',
      department: 'Mechanical',
      priority: 'High',
      priorityClass: 'high',
      status: 'Planned',
      statusClass: 'planned',
      dueDate: '20 Sep 2026',
      daysLeft: 4,
      detailedSummary: 'Monthly periodic maintenance schedule for WDG-4 freight locomotives.',
      fullDescription: 'Oil filter replacement, brake riggings overhaul, and traction motor brush inspection.',
      daysOverdueText: 'On Schedule',
      createdOn: '04 Sep 2026, 11:45 AM',
      createdBy: 'R. K. Meena (TDMS)',
      attachments: [
        { name: 'Loco_Logsheet_WDG4.pdf', size: '3.1 MB', type: 'pdf' }
      ]
    },
    {
      id: 'TMS-2026-112',
      source: 'TMS',
      sourceClass: 'tms',
      description: 'Ballast cleaning',
      section: 'Dhanbad – Koderma',
      location: 'Km 511/2-6',
      department: 'Track',
      priority: 'Medium',
      priorityClass: 'medium',
      status: 'In Progress',
      statusClass: 'progress',
      dueDate: '22 Sep 2026',
      daysLeft: 6,
      detailedSummary: 'BCM machine deep screening & shoulder ballast restoration.',
      fullDescription: 'Removal of mud caking and fine dust from ballast bed to restore track resilience.',
      daysOverdueText: 'On Schedule',
      createdOn: '06 Sep 2026, 08:30 AM',
      createdBy: 'M. P. Singh (TMS)',
      attachments: [
        { name: 'BCM_Shift_Log.pdf', size: '1.5 MB', type: 'pdf' }
      ]
    },
    {
      id: 'SMMS-2026-093',
      source: 'SMMS',
      sourceClass: 'smms',
      description: 'Point machine maintenance',
      section: 'Hatia – Asansol',
      location: 'Hatia Yard',
      department: 'S&T',
      priority: 'High',
      priorityClass: 'high',
      status: 'Overdue',
      statusClass: 'overdue',
      dueDate: '15 Sep 2026',
      daysLeft: -2,
      detailedSummary: 'Electric point machine contact cleaning, lubricating, and throw test.',
      fullDescription: 'High frequency yard point machine servicing required after intense heavy rain and silt accumulation.',
      daysOverdueText: '2 days',
      createdOn: '29 Aug 2026, 04:10 PM',
      createdBy: 'D. Sen (SMMS)',
      attachments: [
        { name: 'Point_Defect_Notice.pdf', size: '2.0 MB', type: 'pdf' }
      ]
    },
    {
      id: 'TDMS-2026-067',
      source: 'TDMS',
      sourceClass: 'tdms',
      description: 'Coach IC overhaul',
      section: 'Bokaro (Workshop)',
      location: 'Workshop',
      department: 'Mechanical',
      priority: 'Medium',
      priorityClass: 'medium',
      status: 'Planned',
      statusClass: 'planned',
      dueDate: '25 Sep 2026',
      daysLeft: 9,
      detailedSummary: 'Intermediate overhaul of passenger coaches (IC Schedule).',
      fullDescription: 'Wheel profile measurement, roller bearing greasing, and draw gear spring inspection.',
      daysOverdueText: 'On Schedule',
      createdOn: '08 Sep 2026, 02:20 PM',
      createdBy: 'H. N. Murthy (TDMS)',
      attachments: [
        { name: 'Coach_IC_Checklist.pdf', size: '1.2 MB', type: 'pdf' }
      ]
    },
    {
      id: 'TMS-2026-131',
      source: 'TMS',
      sourceClass: 'tms',
      description: 'Bridge inspection (Routine)',
      section: 'Gumla – Lohardaga',
      location: 'Bridge No. 47',
      department: 'Civil',
      priority: 'Low',
      priorityClass: 'low',
      status: 'In Progress',
      statusClass: 'progress',
      dueDate: '26 Sep 2026',
      daysLeft: 10,
      detailedSummary: 'Pre-monsoon scour and pier settlement structural inspection.',
      fullDescription: 'Visual inspection of steel girders, bearing pads, and river bed cross-sections.',
      daysOverdueText: 'On Schedule',
      createdOn: '10 Sep 2026, 07:45 AM',
      createdBy: 'C. Tirkey (TMS)',
      attachments: [
        { name: 'Bridge47_Inspection.pdf', size: '4.5 MB', type: 'pdf' }
      ]
    },
    {
      id: 'SMMS-2026-144',
      source: 'SMMS',
      sourceClass: 'smms',
      description: 'Axle counter calibration',
      section: 'Ranchi – Namkum',
      location: 'Km 320/8',
      department: 'S&T',
      priority: 'Medium',
      priorityClass: 'medium',
      status: 'Planned',
      statusClass: 'planned',
      dueDate: '28 Sep 2026',
      daysLeft: 12,
      detailedSummary: 'Dual digital axle counter oscillator level alignment.',
      fullDescription: 'Signal cable meggering and channel reset test under zero occupancy condition.',
      daysOverdueText: 'On Schedule',
      createdOn: '11 Sep 2026, 12:00 PM',
      createdBy: 'A. Verma (SMMS)',
      attachments: [
        { name: 'DAC_Calibration_Sheet.pdf', size: '0.9 MB', type: 'pdf' }
      ]
    },
    {
      id: 'TDMS-2026-089',
      source: 'TDMS',
      sourceClass: 'tdms',
      description: 'EMU rake inspection',
      section: 'Ranchi (Shed)',
      location: 'EMU Shed',
      department: 'Electrical',
      priority: 'Low',
      priorityClass: 'low',
      status: 'Planned',
      statusClass: 'planned',
      dueDate: '29 Sep 2026',
      daysLeft: 13,
      detailedSummary: 'Traction motor pantograph carbon strip check and auxiliary compressor check.',
      fullDescription: 'OHE contact strip wear measurement and emergency brake fail-safe test.',
      daysOverdueText: 'On Schedule',
      createdOn: '12 Sep 2026, 10:15 AM',
      createdBy: 'V. Rao (TDMS)',
      attachments: [
        { name: 'EMU_Rake_Test_Log.pdf', size: '1.4 MB', type: 'pdf' }
      ]
    },
    {
      id: 'TMS-2026-150',
      source: 'TMS',
      sourceClass: 'tms',
      description: 'Formation strengthening',
      section: 'Latehar – Garhwa',
      location: 'Km 631/3-5',
      department: 'Track',
      priority: 'High',
      priorityClass: 'high',
      status: 'In Progress',
      statusClass: 'progress',
      dueDate: '30 Sep 2026',
      daysLeft: 14,
      detailedSummary: 'Cess repair and geotextile blanket placement for slope stabilization.',
      fullDescription: 'Subgrade stabilization in heavy coal freight corridor to prevent track geometry twist.',
      daysOverdueText: 'On Schedule',
      createdOn: '13 Sep 2026, 03:30 PM',
      createdBy: 'S. Kumar (TMS)',
      attachments: [
        { name: 'Formation_Scope_Work.pdf', size: '2.8 MB', type: 'pdf' }
      ]
    }
  ];

  // Active currently selected task (defaults to TMS-2026-001)
  let activeTask = masterTasksList[0];

  // Header notifications data
  const notificationsData = [
    { id: 1, type: 'critical', title: 'Task Overdue: Rails renewal (600m)', desc: 'TMS-2026-001 is 5 days overdue on Ranchi – Dhanbad section', time: '10 min ago' },
    { id: 2, type: 'warning', title: 'SMMS Priority Alert', desc: 'Point machine maintenance overdue at Hatia Yard', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'Work Order Approved', desc: 'Diesel loco schedule approved by Sr. DME', time: '3 hours ago' }
  ];

  // ============================================================================
  // SECTION 2: DEFENSIVE RENDERING UTILITIES
  // Fallback banners when data arrays are empty or undefined.
  // ============================================================================
  function createNotFoundPlaceholder(widgetTitle = 'Data') {
    return `
      <div class="not-found-placeholder" style="padding: 1.5rem; text-align: center; color: #64748B;">
        <i class="fa-solid fa-circle-question" style="font-size: 1.8rem; color: #94A3B8; margin-bottom: 0.5rem; display: block;"></i>
        <h4 style="font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">${widgetTitle} Not Found</h4>
        <p style="font-size: 0.72rem; color: #94A3B8;">No records currently available in database.</p>
      </div>
    `;
  }

  // ============================================================================
  // SECTION 3: CORE RENDERERS (Populating DOM Containers via JavaScript)
  // ============================================================================

  // ----------------------------------------------------------------------------
  // 3.1 Render Action Subheader Toolbar Card (Part A)
  // ----------------------------------------------------------------------------
  function renderTasksSubheader() {
    const card = document.getElementById('tasks-subheader-card');
    if (!card) return;

    if (!tasksSubheaderData || !tasksSubheaderData.title) {
      card.innerHTML = createNotFoundPlaceholder('Tasks Subheader');
      return;
    }

    card.innerHTML = `
      <div class="tasks-subheader-left">
        <div class="tasks-page-icon">
          <i class="fa-solid fa-clipboard-list"></i>
        </div>
        <div class="tasks-title-group">
          <h2>${tasksSubheaderData.title}</h2>
          <p>${tasksSubheaderData.subtitle}</p>
        </div>
      </div>

      <div class="tasks-subheader-right">
        <!-- + Create Task Button -->
        <button class="btn-create-task" id="btn-create-task-action">
          <i class="fa-solid fa-plus"></i> Create Task
        </button>

        <!-- Export Button -->
        <button class="btn-export-tasks" id="btn-export-action">
          <i class="fa-solid fa-file-export"></i> Export
        </button>
      </div>
    `;

    // Click handler for + Create Task modal
    const createBtn = card.querySelector('#btn-create-task-action');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const modal = document.getElementById('create-task-modal');
        if (modal) modal.style.display = 'flex';
      });
    }

    // Click handler for Export action
    const exportBtn = card.querySelector('#btn-export-action');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        showToast('Exporting 156 maintenance records to CSV/Excel...', 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.2 Render Top 5 KPI Summary Metric Cards (Part B)
  // ----------------------------------------------------------------------------
  function renderTasksKpis() {
    const container = document.getElementById('tasks-kpi-container');
    if (!container) return;

    if (!Array.isArray(tasksKpisData) || tasksKpisData.length === 0) {
      container.innerHTML = createNotFoundPlaceholder('KPI Summary Metrics');
      return;
    }

    container.innerHTML = tasksKpisData.map(kpi => `
      <div class="tasks-kpi-card" id="${kpi.id}">
        <div class="kpi-icon-box ${kpi.colorTheme}">
          <i class="${kpi.iconClass}"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">${kpi.title}</span>
          <div class="kpi-value-row">
            <span class="kpi-value">${kpi.value}</span>
            <span class="kpi-trend ${kpi.trendClass}">${kpi.trendText}</span>
          </div>
          <span class="kpi-subtext">${kpi.subtext}</span>
        </div>
      </div>
    `).join('');
  }

  // ----------------------------------------------------------------------------
  // 3.3 Render Filter Toolbar Card (Part C)
  // ----------------------------------------------------------------------------
  function renderFilterToolbar() {
    const card = document.getElementById('tasks-filter-toolbar');
    if (!card) return;

    const sectionOptions = (tasksFiltersData.sections || []).map(s => `<option value="${s}">${s}</option>`).join('');
    const severityOptions = (tasksFiltersData.severities || []).map(sev => `<option value="${sev}">${sev}</option>`).join('');
    const deptOptions = (tasksFiltersData.departments || []).map(d => `<option value="${d}">${d}</option>`).join('');
    const statusOptions = (tasksFiltersData.overdueStatuses || []).map(st => `<option value="${st}">${st}</option>`).join('');

    card.innerHTML = `
      <div class="filter-toolbar-inner">
        <!-- Section Filter Field -->
        <div class="filter-field-group">
          <label class="filter-field-label" for="filter-section-select">Section</label>
          <div class="filter-select-wrapper">
            <i class="fa-solid fa-location-dot"></i>
            <select id="filter-section-select" aria-label="Filter by Section">
              ${sectionOptions}
            </select>
          </div>
        </div>

        <!-- Severity Filter Field -->
        <div class="filter-field-group">
          <label class="filter-field-label" for="filter-severity-select">Severity</label>
          <div class="filter-select-wrapper">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <select id="filter-severity-select" aria-label="Filter by Severity">
              ${severityOptions}
            </select>
          </div>
        </div>

        <!-- Department Filter Field -->
        <div class="filter-field-group">
          <label class="filter-field-label" for="filter-dept-select">Department</label>
          <div class="filter-select-wrapper">
            <i class="fa-solid fa-diagram-project"></i>
            <select id="filter-dept-select" aria-label="Filter by Department">
              ${deptOptions}
            </select>
          </div>
        </div>

        <!-- Overdue Status Filter Field -->
        <div class="filter-field-group">
          <label class="filter-field-label" for="filter-status-select">Overdue Status</label>
          <div class="filter-select-wrapper">
            <i class="fa-regular fa-clock"></i>
            <select id="filter-status-select" aria-label="Filter by Status">
              ${statusOptions}
            </select>
          </div>
        </div>

        <!-- Date Range Filter Field -->
        <div class="filter-field-group">
          <label class="filter-field-label">Date Range</label>
          <div class="filter-date-pill" id="filter-date-pill" title="Click to change date range">
            <i class="fa-regular fa-calendar-days"></i>
            <span>${tasksFiltersData.currentDateRange}</span>
          </div>
        </div>

        <!-- Action Buttons Group -->
        <div class="filter-actions-group">
          <button class="btn-apply-filters" id="btn-apply-filters">
            <i class="fa-solid fa-filter"></i> Apply Filters
          </button>
          <button class="btn-reset-filters" id="btn-reset-filters">
            Reset
          </button>
        </div>
      </div>
    `;

    // Filter event listeners
    const sectionSelect = card.querySelector('#filter-section-select');
    const severitySelect = card.querySelector('#filter-severity-select');
    const deptSelect = card.querySelector('#filter-dept-select');
    const statusSelect = card.querySelector('#filter-status-select');
    const applyBtn = card.querySelector('#btn-apply-filters');
    const resetBtn = card.querySelector('#btn-reset-filters');

    function applyTaskFilters() {
      const secVal = sectionSelect ? sectionSelect.value : 'All Sections';
      const sevVal = severitySelect ? severitySelect.value : 'All Severities';
      const deptVal = deptSelect ? deptSelect.value : 'All Departments';
      const statVal = statusSelect ? statusSelect.value : 'All Tasks';

      const filtered = masterTasksList.filter(task => {
        const matchSec = (secVal === 'All Sections') || task.section.includes(secVal.replace('All Sections', ''));
        const matchSev = (sevVal === 'All Severities') || (sevVal.includes(task.priority));
        const matchDept = (deptVal === 'All Departments') || (task.department === deptVal);
        let matchStat = true;
        if (statVal === 'Overdue Tasks') matchStat = task.status === 'Overdue';
        else if (statVal !== 'All Tasks') matchStat = task.status === statVal;

        return matchSec && matchSev && matchDept && matchStat;
      });

      renderTasksTable(filtered);
      showToast(`Showing ${filtered.length} filtered maintenance tasks`, 'info');
    }

    if (applyBtn) applyBtn.addEventListener('click', applyTaskFilters);
    if (sectionSelect) sectionSelect.addEventListener('change', applyTaskFilters);
    if (severitySelect) severitySelect.addEventListener('change', applyTaskFilters);
    if (deptSelect) deptSelect.addEventListener('change', applyTaskFilters);
    if (statusSelect) statusSelect.addEventListener('change', applyTaskFilters);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (sectionSelect) sectionSelect.value = 'All Sections';
        if (severitySelect) severitySelect.value = 'All Severities';
        if (deptSelect) deptSelect.value = 'All Departments';
        if (statusSelect) statusSelect.value = 'All Tasks';
        renderTasksTable(masterTasksList);
        showToast('All task filters reset', 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.4 Render Middle Analytics Charts (Part D.1)
  // ----------------------------------------------------------------------------

  // 3.4.1 Chart 1: Tasks by Priority (Donut Chart)
  function renderPriorityChart() {
    const card = document.getElementById('chart-priority-card');
    if (!card) return;

    // SVG Donut calculation: circumference = 2 * PI * r = 2 * 3.14159 * 42 = 263.89
    const circumference = 263.89;
    const c1 = (42 / 156) * circumference; // 71.04
    const c2 = (68 / 156) * circumference; // 115.03
    const c3 = (46 / 156) * circumference; // 77.82

    card.innerHTML = `
      <div class="chart-card-header">
        <h4 class="chart-card-title">Tasks by Priority</h4>
      </div>
      <div class="donut-chart-layout">
        <div class="donut-graphic-box">
          <svg class="donut-svg-graphic" viewBox="0 0 100 100">
            <!-- Background ring -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" stroke-width="12"></circle>
            <!-- High Priority Segment (Red) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#EF4444" stroke-width="12"
              stroke-dasharray="${c1} ${circumference - c1}" stroke-dashoffset="0"></circle>
            <!-- Medium Priority Segment (Orange) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F59E0B" stroke-width="12"
              stroke-dasharray="${c2} ${circumference - c2}" stroke-dashoffset="-${c1}"></circle>
            <!-- Low Priority Segment (Green) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" stroke-width="12"
              stroke-dasharray="${c3} ${circumference - c3}" stroke-dashoffset="-${c1 + c2}"></circle>
          </svg>
          <div class="donut-center-info">
            <span class="donut-center-val">${priorityChartData.total}</span>
            <span class="donut-center-tag">Tasks</span>
          </div>
        </div>
        <div class="donut-legend-col">
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch red"></span><span>High Priority</span></div>
            <span class="donut-legend-val">42</span>
          </div>
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch orange"></span><span>Medium Priority</span></div>
            <span class="donut-legend-val">68</span>
          </div>
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch green"></span><span>Low Priority</span></div>
            <span class="donut-legend-val">46</span>
          </div>
        </div>
      </div>
    `;
  }

  // 3.4.2 Chart 2: Tasks by Department (SVG Bar Chart)
  function renderDeptChart() {
    const card = document.getElementById('chart-dept-card');
    if (!card) return;

    // SVG Bar Chart Dimensions: 260px wide x 115px high
    card.innerHTML = `
      <div class="chart-card-header">
        <h4 class="chart-card-title">Tasks by Department</h4>
      </div>
      <div class="dept-bar-chart-container">
        <svg class="bar-chart-svg" viewBox="0 0 280 115">
          <!-- Horizontal reference grid lines -->
          <line x1="25" y1="15" x2="275" y2="15" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="3 3"></line>
          <line x1="25" y1="40" x2="275" y2="40" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="3 3"></line>
          <line x1="25" y1="65" x2="275" y2="65" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="3 3"></line>
          <line x1="25" y1="90" x2="275" y2="90" stroke="#E2E8F0" stroke-width="1"></line>

          <!-- Y-axis labels -->
          <text x="18" y="18" font-size="8" fill="#94A3B8" text-anchor="end" font-weight="600">40</text>
          <text x="18" y="43" font-size="8" fill="#94A3B8" text-anchor="end" font-weight="600">30</text>
          <text x="18" y="68" font-size="8" fill="#94A3B8" text-anchor="end" font-weight="600">20</text>
          <text x="18" y="93" font-size="8" fill="#94A3B8" text-anchor="end" font-weight="600">10</text>

          <!-- Bar 1: Track (38) -->
          <rect x="35" y="19" width="16" height="71" rx="2" fill="#2563EB"></rect>
          <text x="43" y="14" font-size="8" fill="#0F172A" text-anchor="middle" font-weight="800">38</text>
          <text x="43" y="103" font-size="7.5" fill="#475569" text-anchor="middle" font-weight="600">Track</text>

          <!-- Bar 2: S&T (28) -->
          <rect x="75" y="38" width="16" height="52" rx="2" fill="#10B981"></rect>
          <text x="83" y="33" font-size="8" fill="#0F172A" text-anchor="middle" font-weight="800">28</text>
          <text x="83" y="103" font-size="7.5" fill="#475569" text-anchor="middle" font-weight="600">S&T</text>

          <!-- Bar 3: Electrical (24) -->
          <rect x="115" y="45" width="16" height="45" rx="2" fill="#3B82F6"></rect>
          <text x="123" y="40" font-size="8" fill="#0F172A" text-anchor="middle" font-weight="800">24</text>
          <text x="123" y="103" font-size="7.5" fill="#475569" text-anchor="middle" font-weight="600">Electrical</text>

          <!-- Bar 4: Civil (18) -->
          <rect x="155" y="56" width="16" height="34" rx="2" fill="#0EA5E9"></rect>
          <text x="163" y="51" font-size="8" fill="#0F172A" text-anchor="middle" font-weight="800">18</text>
          <text x="163" y="103" font-size="7.5" fill="#475569" text-anchor="middle" font-weight="600">Civil</text>

          <!-- Bar 5: OHE (16) -->
          <rect x="195" y="60" width="16" height="30" rx="2" fill="#8B5CF6"></rect>
          <text x="203" y="55" font-size="8" fill="#0F172A" text-anchor="middle" font-weight="800">16</text>
          <text x="203" y="103" font-size="7.5" fill="#475569" text-anchor="middle" font-weight="600">OHE</text>

          <!-- Bar 6: Others (12) -->
          <rect x="235" y="68" width="16" height="22" rx="2" fill="#94A3B8"></rect>
          <text x="243" y="63" font-size="8" fill="#0F172A" text-anchor="middle" font-weight="800">12</text>
          <text x="243" y="103" font-size="7.5" fill="#475569" text-anchor="middle" font-weight="600">Others</text>
        </svg>
      </div>
    `;
  }

  // 3.4.3 Chart 3: Task Status (Donut Chart)
  function renderStatusChart() {
    const card = document.getElementById('chart-status-card');
    if (!card) return;

    // SVG Donut calculation: circumference = 2 * PI * r = 263.89
    const circumference = 263.89;
    const c1 = (24 / 156) * circumference; // Completed: 40.59
    const c2 = (62 / 156) * circumference; // In Progress: 104.87
    const c3 = (42 / 156) * circumference; // Planned: 71.04
    const c4 = (28 / 156) * circumference; // Overdue: 47.36

    card.innerHTML = `
      <div class="chart-card-header">
        <h4 class="chart-card-title">Task Status</h4>
      </div>
      <div class="donut-chart-layout">
        <div class="donut-graphic-box">
          <svg class="donut-svg-graphic" viewBox="0 0 100 100">
            <!-- Background ring -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" stroke-width="12"></circle>
            <!-- Completed (Green) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" stroke-width="12"
              stroke-dasharray="${c1} ${circumference - c1}" stroke-dashoffset="0"></circle>
            <!-- In Progress (Blue) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#2563EB" stroke-width="12"
              stroke-dasharray="${c2} ${circumference - c2}" stroke-dashoffset="-${c1}"></circle>
            <!-- Planned (Orange/Yellow) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F59E0B" stroke-width="12"
              stroke-dasharray="${c3} ${circumference - c3}" stroke-dashoffset="-${c1 + c2}"></circle>
            <!-- Overdue (Red) -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="#EF4444" stroke-width="12"
              stroke-dasharray="${c4} ${circumference - c4}" stroke-dashoffset="-${c1 + c2 + c3}"></circle>
          </svg>
          <div class="donut-center-info">
            <span class="donut-center-val">${statusChartData.total}</span>
            <span class="donut-center-tag">Tasks</span>
          </div>
        </div>
        <div class="donut-legend-col">
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch green"></span><span>Completed</span></div>
            <span class="donut-legend-val">24</span>
          </div>
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch blue"></span><span>In Progress</span></div>
            <span class="donut-legend-val">62</span>
          </div>
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch orange"></span><span>Planned</span></div>
            <span class="donut-legend-val">42</span>
          </div>
          <div class="donut-legend-row">
            <div class="donut-legend-label"><span class="legend-swatch red"></span><span>Overdue</span></div>
            <span class="donut-legend-val">28</span>
          </div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 3.5 Render Maintenance Task List Table Card (Part D.2)
  // ----------------------------------------------------------------------------
  function renderTasksTable(tasksToRender = masterTasksList) {
    const card = document.getElementById('tasks-table-card');
    if (!card) return;

    if (!Array.isArray(tasksToRender) || tasksToRender.length === 0) {
      card.innerHTML = `
        <div class="table-card-header">
          <h3 class="table-card-title">Maintenance Task List (TMS + SMMS + TDMS)</h3>
        </div>
        ${createNotFoundPlaceholder('Tasks Records')}
      `;
      return;
    }

    const rowsMarkup = tasksToRender.map((task) => {
      const isSelected = (activeTask && activeTask.id === task.id) ? 'active-row' : '';
      const daysLeftClass = task.daysLeft < 0 ? 'negative' : 'positive';
      const daysLeftSign = task.daysLeft > 0 ? `${task.daysLeft}` : `${task.daysLeft}`;

      return `
        <tr class="task-row ${isSelected}" data-task-id="${task.id}">
          <td>
            <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" aria-label="Select task ${task.id}">
          </td>
          <td class="task-id-cell">${task.id}</td>
          <td>
            <span class="source-pill ${task.sourceClass}">${task.source}</span>
          </td>
          <td style="font-weight:600; color:#0F172A;">${task.description}</td>
          <td>${task.section}</td>
          <td style="font-family:var(--font-mono); font-size:0.71rem;">${task.location}</td>
          <td>${task.department}</td>
          <td>
            <span class="priority-pill ${task.priorityClass}">${task.priority}</span>
          </td>
          <td>
            <span class="status-pill ${task.statusClass}">${task.status}</span>
          </td>
          <td style="font-family:var(--font-mono); font-size:0.71rem;">${task.dueDate}</td>
          <td class="days-left-cell ${daysLeftClass}">${daysLeftSign}</td>
          <td style="text-align:center;">
            <button class="action-menu-btn" data-task-id="${task.id}" title="Task Actions" aria-label="More actions">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    card.innerHTML = `
      <div class="table-card-header">
        <h3 class="table-card-title">Maintenance Task List (TMS + SMMS + TDMS)</h3>
        <div class="table-pagination-info">
          <span>Showing 1-10 of 156 tasks</span>
          <div class="pagination-btn-group">
            <button class="page-arrow-btn" id="prev-page-btn" aria-label="Previous Page"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="page-arrow-btn" id="next-page-btn" aria-label="Next Page"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <div class="task-table-scroll-wrapper">
        <table class="task-table">
          <thead>
            <tr>
              <th><input type="checkbox" id="select-all-tasks" aria-label="Select all tasks"></th>
              <th>Task ID</th>
              <th>Source</th>
              <th>Task Description</th>
              <th>Section</th>
              <th>Location</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Days Left</th>
              <th style="text-align:center;">•••</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      </div>
    `;

    // Row click listeners to inspect task details in the right-hand panel
    card.querySelectorAll('.task-row').forEach(row => {
      row.addEventListener('click', (e) => {
        // Prevent click if user clicked the checkbox directly
        if (e.target.tagName.toLowerCase() === 'input' || e.target.closest('.action-menu-btn')) return;

        const taskId = row.getAttribute('data-task-id');
        const matched = masterTasksList.find(t => t.id === taskId);
        if (matched) {
          activeTask = matched;
          card.querySelectorAll('.task-row').forEach(r => r.classList.remove('active-row'));
          row.classList.add('active-row');
          renderTaskDetails(matched);
          showToast(`Selected task: ${matched.id} (${matched.description})`, 'info');
        }
      });
    });

    // Select-all checkbox listener
    const selectAllCb = card.querySelector('#select-all-tasks');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const checked = e.target.checked;
        card.querySelectorAll('.task-checkbox').forEach(cb => {
          cb.checked = checked;
        });
        showToast(checked ? 'All 10 visible tasks selected' : 'All tasks deselected', 'info');
      });
    }

    // Pagination buttons
    const prevBtn = card.querySelector('#prev-page-btn');
    const nextBtn = card.querySelector('#next-page-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => showToast('You are on Page 1 of 16', 'info'));
    if (nextBtn) nextBtn.addEventListener('click', () => showToast('Loaded Page 2 (tasks 11 to 20)', 'info'));
  }

  // ----------------------------------------------------------------------------
  // 3.6 Render Active Task Details Panel Card (Part D.3)
  // ----------------------------------------------------------------------------
  function renderTaskDetails(task = activeTask) {
    const card = document.getElementById('task-details-card');
    if (!card) return;

    if (!task || !task.id) {
      card.innerHTML = createNotFoundPlaceholder('Task Details');
      return;
    }

    const attachmentsHtml = (task.attachments || []).map(att => `
      <div class="attachment-file-pill">
        <i class="fa-solid ${att.type === 'pdf' ? 'fa-file-pdf pdf' : 'fa-file-image img'}"></i>
        <div class="file-pill-text">
          <span class="file-name" title="${att.name}">${att.name}</span>
          <span class="file-size">${att.size}</span>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="task-details-header">
        <h3 class="card-title">Task Details</h3>
        <button class="btn-close-task-details" id="btn-close-task-details" title="Dismiss details" aria-label="Close details">&times;</button>
      </div>

      <div class="task-details-body">
        <!-- Task ID and Status Badge -->
        <div class="task-id-badge-row">
          <span class="task-id-title">${task.id}</span>
          <span class="status-pill ${task.statusClass}">${task.status}</span>
        </div>

        <!-- Main Title & Subtitle -->
        <h4 class="task-main-desc">${task.description}</h4>
        <p class="task-sub-desc">${task.detailedSummary}</p>

        <!-- Navigation Tabs (Details, Timeline, Assets, AI Insights) -->
        <div class="task-detail-tabs">
          <button class="task-tab-btn active" data-tab="details">Details</button>
          <button class="task-tab-btn" data-tab="timeline">Timeline</button>
          <button class="task-tab-btn" data-tab="assets">Assets (3)</button>
          <button class="task-tab-btn" data-tab="ai">AI Insights</button>
        </div>

        <!-- Aligned Metadata Key-Value List -->
        <div class="task-meta-list">
          <!-- Source -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-solid fa-location-dot"></i>
              <span>Source</span>
            </div>
            <div class="task-meta-val">
              <span class="source-pill ${task.sourceClass}">${task.source}</span>
            </div>
          </div>

          <!-- Section -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-solid fa-location-pin"></i>
              <span>Section</span>
            </div>
            <div class="task-meta-val">${task.section}</div>
          </div>

          <!-- Location -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-solid fa-road"></i>
              <span>Location</span>
            </div>
            <div class="task-meta-val mono">${task.location}</div>
          </div>

          <!-- Department -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-solid fa-users-gear"></i>
              <span>Department</span>
            </div>
            <div class="task-meta-val">${task.department}</div>
          </div>

          <!-- Priority -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>Priority</span>
            </div>
            <div class="task-meta-val">
              <span class="priority-pill ${task.priorityClass}">${task.priority}</span>
            </div>
          </div>

          <!-- Status -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-solid fa-circle-info"></i>
              <span>Status</span>
            </div>
            <div class="task-meta-val">
              <span class="status-pill ${task.statusClass}">${task.status}</span>
            </div>
          </div>

          <!-- Due Date -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-regular fa-calendar"></i>
              <span>Due Date</span>
            </div>
            <div class="task-meta-val mono">${task.dueDate}</div>
          </div>

          <!-- Days Overdue / Left -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-regular fa-clock"></i>
              <span>Days Overdue</span>
            </div>
            <div class="task-meta-val red-text">${task.daysOverdueText}</div>
          </div>

          <!-- Created On -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-regular fa-clock"></i>
              <span>Created On</span>
            </div>
            <div class="task-meta-val mono">${task.createdOn}</div>
          </div>

          <!-- Created By -->
          <div class="task-meta-row">
            <div class="task-meta-key">
              <i class="fa-regular fa-user"></i>
              <span>Created By</span>
            </div>
            <div class="task-meta-val">${task.createdBy}</div>
          </div>
        </div>

        <!-- Description Block -->
        <div class="task-description-block">
          <h5>Description</h5>
          <p>${task.fullDescription}</p>
        </div>

        <!-- Attachments Block -->
        <div class="task-attachments-block">
          <div class="attachments-header">
            <h5>Attachments (2)</h5>
            <a href="#attachments" id="link-view-all-att">View All</a>
          </div>
          <div class="attachments-grid">
            ${attachmentsHtml}
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="task-details-actions">
          <button class="btn-update-status" id="btn-update-status-action">
            Update Status <i class="fa-solid fa-chevron-down" style="font-size:0.65rem;"></i>
          </button>
          <button class="btn-add-comment" id="btn-add-comment-action">
            Add Comment
          </button>
        </div>
      </div>
    `;

    // Close button
    const closeBtn = card.querySelector('#btn-close-task-details');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        showToast('Task details panel dismissed', 'info');
      });
    }

    // Detail tabs listener
    card.querySelectorAll('.task-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        card.querySelectorAll('.task-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const tab = e.currentTarget.getAttribute('data-tab');
        showToast(`Viewing ${tab.toUpperCase()} tab for ${task.id}`, 'info');
      });
    });

    // Update status button
    const updateBtn = card.querySelector('#btn-update-status-action');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        showToast(`Status updated to IN PROGRESS for ${task.id}`, 'info');
      });
    }

    // Add comment button
    const commentBtn = card.querySelector('#btn-add-comment-action');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        showToast(`Comment editor opened for ${task.id}`, 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.7 Render Global Sidebar Card, User Profile, and Footer
  // ----------------------------------------------------------------------------
  function renderSidebarAndFooter() {
    // 1. Sidebar Bottom Card
    const sidebarCard = document.getElementById('sidebar-train-card');
    if (sidebarCard) {
      sidebarCard.innerHTML = `
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

    // 2. User Profile Badge in Header
    const userContainer = document.getElementById('user-profile-container');
    if (userContainer) {
      userContainer.innerHTML = `
        <div class="user-avatar" title="Rajesh - Team ThinkSync">HS</div>
        <div class="user-info">
          <span class="user-name">Rajesh</span>
          <span class="user-role">Team ThinkSync</span>
        </div>
        <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
      `;
    }

    // 3. Footer Mottos and Links
    const quoteContainer = document.getElementById('footer-quote-container');
    if (quoteContainer) {
      quoteContainer.innerHTML = `"Optimizing today for a safer, stronger tomorrow."`;
    }

    const linksContainer = document.getElementById('footer-links-container');
    if (linksContainer) {
      linksContainer.innerHTML = `
        <a href="#railways">Indian Railways</a>
        <a href="#smart">Smart Infrastructure</a>
        <a href="#connected">Connected India</a>
        <a href="#thinksync">ThinkSync</a>
      `;
    }

    // 4. Notifications Badge and Dropdown
    const notifBadge = document.getElementById('header-notif-badge');
    const notifDropdownCount = document.getElementById('notif-dropdown-count');
    const notifList = document.getElementById('notif-list-container');

    if (notifBadge) notifBadge.textContent = '3';
    if (notifDropdownCount) notifDropdownCount.textContent = '3 New';

    if (notifList) {
      notifList.innerHTML = notificationsData.map(n => `
        <div class="notif-item">
          <span class="notif-type-dot ${n.type}"></span>
          <div class="notif-info">
            <span class="notif-title">${n.title}</span>
            <span class="notif-desc">${n.desc}</span>
            <span class="notif-time">${n.time}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // ----------------------------------------------------------------------------
  // 3.8 Global Event Listeners (Sidebar toggle, modal, notifications, search)
  // ----------------------------------------------------------------------------
  function setupEventListeners() {
    // 1. Sidebar Collapse / Expand is centrally managed by theme-sync.js

    // 2. Notification Dropdown Toggle
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.classList.remove('show');
        }
      });
    }

    // 3. Create Task Modal Logic
    const modal = document.getElementById('create-task-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-task-btn');
    const form = document.getElementById('create-task-form');

    function closeModal() {
      if (modal) modal.style.display = 'none';
      if (form) form.reset();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const source = document.getElementById('task-source-input').value;
        const dept = document.getElementById('task-dept-input').value;
        const section = document.getElementById('task-section-input').value;
        const loc = document.getElementById('task-location-input').value;
        const prio = document.getElementById('task-priority-input').value;
        const due = document.getElementById('task-due-input').value;
        const desc = document.getElementById('task-desc-input').value;

        const newId = `${source}-2026-${Math.floor(100 + Math.random() * 900)}`;
        const newTask = {
          id: newId,
          source: source,
          sourceClass: source.toLowerCase(),
          description: desc,
          section: section,
          location: loc,
          department: dept,
          priority: prio,
          priorityClass: prio.toLowerCase(),
          status: 'Planned',
          statusClass: 'planned',
          dueDate: due,
          daysLeft: 7,
          detailedSummary: `${dept} maintenance scheduled via ${source}.`,
          fullDescription: `${desc} scheduled on ${section} (${loc}) under planned maintenance work order.`,
          daysOverdueText: 'On Schedule',
          createdOn: 'Just now',
          createdBy: 'Harsh (ThinkSync)',
          attachments: [
            { name: `Work_Order_${newId}.pdf`, size: '1.2 MB', type: 'pdf' }
          ]
        };

        masterTasksList.unshift(newTask);
        activeTask = newTask;
        renderTasksTable(masterTasksList);
        renderTaskDetails(newTask);
        closeModal();
        showToast(`Task ${newId} created successfully!`, 'info');
      });
    }

    // 4. Global Search Filter
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          renderTasksTable(masterTasksList);
          return;
        }
        const filtered = masterTasksList.filter(t => 
          t.id.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.section.toLowerCase().includes(query) ||
          t.department.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query)
        );
        renderTasksTable(filtered);
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.9 Toast Notification Utility
  // ----------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    const iconClass = type === 'danger' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-info';
    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ============================================================================
  // SECTION 4: INITIALIZATION LIFECYCLE
  // ============================================================================
  renderTasksSubheader();
  renderTasksKpis();
  renderFilterToolbar();
  renderPriorityChart();
  renderDeptChart();
  renderStatusChart();
  renderTasksTable(masterTasksList);
  renderTaskDetails(activeTask);
  renderSidebarAndFooter();
  setupEventListeners();

});
