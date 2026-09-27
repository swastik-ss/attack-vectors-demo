/*
 * Attack vector registry for the demo site.
 *
 * Each entry drives three things:
 *   1. The simulated page copy and the "what to look for" checklist.
 *   2. The tab title and favicon the page mimics once the visitor is inside the lure.
 *   3. The landing page card: a short blurb, and the page behind it.
 *
 * GROUPS decides the landing layout. A group with a single member links straight through; a
 * group with several members (phishing) expands into the pages it contains.
 *
 * Everything here is fictional sample data. Nothing is collected or transmitted.
 */
(function () {
  'use strict';

  var ICONS = {
    shield:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.4 4.5 5.6v6.1c0 4.7 3.2 9.1 7.5 10.4 4.3-1.3 7.5-5.7 7.5-10.4V5.6L12 2.4Z"/></svg>',
    alert:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 2.5 17.4A1.9 1.9 0 0 0 4.2 20.3h15.6a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 16.6h.01"/></svg>',
    check:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#48c785" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    phishing:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.4 4.5 5.6v6.1c0 4.7 3.2 9.1 7.5 10.4 4.3-1.3 7.5-5.7 7.5-10.4V5.6L12 2.4Z"/><path d="M9.4 12.2l1.9 1.9 3.5-3.9"/></svg>',
    clickfix:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 6.5h2"/><path d="M12 11v6"/><path d="M9.5 14.5 12 17l2.5-2.5"/></svg>',
    download:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M12 11v5"/><path d="M9.6 13.6 12 16l2.4-2.4"/></svg>',
    oauth:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="4"/><path d="M13 12h8"/><path d="M18 12v3"/><path d="M15.5 12v2"/></svg>',
    smuggling:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 9h8"/><path d="M8 12.5h5"/><path d="M8 16h6"/></svg>'
  };

  var VECTORS = {
    'phishing-gmail': {
      name: 'Google / Gmail sign-in clone',
      icon: ICONS.phishing,
      page: 'accounts-google.secure-login.com/signin/v2/identifier.html',
      summary:
        'A pixel-close copy of the Google account sign-in flow hosted on a lookalike domain. The page asks for an email and password that it has no right to receive.',
      eyebrow: 'Phishing',
      notice: 'The form is inert. Nothing typed into it is read, stored or sent anywhere.',
      tags: { event_type: 'visit', risk_type: 'phishing', risk_level: 'unsafe', action: 'block' },
      look: [
        { title: 'Lookalike domain', text: 'The address bar reads <strong>accounts-google.secure-login.com</strong>. The real host is <strong>accounts.google.com</strong>.' },
        { title: 'Brand in the wrong place', text: 'The Google wordmark is drawn by the page itself, so it renders even though the domain is not Google\'s.' },
        { title: 'Urgency framing', text: 'Phishing flows push the visitor to act quickly so the domain is never checked.' },
        { title: 'One field at a time', text: 'Email is collected first, then the password, which is how real credential harvesters stage the theft.' }
      ],
      block: {
        title: 'Phishing site blocked',
        message:
          'This page impersonates the Google account sign-in flow on a domain that Google does not own. The page was blocked before any credential could be entered.',
        reasons: [
          'Brand impersonation detected on a <em>lookalike domain</em> registered 4 days ago.',
          'Credential collection form posted to a host with <em>no relationship to Google</em>.',
          'The URL, page title and favicon are all engineered to match the genuine sign-in page.'
        ]
      },
      detect: {
        hostname: 'accounts-google.secure-login.com',
        tab_url: 'https://accounts-google.secure-login.com/signin/v2/identifier',
        page_title: 'Sign in - Google Accounts',
        favicon: 'google.svg'
      },
      event: {
        event_type: 'visit',
        event_source: 'dom',
        action: 'block',
        user_gesture: 'click',
        ctx_reputation: 'untrusted',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://mail.google.com/',
        ctx_ip: '203.0.113.24',
        risk_level: 'unsafe',
        risk_rationale:
          'Inbound page reproduces the Google account sign-in flow (layout, copy, wordmark and favicon) on a lookalike domain first observed 4 days ago. The credential form does not post to any Google owned endpoint.',
        verdicts: [
          { type: 'url', verdict: 'unsafe', reason: 'Domain accounts-google.secure-login.com is not affiliated with the impersonated brand.' },
          { type: 'vision', verdict: 'unsafe', reason: 'Rendered page matches the Google sign-in template with 0.96 similarity.' },
          { type: 'reputation', verdict: 'unsafe', reason: 'Domain age 4 days, no prior reputation history, hosted on bulletproof ASN.' }
        ],
        threats: [
          {
            tactic: 'Initial Access',
            technique: 'T1566 Phishing',
            severity: 'high',
            description: 'Adversary attempts to obtain account credentials through a spoofed brand login page.',
            evidence: 'Credential form on lookalike domain with brand impersonation score 0.96'
          },
          {
            tactic: 'Reconnaissance',
            technique: 'T1598 Phishing for Information',
            severity: 'medium',
            description: 'Staged credential collection page targeting a specific identity provider.',
            evidence: 'Staged identifier step followed by a hidden password step'
          }
        ],
        indicators: [
          { type: 'domain', value: 'accounts-google.secure-login.com', resource: 'top_level_domain', url: 'https://accounts-google.secure-login.com/signin/v2/identifier' },
          { type: 'brand', value: 'Google', resource: 'impersonated_brand', url: null }
        ],
        content_snippet:
          '<form method="POST" action="/signin/v2/challenge/pwd" id="gaia_loginform">\n  <input type="email" name="identifier" placeholder="Email or phone">\n  <input type="password" name="Passwd" hidden>\n</form>'
      }
    },

    'phishing-instagram': {
      name: 'Instagram login clone',
      icon: ICONS.phishing,
      page: 'instagram-login.verify-account.net/accounts/login.html',
      summary:
        'A near-identical Instagram web login inside a lookalike domain, including the "log in with Facebook" affordance and the app store badges.',
      eyebrow: 'Phishing',
      notice: 'The form is inert. Nothing typed into it is read, stored or sent anywhere.',
      tags: { event_type: 'visit', risk_type: 'phishing', risk_level: 'unsafe', action: 'block' },
      look: [
        { title: 'Lookalike domain', text: 'The address bar reads <strong>instagram-login.verify-account.net</strong>. The genuine host is <strong>www.instagram.com</strong>.' },
        { title: 'Copied trust cues', text: 'The Facebook button and store badges are decoration. Neither one talks to Meta.' },
        { title: 'Credential form', text: 'The username and password fields submit to the lookalike host, not to Instagram.' }
      ],
      block: {
        title: 'Phishing site blocked',
        message:
          'This page impersonates the Instagram login screen. It was blocked before the credential form could be used.',
        reasons: [
          'Instagram brand assets and layout reproduced on a domain <em>Meta does not own</em>.',
          'Login form posts to <em>verify-account.net</em>, not to instagram.com.',
          'Hosted on the same infrastructure as a known credential harvesting kit.'
        ]
      },
      detect: {
        hostname: 'instagram-login.verify-account.net',
        tab_url: 'https://instagram-login.verify-account.net/accounts/login/',
        page_title: 'Log in \u2022 Instagram',
        favicon: 'instagram.svg'
      },
      event: {
        event_type: 'visit',
        event_source: 'dom',
        action: 'block',
        user_gesture: 'click',
        ctx_reputation: 'untrusted',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://www.instagram.com/',
        ctx_ip: '198.51.100.77',
        risk_level: 'unsafe',
        risk_rationale:
          'Page recreates the Instagram web login experience, including third-party brand elements, on a domain with no relationship to the impersonated service. Credentials are submitted to the lookalike host.',
        verdicts: [
          { type: 'url', verdict: 'unsafe', reason: 'Registration domain verify-account.net has no affiliation with the impersonated service.' },
          { type: 'vision', verdict: 'unsafe', reason: 'Login template similarity 0.94 against the Instagram web login.' },
          { type: 'reputation', verdict: 'suspicious', reason: 'Shared hosting and TLS certificate fingerprint observed in credential harvesting campaigns.' }
        ],
        threats: [
          {
            tactic: 'Initial Access',
            technique: 'T1566 Phishing',
            severity: 'high',
            description: 'Spoofed social media login page used to harvest account credentials.',
            evidence: 'Password field present, form action resolves to lookalike host'
          },
          {
            tactic: 'Credential Access',
            technique: 'T1056.003 Web Portal Capture',
            severity: 'medium',
            description: 'Credentials entered into a fraudulent web form captured server side.',
            evidence: 'POST target outside the impersonated service domain'
          }
        ],
        indicators: [
          { type: 'domain', value: 'instagram-login.verify-account.net', resource: 'top_level_domain', url: 'https://instagram-login.verify-account.net/accounts/login/' },
          { type: 'brand', value: 'Instagram', resource: 'impersonated_brand', url: null }
        ],
        content_snippet:
          '<form method="POST" action="//instagram-login.verify-account.net/api/v1/web/accounts/login/ajax/">\n  <input name="username" aria-label="Phone number, username or email">\n  <input name="password" type="password" aria-label="Password">\n</form>'
      }
    },

    'phishing-microsoft': {
      name: 'Microsoft 365 sign-in clone',
      icon: ICONS.phishing,
      page: 'login.microsoftonline.com.auth-verify.io/common/oauth2/v2.0/authorize.html',
      summary:
        'The corporate favourite: a Microsoft sign-in page embedded on a subdomain crafted to look like Microsoft\'s own namespace.',
      eyebrow: 'Phishing',
      notice: 'The form is inert. Nothing typed into it is read, stored or sent anywhere.',
      tags: { event_type: 'visit', risk_type: 'phishing', risk_level: 'unsafe', action: 'block' },
      look: [
        { title: 'Deceptive subdomain', text: 'The host <strong>login.microsoftonline.com.auth-verify.io</strong> starts with the real Microsoft domain to defeat a quick glance.' },
        { title: 'Corporate tone', text: 'Copy mimics a tenant sign-in so the page feels like an internal IT system.' },
        { title: 'Password step', text: 'The email is accepted first, then a password step appears on the same phishing host.' }
      ],
      block: {
        title: 'Phishing site blocked',
        message:
          'This page impersonates the Microsoft 365 sign-in page on a deceptive subdomain. It was blocked before any tenant credential was entered.',
        reasons: [
          'Host uses the genuine namespace as a <em>prefix</em>: <em>login.microsoftonline.com.auth-verify.io</em>.',
          'Microsoft sign-in template reproduced at <em>0.95 similarity</em>.',
          'Domain registered 9 days ago and not delegated to Microsoft.'
        ]
      },
      detect: {
        hostname: 'login.microsoftonline.com.auth-verify.io',
        tab_url: 'https://login.microsoftonline.com.auth-verify.io/common/oauth2/v2.0/authorize',
        page_title: 'Sign in to your account',
        favicon: 'microsoft.svg'
      },
      event: {
        event_type: 'visit',
        event_source: 'dom',
        action: 'block',
        user_gesture: 'click',
        ctx_reputation: 'untrusted',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://outlook.office.com/',
        ctx_ip: '192.0.2.141',
        risk_level: 'unsafe',
        risk_rationale:
          'Page reproduces the Microsoft 365 sign-in experience on a deceptive subdomain that embeds the genuine namespace as a prefix. The host is not delegated to Microsoft and was registered 9 days ago.',
        verdicts: [
          { type: 'url', verdict: 'unsafe', reason: 'Effective TLD is auth-verify.io. The impersonated namespace appears only as a subdomain label.' },
          { type: 'vision', verdict: 'unsafe', reason: 'Microsoft sign-in template similarity 0.95.' },
          { type: 'reputation', verdict: 'unsafe', reason: 'Domain age 9 days, high-risk TLD reputation, mail authentication not configured.' }
        ],
        threats: [
          {
            tactic: 'Initial Access',
            technique: 'T1566.002 Spearphishing Link',
            severity: 'high',
            description: 'Link to a spoofed identity provider sign-in page targeting a corporate tenant.',
            evidence: 'Deceptive subdomain embedding login.microsoftonline.com'
          },
          {
            tactic: 'Defense Evasion',
            technique: 'T1036.005 Masquerading: Match Legitimate Name or Location',
            severity: 'medium',
            description: 'Host name crafted to resemble a trusted sign-in namespace.',
            evidence: 'Deceptive host label login.microsoftonline.com in a non-Microsoft domain'
          }
        ],
        indicators: [
          { type: 'domain', value: 'login.microsoftonline.com.auth-verify.io', resource: 'top_level_domain', url: 'https://login.microsoftonline.com.auth-verify.io/common/oauth2/v2.0/authorize' },
          { type: 'brand', value: 'Microsoft', resource: 'impersonated_brand', url: null }
        ],
        content_snippet:
          '<form method="POST" action="/common/login">\n  <input name="loginfmt" placeholder="Email, phone, or Skype">\n  <input name="passwd" type="password">\n</form>'
      }
    },

    'clickfix': {
      name: 'ClickFix fake verification',
      icon: ICONS.clickfix,
      page: 'fix-verify-cloudflare.help/verify.html',
      summary:
        'A fake "verify you are human" prompt that talks the visitor into copying a command and pasting it into a Run dialog. The real attack runs malware. The demo command only prints text.',
      eyebrow: 'ClickFix',
      perform: 'clipboard',
      notice: 'Never paste a command from a page like this into a Run dialog. The text this page copies is a harmless placeholder.',
      tags: { event_type: 'data_copy', risk_type: 'clickfix', risk_level: 'unsafe', action: 'block' },
      look: [
        { title: 'Borrowed trust', text: 'The check box reproduces the Cloudflare Turnstile widget, so the prompt looks like a routine anti-bot check on a site you already trust.' },
        { title: 'Instructions to paste', text: 'The user is told to open a Run dialog and paste a copied command. Legitimate sites never ask this.' },
        { title: 'Clipboard write', text: 'The command is placed on the clipboard, then the user is asked to run it. That is the ClickFix pattern.' }
      ],
      block: {
        title: 'ClickFix payload copied to your clipboard',
        message:
          'The page wrote a command to the clipboard and told you to run it. That is the ClickFix technique used to install malware. In a live deployment your protection stops the clipboard write. Here the text is a harmless placeholder, so the copy was allowed to finish.',
        reasons: [
          'Clipboard write contained a <em>PowerShell download chain</em> typical of ClickFix campaigns.',
          'The page instructed the visitor to open a <em>Run dialog</em> and paste the payload.',
          'Prompt styling imitates browser internal UI while being page supplied.'
        ]
      },
      detect: {
        hostname: 'fix-verify-cloudflare.help',
        tab_url: 'https://fix-verify-cloudflare.help/verify?challenge=human',
        page_title: 'Just a moment...',
        favicon: 'cloudflare.svg'
      },
      event: {
        event_type: 'data_copy',
        event_source: 'clipboard',
        action: 'block',
        user_gesture: 'click',
        ctx_reputation: 'untrusted',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://www.bing.com/',
        ctx_ip: '203.0.113.88',
        risk_level: 'unsafe',
        risk_rationale:
          'Page writes a command to the clipboard and instructs the visitor to run it, matching the ClickFix social engineering pattern. The page imitates a browser captcha while being fully page supplied.',
        verdicts: [
          { type: 'content', verdict: 'unsafe', reason: 'Clipboard payload matches a known encoded command download chain.' },
          { type: 'url', verdict: 'unsafe', reason: 'Domain registered 2 days ago, no legitimate service behind it.' },
          { type: 'reputation', verdict: 'suspicious', reason: 'Prompt styling imitates a browser internal verification widget.' }
        ],
        threats: [
          {
            tactic: 'Execution',
            technique: 'T1204.004 User Execution: Malicious Copy and Paste',
            severity: 'high',
            description: 'Visitor is socially engineered into executing a command they copied from the page.',
            evidence: 'Clipboard write followed by Run dialog instructions'
          },
          {
            tactic: 'Execution',
            technique: 'T1059.001 Command and Scripting Interpreter: PowerShell',
            severity: 'high',
            description: 'Payload is an encoded PowerShell download chain.',
            evidence: 'Encoded PowerShell command detected in the clipboard write'
          },
          {
            tactic: 'Defense Evasion',
            technique: 'T1027 Obfuscated Files or Information',
            severity: 'medium',
            description: 'Command is encoded to evade simple string inspection.',
            evidence: 'Base64 encoded command argument'
          }
        ],
        indicators: [
          { type: 'domain', value: 'fix-verify-cloudflare.help', resource: 'top_level_domain', url: 'https://fix-verify-cloudflare.help/verify?challenge=human' },
          { type: 'clipboard_pattern', value: 'IEX (New-Object Net.WebClient).DownloadString', resource: 'clipboard_write', url: null }
        ],
        intercept_matches: [
          {
            rule_name: 'YARA_CLICKFIX_POWERSHELL_DOWNLOAD',
            namespace: 'clickfix',
            tags: ['clickfix', 'social-engineering', 'powershell'],
            metadata: { severity: 'high', author: 'unsafe-examples', description: 'ClickFix PowerShell download chain' },
            match_strings: [
              { string_name: '$powershell_iex', count: 1 },
              { string_name: '$download_string', count: 1 },
              { string_name: '$run_dialog_hint', count: 2 }
            ]
          }
        ],
        content_snippet:
          'Download blocked. This demo did not copy anything to your clipboard.\n\nThe real payload in a ClickFix campaign is an encoded PowerShell download chain.\nThis string is shown for reference only and is inert.'
      }
    },

    'unsafe-download': {
      name: 'Unsafe download (a PDF that is not a PDF)',
      icon: ICONS.download,
      page: 'files-portal.doc-share-cdn.com/s/9f31c2/fake_document.pdf.html',
      summary:
        'A file share portal offers "fake_document.pdf". The bytes behind the .pdf name are a ZIP archive, so the file is not the document it claims to be.',
      eyebrow: 'Unsafe download',
      notice: 'The download is the harmless reference fixture: a ZIP archive renamed to look like a PDF. Nothing inside it runs when opened.',
      tags: { event_type: 'download', risk_type: 'unsafe_download', risk_level: 'unsafe', action: 'block' },
      look: [
        { title: 'Type mismatch', text: 'The name ends in <strong>.pdf</strong>, but the file starts with the ZIP signature <strong>PK</strong> instead of the PDF signature <strong>%PDF</strong>.' },
        { title: 'Routine framing', text: 'A generic "a document was shared with you" portal is used so the download feels expected.' },
        { title: 'Wrong host', text: 'The file is served from a sharing domain with no relationship to the sender.' }
      ],
      block: {
        title: 'Unsafe download detected',
        message:
          'The file is a ZIP archive behind a .pdf name. The download was allowed to finish so you can see what the lure delivers. In a live deployment your protection blocks it before the file reaches disk.',
        reasons: [
          'File signature is a <em>ZIP archive</em> while the page promised a PDF document.',
          'The name <em>fake_document.pdf</em> hides the real type behind a trusted extension.',
          'Host has no relationship to the claimed sender and is 11 days old.'
        ]
      },
      request: {
        label: 'Request IT approval',
        note: 'An approved request is recorded against the event and appears in the console as user_request fields.'
      },
      detect: {
        hostname: 'files-portal.doc-share-cdn.com',
        tab_url: 'https://files-portal.doc-share-cdn.com/s/9f31c2/fake_document.pdf',
        page_title: 'fake_document.pdf - DocShare',
        favicon: 'docshare.svg'
      },
      event: {
        event_type: 'download',
        event_source: 'download',
        action: 'block',
        user_gesture: 'click',
        secondary_url: 'https://files-portal.doc-share-cdn.com/s/9f31c2/fake_document.pdf',
        ctx_reputation: 'untrusted',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://mail.example.com/',
        ctx_ip: '198.51.100.203',
        risk_level: 'unsafe',
        risk_rationale:
          'The file advertised as a PDF is a ZIP archive: the content signature does not match the declared type, which is the standard pattern for delivering an unintended payload behind a document name.',
        verdicts: [
          { type: 'file', verdict: 'unsafe', reason: 'Content starts with a PK header (ZIP archive) but was advertised as a PDF.' },
          { type: 'reputation', verdict: 'unsafe', reason: 'Hosting domain age 11 days, previously observed delivering loader binaries.' },
          { type: 'url', verdict: 'suspicious', reason: 'Download path serves a document name that does not match the file content.' }
        ],
        threats: [
          {
            tactic: 'Execution',
            technique: 'T1204.002 User Execution: Malicious File',
            severity: 'high',
            description: 'User is induced to open a file that installs an attacker controlled payload.',
            evidence: 'Executable content served under a document file name'
          },
          {
            tactic: 'Defense Evasion',
            technique: 'T1036.008 Masquerading: Masquerade File Type',
            severity: 'medium',
            description: 'An archive masquerades as a document so the real type is missed.',
            evidence: 'Name fake_document.pdf, content signature PK (ZIP), declared MIME application/pdf'
          }
        ],
        indicators: [
          { type: 'domain', value: 'files-portal.doc-share-cdn.com', resource: 'top_level_domain', url: 'https://files-portal.doc-share-cdn.com/s/9f31c2/fake_document.pdf' },
          { type: 'file_name', value: 'fake_document.pdf', resource: 'download_filename', url: null },
          { type: 'file_hash_sha256', value: '4f1d0b7c9a2e6f3d8b5c1a7e0d9f4b2c6a8e3d1f5b7c9a0e2d4f6b8c1a3e5d7f', resource: 'downloaded_file', url: null }
        ],
        files: [
          { name: 'fake_document.pdf', size: 40336, mime: 'application/zip', hash_sha256: '4f1d0b7c9a2e6f3d8b5c1a7e0d9f4b2c6a8e3d1f5b7c9a0e2d4f6b8c1a3e5d7f' }
        ],
        user_request: {
          action: 'download_request',
          email: 'demo.user@example.com',
          rationale: 'Requesting approval to download the invoice shared by the finance team.'
        }
      }
    },

    'oauth-consent': {
      name: 'OAuth consent phishing',
      icon: ICONS.oauth,
      page: 'consent-oauth.workspace-apps.io/oauth2/consent/?client_id=88213-demo.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fworkspace-apps.io%2Foauth%2Fcallback&response_type=code&scope=openid+email+https%3A%2F%2Fmail.google.com%2F+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts+offline_access&state=6f2a9c81e4b7',
      summary:
        'An unverified third-party app asks for offline access to mail, files and contacts. No password is stolen. Access is granted by consent alone.',
      eyebrow: 'OAuth consent',
      perform: 'consent',
      notice: 'The grant is simulated and no OAuth flow exists on this page, so nothing was really shared.',
      tags: { event_type: 'visit', risk_type: 'oauth_consent', risk_level: 'suspicious', action: 'warn' },
      look: [
        { title: 'Unverified publisher', text: 'The consent screen belongs to an app that the identity provider has not verified.' },
        { title: 'Over-broad scopes', text: 'Requests offline access plus read and send rights on mail, files and contacts.' },
        { title: 'Warning to click through', text: 'The unverified warning is dismissed with <em>Continue</em>, or hidden behind <em>Advanced</em> and "Go to Workspace Apps (unsafe)".' }
      ],
      block: {
        title: 'OAuth consent granted to an unverified app',
        message:
          'An unverified application was granted durable access to mail, files and contacts. No password was involved, so that access would survive a password change. The grant was allowed to complete here; in a live deployment your protection warns before it is made.',
        reasons: [
          'Requesting application is <em>not verified</em> by the identity provider.',
          'Scopes include <em>offline access</em> plus read and send rights across mail and files.',
          'Publisher domain was registered 3 weeks ago with no user base.'
        ]
      },
      detect: {
        hostname: 'consent-oauth.workspace-apps.io',
        tab_url: 'https://consent-oauth.workspace-apps.io/oauth2/consent/?client_id=88213-demo.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fworkspace-apps.io%2Foauth%2Fcallback&response_type=code&scope=openid+email+https%3A%2F%2Fmail.google.com%2F+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive+offline_access&state=6f2a9c81e4b7',
        page_title: 'Sign in - Google Accounts',
        favicon: 'google.svg'
      },
      event: {
        event_type: 'visit',
        event_source: 'dom',
        action: 'warn',
        user_gesture: 'click',
        ctx_reputation: 'unknown',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://mail.example.com/',
        ctx_ip: '192.0.2.55',
        risk_level: 'suspicious',
        risk_rationale:
          'Consent screen presented for an unverified third-party application requesting durable offline access to mail, files and contacts. Consent alone would grant persistent access without any credential being entered.',
        verdicts: [
          { type: 'url', verdict: 'suspicious', reason: 'Consent surface hosted outside the identity provider domain.' },
          { type: 'vision', verdict: 'suspicious', reason: 'Consent template resembles the native identity provider screen.' },
          { type: 'reputation', verdict: 'suspicious', reason: 'Publisher domain registered 3 weeks ago, no published privacy policy.' }
        ],
        threats: [
          {
            tactic: 'Credential Access',
            technique: 'T1528 Steal Application Access Token',
            severity: 'high',
            description: 'Adversary obtains an OAuth token through user consent instead of stealing a password.',
            evidence: 'Offline access scope requested by unverified application'
          },
          {
            tactic: 'Persistence',
            technique: 'T1098.001 Account Manipulation: Additional Cloud Credentials',
            severity: 'medium',
            description: 'Granted token survives password changes and can be reused at will.',
            evidence: 'offline_access scope with refresh token issuance'
          }
        ],
        indicators: [
          { type: 'domain', value: 'consent-oauth.workspace-apps.io', resource: 'top_level_domain', url: 'https://consent-oauth.workspace-apps.io/oauth2/consent/?client_id=88213-demo.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fworkspace-apps.io%2Foauth%2Fcallback' },
          { type: 'oauth_scope', value: 'https://mail.google.com/ offline_access', resource: 'requested_scope', url: null },
          { type: 'oauth_client_id', value: '88213-demo.apps.googleusercontent.com', resource: 'unverified_client', url: null }
        ]
      }
    },

    'html-smuggling': {
      name: 'HTML smuggling attachment',
      icon: ICONS.smuggling,
      page: 'payroll-notices.hr-docs-portal.net/view/statement-2026-08.html',
      summary:
        'An HTML attachment builds a file in the browser at runtime instead of downloading it from the network. The demo assembles a harmless text file so you can see the technique.',
      eyebrow: 'HTML smuggling',
      perform: 'download',
      benign_file: {
        name: 'Payroll_Statement_2026-08.pdf.exe',
        content: 'Unsafe examples demo placeholder.\n\nThe original attachment was an HTML file. This is the file it assembles in the browser, which in a real campaign would be an executable hiding behind a double extension.\n\nNothing here is executable.\n'
      },
      notice: 'The assembled file is a harmless text placeholder, not a real executable. Delete it when you are done looking at it.',
      tags: { event_type: 'download', risk_type: 'html_smuggling', risk_level: 'unsafe', action: 'block' },
      look: [
        { title: 'Looks like a document', text: 'The attachment presents itself as a payroll statement and renders in the browser.' },
        { title: 'Client side assembly', text: 'Base64 content is decoded in the page and turned into a file with a blob URL. No payload crosses the network.' },
        { title: 'Executable output', text: 'In a real campaign the assembled file is an executable or a disk image. Here it is a text file.' }
      ],
      block: {
        title: 'HTML smuggling detected',
        message:
          'This attachment assembled a file locally with script instead of downloading it, which is how payloads slip past network inspection. The file was allowed to finish so you can see the outcome.',
        reasons: [
          'Page contains a <em>base64 blob</em> decoded at runtime and turned into a downloadable file.',
          'Download is triggered through a <em>blob or data URL</em>, which hides the payload from network inspection.',
          'Attachment was delivered as HTML but announces an executable outcome.'
        ]
      },
      detect: {
        hostname: 'payroll-notices.hr-docs-portal.net',
        tab_url: 'https://payroll-notices.hr-docs-portal.net/view/statement-2026-08.html',
        page_title: 'Payroll_Statement_2026-08.html',
        favicon: 'attachment.svg'
      },
      event: {
        event_type: 'download',
        event_source: 'download',
        action: 'block',
        user_gesture: 'click',
        secondary_url: 'blob:https://payroll-notices.hr-docs-portal.net/6c1a2f4e-demo',
        ctx_reputation: 'untrusted',
        ctx_organization: 'Unclassified',
        ctx_is_new_domain: true,
        ctx_unfamiliar_domain: true,
        ctx_referred_by_search: false,
        ctx_referrer: 'https://mail.example.com/',
        ctx_ip: '203.0.113.191',
        risk_level: 'unsafe',
        risk_rationale:
          'HTML attachment assembles a file in the browser from a base64 blob and triggers the download through a blob URL. The technique is used to evade network level file inspection, and the announced file type is executable.',
        verdicts: [
          { type: 'content', verdict: 'unsafe', reason: 'Page decodes a base64 blob into a file and creates an object URL for download.' },
          { type: 'url', verdict: 'suspicious', reason: 'Download originates from a blob URL, so no network request carries the file.' },
          { type: 'reputation', verdict: 'suspicious', reason: 'Hosting domain used across document themed lures in the last 30 days.' }
        ],
        threats: [
          {
            tactic: 'Defense Evasion',
            technique: 'T1027.006 Obfuscated Files or Information: HTML Smuggling',
            severity: 'high',
            description: 'Payload is smuggled inside an HTML document and assembled client side.',
            evidence: 'base64 blob decoded at runtime, download issued via blob URL'
          },
          {
            tactic: 'Execution',
            technique: 'T1204.002 User Execution: Malicious File',
            severity: 'medium',
            description: 'User is expected to open the assembled file after it is written to disk.',
            evidence: 'Download attribute set to an executable file name'
          }
        ],
        indicators: [
          { type: 'domain', value: 'payroll-notices.hr-docs-portal.net', resource: 'top_level_domain', url: 'https://payroll-notices.hr-docs-portal.net/view/statement-2026-08.html' },
          { type: 'pattern', value: 'atob + createObjectURL', resource: 'html_smuggling_primitive', url: null }
        ],
        files: [
          { name: 'Payroll_Statement_2026-08.html', size: 96400, mime: 'text/html', hash_sha256: 'b7e2a91c4d6f8b0a3c5e7d9f1b4a6c8e0d2f4b6a8c0e2d4f6b8a0c2e4d6f8b1a' }
        ],
        content_snippet:
          'const blob = new Blob([window.atob("VW5zYWZlIGV4YW1wbGVzIGRlbW86IHRoaXMgaXMgYSBiZW5pZ24gcGxhY2Vob2xkZXI=")], {type: "text/html"});\nconst url = URL.createObjectURL(blob);\nlink.href = url; link.download = "Payroll_Statement_2026-08.html";'
      }
    }
  };

  /*
   * Landing page layout. A member carries the short label and the brand mark shown on the card
   * that expands into it; the full page copy stays in VECTORS.
   */
  var GROUPS = [
    {
      id: 'phishing',
      name: 'Phishing sites',
      icon: ICONS.phishing,
      blurb: 'A site that impersonates a known brand you trust is blocked before users can type a password.',
      members: [
        { id: 'phishing-gmail', label: 'Google / Gmail', icon: 'google.svg' },
        { id: 'phishing-instagram', label: 'Instagram', icon: 'instagram.svg' },
        { id: 'phishing-microsoft', label: 'Microsoft 365', icon: 'microsoft.svg' }
      ]
    },
    {
      id: 'clickfix',
      name: 'ClickFix prompts',
      icon: ICONS.clickfix,
      blurb: 'Attackers may try to get your users to copy/paste a malicious script. Sekant will clear the clipboard before they can paste.',
      members: [{ id: 'clickfix', label: 'ClickFix' }]
    },
    {
      id: 'unsafe-download',
      name: 'Unsafe download',
      icon: ICONS.download,
      blurb: 'A file share serves a PDF that is really a ZIP archive.',
      members: [{ id: 'unsafe-download', label: 'Unsafe download' }]
    },
    {
      id: 'oauth-consent',
      name: 'OAuth consent',
      icon: ICONS.oauth,
      blurb: 'An unverified app asks for lasting access to mail, files and contacts.',
      members: [{ id: 'oauth-consent', label: 'OAuth consent' }]
    },
    {
      id: 'html-smuggling',
      name: 'HTML smuggling',
      icon: ICONS.smuggling,
      blurb: 'An attachment builds a file in the browser instead of downloading it.',
      members: [{ id: 'html-smuggling', label: 'HTML smuggling' }]
    }
  ];

  window.SEKANT_DEMO = {
    icons: ICONS,
    vectors: VECTORS,
    groups: GROUPS
  };
})();
