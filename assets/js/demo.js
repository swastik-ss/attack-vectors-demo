/*
 * Demo behaviour for the attack pages:
 *   - The floating info panel ("About this page") that explains the lure.
 *   - The benign lure actions: clipboard copy, placeholder download, consent.
 *   - The landing page: the vector grid and the theme toggle.
 *
 * There is deliberately no simulated warning and no simulated report here. The real extension
 * and the real console are the ones under test, so the pages only recreate the attack and
 * explain what to look for. Every action stays inert and nothing leaves the browser.
 */
(function () {
  'use strict';

  var REGISTRY = window.SEKANT_DEMO || { vectors: {}, groups: [] };
  var icons = REGISTRY.icons || {};

  var currentId = document.body.getAttribute('data-vector') || '';
  var ROOT = document.body.getAttribute('data-root') || '';

  /* ------------------------------ helpers ------------------------------ */

  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function toast(message) {
    var host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      document.body.appendChild(host);
    }
    var node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = icons.check ? icons.check : '';
    node.appendChild(document.createTextNode(message));
    host.appendChild(node);
    setTimeout(function () { node.style.opacity = '0'; }, 2600);
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 3000);
  }

  function getVector(id) {
    return REGISTRY.vectors[id] || null;
  }

  /* ------------------------------ floating info panel ------------------------------ */

  function panelMarkup(v) {
    var look = v.look.map(function (item) {
      return '<li><span class="mark">&#9873;</span><span><strong>' + esc(item.title) + '.</strong> ' + item.text + '</span></li>';
    }).join('');

    return (
      '<div class="vector-panel-overlay" id="vector-panel-overlay">' +
        '<div class="vp-backdrop" data-close-panel></div>' +
        '<aside class="vp-panel" role="dialog" aria-modal="true" aria-label="About this page">' +
          '<div class="vp-top">' +
            '<span class="vp-eyebrow">' + esc(v.eyebrow || 'Attack vector') + '</span>' +
            '<span class="spacer"></span>' +
            '<button type="button" class="vp-close" data-close-panel aria-label="Close">&#215;</button>' +
          '</div>' +
          '<div class="vp-body">' +
            '<h2>' + esc(v.name) + '</h2>' +
            '<p class="vp-summary">' + esc(v.summary) + '</p>' +
            '<div class="panel-card"><h4>What to look for</h4><ul>' + look + '</ul></div>' +
            '<div class="callout warn">' +
              '<span class="callout-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg></span>' +
              '<span>' + esc(v.notice) + '</span>' +
            '</div>' +
          '</div>' +
        '</aside>' +
      '</div>'
    );
  }

  function ensurePanel() {
    var host = document.getElementById('vector-panel-root');
    if (!host) return null;
    if (!host.dataset.built) {
      var vector = getVector(currentId);
      if (!vector) return null;
      host.innerHTML = panelMarkup(vector);
      host.querySelectorAll('[data-close-panel]').forEach(function (el) {
        el.addEventListener('click', closePanel);
      });
      host.dataset.built = '1';
    }
    return host.querySelector('#vector-panel-overlay');
  }

  function openPanel() {
    var overlay = ensurePanel();
    if (overlay) overlay.classList.add('open');
    document.querySelectorAll('.demo-fab').forEach(function (fab) {
      fab.setAttribute('aria-expanded', 'true');
    });
  }

  function closePanel() {
    var overlay = document.getElementById('vector-panel-overlay');
    if (overlay) overlay.classList.remove('open');
    document.querySelectorAll('.demo-fab').forEach(function (fab) {
      fab.setAttribute('aria-expanded', 'false');
    });
  }

  function togglePanel() {
    var overlay = document.getElementById('vector-panel-overlay');
    if (overlay && overlay.classList.contains('open')) closePanel();
    else openPanel();
  }

  /* ------------------------------ landing page ------------------------------ */

  function singleCard(group) {
    var vector = getVector(group.members[0].id);
    if (!vector) return '';
    return (
      '<a class="vcard" href="' + esc(vector.page) + '">' +
        '<span class="vcard-icon">' + group.icon + '</span>' +
        '<span class="vcard-title">' + esc(group.name) + '</span>' +
        '<span class="vcard-blurb">' + esc(group.blurb) + '</span>' +
        '<span class="vcard-go">Open <span class="arrow">&#8594;</span></span>' +
      '</a>'
    );
  }

  // A vector with several pages opens in place, so the choice fits the same card footprint.
  function groupCard(group) {
    var items = group.members.map(function (member) {
      var vector = getVector(member.id);
      if (!vector) return '';
      var logo = member.icon
        ? '<img class="vcard-list-logo" src="' + ROOT + 'assets/favicons/' + esc(member.icon) + '" alt="" width="20" height="20">'
        : '';
      return '<li><a href="' + esc(vector.page) + '">' +
        '<span class="vcard-list-label">' + logo + '<span>' + esc(member.label) + '</span></span>' +
        '<span class="arrow">&#8594;</span>' +
      '</a></li>';
    }).join('');

    return (
      '<article class="vcard vcard-group">' +
        '<button type="button" class="vcard-face vcard-front" data-group-open>' +
          '<span class="vcard-icon">' + group.icon + '</span>' +
          '<span class="vcard-title">' + esc(group.name) + '</span>' +
          '<span class="vcard-blurb">' + esc(group.blurb) + '</span>' +
          '<span class="vcard-go">' + group.members.length + ' pages <span class="arrow">&#8594;</span></span>' +
        '</button>' +
        '<div class="vcard-face vcard-back">' +
          '<div class="vcard-back-head">' +
            '<button type="button" class="vcard-back-btn" data-group-back aria-label="Back">&#8592;</button>' +
            '<span class="vcard-title">' + esc(group.name) + '</span>' +
          '</div>' +
          '<ul class="vcard-list">' + items + '</ul>' +
        '</div>' +
      '</article>'
    );
  }

  function renderHome() {
    var grid = document.getElementById('vector-grid');
    if (!grid) return;
    grid.innerHTML = (REGISTRY.groups || []).map(function (group) {
      return group.members.length > 1 ? groupCard(group) : singleCard(group);
    }).join('');
  }

  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('sekant-demo-theme', next); } catch (err) { /* storage unavailable */ }
    });
  }

  function initHome() {
    var grid = document.getElementById('vector-grid');
    if (!grid) return;

    grid.addEventListener('click', function (event) {
      var back = event.target.closest('[data-group-back]');
      if (back) {
        back.closest('.vcard-group').classList.remove('is-open');
        return;
      }
      var front = event.target.closest('[data-group-open]');
      if (front) front.closest('.vcard-group').classList.add('is-open');
    });

    initTheme();
    renderHome();
  }

  /* ------------------------------ wiring ------------------------------ */

  function initTriggers() {
    document.querySelectorAll('[data-toggle-panel]').forEach(function (el) {
      el.addEventListener('click', togglePanel);
    });

    document.addEventListener('click', function (event) {
      var perform = event.target.closest('[data-perform]');
      if (perform) {
        event.preventDefault();
        performAction(perform.getAttribute('data-perform'), perform.getAttribute('data-copy-source'), perform);
        return;
      }
      // Keep the inert placeholder links from jumping to the top of the page.
      var dead = event.target.closest('a[href="#"]');
      if (dead) event.preventDefault();
    });

    // The login and consent forms are decoration. They must never submit or reload the page.
    document.addEventListener('submit', function (event) {
      event.preventDefault();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closePanel();
  });

  document.addEventListener('DOMContentLoaded', function () {
    initTriggers();
    initHome();
  });

  /* ------------------------------ benign actions ------------------------------ */
  /*
   * The lure action is allowed to run for real so the visitor sees it happen. Everything it
   * produces is deliberately harmless: inert clipboard text or a placeholder text file.
   */

  function placeholderName(vector) {
    return (vector.benign_file && vector.benign_file.name) || 'attachment.bin';
  }

  function savePlaceholder(vector) {
    var body = (vector.benign_file && vector.benign_file.content) ||
      'Unsafe examples demo placeholder.\n\nThis file is plain text. It is not an executable and it does nothing.\n';
    var blob = new Blob([body], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = placeholderName(vector);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    toast('Benign placeholder saved: ' + placeholderName(vector));
  }

  function performAction(kind, source, el) {
    var vector = getVector(currentId);
    if (!vector) return;

    if (kind === 'clipboard') {
      var node = source ? document.querySelector(source) : null;
      var text = node ? node.textContent : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          toast('Inert demo text copied to your clipboard');
        }, function () {
          toast('Copy blocked by browser');
        });
      } else {
        toast('Copy is unavailable in this browser');
      }
    } else if (kind === 'download') {
      savePlaceholder(vector);
    } else if (kind === 'consent') {
      if (el && el.tagName === 'BUTTON') {
        el.disabled = true;
        el.textContent = 'Allowed';
      }
      toast('Access granted (simulated). Nothing was really shared.');
    } else if (kind === 'skip') {
      toast(el && el.getAttribute('data-skip-message') ? el.getAttribute('data-skip-message') : 'Nothing happened.');
    }
  }
})();
