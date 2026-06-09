(function () {
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

    function resolve(path) {
        var root = document.body ? (document.body.getAttribute('data-root') || '') : '';
        return root + path;
    }

    function movieCard(item) {
        var tags = (item.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return '' +
            '<a class="movie-card compact" href="' + resolve(item.url) + '" title="' + escapeHtml(item.title) + '">' +
                '<span class="poster" style="--cover: url(\'' + resolve(item.cover) + '\');">' +
                    '<span class="poster-badge">' + escapeHtml(item.year || '热播') + '</span>' +
                    '<span class="poster-type">' + escapeHtml(item.type) + '</span>' +
                '</span>' +
                '<span class="card-content">' +
                    '<strong>' + escapeHtml(item.title) + '</strong>' +
                    '<em>' + escapeHtml(item.oneLine) + '</em>' +
                    '<span class="card-meta">' + escapeHtml(item.region) + ' · ' + escapeHtml(item.genre) + '</span>' +
                    '<span class="tag-row">' + tags + '</span>' +
                '</span>' +
            '</a>';
    }

    ready(function () {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-mobile-nav]');

        if (button && nav) {
            button.addEventListener('click', function () {
                nav.classList.toggle('open');
            });
        }

        var form = document.querySelector('[data-search-form]');
        var resultBox = document.querySelector('[data-search-results]');
        var emptyBox = document.querySelector('[data-search-empty]');

        if (form && resultBox && window.MOVIE_SEARCH_INDEX) {
            var input = form.querySelector('[name="keyword"]');
            var category = form.querySelector('[name="category"]');
            var type = form.querySelector('[name="type"]');

            function render() {
                var keyword = text(input.value).trim();
                var categoryValue = category.value;
                var typeValue = type.value;

                var matches = window.MOVIE_SEARCH_INDEX.filter(function (item) {
                    var keywordMatch = !keyword || [item.title, item.oneLine, item.region, item.genre, (item.tags || []).join(' ')]
                        .map(text)
                        .join(' ')
                        .indexOf(keyword) !== -1;
                    var categoryMatch = !categoryValue || item.category === categoryValue;
                    var typeMatch = !typeValue || item.type === typeValue;
                    return keywordMatch && categoryMatch && typeMatch;
                }).slice(0, 24);

                resultBox.innerHTML = matches.map(movieCard).join('');
                if (emptyBox) {
                    emptyBox.hidden = matches.length > 0;
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                render();
            });

            input.addEventListener('input', render);
            category.addEventListener('change', render);
            type.addEventListener('change', render);
            render();
        }
    });
})();
