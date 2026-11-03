/* ==========================================================================
   PREETI KADROLLI - PERSONAL PORTFOLIO JAVASCRIPT LOGIC
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. THEME & ACCENT MANAGEMENT WITH LOCALSTORAGE
  // ------------------------------------------------------------------------
  const STORAGE_THEME_KEY = 'pk_portfolio_theme';
  const STORAGE_ACCENT_KEY = 'pk_portfolio_accent';

  const htmlEl = document.documentElement;
  htmlEl.classList.add('js-ready');
  const themeSettingsToggle = document.getElementById('theme-settings-toggle');
  const themePanel = document.getElementById('theme-panel');
  const themePanelOverlay = document.getElementById('theme-panel-overlay');
  const themePanelClose = document.getElementById('theme-panel-close');
  const quickThemeToggle = document.getElementById('quick-theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');

  const btnDark = document.getElementById('btn-theme-dark');
  const btnLight = document.getElementById('btn-theme-light');
  const swatchButtons = document.querySelectorAll('.swatch-btn');

  // Initialize saved or default theme
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'dark';
  const savedAccent = localStorage.getItem(STORAGE_ACCENT_KEY) || 'blue';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);

    if (theme === 'light') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      if (btnLight) btnLight.classList.add('active');
      if (btnDark) btnDark.classList.remove('active');
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      if (btnDark) btnDark.classList.add('active');
      if (btnLight) btnLight.classList.remove('active');
    }
  }

  function applyAccent(accent) {
    htmlEl.setAttribute('data-accent', accent);
    localStorage.setItem(STORAGE_ACCENT_KEY, accent);

    swatchButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-accent-color') === accent);
    });
  }

  // Initial apply
  applyTheme(savedTheme);
  applyAccent(savedAccent);

  // Toggle Theme Customization Panel
  function openThemePanel() {
    if (themePanel) themePanel.classList.add('open');
    if (themePanelOverlay) themePanelOverlay.classList.add('open');
  }

  function closeThemePanel() {
    if (themePanel) themePanel.classList.remove('open');
    if (themePanelOverlay) themePanelOverlay.classList.remove('open');
  }

  if (themeSettingsToggle) {
    themeSettingsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (themePanel && themePanel.classList.contains('open')) {
        closeThemePanel();
      } else {
        openThemePanel();
      }
    });
  }

  if (themePanelClose) themePanelClose.addEventListener('click', closeThemePanel);
  if (themePanelOverlay) themePanelOverlay.addEventListener('click', closeThemePanel);

  // Close theme panel on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themePanel && themePanel.classList.contains('open')) {
      closeThemePanel();
    }
  });

  // Swatch Click Listeners
  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const accent = btn.getAttribute('data-accent-color');
      if (accent) applyAccent(accent);
    });
  });

  // Dark / Light Switch buttons inside panel
  if (btnDark) btnDark.addEventListener('click', () => applyTheme('dark'));
  if (btnLight) btnLight.addEventListener('click', () => applyTheme('light'));

  // Quick Navbar Toggle
  if (quickThemeToggle) {
    quickThemeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // ------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.classList.toggle('open', !isOpen);
      mobileDrawer.classList.toggle('open', !isOpen);
      mobileToggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
  // ------------------------------------------------------------------------
  const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right, .scale-in, .flip-in');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 40px 0px',
      threshold: 0.05
    };

    const animationObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80) {
        el.classList.add('in-view');
      } else {
        animationObserver.observe(el);
      }
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('in-view'));
  }

  // ------------------------------------------------------------------------
  // 4. TECHNICAL SKILLS: CHIPS HOVER & ACCESSIBILITY
  // ------------------------------------------------------------------------
  // All skill chips are displayed cleanly with their official logos.
  // Native CSS handles smooth hover states and GPU-accelerated micro-interactions.

  // ------------------------------------------------------------------------
  // 5. TOAST NOTIFICATION & CLIPBOARD UTILITIES
  // ------------------------------------------------------------------------
  const emailToast = document.getElementById('email-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!emailToast) return;
    emailToast.textContent = message;
    emailToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      emailToast.classList.remove('show');
    }, 3200);
  }

  function copyTextToClipboard(text, successMsg) {
    function onCopied() {
      showToast(successMsg || '✓ Copied to clipboard!');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onCopied).catch(() => {
        fallbackCopy(text, onCopied);
      });
    } else {
      fallbackCopy(text, onCopied);
    }
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (cb) cb();
    } catch (e) {
      console.warn('Clipboard fallback failed', e);
    }
    document.body.removeChild(ta);
  }

  // ------------------------------------------------------------------------
  // 6. EMAIL DIRECT CONTACT MODAL (FIRST PAGE, FOOTER & CONTACT CARD)
  // ------------------------------------------------------------------------
  const emailModal = document.getElementById('email-modal');
  const emailModalOverlay = document.getElementById('email-modal-overlay');
  const emailModalClose = document.getElementById('email-modal-close');
  const emailOptGmail = document.getElementById('email-opt-gmail');
  const emailOptCopy = document.getElementById('email-opt-copy');
  const emailCopyTitle = document.getElementById('email-copy-title');

  function openEmailModal() {
    if (emailModal) emailModal.classList.add('open');
    if (emailModalOverlay) emailModalOverlay.classList.add('open');
  }

  function closeEmailModal() {
    if (emailModal) emailModal.classList.remove('open');
    if (emailModalOverlay) emailModalOverlay.classList.remove('open');
  }

  if (emailModalClose) emailModalClose.addEventListener('click', closeEmailModal);
  if (emailModalOverlay) emailModalOverlay.addEventListener('click', closeEmailModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emailModal && emailModal.classList.contains('open')) {
      closeEmailModal();
    }
  });

  if (emailOptCopy) {
    emailOptCopy.addEventListener('click', () => {
      copyTextToClipboard('preetilk32@gmail.com', '✓ preetilk32@gmail.com copied to clipboard!');
      if (emailCopyTitle) {
        const orig = emailCopyTitle.textContent;
        emailCopyTitle.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => {
          emailCopyTitle.textContent = orig;
          closeEmailModal();
        }, 1200);
      }
    });
  }

  if (emailOptGmail) {
    emailOptGmail.addEventListener('click', () => {
      setTimeout(closeEmailModal, 350);
    });
  }

  // Bind all mailto links and email triggers across entire site
  const mailTriggers = document.querySelectorAll('.email-modal-trigger, a[href^="mailto:"]');
  mailTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openEmailModal();
    });
  });

  // ------------------------------------------------------------------------
  // 7. CONTACT FORM: DUAL GMAIL WEB & MAILTO DISPATCH WITH IN-CARD FEEDBACK
  // ------------------------------------------------------------------------
  const contactSection = document.getElementById('contact');
  const contactForm = document.getElementById('contact-form');
  const formFeedbackBox = document.getElementById('form-feedback-box');
  const feedbackGmailLink = document.getElementById('feedback-gmail-link');
  const feedbackMailtoLink = document.getElementById('feedback-mailto-link');
  const feedbackCopyBtn = document.getElementById('feedback-copy-btn');
  const feedbackCopyText = document.getElementById('feedback-copy-text');
  const btnResetForm = document.getElementById('btn-reset-form');
  const sendBtn = document.getElementById('send-btn');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  // Pulse send button once after contact section appears
  if ('IntersectionObserver' in window && contactSection && sendBtn) {
    const contactObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        sendBtn.classList.add('btn-pulse-once');
        contactObserver.disconnect();
      }
    }, { threshold: 0.3 });
    contactObserver.observe(contactSection);
  }

  let composedMessagePayload = '';

  if (contactForm && nameInput && emailInput && subjectInput && messageInput) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill out all the fields before submitting.');
        return;
      }

      // Validate email structure
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      const targetEmail = 'preetilk32@gmail.com';
      const emailSubject = `[Portfolio Inquiry] ${subject} - from ${name}`;
      const emailBody = `Hi Preeti,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n-- Sent via preeti-portfolio website`;

      composedMessagePayload = emailBody;

      const encSubject = encodeURIComponent(emailSubject);
      const encBody = encodeURIComponent(emailBody);

      // Web Gmail URL: opens directly in browser without requiring desktop mail client
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encSubject}&body=${encBody}`;
      // Native mailto URL: triggers desktop client (Outlook, Apple Mail, Windows Mail)
      const mailtoUrl = `mailto:${targetEmail}?subject=${encSubject}&body=${encBody}`;

      // Update feedback links
      if (feedbackGmailLink) feedbackGmailLink.setAttribute('href', gmailUrl);
      if (feedbackMailtoLink) feedbackMailtoLink.setAttribute('href', mailtoUrl);

      // Open Gmail web in a new tab
      const win = window.open(gmailUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        // If popup was blocked, fallback to hidden mailto trigger
        const tempLink = document.createElement('a');
        tempLink.href = mailtoUrl;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      }

      // Automatically copy message payload as courtesy
      copyTextToClipboard(emailBody, '✓ Message copied to clipboard & email ready!');

      // Smoothly switch form to success card
      contactForm.style.display = 'none';
      if (formFeedbackBox) {
        formFeedbackBox.style.display = 'flex';
      }
    });
  }

  // Copy message button in feedback box
  if (feedbackCopyBtn) {
    feedbackCopyBtn.addEventListener('click', () => {
      if (composedMessagePayload) {
        copyTextToClipboard(composedMessagePayload, '✓ Full message copied to clipboard!');
        if (feedbackCopyText) {
          const orig = feedbackCopyText.textContent;
          feedbackCopyText.textContent = '✓ Copied to Clipboard!';
          setTimeout(() => {
            feedbackCopyText.textContent = orig;
          }, 2000);
        }
      }
    });
  }

  // Reset form to write another message
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'block';
      }
      if (formFeedbackBox) {
        formFeedbackBox.style.display = 'none';
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. COPY EMAIL TO CLIPBOARD (Contact Panel Inline Button)
  // ------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    const originalHTML = copyEmailBtn.innerHTML;
    let resetTimer = null;

    copyEmailBtn.addEventListener('click', () => {
      copyTextToClipboard('preetilk32@gmail.com', '✓ preetilk32@gmail.com copied to clipboard!');
      clearTimeout(resetTimer);
      copyEmailBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #10B981;" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      resetTimer = setTimeout(() => {
        copyEmailBtn.innerHTML = originalHTML;
      }, 2000);
    });
  }

  // ------------------------------------------------------------------------
  // 7. DYNAMIC YEAR IN FOOTER
  // ------------------------------------------------------------------------
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 8. ACTIVE NAVIGATION SPY ON SCROLL (Throttled with requestAnimationFrame)
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let scrollTicking = false;

  function updateActiveNav() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(sec => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSectionId);
    });

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateActiveNav);
      scrollTicking = true;
    }
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 9. 3D TILT EFFECT ON CARDS (HERO AVATAR & CERTIFICATES)
  // ------------------------------------------------------------------------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.hero-avatar-frame, .cert-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 10. TYPED.JS TEXT ROTATION ANIMATION
  // ------------------------------------------------------------------------
  function initTyped() {
    const typingElement = document.querySelector('.typing');
    if (!typingElement) return;

    const typingStrings = [
      'Front End Development',
      'Back End Development',
      'Software development',
      'Associate Software Engineer',
      'Full Stack Developer'
    ];

    if (typeof Typed !== 'undefined') {
      try {
        new Typed('.typing', {
          strings: typingStrings,
          typeSpeed: 100,
          backSpeed: 50,
          loop: true,
          showCursor: true,
          cursorChar: '|'
        });
        return;
      } catch (err) {
        console.warn('Typed.js error, using fallback engine', err);
      }
    }

    // Pure Vanilla JS Fallback (Works 100% offline without CDN)
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentString = typingStrings[stringIndex];

      if (isDeleting) {
        typingElement.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentString.length) {
        speed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % typingStrings.length;
        speed = 400; // Pause before typing next word
      }

      setTimeout(typeLoop, speed);
    }
    typeLoop();
  }

  // Run typing animation after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTyped);
  } else {
    initTyped();
  }

  // ------------------------------------------------------------------------
  // 11. HIRE ME / GET IN TOUCH BUTTON ACTION
  // ------------------------------------------------------------------------
  const hireMeBtn = document.querySelector('.hire-me');
  if (hireMeBtn) {
    hireMeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const contactTarget = document.getElementById('contact');
      if (contactTarget) {
        contactTarget.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameField = document.getElementById('contact-name');
          if (nameField) nameField.focus();
        }, 600);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 12. PROJECT DESCRIPTION OVERLAY EXPAND / COLLAPSE (Touch & Tap Support)
  // ------------------------------------------------------------------------
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const descWrapper = card.querySelector('.project-desc-wrapper');
    if (descWrapper) {
      descWrapper.addEventListener('click', () => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0) return;

        const isExpanded = card.classList.contains('is-expanded');
        projectCards.forEach(c => c.classList.remove('is-expanded'));
        if (!isExpanded) {
          card.classList.add('is-expanded');
        }
      });
    }
  });

  // Tap outside to collapse any open project description
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card')) {
      projectCards.forEach(card => card.classList.remove('is-expanded'));
    }
  });

  // ------------------------------------------------------------------------
  // 13. EXPERIENCE TIMELINE EXPAND / COLLAPSE (View More / Show Less)
  // ------------------------------------------------------------------------
  const expToggleBtns = document.querySelectorAll('.exp-toggle-btn');
  expToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.experience-card');
      if (!card) return;
      const isExpanded = card.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const textSpan = btn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = isExpanded ? 'Show Less' : 'View More';
      }
    });
  });

  // ------------------------------------------------------------------------
  // 14. RESUME DOWNLOAD PATH RESOLVER
  // ------------------------------------------------------------------------
  // Ensures resume download resolves correctly when opened via file:// protocol
  // or hosted in repository subdirectories (such as GitHub Pages username.github.io/portfolio/)
  const resumeLinks = document.querySelectorAll('a[download][href*="Preeti_Kadrolli_Resume.pdf"]');
  if (resumeLinks.length) {
    const isFile = window.location.protocol === 'file:';
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    const pathParts = window.location.pathname.split('/').filter(Boolean);

    resumeLinks.forEach(link => {
      if (isFile) {
        link.setAttribute('href', 'Preeti_Kadrolli_Resume.pdf');
      } else if (isGitHubPages && pathParts.length > 0) {
        const repoName = pathParts[0];
        link.setAttribute('href', '/' + repoName + '/Preeti_Kadrolli_Resume.pdf');
      }
    });
  }

})();
