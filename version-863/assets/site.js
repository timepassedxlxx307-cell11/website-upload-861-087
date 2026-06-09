(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var mobileMenu = document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            var opened = mobileMenu.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    var backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", function () {
            if (window.pageYOffset > 360) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var target = Number(dot.getAttribute("data-target"));
            showSlide(target);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var searchableLists = Array.prototype.slice.call(document.querySelectorAll(".searchable-list"));

    searchableLists.forEach(function (list) {
        var container = list.closest(".section-block") || document;
        var searchInput = container.querySelector(".js-search");
        var regionSelect = container.querySelector(".js-region-filter");
        var typeSelect = container.querySelector(".js-type-filter");
        var clearButton = container.querySelector(".clear-filter");
        var emptyState = container.querySelector(".empty-state");
        var items = Array.prototype.slice.call(list.querySelectorAll(".movie-card, .rank-item"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilters() {
            var query = normalize(searchInput ? searchInput.value : "");
            var region = normalize(regionSelect ? regionSelect.value : "");
            var type = normalize(typeSelect ? typeSelect.value : "");
            var visibleCount = 0;

            items.forEach(function (item) {
                var haystack = normalize([
                    item.getAttribute("data-title"),
                    item.getAttribute("data-region"),
                    item.getAttribute("data-type"),
                    item.getAttribute("data-year"),
                    item.getAttribute("data-genre")
                ].join(" "));
                var itemRegion = normalize(item.getAttribute("data-region"));
                var itemType = normalize(item.getAttribute("data-type"));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchRegion = !region || itemRegion.indexOf(region) !== -1;
                var matchType = !type || itemType.indexOf(type) !== -1;
                var visible = matchQuery && matchRegion && matchType;

                item.style.display = visible ? "" : "none";

                if (visible) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("show", visibleCount === 0);
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (regionSelect) {
            regionSelect.addEventListener("change", applyFilters);
        }

        if (typeSelect) {
            typeSelect.addEventListener("change", applyFilters);
        }

        if (clearButton) {
            clearButton.addEventListener("click", function () {
                if (searchInput) {
                    searchInput.value = "";
                }

                if (regionSelect) {
                    regionSelect.value = "";
                }

                if (typeSelect) {
                    typeSelect.value = "";
                }

                applyFilters();
            });
        }
    });
})();

function initMoviePagePlayer(streamUrl) {
    var shell = document.querySelector("[data-player]");

    if (!shell || !streamUrl) {
        return;
    }

    var video = shell.querySelector("video");
    var cover = shell.querySelector(".player-cover");
    var hlsInstance = null;
    var ready = false;

    function bindSource() {
        if (!video || ready) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            ready = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            ready = true;
            return;
        }

        video.src = streamUrl;
        ready = true;
    }

    function startPlayback() {
        bindSource();

        if (cover) {
            cover.classList.add("is-hidden");
        }

        if (video) {
            var promise = video.play();

            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    video.controls = true;
                });
            }
        }
    }

    if (cover) {
        cover.addEventListener("click", startPlayback);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
    }
}
