/* ==========================================================================
   THINKSYNC RAILWAY HEALTH MAP ENGINE - JAVASCRIPT SYSTEM (PAGE 2)
   Architecture: Model - View - Controller (Data -> Render Functions -> Events)
   Indian Railways - Jharkhand Division Live Network Health & Asset Monitoring
   
   HOW THIS FILE WORKS & ARCHITECTURAL OVERVIEW:
   --------------------------------------------------------------------------
   1. PART 1: DATA STORE (MODEL)
      - Contains all live metrics, KPI records, station coordinates, railway
        track segments, health scores, vulnerability zones, and AI insights.
      - ZERO hardcoded business data exists inside the HTML file!
      
   2. PART 2: DEFENSIVE PROGRAMMING & FALLBACKS (SAFETY LAYER)
      - Every render function validates data availability before drawing elements.
      - If any dataset is null, undefined, or empty, a structured 'Not Found'
        fallback component is rendered without removing or destroying cards,
        headers, or the surrounding dashboard structure.
        
   3. PART 3: VIEW RENDERERS (PRESENTATION LAYER)
      - Dynamic DOM generators that render HTML and SVGs:
        a) Subheader toolbar with division picker and pulsing live clock.
        b) 5 top health KPI cards with values and percentage changes.
        c) Interactive SVG Jharkhand Railway Network Map with tracks & stations.
        d) Real-time Section Details panel with key issues and AI advice.
        e) Vulnerability Zones list and Live Health Gauge Indicators.
        f) Bottom row: Network Health Donut, Critical Sections Table, AI Insights.
        g) Shared sidebar (smooth toggle) and Indian Railways footer.
        
   4. PART 4: INTERACTIVE CONTROLLER & EVENT HANDLERS (LOGIC LAYER)
      - Handles station selection, track clicks, status filtering, live search,
        map zoom, live data refreshing, modals, and toast notifications.
   ========================================================================== */

