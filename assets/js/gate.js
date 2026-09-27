/*
 * Shared warning disclaimer gate.
 *
 * The disclaimer guards every vector page: each time a lure is opened the warning is shown
 * before it, because that is the page that looks dangerous. The hub is only a menu, so its
 * warning is shown once per browsing session and then remembered in sessionStorage, so
 * returning to the menu is not blocked again.
 *
 * The gate is injected before the rest of the body is parsed, so no page content can render
 * ahead of it and a direct link cannot skip it.
 *
 * While the gate is on screen the tab keeps neutral branding. The impersonated brand
 * title and favicon are applied once the visitor accepts and enters the lure, or immediately
 * when the disclaimer was already accepted and no gate is shown, so the tab mimics the
 * original from the first paint. That switch happens in applyLureBranding(). The address bar
 * always keeps the real demo URL, so every link the browser holds stays reload safe.
 */
(function () {
  'use strict';

  var body = document.body;
  if (!body || document.getElementById('gate')) return;

  var root = body.getAttribute('data-root') || '';
  var IS_VECTOR_PAGE = !!body.getAttribute('data-vector');
  var NEUTRAL_TITLE = 'UNSAFE EXAMPLES';
  var NEUTRAL_ICON = root + 'assets/favicons/sekant.svg';
  var STORAGE_KEY = 'sekant-demo-disclaimer-accepted';

  function hasAccepted() {
    if (IS_VECTOR_PAGE) return false;
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (err) { return false; }
  }

  function rememberAccepted() {
    if (IS_VECTOR_PAGE) return;
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (err) { /* storage unavailable, the gate shows again */ }
  }

  function setIcon(href) {
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'icon');
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  // Already accepted in this session: no gate, and the lure branding applies at once.
  if (hasAccepted()) {
    applyLureBranding();
    return;
  }

  // Neutral branding, so no phishing logo is shown while the disclaimer is up.
  document.title = NEUTRAL_TITLE;
  setIcon(NEUTRAL_ICON);

  var gate = document.createElement('div');
  gate.id = 'gate';
  gate.innerHTML = [
    '<div class="gate-card" role="dialog" aria-modal="true" aria-label="Warning and disclaimer">',
      '<div class="gate-icon" aria-hidden="true">',
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 2.5 17.4A1.9 1.9 0 0 0 4.2 20.3h15.6a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 16.6h.01"/></svg>',
      '</div>',
      '<p class="eyebrow">Warning and disclaimer</p>',
      '<h1>Read this before you open anything.</h1>',
      '<p>This is a security awareness demo. Every page here recreates a real attack technique on purpose, so you can see what the lure looks like, how your protection catches it, and how the event is reported.</p>',
      '<p>The pages behind this warning only <strong>look</strong> dangerous. Nothing on this site is a real threat to you.</p>',
      '<ul>',
        '<li>No malware. Nothing is downloaded, installed or executed.</li>',
        '<li>No credential capture. Every login form on this site is inert.</li>',
        '<li>No telemetry. Nothing you do here is collected, stored or reported.</li>',
        '<li>No console connection. Reports are generated locally in your browser from sample data.</li>',
      '</ul>',
      '<p class="gate-note">' + (IS_VECTOR_PAGE
        ? 'This warning is shown before every page here. Everything beyond it is still a harmless simulation.'
        : 'You will see this warning once per browsing session. Every page beyond it is still a harmless simulation.') + '</p>',
      '<label class="gate-check" for="gate-check">',
        '<input type="checkbox" id="gate-check">',
        '<span>I understand this is a simulated demonstration, that nothing here is real, and that I want to continue.</span>',
      '</label>',
      '<div class="gate-actions">',
        '<button type="button" class="btn btn-primary" id="gate-proceed" disabled>I understand, continue</button>',
      '</div>',
    '</div>'
  ].join('');

  body.classList.add('gate-locked');
  body.insertBefore(gate, body.firstChild);

  var check = gate.querySelector('#gate-check');
  var proceed = gate.querySelector('#gate-proceed');

  check.addEventListener('change', function () {
    proceed.disabled = !check.checked;
  });

  proceed.addEventListener('click', function () {
    rememberAccepted();
    body.classList.remove('gate-locked');
    body.classList.add('gate-open');
    window.scrollTo(0, 0);
    applyLureBranding();
  });

  // The hub keeps the neutral tab. Vector pages declare the impersonated
  // branding on the body, so it can be applied at the first paint without waiting for any
  // other script, and the tab mimics the original even when no gate is shown.
  function applyLureBranding() {
    var title = body.getAttribute('data-tab-title');
    var icon = body.getAttribute('data-tab-icon');
    if (title) document.title = title;
    if (icon) setIcon(root + 'assets/favicons/' + icon);
  }
})();
