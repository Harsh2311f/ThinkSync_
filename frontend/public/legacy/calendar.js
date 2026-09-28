/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION: BLOCK CALENDAR (PAGE 3)
 * File: calendar.js
 * Architecture: 100% Dynamic Client-side JavaScript Data-Driven Dashboard
 * 
 * DESIGN PRINCIPLES:
 * 1. ZERO HARDCODED CONTENT: All DOM widgets are populated via JavaScript data.
 * 2. DEFENSIVE RENDERING: When data is missing, an elegant 'Not Found' banner is
 *    displayed gracefully without breaking container layouts.
 * 3. EXTENSIVE DOCUMENTATION: Every section includes clear comment links and explanations.
 * 4. INTERACTIVITY: Block selection, live filtering, month navigation, view switches,
 *    creation modals, notifications, and smooth sidebar toggling.
 * ==============================================================================
 */

/* React mount adapter: original page engine starts after JSX is mounted. */
(function () {

  // ============================================================================
  // SECTION 1: MASTER DATA STORE (Mock Data Definitions)
  // All dashboard state and data objects are centralized here.
  // ============================================================================

  // 1.1 Action Subheader Configuration
  const calendarSubheaderData = {
    title: 'Block Calendar',
    subtitle: 'Plan, visualize and manage maintenance blocks across the Jharkhand Railway Network',
    currentMonth: 'Sep 2026',
    activeView: 'week',
    views: [
      { id: 'week', label: 'Week' },
      { id: 'month', label: 'Month' },
      { id: 'timeline', label: 'Timeline' }
    ]
  };

  // 1.2 Top 5 KPI Summary Metrics Ribbon
  const calendarKpisData = [
    {
      id: 'kpi-total-blocks',
      title: 'Total Blocks (This Month)',
      value: 42,
      trendText: '↑ 10%',
      trendClass: 'green',
      subtext: 'vs. last month',
      iconClass: 'fa-regular fa-calendar-days',
      colorTheme: 'blue'
    },
    {
      id: 'kpi-planned-blocks',
      title: 'Planned Blocks',
      value: 34,
      trendText: '81%',
      trendClass: 'green',
      subtext: 'on schedule',
      iconClass: 'fa-regular fa-circle-check',
      colorTheme: 'green'
    },
    {
      id: 'kpi-in-progress',
      title: 'In Progress',
      value: 5,
      trendText: '12%',
      trendClass: 'red',
      subtext: 'Active this week',
      iconClass: 'fa-regular fa-clock',
      colorTheme: 'orange'
    },
    {
      id: 'kpi-conflicts',
      title: 'Conflicts',
      value: 3,
      trendText: '↓ 7%',
      trendClass: 'red',
      subtext: 'Require attention',
      iconClass: 'fa-solid fa-triangle-exclamation',
      colorTheme: 'red'
    },
    {
      id: 'kpi-depts',
      title: 'Departments Involved',
      value: 3,
      trendText: '',
      trendClass: '',
      subtext: 'Engineering • S&T • TRD',
      iconClass: 'fa-solid fa-users-gear',
      colorTheme: 'purple'
    }
  ];

  // 1.3 Filter Options
  const calendarFiltersData = {
    sections: [
      'All Sections',
      'Bokaro – Chandrapura',
      'Ranchi – Namkum',
      'Latehar – Daltonganj',
      'Chakradharpur – Rourkela',
      'Dhanbad – KumerDubi',
      'Gumla – Lohardaga',
      'Hazaribagh – Koderma',
      'Ramgarh – Patratu',
      'Tatanagar – Ranchi',
      'Asansol – Dhanbad',
      'Simdega – Kunti',
      'Chatra – Gaya',
      'Ranchi – Howrah'
    ],
    departments: ['All Departments', 'Engineering', 'S&T', 'TRD', 'Joint / Multiple'],
    blockTypes: ['All Block Types', 'Track Renewal', 'Signaling Maintenance', 'OHE Power Block', 'Deep Screening', 'Bridge Rehabilitation'],
    statuses: ['All Status', 'Planned', 'In Progress', 'Conflict', 'Completed']
  };

  // 1.4 Week Days and Time Slots Definition
  const calendarDays = [
    { day: 'Mon', date: '14 Sep', fullDate: '2026-09-14' },
    { day: 'Tue', date: '15 Sep', fullDate: '2026-09-15' },
    { day: 'Wed', date: '16 Sep', fullDate: '2026-09-16' },
    { day: 'Thu', date: '17 Sep', fullDate: '2026-09-17' },
    { day: 'Fri', date: '18 Sep', fullDate: '2026-09-18' },
    { day: 'Sat', date: '19 Sep', fullDate: '2026-09-19' },
    { day: 'Sun', date: '20 Sep', fullDate: '2026-09-20' }
  ];

  const timeSlots = [
    { label: '00:00', startHour: 0, endHour: 4 },
    { label: '04:00', startHour: 4, endHour: 8 },
    { label: '08:00', startHour: 8, endHour: 12 },
    { label: '12:00', startHour: 12, endHour: 16 },
    { label: '16:00', startHour: 16, endHour: 20 },
    { label: '20:00', startHour: 20, endHour: 24 },
    { label: '24:00', startHour: 24, endHour: 28 }
  ];

  // 1.5 Calendar Scheduled Blocks (13 Blocks Matching Reference Image)
  const calendarBlocks = [
    {
      id: 'BLK-001',
      code: 'JH-BOK-002',
      section: 'Bokaro – Chandrapura',
      locationDetail: 'Bokaro - Chandrapura (Down Line)',
      dayIndex: 0, // Mon 14 Sep
      slotIndex: 0, // 00:00 - 04:00
      time: '01:30 – 04:30',
      duration: '3 hrs',
      dateFormatted: 'Tue, 15 Sep 2026',
      department: 'Engineering',
      deptClass: 'engineering',
      deptBadge: 'Engineering',
      status: 'Planned',
      sectionLength: '48 km',
      workDescription: 'Track renewal, ballast cleaning and Tamping.',
      relatedTasks: 3,
      resourcePlan: '2 gangs, 1 OHE vehicle, 1 Tamping Machine',
      aiSuggestion: 'Consider clubbing with S&T block on 16 Sep for cost optimization.',
      isConflict: false
    },
    {
      id: 'BLK-002',
      code: 'JH-GML-003',
      section: 'Gumla – Lohardaga',
      locationDetail: 'Gumla - Lohardaga (Single Line)',
      dayIndex: 0, // Mon 14 Sep
      slotIndex: 2, // 08:00 - 12:00
      time: '10:00 – 04:00',
      duration: '6 hrs',
      dateFormatted: 'Mon, 14 Sep 2026',
      department: 'TRD',
      deptClass: 'trd',
      deptBadge: 'TRD',
      status: 'Planned',
      sectionLength: '47 km',
      workDescription: 'OHE insulator replacement and contact wire height inspection.',
      relatedTasks: 2,
      resourcePlan: '1 TRD gang, 1 tower wagon',
      aiSuggestion: 'Adjust timing to avoid coal freight convoy scheduled at 13:45.',
      isConflict: false
    },
    {
      id: 'BLK-003',
      code: 'JH-HWH-010',
      section: 'Ranchi – Howrah',
      locationDetail: 'Ranchi - Muri - Jhalida Line',
      dayIndex: 0, // Mon 14 Sep
      slotIndex: 4, // 16:00 - 20:00
      time: '18:00 – 22:00',
      duration: '4 hrs',
      dateFormatted: 'Mon, 14 Sep 2026',
      department: 'Joint',
      deptClass: 'multiple',
      deptBadge: 'Eng',
      extraDeptBadge: 'S&T',
      status: 'In Progress',
      sectionLength: '62 km',
      workDescription: 'Joint block: Point machine replacement & rail ultrasonic flaw testing.',
      relatedTasks: 4,
      resourcePlan: '3 combined squads, 1 diagnostic trolley',
      aiSuggestion: 'Section occupancy exceeds normal window; execute signaling calibration concurrently.',
      isConflict: false
    },
    {
      id: 'BLK-004',
      code: 'JH-RNC-004',
      section: 'Ranchi – Namkum',
      locationDetail: 'Ranchi Outer Interlocking Zone',
      dayIndex: 1, // Tue 15 Sep
      slotIndex: 0, // 00:00 - 04:00
      time: '02:00 – 05:00',
      duration: '3 hrs',
      dateFormatted: 'Tue, 15 Sep 2026',
      department: 'S&T',
      deptClass: 'st',
      deptBadge: 'S&T',
      status: 'Planned',
      sectionLength: '14 km',
      workDescription: 'Axle counter testing and track circuit relay overhaul.',
      relatedTasks: 2,
      resourcePlan: '1 S&T team, test multimeter kit',
      aiSuggestion: 'High reliability window: train density lowest between 02:00 and 04:30.',
      isConflict: false
    },
    {
      id: 'BLK-005',
      code: 'JH-HZR-001',
      section: 'Hazaribagh – Koderma',
      locationDetail: 'Hazaribagh Town - Barhi Section',
      dayIndex: 1, // Tue 15 Sep
      slotIndex: 2, // 08:00 - 12:00
      time: '10:30 – 14:30',
      duration: '4 hrs',
      dateFormatted: 'Tue, 15 Sep 2026',
      department: 'Engineering',
      deptClass: 'engineering',
      deptBadge: 'Engineering',
      status: 'Planned',
      sectionLength: '52 km',
      workDescription: 'Deep screening and shoulder ballast cleaning using BCM machine.',
      relatedTasks: 5,
      resourcePlan: '2 P-Way gangs, 1 BCM 09-32 machine',
      aiSuggestion: 'Verify spoil disposal wagons ready at Koderma siding prior to block permit.',
      isConflict: false
    },
    {
      id: 'BLK-006',
      code: 'JH-CKP-005',
      section: 'Chakradharpur – Rourkela',
      locationDetail: 'Chakradharpur West Yard Bypass',
      dayIndex: 2, // Wed 16 Sep
      slotIndex: 2, // 08:00 - 12:00
      time: '11:00 – 15:00',
      duration: '4 hrs',
      dateFormatted: 'Wed, 16 Sep 2026',
      department: 'S&T',
      deptClass: 'st',
      deptBadge: 'S&T',
      status: 'Planned',
      sectionLength: '74 km',
      workDescription: 'Electronic interlocking software patch & cable sheath continuity check.',
      relatedTasks: 3,
      resourcePlan: '1 senior telecom engineer, 2 technicians',
      aiSuggestion: 'Coordinate with SER HQ for automated dispatch failover routing.',
      isConflict: false
    },
    {
      id: 'BLK-007',
      code: 'JH-RAM-011',
      section: 'Ramgarh – Patratu',
      locationDetail: 'Ramgarh Cantt - Patratu Coal Link',
      dayIndex: 2, // Wed 16 Sep
      slotIndex: 4, // 16:00 - 20:00
      time: '18:30 – 22:30',
      duration: '4 hrs',
      dateFormatted: 'Wed, 16 Sep 2026',
      department: 'TRD',
      deptClass: 'trd',
      deptBadge: 'TRD',
      status: 'Planned',
      sectionLength: '36 km',
      workDescription: 'Section insulator replacement and bracket assembly alignment.',
      relatedTasks: 2,
      resourcePlan: '1 TRD gang, 1 motorized ladder trolley',
      aiSuggestion: 'Thermal power rakes prioritized; restore 25kV feeder by 22:30 sharp.',
      isConflict: false
    },
    {
      id: 'BLK-008',
      code: 'JH-TAT-006',
      section: 'Tatanagar – Ranchi',
      locationDetail: 'Chandil - Kandra Gradient',
      dayIndex: 3, // Thu 17 Sep
      slotIndex: 0, // 00:00 - 04:00
      time: '01:00 – 04:00',
      duration: '3 hrs',
      dateFormatted: 'Thu, 17 Sep 2026',
      department: 'TRD',
      deptClass: 'trd',
      deptBadge: 'TRD',
      status: 'Planned',
      sectionLength: '89 km',
      workDescription: 'Catenary wire tension regulation and dropper replacement.',
      relatedTasks: 3,
      resourcePlan: '2 TRD squads, 1 tower wagon',
      aiSuggestion: 'Safe low-traffic corridor slot with zero Rajdhani schedule clashes.',
      isConflict: false
    },
    {
      id: 'BLK-009',
      code: 'JH-LDH-008',
      section: 'Latehar – Daltonganj',
      locationDetail: 'Latehar Outer Curve km 24-28',
      dayIndex: 4, // Fri 18 Sep
      slotIndex: 2, // 08:00 - 12:00
      time: '10:00 – 14:00',
      duration: '4 hrs',
      dateFormatted: 'Fri, 18 Sep 2026',
      department: 'Conflict',
      deptClass: 'conflict',
      deptBadge: 'Conflict',
      status: 'Conflict',
      sectionLength: '68 km',
      workDescription: 'Track geometry correction and sleeper replacement under emergency advisory.',
      relatedTasks: 4,
      resourcePlan: '2 P-Way gangs, 1 Duo-Tamping Machine',
      aiSuggestion: 'CRITICAL CONFLICT: Overlaps with train movement (T-12810). Reschedule block to 23:00.',
      isConflict: true
    },
    {
      id: 'BLK-010',
      code: 'JH-ASM-012',
      section: 'Asansol – Dhanbad',
      locationDetail: 'Kumardubi - Barakar Border Span',
      dayIndex: 4, // Fri 18 Sep
      slotIndex: 4, // 16:00 - 20:00
      time: '19:00 – 23:00',
      duration: '4 hrs',
      dateFormatted: 'Fri, 18 Sep 2026',
      department: 'S&T',
      deptClass: 'st',
      deptBadge: 'S&T',
      status: 'Planned',
      sectionLength: '58 km',
      workDescription: 'Signal aspect lamp change, optical fiber splicing, ground earth audit.',
      relatedTasks: 2,
      resourcePlan: '1 S&T team, fusion splicer kit',
      aiSuggestion: 'Weather report indicates clear skies; night illumination equipment confirmed.',
      isConflict: false
    },
    {
      id: 'BLK-011',
      code: 'JH-SIM-009',
      section: 'Simdega – Kunti',
      locationDetail: 'Simdega South Forest Track',
      dayIndex: 5, // Sat 19 Sep
      slotIndex: 2, // 08:00 - 12:00
      time: '09:30 – 13:30',
      duration: '4 hrs',
      dateFormatted: 'Sat, 19 Sep 2026',
      department: 'Engineering',
      deptClass: 'engineering',
      deptBadge: 'Engineering',
      status: 'Planned',
      sectionLength: '78 km',
      workDescription: 'De-vegetation and drainage clearing along subgrade cutting.',
      relatedTasks: 1,
      resourcePlan: '1 P-Way maintenance gang, brush cutters',
      aiSuggestion: 'Preventive monsoon maintenance to avert embankment soil creep.',
      isConflict: false
    },
    {
      id: 'BLK-012',
      code: 'JH-DHN-007',
      section: 'Dhanbad – KumerDubi',
      locationDetail: 'Dhanbad East Chord Line',
      dayIndex: 6, // Sun 20 Sep
      slotIndex: 0, // 00:00 - 04:00
      time: '01:30 – 05:30',
      duration: '4 hrs',
      dateFormatted: 'Sun, 20 Sep 2026',
      department: 'Engineering',
      deptClass: 'engineering',
      deptBadge: 'Engineering',
      status: 'Planned',
      sectionLength: '42 km',
      workDescription: 'Ultrasonic rail testing (USFD) and fishplate bolt torque tightening.',
      relatedTasks: 3,
      resourcePlan: '1 USFD team, 1 P-Way squad',
      aiSuggestion: 'Critical section monitoring: inspect joints at km 18-22 with high precision.',
      isConflict: false
    },
    {
      id: 'BLK-013',
      code: 'JH-CHA-013',
      section: 'Chatra – Gaya',
      locationDetail: 'Gaya Junction Border Interlock',
      dayIndex: 6, // Sun 20 Sep
      slotIndex: 4, // 16:00 - 20:00
      time: '18:00 – 22:00',
      duration: '4 hrs',
      dateFormatted: 'Sun, 20 Sep 2026',
      department: 'Engineering',
      deptClass: 'engineering',
      deptBadge: 'Engineering',
      status: 'Planned',
      sectionLength: '64 km',
      workDescription: 'Rail grinding and switch blade re-profiling at turnout 14B.',
      relatedTasks: 2,
      resourcePlan: '1 rail grinding unit, 1 welding crew',
      aiSuggestion: 'Confirm diamond crossing isolation with Gaya division controller before work.',
      isConflict: false
    }
  ];

  // Currently selected active block (defaults to JH-BOK-002 matching reference image)
  let activeBlock = calendarBlocks[0];

  // 1.6 Bottom Analytics: Block Summary Donut Breakdown (This Week)
  const blockSummaryDonutData = {
    totalBlocks: 12,
    categories: [
      { label: 'Engineering', count: 5, percent: 42, color: '#22C55E' },
      { label: 'S&T', count: 4, percent: 33, color: '#3B82F6' },
      { label: 'TRD', count: 3, percent: 25, color: '#F97316' }
    ]
  };

  // 1.7 Bottom Analytics: Conflicts & Alerts
  const conflictsAlertsData = [
    {
      id: 'CNF-01',
      code: 'JH-LDH-008',
      title: 'JH-LDH-008 Latehar – Daltonganj',
      desc: 'Overlaps with train movement (T-12810)',
      date: '18 Sep',
      severity: 'high',
      severityLabel: 'High',
      iconClass: 'fa-solid fa-circle-exclamation'
    },
    {
      id: 'CNF-02',
      code: 'RES-SNT-02',
      title: 'Resource constraint for S&T gang',
      desc: '2 blocks on same day',
      date: '16 Sep',
      severity: 'medium',
      severityLabel: 'Medium',
      iconClass: 'fa-solid fa-triangle-exclamation'
    },
    {
      id: 'CNF-03',
      code: 'JH-HWH-010',
      title: 'Section occupancy > 8 hours',
      desc: 'JH-HWH-010 (Ranchi – Howrah)',
      date: '14 Sep',
      severity: 'medium',
      severityLabel: 'Medium',
      iconClass: 'fa-solid fa-triangle-exclamation'
    }
  ];

  // 1.8 Bottom Analytics: Upcoming Blocks Table
  const upcomingBlocksData = [
    {
      date: '15 Sep',
      code: 'JH-BOK-002',
      section: 'Bokaro – Chandrapura',
      time: '01:30 – 04:30',
      deptBadge: 'Eng',
      deptClass: 'engineering'
    },
    {
      date: '16 Sep',
      code: 'JH-DHN-007',
      section: 'Dhanbad – KumerDubi',
      time: '01:30 – 05:30',
      deptBadge: 'Eng',
      deptClass: 'engineering'
    },
    {
      date: '17 Sep',
      code: 'JH-TAT-006',
      section: 'Tatanagar – Ranchi',
      time: '01:00 – 04:00',
      deptBadge: 'TRD',
      deptClass: 'trd'
    },
    {
      date: '18 Sep',
      code: 'JH-LDH-008',
      section: 'Latehar – Daltonganj',
      time: '10:00 – 14:00',
      deptBadge: '!',
      deptClass: 'conflict'
    },
    {
      date: '19 Sep',
      code: 'JH-SIM-009',
      section: 'Simdega – Kunti',
      time: '09:30 – 13:30',
      deptBadge: 'Eng',
      deptClass: 'engineering'
    }
  ];

  // 1.9 Header Notifications Data
  const notificationsData = [
    { id: 1, type: 'critical', title: 'Block Conflict Alert', desc: 'Overlapping maintenance block on Latehar – Daltonganj (JH-LDH-008)', time: '10 min ago' },
    { id: 2, type: 'warning', title: 'Gang Capacity Warning', desc: 'S&T team double-booked on 16 Sep', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'Schedule Approved', desc: 'Bokaro – Chandrapura block approved by Senior DOM', time: '3 hours ago' }
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
  function renderCalendarSubheader() {
    const card = document.getElementById('calendar-subheader-card');
    if (!card) return;

    if (!calendarSubheaderData || !calendarSubheaderData.title) {
      card.innerHTML = createNotFoundPlaceholder('Calendar Subheader');
      return;
    }

    const viewsMarkup = (calendarSubheaderData.views || []).map(v => {
      const activeClass = v.id === calendarSubheaderData.activeView ? 'active' : '';
      return `<button class="view-tab-btn ${activeClass}" data-view="${v.id}">${v.label}</button>`;
    }).join('');

    card.innerHTML = `
      <div class="calendar-subheader-left">
        <div class="calendar-page-icon">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="calendar-title-group">
          <h2>${calendarSubheaderData.title}</h2>
          <p>${calendarSubheaderData.subtitle}</p>
        </div>
      </div>

      <div class="calendar-subheader-right">
        <!-- Month Navigator -->
        <div class="month-nav-pill">
          <button class="month-nav-btn" id="prev-month-btn" title="Previous Month" aria-label="Previous Month">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span class="month-nav-label" id="current-month-label">${calendarSubheaderData.currentMonth}</span>
          <button class="month-nav-btn" id="next-month-btn" title="Next Month" aria-label="Next Month">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!-- View Switchers (Week, Month, Timeline) -->
        <div class="view-switcher-group" id="view-switcher-group">
          ${viewsMarkup}
        </div>

        <!-- Primary Action: + Create Block -->
        <button class="btn-create-block" id="btn-create-block-action">
          <i class="fa-solid fa-plus"></i> Create Block
        </button>
      </div>
    `;

    // View switcher click listeners
    card.querySelectorAll('.view-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        card.querySelectorAll('.view-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const view = e.currentTarget.getAttribute('data-view');
        calendarSubheaderData.activeView = view;
        renderCalendarView(calendarBlocks);
        showToast(`Switched to ${view.toUpperCase()} view`, 'info');
      });
    });

    // Month navigator click listeners
    const shiftMonth = (offset) => {
      const [monthLabel, yearLabel] = calendarSubheaderData.currentMonth.split(' ');
      const monthIndex = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(monthLabel);
      const base = new Date(Number(yearLabel), monthIndex < 0 ? 8 : monthIndex, 1);
      base.setMonth(base.getMonth() + offset);
      calendarSubheaderData.currentMonth = base.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const lbl = card.querySelector('#current-month-label');
      if (lbl) lbl.textContent = calendarSubheaderData.currentMonth;
      if (calendarSubheaderData.activeView === 'month') renderCalendarView(calendarBlocks);
      showToast(`Viewing ${calendarSubheaderData.currentMonth}`, 'info');
    };

    const prevBtn = card.querySelector('#prev-month-btn');
    const nextBtn = card.querySelector('#next-month-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => shiftMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => shiftMonth(1));

    // Create block action listener
    const createBtn = card.querySelector('#btn-create-block-action');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const modal = document.getElementById('create-block-modal');
        if (modal) modal.style.display = 'flex';
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.2 Render Top 5 KPI Summary Metric Cards (Part B)
  // ----------------------------------------------------------------------------
  function renderCalendarKpis() {
    const container = document.getElementById('calendar-kpi-container');
    if (!container) return;

    if (!Array.isArray(calendarKpisData) || calendarKpisData.length === 0) {
      container.innerHTML = createNotFoundPlaceholder('KPI Metrics');
      return;
    }

    container.innerHTML = calendarKpisData.map(kpi => {
      const trendMarkup = kpi.trendText
        ? `<span class="kpi-trend ${kpi.trendClass}">${kpi.trendText}</span>`
        : '';

      return `
        <div class="calendar-kpi-card dashboard-card" id="${kpi.id}">
          <div class="kpi-icon-box ${kpi.colorTheme}">
            <i class="${kpi.iconClass}"></i>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">${kpi.title}</span>
            <div class="kpi-value-row">
              <span class="kpi-num">${kpi.value}</span>
              ${trendMarkup}
            </div>
            <span class="kpi-subtext">${kpi.subtext}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ----------------------------------------------------------------------------
  // 3.3 Render Filter Toolbar Card (Part C)
  // ----------------------------------------------------------------------------
  function renderFilterToolbar() {
    const toolbar = document.getElementById('calendar-filter-toolbar');
    if (!toolbar) return;

    if (!calendarFiltersData) {
      toolbar.innerHTML = createNotFoundPlaceholder('Filter Toolbar');
      return;
    }

    const sectionsOptions = calendarFiltersData.sections.map(s => `<option value="${s}">${s}</option>`).join('');
    const deptsOptions = calendarFiltersData.departments.map(d => `<option value="${d}">${d}</option>`).join('');
    const typesOptions = calendarFiltersData.blockTypes.map(t => `<option value="${t}">${t}</option>`).join('');
    const statusesOptions = calendarFiltersData.statuses.map(st => `<option value="${st}">${st}</option>`).join('');

    toolbar.innerHTML = `
      <select class="filter-select" id="filter-section-select" aria-label="Filter by Section">
        ${sectionsOptions}
      </select>

      <select class="filter-select" id="filter-dept-select" aria-label="Filter by Department">
        ${deptsOptions}
      </select>

      <select class="filter-select" id="filter-type-select" aria-label="Filter by Block Type">
        ${typesOptions}
      </select>

      <select class="filter-select" id="filter-status-select" aria-label="Filter by Status">
        ${statusesOptions}
      </select>

      <div class="filter-search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" class="filter-search-input" id="filter-search-input" placeholder="Search blocks, location, work description...">
      </div>

      <button class="btn-clear-filters" id="btn-clear-filters" title="Reset all filters">Clear Filters</button>
    `;

    // Filter event listeners
    const sectionSelect = toolbar.querySelector('#filter-section-select');
    const deptSelect = toolbar.querySelector('#filter-dept-select');
    const statusSelect = toolbar.querySelector('#filter-status-select');
    const searchInput = toolbar.querySelector('#filter-search-input');
    const clearBtn = toolbar.querySelector('#btn-clear-filters');

    function applyFilters() {
      const selectedSection = sectionSelect ? sectionSelect.value : 'All Sections';
      const selectedDept = deptSelect ? deptSelect.value : 'All Departments';
      const selectedStatus = statusSelect ? statusSelect.value : 'All Status';
      const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

      const filtered = calendarBlocks.filter(block => {
        const matchSection = (selectedSection === 'All Sections') || block.section.includes(selectedSection);
        const matchDept = (selectedDept === 'All Departments') || (block.department === selectedDept) || (selectedDept === 'Joint / Multiple' && block.department === 'Joint');
        const matchStatus = (selectedStatus === 'All Status') || (block.status === selectedStatus);
        const matchQuery = !searchQuery || 
          block.code.toLowerCase().includes(searchQuery) ||
          block.section.toLowerCase().includes(searchQuery) ||
          block.workDescription.toLowerCase().includes(searchQuery);

        return matchSection && matchDept && matchStatus && matchQuery;
      });

      renderCalendarView(filtered);
    }

    if (sectionSelect) sectionSelect.addEventListener('change', applyFilters);
    if (deptSelect) deptSelect.addEventListener('change', applyFilters);
    if (statusSelect) statusSelect.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (sectionSelect) sectionSelect.value = 'All Sections';
        if (deptSelect) deptSelect.value = 'All Departments';
        if (statusSelect) statusSelect.value = 'All Status';
        if (searchInput) searchInput.value = '';
        renderCalendarView(calendarBlocks);
        showToast('All filters reset', 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.4 Render Interactive Week Calendar Grid (Part D.1)
  // ----------------------------------------------------------------------------
  function renderCalendarGrid(blocksToRender = calendarBlocks) {
    const card = document.getElementById('calendar-grid-card');
    if (!card) return;

    if (!Array.isArray(blocksToRender)) {
      card.innerHTML = createNotFoundPlaceholder('Calendar Grid');
      return;
    }

    // 1. Header with Week Range, Legend Pills, and Today Button
    const headerMarkup = `
      <div class="calendar-grid-header">
        <div class="cal-header-left">
          <button class="week-nav-btn" id="prev-week-btn" aria-label="Previous Week"><i class="fa-solid fa-chevron-left"></i></button>
          <span class="week-date-range">14 – 20 September 2026</span>
          <button class="week-nav-btn" id="next-week-btn" aria-label="Next Week"><i class="fa-solid fa-chevron-right"></i></button>
        </div>

        <div class="cal-legend-group">
          <div class="cal-legend-item"><span class="cal-legend-dot engineering"></span><span>Engineering</span></div>
          <div class="cal-legend-item"><span class="cal-legend-dot st"></span><span>S&amp;T</span></div>
          <div class="cal-legend-item"><span class="cal-legend-dot trd"></span><span>TRD</span></div>
          <div class="cal-legend-item"><span class="cal-legend-dot conflict"></span><span>Conflict</span></div>
          <div class="cal-legend-item"><span class="cal-legend-dot multiple"></span><span>Multiple Depts</span></div>
          <div class="cal-legend-item"><span class="cal-legend-dot other"></span><span>Other</span></div>
        </div>

        <button class="btn-cal-today" id="btn-cal-today">Today</button>
      </div>
    `;

    // 2. Table Column Headers: Time column + 7 Days
    const dayHeaders = calendarDays.map(d => `
      <th>
        <span class="th-day">${d.day}</span>
        <span class="th-date">${d.date}</span>
      </th>
    `).join('');

    // 3. Table Rows: 6 Time Slots (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
    const rowsMarkup = timeSlots.map((slot, sIdx) => {
      const dayCells = calendarDays.map((d, dIdx) => {
        // Find blocks matching this day and time slot
        const cellBlocks = blocksToRender.filter(b => b.dayIndex === dIdx && b.slotIndex === sIdx);

        const blocksHtml = cellBlocks.map(b => {
          const isSelected = (activeBlock && activeBlock.code === b.code) ? 'selected' : '';
          const conflictIcon = b.isConflict ? `<i class="fa-solid fa-circle-exclamation block-conflict-icon" title="Block Schedule Conflict!"></i>` : '';
          
          let badgesHtml = `<span class="block-pill ${b.deptClass}">${b.deptBadge}</span>`;
          if (b.extraDeptBadge) {
            badgesHtml = `
              <span class="block-pill engineering">${b.deptBadge}</span>
              <span class="block-pill st">${b.extraDeptBadge}</span>
            `;
          }

          return `
            <div class="cal-block-item ${b.deptClass} ${isSelected}" data-block-code="${b.code}" title="${b.section} (${b.time})">
              <div class="block-header-row">
                <span class="block-code">${b.code}</span>
                ${conflictIcon}
              </div>
              <span class="block-section">${b.section}</span>
              <span class="block-time">${b.time}</span>
              <div class="block-badges-row">
                ${badgesHtml}
              </div>
            </div>
          `;
        }).join('');

        return `<td>${blocksHtml}</td>`;
      }).join('');

      return `
        <tr>
          <td class="time-col-cell">${slot.label}</td>
          ${dayCells}
        </tr>
      `;
    }).join('');

    card.innerHTML = `
      ${headerMarkup}
      <div class="calendar-grid-wrapper">
        <table class="calendar-table">
          <thead>
            <tr>
              <th style="width:60px; min-width:60px; max-width:60px; background:#F8FAFC;"></th>
              ${dayHeaders}
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      </div>
    `;

    // Click listeners on block cards to update the right side details panel
    card.querySelectorAll('.cal-block-item').forEach(el => {
      el.addEventListener('click', () => {
        const code = el.getAttribute('data-block-code');
        const matched = calendarBlocks.find(b => b.code === code);
        if (matched) {
          activeBlock = matched;
          card.querySelectorAll('.cal-block-item').forEach(b => b.classList.remove('selected'));
          el.classList.add('selected');
          renderBlockDetails(matched);
          showToast(`Loaded details for block: ${matched.code} (${matched.section})`, 'info');
        }
      });
    });

    // Today button click handler
    const todayBtn = card.querySelector('#btn-cal-today');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        showToast('Viewing current live week: 14 – 20 Sep 2026', 'info');
      });
    }

    // Week navigation buttons
    const prevWk = card.querySelector('#prev-week-btn');
    const nextWk = card.querySelector('#next-week-btn');
    if (prevWk) prevWk.addEventListener('click', () => showToast('Viewing previous week: 07 – 13 Sep 2026', 'info'));
    if (nextWk) nextWk.addEventListener('click', () => showToast('Viewing next week: 21 – 27 Sep 2026', 'info'));
  }

  // ----------------------------------------------------------------------------
  // 3.4A View Dispatcher + Month / Timeline Views
  // ----------------------------------------------------------------------------
  function renderCalendarView(blocksToRender = calendarBlocks) {
    const view = calendarSubheaderData.activeView || 'week';
    if (view === 'month') return renderMonthCalendar(blocksToRender);
    if (view === 'timeline') return renderTimelineCalendar(blocksToRender);
    return renderCalendarGrid(blocksToRender);
  }

  function parseBlockDate(block) {
    if (block && block.dateKey) {
      const d = new Date(`${block.dateKey}T00:00:00`);
      if (!Number.isNaN(d.getTime())) return d;
    }
    if (block && block.startTimestamp) {
      const d = new Date(block.startTimestamp);
      if (!Number.isNaN(d.getTime())) return d;
    }
    if (block && block.dateFormatted) {
      const d = new Date(block.dateFormatted);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  }

  function renderMonthCalendar(blocksToRender = calendarBlocks) {
    const card = document.getElementById('calendar-grid-card');
    if (!card) return;

    const [monthLabel, yearLabel] = calendarSubheaderData.currentMonth.split(' ');
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let monthIndex = monthNames.indexOf(monthLabel);
    if (monthIndex < 0) monthIndex = 8;
    const year = Number(yearLabel) || 2026;
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const mondayOffset = (first.getDay() + 6) % 7;
    const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;
    const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    const dated = (blocksToRender || []).map((b, idx) => ({ block: b, date: parseBlockDate(b), idx }));
    const fallbackToSeptember = monthIndex === 8 && year === 2026;

    const cells = Array.from({ length: totalCells }, (_, cellIndex) => {
      const day = cellIndex - mondayOffset + 1;
      if (day < 1 || day > daysInMonth) {
        return '<td style="height:112px;background:#F8FAFC;border:1px solid #E2E8F0;"></td>';
      }

      let dayBlocks = dated.filter(({date}) => date && date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day).map(x => x.block);
      // Original design data uses dayIndex rather than a true date. Keep it visible in the default Sep 2026 prototype month.
      if (dayBlocks.length === 0 && fallbackToSeptember && day >= 14 && day <= 20) {
        dayBlocks = (blocksToRender || []).filter(b => Number(b.dayIndex) === (day - 14));
      }

      const items = dayBlocks.slice(0, 3).map(b => `
        <button type="button" class="month-block-link" data-block-code="${b.code}" style="display:block;width:100%;border:0;border-left:3px solid #2563EB;background:#EFF6FF;color:#1E3A8A;border-radius:4px;padding:4px 6px;margin-top:4px;text-align:left;cursor:pointer;font-size:0.68rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
          <strong>${b.code}</strong> ${b.time || ''}
        </button>
      `).join('');
      const more = dayBlocks.length > 3 ? `<div style="font-size:0.66rem;color:#64748B;margin-top:4px;">+${dayBlocks.length - 3} more</div>` : '';
      return `<td style="vertical-align:top;height:112px;padding:7px;border:1px solid #E2E8F0;background:#FFFFFF;min-width:105px;"><div style="font-weight:800;color:#334155;font-size:0.76rem;">${day}</div>${items}${more}</td>`;
    });

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(`<tr>${cells.slice(i, i + 7).join('')}</tr>`);

    card.innerHTML = `
      <div class="calendar-grid-header">
        <div class="cal-header-left"><span class="week-date-range">${calendarSubheaderData.currentMonth} · Month View</span></div>
        <div style="font-size:0.72rem;color:#64748B;">${(blocksToRender || []).length} block records available</div>
        <button class="btn-cal-today" id="btn-month-today">Today</button>
      </div>
      <div class="calendar-grid-wrapper">
        <table class="calendar-table" style="table-layout:fixed;min-width:820px;">
          <thead><tr>${weekdays.map(d => `<th style="text-align:center;">${d}</th>`).join('')}</tr></thead>
          <tbody>${rows.join('')}</tbody>
        </table>
      </div>
    `;

    card.querySelectorAll('.month-block-link').forEach(el => el.addEventListener('click', () => {
      const matched = calendarBlocks.find(b => b.code === el.getAttribute('data-block-code'));
      if (matched) { activeBlock = matched; renderBlockDetails(matched); showToast(`Loaded details for ${matched.code}`, 'info'); }
    }));
    card.querySelector('#btn-month-today')?.addEventListener('click', () => {
      const now = new Date();
      calendarSubheaderData.currentMonth = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const label = document.getElementById('current-month-label');
      if (label) label.textContent = calendarSubheaderData.currentMonth;
      renderMonthCalendar(blocksToRender);
    });
  }

  function renderTimelineCalendar(blocksToRender = calendarBlocks) {
    const card = document.getElementById('calendar-grid-card');
    if (!card) return;
    const sorted = [...(blocksToRender || [])].sort((a, b) => {
      const ad = parseBlockDate(a)?.getTime() || 0;
      const bd = parseBlockDate(b)?.getTime() || 0;
      return ad - bd || String(a.time || '').localeCompare(String(b.time || ''));
    });

    if (!sorted.length) {
      card.innerHTML = createNotFoundPlaceholder('Timeline');
      return;
    }

    const items = sorted.map((b, idx) => `
      <div class="timeline-block-row" data-block-code="${b.code}" style="display:grid;grid-template-columns:115px 1fr auto;gap:14px;align-items:center;padding:12px 14px;border-bottom:1px solid #E2E8F0;cursor:pointer;${idx % 2 ? 'background:#F8FAFC;' : 'background:#FFFFFF;'}">
        <div><div style="font-size:0.7rem;color:#64748B;font-weight:700;">${b.dateFormatted || 'Scheduled'}</div><div style="font-size:0.72rem;color:#1D4ED8;font-weight:800;margin-top:3px;">${b.time || '—'}</div></div>
        <div style="min-width:0;"><div style="font-size:0.78rem;font-weight:800;color:#0F172A;">${b.code} · ${b.section}</div><div style="font-size:0.7rem;color:#64748B;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.workDescription || ''}</div></div>
        <div style="text-align:right;"><span class="block-pill ${b.deptClass || 'engineering'}">${b.deptBadge || b.department || 'Block'}</span><div style="font-size:0.66rem;color:${b.isConflict ? '#DC2626' : '#64748B'};font-weight:700;margin-top:5px;">${b.status || 'Planned'}</div></div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="calendar-grid-header">
        <div class="cal-header-left"><span class="week-date-range">Operational Block Timeline</span></div>
        <div style="font-size:0.72rem;color:#64748B;">Chronological view · ${sorted.length} blocks</div>
      </div>
      <div style="max-height:560px;overflow:auto;border-top:1px solid #E2E8F0;">${items}</div>
    `;

    card.querySelectorAll('.timeline-block-row').forEach(el => el.addEventListener('click', () => {
      const matched = calendarBlocks.find(b => b.code === el.getAttribute('data-block-code'));
      if (matched) { activeBlock = matched; renderBlockDetails(matched); showToast(`Loaded details for ${matched.code}`, 'info'); }
    }));
  }

  // ----------------------------------------------------------------------------
  // 3.5 Render Active Block Details Panel (Part D.2)
  // ----------------------------------------------------------------------------
  function renderBlockDetails(block = activeBlock) {
    const card = document.getElementById('block-details-card');
    if (!card) return;

    if (!block || !block.code) {
      card.innerHTML = createNotFoundPlaceholder('Block Details');
      return;
    }

    const statusBadgeClass = block.status === 'Conflict' ? 'conflict' : (block.status === 'In Progress' ? 'progress' : 'planned');
    const statusIcon = block.status === 'Conflict' ? 'fa-solid fa-triangle-exclamation' : (block.status === 'In Progress' ? 'fa-solid fa-circle-notch fa-spin' : 'fa-solid fa-circle');

    card.innerHTML = `
      <div class="block-details-header">
        <h3 class="card-title">Block Details</h3>
        <button class="btn-close-details" id="btn-close-details" title="Dismiss details" aria-label="Close details">&times;</button>
      </div>

      <div class="block-details-body">
        <!-- Status Badge -->
        <div class="block-status-wrap">
          <span class="block-status-badge ${statusBadgeClass}">
            <i class="${statusIcon}" style="font-size:0.5rem;"></i> ${block.status}
          </span>
        </div>

        <!-- Main Block Code and Section Name -->
        <div class="block-main-id">
          <h3>${block.code}</h3>
          <p>${block.section}</p>
        </div>

        <!-- Metadata List -->
        <div class="block-meta-list">
          
          <!-- Date Row -->
          <div class="meta-simple-row">
            <i class="fa-regular fa-calendar meta-row-icon"></i>
            <span class="meta-row-val text-normal">${block.dateFormatted || 'Tue, 15 Sep 2026'}</span>
          </div>

          <!-- Time & Duration Row -->
          <div class="meta-simple-row">
            <i class="fa-regular fa-clock meta-row-icon"></i>
            <span class="meta-row-val mono">${block.time} (${block.duration})</span>
          </div>

          <!-- Section / Location & Section Length Dual Column -->
          <div class="meta-dual-row">
            <div class="meta-dual-col">
              <i class="fa-solid fa-location-dot meta-row-icon"></i>
              <div class="meta-dual-text">
                <span class="meta-row-label">Section / Location</span>
                <span class="meta-row-val" style="font-size:0.72rem;">${block.locationDetail}</span>
              </div>
            </div>
            <div class="meta-dual-col">
              <i class="fa-solid fa-road meta-row-icon"></i>
              <div class="meta-dual-text">
                <span class="meta-row-label">Section Length</span>
                <span class="meta-row-val mono" style="font-size:0.72rem;">${block.sectionLength}</span>
              </div>
            </div>
          </div>

          <!-- Department(s) -->
          <div class="meta-keyval-row">
            <div class="meta-key-wrap">
              <i class="fa-solid fa-users-gear meta-row-icon"></i>
              <span class="meta-row-label">Department(s)</span>
            </div>
            <div class="meta-val-wrap">
              <span class="block-pill ${block.deptClass}">${block.department}</span>
            </div>
          </div>

          <!-- Work Description -->
          <div class="meta-keyval-row">
            <div class="meta-key-wrap">
              <i class="fa-solid fa-wrench meta-row-icon"></i>
              <span class="meta-row-label">Work Description</span>
            </div>
            <div class="meta-val-wrap">
              <span class="meta-row-val text-normal">${block.workDescription}</span>
            </div>
          </div>

          <!-- Related Tasks -->
          <div class="meta-keyval-row">
            <div class="meta-key-wrap">
              <i class="fa-solid fa-clipboard-check meta-row-icon"></i>
              <span class="meta-row-label">Related Tasks</span>
            </div>
            <div class="meta-val-wrap">
              <a href="#tasks" class="card-link" id="link-related-tasks">${block.relatedTasks} maintenance tasks &gt;</a>
            </div>
          </div>

          <!-- Resource Plan -->
          <div class="meta-keyval-row">
            <div class="meta-key-wrap">
              <i class="fa-solid fa-helmet-safety meta-row-icon"></i>
              <span class="meta-row-label">Resource Plan</span>
            </div>
            <div class="meta-val-wrap">
              <span class="meta-row-val text-normal">${block.resourcePlan}</span>
            </div>
          </div>

          <!-- Status -->
          <div class="meta-keyval-row">
            <div class="meta-key-wrap">
              <i class="fa-solid fa-circle-info meta-row-icon"></i>
              <span class="meta-row-label">Status</span>
            </div>
            <div class="meta-val-wrap">
              <span class="block-pill ${statusBadgeClass}">${block.status}</span>
            </div>
          </div>

          <!-- AI Suggestion -->
          <div class="meta-keyval-row">
            <div class="meta-key-wrap">
              <i class="fa-solid fa-tag meta-row-icon"></i>
              <span class="meta-row-label">AI Suggestion</span>
            </div>
            <div class="meta-val-wrap">
              <span class="meta-row-val ai-suggestion-text">${block.aiSuggestion}</span>
            </div>
          </div>

        </div>
      </div>
    `;

    // Action listeners
    const closeBtn = card.querySelector('#btn-close-details');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        showToast('Block details closed. Select another block on the grid to inspect.', 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.6 Render Block Summary Donut Card (Part E.1)
  // ----------------------------------------------------------------------------
  function renderBlockSummaryDonut() {
    const card = document.getElementById('block-summary-card');
    if (!card) return;

    if (!blockSummaryDonutData || !Array.isArray(blockSummaryDonutData.categories)) {
      card.innerHTML = createNotFoundPlaceholder('Block Summary Donut');
      return;
    }

    const radius = 38;
    const circumference = 2 * Math.PI * radius; // ~238.76
    let accumulatedPercent = 0;

    const arcsMarkup = blockSummaryDonutData.categories.map(cat => {
      const strokeLength = (cat.percent / 100) * circumference;
      const rotation = (accumulatedPercent / 100) * 360;
      accumulatedPercent += cat.percent;

      return `
        <circle 
          cx="55" cy="55" r="${radius}"
          fill="none" 
          stroke="${cat.color}" 
          stroke-width="12" 
          stroke-dasharray="${strokeLength} ${circumference}"
          transform="rotate(${rotation} 55 55)"
        />
      `;
    }).join('');

    const legendMarkup = blockSummaryDonutData.categories.map(cat => `
      <div class="donut-legend-item">
        <div class="legend-left">
          <span class="legend-color-dot" style="background:${cat.color}"></span>
          <span>${cat.label}</span>
        </div>
        <div class="legend-right">
          ${cat.count} (${cat.percent}%)
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.55rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Block Summary (This Week)</h3>
      </div>

      <div class="donut-content-layout">
        <div class="donut-chart-box">
          <svg class="donut-svg" viewBox="0 0 110 110">
            ${arcsMarkup}
          </svg>
          <div class="donut-center-label">
            <span class="donut-center-num">${blockSummaryDonutData.totalBlocks}</span>
            <span class="donut-center-sub">Blocks</span>
          </div>
        </div>

        <div class="donut-legend-list">
          ${legendMarkup}
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 3.7 Render Conflicts & Alerts Card (Part E.2)
  // ----------------------------------------------------------------------------
  function renderConflictsAndAlerts() {
    const card = document.getElementById('conflicts-alerts-card');
    if (!card) return;

    if (!Array.isArray(conflictsAlertsData) || conflictsAlertsData.length === 0) {
      card.innerHTML = createNotFoundPlaceholder('Conflicts & Alerts');
      return;
    }

    const itemsMarkup = conflictsAlertsData.map(item => `
      <div class="conflict-item" data-conflict-id="${item.id}">
        <div class="conflict-icon-box ${item.severity}">
          <i class="${item.iconClass}"></i>
        </div>
        <div class="conflict-info">
          <h4 class="conflict-title">${item.title}</h4>
          <p class="conflict-desc">${item.desc}</p>
        </div>
        <div class="conflict-meta-right">
          <span class="conflict-date">${item.date}</span>
          <span class="conflict-severity-pill ${item.severity}">${item.severityLabel}</span>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.55rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Conflicts &amp; Alerts</h3>
        <a href="#conflicts" class="card-link" id="link-view-all-conflicts">View All &rarr;</a>
      </div>

      <div class="conflicts-list">
        ${itemsMarkup}
      </div>
    `;

    // Conflict item click listeners
    card.querySelectorAll('.conflict-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-conflict-id');
        const c = conflictsAlertsData.find(item => item.id === id);
        if (c) {
          showToast(`Resolving conflict: ${c.title}`, 'warning');
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 3.8 Render Upcoming Blocks Card (Part E.3)
  // ----------------------------------------------------------------------------
  function renderUpcomingBlocks() {
    const card = document.getElementById('upcoming-blocks-card');
    if (!card) return;

    if (!Array.isArray(upcomingBlocksData) || upcomingBlocksData.length === 0) {
      card.innerHTML = createNotFoundPlaceholder('Upcoming Blocks');
      return;
    }

    const rowsMarkup = upcomingBlocksData.map(row => {
      let badgeHtml = `<span class="block-pill ${row.deptClass}">${row.deptBadge}</span>`;
      return `
        <tr data-block-code="${row.code}" style="cursor:pointer;">
          <td class="up-date">${row.date}</td>
          <td class="up-code">${row.code}</td>
          <td style="font-weight:600; color:#334155;">${row.section}</td>
          <td class="up-time">${row.time}</td>
          <td>${badgeHtml}</td>
        </tr>
      `;
    }).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.55rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Upcoming Blocks</h3>
        <a href="#view-all-upcoming" class="card-link" id="link-view-all-upcoming">View All &rarr;</a>
      </div>

      <div style="overflow-x:auto;">
        <table class="upcoming-table">
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      </div>
    `;

    // Row click listeners to select block
    card.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const code = tr.getAttribute('data-block-code');
        const matched = calendarBlocks.find(b => b.code === code);
        if (matched) {
          activeBlock = matched;
          renderBlockDetails(matched);
          renderCalendarView(calendarBlocks);
          showToast(`Focused on upcoming block: ${matched.code}`, 'info');
        }
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 3.9 Render Sidebar Branding Card & Bottom Footer
  // ----------------------------------------------------------------------------
  function renderSidebarAndFooter() {
    // 1. Sidebar Train Branding Card
    const sidebarTrainCard = document.getElementById('sidebar-train-card');
    if (sidebarTrainCard) {
      sidebarTrainCard.innerHTML = `
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

    // 2. User Profile in Top Header
    const userProfileContainer = document.getElementById('user-profile-container');
    if (userProfileContainer) {
      userProfileContainer.innerHTML = `
        <div class="user-avatar" title="Rajesh - Team ThinkSync">HS</div>
        <div class="user-info">
          <span class="user-name">Rajesh</span>
          <span class="user-role">Team ThinkSync</span>
        </div>
        <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
      `;
    }

    // 3. Bottom Footer
    const footerQuote = document.getElementById('footer-quote-container');
    const footerLinks = document.getElementById('footer-links-container');
    if (footerQuote) {
      footerQuote.textContent = '"Optimizing today for a safer, stronger tomorrow."';
    }
    if (footerLinks) {
      footerLinks.innerHTML = `
        <span>Indian Railways</span>
        <span>Smart Infrastructure</span>
        <span>Connected India</span>
        <span>ThinkSync</span>
      `;
    }
  }

  // ----------------------------------------------------------------------------
  // 3.10 Render System Notifications Bell & Dropdown
  // ----------------------------------------------------------------------------
  function renderNotifications() {
    const badge = document.getElementById('header-notif-badge');
    const dropdownCount = document.getElementById('notif-dropdown-count');
    const listContainer = document.getElementById('notif-list-container');
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');

    if (badge) badge.textContent = notificationsData.length;
    if (dropdownCount) dropdownCount.textContent = `${notificationsData.length} New`;

    if (listContainer) {
      listContainer.innerHTML = notificationsData.map(n => `
        <div class="notif-item ${n.type}">
          <div class="notif-item-header">
            <h4>${n.title}</h4>
            <span class="notif-time">${n.time}</span>
          </div>
          <p class="notif-desc">${n.desc}</p>
        </div>
      `).join('');
    }

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
  }

  // ----------------------------------------------------------------------------
  // 3.11 Setup Create Block Modal & Interactive Toast System
  // ----------------------------------------------------------------------------
  function setupModalAndToasts() {
    const modal = document.getElementById('create-block-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-block-btn');
    const form = document.getElementById('create-block-form');

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const section = document.getElementById('block-section-input')?.value;
        const dept = document.getElementById('block-dept-input')?.value;
        const date = document.getElementById('block-date-input')?.value;
        const duration = document.getElementById('block-duration-input')?.value;
        const startTime = document.getElementById('block-start-time')?.value;
        const endTime = document.getElementById('block-end-time')?.value;
        const desc = document.getElementById('block-desc-input')?.value;

        const newBlock = {
          id: `BLK-${Date.now().toString().slice(-3)}`,
          code: `JH-NEW-0${Math.floor(Math.random() * 90 + 10)}`,
          section: section || 'Bokaro – Chandrapura',
          locationDetail: `${section} Track Zone`,
          dayIndex: 2, // Default Wed
          slotIndex: 1, // 04:00 - 08:00
          time: `${startTime} – ${endTime}`,
          duration: `${duration} hrs`,
          dateFormatted: date,
          department: dept,
          deptClass: dept.toLowerCase(),
          deptBadge: dept,
          status: 'Planned',
          sectionLength: '50 km',
          workDescription: desc,
          relatedTasks: 2,
          resourcePlan: 'Assigned maintenance squad',
          aiSuggestion: 'Telemetry check passed: Slot clear of Rajdhani routing.',
          isConflict: false
        };

        calendarBlocks.push(newBlock);
        activeBlock = newBlock;
        renderCalendarView(calendarBlocks);
        renderBlockDetails(newBlock);
        closeModal();
        form.reset();
        showToast(`Successfully scheduled block ${newBlock.code}!`, 'success');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.12 Setup Sidebar Collapse / Expand Toggle
  // ----------------------------------------------------------------------------
  function setupSidebarToggle() {
    // Sidebar collapse/expand is centrally managed by theme-sync.js
  }

  // ----------------------------------------------------------------------------
  // 3.13 Toast Notification Helper
  // ----------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ============================================================================
  // SECTION 4: INITIALIZATION SEQUENCE
  // ============================================================================
  renderCalendarSubheader();
  renderCalendarKpis();
  renderFilterToolbar();
  renderCalendarView();
  renderBlockDetails();
  renderBlockSummaryDonut();
  renderConflictsAndAlerts();
  renderUpcomingBlocks();
  renderSidebarAndFooter();
  renderNotifications();
  setupModalAndToasts();
  setupSidebarToggle();


  // Live FastAPI bridge for historical/operational block records.
  window.setCalendarBlocks = function(newBlocks) {
    if (!Array.isArray(newBlocks)) return;
    calendarBlocks.splice(0, calendarBlocks.length, ...newBlocks);
    activeBlock = calendarBlocks[0] || null;
    renderCalendarView(calendarBlocks);
    renderBlockDetails(activeBlock);
    showToast(`Loaded ${calendarBlocks.length} block records from MongoDB`, 'info');
  };

})();
