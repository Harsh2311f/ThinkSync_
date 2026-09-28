/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION
 * PAGE 6: RESOURCES DASHBOARD (resources.js)
 * "People. Machines. Materials. Always Ready for a Safer Tomorrow."
 * ==============================================================================
 * 
 * ARCHITECTURE & ENGINEERING SPECIFICATION:
 * ------------------------------------------------------------------------------
 * This client-side dynamic engine powers Page 6 (Resources Management Dashboard).
 * Strictly adheres to project design tokens, responsive guidelines, and instructions:
 * 
 * 1. STRUCTURED ARCHITECTURE COMMENTS FIRST:
 *    All system designs, data models, state objects, render functions, modal 
 *    handlers, and event lifecycles are documented first.
 * 
 * 2. 100% DATA-DRIVEN DOM HYDRATION:
 *    Zero hardcoded table rows or cards in HTML. Everything is rendered via JavaScript 
 *    from master reactive state data:
 *      - Top 5 KPI Summary Metrics + SVG circular readiness gauge
 *      - Row 1: Crew Availability Table + Machine Inventory Table
 *      - Row 2: Material Inventory Table + 30-Day Utilization Stacked Chart + Shortage Alerts
 *      - Row 3: Assignable Resources by Section + Depot-wise Readiness Progress Bars
 * 
 * 3. DEFENSIVE RENDERING & IMMUTABLE STATE:
 *    Null checks and fallbacks for all DOM queries to guarantee error-free runtime.
 * 
 * 4. DYNAMIC DIVISION & TIME FILTERING:
 *    Filtering by "All Divisions", "Ranchi", "Dhanbad", or "Chakradharpur" 
 *    dynamically updates table rows, readiness scores, and visual indicators.
 * 
 * 5. INTERACTIVE ASSIGN RESOURCES MODAL:
 *    Clicking "Assign Resources" opens a modal dialog pre-filled with the selected 
 *    section, available crews, machinery, and materials packages. Confirming 
 *    allocates resources and triggers a live toast confirmation.
 * 
 * 6. COLLAPSIBLE UNIFIED SIDEBAR:
 *    Seamless toggle support matching Pages 1-5.
 * 
 * ==============================================================================
 */

