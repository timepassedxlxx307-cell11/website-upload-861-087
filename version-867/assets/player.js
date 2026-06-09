(function () {
  function bindPlayer(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.play-cover');
    var streamUrl = box.getAttribute('data-stream');
    var hls = null;
    var mounted = false;

    if (!video || !streamUrl) {
      return;
    }

    function requestPlay() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function mount() {
      box.classList.add('is-playing');

      if (mounted) {
        requestPlay();
        return;
      }

      mounted = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        requestPlay();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(streamUrl);
          requestPlay();
        });
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          requestPlay();
        });
        return;
      }

      video.src = streamUrl;
      requestPlay();
    }

    if (cover) {
      cover.addEventListener('click', mount);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        mount();
      }
    });

    video.addEventListener('play', function () {
      box.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0) {
        box.classList.remove('is-playing');
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(bindPlayer);
})();
