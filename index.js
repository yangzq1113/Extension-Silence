/**
 * 初始化全局静音音频播放器
 * 确保音频在后台自动播放，无论是否打开设置界面
 */
function initGlobalSilenceAudio() {
    if (document.getElementById('silence_audio_global')) return;

    const audio = document.createElement('audio');
    audio.id = 'silence_audio_global';
    audio.src = '/scripts/extensions/third-party/Extension-Silence/silence.m4a';
    audio.loop = true;
    audio.style.display = 'none'; // 隐藏全局音频对象
    document.body.appendChild(audio);

    /**
     * 尝试启动播放，处理浏览器自动播放策略限制
     */
    const startPlayback = () => {
        audio.play().then(() => {
            console.log('Silence Player: 自动播放已成功启动');
            // 成功后移除交互监听
            $(document).off('click.silence_starter touchstart.silence_starter');
        }).catch(err => {
            console.warn('Silence Player: 自动播放被拦截，等待用户交互...', err);
        });
    };

    // 立即尝试播放
    startPlayback();

    // 注册全局交互监听，一旦用户点击页面任何地方即启动（绕过浏览器限制）
    $(document).on('click.silence_starter touchstart.silence_starter', startPlayback);
}

/**
 * 注入插件设置界面的 UI
 * 保留控制按键及功能，控制全局音频对象
 */
function injectSilenceUI() {
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));
    const container = getContainer();

    if (container.length === 0) {
        // 如果容器尚未加载，稍后重试
        setTimeout(injectSilenceUI, 500);
        return;
    }

    // 如果已经注入过则不再重复
    if (document.getElementById('silence_ui_drawer')) return;

    const uiHtml = `
    <div id="silence_ui_drawer" class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <div class="silence_controls_wrapper" style="padding: 10px; display: flex; align-items: center; gap: 10px;">
                <span>后台保活播放器</span>
                <audio id="silence_ui_proxy" controls loop src="/scripts/extensions/third-party/Extension-Silence/silence.m4a" style="width: 100%;"></audio>
            </div>
        </div>
    </div>`;

    container.append(uiHtml);

    // 同步 UI 播放器与全局播放器的状态
    const globalAudio = document.getElementById('silence_audio_global');
    const uiAudio = document.getElementById('silence_ui_proxy');

    if (globalAudio && uiAudio) {
        // UI 上的操作同步到全局音频
        uiAudio.onplay = () => globalAudio.play();
        uiAudio.onpause = () => globalAudio.pause();
        uiAudio.onvolumechange = () => { globalAudio.volume = uiAudio.volume; };

        // 全局音频状态同步回 UI (防止状态不一致)
        globalAudio.onplay = () => { if (uiAudio.paused) uiAudio.play(); };
        globalAudio.onpause = () => { if (!uiAudio.paused) uiAudio.pause(); };
    }
}

// 脚本加载后立即执行
initGlobalSilenceAudio();

// 等待页面准备好后注入 UI
jQuery(() => {
    injectSilenceUI();
});
