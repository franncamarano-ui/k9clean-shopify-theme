/* ============================================
   K9 CLEAN ARGENTINA — UNIFIED JAVASCRIPT
   Combined from: index.html, producto.html,
   contacto.html, seguimiento.html

   Each block is wrapped in an IIFE and checks
   for element existence before running.
   ============================================ */

/* ---- Countdown Timer (shared — all pages) ---- */
(function() {
  var hoursEl = document.getElementById('cd-hours');
  var minutesEl = document.getElementById('cd-minutes');
  var secondsEl = document.getElementById('cd-seconds');
  if (!hoursEl || !minutesEl || !secondsEl) return;

  var hours = 3, minutes = 49, seconds = 0;
  var saved = sessionStorage.getItem('k9countdown');
  if (saved) {
    var parts = saved.split(':');
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    seconds = parseInt(parts[2], 10);
  }

  var totalSeconds = hours * 3600 + minutes * 60 + seconds;

  function pad(n) { return n < 10 ? '0' + n : n; }

  function tick() {
    if (totalSeconds <= 0) {
      totalSeconds = 3 * 3600 + 49 * 60;
    }
    totalSeconds--;
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = totalSeconds % 60;
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
    sessionStorage.setItem('k9countdown', h + ':' + m + ':' + s);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ---- Mobile Nav Toggle (shared — all pages) ---- */
(function() {
  var btn = document.getElementById('hamburgerBtn');
  var nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function() {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
  });

  var links = nav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      btn.classList.remove('active');
      nav.classList.remove('open');
    });
  }
})();

/* ---- Home Page Tabs (index.html) ---- */
(function() {
  var tabBtns = document.querySelectorAll('.tabs .tab-btn');
  var tabContents = document.querySelectorAll('.tabs .tab-content');
  if (!tabBtns.length || !tabContents.length) return;

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-tab');
      if (!target) return;
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      tabContents.forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      var targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add('active');
    });
  });
})();

/* ---- Info Tabs (producto.html) ---- */
(function() {
  var btns = document.querySelectorAll('.info-tab-btn');
  var panels = document.querySelectorAll('.info-tab-panel');
  if (!btns.length || !panels.length) return;

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-infotab');
      if (!target) return;
      btns.forEach(function(b) {
        b.classList.remove('active');
        b.style.borderBottomColor = 'transparent';
        b.style.color = '';
      });
      panels.forEach(function(p) {
        p.classList.remove('active');
        p.style.display = 'none';
      });
      btn.classList.add('active');
      btn.style.borderBottomColor = 'var(--verde-oscuro)';
      btn.style.color = 'var(--verde-oscuro)';
      var targetEl = document.getElementById(target);
      if (targetEl) {
        targetEl.classList.add('active');
        targetEl.style.display = 'block';
      }
    });
  });
})();

/* ---- FAQ Accordion (producto.html) ---- */
(function() {
  var items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(function(item) {
    var question = item.querySelector('.faq__question');
    if (!question) return;
    question.addEventListener('click', function() {
      var isOpen = item.classList.contains('open');
      items.forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ---- Pack / Offer Selection (producto.html) ---- */
(function() {
  var opts = document.querySelectorAll('.offer-option');
  var variantInput = document.getElementById('selectedVariant');
  if (!opts.length) return;

  opts.forEach(function(o) {
    o.addEventListener('click', function() {
      opts.forEach(function(x) { x.classList.remove('selected'); });
      o.classList.add('selected');
      if (variantInput && o.dataset.variant) {
        variantInput.value = o.dataset.variant;
      }
    });
  });
})();

/* ---- Sticky CTA Mobile (shared — index + producto) ---- */
(function() {
  var stickyCta = document.getElementById('stickyCta');
  if (!stickyCta) return;

  // Try product hero first, then home hero
  var triggerSection = document.querySelector('.product-hero') || document.querySelector('.hero');
  if (!triggerSection) return;

  function checkSticky() {
    if (window.innerWidth <= 767) {
      var sectionBottom = triggerSection.getBoundingClientRect().bottom;
      if (sectionBottom < 0) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    } else {
      stickyCta.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkSticky, { passive: true });
  window.addEventListener('resize', checkSticky);
  checkSticky();
})();

/* ---- Scroll Animations / Fade-In (shared — all pages) ---- */
(function() {
  var fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(function(el) { observer.observe(el); });
})();

/* ---- Kaching: reemplazar bundle anterior en vez de acumular líneas ---- */
(function() {
  var section = document.querySelector('[data-product-id]');
  if (!section) return;
  var pid = section.dataset.productId;
  if (!pid) return;

  var _fetch = window.fetch.bind(window);

  window.fetch = function(input, init) {
    var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    if (url.indexOf('/cart/add') === -1) return _fetch(input, init);

    return _fetch('/cart.js')
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        var existing = (cart.items || []).filter(function(item) {
          return String(item.product_id) === String(pid);
        });
        if (!existing.length) return _fetch(input, init);

        return existing.reduce(function(chain, item) {
          return chain.then(function() {
            return _fetch('/cart/change.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: item.key, quantity: 0 })
            });
          });
        }, Promise.resolve()).then(function() {
          return _fetch(input, init);
        });
      })
      .catch(function() { return _fetch(input, init); });
  };
})();

/* ---- Track Buttons with Result Display (seguimiento.html) ---- */
(function() {
  var result = document.getElementById('trackResult');
  var btn1 = document.getElementById('trackBtn1');
  var btn2 = document.getElementById('trackBtn2');
  if (!result) return;

  function showResult() {
    result.classList.add('visible');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (btn1) {
    btn1.addEventListener('click', function() {
      var order = document.getElementById('orderNumber');
      var email = document.getElementById('emailPhone');
      if (order && email && order.value && email.value) {
        showResult();
      }
    });
  }

  if (btn2) {
    btn2.addEventListener('click', function() {
      var tracking = document.getElementById('trackingNumber');
      if (tracking && tracking.value) {
        showResult();
      }
    });
  }
})();