/* React mount adapter: original page engine starts after JSX is mounted. */
(function () {

  /* ==========================================================================
     PART 1: DATA STORE (MODEL)
     All page data is defined cleanly in structured JavaScript arrays & objects.
     ========================================================================== */

  // --------------------------------------------------------------------------
  // 1.1 Page Subheader & Action Bar Configuration Data
  // --------------------------------------------------------------------------
  const subHeaderData = {
    title: 'Railway Health Map',
    subtitle: 'Live network health, vulnerabilities and insights for Jharkhand Railway Network',
    networkViews: ['Jharkhand Division', 'Ranchi Sub-Division', 'Dhanbad Sub-Division', 'Chakradharpur Div.'],
    timeRanges: ['Live / Real-time', 'Past 24 Hours', 'Past 7 Days', 'Monthly Cumulative'],
    isLive: true,
    lastUpdatedText: '12 Sep 2026, 10:24 AM'
  };

  // --------------------------------------------------------------------------
  // 1.2 Top 5 Health KPI Metric Cards Data
  // Values, percentage trends, subtitles, and icons matching the reference image
  // --------------------------------------------------------------------------
  const healthKpisData = [
    {
      id: 'total',
      title: 'Total Sections',
      value: 28,
      trend: '↑ 12%',
      trendClass: 'green',
      subtext: 'In Jharkhand Division',
      iconSvg: '<svg class="kpi-track-svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v20"></path><path d="M19 2v20"></path><path d="M5 6h14"></path><path d="M5 12h14"></path><path d="M5 18h14"></path></svg>',
      iconClass: 'fa-solid fa-bars-staggered',
      colorClass: 'track-navy'
    },
    {
      id: 'healthy',
      title: 'Healthy Sections',
      value: 18,
      trend: '↑ 9%',
      trendClass: 'green',
      subtext: '64% of network',
      iconClass: 'fa-solid fa-clipboard-check',
      colorClass: 'healthy-orange'
    },
    {
      id: 'moderate',
      title: 'Moderate Sections',
      value: 6,
      trend: '→ 0%',
      trendClass: 'gray',
      subtext: '21% of network',
      iconClass: 'fa-solid fa-triangle-exclamation',
      colorClass: 'moderate-yellow'
    },
    {
      id: 'critical',
      title: 'Critical Sections',
      value: 3,
      trend: '↑ 50%',
      trendClass: 'red',
      subtext: '11% of network',
      iconClass: 'fa-solid fa-circle-exclamation',
      colorClass: 'critical-red'
    },
    {
      id: 'maintenance',
      title: 'Under Maintenance',
      value: 1,
      trend: '→ 0%',
      trendClass: 'gray',
      subtext: '4% of network',
      iconClass: 'fa-solid fa-wrench',
      colorClass: 'maintenance-blue'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.3 Jharkhand Railway Network Map Stations (Nodes)
  // Precise relative coordinates within state boundaries matching reference map
  // --------------------------------------------------------------------------
  const mapStations = [
    { id: 'GARH', name: 'Garhwa', x: 80, y: 175, isHub: false, statusColor: '#EF4444' },
    { id: 'DLTG', name: 'Daltonganj', x: 120, y: 205, isHub: false, statusColor: '#EAB308' },
    { id: 'LTAR', name: 'Latehar', x: 170, y: 225, isHub: false, statusColor: '#EAB308' },
    { id: 'LOHR', name: 'Lohardaga', x: 160, y: 275, isHub: false, statusColor: '#EF4444' },
    { id: 'GUML', name: 'Gumla', x: 150, y: 315, isHub: false, statusColor: '#EF4444' },
    { id: 'SIMD', name: 'Simdega', x: 215, y: 360, isHub: false, statusColor: '#22C55E' },
    { id: 'KHNT', name: 'Khunti', x: 245, y: 305, isHub: false, statusColor: '#22C55E' },
    { id: 'RNC',  name: 'Ranchi', x: 265, y: 270, isHub: true, statusColor: '#0F172A' },
    { id: 'RMGR', name: 'Ramgarh', x: 310, y: 270, isHub: false, statusColor: '#EF4444' },
    { id: 'BOKR', name: 'Bokaro', x: 365, y: 260, isHub: false, statusColor: '#22C55E' },
    { id: 'DHN',  name: 'Dhanbad', x: 420, y: 260, isHub: true, statusColor: '#EF4444' },
    { id: 'JMTR', name: 'Jamtara', x: 460, y: 235, isHub: false, statusColor: '#EF4444' },
    { id: 'CHTR', name: 'Chatra', x: 210, y: 175, isHub: false, statusColor: '#3B82F6' },
    { id: 'KODR', name: 'Koderma', x: 285, y: 155, isHub: false, statusColor: '#EF4444' },
    { id: 'HAZB', name: 'Hazaribagh', x: 305, y: 210, isHub: false, statusColor: '#22C55E' },
    { id: 'GRDH', name: 'Giridih', x: 380, y: 185, isHub: false, statusColor: '#22C55E' },
    { id: 'DGHR', name: 'Deoghar', x: 440, y: 175, isHub: false, statusColor: '#22C55E' },
    { id: 'SHBG', name: 'Sahetganj', x: 505, y: 135, isHub: false, statusColor: '#EF4444' },
    { id: 'PAKR', name: 'Pakur', x: 525, y: 175, isHub: false, statusColor: '#22C55E' },
    { id: 'CHBS', name: 'Chaibasa', x: 350, y: 350, isHub: false, statusColor: '#EAB308' }
  ];

  // --------------------------------------------------------------------------
  // 1.4 Jharkhand Railway Network Track Corridors (Edges)
  // Health status, scores, lengths, and maintenance diagnostics
  // --------------------------------------------------------------------------
  const mapTracks = [
    {
      id: 'TRK-01',
      code: 'JH-GAR-DLT',
      from: 'GARH',
      to: 'DLTG',
      name: 'Garhwa – Daltonganj',
      status: 'critical',
      healthScore: 38,
      length: '42 km',
      lastInspection: '02 Sep 2026',
      nextDue: '16 Sep 2026',
      issues: ['Severe rail head corrugation', 'Fishplate cracking near km 18', 'Ballast deficiency'],
      aiRecommendation: 'Immediate speed restriction to 45 km/h. Emergency block recommended.'
    },
    {
      id: 'TRK-02',
      code: 'JH-DLT-LTR',
      from: 'DLTG',
      to: 'LTAR',
      name: 'Daltonganj – Latehar',
      status: 'vulnerable',
      healthScore: 41,
      length: '68 km',
      lastInspection: '08 Sep 2026',
      nextDue: '22 Sep 2026',
      issues: ['Curve alignment deviation', 'Drainage accumulation at km 32'],
      aiRecommendation: 'Deploy track geometry car. Schedule hydraulic tamping.'
    },
    {
      id: 'TRK-03',
      code: 'JH-LTR-RNC',
      from: 'LTAR',
      to: 'RNC',
      name: 'Latehar – Ranchi',
      status: 'moderate',
      healthScore: 68,
      length: '94 km',
      lastInspection: '05 Sep 2026',
      nextDue: '25 Sep 2026',
      issues: ['Track geometry deviation', 'Sleeper deterioration', 'Drainage congestion (2 locations)'],
      aiRecommendation: 'Schedule tamping within 3 weeks. Monitor km 56–62 closely.'
    },
    {
      id: 'TRK-04',
      code: 'JH-LTR-LOH',
      from: 'LTAR',
      to: 'LOHR',
      name: 'Latehar – Lohardaga',
      status: 'good',
      healthScore: 84,
      length: '51 km',
      lastInspection: '10 Sep 2026',
      nextDue: '10 Oct 2026',
      issues: ['Minor ballast settling on outer curve'],
      aiRecommendation: 'Routine maintenance on schedule. Normal track speed permitted.'
    },
    {
      id: 'TRK-05',
      code: 'JH-LOH-GUM',
      from: 'LOHR',
      to: 'GUML',
      name: 'Lohardaga – Gumla',
      status: 'critical',
      healthScore: 36,
      length: '47 km',
      lastInspection: '01 Sep 2026',
      nextDue: '15 Sep 2026',
      issues: ['Joint gap widening in extreme heat', 'Fastener missing rate 4.2%'],
      aiRecommendation: 'Schedule urgent weld inspection and replace elastic rail clips.'
    },
    {
      id: 'TRK-06',
      code: 'JH-GUM-SIM',
      from: 'GUML',
      to: 'SIMD',
      name: 'Gumla – Simdega',
      status: 'good',
      healthScore: 88,
      length: '63 km',
      lastInspection: '07 Sep 2026',
      nextDue: '07 Oct 2026',
      issues: ['Optimal track parameters recorded'],
      aiRecommendation: 'Condition stable. Maintain automated acoustic monitoring.'
    },
    {
      id: 'TRK-07',
      code: 'JH-SIM-KHN',
      from: 'SIMD',
      to: 'KHNT',
      name: 'Simdega – Khunti',
      status: 'moderate',
      healthScore: 74,
      length: '78 km',
      lastInspection: '04 Sep 2026',
      nextDue: '24 Sep 2026',
      issues: ['Vegetation growth near signaling cables'],
      aiRecommendation: 'Perform brush clearing and check ground bond connections.'
    },
    {
      id: 'TRK-08',
      code: 'JH-KHN-RNC',
      from: 'KHNT',
      to: 'RNC',
      name: 'Khunti – Ranchi',
      status: 'good',
      healthScore: 91,
      length: '38 km',
      lastInspection: '11 Sep 2026',
      nextDue: '11 Oct 2026',
      issues: ['No critical anomalies detected'],
      aiRecommendation: 'Optimal health score. Candidate for speed upgrade evaluation.'
    },
    {
      id: 'TRK-09',
      code: 'JH-CTR-RNC',
      from: 'CHTR',
      to: 'RNC',
      name: 'Chatra – Ranchi',
      status: 'maintenance',
      healthScore: 50,
      length: '112 km',
      lastInspection: '12 Sep 2026',
      nextDue: '13 Sep 2026',
      issues: ['Track renewal and OHE wire replacement underway'],
      aiRecommendation: 'Block active until 18:00 hrs. Reroute freight via Bokaro.'
    },
    {
      id: 'TRK-10',
      code: 'JH-CTR-KOD',
      from: 'CHTR',
      to: 'KODR',
      name: 'Chatra – Koderma',
      status: 'good',
      healthScore: 82,
      length: '56 km',
      lastInspection: '06 Sep 2026',
      nextDue: '06 Oct 2026',
      issues: ['Stable concrete sleepers'],
      aiRecommendation: 'Monitor monsoon runoff near culvert 41.'
    },
    {
      id: 'TRK-11',
      code: 'JH-KOD-HZB',
      from: 'KODR',
      to: 'HAZB',
      name: 'Koderma – Hazaribagh',
      status: 'critical',
      healthScore: 32,
      length: '64 km',
      lastInspection: '03 Sep 2026',
      nextDue: '17 Sep 2026',
      issues: ['Steep grade track twist anomaly', 'High risk acoustic telemetry'],
      aiRecommendation: 'Priority 1 Intervention required. Impose temporary caution order.'
    },
    {
      id: 'TRK-12',
      code: 'JH-HZB-GRD',
      from: 'HAZB',
      to: 'GRDH',
      name: 'Hazaribagh – Giridih',
      status: 'good',
      healthScore: 86,
      length: '72 km',
      lastInspection: '09 Sep 2026',
      nextDue: '09 Oct 2026',
      issues: ['Minor sleeper cosmetic surface spalling'],
      aiRecommendation: 'No action required this cycle. Re-evaluate during quarterly audit.'
    },
    {
      id: 'TRK-13',
      code: 'JH-GRD-DGH',
      from: 'GRDH',
      to: 'DGHR',
      name: 'Giridih – Deoghar',
      status: 'vulnerable',
      healthScore: 46,
      length: '58 km',
      lastInspection: '05 Sep 2026',
      nextDue: '19 Sep 2026',
      issues: ['Vegetation encroachment into clearance gauge', 'Catenary tension sag'],
      aiRecommendation: 'Schedule vegetation clearance and OHE tension calibration.'
    },
    {
      id: 'TRK-14',
      code: 'JH-DGH-SHB',
      from: 'DGHR',
      to: 'SHBG',
      name: 'Deoghar – Sahetganj',
      status: 'good',
      healthScore: 89,
      length: '85 km',
      lastInspection: '10 Sep 2026',
      nextDue: '10 Oct 2026',
      issues: ['Well-maintained continuous welded rail (CWR)'],
      aiRecommendation: 'Maintain routine ultrasonic flaw detection (USFD) schedule.'
    },
    {
      id: 'TRK-15',
      code: 'JH-SHB-PAK',
      from: 'SHBG',
      to: 'PAKR',
      name: 'Sahetganj – Pakur',
      status: 'good',
      healthScore: 85,
      length: '44 km',
      lastInspection: '08 Sep 2026',
      nextDue: '08 Oct 2026',
      issues: ['Minor sand drifting on embankment'],
      aiRecommendation: 'Erect wind barrier fence near riverbank corridor.'
    },
    {
      id: 'TRK-16',
      code: 'JH-PAK-JMT',
      from: 'PAKR',
      to: 'JMTR',
      name: 'Pakur – Jamtara',
      status: 'good',
      healthScore: 81,
      length: '76 km',
      lastInspection: '07 Sep 2026',
      nextDue: '07 Oct 2026',
      issues: ['Standard wear on turnout points'],
      aiRecommendation: 'Schedule point machine lubrication next week.'
    },
    {
      id: 'TRK-17',
      code: 'JH-JMT-DHN',
      from: 'JMTR',
      to: 'DHN',
      name: 'Jamtara – Dhanbad',
      status: 'critical',
      healthScore: 35,
      length: '53 km',
      lastInspection: '02 Sep 2026',
      nextDue: '16 Sep 2026',
      issues: ['Subgrade subsidence near mining zone', 'Track cant irregularity'],
      aiRecommendation: 'Geo-technical survey and ballast deep screening required immediately.'
    },
    {
      id: 'TRK-18',
      code: 'JH-RNC-DHN',
      from: 'RNC',
      to: 'DHN',
      name: 'Ranchi – Dhanbad',
      status: 'moderate',
      healthScore: 68,
      length: '132 km',
      lastInspection: '05 Sep 2026',
      nextDue: '25 Sep 2026',
      issues: ['Track geometry deviation', 'Sleeper deterioration', 'Drainage congestion (2 locations)'],
      aiRecommendation: 'Schedule tamping within 3 weeks. Monitor km 56–62 closely.'
    },
    {
      id: 'TRK-19',
      code: 'JH-RNC-RMG',
      from: 'RNC',
      to: 'RMGR',
      name: 'Ranchi – Ramgarh',
      status: 'critical',
      healthScore: 39,
      length: '46 km',
      lastInspection: '04 Sep 2026',
      nextDue: '18 Sep 2026',
      issues: ['Ghat section curve gauge widening', 'Check rail wear exceeded tolerance'],
      aiRecommendation: 'Immediate check rail replacement and gauge adjustment.'
    },
    {
      id: 'TRK-20',
      code: 'JH-RMG-BOK',
      from: 'RMGR',
      to: 'BOKR',
      name: 'Ramgarh – Bokaro',
      status: 'moderate',
      healthScore: 72,
      length: '48 km',
      lastInspection: '09 Sep 2026',
      nextDue: '29 Sep 2026',
      issues: ['Coal dust fouling in ballast bed'],
      aiRecommendation: 'Schedule ballast cleaning machine (BCM) deployment.'
    },
    {
      id: 'TRK-21',
      code: 'JH-BOK-DHN',
      from: 'BOKR',
      to: 'DHN',
      name: 'Bokaro – Dhanbad',
      status: 'vulnerable',
      healthScore: 46,
      length: '38 km',
      lastInspection: '03 Sep 2026',
      nextDue: '17 Sep 2026',
      issues: ['High freight tonnage wear on outer high rail'],
      aiRecommendation: 'Rail grinding planned for next weekend block window.'
    },
    {
      id: 'TRK-22',
      code: 'JH-RMG-CHB',
      from: 'RMGR',
      to: 'CHBS',
      name: 'Ramgarh – Chaibasa',
      status: 'moderate',
      healthScore: 65,
      length: '115 km',
      lastInspection: '06 Sep 2026',
      nextDue: '26 Sep 2026',
      issues: ['Bridge approach settlement at bridge 84'],
      aiRecommendation: 'Pack ballast under transition slabs and verify pier stability.'
    }
  ];

  // Currently focused section details (defaults to Ranchi – Dhanbad as shown in reference)
  let activeSection = mapTracks.find(t => t.name === 'Ranchi – Dhanbad') || mapTracks[2];

  // --------------------------------------------------------------------------
  // 1.5 Vulnerability Zones Data (Far Right Card Top)
  // --------------------------------------------------------------------------
  const vulnerabilityZonesData = [
    {
      id: 1,
      title: 'Dhanbad – Kumardubi',
      subtitle: 'High risk • Track geometry deviation',
      severity: 'high',
      kmRange: 'Km 12–28',
      iconClass: 'fa-solid fa-triangle-exclamation'
    },
    {
      id: 2,
      title: 'Bokaro – Chandrapura',
      subtitle: 'Erosion prone • Monsoon risk',
      severity: 'medium',
      kmRange: 'Km 34–41',
      iconClass: 'fa-solid fa-triangle-exclamation'
    },
    {
      id: 3,
      title: 'Gomoh – Deoghar',
      subtitle: 'Vegetation encroachment',
      severity: 'medium',
      kmRange: 'Km 77–83',
      iconClass: 'fa-solid fa-triangle-exclamation'
    },
    {
      id: 4,
      title: 'Ranchi – Hatia',
      subtitle: 'Water logging prone',
      severity: 'low',
      kmRange: 'Km 8–15',
      iconType: 'water',
      iconClass: 'fa-solid fa-water'
    },
    {
      id: 5,
      title: 'Latehar – Daltonganj',
      subtitle: 'Stable section',
      severity: 'low',
      kmRange: 'Km 21–30',
      iconType: 'mountain',
      iconClass: 'fa-solid fa-mountain'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.6 Live Health Indicators Data (Far Right Card Bottom)
  // Circular gauge values and color classifications
  // --------------------------------------------------------------------------
  const liveHealthIndicatorsData = [
    { id: 'track', name: 'Track Condition', value: 68, colorClass: 'amber' },
    { id: 'signals', name: 'Signals & OHE Assets', value: 72, colorClass: 'teal' },
    { id: 'bridges', name: 'Bridges & Structures', value: 76, colorClass: 'green' },
    { id: 'drainage', name: 'Drainage System', value: 62, colorClass: 'red' }
  ];

  // --------------------------------------------------------------------------
  // 1.7 Network Health Overview Donut Data (Bottom Card 1)
  // --------------------------------------------------------------------------
  const donutOverviewData = {
    totalSections: 28,
    categories: [
      { label: 'Good (≥ 80)', count: 15, percent: 54, color: '#22C55E' },
      { label: 'Moderate (60 – 79)', count: 6, percent: 21, color: '#EAB308' },
      { label: 'Vulnerable (40 – 59)', count: 4, percent: 14, color: '#F97316' },
      { label: 'Critical (< 40)', count: 3, percent: 11, color: '#EF4444' },
      { label: 'Under Maintenance', count: 1, percent: 4, color: '#3B82F6' }
    ]
  };

  // --------------------------------------------------------------------------
  // 1.8 Top 5 Most Critical Sections Data (Bottom Card 2)
  // --------------------------------------------------------------------------
  const topCriticalSectionsData = [
    { rank: 1, code: 'JH-DHN-007', score: 32, status: 'Critical', statusClass: 'critical' },
    { rank: 2, code: 'JH-GMO-003', score: 36, status: 'Critical', statusClass: 'critical' },
    { rank: 3, code: 'JH-LTR-001', score: 41, status: 'Vulnerable', statusClass: 'vulnerable' },
    { rank: 4, code: 'JH-BOK-002', score: 46, status: 'Vulnerable', statusClass: 'vulnerable' },
    { rank: 5, code: 'JH-RNC-004', score: 52, status: 'Vulnerable', statusClass: 'vulnerable' }
  ];

  // --------------------------------------------------------------------------
  // 1.9 AI Insights & Recommendations Data (Bottom Card 3)
  // --------------------------------------------------------------------------
  const aiInsightsData = [
    {
      id: 1,
      type: 'purple',
      icon: 'fa-solid fa-bell',
      title: 'Monsoon Risk Alert',
      severityBadge: 'High',
      badgeClass: 'high',
      desc: '3 sections at high risk due to forecasted heavy rainfall (12–18 Sep).',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'green',
      icon: 'fa-solid fa-arrow-trend-up',
      title: 'Proactive Maintenance Opportunity',
      severityBadge: 'Medium',
      badgeClass: 'medium',
      desc: 'Schedule combined block for Ranchi – Hatia – Asansol (cost savings ~18%).',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'blue',
      icon: 'fa-solid fa-lightbulb',
      title: 'Resource Optimization',
      severityBadge: 'Low',
      badgeClass: 'low',
      desc: 'Reallocate P-Way team from Simdega after 15 Sep.',
      time: '6 hours ago'
    }
  ];

  // --------------------------------------------------------------------------
  // 1.10 Shared Profile, Notifications, Sidebar & Footer Data
  // --------------------------------------------------------------------------
  const userProfileData = {
    name: 'Rajesh',
    role: 'Team ThinkSync',
    avatarText: 'HS',
    unreadAlertCount: 3
  };

  const notificationsData = [
    { id: 1, type: 'danger', icon: 'fa-triangle-exclamation', title: 'High Risk Track Geometry', desc: 'JH-DHN-007 risk score escalated to 87.', time: '10 mins ago' },
    { id: 2, type: 'warning', icon: 'fa-box-open', title: 'Resource Shortage Detected', desc: 'Ballast Tamping Machine required for JH-BOK-002.', time: '1 hour ago' },
    { id: 3, type: 'info', icon: 'fa-route', title: 'Freight Schedule Trigger', desc: 'Freight 18625 delay recalculated block window.', time: '2 hours ago' }
  ];

  const sidebarTrainCardData = {
    badgeText: 'Better Planning',
    subText: 'Safer Journeys',
    trainImage: 'https://images.unsplash.com/photo-1532103054090-a33923a78210?auto=format&fit=crop&w=400&q=80'
  };

  const footerData = {
    mottoQuote: '“Optimizing today for a safer, stronger tomorrow.”',
    links: [
      { label: 'Indian Railways', url: '#' },
      { label: 'Smart Infrastructure', url: '#' },
      { label: 'Connected India', url: '#' },
      { label: 'ThinkSync', url: '#' }
    ]
  };

  /* ==========================================================================
     PART 2: DEFENSIVE PROGRAMMING & FALLBACK HELPERS
     Ensures that if any dataset is missing, null, or empty, a clean 'Not Found'
     view is rendered inside the existing container without breaking page layout.
     ========================================================================== */
  
  /**
   * Generates a defensive 'Not Found' HTML element for missing data
   * @param {string} entityName - Name of the data entity that wasn't found
   * @param {string} customMsg - Optional specific message
   * @returns {string} Clean HTML string of the fallback card
   */
  function createNotFoundPlaceholder(entityName = 'Data', customMsg = '') {
    const msg = customMsg || `No ${entityName} records found in Jharkhand telemetry database.`;
    return `
      <div class="not-found-container" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem; text-align:center; min-height:120px; width:100%; color:#64748B;">
        <i class="fa-solid fa-magnifying-glass-chart" style="font-size:1.8rem; color:#94A3B8; margin-bottom:0.5rem; opacity:0.8;"></i>
        <h4 style="font-size:0.88rem; font-weight:700; color:#334155; margin:0 0 0.2rem 0;">Not Found: ${entityName}</h4>
        <p style="font-size:0.72rem; color:#64748B; margin:0; max-width:280px;">${msg}</p>
      </div>
    `;
  }

  /* ==========================================================================
     PART 3: VIEW RENDERERS (DYNAMIC DOM INJECTION)
     Functions that translate the data arrays into clean HTML / SVG components.
     ========================================================================== */

  // --------------------------------------------------------------------------
  // 3.1 Render Map Subheader & Filter Toolbar
  // --------------------------------------------------------------------------
  function renderMapSubheader() {
    const container = document.getElementById('map-subheader-container');
    if (!container) return;

    if (!subHeaderData || !subHeaderData.title) {
      container.innerHTML = createNotFoundPlaceholder('Subheader Controls');
      return;
    }

    const networkOptions = (subHeaderData.networkViews || [])
      .map(v => `<option value="${v}">${v}</option>`)
      .join('');

    const timeOptions = (subHeaderData.timeRanges || [])
      .map(t => `<option value="${t}">${t}</option>`)
      .join('');

    container.innerHTML = `
      <div class="map-subheader-left">
        <div class="map-page-icon">
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="map-page-title-group">
          <h2>${subHeaderData.title}</h2>
          <p>${subHeaderData.subtitle}</p>
        </div>
      </div>

      <div class="map-subheader-right">
        <!-- Network View Dropdown -->
        <div class="sub-control-group">
          <label class="sub-control-label" for="network-view-select">Network View</label>
          <select id="network-view-select" class="sub-select" aria-label="Select Network Division">
            ${networkOptions}
          </select>
        </div>

        <!-- Time Range Dropdown -->
        <div class="sub-control-group">
          <label class="sub-control-label" for="time-range-select">Time Range</label>
          <select id="time-range-select" class="sub-select" aria-label="Select Time Range">
            ${timeOptions}
          </select>
        </div>

        <!-- Live Status & Refresh Button -->
        <div class="live-status-pill">
          <span class="live-indicator-dot" aria-hidden="true"></span>
          <div class="live-status-text">
            <span class="live-text-title">● Live Data</span>
            <span class="live-text-sub" id="live-time-display">Last updated: ${subHeaderData.lastUpdatedText}</span>
          </div>
          <button class="refresh-action-btn" id="refresh-telemetry-btn" title="Refresh Live Health Data" aria-label="Refresh telemetry data">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 3.2 Render Top 5 Health KPI Cards Row
  // --------------------------------------------------------------------------
  function renderHealthKpis() {
    const container = document.getElementById('health-kpi-container');
    if (!container) return;

    if (!Array.isArray(healthKpisData) || healthKpisData.length === 0) {
      container.innerHTML = createNotFoundPlaceholder('Health KPI Metrics');
      return;
    }

    container.innerHTML = healthKpisData.map(kpi => `
      <article class="health-kpi-card" id="kpi-card-${kpi.id}">
        <div class="kpi-icon-box ${kpi.colorClass}">
          ${kpi.iconSvg ? kpi.iconSvg : `<i class="${kpi.iconClass}"></i>`}
        </div>
        <div class="kpi-content">
          <span class="kpi-label">${kpi.title}</span>
          <div class="kpi-value-row">
            <span class="kpi-num">${kpi.value}</span>
            <span class="kpi-trend ${kpi.trendClass}">${kpi.trend}</span>
          </div>
          <span class="kpi-subtext">${kpi.subtext}</span>
        </div>
      </article>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 3.3 Render Map Legend Filter Pills
  // --------------------------------------------------------------------------
  function renderMapLegend() {
    const legendBar = document.getElementById('map-legend-bar');
    if (!legendBar) return;

    const legends = [
      { id: 'all', label: 'All Corridors', dotClass: '' },
      { id: 'good', label: 'Good (≥ 80)', dotClass: 'good' },
      { id: 'moderate', label: 'Moderate (60 – 79)', dotClass: 'moderate' },
      { id: 'vulnerable', label: 'Vulnerable (40 – 59)', dotClass: 'vulnerable' },
      { id: 'critical', label: 'Critical (< 40)', dotClass: 'critical' },
      { id: 'maintenance', label: 'Under Maintenance', dotClass: 'maintenance' }
    ];

    legendBar.innerHTML = legends.map((leg, idx) => `
      <button class="legend-pill ${idx === 0 ? 'active-filter' : ''}" data-filter="${leg.id}">
        ${leg.dotClass ? `<span class="legend-dot ${leg.dotClass}"></span>` : ''}
        <span>${leg.label}</span>
      </button>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 3.4 Render Jharkhand Railway Health Map (Coming Soon Deployment Screen)
  // Per user instruction: Same rule as Page 1 — Displays professional 'Coming Soon'
  // telemetry deployment screen instead of SVG map canvas
  // --------------------------------------------------------------------------
  function renderRailwayMap() {
    // 1. Status ribbon banner
    const legendContainer = document.getElementById('map-legend-container');
    if (legendContainer) {
      legendContainer.innerHTML = `
        <span class="legend-item" style="color:#D97706; font-weight:600; font-size:0.68rem; display:inline-flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-satellite-dish"></i> 
          Satellite GIS &amp; Track Sensor Telemetry Integration Underway &bull; Phase 2 Deployment
        </span>
      `;
    }

    // 2. Coming Soon Viewport Presentation
    const wrapper = document.getElementById('map-canvas-wrapper');
    if (wrapper) {
      wrapper.innerHTML = `
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
  // 3.5 Render Active Section Details Panel
  // --------------------------------------------------------------------------
  function renderSectionDetails(section = activeSection) {
    const card = document.getElementById('section-details-card');
    if (!card) return;

    if (!section || !section.name) {
      card.innerHTML = createNotFoundPlaceholder('Section Details');
      return;
    }

    const issuesList = (section.issues || [])
      .map(issue => `<li>${issue}</li>`)
      .join('');

    const statusBadgeClass = section.status || 'moderate';
    const statusLabel = section.status ? (section.status.charAt(0).toUpperCase() + section.status.slice(1)) : 'Unknown';

    card.innerHTML = `
      <div class="details-header">
        <h3 class="card-title">Section Details</h3>
        <a href="#view-all-sections" class="card-link" id="link-view-all-sections">View All &rarr;</a>
      </div>

      <div class="details-meta-grid">
        <div class="meta-row">
          <span class="meta-row-label">Section</span>
          <span class="meta-row-val">${section.name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-row-label">Section Code</span>
          <span class="meta-row-val mono">${section.code}</span>
        </div>
        <div class="meta-row">
          <span class="meta-row-label">Length</span>
          <span class="meta-row-val mono">${section.length}</span>
        </div>
        <div class="meta-row">
          <span class="meta-row-label">Current Health</span>
          <span class="health-status-badge ${statusBadgeClass}">
            <span class="legend-dot ${statusBadgeClass}"></span>
            ${statusLabel} (${section.healthScore})
          </span>
        </div>
        <div class="meta-row">
          <span class="meta-row-label">Last Inspection</span>
          <span class="meta-row-val">${section.lastInspection}</span>
        </div>
        <div class="meta-row">
          <span class="meta-row-label">Next Due</span>
          <span class="meta-row-val">${section.nextDue}</span>
        </div>
      </div>

      <div class="key-issues-section">
        <h4 class="issues-title">Key Issues</h4>
        <ul class="issues-list">
          ${issuesList.length > 0 ? issuesList : '<li style="color:#16A34A;">No critical defects recorded</li>'}
        </ul>
      </div>

      <div class="ai-rec-banner">
        <div class="ai-rec-icon">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div class="ai-rec-text">
          <h5>AI Recommendation</h5>
          <p>${section.aiRecommendation || 'Continue routine track telemetry monitoring.'}</p>
        </div>
      </div>

      <button class="btn-create-task" id="btn-create-maintenance-task" data-section-code="${section.code}">
        <i class="fa-solid fa-plus"></i> Create Maintenance Task &rarr;
      </button>
    `;

    // Connect modal trigger to the new button
    const createTaskBtn = document.getElementById('btn-create-maintenance-task');
    if (createTaskBtn) {
      createTaskBtn.addEventListener('click', () => {
        openTaskModal(section);
      });
    }

    const viewAllLink = document.getElementById('link-view-all-sections');
    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Viewing full division section inventory...', 'info');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3.6 Render Vulnerability Zones List (Far Right Top)
  // --------------------------------------------------------------------------
  function renderVulnerabilityZones() {
    const card = document.getElementById('vuln-zones-card');
    if (!card) return;

    if (!Array.isArray(vulnerabilityZonesData) || vulnerabilityZonesData.length === 0) {
      card.innerHTML = createNotFoundPlaceholder('Vulnerability Zones');
      return;
    }

    const itemsMarkup = vulnerabilityZonesData.map(zone => {
      let iconColorClass = zone.severity;
      if (zone.iconType === 'water') iconColorClass = 'low-water';
      if (zone.iconType === 'mountain') iconColorClass = 'low-mountain';

      return `
        <div class="vuln-item" data-zone-id="${zone.id}">
          <div class="vuln-icon ${iconColorClass}">
            <i class="${zone.iconClass}"></i>
          </div>
          <div class="vuln-info">
            <h4 class="vuln-title">${zone.title}</h4>
            <p class="vuln-sub">${zone.subtitle}</p>
          </div>
          <div class="vuln-badges">
            <span class="vuln-level-badge ${zone.severity}">${zone.severity.charAt(0).toUpperCase() + zone.severity.slice(1)}</span>
            <span class="vuln-km-badge">${zone.kmRange}</span>
          </div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.45rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Vulnerability Zones</h3>
        <a href="#view-all-zones" class="card-link" id="link-view-all-zones">View All &rarr;</a>
      </div>
      <div class="vuln-list">
        ${itemsMarkup}
      </div>
    `;

    // Click handler for zones
    card.querySelectorAll('.vuln-item').forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('.vuln-title')?.textContent;
        showToast(`Inspecting vulnerability zone: ${title}`, 'info');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3.7 Render Live Health Indicators Gauges (Far Right Bottom)
  // --------------------------------------------------------------------------
  function renderHealthIndicators() {
    const card = document.getElementById('health-indicators-card');
    if (!card) return;

    if (!Array.isArray(liveHealthIndicatorsData) || liveHealthIndicatorsData.length === 0) {
      card.innerHTML = createNotFoundPlaceholder('Health Indicators');
      return;
    }

    const radius = 22;
    const circumference = 2 * Math.PI * radius; // ~138.23

    const gaugesMarkup = liveHealthIndicatorsData.map(ind => {
      const offset = circumference - (ind.value / 100) * circumference;

      return `
        <div class="gauge-item">
          <div class="gauge-circle-wrap">
            <svg class="gauge-svg" viewBox="0 0 52 52">
              <circle class="gauge-track" cx="26" cy="26" r="${radius}" />
              <circle 
                class="gauge-progress ${ind.colorClass}" 
                cx="26" cy="26" r="${radius}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${offset}" 
              />
            </svg>
            <div class="gauge-center-text">${ind.value}</div>
          </div>
          <span class="gauge-lbl">${ind.name}</span>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.45rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Live Health Indicators</h3>
        <a href="#trends" class="card-link" id="link-view-health-trends">View Trends &rarr;</a>
      </div>
      <div class="gauges-grid">
        ${gaugesMarkup}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 3.8 Render Network Health Overview Donut Chart (Bottom Card 1)
  // --------------------------------------------------------------------------
  function renderDonutChart() {
    const card = document.getElementById('network-donut-card');
    if (!card) return;

    if (!donutOverviewData || !Array.isArray(donutOverviewData.categories)) {
      card.innerHTML = createNotFoundPlaceholder('Network Overview Donut');
      return;
    }

    const radius = 42;
    const circumference = 2 * Math.PI * radius; // ~263.89
    let accumulatedPercent = 0;

    const arcsMarkup = donutOverviewData.categories.map(cat => {
      const strokeLength = (cat.percent / 100) * circumference;
      const strokeOffset = circumference - strokeLength;
      const rotation = (accumulatedPercent / 100) * 360;
      accumulatedPercent += cat.percent;

      return `
        <circle 
          cx="60" cy="60" r="${radius}"
          fill="none" 
          stroke="${cat.color}" 
          stroke-width="14" 
          stroke-dasharray="${strokeLength} ${circumference}"
          transform="rotate(${rotation} 60 60)"
        />
      `;
    }).join('');

    const legendMarkup = donutOverviewData.categories.map(cat => `
      <div class="donut-legend-item">
        <div class="legend-left">
          <span class="legend-dot" style="background:${cat.color}"></span>
          <span>${cat.label}</span>
        </div>
        <div class="legend-right">
          ${cat.count} (${cat.percent}%)
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.55rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Network Health Overview</h3>
        <select class="sub-select" style="padding:0.2rem 0.5rem; font-size:0.68rem;" aria-label="Donut metric display">
          <option>Section Count</option>
          <option>Percentage</option>
          <option>Route KM</option>
        </select>
      </div>

      <div class="donut-content-layout">
        <div class="donut-chart-box">
          <svg class="donut-svg" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="${radius}" fill="none" class="donut-bg-track" stroke-width="14" />
            ${arcsMarkup}
          </svg>
          <div class="donut-center-label">
            <span class="donut-center-num">${donutOverviewData.totalSections}</span>
            <span class="donut-center-sub">Sections</span>
          </div>
        </div>

        <div class="donut-legend-list">
          ${legendMarkup}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 3.9 Render Top 5 Most Critical Sections Table (Bottom Card 2)
  // --------------------------------------------------------------------------
  function renderCriticalSectionsTable() {
    const card = document.getElementById('critical-sections-card');
    if (!card) return;

    if (!Array.isArray(topCriticalSectionsData) || topCriticalSectionsData.length === 0) {
      card.innerHTML = createNotFoundPlaceholder('Critical Sections Table');
      return;
    }

    const rowsMarkup = topCriticalSectionsData.map(row => {
      const scoreClass = row.score < 40 ? 'red' : 'orange';
      return `
        <tr data-section-code="${row.code}" style="cursor:pointer;">
          <td style="color:#64748B; font-weight:700;">${row.rank}</td>
          <td class="crit-sec-code">${row.code}</td>
          <td class="crit-score ${scoreClass}">${row.score}</td>
          <td>
            <span class="status-badge-pill ${row.statusClass}">
              ${row.status}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.55rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">Top 5 Most Critical Sections</h3>
        <a href="#view-all-critical" class="card-link" id="link-view-all-critical">View All &rarr;</a>
      </div>

      <div style="overflow-x:auto;">
        <table class="crit-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Section</th>
              <th>Health Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      </div>
    `;

    // Row click listeners to highlight and focus section
    card.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const code = tr.getAttribute('data-section-code');
        const matched = mapTracks.find(t => t.code === code);
        if (matched) {
          activeSection = matched;
          renderSectionDetails(matched);
          renderRailwayMap();
          showToast(`Focused on critical section: ${matched.name} (${code})`, 'warning');
        } else {
          showToast(`Section ${code} details loaded from database.`, 'info');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3.10 Render AI Insights & Recommendations (Bottom Card 3)
  // --------------------------------------------------------------------------
  function renderAiInsights() {
    const card = document.getElementById('ai-insights-card');
    if (!card) return;

    if (!Array.isArray(aiInsightsData) || aiInsightsData.length === 0) {
      card.innerHTML = createNotFoundPlaceholder('AI Insights & Recommendations');
      return;
    }

    const itemsMarkup = aiInsightsData.map(insight => `
      <div class="insight-item" data-insight-id="${insight.id}">
        <div class="insight-icon-box ${insight.type}">
          <i class="${insight.icon}"></i>
        </div>
        <div class="insight-body">
          <div class="insight-header-row">
            <h4 class="insight-title">${insight.title}</h4>
            <span class="insight-badge ${insight.badgeClass}">${insight.severityBadge}</span>
          </div>
          <p class="insight-desc">${insight.desc}</p>
        </div>
        <span class="insight-time">${insight.time}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="card-header" style="padding:0 0 0.55rem 0; border-bottom: 1px solid var(--border-color);">
        <h3 class="card-title">AI Insights &amp; Recommendations</h3>
        <a href="#view-all-insights" class="card-link" id="link-view-all-insights">View All &rarr;</a>
      </div>

      <div class="insights-list">
        ${itemsMarkup}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 3.11 Render Sidebar Bottom Train Banner & Application Footer
  // --------------------------------------------------------------------------
  function renderSidebarAndFooter() {
    // 1. Sidebar Train Banner
    const trainCard = document.getElementById('sidebar-train-card');
    if (trainCard && sidebarTrainCardData) {
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

    // 2. Footer Quote and Links
    const quoteContainer = document.getElementById('footer-quote-container');
    const linksContainer = document.getElementById('footer-links-container');

    if (quoteContainer && footerData.mottoQuote) {
      quoteContainer.textContent = footerData.mottoQuote;
    }

    if (linksContainer && Array.isArray(footerData.links)) {
      linksContainer.innerHTML = footerData.links
        .map(link => `<a href="${link.url}">${link.label}</a>`)
        .join('');
    }

    // 3. Top Header User Info
    const userContainer = document.getElementById('user-profile-container');
    if (userContainer) {
      userContainer.innerHTML = `
        <div class="user-avatar" title="${userProfileData.name} - ${userProfileData.role}">${userProfileData.avatarText}</div>
        <div class="user-info">
          <span class="user-name">${userProfileData.name}</span>
          <span class="user-role">${userProfileData.role}</span>
        </div>
        <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // 3.12 Render Header Notifications List
  // --------------------------------------------------------------------------
  function renderNotifications() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const badge = document.getElementById('header-notif-badge');
    if (badge) {
      const count = Array.isArray(notificationsData) ? notificationsData.length : 0;
      badge.textContent = count;
      badge.style.display = count > 0 ? '' : 'none';
    }

    if (!Array.isArray(notificationsData) || notificationsData.length === 0) {
      list.innerHTML = `<div style="padding:1rem; text-align:center; color:#94A3B8; font-size:0.75rem;">No new notifications</div>`;
      return;
    }

    list.innerHTML = notificationsData.map(n => `
      <div class="notif-item" style="display:flex; gap:0.6rem; padding:0.6rem 0.8rem; border-bottom:1px solid #F1F5F9; font-size:0.75rem;">
        <i class="fa-solid ${n.icon}" style="color:${n.type === 'danger' ? '#EF4444' : '#F59E0B'}; font-size:0.9rem; margin-top:2px;"></i>
        <div>
          <strong style="display:block; color:#0F172A; font-size:0.75rem;">${n.title}</strong>
          <span style="display:block; color:#64748B; font-size:0.7rem;">${n.desc}</span>
          <small style="color:#94A3B8; font-size:0.65rem;">${n.time}</small>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     PART 4: INTERACTIVE CONTROLLER & EVENT LISTENERS
     Handles clicks, filtering, search, map selection, modals, and toasts.
     ========================================================================== */

  // --------------------------------------------------------------------------
  // Sidebar collapse/expand is centrally managed by theme-sync.js

  // --------------------------------------------------------------------------
  // 4.2 Notify Button for Coming Soon Map
  // --------------------------------------------------------------------------
  const notifyMapBtn = document.getElementById('notify-map-btn');
  if (notifyMapBtn) {
    notifyMapBtn.addEventListener('click', () => {
      showToast('You will be notified when the Live Railway Health Map goes live!', 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 4.3 Attach Interactive Click & Hover Listeners to Map Corridors & Stations
  // --------------------------------------------------------------------------
  function attachMapInteractionListeners() {
    // Corridor line clicks (active when SVG map is loaded)
    const trackLines = document.querySelectorAll('.rail-track-line');
    trackLines.forEach(line => {
      line.addEventListener('click', (e) => {
        const group = e.target.closest('.track-group');
        if (!group) return;
        const trackId = group.getAttribute('data-track-id');
        const selected = mapTracks.find(t => t.id === trackId);
        if (selected) {
          activeSection = selected;
          renderSectionDetails(selected);
          showToast(`Selected Corridor: ${selected.name} (${selected.code})`, 'info');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4.3 Legend Filter Buttons Handling
  // --------------------------------------------------------------------------
  const legendBar = document.getElementById('map-legend-bar');
  if (legendBar) {
    legendBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.legend-pill');
      if (!btn) return;

      legendBar.querySelectorAll('.legend-pill').forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');

      const filterVal = btn.getAttribute('data-filter') || 'all';
      renderRailwayMap(filterVal);
      showToast(`Filter applied: ${btn.textContent.trim()}`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 4.4 Map Station / Section Search Box Filter
  // --------------------------------------------------------------------------
  const mapSearchInput = document.getElementById('map-search-input');
  if (mapSearchInput) {
    mapSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        renderRailwayMap('all');
        return;
      }

      // Find matching corridor or station
      const matched = mapTracks.find(t => 
        t.name.toLowerCase().includes(q) || 
        t.code.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q)
      );

      if (matched) {
        activeSection = matched;
        renderSectionDetails(matched);
        renderRailwayMap('all');
        // Highlight track
        const el = document.querySelector(`[data-track-id="${matched.id}"] .rail-track-line`);
        if (el) el.classList.add('selected');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4.5 Live Data Refresh Button (Simulated Live Telemetry Pull)
  // --------------------------------------------------------------------------
  const refreshBtn = document.getElementById('refresh-telemetry-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spinning');
      setTimeout(() => {
        refreshBtn.classList.remove('spinning');
        const now = new Date();
        const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                        now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        
        const liveTimeDisplay = document.getElementById('live-time-display');
        if (liveTimeDisplay) {
          liveTimeDisplay.textContent = `Last updated: ${timeStr}`;
        }
        showToast('Live railway sensor telemetry synced successfully!', 'success');
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 4.6 Map UI Controls (Zoom In, Zoom Out, Reset, Fullscreen)
  // --------------------------------------------------------------------------
  let currentZoom = 1;
  const zoomInBtn = document.getElementById('map-zoom-in');
  const zoomOutBtn = document.getElementById('map-zoom-out');
  const resetBtn = document.getElementById('map-reset-view');
  const fullscreenBtn = document.getElementById('map-fullscreen-btn');

  function applyMapZoom(factor) {
    const svg = document.getElementById('rail-map-svg');
    if (!svg) return;
    currentZoom = Math.max(0.7, Math.min(2.2, factor));
    svg.style.transform = `scale(${currentZoom})`;
    svg.style.transition = 'transform 0.25s ease';
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => applyMapZoom(currentZoom + 0.2));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => applyMapZoom(currentZoom - 0.2));
  if (resetBtn) resetBtn.addEventListener('click', () => {
    applyMapZoom(1);
    showToast('Map viewport reset to default division overview', 'info');
  });

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const mapCard = document.querySelector('.map-view-card');
      if (mapCard) {
        if (!document.fullscreenElement) {
          mapCard.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4.7 Create Maintenance Task Modal Handlers
  // --------------------------------------------------------------------------
  const taskModal = document.getElementById('task-modal');
  const taskModalCloseBtn = document.getElementById('modal-task-close-btn');
  const taskModalCancelBtn = document.getElementById('modal-task-cancel-btn');
  const taskModalSubmitBtn = document.getElementById('modal-task-submit-btn');

  function openTaskModal(section) {
    if (!taskModal) return;
    const body = document.getElementById('modal-task-body');
    if (body) {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.85rem; font-size:0.78rem;">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:0.65rem 0.85rem;">
            <div style="font-weight:700; color:#0F172A; font-size:0.85rem;">${section.name} (${section.code})</div>
            <div style="color:#64748B; font-size:0.72rem; margin-top:0.2rem;">Length: ${section.length} • Current Health: ${section.healthScore}/100 [${section.status.toUpperCase()}]</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <label style="font-weight:700; color:#334155;">Task Category</label>
            <select id="modal-task-category" style="padding:0.4rem 0.6rem; border-radius:4px; border:1px solid #CBD5E1; font-size:0.76rem;">
              <option>Track Geometry Tamping & Alignment</option>
              <option>Deep Ballast Screening & Packing</option>
              <option>Continuous Welded Rail (CWR) De-stressing</option>
              <option>OHE Catenary Wire Re-tensioning</option>
              <option>Ultrasonic Flaw Detection (USFD) Inspection</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
            <div style="display:flex; flex-direction:column; gap:0.25rem;">
              <label style="font-weight:700; color:#334155;">Requested Block Window</label>
              <input type="time" value="02:30" style="padding:0.4rem 0.6rem; border-radius:4px; border:1px solid #CBD5E1; font-size:0.76rem;">
            </div>
            <div style="display:flex; flex-direction:column; gap:0.25rem;">
              <label style="font-weight:700; color:#334155;">Duration (Hours)</label>
              <input type="number" value="3.5" min="1" max="8" step="0.5" style="padding:0.4rem 0.6rem; border-radius:4px; border:1px solid #CBD5E1; font-size:0.76rem;">
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <label style="font-weight:700; color:#334155;">Special Work Notes / AI Diagnostic</label>
            <textarea style="padding:0.4rem 0.6rem; border-radius:4px; border:1px solid #CBD5E1; font-size:0.76rem; height:60px; resize:none;">${section.aiRecommendation}</textarea>
          </div>
        </div>
      `;
    }
    taskModal.classList.add('active');
  }

  function closeTaskModal() {
    if (taskModal) taskModal.classList.remove('active');
  }

  if (taskModalCloseBtn) taskModalCloseBtn.addEventListener('click', closeTaskModal);
  if (taskModalCancelBtn) taskModalCancelBtn.addEventListener('click', closeTaskModal);
  if (taskModal) {
    taskModal.addEventListener('click', (e) => {
      if (e.target === taskModal) closeTaskModal();
    });
  }

  if (taskModalSubmitBtn) {
    taskModalSubmitBtn.addEventListener('click', () => {
      closeTaskModal();
      showToast('Maintenance task submitted to Divisional Control Room!', 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 4.8 Header Notifications Dropdown Toggle
  // --------------------------------------------------------------------------
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.remove('active');
      }
    });

    const markAllRead = document.getElementById('mark-all-read');
    if (markAllRead) {
      markAllRead.addEventListener('click', () => {
        const badge = document.getElementById('header-notif-badge');
        if (badge) badge.style.display = 'none';
        showToast('All notifications marked as read', 'info');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4.9 Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    if (type === 'danger') icon = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 4.10 Initialize Everything on Page Load
  // --------------------------------------------------------------------------
  function init() {
    renderMapSubheader();
    renderHealthKpis();
    renderMapLegend();
    renderRailwayMap('all');
    renderSectionDetails(activeSection);
    renderVulnerabilityZones();
    renderHealthIndicators();
    renderDonutChart();
    renderCriticalSectionsTable();
    renderAiInsights();
    renderSidebarAndFooter();
    renderNotifications();
  }

  // Execute initialization
  init();


  // Live FastAPI bridge: updates KPI summary + critical table from /api/health-map.
  window.setHealthMapData = function(items) {
    if (!Array.isArray(items)) return;
    const counts = items.reduce((acc, item) => {
      const status = String(item.health_status || 'Moderate').toLowerCase();
      if (status.includes('critical')) acc.critical += 1;
      else if (status.includes('healthy') || status.includes('good')) acc.healthy += 1;
      else acc.moderate += 1;
      return acc;
    }, { healthy: 0, moderate: 0, critical: 0 });

    const byId = Object.fromEntries(healthKpisData.map((x) => [x.id, x]));
    if (byId.total) { byId.total.value = items.length; byId.total.subtext = 'Live Jharkhand sections from MongoDB'; }
    if (byId.healthy) { byId.healthy.value = counts.healthy; byId.healthy.subtext = `${items.length ? Math.round((counts.healthy/items.length)*100) : 0}% of network`; }
    if (byId.moderate) { byId.moderate.value = counts.moderate; byId.moderate.subtext = `${items.length ? Math.round((counts.moderate/items.length)*100) : 0}% of network`; }
    if (byId.critical) { byId.critical.value = counts.critical; byId.critical.subtext = `${items.length ? Math.round((counts.critical/items.length)*100) : 0}% of network`; }

    const sorted = [...items].sort((a, b) => Number(b.avg_risk_score || 0) - Number(a.avg_risk_score || 0)).slice(0, 5);
    topCriticalSectionsData.splice(0, topCriticalSectionsData.length, ...sorted.map((item, i) => ({
      rank: i + 1,
      code: item.section_id,
      score: Math.max(0, Math.round(100 - Number(item.avg_risk_score || 0))),
      status: item.health_status || 'Moderate',
      statusClass: String(item.health_status || 'vulnerable').toLowerCase().includes('critical') ? 'critical' : 'vulnerable'
    })));

    renderHealthKpis();
    renderCriticalSectionsTable();
    showToast(`Health map synchronized with ${items.length} backend sections`, 'info');
  };

})();
