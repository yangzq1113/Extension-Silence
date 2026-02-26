/**
 * 音频播放控制逻辑
 * 负责处理音频的播放、自动播放以及浏览器策略下的延迟播放
 */

window.SilenceAudioManager = class {
    constructor(audioElement) {
        this.audio = audioElement;
        this.isStarted = false;
    }

    /**
     * 尝试开始播放音频
     * 如果由于浏览器策略（如未交互）导致失败，则会在用户第一次点击文档时重试
     */
    async start() {
        if (this.isStarted) return;

        try {
            await this.audio.play();
            this.isStarted = true;
            console.log('Silence Player: Autoplay started successfully.');
        } catch (error) {
            console.warn('Silence Player: Autoplay blocked. Waiting for user interaction.');
            this.setupInteractionListener();
        }
    }

    /**
     * 设置一次性的点击监听器，以便在用户交互后启动音频
     */
    setupInteractionListener() {
        const startOnInteraction = async () => {
            try {
                await this.audio.play();
                this.isStarted = true;
                console.log('Silence Player: Playback started after user interaction.');
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('touchstart', startOnInteraction);
            } catch (err) {
                console.error('Silence Player: Playback failed after interaction:', err);
            }
        };

        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
    }
}
