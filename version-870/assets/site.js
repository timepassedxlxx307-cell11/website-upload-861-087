(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (slides.length > 1) {
        var activeIndex = 0;
        var showSlide = function (index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === activeIndex);
            });
        };
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5600);
    }

    var searchInput = document.querySelector('[data-search-input]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var regionFilter = document.querySelector('[data-region-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
    var normalize = function (value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    };
    var applyFilters = function () {
        var query = normalize(searchInput ? searchInput.value : '');
        var selectedType = normalize(typeFilter ? typeFilter.value : '');
        var selectedRegion = normalize(regionFilter ? regionFilter.value : '');
        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-year')
            ].join(' '));
            var cardType = normalize(card.getAttribute('data-type'));
            var cardRegion = normalize(card.getAttribute('data-region'));
            var matched = true;
            if (query && haystack.indexOf(query) === -1) {
                matched = false;
            }
            if (selectedType && cardType !== selectedType) {
                matched = false;
            }
            if (selectedRegion && cardRegion !== selectedRegion) {
                matched = false;
            }
            card.classList.toggle('hidden-card', !matched);
        });
    };
    [searchInput, typeFilter, regionFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });
})();
