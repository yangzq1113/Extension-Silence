/**
 * 初始化静默播放器扩展
 * 该扩展在设置面板中添加一个音频播放器，循环播放静音文件以保持音频活动
 */
jQuery(() => {
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));
    
    const audioHtml = `
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence_player_audio" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a" style="width: 100%;">
            </audio>
        </div>
    </div>`;

    getContainer().append(audioHtml);

    const audio = document.getElementById('silence_player_audio');

    /**
     * 尝试启动音频播放
     * 用于绕过浏览器对自动播放的限制
     */
    const startAudio = () => {
        if (audio && audio.paused) {
            audio.play().then(() => {
                console.log('Silence Player: 自动播放成功');
                // 成功播放后移除监听器
                document.removeEventListener('click', startAudio);
                document.removeEventListener('keydown', startAudio);
            }).catch(err => {
                // 仍然被拦截，等待下次交互
                console.debug('Silence Player: 等待用户交互以启动播放');
            });
        }
    };

    // 监听首次交互以确保自动播放
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
});
