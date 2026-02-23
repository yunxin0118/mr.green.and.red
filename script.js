function toggleMenu() {
            const menuList = document.getElementById('menuList');
            const menuContainer = document.getElementById('menuContainer');
            menuList.classList.toggle('show');
            menuContainer.classList.toggle('active');
        }
        document.addEventListener('click', (e) => {
            const mc = document.getElementById('menuContainer');
            if (!mc.contains(e.target)) {
                document.getElementById('menuList').classList.remove('show');
                mc.classList.remove('active');
            }
        });


        // ==========================================
        // 取得所有過場圖片的元素
        // ==========================================
        const bannerMon = document.getElementById('banner-mon');
        const bannerTue = document.getElementById('banner-tue');
        const bannerWed = document.getElementById('banner-wed');
        const bannerThu = document.getElementById('banner-thu');
        const bannerFri = document.getElementById('banner-fri');


        // --- 互動邏輯：Monday ---
        const btnTower = document.getElementById('btn-tower');
        const btnCold = document.getElementById('btn-cold');
        const txtTower = document.getElementById('txt-tower');
        const txtCold = document.getElementById('txt-cold');

        btnTower.addEventListener('click', function() {
            this.classList.remove('anim-shake');
            txtTower.classList.add('bubble-visible');
        });
        btnCold.addEventListener('click', function() {
            this.classList.remove('anim-shake');
            txtCold.classList.add('bubble-visible');
        });


        // --- 轉場與動畫邏輯 ---
        let currentScene = 1; 
        let isTransitioning = false; 
        
        // 【新增】用來記錄目前畫面上「正在顯示的過場圖片」
        let activeBanner = null; 

        let mondayStep = 0; 
        let tuesdayStep = 0; 
        let wednesdayStep = 0;
        let thursdayStep = 0;
        let fridayStep = 0;

        let isHoveringGreen = false; 
        let wedSpotlightScale = 0;   
        let spotlightImg = document.getElementById('wed-expand-spotlight');

        window.addEventListener('wheel', (e) => {
            if (isTransitioning) return;

            if (e.deltaY > 0) {
                // 【關鍵修改】：如果畫面上有過場圖片擋著，這次滾動只負責把它收起來
                if (activeBanner !== null) {
                    dismissBanner();
                    return; // 收起圖片後就結束這次滾動，不觸發後面的動畫
                }

                if (currentScene === 1) { 
                    goToSceneMonday(); 
                }
                else if (currentScene === 2) { 
                    playNextMondayStep();
                }
                else if (currentScene === 3) { 
                    playNextTuesdayStep();
                }
                else if (currentScene === 4) {
                    if (wednesdayStep < 5) { playNextWednesdayStep(); } 
                    else if (isHoveringGreen) { handleSpotlightExpand(); }
                }
                else if (currentScene === 5) {
                    if (thursdayStep < 4) {
                        playNextThursdayStep();
                    } else {
                        goToSceneFriday();
                    }
                }
                else if (currentScene === 6) {
                    playNextFridayStep();
                }
            }
        });

        // ==========================================
        // 【新增】收起過場圖片的共用函式
        // ==========================================
        function dismissBanner() {
            isTransitioning = true; // 鎖定滾輪
            activeBanner.classList.remove('show-banner'); // 讓圖片往上收起
            
            // 紀錄一下收起來的是不是星期五，因為星期五收起後要自動播放葉子動畫
            let isFriday = (activeBanner === bannerFri); 
            
            activeBanner = null; // 清空紀錄，代表畫面上沒有圖片了

            // 等待圖片收起的動畫結束 (約 800ms)
            setTimeout(() => { 
                isTransitioning = false; // 解鎖滾輪
                if (isFriday) {
                    playNextFridayStep(); // 星期五的特殊處理
                }
            }, 800); 
        }

        // -----------------------
        // Spotlight Expansion
        // -----------------------
        function handleSpotlightExpand() {
            if (getComputedStyle(spotlightImg).opacity == 0) {
                spotlightImg.style.opacity = 1;
                spotlightImg.style.transform = `translate(-50%, -50%) scale(1)`;
                wedSpotlightScale = 1;
            } else {
                wedSpotlightScale += 5; 
                spotlightImg.style.transform = `translate(-50%, -50%) scale(${wedSpotlightScale})`;
                if (wedSpotlightScale > 40) { 
                    goToSceneThursday();
                }
            }
        }

        // ==========================================
        // 【修改】切換場景函式：圖片掉下後會「停留」並等待下次滾動
        // ==========================================
        function goToSceneMonday() {
            isTransitioning = true;
            bannerMon.classList.add('show-banner'); // 圖片掉落

            // 等待圖片完全遮住畫面 (800ms) 後，偷偷切換背景
            setTimeout(() => {
                currentScene = 2;
                document.getElementById('scene-start').classList.add('slide-up');
                document.getElementById('scene-monday').classList.add('visible');
                mondayStep = 0; 

                // 紀錄目前擋住畫面的是星期一圖片，並解鎖滾輪等待使用者滑動
                activeBanner = bannerMon;
                isTransitioning = false; 
            }, 800);
        }

        function goToSceneTuesday() {
            isTransitioning = true;
            bannerTue.classList.add('show-banner');

            setTimeout(() => {
                currentScene = 3;
                document.getElementById('scene-tuesday').classList.add('active');
                
                activeBanner = bannerTue;
                isTransitioning = false;
            }, 800);
        }

        function goToSceneWednesday() {
            isTransitioning = true;
            bannerWed.classList.add('show-banner');

            setTimeout(() => {
                currentScene = 4;
                document.getElementById('scene-wednesday').classList.add('active'); 
                
                activeBanner = bannerWed;
                isTransitioning = false;
            }, 800);
        }

        function goToSceneThursday() {
            isTransitioning = true;
            bannerThu.classList.add('show-banner');

            setTimeout(() => {
                currentScene = 5;
                document.getElementById('scene-thursday').classList.add('active');
                
                activeBanner = bannerThu;
                isTransitioning = false;
            }, 800);
        }

        function goToSceneFriday() {
            isTransitioning = true;
            bannerFri.classList.add('show-banner');

            setTimeout(() => {
                currentScene = 6;
                document.getElementById('scene-friday').classList.add('active'); 
                
                activeBanner = bannerFri;
                isTransitioning = false;
            }, 800);
        }

        // -----------------------
        // Step Logic
        // -----------------------
        function playNextMondayStep() {
            if (mondayStep >= 4) {
                goToSceneTuesday();
                return;
            }

            mondayStep++;
            isTransitioning = true;
            setTimeout(() => { isTransitioning = false; }, 800);

            switch(mondayStep) {
                case 1: 
                    document.getElementById('text1').classList.add('text-in');
                    setTimeout(() => { document.getElementById('text2').classList.add('text-in'); }, 300);
                    break;
                case 2: 
                    document.getElementById('grp-left').classList.add('slide-in-active');
                    document.getElementById('grp-right').classList.add('slide-in-active');
                    document.getElementById('grp-water').classList.add('slide-up-active');
                    document.getElementById('btn-tower').classList.add('anim-shake');
                    document.getElementById('btn-cold').classList.add('anim-shake');
                    break;
                case 3: 
                    document.getElementById('img-rain').classList.add('rain-active');
                    setTimeout(() => { 
                        document.getElementById('grp-green').classList.add('green-in'); 
                    }, 500);
                    break;
                case 4: 
                    document.getElementById('grp-car').classList.add('car-run'); 
                    setTimeout(() => {
                        const imgWater = document.getElementById('img-water');
                        const imgGreen = document.getElementById('img-green');
                        imgWater.src = "startpic/water1.png";
                        imgGreen.src = "startpic/green1.png";
                        
                        setTimeout(() => {
                            imgWater.src = "startpic/water2.png";
                            imgGreen.src = "startpic/green2.png";
                            setTimeout(() => {
                                imgWater.src = "startpic/water.png";
                            }, 300);
                        }, 200);
                    }, 1000); 
                    break;
            }
        }

        function playNextTuesdayStep() {
            if(tuesdayStep < 5) {
                tuesdayStep++;
                isTransitioning = true;
                setTimeout(() => { isTransitioning = false; }, 800);
                
                switch(tuesdayStep) {
                    case 1: 
                        document.getElementById('tues-title').classList.add('text-in');
                        setTimeout(() => { document.getElementById('tues-sub').classList.add('text-in'); }, 300);
                        break;
                    case 2: 
                        document.getElementById('tues-intersac').classList.add('bg-visible');
                        document.getElementById('tues-mrt').classList.add('bg-visible');
                        break;
                    case 3: 
                        document.getElementById('grp-grandma').classList.add('grandma-walking');
                        const flos = document.querySelectorAll('.obj-flo');
                        setTimeout(() => { flos[0].classList.add('flo-anim'); }, 2500); 
                        setTimeout(() => { flos[1].classList.add('flo-anim'); }, 3000); 
                        setTimeout(() => { flos[2].classList.add('flo-anim'); }, 3500); 
                        setTimeout(() => { flos[3].classList.add('flo-anim'); }, 4000); 
                        break;
                    case 4: 
                        document.getElementById('grp-red').classList.add('red-enter');
                        break;
                    case 5: 
                        document.getElementById('grp-dialogue').classList.add('dialogue-show');
                        break;
                }
            } else {
                goToSceneWednesday();
            }
        }

        function playNextWednesdayStep() {
            wednesdayStep++;
            isTransitioning = true;
            setTimeout(() => { isTransitioning = false; }, 1000); 

            switch(wednesdayStep) {
                case 1: 
                    document.getElementById('wed-title').classList.add('text-in');
                    setTimeout(() => { document.getElementById('wed-sub').classList.add('text-in'); }, 300);
                    break;
                case 2: 
                    const tri = document.getElementById('grp-triangle');
                    const holeGrp = document.getElementById('grp-hole');
                    tri.classList.add('wed-enter-left');
                    holeGrp.classList.add('wed-enter-right');
                    setTimeout(() => {
                        tri.classList.add('anim-shake-random');
                        holeGrp.classList.add('anim-shake-random');
                    }, 1000);
                    break;
                case 3: 
                    document.getElementById('wed-green-fall').classList.add('green-fall');
                    break;
                case 4: 
                    document.getElementById('wed-text-group').classList.add('fade-out-scene');
                    document.querySelector('.wed-obj-container').classList.add('fade-out-scene');
                    const blackTrans = document.getElementById('wed-black-trans');
                    blackTrans.classList.add('black-rise'); 
                    setTimeout(() => {
                        document.getElementById('wed-black-bg').classList.add('bg-dark-active');
                    }, 800); 
                    break;
                case 5: 
                    document.getElementById('wed-final-scene').classList.add('final-active');
                    break;
            }
        }

        function playNextThursdayStep() {
            thursdayStep++;
            isTransitioning = true;
            setTimeout(() => { isTransitioning = false; }, 800);

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

        function playNextFridayStep() {
            fridayStep++;
            isTransitioning = true;
            setTimeout(() => { isTransitioning = false; }, 1000);

            switch(fridayStep) {
                case 1: 
                    const leaves = document.querySelectorAll('.leaf-mask');
                    leaves.forEach(l => l.classList.add('leaf-center'));
                    break;
                case 2: 
                    document.getElementById('fri-bg-leaf').classList.add('bg-show');
                    const leavesToHide = document.querySelectorAll('.leaf-mask');
                    leavesToHide.forEach(l => {
                        l.classList.add('leaf-hide'); 
                        l.classList.remove('leaf-center'); 
                    });
                    const flowers = document.querySelectorAll('.fri-flower');
                    flowers.forEach(f => f.classList.add('fl-show'));
                    break;
                case 3: 
                    document.getElementById('fri-word').classList.add('word-in');
                    break;
                case 4: 
                    const leavesReappear = document.querySelectorAll('.leaf-mask');
                    leavesReappear.forEach(l => {
                        l.classList.remove('leaf-hide'); 
                        l.classList.add('leaf-center');  
                    });
                    break;
                case 5: 
                    const leavesAway = document.querySelectorAll('.leaf-mask');
                    leavesAway.forEach(l => {
                        l.classList.remove('leaf-center'); 
                        l.classList.add('leaf-fly-out');   
                    });
                    document.getElementById('fri-bg-final').classList.add('bg-show');
                    document.getElementById('fri-nocar').classList.add('obj-fade-in');
                    document.getElementById('fri-stair').classList.add('obj-fade-in');
                    break;
                case 6: 
                    setTimeout(() => { document.getElementById('motor1').classList.add('obj-fade-in'); }, 100);
                    setTimeout(() => { document.getElementById('motor2').classList.add('obj-fade-in'); }, 400);
                    setTimeout(() => { document.getElementById('motor3').classList.add('obj-fade-in'); }, 700);
                    setTimeout(() => { document.getElementById('motor4').classList.add('obj-fade-in'); }, 1000);
                    break;
                case 7: 
                    document.getElementById('fri-gray-curtain').classList.add('curtain-down');
                    break;
                case 8: 
                    document.getElementById('fri-allgray').classList.add('bg-show');
                    break;
            }
        }

        // --- 互動邏輯：Tuesday ---
        const btnGreenma = document.getElementById('btn-greenma');
        const txtGreenma = document.getElementById('txt-greenma');
        const btnBag = document.getElementById('btn-bag');
        const txtBag = document.getElementById('txt-bag');

        btnGreenma.addEventListener('click', function() {
            txtGreenma.classList.toggle('bubble-show');
        });
        btnBag.addEventListener('click', function() {
            txtBag.classList.toggle('bubble-show');
        });

        // --- 互動邏輯：Wednesday ---
        const btnTri = document.getElementById('btn-triangle');
        const grpTri = document.getElementById('grp-triangle');
        const txtTri = document.getElementById('txt-triangle');
        
        btnTri.addEventListener('click', function() {
            grpTri.classList.remove('anim-shake-random'); 
            txtTri.classList.toggle('bubble-visible');
        });

        const btnHole = document.getElementById('btn-hole');
        const grpHole = document.getElementById('grp-hole');
        const txtHole = document.getElementById('txt-hole');
        
        btnHole.addEventListener('click', function() {
            grpHole.classList.remove('anim-shake-random'); 
            txtHole.classList.toggle('bubble-visible');
        });

        const greenSpin = document.getElementById('wed-green-spin');
        
        greenSpin.addEventListener('mouseenter', function() {
            if(wednesdayStep >= 5) {
                isHoveringGreen = true;
                console.log("Mouse over Green! Scroll to expand spotlight.");
            }
        });
        greenSpin.addEventListener('mouseleave', function() { });

        // --- 互動邏輯：Friday ---
        const flowersObj = document.querySelectorAll('.fri-flower');
        const flText = document.getElementById('fri-fltext');
        
        flowersObj.forEach(f => {
            f.addEventListener('click', function() {
                flText.style.opacity = (flText.style.opacity == 1) ? 0 : 1;
            });
        });

        document.getElementById('fri-nocar').addEventListener('click', function(){
            this.classList.remove('anim-shake-random');
        });
        document.getElementById('fri-stair').addEventListener('click', function(){
            this.classList.remove('anim-shake-random');
        });