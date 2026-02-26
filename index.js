/**
 * 初始化 Silence Player 插件
 * 在页面中添加音频播放器 UI，并尝试后台自动播放静音音频
 */
jQuery(() => {
    /**
     * 获取插件注入的容器
     * @returns {jQuery} 返回 jQuery 包装的 DOM 元素
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

    /**
     * 创建并注入 UI 面板
     */
    const injectUI = () => {
        const html = `
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Silence Player</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <audio id="silence_player_audio" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a" style="width: 100%;">
            </div>
        </div>`;
        getContainer().append(html);
    };

    /**
     * 尝试自动播放音频
     * 处理浏览器自动播放策略限制
     */
    const startAutoplay = () => {
        const audio = document.getElementById('silence_player_audio');
        if (!audio) return;

        // 尝试播放
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // 如果自动播放被拦截，监听首次交互后播放
                console.log('Silence Player: Autoplay blocked, waiting for interaction.');
                const playOnInteraction = () => {
                    audio.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('keydown', playOnInteraction);
            });
        }
    };

    // 执行初始化
    injectUI();
    startAutoplay();
});
