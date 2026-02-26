/**
 * 获取静音播放器容器的 jQuery 对象
 * @returns {jQuery} 包含静音播放器容器的 jQuery 对象
 */
const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

/**
 * 初始化并注入静音播放器 UI，同时尝试自动播放
 */
const initSilencePlayer = () => {
    const $container = getContainer();
    const audioSrc = "/scripts/extensions/third-party/Extension-Silence/silence.m4a";
    
    // 构建 UI 结构
    const $playerHtml = $(`
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence_player_audio" autoplay loop controls src="${audioSrc}">
        </div>
    </div>`);

    $container.append($playerHtml);

    // 获取音频元素并尝试播放，处理浏览器的自动播放限制
    const audioElement = document.getElementById('silence_player_audio');
    if (audioElement) {
        audioElement.play().catch(error => {
            console.log("Silence Player: 自动播放被拦截，需要用户交互或在浏览器设置中允许。");
        });
    }
};

jQuery(initSilencePlayer);
