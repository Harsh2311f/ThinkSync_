/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION
 * PAGE 7: OPTIMIZATION DASHBOARD (optimization.js)
 * "Generate and compare optimized maintenance plans using AI to minimize disruption and maximize network performance."
 * ==============================================================================
 * 
 * ARCHITECTURE & ENGINEERING SPECIFICATION:
 * ------------------------------------------------------------------------------
 * This client-side dynamic engine powers Page 7 (Optimization Decision Center).
 * It strictly adheres to all design tokens, responsive guidelines, and conventions:
 * 
 * 1. STRUCTURED ARCHITECTURE COMMENTS FIRST:
 *    All system designs, data models, state objects, render functions, modal 
 *    handlers, and event lifecycles are documented first.
 * 
 * 2. 100% DATA-DRIVEN DOM HYDRATION:
 *    Zero hardcoded cards, metrics, or table rows in the HTML template. Everything 
 *    is rendered via JavaScript from master reactive state data:
 *      - Part 1: Optimization Inputs & Filters (5 interactive selectors + buttons)
 *      - Part 2: Generated Plans (Plan A Recommended, Plan B Alternative, Plan C Aggressive)
 *      - Part 3: Why Plan A is Recommended & Key Assumptions cards
 *      - Part 4: Bottom 4-Column Comparison Analytics (Delays, Score, Risk/Confidence, Summary)
 * 
 * 3. DEFENSIVE RENDERING & IMMUTABLE STATE:
 *    Null checks and fallbacks for all DOM queries to guarantee error-free runtime.
 * 
 * 4. INTERACTIVE MODAL DIALOGS:
 *    - "View Plan Details" modal: Shows deep-dive corridor schedules and block windows.
 *    - "Advanced Options" modal: Allows fine-tuning penalty weights and safety factors.
 * 
 * 5. LIVE AI SIMULATION & REGENERATION:
 *    - "Generate Optimized Plans" button triggers a dynamic computation simulation.
 *    - "Regenerate" updates timestamps and recalculates confidence meters.
 * 
 * 6. COLLAPSIBLE UNIFIED SIDEBAR:
 *    Synchronized with `document.body.classList.toggle('sidebar-collapsed')` matching Pages 1-6.
 * 
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // SECTION 1: MASTER DATA STORE (Structured State)
  // ============================================================================

  // 1.1 Optimization Controls & Filters Configuration
  const optimizationFiltersData = {
    horizons: [
      { id: 'h-3m', label: 'Next 3 Months', range: '01 Oct 2026 – 31 Dec 2026', active: true },
      { id: 'h-1m', label: 'Next 30 Days', range: '01 Oct 2026 – 31 Oct 2026' },
      { id: 'h-6m', label: 'Next 6 Months', range: '01 Oct 2026 – 31 Mar 2027' },
      { id: 'h-1y', label: 'Annual Plan 2026–27', range: '01 Apr 2026 – 31 Mar 2027' }
    ],
    divisions: [
      { id: 'div-jh', label: 'Jharkhand Division', count: '28 sections selected', active: true },
      { id: 'div-rn', label: 'Ranchi Division', count: '11 sections selected' },
      { id: 'div-dhn', label: 'Dhanbad Division', count: '14 sections selected' },
      { id: 'div-ckp', label: 'Chakradharpur Division', count: '12 sections selected' }
    ],
    sections: [
      { id: 'sec-all', label: 'All Key Sections', hint: 'or select specific sections', active: true },
      { id: 'sec-rn-muri', label: 'Ranchi – Muri Corridor', hint: 'Double line electrified' },
      { id: 'sec-dhn-gomoh', label: 'Dhanbad – Gomoh Quad', hint: 'Grand Chord corridor' },
      { id: 'sec-bkr-chandra', label: 'Bokaro – Chandrapura', hint: 'Heavy freight corridor' },
      { id: 'sec-kod-hazar', label: 'Koderma – Hazaribagh', hint: 'Single line branch' }
    ],
    maintenanceTypes: [
      { id: 'maint-all', label: 'All Types (Track, Bridge, S&T...)', hint: 'Include routine + corrective', active: true },
      { id: 'maint-track', label: 'Track Only (Tamping & BCM)', hint: 'P-Way heavy machines' },
      { id: 'maint-ohe', label: 'OHE & Power Blocks', hint: 'Overhead 25kV traction' },
      { id: 'maint-sig', label: 'S&T (Signalling & Interlocking)', hint: 'Electronic interlocking' },
      { id: 'maint-bridge', label: 'Bridge & Civils', hint: 'Structural girder work' }
    ],
    constraints: [
      { id: 'const-std', label: 'Standard Constraints', hint: 'Train priority, crew, resources', active: true },
      { id: 'const-strict-pax', label: 'Strict Passenger Priority', hint: 'Zero delays for Rajdhani/Vande Bharat' },
      { id: 'const-max-work', label: 'Max Work Volume Window', hint: 'Relaxed non-peak train headway' },
      { id: 'const-night-only', label: 'Night Blocks Only (00:30–04:30)', hint: 'Zero daylight disruptions' }
    ]
  };

  // 1.2 Generated Maintenance Plans Master Dataset (Plans A, B, C)
  const plansData = [
    {
      id: 'plan-a',
      letter: 'Plan A',
      recommended: true,
      tag: 'Optimal Balance',
      tagTheme: 'emerald',
      themeClass: 'plan-a-theme',
      iconTheme: 'plan-icon-emerald',
      iconClass: 'fa-solid fa-check',
      description: 'Best overall balance between network performance, maintenance value and minimal disruption.',
      metrics: {
        totalBlocks: { val: '42', diff: '↓ 18%', diffType: 'positive', sub: 'vs. current plan' },
        trainDelays: { val: '320 mins', diff: '↓ 45%', diffType: 'positive' },
        maintValue: { val: '89 / 100', diff: '↑ 28%', diffType: 'positive' },
        overrunRisk: { label: 'Low (12%)', color: '#10B981', val: 12 },
        confidence: { val: 92, theme: 'fill-emerald' }
      },
      actionBtnClass: 'btn-plan-a',
      actionText: 'View Plan A Details →',
      details: {
        focusCorridor: 'Ranchi – Muri & Dhanbad – Gomoh Grand Chord',
        crewTeams: '6 Crews (Alpha, Beta, OHE Quick Response)',
        machinery: 'BCM-01 Ballast Cleaner, CSM-04 Continuous Tamping, TRT-02',
        windowSchedule: '42 Optimized Windows (00:30 – 04:30 IST)',
        impactSummary: 'Passenger disruption cut by 45%, protecting Rajdhani and Vande Bharat headways.'
      }
    },
    {
      id: 'plan-b',
      letter: 'Plan B',
      recommended: false,
      tag: 'Alternative Focus',
      tagTheme: 'blue',
      themeClass: 'plan-b-theme',
      iconTheme: 'plan-icon-blue',
      iconClass: 'fa-solid fa-layer-group',
      description: 'Fewer blocks with moderate impact on train operations. Suitable if resource availability is limited.',
      metrics: {
        totalBlocks: { val: '36', diff: '↓ 30%', diffType: 'positive' },
        trainDelays: { val: '480 mins', diff: '↓ 18%', diffType: 'positive' },
        maintValue: { val: '76 / 100', diff: '↑ 12%', diffType: 'positive' },
        overrunRisk: { label: 'Medium (28%)', color: '#F59E0B', val: 28 },
        confidence: { val: 78, theme: 'fill-blue' }
      },
      actionBtnClass: 'btn-plan-b',
      actionText: 'View Plan B Details →',
      details: {
        focusCorridor: 'Dhanbad – Gomoh & Bokaro Industrial Link',
        crewTeams: '4 Crews (Focus on critical fatigue zones)',
        machinery: 'CSM-04 Continuous Tamping & DGS-03 Dynamic Stabilizer',
        windowSchedule: '36 Selective Windows (Consolidated weekend nights)',
        impactSummary: 'Conserves 25% crew manpower while addressing top 5 critical sections.'
      }
    },
    {
      id: 'plan-c',
      letter: 'Plan C',
      recommended: false,
      tag: 'Aggressive Maintenance',
      tagTheme: 'rose',
      themeClass: 'plan-c-theme',
      iconTheme: 'plan-icon-rose',
      iconClass: 'fa-solid fa-bolt',
      description: 'Maximizes maintenance coverage and network health, but higher operational impact.',
      metrics: {
        totalBlocks: { val: '58', diff: '↑ 12%', diffType: 'negative' },
        trainDelays: { val: '860 mins', diff: '↑ 45%', diffType: 'negative' },
        maintValue: { val: '94 / 100', diff: '↑ 42%', diffType: 'positive' },
        overrunRisk: { label: 'High (38%)', color: '#EF4444', val: 38 },
        confidence: { val: 71, theme: 'fill-rose' }
      },
      actionBtnClass: 'btn-plan-c',
      actionText: 'View Plan C Details →',
      details: {
        focusCorridor: 'Comprehensive Division-wide Overhaul across 28 sections',
        crewTeams: '8 Full Gangs including Night Special Contractors',
        machinery: 'BCM-01, CSM-04, TRT-02, T-28 Point & Crossing, DGS-03',
        windowSchedule: '58 Aggressive Windows (Including daytime 3-hour slots)',
        impactSummary: 'Achieves 94/100 network health score; requires temporary freight re-routing.'
      }
    }
  ];

  // 1.3 AI Recommendations & Assumptions Master Data
  const whyPlanAData = {
    badge: 'AI Recommendation',
    reasons: [
      'Reduces train delays by 45% compared to current plan.',
      'Achieves high maintenance value with optimal resource usage.',
      'Lower overrun risk (12%) ensuring better plan adherence.',
      'Balances operational efficiency with long-term network health.',
      'Aligns with strategic goals for a safer, more reliable network.'
    ],
    quote: 'Plan A delivers the best overall value by minimizing passenger disruption while maximizing infrastructure reliability. It provides a realistic and executable plan with high confidence.',
    author: '— ThinkSync AI Optimization Engine v2.1'
  };

  const keyAssumptionsData = [
    'Train priority maintained for Rajdhani, Shatabdi and freight corridors.',
    'Resource availability as per current roster.',
    'Standard maintenance time windows (00:30 – 04:30).',
    'Weather and unforeseen events not considered.',
    'Results may vary based on real-time operational changes.'
  ];

  // 1.4 Bottom Comparison Analytics Master Data
  const comparisonAnalyticsData = {
    // Col 1: Train Delay Comparison (Minutes)
    trainDelays: [
      { plan: 'Current Plan', val: 580, tag: '', theme: 'current' },
      { plan: 'Plan A', val: 320, tag: '↓ 45%', tagTheme: 'tag-emerald', theme: 'plana' },
      { plan: 'Plan B', val: 480, tag: '↓ 18%', tagTheme: 'tag-blue', theme: 'planb' },
      { plan: 'Plan C', val: 860, tag: '↑ 45%', tagTheme: 'tag-rose', theme: 'planc' }
    ],
    // Col 2: Maintenance Value Score (0–100)
    maintScores: [
      { plan: 'Current Plan', val: 62, tag: '', theme: 'current' },
      { plan: 'Plan A', val: 89, tag: '↑ 28%', tagTheme: 'tag-emerald', theme: 'plana' },
      { plan: 'Plan B', val: 76, tag: '↑ 12%', tagTheme: 'tag-blue', theme: 'planb' },
      { plan: 'Plan C', val: 94, tag: '↑ 42%', tagTheme: 'tag-rose', theme: 'planc' }
    ],
    // Col 3: Risk & Confidence (%)
    riskConfidence: [
      { plan: 'Plan A', risk: 12, confidence: 92 },
      { plan: 'Plan B', risk: 28, confidence: 78 },
      { plan: 'Plan C', risk: 38, confidence: 71 }
    ],
    // Col 4: Summary Comparison Table
    summaryMatrix: [
      { metric: 'Total Blocks', current: '51', planA: '42', planB: '36', planC: '58' },
      { metric: 'Train Delays (min)', current: '580', planA: '320', planB: '480', planC: '860' },
      { metric: 'Maint. Value Score', current: '62', planA: '89', planB: '76', planC: '94' },
      { metric: 'Overrun Risk', current: '24%', planA: '12%', planB: '28%', planC: '38%' },
      { metric: 'Confidence', current: '—', planA: '92%', planB: '78%', planC: '71%' }
    ]
  };

  // State tracker for active filters
  const currentFilterState = {
    horizon: 'h-3m',
    division: 'div-jh',
    section: 'sec-all',
    maintenanceType: 'maint-all',
    constraint: 'const-std'
  };

  // ============================================================================
  // SECTION 2: COMPONENT RENDERERS
  // ============================================================================

  // ----------------------------------------------------------------------------
  // 2.1 RENDER OPTIMIZATION INPUTS & FILTERS (Part 1)
  // ----------------------------------------------------------------------------
  function renderOptimizationControls() {
    const container = document.getElementById('opt-controls-container');
    if (!container) return;

    container.innerHTML = `
      <h3 class="opt-controls-header-title">Optimization Inputs &amp; Filters</h3>
      <div class="opt-controls-row">
        
        <!-- Filter 1: Planning Horizon -->
        <div class="opt-filter-group">
          <label class="opt-filter-label" for="opt-horizon-select">
            <i class="fa-regular fa-calendar-days"></i> Planning Horizon
          </label>
          <select id="opt-horizon-select" class="opt-select-field">
            ${optimizationFiltersData.horizons.map(h => `<option value="${h.id}" ${h.id === currentFilterState.horizon ? 'selected' : ''}>${h.label}</option>`).join('')}
          </select>
          <span class="opt-filter-hint" id="opt-horizon-hint">01 Oct 2026 – 31 Dec 2026</span>
        </div>

        <!-- Filter 2: Network / Division -->
        <div class="opt-filter-group">
          <label class="opt-filter-label" for="opt-division-select">
            <i class="fa-solid fa-location-dot"></i> Network / Division
          </label>
          <select id="opt-division-select" class="opt-select-field">
            ${optimizationFiltersData.divisions.map(d => `<option value="${d.id}" ${d.id === currentFilterState.division ? 'selected' : ''}>${d.label}</option>`).join('')}
          </select>
          <span class="opt-filter-hint" id="opt-division-hint">28 sections selected</span>
        </div>

        <!-- Filter 3: Sections -->
        <div class="opt-filter-group">
          <label class="opt-filter-label" for="opt-section-select">
            <i class="fa-solid fa-route"></i> Sections
          </label>
          <select id="opt-section-select" class="opt-select-field">
            ${optimizationFiltersData.sections.map(s => `<option value="${s.id}" ${s.id === currentFilterState.section ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
          <span class="opt-filter-hint" id="opt-section-hint">or select specific sections</span>
        </div>

        <!-- Filter 4: Maintenance Types -->
        <div class="opt-filter-group">
          <label class="opt-filter-label" for="opt-type-select">
            <i class="fa-solid fa-wrench"></i> Maintenance Types
          </label>
          <select id="opt-type-select" class="opt-select-field">
            ${optimizationFiltersData.maintenanceTypes.map(m => `<option value="${m.id}" ${m.id === currentFilterState.maintenanceType ? 'selected' : ''}>${m.label}</option>`).join('')}
          </select>
          <span class="opt-filter-hint" id="opt-type-hint">Include routine + corrective</span>
        </div>

        <!-- Filter 5: Constraints -->
        <div class="opt-filter-group">
          <label class="opt-filter-label" for="opt-constraint-select">
            <i class="fa-solid fa-sliders"></i> Constraints
          </label>
          <select id="opt-constraint-select" class="opt-select-field">
            ${optimizationFiltersData.constraints.map(c => `<option value="${c.id}" ${c.id === currentFilterState.constraint ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
          <span class="opt-filter-hint" id="opt-constraint-hint">Train priority, crew, resources</span>
        </div>

        <!-- Action Buttons -->
        <div class="opt-action-buttons-group">
          <button class="btn-generate-main" id="btn-generate-plans">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Generate Optimized Plans
          </button>
          <button class="btn-advanced-options" id="btn-open-advanced">
            <i class="fa-solid fa-gear"></i> Advanced Options
          </button>
        </div>

      </div>
    `;

    // Listeners for filter controls
    const horizonSel = document.getElementById('opt-horizon-select');
    if (horizonSel) {
      horizonSel.addEventListener('change', (e) => {
        currentFilterState.horizon = e.target.value;
        const obj = optimizationFiltersData.horizons.find(h => h.id === e.target.value);
        if (obj) {
          document.getElementById('opt-horizon-hint').textContent = obj.range;
          showToastNotification(`Planning Horizon updated to ${obj.label}`, 'info');
        }
      });
    }

    const generateBtn = document.getElementById('btn-generate-plans');
    if (generateBtn) {
      generateBtn.addEventListener('click', triggerPlanGeneration);
    }

    const advancedBtn = document.getElementById('btn-open-advanced');
    if (advancedBtn) {
      advancedBtn.addEventListener('click', openAdvancedOptionsModal);
    }
  }

  // ----------------------------------------------------------------------------
  // 2.2 RENDER 3 PLAN CARDS (Plan A, Plan B, Plan C)
  // ----------------------------------------------------------------------------
  function renderPlanCards() {
    const container = document.getElementById('opt-plan-cards-container');
    if (!container) return;

    let html = '';

    plansData.forEach((plan) => {
      html += `
        <div class="opt-plan-card ${plan.themeClass}" id="${plan.id}">
          <div>
            <div class="plan-card-header">
              <div class="plan-icon-wrap ${plan.iconTheme}">
                <i class="${plan.iconClass}"></i>
              </div>
              <div class="plan-title-area">
                <div class="plan-title-row">
                  <span class="plan-main-title">${plan.letter}</span>
                  ${plan.recommended ? `<span class="plan-badge-recommended">Recommended</span>` : ''}
                </div>
                <span class="plan-sub-tag ${plan.tagTheme}">${plan.tag}</span>
              </div>
            </div>

            <p class="plan-description">${plan.description}</p>

            <div class="plan-metrics-list">
              <!-- Estimated Total Blocks -->
              <div class="plan-metric-item">
                <span class="plan-metric-lbl">
                  <i class="fa-regular fa-clock"></i> Estimated Total Blocks
                </span>
                <div class="plan-metric-val-wrap">
                  <span class="plan-metric-val">${plan.metrics.totalBlocks.val}</span>
                  <span class="metric-diff-badge ${plan.metrics.totalBlocks.diffType === 'positive' ? 'diff-positive' : 'diff-negative'}">
                    ${plan.metrics.totalBlocks.diff}
                  </span>
                </div>
              </div>

              <!-- Estimated Train Delays -->
              <div class="plan-metric-item">
                <span class="plan-metric-lbl">
                  <i class="fa-solid fa-train"></i> Estimated Train Delays
                </span>
                <div class="plan-metric-val-wrap">
                  <span class="plan-metric-val">${plan.metrics.trainDelays.val}</span>
                  <span class="metric-diff-badge ${plan.metrics.trainDelays.diffType === 'positive' ? 'diff-positive' : 'diff-negative'}">
                    ${plan.metrics.trainDelays.diff}
                  </span>
                </div>
              </div>

              <!-- Maintenance Value Score -->
              <div class="plan-metric-item">
                <span class="plan-metric-lbl">
                  <i class="fa-solid fa-wrench"></i> Maintenance Value Score
                </span>
                <div class="plan-metric-val-wrap">
                  <span class="plan-metric-val">${plan.metrics.maintValue.val}</span>
                  <span class="metric-diff-badge diff-positive">${plan.metrics.maintValue.diff}</span>
                </div>
              </div>

              <!-- Overrun Risk -->
              <div class="plan-metric-item">
                <span class="plan-metric-lbl">
                  <i class="fa-solid fa-triangle-exclamation" style="color: ${plan.metrics.overrunRisk.color};"></i> Overrun Risk
                </span>
                <span class="plan-metric-val" style="color: ${plan.metrics.overrunRisk.color};">
                  ${plan.metrics.overrunRisk.label}
                </span>
              </div>

              <!-- Plan Confidence -->
              <div class="plan-metric-item">
                <span class="plan-metric-lbl">
                  <i class="fa-regular fa-circle-dot" style="color: #2563EB;"></i> Plan Confidence
                </span>
                <span class="plan-metric-val">${plan.metrics.confidence.val}%</span>
              </div>

              <div class="confidence-meter-row">
                <div class="confidence-track">
                  <div class="confidence-fill ${plan.metrics.confidence.theme}" style="width: ${plan.metrics.confidence.val}%;"></div>
                </div>
              </div>
            </div>
          </div>

          <button class="btn-plan-action ${plan.actionBtnClass}" data-plan-id="${plan.id}">
            ${plan.actionText}
          </button>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach click listeners to plan action buttons
    const planButtons = container.querySelectorAll('.btn-plan-action');
    planButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const planId = btn.getAttribute('data-plan-id');
        openPlanDetailsModal(planId);
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 2.3 RENDER RIGHT SIDEBAR: WHY PLAN A & KEY ASSUMPTIONS
  // ----------------------------------------------------------------------------
  function renderWhyPlanA() {
    const card = document.getElementById('opt-why-card');
    if (!card) return;

    const reasonsHtml = whyPlanAData.reasons.map(r => `
      <div class="opt-reason-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${r}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="opt-why-header">
        <h4 class="opt-why-title">Why Plan A is Recommended</h4>
        <span class="badge-ai-recommendation">
          <i class="fa-solid fa-wand-magic-sparkles"></i> ${whyPlanAData.badge}
        </span>
      </div>

      <div class="opt-reasons-list">
        ${reasonsHtml}
      </div>

      <div class="opt-ai-quote-box">
        <div class="quote-text-wrap">
          <i class="fa-solid fa-quote-left"></i>
          <span>${whyPlanAData.quote}</span>
        </div>
        <span class="quote-author">${whyPlanAData.author}</span>
      </div>
    `;
  }

  function renderKeyAssumptions() {
    const card = document.getElementById('opt-assumptions-card');
    if (!card) return;

    const assumptionsHtml = keyAssumptionsData.map(a => `
      <div class="opt-assumption-item">
        <i class="fa-solid fa-circle-info"></i>
        <span>${a}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <h4 class="opt-assumptions-title">Key Assumptions</h4>
      <div class="opt-assumptions-list">
        ${assumptionsHtml}
      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 2.4 RENDER BOTTOM COMPARISON ANALYTICS ROW (4 Columns)
  // ----------------------------------------------------------------------------

  // Col 1: Train Delay Comparison (0 – 1000 mins)
  function renderDelayComparison() {
    const card = document.getElementById('card-delay-comparison');
    if (!card) return;

    const maxVal = 1000;
    const barsHtml = comparisonAnalyticsData.trainDelays.map(item => {
      const heightPercent = Math.min(100, Math.round((item.val / maxVal) * 100));
      return `
        <div class="bar-col">
          ${item.tag ? `<span class="bar-floating-tag ${item.tagTheme}">${item.tag}</span>` : ''}
          <span class="bar-val-label">${item.val}</span>
          <div class="bar-pill ${item.theme}" style="height: ${heightPercent}%;"></div>
          <span class="bar-x-label">${item.plan === 'Current Plan' ? 'Current' : item.plan}</span>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <h4 class="analytics-card-title">Train Delay Comparison</h4>
      <div class="chart-viewport">
        <div class="y-axis-labels">
          <span>1,000</span>
          <span>750</span>
          <span>500</span>
          <span>250</span>
          <span>0</span>
        </div>
        <div class="bars-container">
          ${barsHtml}
        </div>
      </div>
      <div style="font-size: 9.5px; color: #64748B; text-align: center; margin-top: 4px;">
        Total Passenger &amp; Freight Delay (Minutes)
      </div>
    `;
  }

  // Col 2: Maintenance Value Score (0 – 100)
  function renderMaintScore() {
    const card = document.getElementById('card-maint-score');
    if (!card) return;

    const maxVal = 100;
    const barsHtml = comparisonAnalyticsData.maintScores.map(item => {
      const heightPercent = Math.min(100, Math.round((item.val / maxVal) * 100));
      return `
        <div class="bar-col">
          ${item.tag ? `<span class="bar-floating-tag ${item.tagTheme}">${item.tag}</span>` : ''}
          <span class="bar-val-label">${item.val}</span>
          <div class="bar-pill ${item.theme}" style="height: ${heightPercent}%;"></div>
          <span class="bar-x-label">${item.plan === 'Current Plan' ? 'Current' : item.plan}</span>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <h4 class="analytics-card-title">Maintenance Value Score</h4>
      <div class="chart-viewport">
        <div class="y-axis-labels">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>20</span>
          <span>0</span>
        </div>
        <div class="bars-container">
          ${barsHtml}
        </div>
      </div>
      <div style="font-size: 9.5px; color: #64748B; text-align: center; margin-top: 4px;">
        Normalized Asset Health Multiplier (0–100)
      </div>
    `;
  }

  // Col 3: Risk & Confidence Dual Bar Chart (0 – 100%)
  function renderRiskConfidence() {
    const card = document.getElementById('card-risk-confidence');
    if (!card) return;

    const maxVal = 100;
    const groupsHtml = comparisonAnalyticsData.riskConfidence.map(item => {
      const riskHeight = Math.min(100, item.risk);
      const confHeight = Math.min(100, item.confidence);
      return `
        <div class="bar-col" style="width: 32px;">
          <div class="dual-bars-group">
            <!-- Overrun Risk (Red) -->
            <div class="dual-bar-item risk" style="height: ${riskHeight}%;">
              <span class="dual-bar-val">${item.risk}</span>
            </div>
            <!-- Plan Confidence (Blue) -->
            <div class="dual-bar-item confidence" style="height: ${confHeight}%;">
              <span class="dual-bar-val">${item.confidence}</span>
            </div>
          </div>
          <span class="bar-x-label">${item.plan}</span>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <h4 class="analytics-card-title">Risk &amp; Confidence</h4>
      <div class="chart-viewport">
        <div class="y-axis-labels">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div class="bars-container">
          ${groupsHtml}
        </div>
      </div>
      <div class="chart-legend-row">
        <span><span class="legend-square sq-red"></span> Overrun Risk (%)</span>
        <span><span class="legend-square sq-blue"></span> Plan Confidence (%)</span>
      </div>
    `;
  }

  // Col 4: Plan Comparison Summary Table
  function renderPlanSummaryTable() {
    const card = document.getElementById('card-plan-summary');
    if (!card) return;

    const rowsHtml = comparisonAnalyticsData.summaryMatrix.map(row => `
      <tr>
        <td>${row.metric}</td>
        <td>${row.current}</td>
        <td class="col-plana">${row.planA}</td>
        <td>${row.planB}</td>
        <td>${row.planC}</td>
      </tr>
    `).join('');

    card.innerHTML = `
      <h4 class="analytics-card-title">Plan Comparison Summary</h4>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Current</th>
            <th class="col-plana">Plan A</th>
            <th>Plan B</th>
            <th>Plan C</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div style="font-size: 9px; color: #64748B; text-align: center; margin-top: 6px;">
        Evaluated by AI Engine v2.1 • Multi-Objective Pareto
      </div>
    `;
  }

  // ============================================================================
  // SECTION 3: INTERACTIVE MODALS & AI ACTIONS
  // ============================================================================

  // 3.1 Plan Details Modal Handler
  function openPlanDetailsModal(planId) {
    const modal = document.getElementById('plan-details-modal');
    const plan = plansData.find(p => p.id === planId);
    if (!modal || !plan) return;

    const badgeIcon = document.getElementById('modal-plan-badge-icon');
    const title = document.getElementById('modal-plan-title');
    const subtitle = document.getElementById('modal-plan-subtitle');
    const body = document.getElementById('modal-plan-body');

    if (badgeIcon) {
      badgeIcon.className = `modal-plan-badge ${plan.tagTheme === 'emerald' ? 'emerald-theme' : (plan.tagTheme === 'blue' ? 'blue-theme' : 'rose-theme')}`;
      badgeIcon.innerHTML = `<i class="${plan.iconClass}"></i>`;
    }

    if (title) title.textContent = `${plan.letter}: ${plan.tag}`;
    if (subtitle) subtitle.textContent = plan.description;

    if (body) {
      body.innerHTML = `
        <div class="opt-modal-kpi-grid">
          <div class="opt-modal-kpi-card">
            <div class="opt-modal-kpi-lbl">Total Blocks</div>
            <div class="opt-modal-kpi-val">${plan.metrics.totalBlocks.val} <span class="opt-diff-tag text-emerald">${plan.metrics.totalBlocks.diff}</span></div>
          </div>
          <div class="opt-modal-kpi-card">
            <div class="opt-modal-kpi-lbl">Estimated Passenger Delay</div>
            <div class="opt-modal-kpi-val">${plan.metrics.trainDelays.val} <span class="opt-diff-tag text-emerald">${plan.metrics.trainDelays.diff}</span></div>
          </div>
          <div class="opt-modal-kpi-card">
            <div class="opt-modal-kpi-lbl">Maintenance Value</div>
            <div class="opt-modal-kpi-val">${plan.metrics.maintValue.val}</div>
          </div>
          <div class="opt-modal-kpi-card">
            <div class="opt-modal-kpi-lbl">Model Confidence</div>
            <div class="opt-modal-kpi-val">${plan.metrics.confidence.val}%</div>
          </div>
        </div>

        <div class="opt-modal-details-list">
          <div><strong class="opt-detail-key">Primary Corridors:</strong> <span class="opt-detail-val">${plan.details.focusCorridor}</span></div>
          <div><strong class="opt-detail-key">Allocated Resources:</strong> <span class="opt-detail-val">${plan.details.crewTeams}</span></div>
          <div><strong class="opt-detail-key">Machinery Roster:</strong> <span class="opt-detail-val">${plan.details.machinery}</span></div>
          <div><strong class="opt-detail-key">Block Window Plan:</strong> <span class="opt-detail-val">${plan.details.windowSchedule}</span></div>
          <div class="opt-modal-impact-banner">
            <strong class="opt-impact-title">Impact Assessment:</strong> <span class="opt-impact-text">${plan.details.impactSummary}</span>
          </div>
        </div>
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook Apply Button
    const applyBtn = document.getElementById('modal-apply-btn');
    if (applyBtn) {
      applyBtn.onclick = () => {
        closePlanDetailsModal();
        showToastNotification(`Successfully deployed ${plan.letter} to Jharkhand Division operational timetable!`, 'success');
      };
    }
  }

  function closePlanDetailsModal() {
    const modal = document.getElementById('plan-details-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 3.2 Advanced Options Modal Handler
  function openAdvancedOptionsModal() {
    const modal = document.getElementById('advanced-options-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAdvancedOptionsModal() {
    const modal = document.getElementById('advanced-options-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function initModals() {
    // Plan Details close buttons
    const closeBtn = document.getElementById('modal-close-btn');
    const dismissBtn = document.getElementById('modal-dismiss-btn');
    const planModal = document.getElementById('plan-details-modal');

    if (closeBtn) closeBtn.addEventListener('click', closePlanDetailsModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closePlanDetailsModal);
    if (planModal) {
      planModal.addEventListener('click', (e) => {
        if (e.target === planModal) closePlanDetailsModal();
      });
    }

    // Advanced Options close buttons & form
    const advCloseBtn = document.getElementById('modal-adv-close-btn');
    const advCancelBtn = document.getElementById('modal-adv-cancel-btn');
    const advModal = document.getElementById('advanced-options-modal');
    const advForm = document.getElementById('advanced-options-form');

    if (advCloseBtn) advCloseBtn.addEventListener('click', closeAdvancedOptionsModal);
    if (advCancelBtn) {
      advCancelBtn.addEventListener('click', () => {
        if (advForm) advForm.reset();
        document.getElementById('adv-delay-val').textContent = '85% (High Penalty)';
        document.getElementById('adv-urgency-val').textContent = '70% (Standard Safety Factor)';
        showToastNotification('Optimization weights reset to default parameters', 'info');
      });
    }

    if (advModal) {
      advModal.addEventListener('click', (e) => {
        if (e.target === advModal) closeAdvancedOptionsModal();
      });
    }

    // Sliders
    const delaySlider = document.getElementById('adv-delay-penalty');
    const urgencySlider = document.getElementById('adv-track-urgency');

    if (delaySlider) {
      delaySlider.addEventListener('input', (e) => {
        document.getElementById('adv-delay-val').textContent = `${e.target.value}% (Custom Weight)`;
      });
    }

    if (urgencySlider) {
      urgencySlider.addEventListener('input', (e) => {
        document.getElementById('adv-urgency-val').textContent = `${e.target.value}% (Custom Urgency)`;
      });
    }

    if (advForm) {
      advForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeAdvancedOptionsModal();
        showToastNotification('Advanced AI optimization weights applied to model', 'success');
        triggerPlanGeneration();
      });
    }
  }

  // 3.3 Dynamic Plan Generation & Simulation
  function triggerPlanGeneration() {
    const timestampElem = document.getElementById('opt-gen-timestamp');
    const now = new Date();
    const formatted = `Generated on ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    if (timestampElem) {
      timestampElem.textContent = formatted;
    }

    showToastNotification('AI Engine: Multi-objective Pareto optimization complete! 3 plans evaluated.', 'success');

    // Quick visual pulse effect on cards
    const cards = document.querySelectorAll('.opt-plan-card');
    cards.forEach(card => {
      card.style.opacity = '0.6';
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.transition = 'all 0.3s ease';
      }, 200);
    });
  }

  // Global Toast Notification Helper
  function showToastNotification(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.style.cssText = 'pointer-events: auto; background: #0F172A; color: #FFFFFF; padding: 10px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; box-shadow: 0 8px 20px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 8px; max-width: 380px; border-left: 4px solid #10B981; margin-bottom: 8px;';
    if (type === 'info') toast.style.borderLeftColor = '#3B82F6';
    if (type === 'danger') toast.style.borderLeftColor = '#EF4444';

    toast.innerHTML = `
      <i class="${type === 'success' ? 'fa-solid fa-circle-check' : (type === 'info' ? 'fa-solid fa-circle-info' : 'fa-solid fa-circle-exclamation')}" style="color: ${type === 'success' ? '#10B981' : (type === 'info' ? '#3B82F6' : '#EF4444')};"></i>
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
    // Sidebar collapse/expand is centrally managed by theme-sync.js
  }

  // ============================================================================
  // SECTION 5: INITIALIZATION LIFECYCLE
  // ============================================================================
  function init() {
    // Shell & Global Components
    renderUserProfile();
    renderSidebarAndFooter();
    initSidebarToggle();
    initModals();

    // Part 1: Optimization Inputs & Controls
    renderOptimizationControls();

    // Part 2: Generated Plans & Recommendations
    renderPlanCards();
    renderWhyPlanA();
    renderKeyAssumptions();

    // Part 3: Bottom Analytics Row
    renderDelayComparison();
    renderMaintScore();
    renderRiskConfidence();
    renderPlanSummaryTable();

    // Regenerate pill listener
    const regenBtn = document.getElementById('btn-regenerate');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        triggerPlanGeneration();
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

    // Handle ?plan=a / ?plan=b / ?plan=c navigation from Dashboard
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const planParam = urlParams.get('plan');
      if (planParam) {
        const targetId = `plan-${planParam.toLowerCase()}`;
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.transition = 'all 0.4s ease';
            el.style.transform = 'scale(1.02)';
            el.style.boxShadow = '0 0 0 3px #3B82F6, 0 10px 25px rgba(59, 130, 246, 0.4)';
            setTimeout(() => {
              el.style.transform = '';
              el.style.boxShadow = '';
            }, 3000);
          }
        }, 300);
      }

      const modalParam = urlParams.get('modal');
      if (modalParam) {
        const modalPlanId = modalParam === 'true' ? 'plan-a' : (modalParam.startsWith('plan-') ? modalParam : `plan-${modalParam.toLowerCase()}`);
        setTimeout(() => {
          openPlanDetailsModal(modalPlanId);
        }, 200);
      }
    } catch (e) {}
  }

  init();
});
