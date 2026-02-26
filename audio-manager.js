/**
 * 音频管理器模块
 * 负责静音音频的加载、自动播放逻辑处理以及状态维护
 */
(function() {
    const AUDIO_SRC = '/scripts/extensions/third-party/Extension-Silence/silence.m4a';
    let audioInstance = null;

    /**
     * 获取或创建音频实例
     * @returns {HTMLAudioElement} 音频对象
     */
    function getAudioInstance() {
        if (!audioInstance) {
            audioInstance = document.createElement('audio');
            audioInstance.src = AUDIO_SRC;
            audioInstance.loop = true;
            audioInstance.autoplay = true;
            audioInstance.controls = true;
            audioInstance.style.width = '100%';
        }
        return audioInstance;
    }

    /**
     * 尝试执行播放逻辑
     * 包含对浏览器自动播放限制的处理
     */
    async function tryPlay() {
        const audio = getAudioInstance();
        try {
            await audio.play();
            console.log('Silence Player: 自动播放成功');
        } catch (err) {
            console.log('Silence Player: 等待用户交互以激活音频...');
            // 浏览器限制自动播放时，监听首次用户点击或触摸
            const enableAudio = async () => {
                try {
                    await audio.play();
                    console.log('Silence Player: 用户交互后音频已激活');
                    document.removeEventListener('click', enableAudio);
                    document.removeEventListener('touchstart', enableAudio);
                } catch (e) {
                    console.error('Silence Player: 激活失败', e);
                }
            };
            document.addEventListener('click', enableAudio);
            document.addEventListener('touchstart', enableAudio);
        }
    }

    // 暴露到全局命名空间供 index.js 使用
    window.SilenceManager = {
        getAudioInstance,
        tryPlay
    };
})();