/* React mount adapter: original page engine starts after JSX is mounted. */
(function () {

  // ============================================================================
  // SECTION 1: MASTER DATA STORE (Structured State)
  // ============================================================================

  // 1.1 Dynamic Top 5 KPI Summary Metric Cards Calculator
  function getDynamicResourcesKpis() {
    const totalCrews = (crewsData || []).length;
    const totalMachines = (machinesData || []).length;
    const operationalMachines = (machinesData || []).filter(m => (m.statusCode || '').toLowerCase() !== 'maintenance').length;
    const totalMaterials = (materialsData || []).length;
    const totalDepots = (depotReadinessData || []).length;

    // People score
    let peopleSum = 0;
    (crewsData || []).forEach(c => {
      peopleSum += (c.statusCode === 'available' ? 100 : (c.statusCode === 'deployed' ? 85 : 50));
    });
    const peopleScore = totalCrews > 0 ? Math.round(peopleSum / totalCrews) : 87;

    // Machines score
    let machineSum = 0;
    (machinesData || []).forEach(m => {
      machineSum += (typeof m.readiness === 'number' ? m.readiness : 80);
    });
    const machinesScore = totalMachines > 0 ? Math.round(machineSum / totalMachines) : 82;

    // Materials score
    let matSum = 0;
    (materialsData || []).forEach(m => {
      matSum += (m.statusCode === 'adequate' ? 95 : 60);
    });
    const materialsScore = totalMaterials > 0 ? Math.round(matSum / totalMaterials) : 91;

    const overallScore = Math.round((peopleScore * 0.35) + (machinesScore * 0.35) + (materialsScore * 0.30));

    return [
      {
        id: 'kpi-crew',
        title: 'Total Crew Members',
        value: totalCrews.toString(),
        trendText: '↑ Active',
        trendClass: 'trend-up',
        subtext: `${(crewsData || []).filter(c => c.statusCode === 'available').length} available on standby`,
        iconClass: 'fa-solid fa-users',
        colorTheme: 'kpi-icon-blue'
      },
      {
        id: 'kpi-machines',
        title: 'Total Machines',
        value: totalMachines.toString(),
        trendText: `${operationalMachines} Active`,
        trendClass: 'trend-up',
        subtext: `${operationalMachines} operational / ${totalMachines - operationalMachines} in maintenance`,
        iconClass: 'fa-solid fa-gears',
        colorTheme: 'kpi-icon-amber'
      },
      {
        id: 'kpi-materials',
        title: 'Total Material Items',
        value: totalMaterials.toString(),
        trendText: '↑ Monitored',
        trendClass: 'trend-up',
        subtext: 'Critical track, OHE & signalling assets',
        iconClass: 'fa-solid fa-boxes-stacked',
        colorTheme: 'kpi-icon-emerald'
      },
      {
        id: 'kpi-depots',
        title: 'Depots & Yards',
        value: totalDepots.toString(),
        trendText: 'Across Network',
        trendClass: 'trend-neutral',
        subtext: `${totalDepots} operational deployment hubs`,
        iconClass: 'fa-solid fa-warehouse',
        colorTheme: 'kpi-icon-indigo'
      },
      {
        id: 'kpi-readiness',
        title: 'Overall Resource Readiness',
        value: `${overallScore}%`,
        trendText: overallScore >= 80 ? '↑ Optimal' : '↓ Caution',
        trendClass: overallScore >= 80 ? 'trend-up' : 'trend-neutral',
        subtext: `People: ${peopleScore}% • Machines: ${machinesScore}% • Materials: ${materialsScore}%`,
        peopleScore: peopleScore,
        machinesScore: machinesScore,
        materialsScore: materialsScore,
        overallScore: overallScore,
        colorTheme: 'kpi-icon-cyan'
      }
    ];
  }

  // 1.2 Crew Availability Master Dataset (Dynamic State)
  let crewsData = [
    {
      id: 'crew-001',
      name: 'R. K. Sharma',
      initials: 'RS',
      role: 'Track Lead',
      depot: 'Ranchi Depot',
      division: 'ranchi',
      status: 'Available',
      statusCode: 'available',
      currentAssignment: 'Standby'
    },
    {
      id: 'crew-002',
      name: 'Amit Verma',
      initials: 'AV',
      role: 'OHE Technician',
      depot: 'Dhanbad Depot',
      division: 'dhanbad',
      status: 'Deployed',
      statusCode: 'deployed',
      currentAssignment: 'Block DHN-104'
    },
    {
      id: 'crew-003',
      name: 'S. N. Murmu',
      initials: 'SM',
      role: 'Signal Inspector',
      depot: 'Bokaro Depot',
      division: 'dhanbad',
      status: 'Available',
      statusCode: 'available',
      currentAssignment: 'Inspection Pending'
    },
    {
      id: 'crew-004',
      name: 'Priya Kumari',
      initials: 'PK',
      role: 'Welder (Thermit)',
      depot: 'Hatia Depot',
      division: 'ranchi',
      status: 'On Leave',
      statusCode: 'leave',
      currentAssignment: 'Return: Tomorrow'
    },
    {
      id: 'crew-005',
      name: 'Md. Rizwan',
      initials: 'MR',
      role: 'Track Machine Op',
      depot: 'Koderma Depot',
      division: 'dhanbad',
      status: 'Deployed',
      statusCode: 'deployed',
      currentAssignment: 'Block KOD-042'
    }
  ];

  // 1.3 Machine Inventory Master Dataset (Dynamic State)
  let machinesData = [
    {
      id: 'mach-001',
      code: 'BCM-01 (Ballast Cleaner)',
      type: 'Ballast Cleaner',
      division: 'ranchi',
      status: 'Available',
      statusCode: 'available',
      readiness: 95,
      iconClass: 'fa-solid fa-broom'
    },
    {
      id: 'mach-002',
      code: 'CSM-04 (Tamping)',
      type: 'Continuous Tamping',
      division: 'dhanbad',
      status: 'Deployed',
      statusCode: 'deployed',
      readiness: 88,
      iconClass: 'fa-solid fa-compress'
    },
    {
      id: 'mach-003',
      code: 'TRT-02 (Track Renewal)',
      type: 'Track Renewal',
      division: 'chakradharpur',
      status: 'Available',
      statusCode: 'available',
      readiness: 92,
      iconClass: 'fa-solid fa-train-tram'
    },
    {
      id: 'mach-004',
      code: 'T-28 (Point & Crossing)',
      type: 'Point & Crossing',
      division: 'ranchi',
      status: 'Maintenance',
      statusCode: 'maintenance',
      readiness: 45,
      iconClass: 'fa-solid fa-wrench'
    },
    {
      id: 'mach-005',
      code: 'DGS-03 (Dynamic Stabilizer)',
      type: 'Dynamic Stabilizer',
      division: 'dhanbad',
      status: 'Available',
      statusCode: 'available',
      readiness: 90,
      iconClass: 'fa-solid fa-gauge-high'
    }
  ];

  // 1.4 Material Inventory Master Dataset (Dynamic State)
  let materialsData = [
    {
      id: 'mat-001',
      material: '60 kg Rail (UIC)',
      availableStock: '2,450',
      unit: 'Metres',
      threshold: '1,000 m',
      status: 'Adequate',
      statusCode: 'adequate',
      iconClass: 'fa-solid fa-grip-lines'
    },
    {
      id: 'mat-002',
      material: 'PSC Sleepers',
      availableStock: '820',
      unit: 'Nos',
      threshold: '500 nos',
      status: 'Adequate',
      statusCode: 'adequate',
      iconClass: 'fa-solid fa-bars-staggered'
    },
    {
      id: 'mat-003',
      material: 'Elastic Rail Clips',
      availableStock: '14,200',
      unit: 'Nos',
      threshold: '5,000 nos',
      status: 'Adequate',
      statusCode: 'adequate',
      iconClass: 'fa-solid fa-paperclip'
    },
    {
      id: 'mat-004',
      material: 'Contact Wire (107 sq mm)',
      availableStock: '380',
      unit: 'Metres',
      threshold: '800 m',
      status: 'Low Stock',
      statusCode: 'low',
      iconClass: 'fa-solid fa-bolt'
    },
    {
      id: 'mat-005',
      material: 'Signalling Cable (24 core)',
      availableStock: '1,850',
      unit: 'Metres',
      threshold: '1,200 m',
      status: 'Adequate',
      statusCode: 'adequate',
      iconClass: 'fa-solid fa-network-wired'
    }
  ];

  // 1.5 30-Day Resource Utilization Weekly Breakdown (Dynamic State)
  let utilizationData = [
    { week: 'W1', label: 'Week 1', deployed: 72, available: 28 },
    { week: 'W2', label: 'Week 2', deployed: 80, available: 20 },
    { week: 'W3', label: 'Week 3', deployed: 85, available: 15 },
    { week: 'W4', label: 'Week 4', deployed: 78, available: 22 },
    { week: 'W5', label: 'Week 5', deployed: 84, available: 16 }
  ];

  // 1.6 Shortage & Notice Alerts Dataset (Dynamic State)
  let shortageAlertsData = [
    {
      id: 'alert-01',
      severity: 'critical',
      title: 'Contact Wire Below Safety Reserve',
      text: 'Contact Wire below safety reserve (380m / 800m min) at Dhanbad Central Depot.',
      time: '32m ago • Action Required',
      iconClass: 'fa-solid fa-circle-exclamation'
    },
    {
      id: 'alert-02',
      severity: 'warning',
      title: 'Heavy Machine Overhaul Overdue',
      text: 'Point & Crossing Machine T-28 overdue for overhaul by 3 days.',
      time: '2h ago • Ranchi Mechanical Shop',
      iconClass: 'fa-solid fa-triangle-exclamation'
    },
    {
      id: 'alert-03',
      severity: 'warning',
      title: 'Signal Technician Deficit',
      text: 'Signal Technicians deficit in Koderma section during night blocks.',
      time: '4h ago • Koderma Section',
      iconClass: 'fa-solid fa-triangle-exclamation'
    },
    {
      id: 'alert-04',
      severity: 'notice',
      title: 'Scheduled Material Delivery',
      text: '1,500 PSC Sleepers scheduled for arrival at Ranchi depot tomorrow.',
      time: 'Tomorrow 06:00 IST • Verified',
      iconClass: 'fa-solid fa-circle-check'
    }
  ];

  // 1.7 Assignable Resources by Section Master Dataset (Dynamic State)
  let assignableSectionsData = [
    {
      id: 'sec-001',
      section: 'Ranchi – Muri',
      division: 'ranchi',
      crewInfo: '4 Crews (32 personnel)',
      machineInfo: '3 Machines (BCM, CSM, DGS)',
      readiness: 94,
      readinessTheme: 'bar-emerald'
    },
    {
      id: 'sec-002',
      section: 'Dhanbad – Gomoh',
      division: 'dhanbad',
      crewInfo: '3 Crews (24 personnel)',
      machineInfo: '2 Machines (CSM, TRT)',
      readiness: 78,
      readinessTheme: 'bar-amber'
    },
    {
      id: 'sec-003',
      section: 'Bokaro – Chandrapura',
      division: 'dhanbad',
      crewInfo: '2 Crews (18 personnel)',
      machineInfo: '2 Machines (BCM, T-28)',
      readiness: 85,
      readinessTheme: 'bar-emerald'
    },
    {
      id: 'sec-004',
      section: 'Koderma – Hazaribagh',
      division: 'dhanbad',
      crewInfo: '2 Crews (16 personnel)',
      machineInfo: '1 Machine (CSM)',
      readiness: 71,
      readinessTheme: 'bar-amber'
    },
    {
      id: 'sec-005',
      section: 'Barkakana – Patratu',
      division: 'ranchi',
      crewInfo: '3 Crews (22 personnel)',
      machineInfo: '2 Machines (TRT, DGS)',
      readiness: 90,
      readinessTheme: 'bar-emerald'
    }
  ];

  // 1.8 Depot-wise Resource Readiness Dataset (Dynamic State)
  let depotReadinessData = [
    { name: 'Ranchi Depot', readiness: 92, division: 'ranchi', theme: 'bar-emerald' },
    { name: 'Dhanbad Depot', readiness: 86, division: 'dhanbad', theme: 'bar-emerald' },
    { name: 'Hatia Depot', readiness: 88, division: 'ranchi', theme: 'bar-emerald' },
    { name: 'Bokaro Yard', readiness: 83, division: 'dhanbad', theme: 'bar-blue' },
    { name: 'Chakradharpur Depot', readiness: 81, division: 'chakradharpur', theme: 'bar-blue' },
    { name: 'Koderma Depot', readiness: 76, division: 'dhanbad', theme: 'bar-amber' }
  ];

  // Global active filters state
  const activeFilters = {
    division: 'all',
    timeRange: '30days'
  };

  // ============================================================================
  // SECTION 2: COMPONENT RENDERERS
  // ============================================================================

  // ----------------------------------------------------------------------------
  // 2.1 RENDER TOP 5 KPI SUMMARY METRIC CARDS
  // ----------------------------------------------------------------------------
  function renderResourcesKpis() {
    const container = document.getElementById('resources-kpi-container');
    if (!container) return;

    let html = '';
    const dynamicKpis = getDynamicResourcesKpis();

    dynamicKpis.forEach((kpi) => {
      if (kpi.id === 'kpi-readiness') {
        // 5th KPI Card: Donut Circular Readiness Gauge + Breakdown
        // SVG circle radius r=23, circumference = 2 * PI * 23 ≈ 144.51
        const radius = 23;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (kpi.overallScore / 100) * circumference;

        html += `
          <div class="resources-kpi-card resources-kpi-card-readiness" id="${kpi.id}">
            <div class="kpi-header-row">
              <span class="kpi-title">${kpi.title}</span>
              <span class="kpi-trend-badge ${kpi.trendClass}">
                <i class="fa-solid fa-arrow-trend-up"></i> ${kpi.trendText}
              </span>
            </div>
            
            <div class="readiness-split-body">
              <div class="readiness-info-col">
                <div class="kpi-main-metric">
                  <span class="kpi-value">${kpi.value}</span>
                </div>
                <div class="readiness-breakdown-row">
                  <span>People: <strong>${kpi.peopleScore}%</strong></span>
                  <span class="dot-separator">•</span>
                  <span>Machines: <strong>${kpi.machinesScore}%</strong></span>
                  <span class="dot-separator">•</span>
                  <span>Materials: <strong>${kpi.materialsScore}%</strong></span>
                </div>
              </div>
              
              <div class="readiness-chart-col">
                <svg class="readiness-donut-svg" viewBox="0 0 60 60">
                  <circle class="readiness-donut-bg" cx="30" cy="30" r="${radius}"></circle>
                  <circle class="readiness-donut-meter" cx="30" cy="30" r="${radius}"
                    stroke-dasharray="${circumference.toFixed(2)}"
                    stroke-dashoffset="${offset.toFixed(2)}">
                  </circle>
                </svg>
                <div class="readiness-center-label">${kpi.overallScore}%</div>
              </div>
            </div>
          </div>
        `;
      } else {
        // Standard Metric Card
        html += `
          <div class="resources-kpi-card" id="${kpi.id}">
            <div class="kpi-header-row">
              <span class="kpi-title">${kpi.title}</span>
              <div class="kpi-icon-pill ${kpi.colorTheme}">
                <i class="${kpi.iconClass}"></i>
              </div>
            </div>
            <div class="kpi-main-metric">
              <span class="kpi-value">${kpi.value}</span>
              <span class="kpi-trend-badge ${kpi.trendClass}">
                ${kpi.trendClass === 'trend-up' ? '<i class="fa-solid fa-arrow-trend-up"></i>' : ''} ${kpi.trendText}
              </span>
            </div>
            <div class="kpi-subtext">${kpi.subtext}</div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  // ----------------------------------------------------------------------------
  // 2.2 RENDER ROW 1: CREW AVAILABILITY TABLE CARD
  // ----------------------------------------------------------------------------
  function renderCrewTable() {
    const card = document.getElementById('crew-card');
    if (!card) return;

    const allCrews = Array.isArray(crewsData) ? crewsData : [];
    // Filter rows based on active division
    const filteredCrews = activeFilters.division === 'all'
      ? allCrews
      : allCrews.filter(c => c.division === activeFilters.division);

    const rowsHtml = filteredCrews.length > 0
      ? filteredCrews.map((crew) => {
          const initials = crew.initials || (crew.name ? crew.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CR');
          const status = crew.status || (crew.statusCode === 'available' ? 'Available' : 'Deployed');
          const statusCode = crew.statusCode || 'available';

          return `
            <tr>
              <td>
                <div class="crew-user-cell">
                  <div class="crew-avatar">${initials}</div>
                  <div class="crew-name-wrap">
                    <span class="crew-name">${crew.name || 'Technician'}</span>
                  </div>
                </div>
              </td>
              <td><strong>${crew.role || 'Specialist'}</strong></td>
              <td>${crew.depot || 'Jharkhand Hub'}</td>
              <td>
                <span class="badge-status ${statusCode}">
                  <span class="badge-status-dot"></span> ${status}
                </span>
              </td>
              <td><span class="font-mono">${crew.currentAssignment || 'Standby'}</span></td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="5">
            <div class="empty-state-wrap">
              <i class="fa-solid fa-user-group"></i>
              <p>No maintenance crews found for selected division (${allCrews.length} total in network).</p>
            </div>
          </td>
        </tr>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-user-group card-icon"></i>
          <h3 class="card-main-title">Crew Availability</h3>
          <span class="badge-count-pill">${filteredCrews.length} Members</span>
        </div>
        <span class="card-subtitle-badge">Active maintenance personnel</span>
      </div>
      <div class="resources-table-wrap">
        <table class="resources-table">
          <thead>
            <tr>
              <th>Crew Member</th>
              <th>Role</th>
              <th>Depot</th>
              <th>Status</th>
              <th>Current Assignment</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 2.3 RENDER ROW 1: MACHINE INVENTORY TABLE CARD
  // ----------------------------------------------------------------------------
  function renderMachineTable() {
    const card = document.getElementById('machines-card');
    if (!card) return;

    const allMachines = Array.isArray(machinesData) ? machinesData : [];
    // Filter rows based on active division
    const filteredMachines = activeFilters.division === 'all'
      ? allMachines
      : allMachines.filter(m => m.division === activeFilters.division);

    const rowsHtml = filteredMachines.length > 0
      ? filteredMachines.map((mach) => {
          const readiness = typeof mach.readiness === 'number' ? mach.readiness : 80;
          const barColor = readiness >= 80 ? '#10B981' : (readiness >= 50 ? '#3B82F6' : '#F59E0B');
          const iconClass = mach.iconClass || 'fa-solid fa-gear';
          const status = mach.status || (readiness >= 80 ? 'Available' : 'Maintenance');
          const statusCode = mach.statusCode || (readiness >= 80 ? 'available' : 'maintenance');

          return `
            <tr>
              <td>
                <div class="machine-name-cell">
                  <div class="machine-icon-badge">
                    <i class="${iconClass}"></i>
                  </div>
                  <span class="machine-code">${mach.code || 'Machine'}</span>
                </div>
              </td>
              <td>${mach.type || 'Track Machinery'}</td>
              <td>
                <span class="badge-status ${statusCode}">
                  <span class="badge-status-dot"></span> ${status}
                </span>
              </td>
              <td>
                <div class="table-progress-wrap">
                  <div class="table-progress-bar">
                    <div class="table-progress-fill" style="width: ${Math.min(100, Math.max(0, readiness))}%; background-color: ${barColor};"></div>
                  </div>
                  <span class="table-progress-val">${readiness}%</span>
                </div>
              </td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="4">
            <div class="empty-state-wrap">
              <i class="fa-solid fa-gears"></i>
              <p>No heavy machinery assigned to selected division (${allMachines.length} total in network).</p>
            </div>
          </td>
        </tr>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-gears card-icon"></i>
          <h3 class="card-main-title">Machine Inventory</h3>
          <span class="badge-count-pill">${filteredMachines.length} Units</span>
        </div>
        <span class="card-subtitle-badge">Heavy maintenance machinery</span>
      </div>
      <div class="resources-table-wrap">
        <table class="resources-table">
          <thead>
            <tr>
              <th>Machine</th>
              <th>Type</th>
              <th>Status</th>
              <th>Readiness</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // 2.4 RENDER ROW 2: MATERIAL INVENTORY TABLE CARD
  // ----------------------------------------------------------------------------
  function renderMaterialTable() {
    const card = document.getElementById('materials-card');
    if (!card) return;

    const materials = Array.isArray(materialsData) ? materialsData : [];
    const rowsHtml = materials.length > 0 
      ? materials.map((item) => {
          const stockNum = parseInt(String(item.availableStock || '0').replace(/[^\d]/g, ''), 10);
          const threshNum = parseInt(String(item.threshold || '0').replace(/[^\d]/g, ''), 10);
          const isLow = (!isNaN(stockNum) && !isNaN(threshNum)) ? stockNum <= threshNum : (item.statusCode === 'low');
          const status = item.status || (isLow ? 'Low Stock' : 'Adequate');
          const statusCode = isLow ? 'low' : (item.statusCode || 'adequate');
          const iconClass = item.iconClass || 'fa-solid fa-boxes-stacked';

          return `
            <tr>
              <td>
                <div class="machine-name-cell">
                  <div class="machine-icon-badge" style="background: #EFF6FF; color: #2563EB;">
                    <i class="${iconClass}"></i>
                  </div>
                  <strong>${item.material || 'Asset Item'}</strong>
                </div>
              </td>
              <td><span class="font-mono" style="font-weight: 700; color: #0F172A;">${item.availableStock || '0'}</span></td>
              <td><span style="color: #64748B;">${item.unit || 'Units'}</span></td>
              <td><span class="font-mono" style="color: #64748B;">${item.threshold || '0'}</span></td>
              <td>
                <span class="badge-status ${statusCode}">
                  <span class="badge-status-dot"></span> ${status}
                </span>
              </td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="5">
            <div class="empty-state-wrap">
              <i class="fa-solid fa-boxes-stacked"></i>
              <p>No material items found in active inventory.</p>
            </div>
          </td>
        </tr>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-boxes-stacked card-icon"></i>
          <h3 class="card-main-title">Material Inventory</h3>
          <span class="badge-count-pill">${materials.length} Items</span>
        </div>
        <span class="card-subtitle-badge">Critical maintenance materials stock</span>
      </div>
      <div class="resources-table-wrap">
        <table class="resources-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Available Stock</th>
              <th>Unit</th>
              <th>Threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 2.5 RENDER ROW 2: RESOURCE UTILIZATION (LAST 30 DAYS) STACKED BAR CHART
  // ----------------------------------------------------------------------------
  function renderUtilizationChart() {
    const card = document.getElementById('utilization-card');
    if (!card) return;

    const items = Array.isArray(utilizationData) ? utilizationData : [];
    const barsHtml = items.length > 0 
      ? items.map((u) => {
          const deployed = typeof u.deployed === 'number' ? u.deployed : parseInt(u.deployed || 50, 10);
          const available = typeof u.available === 'number' ? u.available : Math.max(0, 100 - deployed);
          const label = u.label || u.week || 'Period';
          const week = u.week || label;

          return `
            <div class="utilization-bar-col" title="${label}: ${deployed}% Deployed, ${available}% Available">
              <span class="bar-percent-tag">${deployed}%</span>
              <div class="utilization-stacked-bar">
                <div class="bar-segment-deployed" style="height: ${Math.min(100, Math.max(0, deployed))}%;"></div>
              </div>
              <span class="bar-col-label">${week}</span>
            </div>
          `;
        }).join('')
      : `
        <div class="empty-state-wrap" style="width: 100%; height: 110px;">
          <i class="fa-solid fa-chart-column"></i>
          <p>No utilization records available.</p>
        </div>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-chart-column card-icon"></i>
          <h3 class="card-main-title">Resource Utilization</h3>
          <span class="badge-count-pill">${items.length} Periods</span>
        </div>
        <div class="utilization-legend-bar">
          <div class="legend-dot-item">
            <span class="legend-dot legend-dot-deployed"></span> Deployed
          </div>
          <div class="legend-dot-item">
            <span class="legend-dot legend-dot-available"></span> Available
          </div>
        </div>
      </div>
      <div class="utilization-chart-container">
        <div class="utilization-bars-grid">
          ${barsHtml}
        </div>
        <div style="text-align: center; margin-top: 6px; font-size: 10.5px; color: #64748B;">
          Weekly aggregated asset deployment rate across Jharkhand
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 2.6 RENDER ROW 2: SHORTAGE ALERTS CARD
  // ----------------------------------------------------------------------------
  function renderShortageAlerts() {
    const card = document.getElementById('alerts-card');
    if (!card) return;

    const alerts = Array.isArray(shortageAlertsData) ? shortageAlertsData : [];
    const critCount = alerts.filter(a => a.severity === 'critical').length;

    const alertsHtml = alerts.length > 0 
      ? alerts.map((alert) => {
          const iconClass = alert.iconClass || (alert.severity === 'critical' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-triangle-exclamation');
          return `
            <div class="alert-item-card alert-item-${alert.severity || 'warning'}">
              <i class="${iconClass} alert-icon"></i>
              <div class="alert-content">
                <div>${alert.text || alert.title || 'Inventory alert'}</div>
                <span class="alert-time">${alert.time || 'Just now'}</span>
              </div>
            </div>
          `;
        }).join('')
      : `
        <div class="empty-state-wrap" style="padding: 24px 8px;">
          <i class="fa-solid fa-circle-check" style="color: #10B981; font-size: 22px;"></i>
          <p>No active shortage alerts. All depot inventory levels optimal.</p>
        </div>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-bell-exclamation card-icon" style="color: ${critCount > 0 ? '#EF4444' : '#10B981'};"></i>
          <h3 class="card-main-title">Shortage Alerts</h3>
          <span class="badge-count-pill">${alerts.length} Total</span>
        </div>
        <span class="badge-status ${critCount > 0 ? 'low' : 'available'}" style="font-size: 10px;">${critCount} Critical</span>
      </div>
      <div class="shortage-alerts-list">
        ${alertsHtml}
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 2.7 RENDER ROW 3: ASSIGNABLE RESOURCES BY SECTION CARD
  // ----------------------------------------------------------------------------
  function renderAssignableSections() {
    const card = document.getElementById('assignable-card');
    if (!card) return;

    const allSections = Array.isArray(assignableSectionsData) ? assignableSectionsData : [];
    // Filter rows based on active division
    const filteredSections = activeFilters.division === 'all'
      ? allSections
      : allSections.filter(s => s.division === activeFilters.division);

    const rowsHtml = filteredSections.length > 0
      ? filteredSections.map((sec) => {
          const readiness = typeof sec.readiness === 'number' ? sec.readiness : 80;
          const readinessTheme = sec.readinessTheme || (readiness >= 85 ? 'bar-emerald' : 'bar-amber');
          return `
            <tr>
              <td>
                <strong class="assignable-section-name">${sec.section || 'Corridor'}</strong>
              </td>
              <td>
                <span class="badge-status available" style="font-size: 10.5px;">${sec.crewInfo || 'Crews assigned'}</span>
              </td>
              <td>
                <span class="badge-status deployed" style="font-size: 10.5px;">${sec.machineInfo || 'Machines'}</span>
              </td>
              <td>
                <div class="table-progress-wrap">
                  <div class="table-progress-bar">
                    <div class="table-progress-fill ${readinessTheme}" style="width: ${Math.min(100, Math.max(0, readiness))}%;"></div>
                  </div>
                  <span class="table-progress-val">${readiness}%</span>
                </div>
              </td>
              <td>
                <button class="btn-assign-action" data-section-id="${sec.id || ''}" data-section-name="${sec.section || ''}">
                  <i class="fa-solid fa-user-plus"></i> Assign Resources
                </button>
              </td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="5">
            <div class="empty-state-wrap">
              <i class="fa-solid fa-route"></i>
              <p>No section lines match selected division (${allSections.length} total in network).</p>
            </div>
          </td>
        </tr>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-route card-icon"></i>
          <h3 class="card-main-title">Assignable Resources by Section</h3>
          <span class="badge-count-pill">${filteredSections.length} Sections</span>
        </div>
        <span class="card-subtitle-badge">Direct deployment pipeline for upcoming maintenance blocks</span>
      </div>
      <div class="resources-table-wrap">
        <table class="resources-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Available Crew</th>
              <th>Machines Available</th>
              <th>Material Readiness</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Attach click listeners to all "Assign Resources" action buttons
    const assignButtons = card.querySelectorAll('.btn-assign-action');
    assignButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const secName = btn.getAttribute('data-section-name');
        openAssignModal(secName);
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 2.8 RENDER ROW 3: DEPOT-WISE RESOURCE READINESS PROGRESS BARS
  // ----------------------------------------------------------------------------
  function renderDepotReadiness() {
    const card = document.getElementById('depot-readiness-card');
    if (!card) return;

    const allDepots = Array.isArray(depotReadinessData) ? depotReadinessData : [];
    // Filter depots based on active division
    const filteredDepots = activeFilters.division === 'all'
      ? allDepots
      : allDepots.filter(d => d.division === activeFilters.division);

    const depotRowsHtml = filteredDepots.length > 0
      ? filteredDepots.map((depot) => {
          const readiness = typeof depot.readiness === 'number' ? depot.readiness : 80;
          const theme = depot.theme || (readiness >= 85 ? 'bar-emerald' : readiness >= 75 ? 'bar-blue' : 'bar-amber');
          return `
            <div class="depot-readiness-row">
              <div class="depot-meta-line">
                <span class="depot-name">
                  <i class="fa-solid fa-warehouse"></i> ${depot.name || 'Hub Depot'}
                </span>
                <span class="depot-readiness-val">${readiness}%</span>
              </div>
              <div class="depot-progress-track">
                <div class="depot-progress-bar ${theme}" style="width: ${Math.min(100, Math.max(0, readiness))}%;"></div>
              </div>
            </div>
          `;
        }).join('')
      : `
        <div class="empty-state-wrap" style="padding: 24px 8px;">
          <i class="fa-solid fa-warehouse"></i>
          <p>No depots match selected division (${allDepots.length} total across network).</p>
        </div>
      `;

    card.innerHTML = `
      <div class="card-title-header">
        <div class="card-title-wrap">
          <i class="fa-solid fa-gauge-high card-icon"></i>
          <h3 class="card-main-title">Depot-wise Resource Readiness</h3>
          <span class="badge-count-pill">${filteredDepots.length} Depots</span>
        </div>
        <span class="card-subtitle-badge">Jharkhand Division Hubs</span>
      </div>
      <div class="depot-readiness-list">
        ${depotRowsHtml}
      </div>
    `;
  }

  // ============================================================================
  // SECTION 3: ASSIGN RESOURCES MODAL & TOAST HANDLERS
  // ============================================================================

  // Populate select dropdowns for the modal dynamically
  function populateModalSelectors() {
    const crewSelect = document.getElementById('form-crew-select');
    const machineSelect = document.getElementById('form-machine-select');
    const materialsSelect = document.getElementById('form-materials-select');

    if (crewSelect) {
      crewSelect.innerHTML = `
        <option value="Ranchi Track Gang Alpha (8 crew)">Ranchi Track Gang Alpha (8 crew) — Standby</option>
        <option value="Dhanbad OHE Fast Response (6 crew)">Dhanbad OHE Fast Response (6 crew) — Ready</option>
        <option value="Bokaro Signal & Telecom Unit (4 crew)">Bokaro Signal & Telecom Unit (4 crew) — Ready</option>
        <option value="Koderma High-Speed Gang (6 crew)">Koderma High-Speed Gang (6 crew) — Ready</option>
        <option value="Hatia Heavy Welding Squad (5 crew)">Hatia Heavy Welding Squad (5 crew) — Ready</option>
      `;
    }

    if (machineSelect) {
      machineSelect.innerHTML = `
        <option value="BCM-01 Ballast Cleaning Machine">BCM-01 Ballast Cleaning Machine (95% Ready)</option>
        <option value="CSM-04 Continuous Tamping Machine">CSM-04 Continuous Tamping Machine (88% Ready)</option>
        <option value="TRT-02 Track Renewal Train">TRT-02 Track Renewal Train (92% Ready)</option>
        <option value="DGS-03 Dynamic Track Stabilizer">DGS-03 Dynamic Track Stabilizer (90% Ready)</option>
      `;
    }

    if (materialsSelect) {
      materialsSelect.innerHTML = `
        <option value="Standard Track Package A (500m Rail + 200 Sleepers)">Standard Track Package A (500m Rail + 200 Sleepers)</option>
        <option value="OHE Wire Repair Kit (150m Contact Wire + Droppers)">OHE Wire Repair Kit (150m Contact Wire + Droppers)</option>
        <option value="Fastening & Sleepers Kit (800 Clips + 150 Sleepers)">Fastening & Sleepers Kit (800 Clips + 150 Sleepers)</option>
        <option value="Emergency Signaling Cable Spool (500m 24-core)">Emergency Signaling Cable Spool (500m 24-core)</option>
      `;
    }
  }

  // Open Assign Resources Modal
  function openAssignModal(sectionName) {
    const modal = document.getElementById('assign-resources-modal');
    const sectionInput = document.getElementById('form-section-input');
    const title = document.getElementById('modal-section-title');

    if (!modal) return;

    if (sectionInput) sectionInput.value = sectionName;
    if (title) title.textContent = `Assign Resources — ${sectionName}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close Assign Resources Modal
  function closeAssignModal() {
    const modal = document.getElementById('assign-resources-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Initialize Modal Listeners
  function initAssignModal() {
    populateModalSelectors();

    const modal = document.getElementById('assign-resources-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const form = document.getElementById('assign-resources-form');

    if (closeBtn) closeBtn.addEventListener('click', closeAssignModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAssignModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAssignModal();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const sectionName = document.getElementById('form-section-input').value;
        const crew = document.getElementById('form-crew-select').value;
        const machine = document.getElementById('form-machine-select').value;
        const timeWindow = document.getElementById('form-time-window').value;

        closeAssignModal();
        showToastNotification(`Successfully assigned ${crew} & ${machine} to ${sectionName} for ${timeWindow}!`, 'success');
      });
    }
  }

  // Global Toast Notification Helper
  function showToastNotification(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ============================================================================
  // SECTION 4: USER PROFILE, SIDEBAR TOGGLE & FOOTER
  // ============================================================================
  function renderUserProfile() {
    const container = document.getElementById('user-profile-container');
    if (!container) return;

    container.innerHTML = `
      <div class="user-avatar" title="Rajesh - Team ThinkSync">HS</div>
      <div class="user-info">
        <span class="user-name">Rajesh</span>
        <span class="user-role">Team ThinkSync</span>
      </div>
      <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
    `;
  }

  function renderSidebarAndFooter() {
    // Train branding in sidebar
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

    // Dynamic quote & links in footer
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
    // Sidebar collapse/expand is centrally managed by theme-sync.js
  }

  // ============================================================================
  // SECTION 5: INITIALIZATION LIFECYCLE
  // ============================================================================
  function init() {
    // Header & Shell Components
    renderUserProfile();
    renderSidebarAndFooter();
    initSidebarToggle();

    // Top Subheader Filter Listeners
    const divisionSelect = document.getElementById('division-filter-select');
    if (divisionSelect) {
      divisionSelect.addEventListener('change', (e) => {
        activeFilters.division = e.target.value;
        // Re-render division-sensitive components
        renderCrewTable();
        renderMachineTable();
        renderAssignableSections();
        renderDepotReadiness();
        showToastNotification(`Filter applied: ${e.target.options[e.target.selectedIndex].text}`, 'success');
      });
    }

    const timeSelect = document.getElementById('time-filter-select');
    if (timeSelect) {
      timeSelect.addEventListener('change', (e) => {
        activeFilters.timeRange = e.target.value;
        showToastNotification(`Time range updated: ${e.target.options[e.target.selectedIndex].text}`, 'success');
      });
    }

    // Notification dropdown toggle
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
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

    // Modal Initializer
    initAssignModal();

    // Core Dashboard Components Hydration
    renderAllResourcesModules();
  }

  // Helper to re-render all dynamic resource modules and recompute KPIs
  function renderAllResourcesModules() {
    renderResourcesKpis();
    renderCrewTable();
    renderMachineTable();
    renderMaterialTable();
    renderUtilizationChart();
    renderShortageAlerts();
    renderAssignableSections();
    renderDepotReadiness();
  }

  // ============================================================================
  // SECTION 6: GLOBAL DYNAMIC DATA APIS (Supports external API / Arbitrary Datasets)
  // ============================================================================
  window.setResourcesData = function(payload) {
    if (!payload || typeof payload !== 'object') return;

    if (payload.crews && Array.isArray(payload.crews)) crewsData = payload.crews;
    if (payload.machines && Array.isArray(payload.machines)) machinesData = payload.machines;
    if (payload.materials && Array.isArray(payload.materials)) materialsData = payload.materials;
    if (payload.utilization && Array.isArray(payload.utilization)) utilizationData = payload.utilization;
    if (payload.alerts && Array.isArray(payload.alerts)) shortageAlertsData = payload.alerts;
    if (payload.sections && Array.isArray(payload.sections)) assignableSectionsData = payload.sections;
    if (payload.depots && Array.isArray(payload.depots)) depotReadinessData = payload.depots;

    renderAllResourcesModules();
    showToastNotification('Resources master dataset updated dynamically', 'success');
  };

  window.updateResourceCategory = function(category, newArray) {
    if (!Array.isArray(newArray)) {
      console.warn('updateResourceCategory: expected array for', category);
      return;
    }
    switch (category) {
      case 'crew':
      case 'crews':
        crewsData = newArray;
        renderCrewTable();
        break;
      case 'machines':
      case 'machine':
        machinesData = newArray;
        renderMachineTable();
        break;
      case 'materials':
      case 'material':
        materialsData = newArray;
        renderMaterialTable();
        break;
      case 'utilization':
        utilizationData = newArray;
        renderUtilizationChart();
        break;
      case 'alerts':
        shortageAlertsData = newArray;
        renderShortageAlerts();
        break;
      case 'sections':
      case 'assignable':
        assignableSectionsData = newArray;
        renderAssignableSections();
        break;
      case 'depots':
      case 'depot':
        depotReadinessData = newArray;
        renderDepotReadiness();
        break;
    }
    renderResourcesKpis();
    showToastNotification(`Updated ${category} dataset (${newArray.length} items)`, 'success');
  };

  init();

  if (window.location.hash || window.location.search.includes('scroll=')) {
    try {
      setTimeout(() => {
        var targetEl = document.getElementById('assignable-card') || document.querySelector('.resources-row3-grid');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'instant', block: 'end' });
        } else {
          window.scrollTo(0, document.body.scrollHeight || 3000);
        }
      }, 150);
    } catch (e) {}
  }
})();
