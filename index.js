jQuery(() => {
    /**
     * 获取插件设置容器
     * @returns {jQuery} jQuery 对象，指向设置面板容器
     */
    const getContainer = () => $(document.getElementById('silence_container') ?? document.getElementById('extensions_settings'));

    /**
     * 初始化 Silence Player 插件
     */
    const initSilencePlayer = () => {
        const audioId = 'silence_audio_player';
        const audioSrc = '/scripts/extensions/third-party/Extension-Silence/silence.m4a';

        // 创建 UI 结构
        const html = `
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Silence Player</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div class="flex-container">
                    <div id="silence_status">状态: 正在初始化...</div>
                    <button id="silence_toggle_btn" class="menu_button">播放/暂停</button>
                </div>
                <audio id="${audioId}" loop src="${audioSrc}" style="display:none;"></audio>
            </div>
        </div>`;

        getContainer().append(html);

        const audio = document.getElementById(audioId);
        const statusDiv = document.getElementById('silence_status');
        const toggleBtn = document.getElementById('silence_toggle_btn');

        /**
         * 更新播放状态显示
         */
        const updateStatus = () => {
            if (audio.paused) {
                statusDiv.innerText = '状态: 已停止';
                toggleBtn.innerText = '播放';
            } else {
                statusDiv.innerText = '状态: 正在后台运行';
                toggleBtn.innerText = '暂停';
            }
        };

        /**
         * 尝试自动播放音频
         */
        const tryAutoplay = async () => {
            try {
                await audio.play();
                console.log('Silence Player: 自动播放成功');
                updateStatus();
            } catch (err) {
                console.log('Silence Player: 等待用户交互以启动自动播放');
                statusDiv.innerText = '状态: 等待激活 (请点击页面任意处)';
                
                // 浏览器限制自动播放，监听首次点击以激活
                const activateOnInteraction = async () => {
                    try {
                        await audio.play();
                        updateStatus();
                        window.removeEventListener('click', activateOnInteraction);
                    } catch (e) {
                        console.error('Silence Player: 激活失败', e);
                    }
                };
                window.addEventListener('click', activateOnInteraction);
            }
        };

        // 按钮点击事件
        toggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
            updateStatus();
        });

        // 初始尝试播放
        tryAutoplay();
    };

    initSilencePlayer();
});
