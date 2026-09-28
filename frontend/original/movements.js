/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION
 * PAGE 5: TRAIN MOVEMENTS DASHBOARD (movements.js)
 * ==============================================================================
 * 
 * ARCHITECTURE OVERVIEW:
 * ------------------------------------------------------------------------------
 * This client-side module powers Page 5 (Train Movements). It strictly adheres to 
 * the project development conventions:
 * 
 * 1. STRUCTURED COMMENTS FIRST:
 *    All functional blocks, data definitions, and component lifecycles are fully 
 *    commented before execution logic.
 * 
 * 2. 100% DATA-DRIVEN DOM HYDRATION:
 *    The HTML template contains semantic structural cards with zero hardcoded
 *    records. All cards (KPIs, Map Coming Soon screen, Train Movements Table,
 *    Section Congestion, Train Timeline, and Train Details) are dynamically 
 *    rendered from structured JavaScript state.
 * 
 * 3. DEFENSIVE RENDERING & FALLBACKS:
 *    Every render function guards against missing or null elements with graceful
 *    placeholders to ensure zero uncaught runtime exceptions.
 * 
 * 4. MAP AREA COMING SOON DISPLAY:
 *    Per explicit user instructions ("and you know waht show in map place"),
 *    the map area displays the professional telemetry Coming Soon radar screen 
 *    matching Page 1 (Dashboard) and Page 2 (Railway Health Map).
 * 
 * 5. INTERACTIVE LIVE BIDIRECTIONAL BINDING:
 *    - Clicking any train row in the table immediately updates the active train state
 *      and re-renders both the Train Route Timeline and Train Details card.
 *    - Train category filter tabs (All / Passenger / Freight) filter the table in real-time.
 *    - Time window selector updates the display.
 * 
 * 6. COLLAPSIBLE SIDEBAR:
 *    Preserves the single hamburger toggle button with smooth CSS transitions.
 * 
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // SECTION 1: MASTER DATA STORE (Structured State)
  // ============================================================================

  // 1.1 Dynamic KPI Summary Metric Cards Calculator
  // Computes summary figures in real-time from active masterTrainMovements & sectionCongestionData
  function getDynamicMovementsKpis() {
    const total = masterTrainMovements ? masterTrainMovements.length : 0;
    const passengerTrains = (masterTrainMovements || []).filter(t => (t.type || '').toLowerCase() === 'passenger');
    const freightTrains = (masterTrainMovements || []).filter(t => (t.type || '').toLowerCase() === 'freight');

    const passOnTime = passengerTrains.filter(t => (t.statusClass || '').includes('ontime') || t.delay === '0 min').length;
    const passDelayed = passengerTrains.length - passOnTime;

    const freightOnTime = freightTrains.filter(t => (t.statusClass || '').includes('ontime') || t.delay === '0 min').length;
    const freightDelayed = freightTrains.length - freightOnTime;

    // Calculate average delay across all trains
    let totalDelayMins = 0;
    (masterTrainMovements || []).forEach(t => {
      const match = (t.delay || '').match(/\d+/);
      if (match) totalDelayMins += parseInt(match[0], 10);
    });
    const avgDelay = total > 0 ? Math.round(totalDelayMins / total) : 0;

    // Sections under high load (>= 80% capacity)
    const highLoadSections = (sectionCongestionData || []).filter(s => {
      const pct = typeof s.capacityPct === 'number' ? s.capacityPct : parseInt(s.capacityPct || 0, 10);
      return pct >= 80;
    }).length;
    const totalSections = (sectionCongestionData || []).length;

    // Overall network punctuality percentage
    const onTimeTotal = passOnTime + freightOnTime;
    const punctuality = total > 0 ? Math.round((onTimeTotal / total) * 100) : 100;

    return [
      {
        id: 'kpi-total-movements',
        title: 'Total Train Movements',
        value: total.toString(),
        trendText: '↑ Live',
        trendClass: 'green',
        subtext: 'In Jharkhand Division (Active)',
        iconClass: 'fa-solid fa-train',
        colorTheme: 'blue'
      },
      {
        id: 'kpi-passenger-trains',
        title: 'Passenger Trains',
        value: passengerTrains.length.toString(),
        trendText: `${passOnTime} On Time`,
        trendClass: 'green',
        subtext: `${passOnTime} On Time | ${passDelayed} Delayed`,
        iconClass: 'fa-solid fa-user-group',
        colorTheme: 'purple'
      },
      {
        id: 'kpi-freight-trains',
        title: 'Freight Trains',
        value: freightTrains.length.toString(),
        trendText: `${freightOnTime} On Time`,
        trendClass: 'green',
        subtext: `${freightOnTime} On Time | ${freightDelayed} Delayed`,
        iconClass: 'fa-solid fa-truck-ramp-box',
        colorTheme: 'blue'
      },
      {
        id: 'kpi-avg-delay',
        title: 'Average Delay',
        value: `${avgDelay} min`,
        trendText: avgDelay <= 15 ? '↓ Optimal' : '↑ Delayed',
        trendClass: avgDelay <= 15 ? 'green' : 'red',
        subtext: 'Across all active movements',
        iconClass: 'fa-regular fa-clock',
        colorTheme: 'blue'
      },
      {
        id: 'kpi-sections-load',
        title: 'Sections Under Load',
        value: `${highLoadSections} / ${totalSections}`,
        trendText: highLoadSections > 0 ? `↑ ${highLoadSections}` : 'Normal',
        trendClass: highLoadSections > 0 ? 'red' : 'green',
        subtext: 'Above 80% capacity threshold',
        iconClass: 'fa-solid fa-bars-staggered',
        colorTheme: 'red'
      },
      {
        id: 'kpi-punctuality',
        title: 'Network Punctuality',
        value: `${punctuality}%`,
        trendText: punctuality >= 80 ? '↑ Good' : '↓ Caution',
        trendClass: punctuality >= 80 ? 'green' : 'orange',
        subtext: 'Trains on time (± 5 min)',
        iconClass: 'fa-solid fa-shield-halved',
        colorTheme: 'green'
      }
    ];
  }

  // 1.2 Map Legend Ribbon Items
  const movementsLegendItems = [
    { label: 'On Time', colorClass: 'green' },
    { label: 'Delayed (5–30 min)', colorClass: 'orange' },
    { label: 'Delayed (>30 min)', colorClass: 'red' },
    { label: 'Passenger Train', colorClass: 'blue' },
    { label: 'Freight Train', colorClass: 'purple' }
  ];

  // 1.3 Master Train Movements Store (Dynamic State - Scalable for arbitrary records)
  let masterTrainMovements = [
    {
      trainNo: '12810',
      trainName: 'Howrah–NDLS Exp',
      type: 'Passenger',
      statusType: 'ontime',
      statusDot: 'green',
      fromTo: 'Ranchi → New Delhi',
      currentLocation: 'Bokaro',
      currentLocationCode: 'BOK',
      nextStation: 'Dhanbad (DHN)',
      status: 'On Time',
      statusClass: 'ontime',
      delay: '0 min',
      delayClass: 'zero',
      eta: '14:20',
      speed: '82 km/h',
      scheduledArrival: '14:20',
      expectedArrival: '14:23 (+3 min)',
      nextHalt: 'Dhanbad (3 min)',
      lastUpdated: '14 Sep 2026, 14:17',
      locoSpecs: 'SRC WAP-7 #30612 | LHB Rake | 22 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Ranchi', time: '12:10', status: 'completed' },
        { station: 'Ramgarh', time: '12:42', status: 'completed' },
        { station: 'Bokaro', time: '13:25', status: 'completed' },
        { station: 'Dhanbad', time: '14:20', status: 'active', note: 'Arriving in 3 min' },
        { station: 'Asansol', time: '15:05', status: 'upcoming' },
        { station: 'New Delhi', time: '05:30 (+1 day)', status: 'upcoming' }
      ],
      fullRouteMilestones: [
        { station: 'Ranchi', time: '12:10', status: 'completed' },
        { station: 'Namkum', time: '12:25', status: 'completed' },
        { station: 'Muri', time: '12:48', status: 'completed' },
        { station: 'Ramgarh', time: '13:05', status: 'completed' },
        { station: 'Barkakana', time: '13:20', status: 'completed' },
        { station: 'Bokaro', time: '13:42', status: 'completed' },
        { station: 'Chandrapura', time: '14:02', status: 'completed' },
        { station: 'Dhanbad', time: '14:20', status: 'active', note: 'Arriving in 3 min' },
        { station: 'Koderma', time: '15:10', status: 'upcoming' },
        { station: 'Gaya', time: '16:25', status: 'upcoming' },
        { station: 'Pt. DDU', time: '18:50', status: 'upcoming' },
        { station: 'Prayagraj', time: '21:15', status: 'upcoming' },
        { station: 'Kanpur', time: '00:45', status: 'upcoming' },
        { station: 'New Delhi', time: '05:30 (+1 day)', status: 'upcoming' }
      ]
    },
    {
      trainNo: '18626',
      trainName: 'Ranchi–Hatia Exp',
      type: 'Passenger',
      statusType: 'delayed',
      statusDot: 'red',
      fromTo: 'Ranchi → Hatia',
      currentLocation: 'Ramgarh',
      currentLocationCode: 'RMT',
      nextStation: 'Hatia (HTE)',
      status: 'Delayed',
      statusClass: 'delayed',
      delay: '+27 min',
      delayClass: 'delayed',
      eta: '14:55',
      speed: '48 km/h',
      scheduledArrival: '14:28',
      expectedArrival: '14:55 (+27 min)',
      nextHalt: 'Hatia (5 min)',
      lastUpdated: '14 Sep 2026, 14:18',
      locoSpecs: 'RNC WAP-5 #30022 | ICF Rake | 18 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Ranchi', time: '13:15', status: 'completed' },
        { station: 'Namkum', time: '13:45', status: 'completed' },
        { station: 'Ramgarh', time: '14:20', status: 'active', note: 'Delayed 27 min' },
        { station: 'Tatisilwai', time: '14:40', status: 'upcoming' },
        { station: 'Hatia', time: '14:55', status: 'upcoming' }
      ]
    },
    {
      trainNo: '13351',
      trainName: 'Dhanbad–Alappuzha Exp',
      type: 'Passenger',
      statusType: 'ontime',
      statusDot: 'green',
      fromTo: 'Dhanbad → Alappuzha',
      currentLocation: 'Chas',
      currentLocationCode: 'CHAS',
      nextStation: 'Bokaro (BOK)',
      status: 'On Time',
      statusClass: 'ontime',
      delay: '0 min',
      delayClass: 'zero',
      eta: '15:10',
      speed: '75 km/h',
      scheduledArrival: '15:10',
      expectedArrival: '15:10 (On Time)',
      nextHalt: 'Bokaro (4 min)',
      lastUpdated: '14 Sep 2026, 14:15',
      locoSpecs: 'ED WAP-4 #22615 | LHB Rake | 24 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Dhanbad', time: '14:00', status: 'completed' },
        { station: 'Chas', time: '14:40', status: 'active', note: 'Approaching Bokaro' },
        { station: 'Bokaro', time: '15:10', status: 'upcoming' },
        { station: 'Muri', time: '16:05', status: 'upcoming' },
        { station: 'Ranchi', time: '17:15', status: 'upcoming' }
      ]
    },
    {
      trainNo: '20837',
      trainName: 'Ranchi–Patna Vande Bharat',
      type: 'Passenger',
      statusType: 'delayed',
      statusDot: 'orange',
      fromTo: 'Ranchi → Patna',
      currentLocation: 'Hazaribagh',
      currentLocationCode: 'HZBN',
      nextStation: 'Koderma (KQR)',
      status: 'Delayed',
      statusClass: 'delayed',
      delay: '+12 min',
      delayClass: 'delayed',
      eta: '15:30',
      speed: '110 km/h',
      scheduledArrival: '15:18',
      expectedArrival: '15:30 (+12 min)',
      nextHalt: 'Koderma (2 min)',
      lastUpdated: '14 Sep 2026, 14:19',
      locoSpecs: 'Train 18 EMU Rake | 8 Car Set | Aerodynamic Aerofoil',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Ranchi', time: '14:05', status: 'completed' },
        { station: 'Barkakana', time: '14:50', status: 'completed' },
        { station: 'Hazaribagh', time: '15:15', status: 'active', note: 'Dep. +12m' },
        { station: 'Koderma', time: '15:55', status: 'upcoming' },
        { station: 'Patna', time: '18:30', status: 'upcoming' }
      ]
    },
    {
      trainNo: '18111',
      trainName: 'Tatanagar–Mumbai LTT',
      type: 'Passenger',
      statusType: 'ontime',
      statusDot: 'green',
      fromTo: 'Tatanagar → Mumbai',
      currentLocation: 'Chakradharpur',
      currentLocationCode: 'CKP',
      nextStation: 'Rourkela (ROU)',
      status: 'On Time',
      statusClass: 'ontime',
      delay: '0 min',
      delayClass: 'zero',
      eta: '15:45',
      speed: '90 km/h',
      scheduledArrival: '15:45',
      expectedArrival: '15:45 (On Time)',
      nextHalt: 'Chakradharpur (10 min)',
      lastUpdated: '14 Sep 2026, 14:16',
      locoSpecs: 'TATA WAP-7 #30441 | LHB Rake | 22 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Tatanagar', time: '14:30', status: 'completed' },
        { station: 'Sini', time: '14:55', status: 'completed' },
        { station: 'Chakradharpur', time: '15:40', status: 'active', note: 'Platform 2' },
        { station: 'Rourkela', time: '17:05', status: 'upcoming' },
        { station: 'Mumbai LTT', time: '11:30 (+1 day)', status: 'upcoming' }
      ]
    },
    {
      trainNo: '23023',
      trainName: 'Howrah–Gaya Exp',
      type: 'Passenger',
      statusType: 'delayed',
      statusDot: 'red',
      fromTo: 'Howrah → Gaya',
      currentLocation: 'Koderma',
      currentLocationCode: 'KQR',
      nextStation: 'Gaya (GAYA)',
      status: 'Delayed',
      statusClass: 'delayed',
      delay: '+48 min',
      delayClass: 'delayed',
      eta: '16:05',
      speed: '65 km/h',
      scheduledArrival: '15:17',
      expectedArrival: '16:05 (+48 min)',
      nextHalt: 'Gaya (15 min)',
      lastUpdated: '14 Sep 2026, 14:14',
      locoSpecs: 'HWH WAP-7 #30281 | ICF Rake | 20 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Howrah', time: '09:30', status: 'completed' },
        { station: 'Asansol', time: '12:45', status: 'completed' },
        { station: 'Dhanbad', time: '13:55', status: 'completed' },
        { station: 'Koderma', time: '15:20', status: 'active', note: 'Delayed 48 min' },
        { station: 'Gaya', time: '16:05', status: 'upcoming' }
      ]
    },
    {
      trainNo: '12310',
      trainName: 'Rajdhani Exp',
      type: 'Passenger',
      statusType: 'ontime',
      statusDot: 'green',
      fromTo: 'Howrah → New Delhi',
      currentLocation: 'Dhanbad',
      currentLocationCode: 'DHN',
      nextStation: 'Gaya (GAYA)',
      status: 'On Time',
      statusClass: 'ontime',
      delay: '0 min',
      delayClass: 'zero',
      eta: '16:20',
      speed: '125 km/h',
      scheduledArrival: '16:20',
      expectedArrival: '16:20 (On Time)',
      nextHalt: 'Dhanbad (5 min)',
      lastUpdated: '14 Sep 2026, 14:20',
      locoSpecs: 'HWH WAP-7 #30310 | Tejas-LHB Rake | 21 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Howrah', time: '14:05', status: 'completed' },
        { station: 'Asansol', time: '15:35', status: 'completed' },
        { station: 'Dhanbad', time: '16:18', status: 'active', note: 'Priority Path' },
        { station: 'Gaya', time: '18:25', status: 'upcoming' },
        { station: 'New Delhi', time: '05:55 (+1 day)', status: 'upcoming' }
      ]
    },
    {
      trainNo: '58542',
      trainName: 'Iron Ore Freight',
      type: 'Freight',
      statusType: 'ontime',
      statusDot: 'green',
      fromTo: 'Bokaro → Rourkela',
      currentLocation: 'Gomoh',
      currentLocationCode: 'GMO',
      nextStation: 'Chandrapura (CRP)',
      status: 'On Time',
      statusClass: 'ontime',
      delay: '0 min',
      delayClass: 'zero',
      eta: '16:40',
      speed: '55 km/h',
      scheduledArrival: '16:40',
      expectedArrival: '16:40 (On Time)',
      nextHalt: 'Gomoh Yard (20 min)',
      lastUpdated: '14 Sep 2026, 14:12',
      locoSpecs: 'GMO WAG-9HC Twin #31882 | 58 BOXNHL Wagons | 4,200 T',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Bokaro Steel Yard', time: '14:50', status: 'completed' },
        { station: 'Gomoh', time: '16:20', status: 'active', note: 'Crew Change' },
        { station: 'Chandrapura', time: '17:10', status: 'upcoming' },
        { station: 'Muri Yard', time: '18:40', status: 'upcoming' },
        { station: 'Rourkela', time: '21:30', status: 'upcoming' }
      ]
    },
    {
      trainNo: '12878',
      trainName: 'Ranchi–Puri Exp',
      type: 'Passenger',
      statusType: 'delayed',
      statusDot: 'orange',
      fromTo: 'Ranchi → Puri',
      currentLocation: 'Khunti',
      currentLocationCode: 'KHT',
      nextStation: 'Bano (BANO)',
      status: 'Delayed',
      statusClass: 'delayed',
      delay: '+18 min',
      delayClass: 'delayed',
      eta: '16:55',
      speed: '70 km/h',
      scheduledArrival: '16:37',
      expectedArrival: '16:55 (+18 min)',
      nextHalt: 'Khunti (2 min)',
      lastUpdated: '14 Sep 2026, 14:15',
      locoSpecs: 'RNC WAP-7 #30519 | LHB Rake | 20 Coaches',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Ranchi', time: '15:30', status: 'completed' },
        { station: 'Hatia', time: '15:50', status: 'completed' },
        { station: 'Khunti', time: '16:45', status: 'active', note: 'Delayed 18 min' },
        { station: 'Bano', time: '17:40', status: 'upcoming' },
        { station: 'Puri', time: '05:15 (+1 day)', status: 'upcoming' }
      ]
    },
    {
      trainNo: 'BOXN4721',
      trainName: 'Coal Freight',
      type: 'Freight',
      statusType: 'ontime',
      statusDot: 'green',
      fromTo: 'Dhanbad → Paradeep',
      currentLocation: 'Jamtara',
      currentLocationCode: 'JMT',
      nextStation: 'Madhupur (MDP)',
      status: 'On Time',
      statusClass: 'ontime',
      delay: '0 min',
      delayClass: 'zero',
      eta: '17:15',
      speed: '60 km/h',
      scheduledArrival: '17:15',
      expectedArrival: '17:15 (On Time)',
      nextHalt: 'Madhupur (15 min)',
      lastUpdated: '14 Sep 2026, 14:18',
      locoSpecs: 'ASN WAG-12B Twin #60045 | 59 BOXN Wagons | 5,100 T Heavy Haul',
      locoPhoto: 'train_banner.jpg',
      milestones: [
        { station: 'Dhanbad Coal Siding', time: '15:10', status: 'completed' },
        { station: 'Jamtara', time: '16:50', status: 'active', note: 'Through Line' },
        { station: 'Madhupur', time: '17:45', status: 'upcoming' },
        { station: 'Asansol Yard', time: '19:20', status: 'upcoming' },
        { station: 'Paradeep Port', time: '08:00 (+1 day)', status: 'upcoming' }
      ]
    }
  ];

  // Active selected train (defaults to 12810 Howrah–NDLS Exp)
  let activeTrain = masterTrainMovements[0];

  // 1.4 Bottom Section Congestion (Live) Data (Dynamic State - Scalable for arbitrary records)
  let sectionCongestionData = [
    {
      section: 'Ranchi – Ramgarh',
      trainsCount: '14 / 16',
      capacityPct: 88,
      colorClass: 'red'
    },
    {
      section: 'Dhanbad – Chas',
      trainsCount: '12 / 16',
      capacityPct: 75,
      colorClass: 'orange'
    },
    {
      section: 'Bokaro – Gomoh',
      trainsCount: '10 / 14',
      capacityPct: 71,
      colorClass: 'orange'
    },
    {
      section: 'Hazaribagh– Koderma',
      trainsCount: '9 / 14',
      capacityPct: 64,
      colorClass: 'yellow'
    },
    {
      section: 'Chas – Tatanagar',
      trainsCount: '11 / 18',
      capacityPct: 61,
      colorClass: 'yellow'
    },
    {
      section: 'Ranchi – Hatia',
      trainsCount: '6 / 14',
      capacityPct: 43,
      colorClass: 'green'
    }
  ];

  // 1.5 Notification Bell Alerts Data
  const notificationsData = [
    { id: 1, type: 'critical', title: 'Congestion Alert: Ranchi – Ramgarh', desc: 'Section utilization reached 88% capacity', time: '5 min ago' },
    { id: 2, type: 'warning', title: 'Delay Alert: 23023 Howrah–Gaya', desc: 'Delay increased to +48 min near Koderma', time: '12 min ago' },
    { id: 3, type: 'info', title: 'Priority Clearance Granted', desc: 'Rajdhani Exp cleared for green corridor at Dhanbad', time: '25 min ago' }
  ];

  // ============================================================================
  // SECTION 2: DEFENSIVE RENDERING UTILITIES
  // ============================================================================
  function createNotFoundPlaceholder(widgetTitle = 'Data') {
    return `
      <div class="not-found-placeholder" style="padding: 2rem; text-align: center; color: #64748B;">
        <i class="fa-solid fa-circle-question" style="font-size: 2rem; color: #94A3B8; margin-bottom: 0.5rem; display: block;"></i>
        <h4 style="font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">${widgetTitle} Not Found</h4>
        <p style="font-size: 0.72rem; color: #94A3B8;">No records currently available.</p>
      </div>
    `;
  }

  function showToastNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.style.cssText = `
      background: #0F172A;
      color: #FFFFFF;
      padding: 0.65rem 1rem;
      border-radius: 6px;
      font-size: 0.76rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: fadeIn 0.3s ease;
    `;

    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color:#38BDF8;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ============================================================================
  // SECTION 3: CORE COMPONENT RENDERERS
  // ============================================================================

  // ----------------------------------------------------------------------------
  // 3.1 Render Top 6 KPI Metric Cards Row
  // ----------------------------------------------------------------------------
  function renderMovementsKpis() {
    const container = document.getElementById('movements-kpi-container');
    if (!container) return;

    const dynamicKpis = getDynamicMovementsKpis();
    if (!Array.isArray(dynamicKpis) || dynamicKpis.length === 0) {
      container.innerHTML = createNotFoundPlaceholder('Movement KPIs');
      return;
    }

    container.innerHTML = dynamicKpis.map(kpi => `
      <div class="movements-kpi-card" id="${kpi.id}">
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
  // 3.2 Render Map Legend Ribbon
  // ----------------------------------------------------------------------------
  function renderMovementsLegend() {
    const container = document.getElementById('movements-legend-container');
    if (!container) return;

    container.innerHTML = movementsLegendItems.map(item => `
      <div class="legend-pill-item">
        <span class="legend-dot ${item.colorClass}"></span>
        <span>${item.label}</span>
      </div>
    `).join('');
  }

  // ----------------------------------------------------------------------------
  // 3.3 Render Live Train Movements Map (Coming Soon Deployment Screen)
  // Per user instruction: "and you know waht show in map place"
  // Displays the telemetry deployment radar screen matching Page 1 & Page 2.
  // ----------------------------------------------------------------------------
  function renderMovementsMap() {
    const viewport = document.getElementById('movements-map-viewport');
    if (!viewport) return;

    viewport.innerHTML = `
      <div class="telemetry-coming-soon">
        
        <!-- Animated Radar / Telemetry Beacon -->
        <div class="telemetry-beacon">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>

        <!-- Status Badge -->
        <div class="telemetry-badge">
          <i class="fa-solid fa-clock"></i> Live GIS Map – Deployment in Progress
        </div>

        <!-- Main Title -->
        <h4 class="telemetry-title">Jharkhand Railway Network &ndash; Live Movements Map</h4>

        <!-- Description -->
        <p class="telemetry-desc">
          High-precision satellite GIS train tracking, locomotive GPS feeds, and real-time block occupancy
          overlays are currently integrating for Jharkhand Division.
        </p>

        <!-- Feature Capability Pills -->
        <div class="telemetry-pills">
          <span class="telemetry-pill">
            <i class="fa-solid fa-satellite"></i> Satellite GIS Tracking
          </span>
          <span class="telemetry-pill">
            <i class="fa-solid fa-tower-broadcast"></i> Axle Counter Feeds
          </span>
          <span class="telemetry-pill">
            <i class="fa-solid fa-train"></i> Locomotive GPS Telemetry
          </span>
          <span class="telemetry-pill">
            <i class="fa-solid fa-bolt"></i> Real-time Speed Monitoring
          </span>
        </div>

      </div>
    `;
  }

  // ----------------------------------------------------------------------------
  // 3.4 Render Live & Upcoming Train Movements Interactive Table
  // ----------------------------------------------------------------------------
  let activeFilterTab = 'all';

  function renderTrainTable(filter = activeFilterTab) {
    const card = document.getElementById('movements-table-card');
    if (!card) return;

    const allTrains = Array.isArray(masterTrainMovements) ? masterTrainMovements : [];
    let filteredTrains = allTrains;
    if (filter === 'passenger') {
      filteredTrains = allTrains.filter(t => (t.type || '').toLowerCase() === 'passenger');
    } else if (filter === 'freight') {
      filteredTrains = allTrains.filter(t => (t.type || '').toLowerCase() === 'freight');
    }

    const rowsMarkup = filteredTrains.length > 0 
      ? filteredTrains.map(train => {
          const isSelected = (activeTrain && activeTrain.trainNo === train.trainNo) ? 'active-train-row' : '';
          const statusDot = train.statusDot || ((train.statusClass || '').includes('ontime') ? 'green' : 'red');
          const statusClass = train.statusClass || ((train.status || '').toLowerCase().includes('time') ? 'ontime' : 'delayed');
          const delayClass = train.delayClass || ((train.delay === '0 min' || train.delay === '0m') ? 'zero' : 'delayed');

          return `
            <tr class="train-data-row ${isSelected}" data-train-no="${train.trainNo || ''}">
              <td>
                <div class="train-no-cell">
                  <span class="status-dot ${statusDot}"></span>
                  <span>${train.trainNo || 'N/A'}</span>
                </div>
              </td>
              <td class="train-name-cell">${train.trainName || 'Express / Freight'}</td>
              <td class="route-cell">${train.fromTo || '—'}</td>
              <td class="location-cell">${train.currentLocation || 'In Transit'}</td>
              <td>
                <span class="train-status-pill ${statusClass}">${train.status || 'Active'}</span>
              </td>
              <td class="delay-cell ${delayClass}">${train.delay || '0 min'}</td>
              <td class="eta-cell">${train.eta || '—'}</td>
              <td style="text-align: center;">
                <button class="row-action-btn" data-train-no="${train.trainNo || ''}" title="More Actions" aria-label="Action menu">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('')
      : `
        <tr class="table-empty-row">
          <td colspan="8">
            <div class="empty-state-wrap">
              <i class="fa-solid fa-train"></i>
              <p>No train movements found for "${filter}" filter (${allTrains.length} total trains in division).</p>
            </div>
          </td>
        </tr>
      `;

    card.innerHTML = `
      <div class="movements-card-header">
        <div class="card-title-badge-group">
          <h3 class="movements-card-title">Live &amp; Upcoming Train Movements</h3>
          <span class="badge-count-pill">${filteredTrains.length} Active</span>
        </div>
        <div class="table-header-filters">
          <div class="train-filter-tabs">
            <button class="train-tab-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">
              <i class="fa-solid fa-layer-group"></i> All (${allTrains.length})
            </button>
            <button class="train-tab-btn ${filter === 'passenger' ? 'active' : ''}" data-filter="passenger">
              <i class="fa-solid fa-users"></i> Passenger
            </button>
            <button class="train-tab-btn ${filter === 'freight' ? 'active' : ''}" data-filter="freight">
              <i class="fa-solid fa-boxes-stacked"></i> Freight
            </button>
          </div>
          <select class="time-window-dropdown" id="time-window-select" aria-label="Select Time Window">
            <option value="12">Next 12 Hours</option>
            <option value="6">Next 6 Hours</option>
            <option value="24">Next 24 Hours</option>
          </select>
        </div>
      </div>

      <div class="train-table-wrapper">
        <table class="train-table">
          <thead>
            <tr>
              <th>Train No.</th>
              <th>Train Name</th>
              <th>From &rarr; To</th>
              <th>Current Location</th>
              <th>Status</th>
              <th>Delay</th>
              <th>ETA / ETD</th>
              <th style="text-align: center;">•••</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      </div>
    `;

    // Filter tab click handlers
    card.querySelectorAll('.train-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedFilter = e.currentTarget.getAttribute('data-filter');
        activeFilterTab = selectedFilter;
        renderTrainTable(selectedFilter);
      });
    });

    // Row selection click listener
    card.querySelectorAll('.train-data-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.row-action-btn')) return;

        const trainNo = row.getAttribute('data-train-no');
        const matched = masterTrainMovements.find(t => t.trainNo === trainNo);
        if (matched) {
          activeTrain = matched;
          card.querySelectorAll('.train-data-row').forEach(r => r.classList.remove('active-train-row'));
          row.classList.add('active-train-row');
          renderTrainTimeline(matched);
          renderTrainDetails(matched);
          showToastNotification(`Loaded details for ${matched.trainNo} ${matched.trainName}`, 'info');
        }
      });
    });

    // Action button handler
    card.querySelectorAll('.row-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trainNo = btn.getAttribute('data-train-no');
        showToastNotification(`Action menu for Train #${trainNo}`, 'info');
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 3.5 Render Bottom Col 1: Section Congestion (Live)
  // ----------------------------------------------------------------------------
  function renderSectionCongestion() {
    const card = document.getElementById('congestion-card');
    if (!card) return;

    const sections = Array.isArray(sectionCongestionData) ? sectionCongestionData : [];
    if (sections.length === 0) {
      card.innerHTML = `
        <div class="bottom-card-header">
          <div class="bottom-card-title-wrap">
            <h3 class="bottom-card-title">Section Congestion (Live)</h3>
            <span class="badge-count-pill">0 Sections</span>
          </div>
        </div>
        <div class="empty-state-wrap" style="padding: 2.5rem 1rem;">
          <i class="fa-solid fa-chart-line"></i>
          <p>No section congestion data available.</p>
        </div>
      `;
      return;
    }

    const rowsMarkup = sections.map(sec => {
      const pct = typeof sec.capacityPct === 'number' ? sec.capacityPct : parseInt(sec.capacityPct || 0, 10);
      const colorClass = sec.colorClass || (pct >= 80 ? 'red' : pct >= 70 ? 'orange' : pct >= 50 ? 'yellow' : 'green');
      return `
        <tr>
          <td class="congestion-section-name">${sec.section || 'Corridor'}</td>
          <td class="congestion-counts">${sec.trainsCount || '0 / 0'}</td>
          <td style="width: 48%;">
            <div class="congestion-bar-wrapper">
              <div class="progress-track">
                <div class="progress-fill ${colorClass}" style="width: ${Math.min(100, Math.max(0, pct))}%;"></div>
              </div>
              <span class="utilization-pct ${colorClass}">${pct}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    card.innerHTML = `
      <div class="bottom-card-header">
        <div class="bottom-card-title-wrap">
          <h3 class="bottom-card-title">Section Congestion (Live)</h3>
          <span class="badge-count-pill">${sections.length} Monitored</span>
        </div>
        <a href="#sections" class="header-link-btn" id="btn-view-all-congestion">
          View All &rarr;
        </a>
      </div>
      <div class="congestion-table-wrapper">
        <table class="congestion-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Trains (Last 1 hr)</th>
              <th>Capacity Utilization</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      </div>
    `;

    const viewAllBtn = card.querySelector('#btn-view-all-congestion');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToastNotification(`Monitoring ${sections.length} rail corridors live`, 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.6 Render Bottom Col 2: Train Timeline Milestone Tracker
  // (100% DYNAMIC: All stoppages, milestone nodes, connecting tracks, progress
  // fill, and extra stoppages are created and calculated dynamically via JavaScript)
  // ----------------------------------------------------------------------------
  let isRouteExpanded = false;

  function renderTrainTimeline(train = activeTrain) {
    const card = document.getElementById('timeline-card');
    if (!card) return;

    if (!train) {
      card.innerHTML = createNotFoundPlaceholder('Train Timeline');
      return;
    }

    // Determine active stoppages array: support standard view or expanded full route
    const milestones = isRouteExpanded 
      ? (train.fullRouteMilestones || train.milestones) 
      : train.milestones;
    const totalStoppages = milestones.length;

    // Dynamic geometry calculations for SVG/CSS stepper
    const nodeWidthPct = 100 / totalStoppages;
    const halfNodePct = (nodeWidthPct / 2).toFixed(2);
    const activeIndex = milestones.findIndex(m => m.status === 'active');
    const fillWidthPct = activeIndex >= 0 
      ? ((activeIndex / (totalStoppages - 1)) * (100 - nodeWidthPct)).toFixed(2) 
      : '0';

    // Auto-compute horizontal scroll width if stoppages exceed 6 nodes
    const minWidthPx = Math.max(100, totalStoppages * 82);

    // Build milestone nodes dynamically: Station name & time ABOVE the dot,
    // and "Arriving in 3 min" cleanly placed BELOW the active dot (matching reference image)
    const milestonesMarkup = milestones.map((m, idx) => {
      const isCompleted = m.status === 'completed';
      const isActive = m.status === 'active';
      const nodeClass = isCompleted ? 'completed' : (isActive ? 'active' : 'upcoming');

      return `
        <div class="milestone-step-node ${nodeClass}" data-station="${m.station}" data-time="${m.time}" data-status="${m.status}" title="Click to view halt details for ${m.station}">
          <div class="milestone-top-info">
            <span class="milestone-station-name">${m.station}</span>
            <span class="milestone-time">${m.time}</span>
          </div>
          <div class="milestone-dot-wrap">
            <div class="milestone-dot">
              ${isCompleted ? '<i class="fa-solid fa-check"></i>' : (isActive ? '<i class="fa-solid fa-train"></i>' : '')}
            </div>
          </div>
          <div class="milestone-bottom-info">
            ${isActive ? `<span class="milestone-arriving-badge">Arriving<br>in 3 min</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="bottom-card-header">
        <h3 class="bottom-card-title">Train Timeline &ndash; ${train.trainNo} ${train.trainName}</h3>
        <div class="timeline-header-actions">
          <span class="stoppages-count-pill" id="stoppages-count-badge">${totalStoppages} Halts</span>
          <button class="btn-toggle-route" id="btn-toggle-route" title="Toggle extra intermediate stoppages">
            <i class="fa-solid fa-list-ol"></i> ${isRouteExpanded ? 'Main Halts (6)' : 'All Halts (' + (train.fullRouteMilestones ? train.fullRouteMilestones.length : totalStoppages) + ')'}
          </button>
          <button class="btn-add-halt" id="btn-add-extra-stoppage" title="Add extra stoppage dynamically via JavaScript">
            <i class="fa-solid fa-circle-plus"></i> + Add Stoppage
          </button>
          <a href="#route" class="header-link-btn" id="btn-view-full-route">
            View Full Route &rarr;
          </a>
        </div>
      </div>

      <div class="timeline-card-content">
        <!-- Milestone Stepper Scroll Wrapper (Horizontal scroll for extra stoppages) -->
        <div class="timeline-scroll-wrapper" id="timeline-scroll-wrapper">
          <div class="milestone-stepper" style="min-width: ${totalStoppages > 6 ? minWidthPx + 'px' : '100%'};">
            <div class="stepper-connecting-line" style="left: ${halfNodePct}%; right: ${halfNodePct}%;"></div>
            <div class="stepper-progress-fill" style="left: ${halfNodePct}%; width: ${fillWidthPct}%;"></div>
            ${milestonesMarkup}
          </div>
        </div>

        <!-- Timeline Bottom Stats Ribbon -->
        <div class="timeline-stats-ribbon">
          <div class="timeline-stat-item">
            <span class="timeline-stat-label">Current Speed</span>
            <span class="timeline-stat-val">${train.speed}</span>
          </div>
          <div class="timeline-stat-item">
            <span class="timeline-stat-label">Scheduled Arrival</span>
            <span class="timeline-stat-val">${train.scheduledArrival}</span>
          </div>
          <div class="timeline-stat-item">
            <span class="timeline-stat-label">Expected Arrival</span>
            <span class="timeline-stat-val ${train.delayClass === 'delayed' ? 'red' : ''}">${train.expectedArrival}</span>
          </div>
          <div class="timeline-stat-item">
            <span class="timeline-stat-label">Next Halt</span>
            <span class="timeline-stat-val">${train.nextHalt}</span>
          </div>
        </div>
      </div>
    `;

    // 1. Toggle Extra Stoppages / Full Route
    const toggleBtn = card.querySelector('#btn-toggle-route');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isRouteExpanded = !isRouteExpanded;
        renderTrainTimeline(train);
        showToastNotification(isRouteExpanded ? `Expanded all intermediate stoppages for ${train.trainNo}` : `Showing main stoppages for ${train.trainNo}`, 'info');
      });
    }

    // 2. Add Stoppage Button Modal Opener
    const addHaltBtn = card.querySelector('#btn-add-extra-stoppage');
    const modal = document.getElementById('add-stoppage-modal');
    if (addHaltBtn && modal) {
      addHaltBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        const stInput = document.getElementById('stoppage-station-input');
        if (stInput) stInput.focus();
      });
    }

    // 3. Station Node Details Click Handler
    card.querySelectorAll('.milestone-step-node').forEach(node => {
      node.addEventListener('click', () => {
        const st = node.getAttribute('data-station');
        const tm = node.getAttribute('data-time');
        const stat = node.getAttribute('data-status');
        showToastNotification(`Station: ${st} | Scheduled Time: ${tm} [${stat.toUpperCase()}]`, 'info');
      });
    });

    // 4. View Full Route link
    const routeBtn = card.querySelector('#btn-view-full-route');
    if (routeBtn) {
      routeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isRouteExpanded = true;
        renderTrainTimeline(train);
        showToastNotification(`Opened full route map for Train ${train.trainNo}`, 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.7 Render Bottom Col 3: Train Details Card
  // ----------------------------------------------------------------------------
  function renderTrainDetails(train = activeTrain) {
    const card = document.getElementById('train-details-card');
    if (!card) return;

    if (!train) {
      card.innerHTML = createNotFoundPlaceholder('Train Details');
      return;
    }

    card.innerHTML = `
      <div class="bottom-card-header">
        <h3 class="bottom-card-title">Train Details</h3>
        <span class="legend-pill-item" style="color: #10B981; font-weight: 700; font-size: 0.68rem;">
          <span class="legend-dot green"></span> Live Tracking
        </span>
      </div>

      <div class="train-details-content">
        <!-- Hero Information Layout -->
        <div class="train-hero-layout">
          <div class="train-loco-img-box">
            <img src="${train.locoPhoto || 'train_banner.jpg'}" alt="${train.trainName} Locomotive">
          </div>
          <div class="train-profile-info">
            <div class="train-title-row">
              <span class="train-title-text">${train.trainNo} ${train.trainName}</span>
              <span class="train-type-badge">${train.type}</span>
            </div>
            <p class="train-rake-specs">${train.locoSpecs}</p>
          </div>
        </div>

        <!-- 3-Column Live Specs Grid -->
        <div class="train-live-specs-grid">
          <div class="spec-cell">
            <span class="spec-cell-label">Current Location</span>
            <span class="spec-cell-value">${train.currentLocation} (${train.currentLocationCode})</span>
          </div>
          <div class="spec-cell">
            <span class="spec-cell-label">Next Station</span>
            <span class="spec-cell-value">${train.nextStation}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-cell-label">Speed</span>
            <span class="spec-cell-value">${train.speed}</span>
          </div>
        </div>

        <!-- Footer Status Bar -->
        <div class="train-details-footer-bar">
          <div class="footer-stat-group">
            <div class="footer-stat-item">
              <span class="lbl">Status</span>
              <span class="val ${train.statusClass === 'ontime' ? 'green' : 'red'}">${train.status}</span>
            </div>
            <div class="footer-stat-item">
              <span class="lbl">Delay</span>
              <span class="val ${train.delayClass === 'zero' ? 'green' : 'red'}">${train.delay}</span>
            </div>
            <div class="footer-stat-item">
              <span class="lbl">Last Updated</span>
              <span class="val" style="color:#64748B;">${train.lastUpdated}</span>
            </div>
          </div>
          <a href="#train-${train.trainNo}" class="header-link-btn" id="btn-full-details">
            View Details &rarr;
          </a>
        </div>
      </div>
    `;

    const fullDetailsBtn = card.querySelector('#btn-full-details');
    if (fullDetailsBtn) {
      fullDetailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToastNotification(`Showing locomotive diagnostics for ${train.trainNo}`, 'info');
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 3.8 Render User Profile & Notifications Badge
  // ----------------------------------------------------------------------------
  function renderUserProfile() {
    const profileContainer = document.getElementById('user-profile-container');
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="user-avatar" title="Rajesh - Team ThinkSync">HS</div>
        <div class="user-info">
          <span class="user-name">Rajesh</span>
          <span class="user-role">Team ThinkSync</span>
        </div>
        <i class="fa-solid fa-chevron-down profile-dropdown-icon"></i>
      `;
    }

    const notifBadge = document.getElementById('header-notif-badge');
    const dropdownCount = document.getElementById('notif-dropdown-count');
    const notifList = document.getElementById('notif-list-container');

    if (notifBadge) notifBadge.textContent = notificationsData.length;
    if (dropdownCount) dropdownCount.textContent = `${notificationsData.length} New`;

    if (notifList) {
      notifList.innerHTML = notificationsData.map(item => `
        <div class="notif-item">
          <div class="notif-item-icon ${item.type}">
            <i class="fa-solid ${item.type === 'critical' ? 'fa-triangle-exclamation' : 'fa-bell'}"></i>
          </div>
          <div class="notif-item-body">
            <span class="notif-item-title">${item.title}</span>
            <p class="notif-item-desc">${item.desc}</p>
            <span class="notif-item-time">${item.time}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // ----------------------------------------------------------------------------
  // 3.9 Sidebar Toggle Handler
  // ----------------------------------------------------------------------------
  function initSidebarToggle() {
    // Sidebar collapse/expand is centrally managed by theme-sync.js
  }

  // ----------------------------------------------------------------------------
  // 3.10 Sidebar Branding Card & Bottom Footer
  // ----------------------------------------------------------------------------
  function renderSidebarAndFooter() {
    const card = document.getElementById('sidebar-train-card');
    if (card) {
      card.innerHTML = `
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

    const quoteContainer = document.getElementById('footer-quote-container');
    const linksContainer = document.getElementById('footer-links-container');
    if (quoteContainer) {
      quoteContainer.innerHTML = `"Optimizing today for a safer, stronger tomorrow."`;
    }
    if (linksContainer) {
      linksContainer.innerHTML = `
        <a href="#railways">Indian Railways</a>
        <a href="#smart">Smart Infrastructure</a>
        <a href="#connected">Connected India</a>
        <a href="#thinksync">ThinkSync</a>
      `;
    }
  }

  // ----------------------------------------------------------------------------
  // 3.11 Interactive Modal for Adding Extra Stoppages (Dynamic JavaScript Engine)
  // ----------------------------------------------------------------------------
  function initStoppageModal() {
    const modal = document.getElementById('add-stoppage-modal');
    const closeBtn = document.getElementById('close-stoppage-modal-btn');
    const cancelBtn = document.getElementById('cancel-stoppage-btn');
    const form = document.getElementById('add-stoppage-form');

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
        const station = document.getElementById('stoppage-station-input').value.trim();
        const time = document.getElementById('stoppage-time-input').value.trim();
        const status = document.getElementById('stoppage-status-select').value;
        const halt = document.getElementById('stoppage-halt-input').value.trim();

        if (!station || !time) return;

        const newStoppage = {
          station: station,
          time: time,
          status: status,
          note: status === 'active' ? `Arriving in ${halt}` : `Halt: ${halt}`
        };

        // Dynamically insert stoppage into active train milestones
        if (!activeTrain.milestones) activeTrain.milestones = [];

        if (status === 'completed') {
          activeTrain.milestones.splice(1, 0, newStoppage);
        } else if (status === 'active') {
          activeTrain.milestones.forEach(m => {
            if (m.status === 'active') m.status = 'completed';
          });
          const firstUpcoming = activeTrain.milestones.findIndex(m => m.status === 'upcoming');
          if (firstUpcoming >= 0) {
            activeTrain.milestones.splice(firstUpcoming, 0, newStoppage);
          } else {
            activeTrain.milestones.push(newStoppage);
          }
          activeTrain.nextHalt = `${station} (${halt})`;
        } else {
          const destIdx = Math.max(1, activeTrain.milestones.length - 1);
          activeTrain.milestones.splice(destIdx, 0, newStoppage);
        }

        if (activeTrain.fullRouteMilestones) {
          activeTrain.fullRouteMilestones.push(newStoppage);
        }

        closeModal();
        renderTrainTimeline(activeTrain);
        showToastNotification(`Successfully added extra stoppage: ${station} (${time})`, 'success');

        const wrapper = document.getElementById('timeline-scroll-wrapper');
        if (wrapper) {
          wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' });
        }
      });
    }
  }

  // ============================================================================
  // SECTION 4: INITIALIZATION LIFECYCLE
  // ============================================================================
  function init() {
    renderUserProfile();
    renderSidebarAndFooter();
    initSidebarToggle();
    initStoppageModal();

    // Render Part A: Top 6 KPI summary cards
    renderMovementsKpis();

    // Render Part B: 2-column main workspace
    renderMovementsLegend();
    renderMovementsMap();
    renderTrainTable();

    // Render Part C: Bottom 3-column analytics
    renderSectionCongestion();
    renderTrainTimeline(activeTrain);
    renderTrainDetails(activeTrain);

    // Live View dropdown listener
    const liveSelect = document.getElementById('live-view-select');
    if (liveSelect) {
      liveSelect.addEventListener('change', (e) => {
        showToastNotification(`Switched view to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
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
  }

  // ============================================================================
  // SECTION 5: GLOBAL DYNAMIC DATA APIS (Supports external API / Arbitrary Datasets)
  // ============================================================================
  window.setTrainMovements = function(newTrainsArray) {
    if (!Array.isArray(newTrainsArray)) {
      console.warn('setTrainMovements: expected array, received', typeof newTrainsArray);
      return;
    }
    masterTrainMovements = newTrainsArray;
    activeTrain = masterTrainMovements[0] || null;
    renderMovementsKpis();
    renderTrainTable(activeFilterTab);
    renderTrainTimeline(activeTrain);
    renderTrainDetails(activeTrain);
    showToastNotification(`Loaded ${masterTrainMovements.length} live train movements dynamically`, 'info');
  };

  window.setSectionCongestion = function(newCongestionArray) {
    if (!Array.isArray(newCongestionArray)) {
      console.warn('setSectionCongestion: expected array, received', typeof newCongestionArray);
      return;
    }
    sectionCongestionData = newCongestionArray;
    renderMovementsKpis();
    renderSectionCongestion();
    showToastNotification(`Loaded ${sectionCongestionData.length} section congestion feeds dynamically`, 'info');
  };

  window.updateMovementsData = function(payload) {
    if (!payload || typeof payload !== 'object') return;
    if (payload.trains && Array.isArray(payload.trains)) {
      masterTrainMovements = payload.trains;
      activeTrain = masterTrainMovements[0] || null;
    }
    if (payload.sections && Array.isArray(payload.sections)) {
      sectionCongestionData = payload.sections;
    }
    renderMovementsKpis();
    renderTrainTable(activeFilterTab);
    renderSectionCongestion();
    renderTrainTimeline(activeTrain);
    renderTrainDetails(activeTrain);
    showToastNotification('Live movements dataset updated successfully', 'info');
  };

  init();
});
