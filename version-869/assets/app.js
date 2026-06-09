(function() {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function text(value) {
        return String(value || '').toLowerCase();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function initNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var nav = document.querySelector('[data-site-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function() {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function() {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                show(Number(dot.getAttribute('data-hero-dot')));
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    function initCategoryFilter() {
        var form = document.querySelector('[data-filter-form]');
        if (!form) {
            return;
        }
        var input = form.querySelector('[data-filter-input]');
        var region = form.querySelector('[data-region-filter]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));

        function update() {
            var query = text(input && input.value);
            var regionValue = text(region && region.value);
            cards.forEach(function(card) {
                var haystack = text(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-year'));
                var cardRegion = text(card.getAttribute('data-region'));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchRegion = !regionValue || cardRegion.indexOf(regionValue) !== -1;
                card.classList.toggle('is-filter-hidden', !(matchQuery && matchRegion));
            });
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            update();
        });
        if (input) {
            input.addEventListener('input', update);
        }
        if (region) {
            region.addEventListener('change', update);
        }
    }

    function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 2).map(function(tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<a class="movie-card" href="' + escapeHtml(movie.url) + '">' +
            '<span class="poster-wrap">' +
                '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                '<span class="poster-year">' + escapeHtml(movie.year) + '</span>' +
                '<span class="poster-meta">' + escapeHtml(movie.region) + '</span>' +
            '</span>' +
            '<span class="card-copy">' +
                '<strong>' + escapeHtml(movie.title) + '</strong>' +
                '<small>' + escapeHtml(movie.genre) + '</small>' +
                '<span class="tag-row">' + tags + '</span>' +
            '</span>' +
        '</a>';
    }

    function initSearch() {
        var results = document.querySelector('[data-search-results]');
        var input = document.querySelector('[data-search-input]');
        var form = document.querySelector('[data-search-form]');
        var defaults = document.querySelector('[data-search-default]');
        var section = document.querySelector('[data-search-section]');
        if (!results || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (input) {
            input.value = initial;
        }

        function render(query) {
            var normalized = text(query);
            if (!normalized) {
                results.innerHTML = '';
                if (defaults) {
                    defaults.style.display = '';
                }
                if (section) {
                    section.style.display = 'none';
                }
                return;
            }
            var filtered = window.SEARCH_MOVIES.filter(function(movie) {
                var haystack = text(movie.title + ' ' + movie.oneLine + ' ' + movie.genre + ' ' + movie.region + ' ' + (movie.tags || []).join(' '));
                return haystack.indexOf(normalized) !== -1;
            }).slice(0, 80);
            results.innerHTML = filtered.length ? filtered.map(movieCard).join('') : '<p class="content-card">未找到相关影片</p>';
            if (defaults) {
                defaults.style.display = 'none';
            }
            if (section) {
                section.style.display = '';
            }
        }

        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                var query = input ? input.value : '';
                var url = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
                window.history.replaceState(null, '', url);
                render(query);
            });
        }
        if (input) {
            input.addEventListener('input', function() {
                render(input.value);
            });
        }
        render(initial);
    }

    ready(function() {
        initNavigation();
        initHero();
        initCategoryFilter();
        initSearch();
    });
}());
