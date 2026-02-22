
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

        // 1. 【新增】Monday 的步驟變數
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
                if (currentScene === 1) { 
                    goToSceneMonday(); 
                }
                // 2. 【修改】Monday 的滾動邏輯
                else if (currentScene === 2) { 
                    playNextMondayStep();
                }
                else if (currentScene === 3) { 
                    playNextTuesdayStep();
                }
                else if (currentScene === 3) { playNextTuesdayStep(); }
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

        // -----------------------
        // Scene Transitions
        // -----------------------
        function goToSceneMonday() {
            isTransitioning = true;
            currentScene = 2;
            const sceneStart = document.getElementById('scene-start');
            const sceneMonday = document.getElementById('scene-monday');
            
            sceneStart.classList.add('slide-up');
            sceneMonday.classList.add('visible');
            
            // 【修改】初始化 Monday 步驟，但不自動播放
            mondayStep = 0; 
            
            // 選擇性：如果您希望切換過去時自動顯示第一步(標題)，可以取消下面這行的註解
            // playNextMondayStep(); 

            setTimeout(() => { isTransitioning = false; }, 1000);
        }

        function goToSceneTuesday() {
            isTransitioning = true;
            currentScene = 3;
            const sceneTuesday = document.getElementById('scene-tuesday');
            sceneTuesday.classList.add('active'); 
            setTimeout(() => { isTransitioning = false; }, 1000);
        }

        function goToSceneWednesday() {
            isTransitioning = true;
            currentScene = 4;
            const sceneWednesday = document.getElementById('scene-wednesday');
            sceneWednesday.classList.add('active'); 
            setTimeout(() => { isTransitioning = false; }, 1000);
        }

        function goToSceneThursday() {
            isTransitioning = true;
            currentScene = 5;
            const sceneThursday = document.getElementById('scene-thursday');
            sceneThursday.classList.add('active');
            setTimeout(() => { isTransitioning = false; }, 1000);
        }

        function goToSceneFriday() {
            isTransitioning = true;
            currentScene = 6;
            console.log("切換至星期五...");

            const sceneFriday = document.getElementById('scene-friday');
            sceneFriday.classList.add('active'); 
            
            // 自動觸發第一步 (葉子飛入)
            setTimeout(() => {
                playNextFridayStep();
            }, 800); // 稍微等待場景滑入

            setTimeout(() => { isTransitioning = false; }, 1000);
        }

        // -----------------------
        // Step Logic
        // -----------------------

        // 3. 【新增】Monday 的分步動畫函式
        function playNextMondayStep() {
            // 如果已經跑完 4 步，再滾動就切換到星期二
            if (mondayStep >= 4) {
                goToSceneTuesday();
                return;
            }

            mondayStep++;
            isTransitioning = true;
            // 設定一個短暫冷卻時間，避免滾太快
            setTimeout(() => { isTransitioning = false; }, 800);

            switch(mondayStep) {
                case 1: // 步驟 1：文字浮現
                    document.getElementById('text1').classList.add('text-in');
                    setTimeout(() => { document.getElementById('text2').classList.add('text-in'); }, 300);
                    break;

                case 2: // 步驟 2：左右建築 & 水窪滑入
                    document.getElementById('grp-left').classList.add('slide-in-active');
                    document.getElementById('grp-right').classList.add('slide-in-active');
                    document.getElementById('grp-water').classList.add('slide-up-active');
                    // 讓物件開始晃動
                    document.getElementById('btn-tower').classList.add('anim-shake');
                    document.getElementById('btn-cold').classList.add('anim-shake');
                    break;

                case 3: // 步驟 3：下雨 & 綠人出現
                    document.getElementById('img-rain').classList.add('rain-active');
                    setTimeout(() => { 
                        document.getElementById('grp-green').classList.add('green-in'); 
                    }, 500);
                    break;

                case 4: // 步驟 4：車子開過 + 濺起水花
                    document.getElementById('grp-car').classList.add('car-run'); 
                    
                    // 車子開到一半(約1秒後)觸發水花動畫
                    setTimeout(() => {
                        const imgWater = document.getElementById('img-water');
                        const imgGreen = document.getElementById('img-green');

                        // 1. 碰到水 (water1)
                        imgWater.src = "startpic/water1.png";
                        imgGreen.src = "startpic/green1.png";
                        
                        // 2. 濺起 (water2)
                        setTimeout(() => {
                            imgWater.src = "startpic/water2.png";
                            imgGreen.src = "startpic/green2.png";
                            
                            // 3. 恢復平靜 (water)
                            setTimeout(() => {
                                imgWater.src = "startpic/water.png";
                                // 如果希望綠人也恢復，把下面註解打開
                                // imgGreen.src = "startpic/green.png";
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
                    // 自動觸發：葉子從角落飛入聚攏
                    const leaves = document.querySelectorAll('.leaf-mask');
                    leaves.forEach(l => l.classList.add('leaf-center'));
                    break;

                case 2: 
                    // 背景切換 leaf.png，葉子消失(reset)
                    document.getElementById('fri-bg-leaf').classList.add('bg-show');
                    
                    const leavesToHide = document.querySelectorAll('.leaf-mask');
                    leavesToHide.forEach(l => {
                        l.classList.add('leaf-hide'); // 淡出
                        // 移除聚攏樣式，讓它偷偷回到角落
                        l.classList.remove('leaf-center'); 
                    });

                    const flowers = document.querySelectorAll('.fri-flower');
                    flowers.forEach(f => f.classList.add('fl-show'));
                    break;

                case 3: 
                    // Word1 淡入
                    document.getElementById('fri-word').classList.add('word-in');
                    break;

                case 4: 
                    // 葉子再次出現並聚攏 (遮住畫面)
                    const leavesReappear = document.querySelectorAll('.leaf-mask');
                    leavesReappear.forEach(l => {
                        l.classList.remove('leaf-hide'); // 移除隱藏
                        l.classList.add('leaf-center');  // 再次聚攏
                    });
                    break;

                case 5: 
                    // 葉子飛出散開，背景切換 Friday
                    const leavesAway = document.querySelectorAll('.leaf-mask');
                    leavesAway.forEach(l => {
                        l.classList.remove('leaf-center'); // 移除聚攏
                        l.classList.add('leaf-fly-out');   // 飛到更遠的地方
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

        // -----------------------
        // Animations
        // -----------------------
        function playMondayAnimation() {
            const t1 = document.getElementById('text1');
            const t2 = document.getElementById('text2');
            const left = document.getElementById('grp-left');
            const right = document.getElementById('grp-right');
            const waterGrp = document.getElementById('grp-water');
            const rain = document.getElementById('img-rain');
            const green = document.getElementById('grp-green');
            const car = document.getElementById('grp-car');
            const imgWater = document.getElementById('img-water');
            const imgGreen = document.getElementById('img-green');
            const tower = document.getElementById('btn-tower');
            const cold = document.getElementById('btn-cold');

            setTimeout(() => { t1.classList.add('text-in'); }, 100);
            setTimeout(() => { t2.classList.add('text-in'); }, 800);
            setTimeout(() => {
                left.classList.add('slide-in-active');
                right.classList.add('slide-in-active');
                waterGrp.classList.add('slide-up-active');
                tower.classList.add('anim-shake');
                cold.classList.add('anim-shake');
            }, 1500);
            setTimeout(() => { rain.classList.add('rain-active'); }, 2500);
            setTimeout(() => { green.classList.add('green-in'); }, 3500);
            setTimeout(() => {
                car.classList.add('car-run'); 
                setTimeout(() => {
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
            }, 4500);
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
        const flowers = document.querySelectorAll('.fri-flower');
        const flText = document.getElementById('fri-fltext');
        
        flowers.forEach(f => {
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
