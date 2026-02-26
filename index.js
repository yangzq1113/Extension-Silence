/**
 * 插件入口模块
 * 负责 UI 注入及音频管理器的初始化
 */
jQuery(() => {
    /**
     * 获取设置面板容器
     * @returns {jQuery} jQuery 包装的容器元素
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

    /**
     * 注入 UI 组件并初始化音频
     */
    const initPlugin = () => {
        const $container = getContainer();
        const audioEl = window.SilenceManager.getAudioInstance();

        const $drawer = $(`
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Silence Player</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
            </div>
        </div>`);

        // 将音频元素插入到折叠内容中
        $drawer.find('.inline-drawer-content').append(audioEl);
        $container.append($drawer);

        // 页面刷新或进入时尝试自动播放
        window.SilenceManager.tryPlay();
    };

    initPlugin();
});
