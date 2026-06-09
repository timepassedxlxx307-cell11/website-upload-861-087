(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function card(item) {
    return '<a class="movie-card" href="./' + escapeHtml(item.file) + '">' +
      '<figure>' +
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<figcaption>' + escapeHtml(item.year) + '</figcaption>' +
      '</figure>' +
      '<div class="movie-card-body">' +
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<p>' + escapeHtml(item.oneLine) + '</p>' +
      '<div class="movie-meta-row"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>' +
      '</div>' +
      '</a>';
  }

  var input = document.querySelector('[data-search-input]');
  var result = document.querySelector('[data-search-results]');
  var empty = document.querySelector('[data-search-empty]');
  var items = typeof SiteSearchItems !== 'undefined' ? SiteSearchItems : [];

  if (!input || !result) {
    return;
  }

  function run(value) {
    var keyword = String(value || '').trim().toLowerCase();
    var matches = [];

    if (keyword) {
      matches = items.filter(function (item) {
        return item.text.indexOf(keyword) !== -1;
      }).slice(0, 96);
    }

    result.innerHTML = matches.map(card).join('');

    if (empty) {
      empty.hidden = keyword ? matches.length !== 0 : true;
    }
  }

  var start = getQuery();
  input.value = start;
  run(start);

  input.addEventListener('input', function () {
    run(input.value);
  });
})();
