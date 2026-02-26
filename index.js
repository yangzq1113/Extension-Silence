jQuery(() => {
    /**
     * 获取插件容器，优先查找特定的容器，否则使用扩展设置容器
     * @returns {jQuery} 容器对象
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

    // 注入 UI
    getContainer().append(`
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence_player_audio" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a" style="width: 100%;">
        </div>
    </div>`);

    const audio = document.getElementById('silence_player_audio');

    /**
     * 尝试播放音频并处理可能的自动播放限制
     */
    const startPlayback = async () => {
        try {
            if (audio.paused) {
                await audio.play();
                console.log('Silence Player: Autoplay started successfully.');
            }
        } catch (err) {
            console.warn('Silence Player: Autoplay blocked. Waiting for user interaction...', err);
        }
    };

    // 页面加载后立即尝试播放
    startPlayback();

    // 监听全局交互以绕过浏览器对自动播放的限制
    const handleInteraction = () => {
        startPlayback();
        // 成功播放后移除监听器，避免重复执行
        if (!audio.paused) {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
});
