/**
 * 获取静音播放器的挂载容器
 */
const getSilenceContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

/**
 * 初始化静音播放器 UI
 */
const initSilencePlayer = () => {
    const container = getSilenceContainer();
    container.append(`
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence_player_audio" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a"></audio>
        </div>
    </div>`);
};

/**
 * 绑定自动播放逻辑，尽量在无需点击播放按钮的前提下开始播放
 */
const bindSilenceAutoPlay = () => {
    const audioElement = document.getElementById('silence_player_audio');
    if (!audioElement) {
        return;
    }

    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

    const cleanup = () => {
        events.forEach(eventName => window.removeEventListener(eventName, handleUserGesture));
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    const tryPlay = () => {
        const playResult = audioElement.play();
        if (playResult && typeof playResult.then === 'function') {
            playResult.then(() => {
                cleanup();
            }).catch(() => {
            });
        } else {
            cleanup();
        }
    };

    const handleUserGesture = () => {
        tryPlay();
    };

    const handleVisibilityChange = () => {
        if (!document.hidden) {
            tryPlay();
        }
    };

    events.forEach(eventName => window.addEventListener(eventName, handleUserGesture));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    tryPlay();
};

jQuery(() => {
    initSilencePlayer();
    bindSilenceAutoPlay();
});
