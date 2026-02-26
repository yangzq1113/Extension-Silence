/**
 * 初始化静默播放器扩展
 * 确保音频在后台全局自动播放，不受扩展页面是否打开的限制
 */
jQuery(() => {
    const audioId = 'silence_player_audio';
    const drawerId = 'silence_player_drawer';
    const audioSrc = '/scripts/extensions/third-party/Extension-Silence/silence.m4a';

    /**
     * 创建并初始化音频播放器及 UI
     * 首先将其添加到 body 以实现后台自动播放
     */
    const initSilencePlayer = () => {
        if (document.getElementById(drawerId)) return;

        const audioHtml = `
        <div id="${drawerId}" class="inline-drawer" style="display: none;">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Silence Player</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <audio id="${audioId}" autoplay loop controls src="${audioSrc}" style="width: 100%;">
                </audio>
            </div>
        </div>`;

        // 初始添加到 body，确保脚本加载即开始尝试播放
        $('body').append(audioHtml);

        const audio = document.getElementById(audioId);

        /**
         * 尝试启动音频播放
         * 监听全局交互以绕过浏览器的自动播放限制
         */
        const startAudio = () => {
            if (audio && audio.paused) {
                audio.play().then(() => {
                    console.log('Silence Player: 全局后台播放启动成功');
                    // 成功后可移除监听，但为了保险起见，可以在此处保留或按需移除
                    document.removeEventListener('click', startAudio);
                    document.removeEventListener('keydown', startAudio);
                }).catch(() => {
                    console.debug('Silence Player: 等待用户交互以激活音频上下文');
                });
            }
        };

        document.addEventListener('click', startAudio);
        document.addEventListener('keydown', startAudio);
        
        // 立即尝试播放一次
        startAudio();
    };

    /**
     * 动态挂载 UI 到扩展设置面板
     * 适配单页应用（SPA），当设置面板出现时将 UI 移动到正确位置
     */
    const mountUIToSettings = () => {
        const $container = $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));
        const $drawer = $(`#${drawerId}`);

        if ($container.length > 0 && $drawer.length > 0) {
            // 只有当不在目标容器内时才进行移动
            if ($drawer.parent()[0] !== $container[0]) {
                $drawer.appendTo($container).show();
                console.log('Silence Player: UI 已挂载到设置面板');
            }
        }
    };

    // 初始化全局播放器
    initSilencePlayer();

    // 轮询检查设置面板状态，实现动态挂载
    setInterval(mountUIToSettings, 1000);
});
