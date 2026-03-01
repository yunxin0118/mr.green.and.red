// ==========================================
        // 1. UI 選單與活動彈窗邏輯
        // ==========================================
        function toggleMenu() {
            document.getElementById('menuList').classList.toggle('show');
            document.getElementById('menuContainer').classList.toggle('active');
        }
        document.addEventListener('click', (e) => {
            const mc = document.getElementById('menuContainer');
            if (!mc.contains(e.target) && !e.target.closest('.hamburger-icon')) {
                document.getElementById('menuList').classList.remove('show');
                mc.classList.remove('active');
            }
        });

        const btnActivity = document.getElementById('obj-activity');
        const activityPopup = document.getElementById('activity-popup');
        const popLayers = [
            document.getElementById('pop-layer6'), document.getElementById('pop-layer5'),
            document.getElementById('pop-layer4'), document.getElementById('pop-layer3'),
            document.getElementById('pop-layer2'), document.getElementById('pop-layer1')
        ];
        if (btnActivity && activityPopup) {
            btnActivity.addEventListener('click', function(e) {
                e.preventDefault(); 
                activityPopup.classList.add('show-popup'); 
                popLayers.forEach((layer, index) => {
                    setTimeout(() => { layer.classList.add('layer-visible'); }, 300 + (index * 150)); 
                });
            });
            popLayers.forEach((layer, index) => {
                layer.addEventListener('click', function() {
                    this.classList.remove('layer-visible');
                    if (index === 0) { setTimeout(() => { activityPopup.classList.remove('show-popup'); }, 400); }
                });
            });
        }

        // ==========================================
        // 2. 轉場與動畫控制變數
        // ==========================================
        const bannerMon = document.getElementById('banner-mon');
        const bannerTue = document.getElementById('banner-tue');
        const bannerWed = document.getElementById('banner-wed');
        const bannerThu = document.getElementById('banner-thu');

        let currentScene = 1; 
        let activeBanner = null; 

        let mondayStep = 0; 
        let tuesdayStep = 0; 
        let wednesdayStep = 0;
        let thursdayStep = 0; 

        let isHoveringGreen = false; 
        let wedSpotlightScale = 0;   
        let spotlightImg = document.getElementById('wed-expand-spotlight');

        // 防抖機制
        let isReadyForNext = true;
        let lastWheelTime = 0;

        // ==========================================
        // 3. 主滾輪監聽器
        // ==========================================
        window.addEventListener('wheel', (e) => {
            const currentTime = new Date().getTime();
            
            if (!isReadyForNext || currentTime - lastWheelTime < 800) {
                return;
            }

            if (e.deltaY > 0) { 
                lastWheelTime = currentTime;

                if (activeBanner !== null) {
                    dismissBanner();
                    return; 
                }

                if (currentScene === 1) { goToSceneMonday(); }
                else if (currentScene === 2) { playNextMondayStep(); }
                else if (currentScene === 3) { playNextTuesdayStep(); }
                else if (currentScene === 4) {
                    if (wednesdayStep < 5) { playNextWednesdayStep(); } 
                    else if (isHoveringGreen) { handleSpotlightExpand(); }
                }
                else if (currentScene === 5) { playNextThursdayStep(); }
            }
        });

        function lockScroll(lockDuration) {
            isReadyForNext = false;
            setTimeout(() => { isReadyForNext = true; }, lockDuration);
        }

        // ==========================================
        // 4. 收起過場圖片邏輯 (完美接軌 new.html)
        // ==========================================
        function dismissBanner() {
            lockScroll(1000);
            let dismissedBanner = activeBanner; 
            dismissedBanner.classList.remove('show-banner'); 
            activeBanner = null; 

            if (dismissedBanner === bannerThu) {
                // 【優化】當星期四印章收起一半時，整個畫面先順滑淡出，再跳轉
                setTimeout(() => { 
                    document.body.style.transition = "opacity 0.4s ease";
                    document.body.style.opacity = "0";
                    
                    setTimeout(() => {
                        window.location.href = "new.html"; 
                    }, 400); 
                }, 400); 
            }
        }

        // ==========================================
        // 6. 各場景步驟與動畫切換 (改成一鍵絲滑放大)
        // ==========================================
        let isSpotlightExpanding = false; // 防止重複觸發的開關

        function handleSpotlightExpand() {
            if (isSpotlightExpanding) return;
            isSpotlightExpanding = true;
            lockScroll(2500); // 動畫期間鎖住滾輪

            // 直接觸發剛剛寫好的 CSS 絲滑放大動畫
            spotlightImg.classList.add('spotlight-expand');

            // 等待放大(1.5秒)播完，再掉下星期三印章
            setTimeout(() => { 
                activeBanner = bannerWed;
                bannerWed.classList.add('show-banner');
                
                setTimeout(() => {
                    currentScene = 5;
                    document.getElementById('scene-thursday').classList.add('active');
                    isSpotlightExpanding = false;
                }, 800);
            }, 1500);
        }

        // ==========================================
        // 5. 互動事件綁定
        // ==========================================

        // --- Monday 互動 ---
        document.getElementById('btn-tower').addEventListener('click', function() {
            this.classList.remove('anim-shake');
            document.getElementById('txt-tower').classList.add('bubble-visible');
        });
        document.getElementById('btn-cold').addEventListener('click', function() {
            this.classList.remove('anim-shake');
            document.getElementById('txt-cold').classList.add('bubble-visible');
        });

        // --- Tuesday 互動 ---
        document.getElementById('btn-greenma').addEventListener('click', function() {
            document.getElementById('txt-greenma').classList.toggle('bubble-show');
        });
        document.getElementById('btn-bag').addEventListener('click', function() {
            document.getElementById('txt-bag').classList.toggle('bubble-show');
        });

        // --- Wednesday 互動 ---
        document.getElementById('btn-triangle').addEventListener('click', function() {
            document.getElementById('grp-triangle').classList.remove('anim-shake-random'); 
            document.getElementById('txt-triangle').classList.toggle('bubble-visible');
        });
        document.getElementById('btn-hole').addEventListener('click', function() {
            document.getElementById('grp-hole').classList.remove('anim-shake-random'); 
            document.getElementById('txt-hole').classList.toggle('bubble-visible');
        });
        document.getElementById('wed-green-spin').addEventListener('mouseenter', function() {
            if(wednesdayStep >= 5) { isHoveringGreen = true; }
        });

        // ==========================================
        // 6. 各場景步驟與動畫切換
        // ==========================================
        function handleSpotlightExpand() {
            lockScroll(800);
            if (getComputedStyle(spotlightImg).opacity == 0) {
                spotlightImg.style.opacity = 1;
                spotlightImg.style.transform = `translate(-50%, -50%) scale(1)`;
                wedSpotlightScale = 1;
            } else {
                wedSpotlightScale += 5; 
                spotlightImg.style.transform = `translate(-50%, -50%) scale(${wedSpotlightScale})`;
                if (wedSpotlightScale > 40) { 
                    activeBanner = bannerWed;
                    bannerWed.classList.add('show-banner');
                    setTimeout(() => {
                        currentScene = 5;
                        document.getElementById('scene-thursday').classList.add('active');
                    }, 800);
                }
            }
        }

        function goToSceneMonday() { lockScroll(1000); currentScene = 2; document.getElementById('scene-start').classList.add('slide-up'); document.getElementById('scene-monday').classList.add('visible'); mondayStep = 0; }
        function playNextMondayStep() {
            if (mondayStep >= 4) { lockScroll(800); activeBanner = bannerMon; bannerMon.classList.add('show-banner'); setTimeout(() => { currentScene = 3; document.getElementById('scene-tuesday').classList.add('active'); }, 800); return; }
            mondayStep++; lockScroll(800);
            switch(mondayStep) {
                case 1: document.getElementById('text1').classList.add('text-in'); setTimeout(() => { document.getElementById('text2').classList.add('text-in'); }, 300); break;
                case 2: document.getElementById('grp-left').classList.add('slide-in-active'); document.getElementById('grp-right').classList.add('slide-in-active'); document.getElementById('grp-water').classList.add('slide-up-active'); document.getElementById('btn-tower').classList.add('anim-shake'); document.getElementById('btn-cold').classList.add('anim-shake'); break;
                case 3: document.getElementById('img-rain').classList.add('rain-active'); setTimeout(() => { document.getElementById('grp-green').classList.add('green-in'); }, 500); break;
                case 4: document.getElementById('grp-car').classList.add('car-run'); setTimeout(() => { const imgWater = document.getElementById('img-water'); const imgGreen = document.getElementById('img-green'); imgWater.src = "startpic/water1.png"; imgGreen.src = "startpic/green1.png"; setTimeout(() => { imgWater.src = "startpic/water2.png"; imgGreen.src = "startpic/green2.png"; setTimeout(() => { imgWater.src = "startpic/water.png"; }, 300); }, 200); }, 1000); break;
            }
        }

        function playNextTuesdayStep() {
            if(tuesdayStep >= 5) { lockScroll(800); activeBanner = bannerTue; bannerTue.classList.add('show-banner'); setTimeout(() => { currentScene = 4; document.getElementById('scene-wednesday').classList.add('active'); }, 800); return; }
            tuesdayStep++; lockScroll(800);
            switch(tuesdayStep) {
                case 1: document.getElementById('tues-title').classList.add('text-in'); setTimeout(() => { document.getElementById('tues-sub').classList.add('text-in'); }, 300); break;
                case 2: document.getElementById('tues-intersac').classList.add('bg-visible'); document.getElementById('tues-mrt').classList.add('bg-visible'); break;
                case 3: document.getElementById('grp-grandma').classList.add('grandma-walking'); const flos = document.querySelectorAll('.obj-flo'); setTimeout(() => { flos[0].classList.add('flo-anim'); }, 2500); setTimeout(() => { flos[1].classList.add('flo-anim'); }, 3000); setTimeout(() => { flos[2].classList.add('flo-anim'); }, 3500); setTimeout(() => { flos[3].classList.add('flo-anim'); }, 4000); break;
                case 4: document.getElementById('grp-red').classList.add('red-enter'); break;
                case 5: document.getElementById('grp-dialogue').classList.add('dialogue-show'); break;
            }
        }

        function playNextWednesdayStep() {
            wednesdayStep++; lockScroll(1000);
            switch(wednesdayStep) {
                case 1: document.getElementById('wed-title').classList.add('text-in'); setTimeout(() => { document.getElementById('wed-sub').classList.add('text-in'); }, 300); break;
                case 2: const tri = document.getElementById('grp-triangle'); const holeGrp = document.getElementById('grp-hole'); tri.classList.add('wed-enter-left'); holeGrp.classList.add('wed-enter-right'); setTimeout(() => { tri.classList.add('anim-shake-random'); holeGrp.classList.add('anim-shake-random'); }, 1000); break;
                case 3: document.getElementById('wed-green-fall').classList.add('green-fall'); break;
                case 4: document.getElementById('wed-text-group').classList.add('fade-out-scene'); document.querySelector('.wed-obj-container').classList.add('fade-out-scene'); const blackTrans = document.getElementById('wed-black-trans'); blackTrans.classList.add('black-rise'); setTimeout(() => { document.getElementById('wed-black-bg').classList.add('bg-dark-active'); }, 800); break;
                case 5: document.getElementById('wed-final-scene').classList.add('final-active'); break;
            }
        }

        // ==========================================
        // Thursday 簡化版邏輯 (只負責車子動畫)
        // ==========================================
        function playNextThursdayStep() {
            if (thursdayStep >= 4) { 
                // 第 4 步結束後，再次滾動就會掉下 thu.png
                lockScroll(800);
                activeBanner = bannerThu;
                bannerThu.classList.add('show-banner');
                return; 
            }
            thursdayStep++;
            lockScroll(800);

            switch(thursdayStep) {
                case 1: 
                    document.getElementById('thurs-title').classList.add('text-in');
                    setTimeout(() => { document.getElementById('thurs-sub').classList.add('text-in'); }, 300);
                    break;
                case 2: 
                    const vidBox = document.getElementById('thurs-video-box');
                    const vid = document.getElementById('thurs-video');
                    vidBox.classList.add('video-in');
                    vid.play(); 
                    break;
                case 3: 
                    document.getElementById('thurs-license').classList.add('license-drop');
                    break;
                case 4: 
                    document.getElementById('thurs-no').classList.add('no-shrink');
                    break;
            }
        }