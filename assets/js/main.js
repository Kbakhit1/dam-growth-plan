/* دام — سلوك الموقع */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- شريط التقدم + إخفاء الهيدر عند النزول ---- */
  var bar = document.getElementById('progress');
  var header = document.querySelector('.site-header');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var sc = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (bar) bar.style.width = (sc * 100) + '%';
    if (header) {
      var y = h.scrollTop;
      header.classList.toggle('hide', y > 420 && y > lastY);
      lastY = y;
    }
  }, { passive: true });

  /* ---- خلفية النقاط المتحركة في الهيرو ---- */
  var cv = document.getElementById('dots');
  if (cv && !reduced) {
    /* تثبيت مقاس العنصر بالستايل المباشر: بدونه مقاس الكانفاس يتبع البيتماب (offsetWidth×DPR) فينفخ الصفحة أفقيًا على شاشات الموبايل */
    cv.style.width = '100%';
    cv.style.height = '100%';
    var ctx = cv.getContext('2d');
    var W, H, pts = [];
    function resize() {
      W = cv.width = cv.offsetWidth * devicePixelRatio;
      H = cv.height = cv.offsetHeight * devicePixelRatio;
      pts = [];
      var gap = 46 * devicePixelRatio;
      for (var x = gap / 2; x < W; x += gap)
        for (var y = gap / 2; y < H; y += gap)
          pts.push({ x: x, y: y, p: Math.random() * Math.PI * 2 });
    }
    resize(); window.addEventListener('resize', resize);
    (function tick(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var d = pts[i];
        var a = 0.10 + 0.10 * Math.sin(t / 1600 + d.p);
        ctx.fillStyle = 'rgba(242,193,78,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.6 * devicePixelRatio, 0, 7);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    })(0);
  }

  /* ---- عدادات الأرقام ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1800, t0 = null;
    var fmt = new Intl.NumberFormat('ar-EG');
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    if (reduced) { el.textContent = fmt.format(target) + suffix; return; }
    requestAnimationFrame(step);
  }
  var counted = false;
  var statsEl = document.querySelector('.stats');
  if (statsEl) {
    new IntersectionObserver(function (en, ob) {
      if (en[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('[data-count]').forEach(animateCount);
        ob.disconnect();
      }
    }, { threshold: .3 }).observe(statsEl);
  }

  /* ---- ظهور العناصر بالتمرير (GSAP لو متاح، وإلا IO) ---- */
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease: 'power3.out',
        delay: (i % 4) * 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    /* مواضع الترجرز تتحسب قبل اكتمال الخطوط/الصور — إعادة الحساب بعد اللود تمنع بقاء عناصر مخفية على الموبايل */
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
  }

  /* ---- KPI bars ---- */
  document.querySelectorAll('.kpis').forEach(function (k) {
    new IntersectionObserver(function (en, ob) {
      if (en[0].isIntersecting) {
        k.querySelectorAll('.bar i').forEach(function (b) {
          b.style.width = b.getAttribute('data-w') + '%';
        });
        ob.disconnect();
      }
    }, { threshold: .3 }).observe(k);
  });

  /* ---- تمييز رابط القسم النشط في القائمة ---- */
  var navLinks = document.querySelectorAll('.top-nav a[href^="#"]');
  if (navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe // placeholder
      ; // (نفعّلها بالحلقة تحت)
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  /* ---- تجهيز الطباعة/PDF: فتح كل البنود المطوية وملء العدادات ---- */
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details:not([open])').forEach(function (d) {
      d.setAttribute('data-print-opened', '1');
      d.open = true;
    });
    var fmt = new Intl.NumberFormat('ar-EG');
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (!el.textContent.trim()) {
        el.textContent = fmt.format(parseFloat(el.getAttribute('data-count'))) + (el.getAttribute('data-suffix') || '');
      }
    });
  });
  window.addEventListener('afterprint', function () {
    document.querySelectorAll('details[data-print-opened]').forEach(function (d) {
      d.open = false;
      d.removeAttribute('data-print-opened');
    });
  });

  /* ---- فتح الروابط العميقة على القسم مع تعويض الهيدر ---- */
  function offsetJump() {
    if (location.hash) {
      var el = document.querySelector(location.hash);
      if (el) setTimeout(function () {
        var y = el.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }, 60);
    }
  }
  window.addEventListener('hashchange', offsetJump);
  offsetJump();
})();
