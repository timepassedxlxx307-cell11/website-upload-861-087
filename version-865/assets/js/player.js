(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var video = document.querySelector('[data-player-video]');
        var playButton = document.querySelector('[data-player-button]');

        if (!video) {
            return;
        }

        var source = video.getAttribute('data-src');
        var hls = null;

        function attachSource() {
            if (!source) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            }
        }

        function startPlayback() {
            if (!source) {
                return;
            }

            if (video.paused) {
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {
                        video.controls = true;
                    });
                }
            } else {
                video.pause();
            }
        }

        attachSource();

        video.addEventListener('click', startPlayback);
        video.addEventListener('play', function () {
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (playButton && video.currentTime === 0) {
                playButton.classList.remove('is-hidden');
            }
        });

        if (playButton) {
            playButton.addEventListener('click', function () {
                playButton.classList.add('is-hidden');
                startPlayback();
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
