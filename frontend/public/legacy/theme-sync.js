/**
 * ==============================================================================
 * INDIAN RAILWAYS - JHARKHAND DIVISION
 * GLOBAL THEME & ACCESSIBILITY SYNCHRONIZER (theme-sync.js)
 * Author: Team ThinkSync
 * ==============================================================================
 * 
 * Synchronizes Dark Mode, Light Mode, and System Theme preferences instantly
 * across all 10 application pages (Dashboard, Map, Calendar, Tasks, Movements,
 * Resources, Optimization, Reports, Alerts, and Settings) via localStorage.
 * 
 * Features:
 *  1. Zero-FOUC (Flash of Unstyled Content) immediate head evaluation.
 *  2. Zero-Jitter / Zero-Jump immediate sidebar dock evaluation in <head>.
 *  3. Universal centralized Sidebar Collapse/Expand controller.
 *  4. Real-time multi-tab cross-page storage event synchronization.
 *  5. Dynamic OS prefers-color-scheme media query listening.
 *  6. Seamless URL query support (?theme=dark, ?theme=light) for previewing.
 * ==============================================================================
 */

(function () {
  'use strict';

  var THEME_KEY = 'railway_app_theme';
  var COMPACT_KEY = 'railway_compact_sidebar';

  /**
   * Evaluates effective theme ('dark' or 'light') based on user choice or OS preference
   */
  function getEffectiveTheme(preference) {
    if (preference === 'system') {
      var isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemDark ? 'dark' : 'light';
    }
    return preference === 'light' ? 'light' : 'dark';
  }

  /**
   * Applies the theme across the DOM
   */
  function applyGlobalTheme(customTheme) {
    var storedPreference = 'dark';
    try {
      if (customTheme) {
        storedPreference = customTheme;
        localStorage.setItem(THEME_KEY, customTheme);
      } else if (window.location && window.location.search) {
        var urlParams = new URLSearchParams(window.location.search);
        var queryTheme = urlParams.get('theme');
        if (queryTheme && (queryTheme === 'dark' || queryTheme === 'light' || queryTheme === 'system')) {
          localStorage.setItem(THEME_KEY, queryTheme);
          storedPreference = queryTheme;
        } else {
          storedPreference = localStorage.getItem(THEME_KEY) || 'dark';
        }
      } else {
        storedPreference = localStorage.getItem(THEME_KEY) || 'dark';
      }
    } catch (e) {
      storedPreference = 'dark';
    }

    var effectiveTheme = getEffectiveTheme(storedPreference);

    // Apply to html element immediately
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Apply to body element if available
    if (document.body) {
      if (effectiveTheme === 'dark') {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
      }
    }
  }

  /**
   * Universal Sidebar Collapse / Expand Controller
   * Synchronizes html, body, #sidebar, #sidebar-toggle-btn icon/attributes, and localStorage
   */
  function setSidebarCollapsed(collapsed, syncStorage) {
    var isCollapsed = !!collapsed;

    if (syncStorage !== false) {
      try {
        localStorage.setItem(COMPACT_KEY, isCollapsed ? 'true' : 'false');
      } catch (e) {}
    }

    // Synchronize HTML element (prevents layout shift on navigation)
    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed');
    } else {
      document.documentElement.classList.remove('sidebar-collapsed');
    }

    // Synchronize Body element
    if (document.body) {
      if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
    }

    // Synchronize Sidebar DOM element
    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (isCollapsed) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }

    // Synchronize Hamburger Toggle Button
    var toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
      toggleBtn.setAttribute('title', isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar');
      var icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isCollapsed ? 'fa-solid fa-bars-staggered' : 'fa-solid fa-bars';
      }
    }

    // Dispatch custom event for in-page synchronizers (such as Settings toggle switch)
    try {
      window.dispatchEvent(new CustomEvent('railway_sidebar_changed', { detail: { collapsed: isCollapsed } }));
    } catch (e) {}

    return isCollapsed;
  }

  /**
   * Toggles the current sidebar state
   */
  function toggleSidebar() {
    var currentlyCollapsed = document.documentElement.classList.contains('sidebar-collapsed') ||
      (document.body && document.body.classList.contains('sidebar-collapsed'));
    return setSidebarCollapsed(!currentlyCollapsed, true);
  }

  // ============================================================================
  // 1. Immediate Execution in <head>
  // Prevents both theme FOUC and sidebar jumping/moving during page load
  // ============================================================================
  // Guard transitions during load so sidebar renders at exact target width instantly
  document.documentElement.classList.add('preload-sidebar');

  applyGlobalTheme();

  var initCompact = false;
  try {
    initCompact = localStorage.getItem(COMPACT_KEY) === 'true';
  } catch (e) {}

  if (initCompact) {
    document.documentElement.classList.add('sidebar-collapsed');
  } else {
    document.documentElement.classList.remove('sidebar-collapsed');
  }

  // ============================================================================
  // 2. DOM Ready Hydration
  // ============================================================================
  function hydrateDOM() {
    applyGlobalTheme();

    var currentCompact = false;
    try {
      currentCompact = localStorage.getItem(COMPACT_KEY) === 'true';
    } catch (e) {}

    setSidebarCollapsed(currentCompact, false);

    // Release preload transition guard after first paint so user clicks animate smoothly
    if (window.requestAnimationFrame) {
      requestAnimationFrame(function () {
        setTimeout(function () {
          document.documentElement.classList.remove('preload-sidebar');
        }, 60);
      });
    } else {
      document.documentElement.classList.remove('preload-sidebar');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateDOM);
  } else {
    hydrateDOM();
  }

  // ============================================================================
  // 3. Global Delegated Click Listener for Hamburger Button (All 10 Pages)
  // Ensures uniform behavior and persistence across all pages without duplicate listeners
  // ============================================================================
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#sidebar-toggle-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    var isCollapsed = toggleSidebar();

    if (typeof window.showToast === 'function') {
      window.showToast(isCollapsed ? 'Sidebar collapsed to icon dock' : 'Sidebar expanded', 'info');
    } else if (typeof window.showToastNotification === 'function') {
      window.showToastNotification(isCollapsed ? 'Sidebar collapsed to icon dock' : 'Sidebar expanded', 'info');
    }
  }, true); // Capture phase to prevent double-toggling from individual legacy handlers

  // ============================================================================
  // 4. Multi-Tab & Cross-Window Storage Event Listener
  // ============================================================================
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) {
      applyGlobalTheme();
    }
    if (e.key === COMPACT_KEY) {
      setSidebarCollapsed(e.newValue === 'true', false);
    }
  });

  // ============================================================================
  // 5. In-Page Theme Change Listener
  // ============================================================================
  window.addEventListener('themechange', function () {
    applyGlobalTheme();
  });

  // ============================================================================
  // 6. OS System Theme Preference Change Listener
  // ============================================================================
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      var currentPref = 'dark';
      try {
        currentPref = localStorage.getItem(THEME_KEY);
      } catch (e) {}
      if (currentPref === 'system') {
        applyGlobalTheme('system');
      }
    });
  }

  // ============================================================================
  // 7. Expose Global Helpers
  // ============================================================================
  window.applyGlobalTheme = applyGlobalTheme;
  window.getEffectiveTheme = getEffectiveTheme;
  window.setSidebarCollapsed = setSidebarCollapsed;
  window.toggleSidebar = toggleSidebar;

})();
