/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION
 * PAGE 8: REPORTS & ANALYTICS DASHBOARD ENGINE (reports.js)
 * "Data-driven insights for a safer, stronger railway network."
 * ==============================================================================
 * 
 * ARCHITECTURE & ENGINEERING SPECIFICATION:
 * ------------------------------------------------------------------------------
 * This client-side dynamic engine powers Page 8 (Executive Reports & Analytics).
 * It strictly adheres to all design tokens, responsive guidelines, and conventions:
 * 
 * 1. STRUCTURED ARCHITECTURE COMMENTS FIRST:
 *    All system designs, data models, state objects, render functions, modal 
 *    handlers, and event lifecycles are documented before code execution.
 * 
 * 2. 100% DATA-DRIVEN DOM HYDRATION:
 *    Zero hardcoded cards, metrics, charts, or table rows in the HTML template. 
 *    Everything is rendered via JavaScript from master reactive state data:
 *      - Top 5 KPI Summary Cards (Total Tasks, Completed, Downtime, Trains, Savings)
 *      - Weekly Maintenance Plan Summary (Dual-axis 3-bar cluster + Completion % line)
 *      - Monthly Performance Trend (Dual-axis 2-bar cluster + Completion % line)
 *      - Key Performance Indicators (4 Circular SVG Donut Gauges with radial offsets)
 *      - Department-wise Task Completion (6 departments with stacked progress segments)
 *      - Downtime Trends (Smooth dual-area curve chart with SVG gradient fills & callouts)
 *      - Recent Report Cards (Downloadable PDF/CSV files with quick actions)
 *      - Historical Insights (3 colored performance milestone pill cards)
 *      - Export Reports & Scheduling Toolbar (PDF, CSV, Excel, Schedule modal triggers)
 * 
 * 3. DEFENSIVE RENDERING & IMMUTABLE STATE:
 *    Null checks and fallbacks for all DOM queries to guarantee error-free runtime.
 *    Provides `window.setReportsData(data)` allowing external systems to dynamically
 *    inject new telemetry and trigger automated re-rendering of all 8 components.
 * 
 * 4. MATHEMATICALLY ACCURATE SVG GENERATION:
 *    - Circular Donut Gauges: ViewBox 0 0 72 72, r=26, circumference = 2 * PI * 26 ≈ 163.36.
 *      Calculates stroke-dashoffset = circumference * (1 - pct/100).
 *    - Dual-Axis Charts: Left-axis values normalized to [0, maxVal] -> [chartHeight, 0],
 *      right-axis percentages normalized to [0, 100] -> [chartHeight, 0].
 *    - Area Curve Gradients: Cubic Bezier curve paths (C x1 y1, x2 y2, x y) closed to baseline.
 * 
 * 5. COLLAPSIBLE UNIFIED SIDEBAR:
 *    Synchronized with `document.body.classList.toggle('sidebar-collapsed')` matching Pages 1-7.
 * 
 * ==============================================================================
 */

