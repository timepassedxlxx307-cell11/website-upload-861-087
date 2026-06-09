(function () {
  var navButton = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (navButton && mobileMenu) {
    navButton.addEventListener('click', function () {
      var open = mobileMenu.hasAttribute('hidden');
      if (open) {
        mobileMenu.removeAttribute('hidden');
      } else {
        mobileMenu.setAttribute('hidden', '');
      }
      navButton.setAttribute('aria-expanded', String(open));
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide') || 0));
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchInput = document.querySelector('.page-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
  var activeFilter = '';

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = normalize(searchInput ? searchInput.value : '');

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year')
      ].join(' '));

      var matchQuery = !query || haystack.indexOf(query) !== -1;
      var matchFilter = !activeFilter || haystack.indexOf(normalize(activeFilter)) !== -1;
      card.style.display = matchQuery && matchFilter ? '' : 'none';
    });
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var preset = params.get('q');
    if (preset) {
      searchInput.value = preset;
    }
    searchInput.addEventListener('input', applyFilters);
    applyFilters();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      activeFilter = button.getAttribute('data-filter') || '';
      applyFilters();
    });
  });

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.opacity = '0';
    }, { once: true });
  });

  function playShell(shell) {
    var video = shell.querySelector('video');
    var url = shell.getAttribute('data-video-url');

    if (!video || !url) {
      return;
    }

    shell.classList.add('is-playing');

    if (video.dataset.ready !== 'true') {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        video._hls = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        video.src = url;
      }
      video.dataset.ready = 'true';
    }

    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  document.querySelectorAll('.player-shell').forEach(function (shell) {
    var cover = shell.querySelector('.play-cover');
    if (cover) {
      cover.addEventListener('click', function () {
        playShell(shell);
      });
    }
  });

  document.querySelectorAll('.play-trigger').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      var shell = document.querySelector('.player-shell');
      if (shell) {
        playShell(shell);
        shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('is-visible', window.scrollY > 500);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
