// Osanda Wedamulla portfolio: progressive enhancement only. Site works fully without JS.
(function () {
  'use strict';

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // Active nav link
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && byId[entry.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          byId[entry.target.id].classList.add('is-active');
          byId[entry.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) navObs.observe(s); });
  }

  // One gentle reveal on scroll (plays once, never reverses). CSS only hides .reveal when motion is allowed.
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { obs.observe(el); });
  }

  // Contact form -> Formspree (AJAX). Honest states only.
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    var fallback = 'Please email me directly at <a href="mailto:osanda1989@gmail.com">osanda1989@gmail.com</a>.';
    var show = function (msg, kind) {
      status.innerHTML = msg;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        show('The contact form isn\'t set up yet. ' + fallback, 'error');
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      show('Sending…');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) { form.reset(); show('Thanks, your message was sent. I\'ll get back to you soon.', 'success'); }
          else { return res.json().catch(function () { return {}; }).then(function (data) {
            var detail = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(', ') + '. ' : '';
            show('Sorry, your message could not be sent. ' + detail + fallback, 'error');
          }); }
        })
        .catch(function () { show('Network error: your message was not sent. ' + fallback, 'error'); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
