/**
 * 音频播放器类，处理自动播放逻辑和浏览器限制
 */
class SilencePlayer {
    /**
     * @param {string} src 音频源地址
     */
    constructor(src) {
        this.src = src;
        this.audio = new Audio(this.src);
        this.audio.loop = true;
        // 关键：静音播放通常被浏览器允许自动播放
        this.audio.muted = true;
        this.isInitialized = false;

        this.init();
    }

    /**
     * 初始化播放器
     */
    async init() {
        try {
            await this.audio.play();
            console.log('Silence Player: 自动静音播放成功');
            this.isInitialized = true;
        } catch (error) {
            console.warn('Silence Player: 自动播放被拦截，等待用户交互...', error);
        }
        
        // 无论是否成功，都监听交互以尝试解除静音或重新播放
        this.setupInteractionListeners();
    }

    /**
     * 设置用户交互监听器，用于解除自动播放限制或取消静音
     */
    setupInteractionListeners() {
        const unlock = async () => {
            try {
                // 用户点击后，尝试取消静音并播放
                this.audio.muted = false;
                await this.audio.play();
                console.log('Silence Player: 交互后播放成功（已取消静音）');
                this.isInitialized = true;
                this.removeInteractionListeners(unlock);
            } catch (error) {
                console.error('Silence Player: 交互后播放失败', error);
            }
        };

        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
    }

    /**
     * 移除交互监听器
     * @param {Function} callback 
     */
    removeInteractionListeners(callback) {
        window.removeEventListener('click', callback);
        window.removeEventListener('touchstart', callback);
        window.removeEventListener('keydown', callback);
    }
}

jQuery(() => {
    const audioSrc = "/scripts/extensions/third-party/Extension-Silence/silence.m4a";
    const player = new SilencePlayer(audioSrc);

    /**
     * 获取容器
     * @returns {jQuery}
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));
    
    // 渲染 UI
    getContainer().append(`
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <div style="padding: 10px; display: flex; flex-direction: column; gap: 10px;">
                <div id="silence-status" style="font-size: 0.9em; color: var(--grey);">状态: 初始化中...</div>
                <div id="silence-audio-container"></div>
            </div>
        </div>
    </div>`);

    const $status = $('#silence-status');
    const nativeAudio = player.audio;

    // 将原生的 audio 对象插入 DOM 以显示控件
    nativeAudio.controls = true;
    nativeAudio.style.width = '100%';
    nativeAudio.id = 'silence-audio-element';
    $('#silence-audio-container').append(nativeAudio);
    
    // 同步状态
    const syncUI = () => {
        if (nativeAudio.paused) {
            $status.text('状态: 已暂停 (点击页面任何地方以激活)');
            $status.css('color', 'var(--red)');
        } else {
            $status.text(nativeAudio.muted ? '状态: 正在自动播放 (静音模式)' : '状态: 正在播放');
            $status.css('color', 'var(--green)');
        }
    };

    nativeAudio.onplay = syncUI;
    nativeAudio.onpause = syncUI;
    nativeAudio.onvolumechange = syncUI;

    // 初始同步
    syncUI();
});