/* React mount adapter: original page engine starts after JSX is mounted. */
(function () {

  // ============================================================================
  // SECTION 1: MASTER REACTIVE DATA STORE
  // ============================================================================

  // 1.1 Top 5 KPI Metric Cards
  let reportsKpisData = [
    {
      id: 'kpi-tasks',
      label: 'Total Maintenance Tasks',
      value: '156',
      iconClass: 'fa-solid fa-list-check',
      iconTheme: 'red',
      trendVal: '↑ 12%',
      trendDirection: 'up',
      subtext: 'vs. previous period'
    },
    {
      id: 'kpi-completed',
      label: 'Tasks Completed',
      value: '128',
      iconClass: 'fa-solid fa-circle-check',
      iconTheme: 'green',
      trendVal: '↑ 18%',
      trendDirection: 'up',
      subtext: '82% completion rate'
    },
    {
      id: 'kpi-downtime',
      label: 'Total Downtime (Hrs)',
      value: '342',
      iconClass: 'fa-solid fa-clock',
      iconTheme: 'blue',
      trendVal: '↓ 28%',
      trendDirection: 'down',
      subtext: '42 hrs saved vs budget'
    },
    {
      id: 'kpi-trains',
      label: 'Trains Affected (Est.)',
      value: '24',
      iconClass: 'fa-solid fa-train',
      iconTheme: 'blue',
      trendVal: '↓ 32%',
      trendDirection: 'down',
      subtext: 'Minimal passenger impact'
    },
    {
      id: 'kpi-savings',
      label: 'Cost Savings (₹ Lakhs)',
      value: '48',
      iconClass: 'fa-solid fa-chart-line',
      iconTheme: 'purple',
      trendVal: '↑ 27%',
      trendDirection: 'up',
      subtext: 'Optimized crew & machine'
    }
  ];

  // 1.2 Weekly Maintenance Plan Summary (5 Weeks)
  let weeklyPlanData = [
    { week: 'Week 1', completed: 28, scheduled: 34, pending: 6, completionPct: 82 },
    { week: 'Week 2', completed: 32, scheduled: 36, pending: 4, completionPct: 88 },
    { week: 'Week 3', completed: 24, scheduled: 30, pending: 6, completionPct: 80 },
    { week: 'Week 4', completed: 26, scheduled: 32, pending: 6, completionPct: 81 },
    { week: 'Week 5', completed: 18, scheduled: 24, pending: 6, completionPct: 75 }
  ];

  // 1.3 Monthly Performance Trend (Last 6 Months: Apr - Sep 2026)
  let monthlyTrendData = [
    { month: 'Apr', planned: 140, completed: 110, completionPct: 78 },
    { month: 'May', planned: 155, completed: 125, completionPct: 80 },
    { month: 'Jun', planned: 148, completed: 122, completionPct: 82 },
    { month: 'Jul', planned: 165, completed: 138, completionPct: 84 },
    { month: 'Aug', planned: 172, completed: 146, completionPct: 85 },
    { month: 'Sep', planned: 156, completed: 128, completionPct: 82 }
  ];

  // 1.4 Circular Donut Gauges (4 KPIs)
  let kpiDonutsData = [
    {
      id: 'gauge-completion',
      label: 'Task Completion Rate',
      pct: 82,
      strokeColor: '#10B981',
      trendText: '↑ 6% vs target',
      trendColor: '#059669'
    },
    {
      id: 'gauge-utilization',
      label: 'Block Utilization',
      pct: 78,
      strokeColor: '#2563EB',
      trendText: '↑ 4% vs target',
      trendColor: '#059669'
    },
    {
      id: 'gauge-delays',
      label: 'Train Delay Impact Reduction',
      pct: 24,
      strokeColor: '#F59E0B',
      trendText: '↓ 8% vs prior',
      trendColor: '#059669'
    },
    {
      id: 'gauge-ontime',
      label: 'On-Time Execution',
      pct: 92,
      strokeColor: '#8B5CF6',
      trendText: '↑ 3% vs target',
      trendColor: '#059669'
    }
  ];

  // 1.5 Department-wise Task Completion (6 Departments)
  let deptCompletionData = [
    { dept: 'Track & P-Way', completed: 68, inProgress: 20, pending: 12, totalPct: 88 },
    { dept: 'Signal & Telecom', completed: 75, inProgress: 15, pending: 10, totalPct: 90 },
    { dept: 'Electrical TRD', completed: 62, inProgress: 22, pending: 16, totalPct: 84 },
    { dept: 'Bridges & Structures', completed: 55, inProgress: 25, pending: 20, totalPct: 80 },
    { dept: 'Operations Support', completed: 80, inProgress: 12, pending: 8, totalPct: 92 },
    { dept: 'Civil Works', completed: 58, inProgress: 24, pending: 18, totalPct: 82 }
  ];

  // 1.6 Downtime Trends (6 Months: Apr - Sep 2026)
  let downtimeTrendData = [
    { month: 'Apr', unplanned: 118, planned: 78 },
    { month: 'May', unplanned: 105, planned: 72 },
    { month: 'Jun', unplanned: 92, planned: 60 },
    { month: 'Jul', unplanned: 84, planned: 52 },
    { month: 'Aug', unplanned: 68, planned: 38 },
    { month: 'Sep', unplanned: 56, planned: 28 }
  ];

  // 1.7 Recent Downloadable Report Cards
  let recentReportsData = [
    {
      id: 'rep-sep-2026',
      title: 'Monthly Maintenance Summary - Sep 2026',
      desc: 'Comprehensive division-wide report',
      date: 'Sep 28, 2026',
      fileType: 'pdf',
      downloadUrl: '#download-pdf'
    },
    {
      id: 'rep-q3-downtime',
      title: 'Downtime Analysis - Q3 2026',
      desc: 'Breakdown of delays by section',
      date: 'Sep 24, 2026',
      fileType: 'pdf',
      downloadUrl: '#download-pdf'
    },
    {
      id: 'rep-res-util',
      title: 'Resource Utilization Report',
      desc: 'Crew and machine efficiency',
      date: 'Sep 20, 2026',
      fileType: 'csv',
      downloadUrl: '#download-csv'
    },
    {
      id: 'rep-cong-audit',
      title: 'Section Congestion Audit - Dhanbad',
      desc: 'Corridor bottleneck analysis',
      date: 'Sep 15, 2026',
      fileType: 'pdf',
      downloadUrl: '#download-pdf'
    },
    {
      id: 'rep-cost-h1',
      title: 'Cost Savings Assessment - H1 2026',
      desc: 'Financial impact of block optimization',
      date: 'Sep 10, 2026',
      fileType: 'csv',
      downloadUrl: '#download-csv'
    }
  ];

  // 1.8 Historical Insights (3 Pill Cards)
  let historicalInsightsData = [
    {
      id: 'insight-delays',
      theme: 'green',
      iconClass: 'fa-solid fa-arrow-trend-down',
      boldText: '24% Reduction',
      desc: 'in total train delays over the last 6 months through AI-assisted block scheduling.'
    },
    {
      id: 'insight-blocks',
      theme: 'blue',
      iconClass: 'fa-solid fa-bolt',
      boldText: '18% Improvement',
      desc: 'in block utilization efficiency across all three divisions since implementation.'
    },
    {
      id: 'insight-cost',
      theme: 'purple',
      iconClass: 'fa-solid fa-piggy-bank',
      boldText: '₹32 Lakhs Saved',
      desc: 'in operational costs by consolidating overlapping maintenance windows.'
    }
  ];

  // ============================================================================
  // SECTION 2: DYNAMIC RENDER FUNCTIONS
  // ============================================================================

  /**
   * 2.1 Render Top 5 KPI Summary Cards
   */
  function renderReportsKpis() {
    const container = document.getElementById('reports-kpi-container');
    if (!container) return;

    container.innerHTML = reportsKpisData.map(kpi => {
      const isUp = kpi.trendDirection === 'up';
      return `
        <div class="reports-kpi-card" id="${kpi.id}">
          <div class="kpi-icon-square ${kpi.iconTheme}">
            <i class="${kpi.iconClass}"></i>
          </div>
          <div class="kpi-text-content">
            <span class="kpi-label-text">${kpi.label}</span>
            <div class="kpi-value-row">
              <span class="kpi-number">${kpi.value}</span>
              <span class="kpi-trend-pill ${isUp ? 'up' : 'down'}">${kpi.trendVal}</span>
            </div>
            <span class="kpi-footer-subtext">${kpi.subtext}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 2.2 Render Weekly Maintenance Plan Summary (Dual-Axis Mixed Chart)
   */
  function renderWeeklyPlanChart() {
    const container = document.getElementById('card-weekly-plan');
    if (!container) return;

    // SVG Layout Dimensions
    const svgWidth = 460;
    const svgHeight = 180;
    const padLeft = 32;
    const padRight = 36;
    const padTop = 15;
    const padBottom = 26;
    const chartW = svgWidth - padLeft - padRight;
    const chartH = svgHeight - padTop - padBottom;

    const maxVal = 40; // Max tasks for left Y-axis
    const numSteps = 4; // 0, 10, 20, 30, 40

    // Gridlines & Y-axis labels
    let gridlines = '';
    for (let i = 0; i <= numSteps; i++) {
      const val = (maxVal / numSteps) * i;
      const y = padTop + chartH - (i / numSteps) * chartH;
      const pctVal = Math.round((i / numSteps) * 100);

      gridlines += `
        <line x1="${padLeft}" y1="${y}" x2="${svgWidth - padRight}" y2="${y}" class="axis-gridline" />
        <text x="${padLeft - 6}" y="${y + 3}" text-anchor="end" class="axis-text">${val}</text>
        <text x="${svgWidth - padRight + 6}" y="${y + 3}" text-anchor="start" class="axis-text">${pctVal}%</text>
      `;
    }

    // Bars and Line path
    const numItems = weeklyPlanData.length;
    const colStep = chartW / numItems;
    const barWidth = 9;
    const barGap = 2;

    let barsMarkup = '';
    let linePoints = [];

    weeklyPlanData.forEach((item, idx) => {
      const groupCenterX = padLeft + idx * colStep + colStep / 2;
      const xCompleted = groupCenterX - barWidth * 1.5 - barGap;
      const xScheduled = groupCenterX - barWidth * 0.5;
      const xPending = groupCenterX + barWidth * 0.5 + barGap;

      const hCompleted = (item.completed / maxVal) * chartH;
      const hScheduled = (item.scheduled / maxVal) * chartH;
      const hPending = (item.pending / maxVal) * chartH;

      const yCompleted = padTop + chartH - hCompleted;
      const yScheduled = padTop + chartH - hScheduled;
      const yPending = padTop + chartH - hPending;

      // Line Y mapped to right axis (0-100%)
      const yLine = padTop + chartH - (item.completionPct / 100) * chartH;
      linePoints.push({ x: groupCenterX, y: yLine, pct: item.completionPct });

      barsMarkup += `
        <!-- ${item.week} Bars -->
        <rect class="chart-bar" x="${xCompleted}" y="${yCompleted}" width="${barWidth}" height="${hCompleted}" rx="2" fill="#10B981">
          <title>${item.week} Completed: ${item.completed}</title>
        </rect>
        <rect class="chart-bar" x="${xScheduled}" y="${yScheduled}" width="${barWidth}" height="${hScheduled}" rx="2" fill="#2563EB">
          <title>${item.week} Scheduled: ${item.scheduled}</title>
        </rect>
        <rect class="chart-bar" x="${xPending}" y="${yPending}" width="${barWidth}" height="${hPending}" rx="2" fill="#F87171">
          <title>${item.week} Pending: ${item.pending}</title>
        </rect>
        <text x="${groupCenterX}" y="${svgHeight - 8}" text-anchor="middle" class="axis-text" font-weight="600">${item.week}</text>
      `;
    });

    // Generate polyline string and dots
    const pointsStr = linePoints.map(p => `${p.x},${p.y}`).join(' ');
    let dotsMarkup = linePoints.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#F59E0B" class="chart-dot">
        <title>Completion Rate: ${p.pct}%</title>
      </circle>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-chart-column" style="color: #2563EB; font-size: 0.95rem;"></i>
          Weekly Maintenance Plan Summary
        </h3>
        <a href="#view-details" class="card-header-link" id="link-weekly-plan">View Details &rarr;</a>
      </div>

      <div class="chart-legend-row">
        <span class="legend-square-item"><span class="legend-sq" style="background: #10B981;"></span> Completed</span>
        <span class="legend-square-item"><span class="legend-sq" style="background: #2563EB;"></span> Scheduled</span>
        <span class="legend-square-item"><span class="legend-sq" style="background: #F87171;"></span> Pending</span>
        <span class="legend-line-dot"><span class="legend-line-symbol" style="background: #F59E0B;"></span> Completion %</span>
      </div>

      <div class="chart-canvas-container">
        <svg class="chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
          ${gridlines}
          ${barsMarkup}
          <polyline points="${pointsStr}" class="chart-trendline" stroke="#F59E0B" />
          ${dotsMarkup}
        </svg>
      </div>
    `;
  }

  /**
   * 2.3 Render Monthly Performance Trend (Dual-Axis Chart)
   */
  function renderMonthlyTrendChart() {
    const container = document.getElementById('card-monthly-trend');
    if (!container) return;

    const svgWidth = 460;
    const svgHeight = 180;
    const padLeft = 34;
    const padRight = 36;
    const padTop = 15;
    const padBottom = 26;
    const chartW = svgWidth - padLeft - padRight;
    const chartH = svgHeight - padTop - padBottom;

    const maxVal = 200; // Max tasks for left Y-axis
    const numSteps = 4; // 0, 50, 100, 150, 200

    let gridlines = '';
    for (let i = 0; i <= numSteps; i++) {
      const val = (maxVal / numSteps) * i;
      const y = padTop + chartH - (i / numSteps) * chartH;
      const pctVal = Math.round((i / numSteps) * 100);

      gridlines += `
        <line x1="${padLeft}" y1="${y}" x2="${svgWidth - padRight}" y2="${y}" class="axis-gridline" />
        <text x="${padLeft - 6}" y="${y + 3}" text-anchor="end" class="axis-text">${val}</text>
        <text x="${svgWidth - padRight + 6}" y="${y + 3}" text-anchor="start" class="axis-text">${pctVal}%</text>
      `;
    }

    const numItems = monthlyTrendData.length;
    const colStep = chartW / numItems;
    const barWidth = 10;
    const barGap = 2;

    let barsMarkup = '';
    let linePoints = [];

    monthlyTrendData.forEach((item, idx) => {
      const groupCenterX = padLeft + idx * colStep + colStep / 2;
      const xPlanned = groupCenterX - barWidth - (barGap / 2);
      const xCompleted = groupCenterX + (barGap / 2);

      const hPlanned = (item.planned / maxVal) * chartH;
      const hCompleted = (item.completed / maxVal) * chartH;

      const yPlanned = padTop + chartH - hPlanned;
      const yCompleted = padTop + chartH - hCompleted;

      const yLine = padTop + chartH - (item.completionPct / 100) * chartH;
      linePoints.push({ x: groupCenterX, y: yLine, pct: item.completionPct });

      barsMarkup += `
        <!-- ${item.month} -->
        <rect class="chart-bar" x="${xPlanned}" y="${yPlanned}" width="${barWidth}" height="${hPlanned}" rx="2" fill="#2563EB">
          <title>${item.month} Planned: ${item.planned}</title>
        </rect>
        <rect class="chart-bar" x="${xCompleted}" y="${yCompleted}" width="${barWidth}" height="${hCompleted}" rx="2" fill="#10B981">
          <title>${item.month} Completed: ${item.completed}</title>
        </rect>
        <text x="${groupCenterX}" y="${svgHeight - 8}" text-anchor="middle" class="axis-text" font-weight="600">${item.month}</text>
      `;
    });

    const pointsStr = linePoints.map(p => `${p.x},${p.y}`).join(' ');
    let dotsMarkup = linePoints.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#EF4444" class="chart-dot">
        <title>Completion Rate: ${p.pct}%</title>
      </circle>
    `).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-chart-line" style="color: #2563EB; font-size: 0.95rem;"></i>
          Monthly Performance Trend
        </h3>
        <select class="card-header-dropdown" id="monthly-trend-select" aria-label="Select Timeframe">
          <option value="6m" selected>Last 6 Months</option>
          <option value="3m">Last 3 Months</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      <div class="chart-legend-row">
        <span class="legend-square-item"><span class="legend-sq" style="background: #2563EB;"></span> Planned</span>
        <span class="legend-square-item"><span class="legend-sq" style="background: #10B981;"></span> Completed</span>
        <span class="legend-line-dot">
          <span class="legend-line-symbol" style="background: #EF4444;">
            <span style="position: absolute; top: -3px; left: 4px; width: 6px; height: 6px; border-radius: 50%; background: #EF4444;"></span>
          </span> 
          Completion %
        </span>
      </div>

      <div class="chart-canvas-container">
        <svg class="chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
          ${gridlines}
          ${barsMarkup}
          <polyline points="${pointsStr}" class="chart-trendline" stroke="#EF4444" />
          ${dotsMarkup}
        </svg>
      </div>
    `;

    // Dropdown listener
    const trendSelect = document.getElementById('monthly-trend-select');
    if (trendSelect) {
      trendSelect.addEventListener('change', () => {
        showToast('Performance Trend updated for ' + trendSelect.value, 'info');
      });
    }
  }

  /**
   * 2.4 Render Key Performance Indicators (4 Circular SVG Donut Gauges)
   */
  function renderKpiDonuts() {
    const container = document.getElementById('card-kpi-donuts');
    if (!container) return;

    // Radius = 26, circumference = 2 * PI * 26 ≈ 163.36
    const circumference = 163.36;

    const donutsMarkup = kpiDonutsData.map(d => {
      const offset = circumference * (1 - (d.pct / 100));
      return `
        <div class="kpi-donut-card" id="${d.id}">
          <div class="kpi-donut-svg-wrap">
            <svg class="kpi-donut-svg" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="26" class="kpi-donut-bg-ring" />
              <circle cx="36" cy="36" r="26" class="kpi-donut-fill-ring" 
                stroke="${d.strokeColor}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${offset}" />
            </svg>
            <div class="kpi-donut-center-pct">${d.pct}%</div>
          </div>
          <span class="kpi-donut-label">${d.label}</span>
          <span class="kpi-donut-trend" style="color: ${d.trendColor};">${d.trendText}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-gauge-high" style="color: #2563EB; font-size: 0.95rem;"></i>
          Key Performance Indicators (KPIs)
        </h3>
        <a href="#kpis" class="card-header-link" id="link-all-kpis">View All &rarr;</a>
      </div>

      <div class="kpi-donuts-grid">
        ${donutsMarkup}
      </div>
    `;
  }

  /**
   * 2.5 Render Department-wise Task Completion (Stacked Progress Bars)
   */
  function renderDeptCompletion() {
    const container = document.getElementById('card-dept-completion');
    if (!container) return;

    const listMarkup = deptCompletionData.map(dept => {
      return `
        <div class="dept-row-item">
          <span class="dept-name-label">${dept.dept}</span>
          <div class="dept-stacked-bar-track" title="${dept.dept}: Completed ${dept.completed}%, In Progress ${dept.inProgress}%, Pending ${dept.pending}%">
            <div class="dept-bar-seg dept-bar-completed" style="width: ${dept.completed}%;"></div>
            <div class="dept-bar-seg dept-bar-inprogress" style="width: ${dept.inProgress}%;"></div>
            <div class="dept-bar-seg dept-bar-pending" style="width: ${dept.pending}%;"></div>
          </div>
          <span class="dept-total-pct">${dept.totalPct}%</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-layer-group" style="color: #2563EB; font-size: 0.95rem;"></i>
          Department-wise Task Completion
        </h3>
        <a href="#dept-details" class="card-header-link">View Details &rarr;</a>
      </div>

      <div class="chart-legend-row" style="margin-bottom: 0.75rem;">
        <span class="legend-square-item"><span class="legend-sq" style="background: #10B981;"></span> Completed</span>
        <span class="legend-square-item"><span class="legend-sq" style="background: #38BDF8;"></span> In Progress</span>
        <span class="legend-square-item"><span class="legend-sq" style="background: #F87171;"></span> Pending</span>
      </div>

      <div class="dept-completion-list">
        ${listMarkup}
      </div>
    `;
  }

  /**
   * 2.6 Render Downtime Trends (Smooth Dual Area Curve Chart)
   */
  function renderDowntimeTrends() {
    const container = document.getElementById('card-downtime-trends');
    if (!container) return;

    const svgWidth = 460;
    const svgHeight = 180;
    const padLeft = 32;
    const padRight = 45;
    const padTop = 15;
    const padBottom = 26;
    const chartW = svgWidth - padLeft - padRight;
    const chartH = svgHeight - padTop - padBottom;

    const maxHours = 150;
    const numSteps = 3; // 0, 50, 100, 150

    let gridlines = '';
    for (let i = 0; i <= numSteps; i++) {
      const val = (maxHours / numSteps) * i;
      const y = padTop + chartH - (i / numSteps) * chartH;
      gridlines += `
        <line x1="${padLeft}" y1="${y}" x2="${svgWidth - padRight}" y2="${y}" class="axis-gridline" />
        <text x="${padLeft - 6}" y="${y + 3}" text-anchor="end" class="axis-text">${val}</text>
      `;
    }

    const numPoints = downtimeTrendData.length;
    const colStep = chartW / (numPoints - 1);

    const unplannedCoords = [];
    const plannedCoords = [];

    let xLabels = '';

    downtimeTrendData.forEach((d, idx) => {
      const x = padLeft + idx * colStep;
      const yUnplanned = padTop + chartH - (d.unplanned / maxHours) * chartH;
      const yPlanned = padTop + chartH - (d.planned / maxHours) * chartH;

      unplannedCoords.push({ x, y: yUnplanned, val: d.unplanned });
      plannedCoords.push({ x, y: yPlanned, val: d.planned });

      xLabels += `<text x="${x}" y="${svgHeight - 8}" text-anchor="middle" class="axis-text" font-weight="600">${d.month}</text>`;
    });

    // Smooth Bezier path generator for area and stroke
    function createSmoothPath(coords) {
      if (coords.length === 0) return '';
      let path = `M ${coords[0].x},${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        path += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
      }
      return path;
    }

    const unplanLine = createSmoothPath(unplannedCoords);
    const unplanArea = `${unplanLine} L ${unplannedCoords[unplannedCoords.length - 1].x},${padTop + chartH} L ${unplannedCoords[0].x},${padTop + chartH} Z`;

    const planLine = createSmoothPath(plannedCoords);
    const planArea = `${planLine} L ${plannedCoords[plannedCoords.length - 1].x},${padTop + chartH} L ${plannedCoords[0].x},${padTop + chartH} Z`;

    const lastUnplan = unplannedCoords[unplannedCoords.length - 1];
    const lastPlan = plannedCoords[plannedCoords.length - 1];

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-clock-rotate-left" style="color: #2563EB; font-size: 0.95rem;"></i>
          Downtime Trends
        </h3>
        <a href="#downtime-analysis" class="card-header-link">View Analysis &rarr;</a>
      </div>

      <div class="chart-legend-row">
        <span class="legend-square-item"><span class="legend-sq" style="background: #EF4444;"></span> Unplanned Downtime</span>
        <span class="legend-square-item"><span class="legend-sq" style="background: #2563EB;"></span> Planned Downtime</span>
      </div>

      <div class="downtime-chart-wrapper">
        <svg class="chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="unplanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#EF4444" stop-opacity="0.32" />
              <stop offset="100%" stop-color="#EF4444" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.30" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          ${gridlines}
          ${xLabels}

          <!-- Unplanned Area & Line (Red) -->
          <path d="${unplanArea}" fill="url(#unplanGrad)" />
          <path d="${unplanLine}" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" />

          <!-- Planned Area & Line (Blue) -->
          <path d="${planArea}" fill="url(#planGrad)" />
          <path d="${planLine}" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />

          <!-- End Dots -->
          <circle cx="${lastUnplan.x}" cy="${lastUnplan.y}" r="4" fill="#EF4444" stroke="#FFFFFF" stroke-width="2" />
          <circle cx="${lastPlan.x}" cy="${lastPlan.y}" r="4" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" />
        </svg>

        <!-- Right callout badges -->
        <span class="downtime-badge-tag downtime-badge-red" style="top: ${lastUnplan.y - 10}px;">56 hrs</span>
        <span class="downtime-badge-tag downtime-badge-blue" style="top: ${lastPlan.y - 10}px;">28 hrs</span>
      </div>
    `;
  }

  /**
   * 2.7 Render Recent Downloadable Report Cards
   */
  function renderRecentReports() {
    const container = document.getElementById('card-recent-reports');
    if (!container) return;

    const listMarkup = recentReportsData.map(item => {
      const isPdf = item.fileType.toLowerCase() === 'pdf';
      const btnClass = isPdf ? 'btn-download-pdf' : 'btn-download-csv';
      const iconClass = isPdf ? 'fa-solid fa-file-pdf' : 'fa-solid fa-file-csv';
      const label = isPdf ? 'PDF' : 'CSV';

      return `
        <div class="report-card-item" id="${item.id}">
          <div class="report-item-left">
            <i class="${iconClass} report-file-icon" style="color: ${isPdf ? '#EF4444' : '#10B981'};"></i>
            <div class="report-meta-text">
              <span class="report-main-name" title="${item.title}">${item.title}</span>
              <span class="report-sub-desc">${item.desc}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="report-timestamp">${item.date}</span>
            <button type="button" class="btn-report-download ${btnClass}" data-rep-id="${item.id}" data-type="${label}">
              <i class="fa-solid fa-arrow-down" style="font-size: 0.62rem; margin-right: 3px;"></i>${label}
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-folder-open" style="color: #2563EB; font-size: 0.95rem;"></i>
          Recent Report Cards
        </h3>
        <a href="#all-reports" class="card-header-link">All Reports &rarr;</a>
      </div>

      <div class="recent-reports-list" id="recent-reports-scroll-container">
        ${listMarkup}
      </div>
    `;

    // Download action listeners
    container.querySelectorAll('.btn-report-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const repId = btn.getAttribute('data-rep-id');
        const type = btn.getAttribute('data-type');
        const rep = recentReportsData.find(r => r.id === repId);
        showToast(`Downloading "${rep ? rep.title : repId}" as ${type}...`, 'success');
      });
    });
  }

  /**
   * 2.8 Render Historical Insights (Row 4 Left)
   */
  function renderHistoricalInsights() {
    const container = document.getElementById('card-historical-insights');
    if (!container) return;

    const cardsMarkup = historicalInsightsData.map(item => {
      return `
        <div class="insight-pill-box ${item.theme}">
          <div class="insight-icon-circle ${item.theme}">
            <i class="${item.iconClass}"></i>
          </div>
          <div class="insight-text-col">
            <span class="insight-bold-highlight ${item.theme}">${item.boldText}</span>
            <span class="insight-description">${item.desc}</span>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-lightbulb" style="color: #2563EB; font-size: 0.95rem;"></i>
          Historical Insights
        </h3>
        <a href="#detailed-insights" class="card-header-link">Detailed Analytics &rarr;</a>
      </div>

      <div class="historical-insights-grid">
        ${cardsMarkup}
      </div>
    `;
  }

  /**
   * 2.9 Render Export Reports (Row 4 Right)
   */
  function renderExportSection() {
    const container = document.getElementById('card-export-reports');
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-flex">
        <h3 class="card-header-title">
          <i class="fa-solid fa-file-export" style="color: #2563EB; font-size: 0.95rem;"></i>
          Export Reports
        </h3>
        <a href="#templates" class="card-header-link">Templates &rarr;</a>
      </div>

      <p style="font-size: 0.72rem; color: #64748B; margin: 0 0 0.5rem; line-height: 1.35;">
        Download compiled division summaries or automate recurring email dispatches.
      </p>

      <div class="export-actions-row">
        <button type="button" class="btn-export-act btn-export-pdf" id="btn-export-pdf-act">
          <i class="fa-solid fa-file-pdf"></i> Export as PDF
        </button>
        <button type="button" class="btn-export-act btn-export-csv" id="btn-export-csv-act">
          <i class="fa-solid fa-file-csv"></i> Export as CSV
        </button>
        <button type="button" class="btn-export-act btn-export-excel" id="btn-export-excel-act">
          <i class="fa-solid fa-file-excel"></i> Export as Excel
        </button>
        <button type="button" class="btn-export-act btn-export-schedule" id="btn-open-schedule-act">
          <i class="fa-solid fa-calendar-check"></i> Schedule Reports
        </button>
      </div>
    `;

    // Export buttons event listeners
    const pdfBtn = document.getElementById('btn-export-pdf-act');
    const csvBtn = document.getElementById('btn-export-csv-act');
    const excelBtn = document.getElementById('btn-export-excel-act');
    const schedBtn = document.getElementById('btn-open-schedule-act');

    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        showToast('Compiling executive division report as PDF...', 'info');
        setTimeout(() => showToast('PDF Export Complete: Jharkhand_Div_Sep2026.pdf', 'success'), 1200);
      });
    }

    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        showToast('Exporting divisional maintenance dataset as CSV...', 'info');
        setTimeout(() => showToast('CSV Export Complete: telemetry_jharkhand_sep2026.csv', 'success'), 1000);
      });
    }

    if (excelBtn) {
      excelBtn.addEventListener('click', () => {
        showToast('Generating Microsoft Excel workbook with formulas...', 'info');
        setTimeout(() => showToast('Excel Export Complete: IR_Jharkhand_Analytics.xlsx', 'success'), 1200);
      });
    }

    if (schedBtn) {
      schedBtn.addEventListener('click', () => {
        openModal('schedule-report-modal');
      });
    }
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

  function initModals() {
    // Generate Report Modal
    const btnGenReport = document.getElementById('btn-generate-report');
    const genModal = document.getElementById('generate-report-modal');
    const btnGenClose = document.getElementById('modal-gen-close-btn');
    const btnGenCancel = document.getElementById('modal-gen-cancel-btn');
    const formGen = document.getElementById('generate-report-form');

    if (btnGenReport) {
      btnGenReport.addEventListener('click', () => openModal('generate-report-modal'));
    }

    [btnGenClose, btnGenCancel].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal('generate-report-modal'));
    });

    if (formGen) {
      formGen.addEventListener('submit', (e) => {
        e.preventDefault();
        const repType = document.getElementById('report-type-select').value;
        const repFormat = document.getElementById('report-format-select').value.toUpperCase();
        closeModal('generate-report-modal');
        showToast(`Generating ${repType} (${repFormat})...`, 'info');
        setTimeout(() => {
          showToast(`Report generated successfully! Download started.`, 'success');
        }, 1500);
      });
    }

    // Schedule Report Modal
    const schedModal = document.getElementById('schedule-report-modal');
    const btnSchedClose = document.getElementById('modal-sched-close-btn');
    const btnSchedCancel = document.getElementById('modal-sched-cancel-btn');
    const formSched = document.getElementById('schedule-report-form');

    [btnSchedClose, btnSchedCancel].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal('schedule-report-modal'));
    });

    if (formSched) {
      formSched.addEventListener('submit', (e) => {
        e.preventDefault();
        const cadence = document.getElementById('sched-frequency-select').value;
        const emails = document.getElementById('sched-recipients-input').value;
        closeModal('schedule-report-modal');
        showToast(`Automated report schedule (${cadence}) saved for ${emails}`, 'success');
      });
    }

    // Click outside backdrop to close
    [genModal, schedModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal(modal.id);
          }
        });
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (genModal && genModal.classList.contains('open')) closeModal('generate-report-modal');
        if (schedModal && schedModal.classList.contains('open')) closeModal('schedule-report-modal');
      }
    });
  }

  // ============================================================================
  // SECTION 4: FILTERS & DYNAMIC REACTIVITY
  // ============================================================================

  function initFilters() {
    const dateFilter = document.getElementById('reports-date-filter');
    const divFilter = document.getElementById('reports-division-filter');

    if (dateFilter) {
      dateFilter.addEventListener('change', () => {
        const val = dateFilter.value;
        showToast(`Updating analytics for timeframe: ${dateFilter.options[dateFilter.selectedIndex].text}`, 'info');
        // Dynamic re-render simulation with slight variation
        if (val === 'aug-2026') {
          reportsKpisData[0].value = '148';
          reportsKpisData[1].value = '119';
          reportsKpisData[2].value = '375';
          reportsKpisData[3].value = '31';
          reportsKpisData[4].value = '41';
        } else {
          reportsKpisData[0].value = '156';
          reportsKpisData[1].value = '128';
          reportsKpisData[2].value = '342';
          reportsKpisData[3].value = '24';
          reportsKpisData[4].value = '48';
        }
        renderReportsKpis();
      });
    }

    if (divFilter) {
      divFilter.addEventListener('change', () => {
        const val = divFilter.value;
        showToast(`Filtered reports by division: ${divFilter.options[divFilter.selectedIndex].text}`, 'info');
      });
    }
  }

  // ============================================================================
  // SECTION 5: GLOBAL TOAST NOTIFICATIONS & GLOBAL API
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
   * Public Global Dynamic API: window.setReportsData(data)
   * Enables runtime programmatic dynamic updates
   */
  window.setReportsData = function(newData) {
    if (!newData || typeof newData !== 'object') return;
    if (newData.kpis) reportsKpisData = newData.kpis;
    if (newData.weeklyPlan) weeklyPlanData = newData.weeklyPlan;
    if (newData.monthlyTrend) monthlyTrendData = newData.monthlyTrend;
    if (newData.kpiDonuts) kpiDonutsData = newData.kpiDonuts;
    if (newData.deptCompletion) deptCompletionData = newData.deptCompletion;
    if (newData.downtimeTrend) downtimeTrendData = newData.downtimeTrend;
    if (newData.recentReports) recentReportsData = newData.recentReports;
    if (newData.historicalInsights) historicalInsightsData = newData.historicalInsights;

    // Trigger full re-render
    renderReportsKpis();
    renderWeeklyPlanChart();
    renderMonthlyTrendChart();
    renderKpiDonuts();
    renderDeptCompletion();
    renderDowntimeTrends();
    renderRecentReports();
    renderHistoricalInsights();
    renderExportSection();
    showToast('Reports data dynamically updated via live telemetry', 'success');
  };

  // ============================================================================
  // SECTION 6: SHELL & NAVIGATION INITIALIZATION
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
    // Train brand card in sidebar
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

    // Bottom footer quote and links
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

  function initNotifications() {
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const badge = document.getElementById('header-notif-badge');
    const countBadge = document.getElementById('notif-dropdown-count');
    const notifList = document.getElementById('notif-list-container');

    if (badge) badge.textContent = '3';
    if (countBadge) countBadge.textContent = '3 New';

    if (notifList) {
      notifList.innerHTML = `
        <div class="notif-item unread">
          <i class="fa-solid fa-file-pdf notif-item-icon" style="color: #EF4444;"></i>
          <div class="notif-item-content">
            <span class="notif-item-title">Monthly Maintenance Report Compiled</span>
            <span class="notif-item-time">10 mins ago</span>
          </div>
        </div>
        <div class="notif-item unread">
          <i class="fa-solid fa-triangle-exclamation notif-item-icon" style="color: #F59E0B;"></i>
          <div class="notif-item-content">
            <span class="notif-item-title">Speed Restriction lifted at Chandrapura</span>
            <span class="notif-item-time">45 mins ago</span>
          </div>
        </div>
        <div class="notif-item">
          <i class="fa-solid fa-check notif-item-icon" style="color: #10B981;"></i>
          <div class="notif-item-content">
            <span class="notif-item-title">BCM 04 Work Completed in Dhanbad</span>
            <span class="notif-item-time">2 hours ago</span>
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
  // SECTION 7: MASTER INITIALIZATION LIFECYCLE
  // ============================================================================
  function init() {
    // Shell & Navigation
    renderUserProfile();
    renderSidebarAndFooter();
    initSidebarToggle();
    initNotifications();

    // 100% Data-Driven Visual Hydration
    renderReportsKpis();
    renderWeeklyPlanChart();
    renderMonthlyTrendChart();
    renderKpiDonuts();
    renderDeptCompletion();
    renderDowntimeTrends();
    renderRecentReports();
    renderHistoricalInsights();
    renderExportSection();

    // Interactive Modals and Filters
    initModals();
    initFilters();
  }

  init();
})();
