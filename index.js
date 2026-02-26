/**
 * 初始化 Silence Player 扩展
 * 该函数会在文档就绪后运行，将音频播放器添加到指定的容器中，并尝试自动播放。
 */
jQuery(() => {
    /**
     * 获取要插入播放器的目标容器
     * @returns {jQuery} 包含目标元素的 jQuery 对象
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));
    
    // 生成音频播放器的 HTML 结构
    const audioHtml = `
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Silence Player</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <audio id="silence-player-audio" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a" >
        </div>
    </div>`;
    
    // 将播放器添加到页面
    getContainer().append(audioHtml);

    /**
     * 尝试启动音频播放
     * 处理浏览器的自动播放限制，并在失败时监听用户交互以再次尝试。
     */
    const tryPlayAudio = async () => {
        const audio = document.getElementById('silence-player-audio');
        if (!audio) return;

        try {
            // 尝试直接播放
            await audio.play();
            console.log('Silence Player: 自动播放已成功启动。');
        } catch (error) {
            console.warn('Silence Player: 自动播放被浏览器拦截。等待用户交互后重试。', error);
            
            // 如果被拦截，则监听文档的多种交互事件以启动播放
            const startOnInteraction = async () => {
                try {
                    await audio.play();
                    console.log('Silence Player: 用户交互后成功启动播放。');
                    // 移除监听器
                    ['click', 'keydown', 'touchstart', 'mousedown', 'wheel', 'touchmove', 'scroll'].forEach(event => {
                        document.removeEventListener(event, startOnInteraction);
                    });
                } catch (e) {
                    console.error('Silence Player: 交互后播放仍然失败:', e);
                }
            };

            // 添加多种可能的交互事件监听器，包括点击、按键、触摸和滑动/滚动
            ['click', 'keydown', 'touchstart', 'mousedown', 'wheel', 'touchmove', 'scroll'].forEach(event => {
                document.addEventListener(event, startOnInteraction, { once: true });
            });
        }
    };

    // 延迟一小段时间以确保 DOM 已完全渲染并可以被脚本操作
    setTimeout(tryPlayAudio, 500);
});
