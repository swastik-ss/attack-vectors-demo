/*
 * Applies the colour theme before first paint.
 *
 * The landing page stores the visitor's choice in localStorage when the theme toggle is used.
 * Every page that loads this script follows that choice, falling back to the operating system
 * preference, so the sign-in clones open in the same theme that was picked on the hub.
 */
(function () {
  'use strict';

  var theme = null;
  try { theme = localStorage.getItem('sekant-demo-theme'); } catch (err) { theme = null; }

  if (theme !== 'light' && theme !== 'dark') {
    var light = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    theme = light ? 'light' : 'dark';
  }

  document.documentElement.setAttribute('data-theme', theme);
})();
