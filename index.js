/**
 * 插件入口，负责 UI 注入及启动音频播放逻辑
 */
jQuery(async () => {
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));
    
    // 注入 UI
    getContainer().append(`
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence_audio_player" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a" >
        </div>
    </div>`);

    // 获取注入的音频元素并启动逻辑
    const audioElement = document.getElementById('silence_audio_player');
    if (audioElement && window.SilenceAudioManager) {
        const audioManager = new window.SilenceAudioManager(audioElement);
        // 延迟一下确保音频元素已经挂载并准备好
        setTimeout(() => {
            audioManager.start();
        }, 500);
    }
});
