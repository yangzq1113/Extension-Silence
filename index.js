jQuery(() => {
    /**
     * 获取注入 UI 的目标容器
     * @returns {jQuery} 容器对象
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

    /**
     * 注入播放器 UI 到页面
     */
    const injectPlayerUI = () => {
        getContainer().append(`
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Silence Player</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <audio id="silence_player" autoplay loop controls src="/scripts/extensions/third-party/Extension-Silence/silence.m4a">
                </audio>
            </div>
        </div>`);
    };

    /**
     * 启动音频播放逻辑，处理浏览器的自动播放策略限制
     */
    const startAutoplay = () => {
        const audio = document.getElementById('silence_player');
        if (!audio) return;

        // 尝试自动播放
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log("Silence Player: 自动播放被浏览器拦截，等待用户交互后启动。");
                
                // 监听首次交互以恢复播放
                const resumeOnInteraction = () => {
                    audio.play();
                    document.removeEventListener('click', resumeOnInteraction);
                    document.removeEventListener('touchstart', resumeOnInteraction);
                };

                document.addEventListener('click', resumeOnInteraction);
                document.addEventListener('touchstart', resumeOnInteraction);
            });
        }
    };

    // 执行初始化
    injectPlayerUI();
    startAutoplay();
});
