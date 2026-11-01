/* Motion matching the index page: page entrance, scroll reveals, and link exit */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    var candidates = document.querySelectorAll('.content-block, .pf-carousel, .is-content > *, .semplice-cover');
    if ('IntersectionObserver' in window && candidates.length) {
      document.documentElement.classList.add('motion-reveal-ready');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
      candidates.forEach(function (el) {
        if (el.closest('header') || el.classList.contains('motion-visible')) return;
        el.classList.add('motion-reveal');
        observer.observe(el);
      });
    }
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      var url;
      try { url = new URL(href, window.location.href); } catch (e) { return; }
      if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin || reduceMotion) return;
      event.preventDefault();
      document.body.style.transition = 'opacity .25s ease, transform .25s ease';
      document.body.style.opacity = '0';
      document.body.style.transform = 'translateY(-5px)';
      window.setTimeout(function () { window.location.assign(url.href); }, 240);
    }, true);
  }
})();
