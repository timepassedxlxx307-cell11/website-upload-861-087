(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var activate = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
      });
    });
    activate(0);
    window.setInterval(function () {
      activate(current + 1);
    }, 5200);
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  if (cards.length) {
    var searchInput = document.querySelector('[data-search-input]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var emptyState = document.querySelector('[data-empty-state]');
    var normalize = function (value) {
      return String(value || '').trim().toLowerCase();
    };
    var applyFilters = function () {
      var query = normalize(searchInput && searchInput.value);
      var region = normalize(regionSelect && regionSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var year = normalize(yearSelect && yearSelect.value);
      var category = normalize(categorySelect && categorySelect.value);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year
        ].join(' '));
        var match = true;
        if (query && text.indexOf(query) === -1) {
          match = false;
        }
        if (region && normalize(card.dataset.region) !== region) {
          match = false;
        }
        if (type && normalize(card.dataset.type) !== type) {
          match = false;
        }
        if (year && normalize(card.dataset.year) !== year) {
          match = false;
        }
        if (category && normalize(card.querySelector('.movie-meta-line a') && card.querySelector('.movie-meta-line a').textContent) !== category) {
          match = false;
        }
        card.classList.toggle('is-hidden', !match);
        if (match) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.classList.toggle('visible', visible === 0);
      }
    };
    [searchInput, regionSelect, typeSelect, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
    applyFilters();
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-player-cover]');
    var playButton = player.querySelector('[data-play-button]');
    var hlsInstance = null;
    var prepare = function () {
      if (!video || video.dataset.ready === '1') {
        return;
      }
      var stream = video.dataset.stream;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }
      video.dataset.ready = '1';
    };
    var start = function () {
      prepare();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      if (video) {
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }
    };
    if (playButton) {
      playButton.addEventListener('click', start);
    }
    if (cover) {
      cover.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
