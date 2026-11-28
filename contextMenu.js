/**
 * contextMenu.js — High-Tech Cyberpunk Custom Right-Click Context Menu
 * 
 * Features:
 *  - Replaces default context menu with custom portfolio-themed HUD
 *  - Viewport boundary collision detection (never overflows edges)
 *  - Fast navigation shortcuts with smooth scroll integration
 *  - Theme controls (Light/Dark toggle, Secret Purple protocol, Back to Top)
 *  - Copy & share actions (Page URL, Clean link, Developer email)
 *  - Developer enclave tools (Hidden Terminal launch, GitHub, LinkedIn, System specs)
 *  - Shift + Right-Click bypass for native browser menu access
 *  - Full keyboard accessibility (ArrowUp/Down, Enter, Space, Escape)
 *  - Theme synchronization (Dark, Light, Purple)
 */

(function () {
  'use strict';

  const GITHUB_URL = 'https://github.com/cyber-jabez';
  const LINKEDIN_URL = 'https://www.linkedin.com/in/jabez-gabrielraj-e/';
  const PORTFOLIO_URL = 'https://cyber-jabez.github.io/PORTFOLIO/';
  const DEVELOPER_EMAIL = 'jabezgabrielraj.e@gmail.com';

  let menuEl = null;
  let activeIndex = -1;
  let isMenuOpen = false;

  /**
   * HUD Feedback Toast
   */
  function showHUDToast(message, type = 'info') {
    let toast = document.getElementById('secretThemeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'secretThemeToast';
      document.body.appendChild(toast);
    }
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    toast.className = `secret-theme-toast visible ${theme === 'purple' ? 'theme-toast-purple' : 'theme-toast-standard'}`;
    toast.innerHTML = `<span class="toast-dot"></span><span>${message}</span><span class="toast-key">[HUD]</span>`;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2500);
  }

  /**
   * Smooth clipboard copy with fallback
   */
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showHUDToast(successMsg, 'success');
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showHUDToast(successMsg, 'success');
    } catch (e) {
      showHUDToast('FAILED TO COPY LINK', 'error');
    }
  }

  /**
   * Smooth scroll helper (uses Lenis / scrollToSection if available)
   */
  function navigateToSection(targetId) {
    closeContextMenu();

    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
    
    if (isIndexPage) {
      const el = document.querySelector(targetId);
      if (el) {
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(el, { offset: 0, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    // On subpages, navigate to index.html with target hash
    window.location.href = `index.html${targetId}`;
  }

  /**
   * Gather System Telemetry
   */
  function showSystemDiagnostics() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const theme = (document.documentElement.getAttribute('data-theme') || 'dark').toUpperCase();
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Multi-core';
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory}GB RAM` : '';
    const diag = `SYS_INFO // Viewport: ${w}x${h} • Mode: ${theme} • CPU: ${cores} ${ram}`.trim();
    showHUDToast(diag, 'info');
  }

  /**
   * Build Custom Context Menu DOM
   */
  function createContextMenuDOM() {
    if (document.getElementById('cyberContextMenu')) {
      return document.getElementById('cyberContextMenu');
    }

    const menu = document.createElement('div');
    menu.id = 'cyberContextMenu';
    menu.className = 'cyber-context-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('tabindex', '-1');

    menu.innerHTML = `
      <div class="ctx-header">
        <div class="ctx-header-title">
          <span class="ctx-pulse-dot"></span>
          <span class="ctx-title-text">ENCLAVE // QUICK ACCESS</span>
        </div>
        <span class="ctx-status-pill">SECURE</span>
      </div>

      <div class="ctx-body">
        <!-- Navigation Group -->
        <div class="ctx-group">
          <div class="ctx-group-label">// JUMP TO SECTION</div>
          <button type="button" class="ctx-item" data-action="nav" data-target="#hero" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            <span class="ctx-label">Overview & Hero</span>
            <span class="ctx-key">01</span>
          </button>
          <button type="button" class="ctx-item" data-action="nav" data-target="#about" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <span class="ctx-label">About & Specs</span>
            <span class="ctx-key">02</span>
          </button>
          <button type="button" class="ctx-item" data-action="nav" data-target="#experience" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </span>
            <span class="ctx-label">Experience Timeline</span>
            <span class="ctx-key">03</span>
          </button>
          <button type="button" class="ctx-item" data-action="nav" data-target="#projects" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </span>
            <span class="ctx-label">Security Projects</span>
            <span class="ctx-key">04</span>
          </button>
          <button type="button" class="ctx-item" data-action="nav" data-target="#skills" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9 3 3-3 3"/><path d="M15 15h.01"/></svg>
            </span>
            <span class="ctx-label">Arsenal & Skills</span>
            <span class="ctx-key">05</span>
          </button>
          <button type="button" class="ctx-item" data-action="nav" data-target="#contact" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span class="ctx-label">Secure Contact</span>
            <span class="ctx-key">06</span>
          </button>
        </div>

        <div class="ctx-divider"></div>

        <!-- Theme Controls Group -->
        <div class="ctx-group">
          <div class="ctx-group-label">// THEME & DISPLAY</div>
          <button type="button" class="ctx-item" data-action="toggle-theme" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
            </span>
            <span class="ctx-label" id="ctxToggleThemeText">Toggle Light/Dark Theme</span>
            <span class="ctx-key">Alt+T</span>
          </button>
          <button type="button" class="ctx-item ctx-purple-action" data-action="toggle-purple" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            <span class="ctx-label">Secret Purple Theme</span>
            <span class="ctx-key">Ctrl+Shift+A</span>
          </button>
          <button type="button" class="ctx-item" data-action="back-top" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            </span>
            <span class="ctx-label">Back to Top</span>
            <span class="ctx-key">▲</span>
          </button>
        </div>

        <div class="ctx-divider"></div>

        <!-- Copy & Link Actions Group -->
        <div class="ctx-group">
          <div class="ctx-group-label">// SHARE & CIPHER</div>
          <button type="button" class="ctx-item" data-action="copy-url" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </span>
            <span class="ctx-label">Copy Current URL</span>
            <span class="ctx-key">Copy</span>
          </button>
          <button type="button" class="ctx-item" data-action="copy-portfolio" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </span>
            <span class="ctx-label">Copy Share Link</span>
            <span class="ctx-key">Share</span>
          </button>
          <button type="button" class="ctx-item" data-action="copy-email" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <span class="ctx-label">Copy Developer Email</span>
            <span class="ctx-key">Email</span>
          </button>
        </div>

        <div class="ctx-divider"></div>

        <!-- Developer Enclave Group -->
        <div class="ctx-group">
          <div class="ctx-group-label">// DEVELOPER ENCLAVE</div>
          <button type="button" class="ctx-item ctx-terminal-item" data-action="launch-terminal" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            </span>
            <span class="ctx-label">Launch Hidden Terminal</span>
            <span class="ctx-key">Ctrl+Alt+T</span>
          </button>
          <button type="button" class="ctx-item" data-action="open-github" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </span>
            <span class="ctx-label">GitHub Repository</span>
            <span class="ctx-key">↗</span>
          </button>
          <button type="button" class="ctx-item" data-action="open-linkedin" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </span>
            <span class="ctx-label">LinkedIn Profile</span>
            <span class="ctx-key">↗</span>
          </button>
          <button type="button" class="ctx-item" data-action="diagnostics" role="menuitem">
            <span class="ctx-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </span>
            <span class="ctx-label">System Diagnostics</span>
            <span class="ctx-key">Telemetry</span>
          </button>
        </div>
      </div>

      <div class="ctx-footer">
        <span>[ESC] CLOSE</span>
        <span>[SHIFT+CLICK] NATIVE</span>
      </div>
    `;

    document.body.appendChild(menu);
    bindMenuEvents(menu);
    return menu;
  }

  /**
   * Position menu within viewport boundaries
   */
  function openContextMenu(x, y) {
    if (!menuEl) menuEl = createContextMenuDOM();

    // Update dynamic text (e.g. Current theme toggle label)
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeLabel = menuEl.querySelector('#ctxToggleThemeText');
    if (themeLabel) {
      themeLabel.textContent = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }

    // Reset active index
    activeIndex = -1;
    updateItemFocus();

    // Initial position to measure accurate dimensions
    menuEl.style.left = '-9999px';
    menuEl.style.top = '-9999px';
    menuEl.classList.add('visible');
    menuEl.setAttribute('aria-hidden', 'false');

    const menuWidth = menuEl.offsetWidth || 298;
    const menuHeight = menuEl.offsetHeight || 420;
    const margin = 10;

    let posX = x;
    let posY = y;

    // Check right edge
    if (posX + menuWidth > window.innerWidth - margin) {
      posX = window.innerWidth - menuWidth - margin;
    }
    if (posX < margin) posX = margin;

    // Check bottom edge
    if (posY + menuHeight > window.innerHeight - margin) {
      posY = window.innerHeight - menuHeight - margin;
    }
    if (posY < margin) posY = margin;

    menuEl.style.left = `${posX}px`;
    menuEl.style.top = `${posY}px`;
    isMenuOpen = true;

    // Focus menu element for keyboard capture
    menuEl.focus();
  }

  /**
   * Close menu
   */
  function closeContextMenu() {
    if (!isMenuOpen || !menuEl) return;
    menuEl.classList.remove('visible');
    menuEl.setAttribute('aria-hidden', 'true');
    isMenuOpen = false;
    activeIndex = -1;
  }

  /**
   * Keyboard focus navigation within menu
   */
  function getMenuItems() {
    return menuEl ? Array.from(menuEl.querySelectorAll('.ctx-item')) : [];
  }

  function updateItemFocus() {
    const items = getMenuItems();
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('focused');
        item.focus();
      } else {
        item.classList.remove('focused');
      }
    });
  }

  /**
   * Handle Action Selection
   */
  function handleAction(action, target) {
    switch (action) {
      case 'nav':
        if (target) navigateToSection(target);
        break;

      case 'toggle-theme':
        closeContextMenu();
        if (window.PortfolioTheme && typeof window.PortfolioTheme.toggle === 'function') {
          window.PortfolioTheme.toggle();
        }
        break;

      case 'toggle-purple':
        closeContextMenu();
        if (window.PortfolioTheme && typeof window.PortfolioTheme.togglePurple === 'function') {
          window.PortfolioTheme.togglePurple();
        }
        break;

      case 'back-top':
        closeContextMenu();
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        break;

      case 'copy-url':
        closeContextMenu();
        copyTextToClipboard(window.location.href, 'CURRENT URL COPIED TO CLIPBOARD');
        break;

      case 'copy-portfolio':
        closeContextMenu();
        copyTextToClipboard(PORTFOLIO_URL, 'CLEAN PORTFOLIO LINK COPIED');
        break;

      case 'copy-email':
        closeContextMenu();
        copyTextToClipboard(DEVELOPER_EMAIL, `EMAIL COPIED: ${DEVELOPER_EMAIL}`);
        break;

      case 'launch-terminal':
        closeContextMenu();
        if (window.cyberTerminal && typeof window.cyberTerminal.open === 'function') {
          window.cyberTerminal.open();
        } else {
          showHUDToast('TERMINAL HOTKEY: CTRL + ALT + T', 'info');
        }
        break;

      case 'open-github':
        closeContextMenu();
        window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
        break;

      case 'open-linkedin':
        closeContextMenu();
        window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer');
        break;

      case 'diagnostics':
        closeContextMenu();
        showSystemDiagnostics();
        break;

      default:
        closeContextMenu();
        break;
    }
  }

  /**
   * Bind DOM Events for Context Menu
   */
  function bindMenuEvents(menu) {
    // Click on items
    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.ctx-item');
      if (!item) return;
      e.stopPropagation();
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');
      handleAction(action, target);
    });

    // Keyboard navigation within menu
    menu.addEventListener('keydown', (e) => {
      const items = getMenuItems();
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        updateItemFocus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateItemFocus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < items.length) {
          items[activeIndex].click();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeContextMenu();
      }
    });
  }

  /**
   * Global Event Listeners
   */
  function initContextMenu() {
    // Intercept right-click (contextmenu)
    window.addEventListener('contextmenu', (e) => {
      // Allow native context menu if user holds Shift (power-user convention)
      if (e.shiftKey) return;

      // Allow native menu inside inputs and textareas so editing is never obstructed
      const target = e.target;
      if (target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      e.preventDefault();
      openContextMenu(e.clientX, e.clientY);
    }, { capture: true });

    // Dismiss context menu on click outside or pointer down
    window.addEventListener('pointerdown', (e) => {
      if (isMenuOpen && menuEl && !menuEl.contains(e.target)) {
        closeContextMenu();
      }
    });

    // Dismiss on scroll or window resize
    window.addEventListener('scroll', () => {
      if (isMenuOpen) closeContextMenu();
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (isMenuOpen) closeContextMenu();
    });

    // Dismiss on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeContextMenu();
      }
    });
  }

  // Self-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContextMenu);
  } else {
    initContextMenu();
  }

  // Expose API for external control
  window.PortfolioContextMenu = {
    open: openContextMenu,
    close: closeContextMenu,
    isOpen: () => isMenuOpen
  };
})();
