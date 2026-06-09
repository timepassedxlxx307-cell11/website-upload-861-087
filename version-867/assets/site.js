(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navToggle = $('[data-nav-toggle]');
  var mainNav = $('[data-main-nav]');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  $all('form.top-search').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        if (input) {
          input.focus();
        }
      }
    });
  });

  $all('[data-slider]').forEach(function (slider) {
    var slides = $all('.hero-slide', slider);
    var dots = $all('[data-slide-dot]', slider);
    var prev = $('[data-slide-prev]', slider);
    var next = $('[data-slide-next]', slider);
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    show(0);
    restart();
  });

  $all('[data-filter-panel]').forEach(function (panel) {
    var root = panel.parentElement || document;
    var input = $('[data-filter-input]', panel);
    var year = $('[data-filter-year]', panel);
    var type = $('[data-filter-type]', panel);
    var items = $all('[data-filter-item]', root);
    var empty = $('[data-filter-empty]', root);

    function run() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';
      var visible = 0;

      items.forEach(function (item) {
        var text = item.getAttribute('data-text') || '';
        var itemYear = item.getAttribute('data-year') || '';
        var itemType = item.getAttribute('data-type') || '';
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (yearValue && itemYear !== yearValue) {
          matched = false;
        }

        if (typeValue && itemType !== typeValue) {
          matched = false;
        }

        item.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [input, year, type].forEach(function (node) {
      if (node) {
        node.addEventListener('input', run);
        node.addEventListener('change', run);
      }
    });

    run();
  });
})();
