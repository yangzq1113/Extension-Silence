/**
 * 获取插件 UI 的容器
 * @returns {jQuery}
 */
const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

/**
 * 尝试播放静音音频
 * @param {HTMLAudioElement} audio 
 */
async function tryPlay(audio) {
    try {
        await audio.play();
        console.log('Silence Player: Autoplay started successfully.');
    } catch (error) {
        console.warn('Silence Player: Autoplay blocked. Waiting for user interaction.');
        // 浏览器通常在用户第一次点击后允许播放
        $(document).one('click', () => {
            audio.play().catch(e => console.error('Silence Player: Play failed after interaction.', e));
        });
    }
}

/**
 * 初始化 Silence Player 插件
 */
function initSilencePlayer() {
    const audioSrc = '/scripts/extensions/third-party/Extension-Silence/silence.m4a';
    
    const html = `
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player (Background)</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <p>Silence audio is playing in the background to keep the session active.</p>
            <audio id="silence_player_audio" loop src="${audioSrc}"></audio>
        </div>
    </div>`;

    getContainer().append(html);

    const audio = document.getElementById('silence_player_audio');
    if (audio) {
        tryPlay(audio);
    }
}

jQuery(initSilencePlayer);
