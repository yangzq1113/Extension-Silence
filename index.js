jQuery(() => {
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

    const markup = `
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence_audio" autoplay loop controls muted playsinline webkit-playsinline src="/scripts/extensions/third-party/Extension-Silence/silence.m4a"></audio>
        </div>
    </div>`;

    const $container = getContainer();
    $container.append(markup);

    const audioEl = document.getElementById('silence_audio');
    if (audioEl instanceof HTMLMediaElement) {
        audioEl.muted = true;
        audioEl.volume = 0;
        audioEl.autoplay = true;
        audioEl.loop = true;
        audioEl.setAttribute('playsinline', '');
        audioEl.setAttribute('webkit-playsinline', '');

        const tryPlay = () => {
            const p = audioEl.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => {});
            }
        };

        const onInteract = () => {
            tryPlay();
            document.removeEventListener('pointerdown', onInteract, true);
            document.removeEventListener('keydown', onInteract, true);
        };

        audioEl.addEventListener('canplay', tryPlay, { once: true });
        document.addEventListener('pointerdown', onInteract, true);
        document.addEventListener('keydown', onInteract, true);

        tryPlay();
    }
});
