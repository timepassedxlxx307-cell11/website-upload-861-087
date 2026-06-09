(function () {
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".menu-toggle");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length > 1) {
        var current = 0;
        var showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        };
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    var filterInput = document.querySelector(".filter-input");
    var yearSelect = document.querySelector(".year-filter");
    var typeSelect = document.querySelector(".type-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var runFilter = function () {
        if (!cards.length) {
            return;
        }
        var q = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        cards.forEach(function (card) {
            var text = (card.getAttribute("data-keywords") || "").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var cardType = card.getAttribute("data-type") || "";
            var ok = (!q || text.indexOf(q) >= 0) && (!year || cardYear === year) && (!type || cardType.indexOf(type) >= 0);
            card.style.display = ok ? "" : "none";
        });
    };
    if (filterInput) {
        filterInput.addEventListener("input", runFilter);
    }
    if (yearSelect) {
        yearSelect.addEventListener("change", runFilter);
    }
    if (typeSelect) {
        typeSelect.addEventListener("change", runFilter);
    }

    var searchForm = document.querySelector(".site-search-form");
    var searchInput = document.querySelector(".site-search-input");
    var results = document.querySelector(".search-results");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    if (searchInput && initialQuery) {
        searchInput.value = initialQuery;
    }
    var renderSearch = function (query) {
        if (!results || !window.SEARCH_MOVIES) {
            return;
        }
        var q = (query || "").trim().toLowerCase();
        var data = window.SEARCH_MOVIES.filter(function (item) {
            var text = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.one].join(" ").toLowerCase();
            return !q || text.indexOf(q) >= 0;
        }).slice(0, 120);
        if (!data.length) {
            results.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
            return;
        }
        results.innerHTML = '<div class="movie-grid">' + data.map(function (item) {
            return '<article class="movie-card">' +
                '<a class="poster-link" href="' + item.url + '"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"><span class="poster-badge">' + escapeHtml(item.year) + '</span></a>' +
                '<div class="movie-card-body"><div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>' +
                '<h2 class="movie-card-title"><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>' +
                '<p>' + escapeHtml(item.one) + '</p><div class="tag-row"><span>' + escapeHtml(item.genre) + '</span></div></div></article>';
        }).join("") + '</div>';
    };
    var escapeHtml = function (value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"}[char];
        });
    };
    if (results && window.SEARCH_MOVIES) {
        renderSearch(initialQuery);
    }
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var value = searchInput.value.trim();
            var next = value ? "?q=" + encodeURIComponent(value) : window.location.pathname;
            window.history.replaceState(null, "", next);
            renderSearch(value);
        });
    }
})();
