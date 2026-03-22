// ==========================================
// 1. UI 選單與活動彈窗邏輯
// ==========================================
function toggleMenu() {
    document.getElementById('menuList').classList.toggle('show');
    document.getElementById('menuContainer').classList.toggle('active');
}

document.addEventListener('click', (e) => {
    const mc = document.getElementById('menuContainer');
    if (mc && !mc.contains(e.target) && !e.target.closest('.hamburger-icon')) {
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

// --- 打字機設定 ---
const fullText = "他每天都在前進，直到某一天......\n格林先生決定不再當被數字追著跑的人";
const typewriterEl = document.getElementById('typewriter-text');
let charIndex = 0;
let startScrollCount = 0; // 紀錄開場滾動次數

let isSpotlightExpanding = false; 
let spotlightImg = document.getElementById('wed-expand-spotlight');

// 防抖機制
let isReadyForNext = true;
let lastWheelTime = 0;

// ==========================================
// 3. 打字機執行邏輯
// ==========================================
function typeWriter() {
    if (typewriterEl && charIndex < fullText.length) {
        typewriterEl.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100); 
    }
}

// 頁面載入後開始打字
window.addEventListener('load', typeWriter);

// ==========================================
// 4. 主滾輪監聽器 (核心邏輯修正)
// ==========================================
window.addEventListener('wheel', (e) => {
    const currentTime = new Date().getTime();
    
    if (!isReadyForNext || currentTime - lastWheelTime < 800) {
        return;
    }

    if (e.deltaY > 0) { 
        lastWheelTime = currentTime;

        // 如果目前畫面上正蓋著星期印章，先收起印章
        if (activeBanner !== null) {
            dismissBanner();
            return; 
        }

        // --- 場景 1：打字機開場邏輯 ---
        if (currentScene === 1) {
            startScrollCount++;
            if (startScrollCount === 1) {
                // 第一下：文字淡出
                const container = document.getElementById('typewriter-container');
                if (container) container.style.opacity = "0";
                lockScroll(600);
            } else if (startScrollCount === 2) {
                // 第二下：進入星期一
                goToSceneMonday(); 
            }
            return; 
        }

        // --- 其他場景動畫 ---
        if (currentScene === 2) { 
            playNextMondayStep(); 
        } else if (currentScene === 3) { 
            playNextTuesdayStep(); 
        } else if (currentScene === 4) {
            if (wednesdayStep < 5) { 
                playNextWednesdayStep(); 
            } else { 
                handleSpotlightExpand(); 
            }
        } else if (currentScene === 5) { 
            playNextThursdayStep(); 
        }
    }
});

function lockScroll(lockDuration) {
    isReadyForNext = false;
    setTimeout(() => { isReadyForNext = true; }, lockDuration);
}

// ==========================================
// 5. 收起過場圖片邏輯
// ==========================================
function dismissBanner() {
    lockScroll(1000);
    let dismissedBanner = activeBanner; 
    dismissedBanner.classList.remove('show-banner'); 
    activeBanner = null; 

    if (dismissedBanner === bannerThu) {
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
// 6. 星期三接星期四：絲滑放大動畫
// ==========================================
function handleSpotlightExpand() {
    if (isSpotlightExpanding) return;
    isSpotlightExpanding = true;
    lockScroll(2500); 

    if (spotlightImg) {
        spotlightImg.classList.add('spotlight-expand');
    }

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
// 7. 各場景步驟動畫邏輯
// ==========================================

// --- Monday ---
function goToSceneMonday() { 
    lockScroll(1000); 
    currentScene = 2; 
    // scene-start 向上移出並消失
    document.getElementById('scene-start').classList.add('slide-up'); 
    document.getElementById('scene-monday').classList.add('visible'); 
}

function playNextMondayStep() {
    if (mondayStep >= 4) { 
        lockScroll(800); 
        activeBanner = bannerMon; 
        bannerMon.classList.add('show-banner'); 
        setTimeout(() => { 
            currentScene = 3; 
            document.getElementById('scene-tuesday').classList.add('active'); 
        }, 800); 
        return; 
    }
    mondayStep++; 
    lockScroll(800);
    switch(mondayStep) {
        case 1: document.getElementById('text1').classList.add('text-in'); setTimeout(() => { document.getElementById('text2').classList.add('text-in'); }, 300); break;
        case 2: document.getElementById('grp-left').classList.add('slide-in-active'); document.getElementById('grp-right').classList.add('slide-in-active'); document.getElementById('grp-water').classList.add('slide-up-active'); document.getElementById('btn-tower').classList.add('anim-shake'); document.getElementById('btn-cold').classList.add('anim-shake'); break;
        case 3: document.getElementById('img-rain').classList.add('rain-active'); setTimeout(() => { document.getElementById('grp-green').classList.add('green-in'); }, 500); break;
        case 4: document.getElementById('grp-car').classList.add('car-run'); setTimeout(() => { const imgWater = document.getElementById('img-water'); const imgGreen = document.getElementById('img-green'); imgWater.src = "startpic/water1.png"; imgGreen.src = "startpic/green1.png"; setTimeout(() => { imgWater.src = "startpic/water2.png"; imgGreen.src = "startpic/green2.png"; setTimeout(() => { imgWater.src = "startpic/water.png"; }, 300); }, 200); }, 1000); break;
    }
}

// --- Tuesday ---
function playNextTuesdayStep() {
    if(tuesdayStep >= 5) { 
        lockScroll(800); 
        activeBanner = bannerTue; 
        bannerTue.classList.add('show-banner'); 
        setTimeout(() => { 
            currentScene = 4; 
            document.getElementById('scene-wednesday').classList.add('active'); 
        }, 800); 
        return; 
    }
    tuesdayStep++; 
    lockScroll(800);
    switch(tuesdayStep) {
        case 1: document.getElementById('tues-title').classList.add('text-in'); setTimeout(() => { document.getElementById('tues-sub').classList.add('text-in'); }, 300); break;
        case 2: document.getElementById('tues-intersac').classList.add('bg-visible'); document.getElementById('tues-mrt').classList.add('bg-visible'); break;
        case 3: document.getElementById('grp-grandma').classList.add('grandma-walking'); const flos = document.querySelectorAll('.obj-flo'); setTimeout(() => { flos[0].classList.add('flo-anim'); }, 2500); setTimeout(() => { flos[1].classList.add('flo-anim'); }, 3000); setTimeout(() => { flos[2].classList.add('flo-anim'); }, 3500); setTimeout(() => { flos[3].classList.add('flo-anim'); }, 4000); break;
        case 4: document.getElementById('grp-red').classList.add('red-enter'); break;
        case 5: document.getElementById('grp-dialogue').classList.add('dialogue-show'); break;
    }
}

// --- Wednesday ---
function playNextWednesdayStep() {
    wednesdayStep++; 
    lockScroll(1000);
    switch(wednesdayStep) {
        case 1: document.getElementById('wed-title').classList.add('text-in'); setTimeout(() => { document.getElementById('wed-sub').classList.add('text-in'); }, 300); break;
        case 2: const tri = document.getElementById('grp-triangle'); const holeGrp = document.getElementById('grp-hole'); tri.classList.add('wed-enter-left'); holeGrp.classList.add('wed-enter-right'); setTimeout(() => { tri.classList.add('anim-shake-random'); holeGrp.classList.add('anim-shake-random'); }, 1000); break;
        case 3: document.getElementById('wed-green-fall').classList.add('green-fall'); break;
        case 4: document.getElementById('wed-text-group').classList.add('fade-out-scene'); document.querySelector('.wed-obj-container').classList.add('fade-out-scene'); const blackTrans = document.getElementById('wed-black-trans'); blackTrans.classList.add('black-rise'); setTimeout(() => { document.getElementById('wed-black-bg').classList.add('bg-dark-active'); }, 800); break;
        case 5: document.getElementById('wed-final-scene').classList.add('final-active'); break;
    }
}

// --- Thursday ---
function playNextThursdayStep() {
    if (thursdayStep >= 4) { 
        lockScroll(800);
        activeBanner = bannerThu;
        bannerThu.classList.add('show-banner');
        return; 
    }
    thursdayStep++;
    lockScroll(800);
    switch(thursdayStep) {
        case 1: document.getElementById('thurs-title').classList.add('text-in'); setTimeout(() => { document.getElementById('thurs-sub').classList.add('text-in'); }, 300); break;
        case 2: const vidBox = document.getElementById('thurs-video-box'); const vid = document.getElementById('thurs-video'); vidBox.classList.add('video-in'); vid.play(); break;
        case 3: document.getElementById('thurs-license').classList.add('license-drop'); break;
        case 4: document.getElementById('thurs-no').classList.add('no-shrink'); break;
    }
}

// --- 點擊互動事件綁定 ---
const tower = document.getElementById('btn-tower');
if(tower) tower.addEventListener('click', function() {
    this.classList.remove('anim-shake');
    document.getElementById('txt-tower').classList.add('bubble-visible');
});

const cold = document.getElementById('btn-cold');
if(cold) cold.addEventListener('click', function() {
    this.classList.remove('anim-shake');
    document.getElementById('txt-cold').classList.add('bubble-visible');
});

const greenma = document.getElementById('btn-greenma');
if(greenma) greenma.addEventListener('click', function() {
    document.getElementById('txt-greenma').classList.toggle('bubble-show');
});

const bag = document.getElementById('btn-bag');
if(bag) bag.addEventListener('click', function() {
    document.getElementById('txt-bag').classList.toggle('bubble-show');
});

const triangle = document.getElementById('btn-triangle');
if(triangle) triangle.addEventListener('click', function() {
    document.getElementById('grp-triangle').classList.remove('anim-shake-random'); 
    document.getElementById('txt-triangle').classList.toggle('bubble-visible');
});

const hole = document.getElementById('btn-hole');
if(hole) hole.addEventListener('click', function() {
    document.getElementById('grp-hole').classList.remove('anim-shake-random'); 
    document.getElementById('txt-hole').classList.toggle('bubble-visible');
});