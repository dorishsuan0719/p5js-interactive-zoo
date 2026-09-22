// === 全域變數 ===
let zooMapImg;
let currentScene = 'title';
let selectedExhibit = null;
let animals = [];
let zooTrees = [];
let butterflies = [];
let fenceOpenProgress = 0;
let isFadingOut = false;
let transitionAlpha = 0;
let foodTypes = ["肉 🥩", "葉子 🌿", "魚 🐟", "竹子 🎋"];
let currentFoodIndex = 0;
let isGameOver = false;
let humanHitRadius = 32;

// --- 獅子園區 ---
let lionGameState = "INTRO";
let lionCountdownValue = 3;
let lastLionCountdownTime = 0;
let lionSceneStartTime = 0;
let lionsSpawned = false;
let nextLionSpawnTime = 0;
let lionSurvivalTime = 0;

// --- 大象園區 ---
let elephantGameState = "INTRO";
let elephantCountdownValue = 3;
let lastElephantCountdownTime = 0;
let elephantWaterValue = 50; 
let elephantFoodValue = 50;  

// 📥 請務必在下方補上這兩行，食物才不會變成 undefined 變透明！
let elephantGroundFoods = []; 
let elephantHeldFood = null;

// --- 長頸鹿園區 ---
let giraffeGameState = "INTRO";
let countdownValue = 3;
let lastCountdownTime = 0;
let giraffeScore = 0;
let giraffeItems = [];
let giraffeStartTime = 0;
let giraffeGameDuration = 20000;
let isGiraffeGameOver = false;
let giraffeGameOverReason = "";
let giraffeDir = 1;
let giraffeItemTypes = ['🍎', '🍃', '💣', '💣', '💣'];

// --- 熊貓園區 ---
let pandaGameState = "INTRO"; 
let pandaCountdownValue = 3;
let lastPandaCountdownTime = 0;
let pandaHappiness = 50;
let maxPandaHappiness = 100;
let keeperState = 0;
let stateTimer = 0;
let nextStateTime = 100;
let zzzParticles = [];
let sweatParticles = [];
let screenShake = 0;
let keeperX = 1100;
let hasPunishedThisRaid = false;
let targetLockTimer = 0;

const exhibitZones = {
  giraffe:   { label: "長頸鹿園區", x: 20,   y: 130,  w: 260, h: 360, correctFood: 1 }, 
  lion:      { label: "獅子園區",   x: 20,   y: 530,  w: 260, h: 200, correctFood: 0 }, 
  elephant:  { label: "大象園區",   x: 610,  y: 180,  w: 370, h: 220, correctFood: 1 }, 
  panda:     { label: "熊貓園區",   x: 650,  y: 520,  w: 320, h: 220, correctFood: 3 }  
};


// =========================================================================
// 🦋 封面蝴蝶類別 
// =========================================================================
class Butterfly {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(height * 0.1, height * 0.8);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
    this.size = random(10, 16);

    let palettes = [
      { top: color(255, 245, 190, 150), bot: color(255, 230, 140, 170) },
      { top: color(210, 235, 255, 150), bot: color(170, 210, 255, 170) },
      { top: color(255, 220, 235, 150), bot: color(255, 180, 215, 170) },
      { top: color(220, 245, 210, 150), bot: color(185, 230, 175, 170) }
    ];

    let choice = random(palettes);
    this.colorTop = choice.top;
    this.colorBot = choice.bot;
    this.opacity = 0;
  }

  update(currentSeason) {
    let moveX = map(noise(this.noiseOffsetX + frameCount * 0.01), 0, 1, -2, 2);
    let moveY = map(noise(this.noiseOffsetY + frameCount * 0.01), 0, 1, -1, 1);

    let margin = 40;
    if (this.x < margin) moveX += map(this.x, margin, 0, 0, 3);
    if (this.x > width - margin) moveX -= map(this.x, width - margin, width, 0, 3);
    if (this.y < margin) moveY += map(this.y, margin, 0, 0, 2);
    if (this.y > height - margin) moveY -= map(this.y, height - margin, height, 0, 2);

    this.x += moveX;
    this.y += moveY;
    this.x = constrain(this.x, 5, width - 5);
    this.y = constrain(this.y, 5, height - 5);

    if (currentSeason === 0) {
      this.opacity = min(200, this.opacity + 5);
    } else {
      this.opacity = max(0, this.opacity - 10);
    }
  }

  display() {
    if (this.opacity <= 0) return;
    push();
    translate(this.x, this.y);
    rotate(radians(sin(frameCount * 0.05) * 5));

    stroke(80, 50, 20, this.opacity);
    strokeWeight(1.5);
    line(0, -this.size * 0.4, -this.size * 0.5, -this.size * 1.2);
    line(0, -this.size * 0.4,  this.size * 0.5, -this.size * 1.2);

    fill(80, 50, 20, this.opacity);
    noStroke();
    ellipse(-this.size * 0.5, -this.size * 1.2, 3, 3);
    ellipse( this.size * 0.5, -this.size * 1.2, 3, 3);

    let flap = map(sin(frameCount * 0.25), -1, 1, 0.6, 1.0);

    fill(red(this.colorTop), green(this.colorTop), blue(this.colorTop), this.opacity);
    push();
    translate(-this.size * 0.5, -this.size * 0.2);
    rotate(radians(-25));
    ellipse(0, 0, this.size * 2.0 * flap, this.size * 2.5);
    pop();

    push();
    translate(this.size * 0.5, -this.size * 0.2);
    rotate(radians(25));
    ellipse(0, 0, this.size * 2.0 * flap, this.size * 2.5);
    pop();

    fill(red(this.colorBot), green(this.colorBot), blue(this.colorBot), this.opacity);
    push();
    translate(-this.size * 0.4, this.size * 0.7);
    rotate(radians(-10));
    ellipse(0, 0, this.size * 1.5 * flap, this.size * 1.7);
    pop();

    push();
    translate(this.size * 0.4, this.size * 0.7);
    rotate(radians(10));
    ellipse(0, 0, this.size * 1.5 * flap, this.size * 1.7);
    pop();

    fill(70, 40, 20, this.opacity);
    ellipse(0, 0, this.size * 0.5, this.size * 2.2);
    pop();
  }
}


// =========================================================================
// ⚙️ 第二部分：P5.js 內建核心函式 
// =========================================================================
let bgMusic;
let parkMusics = {}; // 用字典存放，方便對應場景名稱
let elephantBg, lionBg, giraffeBg, pandaBg; // 背景音樂變數
let elephantSound, lionSound;



function preload() {
  zooMapImg = loadImage('map.png');
  
  bgMusic = loadSound('zoo.mp3');
  
  // 載入背景音樂
  elephantBg = loadSound('elephant background.mp3');
  lionBg = loadSound('lion background.mp3');
  giraffeBg = loadSound('giraffe background.mp3');
  pandaBg = loadSound('panda background.mp3');
  
  // 載入動物叫聲
  elephantSound = loadSound('elephant.mp3');
  lionSound = loadSound('lion.mp3');
}


function setup() {
  let cnv = createCanvas(1000, 750); 
  cnv.style('display', 'block');     
  cnv.style('margin', 'auto');       
  cnv.style('max-width', '100%');    
  cnv.style('max-height', '96vh');  
  
  bgMusic.setVolume(0.25);

  elephantBg.setVolume(0.25);
  lionBg.setVolume(0.25);
  giraffeBg.setVolume(0.25);
  pandaBg.setVolume(0.25);
  lionSound.setVolume(0.75);
  elephantSound.setVolume(0.75);
  
  imageMode(CENTER); 
  document.oncontextmenu = function() { return false; } 

  for (let i = 0; i < 10; i++) {
    butterflies.push(new Butterfly());
  }
  bgMusic.loop();
}

function stopParkMusic() {
  elephantBg.stop();
  lionBg.stop();
  giraffeBg.stop();
  pandaBg.stop();
}

function draw() {
  if (currentScene === 'title') {
    drawTitleScene();
  } else if (currentScene === 'map') {
    drawMapScene();
  } else if (currentScene === 'detail') {
    drawDetailScene(); 
  }
}

// =========================================================================
// 🎨 第三部分：共用場景與環境繪圖工具
// =========================================================================

// ✨ 修正過的標題函式：使用傳入的參數 titleText，避免印出固定字串 "title"
// === 修改後的標題函式：無框、下移、改字體、改顏色、拉開字距 ===
function drawHeader(titleText) {
  push();
  textAlign(CENTER, CENTER);
  
  // 1. 設定新顏色（例如：優雅的深森林綠，可自行修改後方的 RGB 值）
  fill(34, 76, 56); 
  
  // 2. 設定新字體（例如：微軟正黑體 'Microsoft JhengHei', 或是 Serif 襯線體）
  textFont('Microsoft JhengHei'); 
  textSize(34); // 稍微放大一點點讓字體更美觀
  textStyle(BOLD); // 讓新字體加粗
  
  // 3. 【核心修改】將文字拆開，手動加上間距（字距拉開）
  let currentY = 80; // 這邊控制向下移動的位置（已從 42 下移到 80）
  let spacing = 16;  // 每個字之間的額外距離（數字越大，字跟字分得越開）
  
  // 計算整串字拉開後的總寬度，以便將它精準置中
  let totalWidth = 0;
  for (let i = 0; i < titleText.length; i++) {
    totalWidth += textWidth(titleText[i]) + (i < titleText.length - 1 ? spacing : 0);
  }
  
  // 開始從左到右依序畫出每個字
  let startX = (width - totalWidth) / 2 + textWidth(titleText[0]) / 2;
  for (let i = 0; i < titleText.length; i++) {
    let charX = startX + (i * spacing);
    for (let j = 0; j < i; j++) {
      charX += textWidth(titleText[j]);
    }
    text(titleText[i], charX, currentY);
  }
  
  pop();
}

function drawHomeButton() {
  push();
  textAlign(CENTER, CENTER);
  textSize(70);
  fill(255);
  text("🏠", width - 40, 40);
  pop();
}

function drawLinearGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    stroke(lerpColor(c1, c2, inter));
    line(x, i, x + w, i);
  }
}

function drawOneCloud(x, y, s) {
  push(); translate(x, y); scale(s); noStroke();
  fill(253, 248, 240); 
  circle(0, 0, 95); circle(-38, 5, 75); circle(38, 5, 75); circle(-20, -25, 60); circle(20, -25, 60);        
  pop();
}

function drawRealisticClouds() {
  drawOneCloud(220, 110, 1.2);  
  drawOneCloud(580, 75, 0.85);  
  drawOneCloud(840, 130, 1.3);  
}

function drawHorizonTrees() {
  push(); noStroke(); randomSeed(101); 
  for (let x = -20; x < width + 20; x += random(60, 95)) {
    let y = 410 + random(-10, 10);
    fill(135, 105, 85); rect(x - 6, y - 10, 12, 65, 4); 
    let leafColorBase  = color(65, 145, 65);  
    let leafColorLight = color(90, 170, 80);  
    fill(leafColorBase);
    circle(x, y - 30, 55); circle(x, y - 52, 40); circle(x - 18, y - 42, 38); circle(x + 18, y - 42, 38); circle(x - 24, y - 22, 40); circle(x + 24, y - 22, 40);  
    fill(leafColorLight);
    circle(x - 22, y - 47, 15); circle(x - 6, y - 56, 18);   
  }
  pop(); randomSeed(millis() + frameCount); 
}

function drawGrassHills() {
  push(); noStroke();
  fill(65, 165, 65); beginShape(); vertex(0, height);
  for(let x = 0; x <= width; x += 20) { let y = 440 + sin(x * 0.01) * 25; vertex(x, y); }
  vertex(width, height); endShape(CLOSE);
  fill(95, 195, 85); beginShape(); vertex(0, height);
  for(let x = 0; x <= width; x += 20) { let y = 475 + sin(x * 0.015 + 2) * 20; vertex(x, y); }
  vertex(width, height); endShape(CLOSE);
  pop();
}

function drawRealisticGrassTexture(yMin, h) {
  push(); randomSeed(777); noStroke(); 
  for (let i = 0; i < 150; i++) {
    let gx = random(10, width - 10); let gy = random(yMin, yMin + h); let scaleFactor = map(gy, yMin, yMin + h, 0.6, 1.4); 
    if (random() > 0.4) fill(50, 140, 50, 200); else fill(165, 230, 135, 220); 
    let gh = 15 * scaleFactor; let gw = 12 * scaleFactor; 
    triangle(gx - gw * 0.3, gy, gx + gw * 0.3, gy, gx, gy - gh);
    triangle(gx - gw * 0.8, gy, gx - gw * 0.1, gy, gx - gw * 1.1, gy - gh * 0.6);
    triangle(gx + gw * 0.1, gy, gx + gw * 0.8, gy, gx + gw * 1.1, gy - gh * 0.6);
    ellipse(gx, gy, gw * 1.8, gh * 0.35);
  }
  pop(); randomSeed(millis() + frameCount);
}

function drawRealisticFencePost(x, y, w, h) {
  push(); noStroke();
  let woodColor = color(160, 105, 60); let midX = x + w / 2; let tipY = y - w * 0.8; 
  fill(woodColor); triangle(x, y, midX, tipY, x + w, y); rect(x, y, w, h);                     
  stroke(130, 80, 40, 150); strokeWeight(1);          
  let numLines = 4; let spacing = w / (numLines + 1); 
  for (let i = 1; i <= numLines; i++) {
    let lineX = x + i * spacing;
    let startY = (lineX <= midX) ? map(lineX, x, midX, y, tipY) : map(lineX, midX, x + w, tipY, y);
    line(lineX, startY + 2, lineX, y + h - 2);
  }
  noStroke(); let boltSize = w * 0.2; fill(80); 
  circle(midX, y + h * 0.2, boltSize); circle(midX, y + h * 0.8, boltSize);
  fill(230); circle(midX - 1, y + h * 0.2 - 1, boltSize * 0.3); circle(midX - 1, y + h * 0.8 - 1, boltSize * 0.3);
  pop();
}

function drawRealisticFenceRails(y1, y2, isGate, offset) {
  push();
  let startX = isGate ? (width / 2 - 210 - offset) : 0; let endX = isGate ? (width / 2 - offset) : width; let railHeight = 16; 
  drawSingleWoodRail(startX, endX, y1, railHeight); drawSingleWoodRail(startX, endX, y2, railHeight);
  pop();
}

function drawSingleWoodRail(x1, x2, y, h) {
  push(); noStroke(); fill(160, 105, 60); rect(x1, y, x2 - x1, h);
  stroke(130, 80, 40, 150); strokeWeight(1);
  let numLines = 3; let spacingH = h / (numLines + 1);
  for (let i = 1; i <= numLines; i++) { let lineY = y + i * spacingH; line(x1 + 2, lineY, x2 - 2, lineY); }
  pop();
}

function drawScenicTree(x, y, s) {
  push(); translate(x, y); scale(s); noStroke();
  fill(135, 105, 85); rect(-10, -5, 20, 110, 6); 
  let leafColorBase  = color(65, 145, 65); let leafColorLight = color(90, 170, 80);  
  fill(leafColorBase);
  circle(0, -50, 95); circle(0, -85, 75); circle(-35, -70, 65); circle(35, -70, 65); circle(-45, -35, 70); circle(45, -35, 70);  
  fill(leafColorLight); circle(-42, -80, 25); circle(-12, -96, 32);  
  pop();
}

function drawScenicFence(horizonY) {
  push();
  drawRealisticFenceRails(horizonY + 25, horizonY + 55, false, 0); 
  for (let x = -10; x < width + 20; x += 45) { drawRealisticFencePost(x, horizonY + 5, 16, 75); }
  pop();
}

function drawDetailedSceneBase() {
  push();
  background(125, 195, 250); 
  drawLinearGradient(0, 0, width, 400, color(125, 195, 250), color(230, 245, 255));
  drawRealisticClouds();
  
  fill(65, 165, 65); noStroke(); beginShape(); vertex(0, height);
  for(let x = 0; x <= width; x += 20) { vertex(x, 395 + sin(x * 0.012) * 22); }
  vertex(width, height); endShape(CLOSE);

  fill(95, 195, 85); beginShape(); vertex(0, height);
  for(let x = 0; x <= width; x += 20) { vertex(x, 430 + sin(x * 0.018 + 2) * 18); }
  vertex(width, height); endShape(CLOSE);
  
  drawRealisticGrassTexture(400, 350);
  
  randomSeed(12345);
  for(let i = 0; i < 4; i++) {
    let tx = random(50, width-50); let ty = 390 + random(-10, 10); let ts = random(0.35, 0.5); 
    drawScenicTree(tx, ty, ts);
  }
  randomSeed(millis() + frameCount); 
  pop();
}

// =========================================================================
// 🎬 第四部分：三大主要場景 (封面、地圖、動物園區切換)
// =========================================================================

function drawTitleScene() {
  background(125, 195, 250); 
  drawLinearGradient(0, 0, width, 450, color(125, 195, 250), color(230, 245, 255));
  drawRealisticClouds(); 
  drawLinearGradient(0, 450, width, 300, color(45, 160, 45), color(20, 95, 20));
  drawHorizonTrees();
  drawGrassHills();
  drawRealisticGrassTexture(460, 290);

  push();
  textAlign(CENTER, CENTER); textStyle(BOLD);
  function mousePressed() {
    userStartAudio(); 
  }
  let titleScale = map(sin(frameCount * 0.05), -1, 1, 1, 1.05); 
  translate(width / 2, 170); scale(titleScale);
  fill(0, 0, 0, 70); textSize(45); text(" 歡 迎 來 到 BlackPink 動 物 園 ", 4, 4); 
  fill(255, 245, 210); text(" 歡 迎 來 到 BlackPink 動 物 園 ", 0, 0);
  pop();
  
  push();
  textAlign(CENTER, CENTER); noStroke();
  let blink = map(sin(frameCount * 0.08), -1, 1, 40, 255);
  fill(255, 255, 255, isFadingOut ? 0 : blink); 
  textSize(22); textStyle(BOLD);
  text("👉 點 擊 畫 面 下 方 柵 欄 開 啟 園 區 👈", width / 2, 250);
  pop();

  if (isFadingOut) {
    if (fenceOpenProgress < 1) { fenceOpenProgress += 0.01; } 
    else {
      transitionAlpha += 5; 
      if (transitionAlpha >= 255) { currentScene = 'map'; isFadingOut = false; transitionAlpha = 0; }
    }
  }

  let gateOffset = fenceOpenProgress * 550; 
  let leftGateEdge = width / 2 - gateOffset; 
  drawSingleWoodRail(-500, leftGateEdge, 580, 16); drawSingleWoodRail(-500, leftGateEdge, 640, 16);
  for (let x = leftGateEdge - 30; x >= -500; x -= 60) { drawRealisticFencePost(x, 560, 48, 200); }

  let rightGateEdge = width / 2 + gateOffset; 
  drawSingleWoodRail(rightGateEdge, 1500, 580, 16); drawSingleWoodRail(rightGateEdge, 1500, 640, 16);
  for (let x = rightGateEdge + 30; x <= 1500; x += 60) { drawRealisticFencePost(x, 560, 48, 200); }

  drawRealisticFencePost(width / 2 - 225 - gateOffset, 540, 55, 190);
  drawRealisticFencePost(width / 2 + 185 + gateOffset, 540, 55, 190);

  push();
  rectMode(CENTER); translate(width / 2 - gateOffset, 610); noStroke();
  fill(0, 0, 0, 50); rect(4, 4, 200, 70, 6); 
  for (let i = -35; i <= 35; i++) {
    let inter = map(i, -35, 35, 0, 1); fill(lerpColor(color(150, 80, 30), color(80, 40, 15), inter)); rect(0, i, 200, 1);
  }
  fill(250, 245, 230); rect(0, 0, 175, 50, 4); 
  fill(40, 90, 40); textSize(38); textAlign(CENTER, CENTER); textStyle(BOLD); text("ZOO", 0, -2); 
  fill(50); circle(-85, 0, 8); circle(85, 0, 8); fill(220); circle(-86, -1, 3); circle(84, -1, 3);
  pop();

  for (let butterfly of butterflies) {
    butterfly.update(0); 
    butterfly.display();
  }

  if (transitionAlpha > 0) {
    push(); rectMode(CORNER); fill(0, 0, 0, transitionAlpha); rect(0, 0, width, height); pop();
  }
}

function drawMapScene() {
  console.log("zooMapImg =", zooMapImg);
  background(135, 185, 80); 
  push(); 
  imageMode(CORNER);
  image(zooMapImg, 0, 0, width, height); 
  pop();

  push();
  fill(0, 0, 0, 160); noStroke(); rectMode(CENTER); rect(width / 2, 40, 550, 50, 12);
  fill(255); textSize(22); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("請點擊地圖上的動物進入專屬園區 🐾", width / 2, 40);
  pop();
}

// ✨ 修正過的統一路由器，刪除多餘重複部分
function drawDetailScene() {
  if (selectedExhibit === 'giraffe') {
    handleGiraffeGame();
  } else if (selectedExhibit === 'panda') {
    handlePandaGameScene();
  } else if (selectedExhibit === 'lion') {
    handleLionGame(); 
  } else if (selectedExhibit === 'elephant') {
    handleElephantGame(); 
  }
}


// =========================================================================
// 🐼 第五部分：熊貓園區
// =========================================================================

function handlePandaGameScene() {
  push();
  if (screenShake > 0) { translate(random(-screenShake, screenShake), random(-screenShake, screenShake)); screenShake *= 0.9; }

  // 1. 繪製統一背景
  drawDetailedSceneBase();
  drawScenicFence(365);
  drawHeader("熊貓園區"); // 正確呼叫標題
  drawHomeButton();

  // 2. 狀態管理：說明頁 -> 倒數 -> 遊戲中 -> 結束
  if (pandaGameState === "INTRO") {
    push();
    fill(0, 0, 0, 180); rect(0, 0, width, height);
    fill(255); textAlign(CENTER, CENTER);
    textSize(40); text("🐼 熊貓摸魚挑戰 🐼", width/2, height/2 - 100);
    textSize(24); text("按住滑鼠讓熊貓睡覺補幸福度，\n但要小心不要被管理員發現！", width/2, height/2 - 30);
    
    // 開始按鈕
    rectMode(CENTER); fill(85, 125, 85); rect(width/2, height/2 + 60, 180, 50, 10);
    fill(255); textSize(24); text("確認開始", width/2, height/2 + 60);
    pop();
    
    if (mouseIsPressed && mouseButton === LEFT && 
        mouseX > width/2 - 90 && mouseX < width/2 + 90 && 
        mouseY > height/2 + 35 && mouseY < height/2 + 85) {
      resetPandaGame(); // 重置遊戲
      pandaGameState = "COUNTDOWN";
      lastPandaCountdownTime = millis();
      pandaCountdownValue = 3;
    }
  } 
  else if (pandaGameState === "COUNTDOWN") {
    push();
    fill(0, 0, 0, 150); rect(0,0,width,height);
    fill(255, 215, 0); textSize(100); textAlign(CENTER, CENTER);
    text(pandaCountdownValue, width/2, height/2);
    pop();
    
    if (millis() - lastPandaCountdownTime > 1000) {
      pandaCountdownValue--;
      lastPandaCountdownTime = millis();
      if (pandaCountdownValue <= 0) {
        pandaGameState = "PLAY";
      }
    }
  } 
  else if (pandaGameState === "PLAY") {
    stateTimer++;
    if (stateTimer >= nextStateTime) {
      stateTimer = 0;
      if (keeperState === 0) { keeperState = 1; nextStateTime = random(50, 90); } 
      else if (keeperState === 1) { keeperState = 2; hasPunishedThisRaid = false; targetLockTimer = 0; nextStateTime = random(120, 180); } 
      else if (keeperState === 2) { keeperState = 0; nextStateTime = random(80, 150); }
    }

    if (keeperState === 2) { keeperX = lerp(keeperX, 710, 0.15); } else { keeperX = lerp(keeperX, 1150, 0.08); }

    let isSleeping = (mouseIsPressed && mouseButton === LEFT && mouseY < height - 80);

     if (isSleeping) { 
      if (keeperState === 2) {
        if (!hasPunishedThisRaid) {
          pandaHappiness -= 10; screenShake = 12; hasPunishedThisRaid = true;
          for(let i=0; i<8; i++) { sweatParticles.push({ x: width/2, y: 530, vx: random(-4, 4), vy: random(-6, -2), alpha: 255 }); }
        }
        targetLockTimer++;
        if (targetLockTimer > 45 || pandaHappiness <= 0) { pandaGameState = "GAMEOVER"; screenShake = 20; }
      } else { pandaHappiness += 0.5; }
      
      if (frameCount % 12 === 0 && pandaGameState === "PLAY") { zzzParticles.push({ x: width/2 + 25, y: 500, size: random(14, 24), alpha: 255, angle: random(-0.2, 0.2) }); }
    } else {
      if (pandaHappiness > 0) pandaHappiness -= 0.05;
    }
    pandaHappiness = constrain(pandaHappiness, 0, maxPandaHappiness);
    if (pandaHappiness >= maxPandaHappiness) pandaGameState = "WIN";
    else if (pandaHappiness <= 0) pandaGameState = "GAMEOVER";

    fill(0, 40); rect(width/2 - 200, 162, 400, 26, 12);
    fill(245, 240, 230); rect(width/2 - 202, 160, 400, 26, 12);
    let barWidth = map(pandaHappiness, 0, maxPandaHappiness, 0, 400);
    let barColor = lerpColor(color(240, 90, 90), color(45, 195, 110), pandaHappiness/maxPandaHappiness);
    fill(barColor); rect(width/2 - 202, 160, barWidth, 26, 12);
    
    fill(0); stroke(255); strokeWeight(3.5); textSize(15); textStyle(BOLD); textAlign(CENTER, CENTER);
    text("PANDA 貓熊幸福度: " + floor(pandaHappiness) + "%", width / 2, 173);
    noStroke(); textStyle(NORMAL);

    if (isSleeping) drawAdvancedSleepingPanda(1.15); 
    else drawAdvancedWorkingPanda(1.15);  

    drawPandaParticles();

    if (keeperState === 1) {
      fill(255, 40, 40); stroke(255); strokeWeight(4); textSize(95);
      text("❗️", width / 2, 240 + sin(frameCount * 0.35) * 10); noStroke();
    }
    drawAdvancedKeeper(keeperX, 500, 1.65);
  } 
  else if (pandaGameState === "WIN") { drawPandaWinScreen(); } 
  else if (pandaGameState === "GAMEOVER") { drawPandaGameOverScreen(); }
  
  pop();
}

function drawPandaParticles() {
  for (let i = zzzParticles.length - 1; i >= 0; i--) {
    let p = zzzParticles[i];
    push(); translate(p.x, p.y); rotate(p.angle); fill(85, 80, 85, p.alpha); textSize(p.size); textStyle(BOLD); text("z", 0, 0); pop();
    p.x += 0.6; p.y -= 1.6; p.alpha -= 4;
    if (p.alpha <= 0) zzzParticles.splice(i, 1);
  }
  textStyle(NORMAL);
  for (let i = sweatParticles.length - 1; i >= 0; i--) {
    let p = sweatParticles[i];
    fill(140, 220, 255, p.alpha); noStroke(); ellipse(p.x, p.y, 8, 14);
    p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.alpha -= 6;
    if (p.alpha <= 0) sweatParticles.splice(i, 1);
  }
}

function drawAdvancedWorkingPanda(baseScale) {
  push(); let chewEffect = sin(frameCount * 0.25) * 1.2; translate(width / 2, 580); scale(baseScale); noStroke();
  let pSkin = color(253, 249, 240); let pDark = color(68, 60, 56); let pShadow = color(230, 222, 208); let pPink = color(247, 198, 190, 220);  
  fill(pDark); ellipse(-48, -48, 34, 34); ellipse(48, -48, 34, 34); fill(55, 48, 45); ellipse(-46, -46, 26, 26); ellipse(44, -46, 26, 26);
  fill(pDark); ellipse(0, 52, 124, 76); 
  push(); translate(-44, 62); fill(pSkin); rect(-14, -11, 28, 22, 12, 12, 4, 4); fill(pPink); rect(-10, -5, 20, 12, 6); fill(pDark); circle(-9, -13, 5); circle(-3, -15, 5); circle(3, -15, 5); circle(9, -13, 5); pop();
  push(); translate(44, 62); fill(pSkin); rect(-14, -11, 28, 22, 12, 12, 4, 4); fill(pPink); rect(-10, -5, 20, 12, 6); fill(pDark); circle(-9, -13, 5); circle(-3, -15, 5); circle(3, -15, 5); circle(9, -13, 5); pop();
  fill(pDark); rect(-55, 6, 110, 38, 16); fill(pShadow); ellipse(0, 38, 82, 52); fill(pSkin); ellipse(0, 35, 78, 48);
  fill(pShadow); ellipse(0, -12 + chewEffect * 0.3, 112, 94); fill(pSkin); ellipse(0, -14 + chewEffect * 0.3, 110, 90);
  fill(pDark); push(); translate(-25, -14 + chewEffect * 0.3); rotate(0.28); ellipse(0, 0, 26, 36); pop(); push(); translate(25, -14 + chewEffect * 0.3); rotate(-0.28); ellipse(0, 0, 26, 36); pop();
  fill(pSkin); circle(-23, -16 + chewEffect * 0.3, 8); circle(23, -16 + chewEffect * 0.3, 8); fill(20); circle(-23, -16 + chewEffect * 0.3, 5); circle(23, -16 + chewEffect * 0.3, 5); fill(255); circle(-24.5, -17.5 + chewEffect * 0.3, 2.5); circle(21.5, -17.5 + chewEffect * 0.3, 2.5); 
  fill(pPink); ellipse(-38, 8, 22, 14); ellipse(38, 8, 22, 14);
  push(); translate(0, -2 + chewEffect * 0.3); fill(40); triangle(-5, -3, 5, -3, 0, 1); stroke(40); strokeWeight(2.5); noFill(); strokeCap(ROUND); arc(-5, 3, 10, 8, 0, HALF_PI); arc(5, 3, 10, 8, HALF_PI, PI); pop(); noStroke();
  push(); translate(0, 16); rotate(0.12 + sin(frameCount * 0.1) * 0.03); stroke(100, 165, 65); strokeWeight(7); strokeCap(ROUND); line(-65, 0, 55, -15); noStroke(); fill(110, 185, 75); push(); translate(45, -13); rotate(0.4); ellipse(10, -2, 20, 7); pop(); pop();
  fill(55, 48, 45); rect(-52, 8, 32, 28, 8, 14, 4, 12); rect(20, 2, 32, 28, 14, 8, 12, 4);  
  fill(pDark); triangle(-52, 20, -56, 24, -52, 24); triangle(-46, 28, -48, 34, -43, 30); triangle(46, 12, 52, 16, 46, 18); triangle(40, 24, 44, 30, 37, 27);
  pop();
}

function drawAdvancedSleepingPanda(baseScale) {
  push(); let sleepPulse = sin(frameCount * 0.07) * 1.2; let breathScale = sin(frameCount * 0.07) * 0.012; translate(width / 2, 582 + sleepPulse); scale(baseScale * (1.0 + breathScale), baseScale * (1.0 - breathScale)); noStroke();
  let pSkin = color(253, 249, 240); let pDark = color(68, 60, 56); let pShadow = color(225, 217, 203); let pPink = color(247, 198, 190, 190);
  fill(pDark); 
  ellipse(-55, -44, 34, 34); // 👈 補上左邊耳朵
  ellipse(5, -42, 34, 34);   // 👈 這是你原本的右邊耳朵
  
  // 畫耳廓陰影/細節
  fill(55, 48, 45); 
  circle(-53, -44, 24);       // 👈 補上左耳內圈
  circle(5, -42, 24);         // 👈 這是你原本的右耳內圈
  
  fill(pShadow); ellipse(28, 10, 115, 95); fill(pSkin); ellipse(28, 7, 112, 90);
  fill(pDark); rect(18, -4, 62, 52, 14, 25, 20, 12); fill(pSkin); rect(32, 8, 34, 26, 10, 15, 10, 10); fill(pPink); rect(38, 14, 22, 16, 6); fill(pDark); circle(32, 4, 5); circle(44, 0, 5); circle(56, 4, 5);
  fill(pDark); ellipse(5, -42, 34, 34); fill(55, 48, 45); circle(5, -42, 24); fill(pShadow); ellipse(-32, -6, 116, 96); fill(pSkin); ellipse(-32, -8, 114, 92);
  fill(pDark); push(); translate(-48, -4); rotate(-0.05); ellipse(0, 0, 36, 26); pop(); push(); translate(-10, -4); rotate(0.05); ellipse(0, 0, 36, 26); pop();
  stroke(pSkin); strokeWeight(3); noFill(); strokeCap(ROUND); arc(-48, -4, 16, 10, 0.2, PI - 0.2); arc(-10, -4, 16, 10, 0.2, PI - 0.2); noStroke();
  fill(pPink); circle(-62, 12, 22); circle(-1, 12, 22); fill(40); ellipse(-29, 6, 8, 6); stroke(40); strokeWeight(2.5); strokeCap(ROUND); line(-29, 9, -29, 16); noStroke();
  fill(pDark); rect(-75, 18, 42, 24, 12, 4, 4, 12); rect(-35, 20, 50, 24, 4, 12, 12, 4); 
  stroke(90); strokeWeight(1.5); line(-70, 26, -66, 34); line(-66, 24, -62, 34); line(-24, 28, -20, 38); line(-16, 28, -12, 38); line(-8, 28, -4, 38); noStroke(); pop();
}

function drawAdvancedKeeper(kx, ky, baseScale) {
  push(); translate(kx, ky); scale(baseScale); noStroke(); let walkAngle = sin(frameCount * 0.1) * 0.05; fill(0, 45); ellipse(0, 22, 70, 15);
  push(); translate(-7, -10); rotate(walkAngle); fill(50, 75, 140); rect(-6, 0, 12, 24, 4); fill(40); rect(-8, 20, 15, 8, 3); pop();
  push(); translate(7, -10); rotate(-walkAngle); fill(50, 75, 140); rect(-6, 0, 12, 24, 4); fill(40); rect(-7, 20, 15, 8, 3); pop();
  fill(55, 115, 65); rect(-18, -42, 36, 34, 6); fill(210, 160, 60); rect(-19, -12, 38, 5, 1); fill(245, 205, 175); rect(-24, -32, 6, 20, 2); push(); translate(20, -32); fill(245, 205, 175); rect(-3, 0, 6, 22, 2); pop(); 
  push(); translate(-32, -20); fill(130, 85, 45); rect(0, 0, 24, 32, 3); fill(255); rect(2, 2, 20, 28, 1); fill(200, 40, 40); textSize(6); textAlign(CENTER); textStyle(BOLD); text("KPI ❌", 12, 14); pop(); textStyle(NORMAL);
  push(); translate(0, -58); fill(245, 205, 175); circle(0, 0, 28); fill(45, 85, 50); arc(0, -6, 32, 24, PI, TWO_PI); rect(-20, -8, 40, 4, 2); fill(240, 195, 30); ellipse(0, -14, 5, 5); stroke(40); strokeWeight(2.5); line(-11, -5, -4, -5); line(11, -5, 4, -5); noStroke(); fill(40); circle(-6, -1, 4.5); circle(6, -1, 4.5); stroke(50, 30, 30); strokeWeight(2); noFill(); arc(0, 9, 8, 5, PI, TWO_PI); pop(); pop();
}


// =========================================================================
// 🦒 第六部分：長頸鹿園區
// =========================================================================

function handleGiraffeGame() {
  drawDetailedSceneBase();
  drawScenicFence(365);
  drawHeader("長頸鹿園區"); // 正確呼叫標題
  drawHomeButton();

  let timeLeft = 0;

if (giraffeGameState === "INTRO") {
    push();
    fill(0, 0, 0, 180); rect(0, 0, width, height);
    
    // 1. 遊戲大標題（稍微往上移，留空間給詳細規則）
    fill(255); textAlign(CENTER, CENTER);
    textSize(36); text("🦒 長頸鹿餵食挑戰 🦒", width / 2, height / 2 - 130);
    
    // 2. 合併進來的詳細遊戲規則文字（靠左對齊，置中排版）
    textAlign(LEFT, TOP);
    textSize(18);
    fill(255);
    let startX = width / 2 - 150; // 控制文字區塊整體的左右置中位置
    text("遊戲規則：", startX, height / 2 - 70);
    text("🍎 吃蘋果 +10 分", startX, height / 2 - 40);
    text("🍃 吃葉子 +5 分", startX, height / 2 - 15);
    text("💣 碰到炸彈 -5 分 (扣到 0 分淘汰！)", startX, height / 2 + 10);
    
    // 3. 確認開始按鈕（位置保持不變）
    rectMode(CENTER); fill(85, 125, 85); rect(width / 2, height / 2 + 80, 180, 50, 10);
    fill(255); textAlign(CENTER, CENTER); textSize(24); text("確認開始", width / 2, height / 2 + 80);
    pop();
    
    // 按鈕點擊判定邏輯
    if (mouseIsPressed && mouseButton === LEFT && 
        mouseX > width / 2 - 90 && mouseX < width / 2 + 90 && 
        mouseY > height / 2 + 55 && mouseY < height / 2 + 105) {
      giraffeGameState = "COUNTDOWN";
      lastCountdownTime = millis();
    }
  }
  else if (giraffeGameState === "COUNTDOWN") {
    push();
    fill(0, 0, 0, 150); rect(0,0,width,height);
    fill(255, 215, 0); textSize(100); textAlign(CENTER, CENTER);
    text(countdownValue, width/2, height/2);
    pop();
    
    if (millis() - lastCountdownTime > 1000) {
      countdownValue--;
      lastCountdownTime = millis();
      if (countdownValue <= 0) {
        giraffeGameState = "PLAY";
        giraffeStartTime = millis();
      }
    }
  }
  else if (giraffeGameState === "PLAY") {
    if (!isGiraffeGameOver) {
      let elapsed = millis() - giraffeStartTime;
      timeLeft = max(0, ceil((giraffeGameDuration - elapsed) / 1000));
      if (elapsed >= giraffeGameDuration) { isGiraffeGameOver = true; giraffeGameOverReason = "time"; }
      
      if (mouseX > pmouseX + 0.5) giraffeDir = -1; else if (mouseX < pmouseX - 0.5) giraffeDir = 1; 
      
      if (frameCount % 20 === 0) { 
        let type = random(giraffeItemTypes); 
        let speed = random(3.0, 6.0); 
        if (type === '🍃') speed = random(1.5, 3.0); 
        giraffeItems.push({ x: random(60, width - 60), y: 0, type: type, speed: speed, size: 35 }); 
      }
      
      let neckLength = map(mouseY, height, 0, 40, 240); neckLength = constrain(neckLength, 40, 240); 
      let mouthX = mouseX - (32 * giraffeDir); 
      let mouthY = (560 - neckLength) - 4; 
      
      for (let i = giraffeItems.length - 1; i >= 0; i--) {
        let item = giraffeItems[i]; item.y += item.speed; 
        push(); textSize(item.size); textAlign(CENTER, CENTER); text(item.type, item.x, item.y); pop();
        
       // 檢查長頸鹿有沒有吃到東西
      if (dist(item.x, item.y, mouthX, mouthY) < 45) { 
        if (item.type === '🍎') {
          giraffeScore += 10;
        } else if (item.type === '🍃') {
          giraffeScore += 5;
        } else if (item.type === '💣') {
          giraffeScore -= 5; // <--- 這裡已經改成扣 5 分了
          if (giraffeScore < 0) {
            isGiraffeGameOver = true;
            giraffeGameOverReason = "negative";
          }
        }
        giraffeItems.splice(i, 1);
        continue; // 成功吃到並刪除物件後，跳過下方掉落到畫面外的判斷
      }
      
      // 原本超過畫面底部的防呆刪除機制
      if (item.y > height + 40) { 
        giraffeItems.splice(i, 1); 
      }
      }
    }
    drawGiraffeCharacter();
    
    push(); fill(0, 0, 0, 140); rect(25, 115, 190, 45, 8); fill(255, 255, 0); textSize(20); textStyle(BOLD); textAlign(LEFT, CENTER); text("🍎 得分: " + giraffeScore, 40, 138); fill(0, 0, 0, 140); rect(230, 115, 160, 45, 8); if (timeLeft <= 5) fill(255, 60, 60); else fill(100, 255, 100); text("⏱️ 時間: " + timeLeft + "s", 245, 138); pop();
  }

  if (isGiraffeGameOver) { 
    push(); rectMode(CORNER); fill(0, 0, 0, 180); rect(0, 0, width, height); textAlign(CENTER, CENTER); textStyle(BOLD); 
    if (giraffeGameOverReason === "negative") { fill(255, 50, 50); textSize(50); text("🚨 負分淘汰！挑戰失敗 🚨", width / 2, height / 2 - 40); } 
    else { fill(255, 215, 0); textSize(52); text("🎉 挑戰完成！分數: " + giraffeScore + " 🎉", width / 2, height / 2 - 40); } 
    rectMode(CENTER); fill(34, 139, 34); rect(width / 2, height / 2 + 90, 200, 50, 10); fill(255); textSize(20); text("重新挑戰 🔄", width / 2, height / 2 + 90); pop(); 
  }
}

function drawGiraffeCharacter() {
  push(); translate(mouseX, 560); scale(giraffeDir, 1); noStroke(); let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY); let walkSwing = (mouseSpeed > 0.5) ? sin(frameCount * 0.16) * 12 : 0; fill(250, 203, 107); rect(-28, 0, 72, 54, 15); 
  push(); translate(24, 42); rotate(radians(walkSwing)); fill(250, 203, 107); beginShape(); vertex(-5, 0); bezierVertex(-6, 20, -5, 45, -4, 65); vertex(4, 65); vertex(5, 0); endShape(CLOSE); fill(75, 50, 30); rect(-4, 59, 8, 7, 2, 2, 0, 0); stroke(40, 25, 15); line(0, 59, 0, 66); noStroke(); pop();
  push(); translate(12, 42); rotate(radians(-walkSwing * 0.6)); fill(235, 190, 95); beginShape(); vertex(-5, 0); bezierVertex(-6, 20, -5, 45, -4, 65); vertex(4, 65); vertex(5, 0); endShape(CLOSE); fill(65, 42, 25); rect(-4, 59, 8, 7, 2, 2, 0, 0); stroke(40, 25, 15); line(0, 59, 0, 66); noStroke(); pop();
  push(); translate(-10, 42); rotate(radians(-walkSwing * 0.6)); fill(235, 190, 95); beginShape(); vertex(-5, 0); bezierVertex(-4, 20, -4, 45, -3, 65); vertex(5, 65); vertex(4, 0); endShape(CLOSE); fill(65, 42, 25); rect(-4, 59, 9, 7, 2, 2, 0, 0); stroke(40, 25, 15); line(0.5, 59, 0.5, 66); noStroke(); pop();
  push(); translate(-20, 42); rotate(radians(walkSwing)); fill(250, 203, 107); beginShape(); vertex(-5, 0); bezierVertex(-6, 20, -4, 45, -3, 65); vertex(5, 65); vertex(5, 0); endShape(CLOSE); fill(75, 50, 30); rect(-3, 59, 8, 7, 2, 2, 0, 0); stroke(40, 25, 15); line(1, 59, 1, 66); noStroke(); pop();
  fill(217, 122, 43); rect(-14, 10, 16, 15, 4); rect(10, 8, 14, 18, 4); rect(-20, 26, 15, 14, 4); rect(2, 30, 16, 16, 4); stroke(250, 203, 107); strokeWeight(3); line(44, 15, 52, 40); noStroke(); fill(140, 78, 33); circle(52, 40, 7);
  let neckLen = map(mouseY, height, 0, 40, 240); neckLen = constrain(neckLen, 40, 240); fill(250, 203, 107); rect(-16, -neckLen, 20, neckLen + 5); fill(217, 122, 43); if (neckLen > 45)  rect(-13, -neckLen + 25, 14, 12, 3); if (neckLen > 85)  rect(-15, -neckLen + 60, 16, 14, 3); if (neckLen > 125) rect(-13, -neckLen + 100, 14, 13, 3); if (neckLen > 165) rect(-15, -neckLen + 140, 16, 15, 3); if (neckLen > 200) rect(-13, -neckLen + 180, 14, 13, 3);
  push(); translate(-6, -neckLen); fill(184, 98, 29); rect(10, 0, 4, 35, 1); fill(110, 55, 18); rect(-11, -26, 4, 15, 2); rect(3, -26, 4, 15, 2); ellipse(-9, -27, 10, 8); ellipse(5, -27, 10, 8); fill(250, 203, 107); push(); translate(8, -14); rotate(radians(25)); ellipse(0, 0, 20, 9); fill(230, 160, 70); ellipse(0, 0, 12, 5); pop(); push(); translate(-16, -14); rotate(radians(-25)); ellipse(0, 0, 20, 9); fill(230, 160, 70); ellipse(0, 0, 12, 5); pop(); fill(250, 203, 107); ellipse(-2, -4, 38, 30); fill(255, 227, 156); ellipse(-16, 1, 35, 25);      fill(0); circle(-3, -8, 8); fill(255); circle(-4.5, -9.5, 3.2); circle(-1.5, -6.5, 1.2); stroke(0); strokeWeight(1.5); noFill(); line(-7, -11, -11, -14); line(-3, -12, -5, -16); noStroke(); fill(130, 50, 10); circle(-26, 5, 3.5); fill(247, 166, 177, 160); ellipse(-8, -1, 7, 5); pop(); pop();
}


// =========================================================================
// 🦁 第七部分：獅子與大象系統 (並為大象與獅子補上介紹頁與倒數)
// =========================================================================

// ✨ 新增：完整版獅子園區處理函式
function handleLionGame() {
  drawDetailedSceneBase();
  drawScenicFence(365);
  drawHeader("獅子園區"); // 正確呼叫標題
  drawHomeButton();

  // 獅子遊戲狀態機 (INTRO -> COUNTDOWN -> PLAY)
  if (lionGameState === "INTRO") {
    push();
    fill(0, 0, 0, 180); rect(0, 0, width, height);
    fill(255); textAlign(CENTER, CENTER);
    textSize(40); text("🦁 獅子生存挑戰 🦁", width/2, height/2 - 100);
    textSize(24); text("移動滑鼠避開飢餓的獅子！\n堅持越久時間越長！", width/2, height/2 - 30);
    
    rectMode(CENTER); fill(85, 125, 85); rect(width/2, height/2 + 60, 180, 50, 10);
    fill(255); textSize(24); text("確認開始", width/2, height/2 + 60);
    pop();
    
    // 點擊開始判斷
    if (mouseIsPressed && mouseButton === LEFT && 
        mouseX > width/2 - 90 && mouseX < width/2 + 90 && 
        mouseY > height/2 + 35 && mouseY < height/2 + 85) {
      lionGameState = "COUNTDOWN";
      lastLionCountdownTime = millis();
      lionCountdownValue = 3;
    }
  } 
  else if (lionGameState === "COUNTDOWN") {
    push();
    fill(0, 0, 0, 150); rect(0,0,width,height);
    fill(255, 215, 0); textSize(100); textAlign(CENTER, CENTER);
    text(lionCountdownValue, width/2, height/2);
    pop();
    
    if (millis() - lastLionCountdownTime > 1000) {
      lionCountdownValue--;
      lastLionCountdownTime = millis();
      if (lionCountdownValue <= 0) {
        lionGameState = "PLAY";
        lionSceneStartTime = millis(); 
      }
    }
  } 
  else if (lionGameState === "PLAY") {
    let constrainedMouseX = mouseX;
    let constrainedMouseY = constrain(mouseY, 400, 750);
    
    if (!isGameOver) {
      let elapsed = millis() - lionSceneStartTime;
      if (!lionsSpawned && elapsed >= 300) { spawnInitialLions(2); lionsSpawned = true; nextLionSpawnTime = millis() + random(400, 700); }
      if (lionsSpawned && millis() >= nextLionSpawnTime) { spawnSingleLion(); nextLionSpawnTime = millis() + random(400, 700); }
      lionSurvivalTime = (elapsed / 1000).toFixed(1);
    }

    for (let i = 0; i < animals.length; i++) {
      let a = animals[i];
      if (!isGameOver) { moveAnimal(a); } 
      displayAnimal(a); 
      if (lionsSpawned && !isGameOver) {
        if (checkAnimalHitHuman(a, constrainedMouseX, constrainedMouseY, humanHitRadius)) { 
          isGameOver = true; 
          if (lionSound && lionSound.isLoaded()) { lionSound.setVolume(3.0); lionSound.play(); }
        }
      }
    }

    if (!isGameOver) {
      drawHandDrawnHuman(constrainedMouseX, constrainedMouseY); 
    }

    push();
    fill(0, 0, 0, 140); rect(25, 115, 160, 45, 8);
    fill(255, 255, 0); textSize(20); textStyle(BOLD); textAlign(LEFT, CENTER);
    text("⏱️ 時間: " + lionSurvivalTime + "s", 40, 138);
    pop();

    if (isGameOver) { drawGameOverScreen(); }
  }
}

// ✨ 修正後：大象園區處理函式（純 Emoji 無圓圈，無限選單版）
function handleElephantGame() {
  drawDetailedSceneBase();
  drawScenicFence(365);
  drawHeader("大象園區"); 
  drawHomeButton();

  if (elephantGameState === "INTRO") {
    push();
    fill(0, 0, 0, 180); rect(0, 0, width, height);
    fill(255); textAlign(CENTER, CENTER);
    textSize(40); text("🐘 綠意大象生態區 🐘", width/2, height/2 - 100);
    textSize(24); text("用【滑鼠左鍵】點擊右上角的食物進行採集，\n再點擊大象進行餵食。\n\n（💡 只有餵食葉子 🌿 大象才會開心噴水！其他食物會回到右上角）", width/2, height/2 - 20);
    
    rectMode(CENTER); fill(85, 125, 85); rect(width/2, height/2 + 80, 180, 50, 10);
    fill(255); textSize(24); text("進入園區", width/2, height/2 + 80);
    pop();
    
    if (mouseIsPressed && mouseButton === LEFT && 
        mouseX > width/2 - 90 && mouseX < width/2 + 90 && 
        mouseY > height/2 + 55 && mouseY < height/2 + 105) {
      
      elephantGameState = "PLAY";
      
      // 初始化右上角四種食物的位置
      elephantGroundFoods = [
        { x: width - 50, y: 120, type: "肉 🥩", size: 40 },
        { x: width - 50, y: 180, type: "葉子 🌿", size: 40 },
        { x: width - 50, y: 240, type: "魚 🐟", size: 40 },
        { x: width - 50, y: 300, type: "竹子 🎋", size: 40 }
      ];
      elephantHeldFood = null; 
    }
  } 
  else if (elephantGameState === "PLAY") {
    // 更新與畫出大象
    for (let i = 0; i < animals.length; i++) {
      let a = animals[i];
      moveAnimal(a);
      displayAnimal(a);
    }

    // 畫出右上角的純 Emoji 食物選單（已拿掉圓圈圈的框）
    push();
    textAlign(CENTER, CENTER);
    textSize(35);
    if (elephantGroundFoods && elephantGroundFoods.length > 0) {
      for (let i = 0; i < elephantGroundFoods.length; i++) {
        let f = elephantGroundFoods[i];
        
        // 💡 這裡移除了圓圈背景，直接畫實心不透明的 Emoji
        fill(255); 
        let symbol = f.type.includes(" ") ? f.type.split(" ")[1] : f.type;
        text(symbol, f.x, f.y);
      }
    }
    pop();

    // 畫出滑鼠手上的食物
    if (elephantHeldFood) {
      push();
      textAlign(CENTER, CENTER);
      textSize(45);
      fill(255); 
      let heldSymbol = elephantHeldFood.includes(" ") ? elephantHeldFood.split(" ")[1] : elephantHeldFood;
      let constrainedY = constrain(mouseY, 50, height - 50); 
      text(heldSymbol, mouseX, constrainedY);
      pop();
    }
  }
}
function drawHandDrawnHuman(hx, hy) {
  push(); translate(hx, hy); scale(1.35); noStroke(); let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY); let walkAngle = (mouseSpeed > 0.5) ? sin(frameCount * 0.25) * 0.25 : 0; fill(245, 190, 20); rect(-15, -10, 30, 32, 6); fill(210, 160, 10); rect(-11, 12, 22, 8, 2);  
  push(); translate(-6, 18); rotate(walkAngle); fill(45, 70, 125); rect(-5, 0, 10, 24, 4); fill(40); rect(-7, 21, 13, 7, 3); pop(); push(); translate(6, 18); rotate(-walkAngle); fill(45, 70, 125); rect(-5, 0, 10, 24, 4); fill(40); rect(-6, 21, 13, 7, 3); pop();
  fill(225, 70, 70); rect(-16, -16, 32, 38, 6); fill(245, 205, 175); triangle(-6, -16, 6, -16, 0, -8); fill(210, 160, 10); rect(-12, -14, 4, 30, 1); rect(8, -14, 4, 30, 1); fill(245, 205, 175); rect(-21, -10, 6, 23, 3); rect(15, -10, 6, 23, 3); 
  push(); translate(0, -32); fill(245, 205, 175); circle(0, 0, 29); fill(70, 45, 30); arc(0, -5, 33, 26, PI, TWO_PI); rect(-16, -7, 5, 13, 2); rect(11, -7, 5, 13, 2);  fill(40); circle(-6, -1, 3.5); circle(6, -1, 3.5); stroke(50, 30, 30); strokeWeight(2); noFill(); arc(0, 3, 7, 6, 0, PI); pop(); pop();
}

function drawHandDrawnHuman(hx, hy) {
  push(); translate(hx, hy); scale(1.35); noStroke(); let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY); let walkAngle = (mouseSpeed > 0.5) ? sin(frameCount * 0.25) * 0.25 : 0; fill(245, 190, 20); rect(-15, -10, 30, 32, 6); fill(210, 160, 10); rect(-11, 12, 22, 8, 2);  
  push(); translate(-6, 18); rotate(walkAngle); fill(45, 70, 125); rect(-5, 0, 10, 24, 4); fill(40); rect(-7, 21, 13, 7, 3); pop(); push(); translate(6, 18); rotate(-walkAngle); fill(45, 70, 125); rect(-5, 0, 10, 24, 4); fill(40); rect(-6, 21, 13, 7, 3); pop();
  fill(225, 70, 70); rect(-16, -16, 32, 38, 6); fill(245, 205, 175); triangle(-6, -16, 6, -16, 0, -8); fill(210, 160, 10); rect(-12, -14, 4, 30, 1); rect(8, -14, 4, 30, 1); fill(245, 205, 175); rect(-21, -10, 6, 23, 3); rect(15, -10, 6, 23, 3); 
  push(); translate(0, -32); fill(245, 205, 175); circle(0, 0, 29); fill(70, 45, 30); arc(0, -5, 33, 26, PI, TWO_PI); rect(-16, -7, 5, 13, 2); rect(11, -7, 5, 13, 2);  fill(40); circle(-6, -1, 3.5); circle(6, -1, 3.5); stroke(50, 30, 30); strokeWeight(2); noFill(); arc(0, 3, 7, 6, 0, PI); pop(); pop();
}


function drawGameOverScreen() { push(); rectMode(CORNER); fill(0, 0, 0, 180); rect(0, 0, width, height); textAlign(CENTER, CENTER); textStyle(BOLD); fill(255, 50, 50); textSize(50); text("🦁 獅子撲倒！遊戲結束 🚨", width / 2, height / 2 - 30); rectMode(CENTER); fill(34, 139, 34); stroke(255); strokeWeight(2); rect(width / 2, height / 2 + 50, 200, 50, 10); noStroke(); fill(255); textSize(20); text("重新挑戰 🔄", width / 2, height / 2 + 50); pop(); }
function drawPandaWinScreen(){ push(); rectMode(CORNER); fill(0, 0, 0, 180); rect(0, 0, width, height); textAlign(CENTER, CENTER); textStyle(BOLD); fill(255, 50, 50); textSize(50); text("🏆 傳奇神偷貓熊！", width / 2, height / 2 - 20); push(); rectMode(CENTER); fill(34, 139, 34); stroke(255); strokeWeight(2); rect(width / 2, height / 2 + 100, 200, 50, 10); noStroke(); fill(255); textSize(20); text("重新挑戰 🔄", width / 2, height / 2 + 100); pop(); }
function drawPandaGameOverScreen() { push(); rectMode(CORNER); fill(0, 0, 0, 180); rect(0, 0, width, height); textAlign(CENTER, CENTER); textStyle(BOLD); fill(255, 50, 50); textSize(50);text("💔 被強制營業！", width / 2, height / 2 - 20); push(); rectMode(CENTER); fill(180, 40, 40); stroke(255); strokeWeight(2); rect(width / 2, height / 2 + 100, 200, 50, 10); noStroke(); fill(255); textSize(20); text("重新挑戰 🔄", width / 2, height / 2 + 100); pop(); }
function resetPandaGame() { pandaHappiness = 50; keeperState = 0; stateTimer = 0; nextStateTime = 100; zzzParticles = []; sweatParticles = []; keeperX = 1100; hasPunishedThisRaid = false; targetLockTimer = 0; pandaGameState = "INTRO"; }
function resetLionGame() { isGameOver = false; animals = []; lionsSpawned = false; lionSceneStartTime = millis(); lionSurvivalTime = 0; lionGameState = "INTRO"; lionCountdownValue = 3; }
function resetElephantGame() { elephantGameState = "INTRO"; elephantCountdownValue = 3; animals = []; let count = floor(random(3, 7)); for (let i = 0; i < count; i++) { animals.push(createAnimal('elephant', i)); } }
function resetGiraffeGame() { giraffeScore = 0; giraffeItems = []; giraffeStartTime = millis(); isGiraffeGameOver = false; giraffeGameOverReason = ""; giraffeDir = 1; giraffeGameState = "INTRO"; countdownValue = 3; }

function spawnInitialLions(num) { for (let i = 0; i < num; i++) { spawnSingleLion(); } }

function spawnSingleLion() {
  let lion = createAnimal('lion', animals.length);
  lion.maxSpeedX = random(1.2, 3.6); lion.maxSpeedY = random(0.8, 2.0);
  if (random(1) < 0.5) { lion.x = -150; lion.speedX = lion.maxSpeedX; } else { lion.x = width + 150; lion.speedX = -lion.maxSpeedX; }
  lion.speedY = random(-lion.maxSpeedY, lion.maxSpeedY); lion.dir = lion.speedX > 0 ? -1 : 1;
  lion.lionDecisionTime = millis() + random(1000, 3000); lion.isLionStopping = false;
  animals.push(lion);
}

function createAnimal(type, index = 0) {
  let animal = {
    type: type, index: index, isStopping: false, fedTime: 0, targetTree: null, isEating: false,
    isWaterSplashing: false, splashStartTime: 0, waterParticles: [], nextDecisionTime: millis() + random(2000, 5000),
    customSplashHeight: random(-14, -24), customSplashSpread: random(2, 6)
  };
  if (type === 'lion') {
    animal.x = random(150, width - 150); animal.y = random(520, 610); animal.scaleFactor = random(0.8, 1.4);
    animal.maxSpeedX = random(1.2, 3.4); animal.maxSpeedY = random(0.8, 2.0);
    let randDirX = random([1, -1]); animal.speedX = animal.maxSpeedX * randDirX; animal.speedY = random(-animal.maxSpeedY, animal.maxSpeedY);
    animal.dir = animal.speedX > 0 ? -1 : 1; animal.lionHitRadius = 28 * animal.scaleFactor; animal.lionDecisionTime = millis() + random(1500, 4000);
    animal.isLionStopping = false;
  } else if (type === 'elephant') {
    animal.scaleFactor = random(0.6, 1.05); animal.dir = random([1, -1]); animal.speedX = random(1.1, 1.9); animal.speedY = random(-0.6, 0.6);
    animal.x = random(180, width - 180) + (animal.index * 65); animal.y = random(510, 630) + (animal.index * 15);
  } else {
    animal.scaleFactor = random(0.6, 1.05); animal.dir = random([1, -1]); animal.speedX = random(1.1, 2.0) * animal.dir; animal.speedY = 0;
    animal.x = random(180, width - 180) + (animal.index * 40); animal.y = random(520, 640);
  }
  return animal;
}

function moveAnimal(animal) {
  if (animal.type === 'lion') {
    if (millis() > animal.lionDecisionTime) {
      animal.isLionStopping = !animal.isLionStopping;
      if (animal.isLionStopping) { animal.speedX = 0; animal.speedY = 0; animal.lionDecisionTime = millis() + random(600, 1500); }
      else {
        let currentDirX = (random(1) < 0.5) ? 1 : -1; animal.speedX = random(1.0, animal.maxSpeedX) * currentDirX; animal.speedY = random(-animal.maxSpeedY, animal.maxSpeedY);
        animal.dir = animal.speedX > 0 ? -1 : 1; animal.lionDecisionTime = millis() + random(2000, 4500);
      }
    }
    animal.x += animal.speedX; animal.y += animal.speedY;
    if (animal.x > width - 120 && animal.speedX > 0) { animal.speedX *= -1; animal.dir = animal.speedX > 0 ? -1 : 1; }
    if (animal.x < 120 && animal.speedX < 0) { animal.speedX *= -1; animal.dir = animal.speedX > 0 ? -1 : 1; }
    if (animal.y > 660 && animal.speedY > 0) { animal.speedY *= -1; } if (animal.y < 460 && animal.speedY < 0) { animal.speedY *= -1; }
    return;
  }
  if (animal.type === 'elephant') {
    let elephantWidthOffset = 110 * animal.scaleFactor; let minBoundary = elephantWidthOffset; let maxBoundary = width - elephantWidthOffset;
    if (animal.x <= minBoundary && animal.dir === -1) { animal.dir = 1; animal.x = minBoundary + 15; animal.isStopping = false; animal.nextDecisionTime = millis() + random(3000, 6000); } 
    else if (animal.x >= maxBoundary && animal.dir === 1) { animal.dir = -1; animal.x = maxBoundary - 15; animal.isStopping = false; animal.nextDecisionTime = millis() + random(3000, 6000); }
    let minY = 485; let maxY = 645;
    if (animal.y <= minY) { animal.y = minY + 2; animal.speedY = abs(animal.speedY); } else if (animal.y >= maxY) { animal.y = maxY - 2; animal.speedY = -abs(animal.speedY); }
    if (animal.isWaterSplashing) { if (millis() - animal.splashStartTime > 800) { animal.isWaterSplashing = false; animal.nextDecisionTime = millis() + random(1000, 3000); } return; }
    if (millis() > animal.nextDecisionTime) { animal.isStopping = !animal.isStopping; if (!animal.isStopping) { if (random(1) < 0.35) animal.dir *= -1; animal.speedY = random(-0.7, 0.7); } animal.nextDecisionTime = millis() + (animal.isStopping ? random(1500, 3500) : random(3000, 6500)); }
    if (animal.isStopping) return; 
    animal.x += (abs(animal.speedX) || 1.4) * animal.dir; animal.y += animal.speedY; return;
  }
  animal.x += (abs(animal.speedX) || 1.5) * animal.dir; if (animal.x > width - 130 || animal.x < 130) { animal.dir *= -1; }
}

function displayAnimal(animal) {
  push(); translate(animal.x, animal.y);
  if (animal.type === 'lion') scale(animal.dir * animal.scaleFactor, animal.scaleFactor); else scale(-animal.dir * animal.scaleFactor, animal.scaleFactor); 
  noStroke();
  
  if (animal.type === 'lion') {
    let isMoving = !animal.isLionStopping; let walkLeg = isMoving ? sin(frameCount * 0.25) * 5 : 0; let bounceBody = isMoving ? abs(sin(frameCount * 0.25)) * 3 : 0; let tailWiggle = sin(frameCount * 0.1) * 12;
    push(); translate(36, -5 - bounceBody); rotate(radians(-25 + tailWiggle)); stroke(242, 183, 73); strokeWeight(4); noFill(); bezier(0, 0, 15, -15, 10, -35, 20, -42); noStroke(); fill(214, 58, 43); push(); translate(20, -44); rotate(radians(45)); rect(-4, -4, 9, 9, 2); pop(); pop();
    fill(219, 158, 59); rect(18 + walkLeg, 24 - bounceBody, 12, 16, 4); rect(-18 - walkLeg, 24 - bounceBody, 12, 16, 4); fill(185, 125, 40); ellipse(24 + walkLeg, 38 - bounceBody, 14, 6); ellipse(-12 - walkLeg, 38 - bounceBody, 14, 6);
    fill(242, 183, 73); rect(-30, -14 - bounceBody, 70, 44, 20); 
    fill(242, 183, 73); rect(10 - walkLeg, 24 - bounceBody, 13, 17, 4); rect(-24 + walkLeg, 24 - bounceBody, 13, 17, 4); fill(195, 135, 45); ellipse(16 - walkLeg, 39 - bounceBody, 15, 6); ellipse(-18 + walkLeg, 39 - bounceBody, 15, 6);
    push(); translate(-26, -20 - bounceBody); fill(214, 58, 43); let manePoints = 10; for (let i = 0; i < manePoints; i++) { let angle = TWO_PI / manePoints * i; let mx = cos(angle) * 24; let my = sin(angle) * 24; circle(mx, my, 26); } circle(0, 0, 52); pop();
    push(); translate(-26, -20 - bounceBody); fill(214, 58, 43); circle(-16, -24, 13); fill(242, 183, 73); circle(-15, -23, 7); fill(214, 58, 43); circle(16, -24, 13); fill(242, 183, 73); circle(15, -23, 7); fill(242, 183, 73); circle(0, 0, 44); fill(247, 236, 210); ellipse(0, 6, 26, 18); fill(54, 33, 22); triangle(-3, 1, 3, 1, 0, 4); stroke(54, 33, 22); strokeWeight(1.5); noFill(); arc(-3, 5, 6, 5, 0, PI); arc(3, 5, 6, 5, 0, PI); noStroke(); fill(240, 130, 140, 200); ellipse(-14, 3, 7, 5); ellipse(14, 3, 7, 5); fill(54, 33, 22); circle(-8, -3, 4.5); circle(8, -3, 4.5); pop();
  } 
  else if (animal.type === 'elephant') {
    let isMoving = (!animal.isStopping && !animal.isWaterSplashing); let walkSwing = isMoving ? sin(frameCount * 0.16) * 12 : 0; let waveEar = sin(frameCount * 0.06) * 6; let tailSwing = isMoving ? cos(frameCount * 0.15) * 15 : sin(frameCount * 0.04) * 5;
    push(); translate(60, 15); rotate(radians(tailSwing)); stroke(110, 120, 125); strokeWeight(5); line(0, 0, 15, 25); noStroke(); fill(70); circle(15, 25, 7); pop();
    if (animal.index % 2 === 0) fill(95, 104, 109); else fill(115, 124, 129); push(); translate(48, 42); rotate(radians(isMoving ? -walkSwing*0.6 : 0)); beginShape(); vertex(-13, 0); bezierVertex(-15, 12, -11, 26, -9, 36); vertex(9, 36); vertex(11, 0); endShape(CLOSE); fill(230); ellipse(-4, 34, 5, 4); ellipse(1, 35, 5, 4); ellipse(6, 34, 5, 4); pop();
    if (animal.index % 2 === 0) fill(122, 133, 139); else fill(142, 153, 159); push(); translate(32, 42); rotate(radians(walkSwing)); beginShape(); vertex(-12, 0); bezierVertex(-15, 12, -11, 26, -9, 38); vertex(11, 38); vertex(12, 18); bezierVertex(13, 10, 14, 4, 12, 0); endShape(CLOSE); fill(240); ellipse(-4, 36, 6, 4); ellipse(2, 37, 6, 4); ellipse(7, 36, 6, 4); pop();
    if (animal.index % 2 === 0) fill(95, 104, 109); else fill(115, 124, 129); push(); translate(-28, 42); rotate(radians(isMoving ? -walkSwing*0.6 : 0)); beginShape(); vertex(-13, 0); bezierVertex(-11, 12, -9, 26, -7, 36); vertex(11, 36); vertex(9, 0); endShape(CLOSE); fill(230); ellipse(-5, 34, 5, 4); ellipse(0, 35, 5, 4); ellipse(5, 34, 5, 4); pop();
    fill(142, 153, 159); push(); translate(-14, 42); rotate(radians(walkSwing)); beginShape(); vertex(-14, 0); bezierVertex(-17, 12, -12, 26, -10, 38); vertex(11, 38); vertex(12, 0); endShape(CLOSE); fill(240); ellipse(-5, 36, 6, 4); ellipse(1, 37, 6, 4); ellipse(6, 36, 6, 4); pop();
    if (animal.index % 2 === 0) fill(128, 139, 145); else fill(148, 159, 165); ellipse(10, 15, 115, 80); if (animal.index % 2 === 0) fill(140, 151, 157); else fill(160, 171, 177); ellipse(15, 22, 100, 72); circle(38, 12, 64); if (animal.index % 2 === 0) fill(140, 151, 157); else fill(160, 171, 177); circle(-45, 12, 72); push(); translate(-62, 28); rotate(radians(-15)); fill(245, 245, 230); triangle(0, -5, -32, 10, 0, 8); pop();
    push(); translate(-68, 18); 
    if (animal.isWaterSplashing) { if (animal.index % 2 === 0) fill(110, 120, 125); else fill(130, 140, 145); rotate(radians(-65)); rect(-10, -32, 20, 46, 7); translate(0, -28); rotate(radians(-20)); if (animal.index % 2 === 0) fill(122, 133, 139); else fill(142, 153, 159); rect(-8, -24, 16, 32, 5);
    } else { let noseSwing = isMoving ? sin(frameCount * 0.1) * 8 : sin(frameCount * 0.03) * 3; rotate(radians(noseSwing)); if (animal.index % 2 === 0) fill(110, 120, 125); else fill(130, 140, 145); rect(-10, -5, 20, 46, 7); translate(0, 38); rotate(radians(-15 + noseSwing)); if (animal.index % 2 === 0) fill(122, 133, 139); else fill(142, 153, 159); rect(-8, -2, 16, 32, 5); } pop();
    push(); translate(-28, 6); rotate(radians(waveEar)); if (animal.index % 2 === 0) fill(112, 123, 129); else fill(132, 143, 149); ellipse(0, 0, 48, 64); if (animal.index % 2 === 0) fill(135, 146, 152); else fill(155, 166, 172); ellipse(-3, 0, 36, 50); fill(195, 170, 175, 120); ellipse(-6, 2, 22, 32); pop();
    fill(0); if (animal.isStopping && frameCount % 60 < 8) { stroke(80); strokeWeight(2); line(-56, 5, -48, 5); noStroke(); } else { circle(-52, 5, 6.5); fill(255); circle(-53, 3, 2.5); } pop(); 
    if (animal.isWaterSplashing) {
      let noseTipX = animal.x - animal.dir * (-125 * animal.scaleFactor); let noseTipY = animal.y - (75 * animal.scaleFactor);
      for (let k = 0; k < 5; k++) { animal.waterParticles.push({ x: noseTipX, y: noseTipY, vx: random(-3, 1) - (animal.dir * (animal.customSplashSpread + 1.5)), vy: animal.customSplashHeight - 6, size: random(5, 10), alpha: 255, isSplash: false }); }
    }
    for (let i = animal.waterParticles.length - 1; i >= 0; i--) {
      let p = animal.waterParticles[i];
      if (!p.isSplash) { p.vy += 0.55; p.vx *= 0.98; p.x += p.vx; p.y += p.vy; p.alpha -= 2.0; if (p.vy > 0 && p.y > animal.y + 35) { p.isSplash = true; p.vy = random(-1.5, -4); p.vx = random(-3, 3); p.size = p.size * 0.6; }
      } else { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.alpha -= 12; }
      push(); noStroke(); fill(180, 225, 255, p.alpha); circle(p.x, p.y, p.size); pop();
      if (p.alpha <= 0 || p.y > height) animal.waterParticles.splice(i, 1);
    }
  }
  
  if (animal.type !== 'lion' && animal.type !== 'elephant' && millis() - animal.fedTime < 1500) {
    push(); textSize(30 * animal.scaleFactor); textAlign(CENTER); text("❤️ " + foodTypes[exhibitZones[animal.type].correctFood].split(" ")[1], animal.x, animal.y - (130 * animal.scaleFactor)); pop();
  }
  pop();
}

function checkAnimalClicked(animal, mx, my) { let radius = 75 * animal.scaleFactor; return dist(mx, my, animal.x, animal.y) < radius; }
function checkAnimalHitHuman(animal, hx, hy, hRadius) { return dist(hx, hy, animal.x, animal.y) < (animal.lionHitRadius + hRadius); }
function triggerWaterSplash(animal) { animal.isWaterSplashing = true; animal.splashStartTime = millis(); animal.customSplashHeight = random(-14, -25); animal.customSplashSpread = random(2.5, 6.5);   if (elephantSound && elephantSound.isLoaded()) { elephantSound.play(); } }


// =========================================================================
// 🖱️ 第八部分：使用者互動 (滑鼠點擊事件)
// =========================================================================

function mousePressed() {
  userStartAudio();

  
  if (mouseButton === RIGHT) { 
    currentFoodIndex = (currentFoodIndex + 1) % foodTypes.length; 
    return; 
  }
  
  if (mouseButton === LEFT) {
    // 標題頁邏輯
    if (currentScene === 'title') {
      if (!isFadingOut && mouseY > 400) { 
        isFadingOut = true; 
      }
      return;
    }
    
    // 細節頁面邏輯
    if (currentScene === 'detail') {
      
      // 全域 Home 按鈕
      if (dist(mouseX, mouseY, width - 40, 40) < 50) {

    stopParkMusic();

    if (!bgMusic.isPlaying()) {
        bgMusic.loop();
    }

    currentScene = 'map';

    selectedExhibit = null;
    animals = [];
    zooTrees = [];
    isGameOver = false;
    isGiraffeGameOver = false;
    pandaGameState = "INTRO";
    lionGameState = "INTRO";
    elephantGameState = "INTRO";
    fenceOpenProgress = 0;

    return;
}

      // 各遊戲專用的重置按鈕
      if (selectedExhibit === 'giraffe' && isGiraffeGameOver) { 
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 65 && mouseY < height / 2 + 115) { resetGiraffeGame(); } 
        return; 
      }
      if (selectedExhibit === 'panda' && (pandaGameState === "WIN" || pandaGameState === "GAMEOVER")) { 
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 75 && mouseY < height / 2 + 125) { resetPandaGame(); } 
        return; 
      }
      if (selectedExhibit === 'lion' && isGameOver) {
        if (mouseX > width / 2 - 110 && mouseX < width / 2 + 110 && mouseY > height / 2 + 22 && mouseY < height / 2 + 78) { resetLionGame(); }
        return; 
      }
    }
    
    // 地圖頁面邏輯
    if (currentScene === 'map') {
      if (dist(mouseX, mouseY, width / 2, height / 2) < 130) {
        currentScene = 'title';
        fenceOpenProgress = 0; 
        isFadingOut = false;
        transitionAlpha = 0;   
        return;
      }

      for (let key in exhibitZones) {
        let zone = exhibitZones[key];
        if (mouseX > zone.x && mouseX < zone.x + zone.w && mouseY > zone.y && mouseY < zone.y + zone.h) {
          selectedExhibit = key; currentScene = 'detail'; animals = []; 
          
          bgMusic.stop();
          stopParkMusic();

          if (key === 'lion') {
              lionBg.loop();
          }
          else if (key === 'giraffe') {
              giraffeBg.loop();
          }
          else if (key === 'panda') {
              pandaBg.loop();
          }
          else if (key === 'elephant') {
              elephantBg.loop();
          }
          
          if (key === 'lion') { resetLionGame(); } 
          else if (key === 'giraffe') { resetGiraffeGame(); } 
          else if (key === 'panda') { resetPandaGame(); } 
          else if (key === 'elephant') { resetElephantGame(); } 
          return;
        }
      }
    } 
    
   // 遊戲中大象的餵食與澆水互動 (✨ 完美修正：餵錯回右上角、餵對葉子無限再生)
    else if (currentScene === 'detail' && selectedExhibit === 'elephant' && elephantGameState === "PLAY") {
      let constrainedMouseY = constrain(mouseY, 50, height - 50);
      
      // 情況 A：如果手上目前沒有食物 ➔ 採集右上角的食物
      if (!elephantHeldFood && elephantGroundFoods) {
        for (let i = elephantGroundFoods.length - 1; i >= 0; i--) {
          let f = elephantGroundFoods[i];
          let d = dist(mouseX, mouseY, f.x, f.y);
          
          if (d < f.size) {
            elephantHeldFood = f.type;          
            elephantGroundFoods.splice(i, 1);   // 從右上角暫時拿走
            return;                             
          }
        }
      } 
      // 情況 B：如果手上已經拿著採集到的食物 ➔ 點擊大象餵食
      else if (elephantHeldFood) {
        for (let i = 0; i < animals.length; i++) {
          let a = animals[i];
          
          if (checkAnimalClicked(a, mouseX, constrainedMouseY)) {
            let fedFood = elephantHeldFood;   
            elephantHeldFood = null;          // 手上清空
            
            if (fedFood.includes("🌿")) {
              // 🟢 餵對了！大象吃掉葉子，開心地觸發噴水
              a.fedTime = millis(); 
              triggerWaterSplash(a);
              
              // ✨ 核心功能：葉子被吃掉後，右上角「重新生成」一片新葉子 🌿
              if (elephantGroundFoods) {
                elephantGroundFoods.push({ x: width - 50, y: 180, type: "葉子 🌿", size: 40 });
              }
            } else {
              // 🔴 餵錯了！不噴水，食物「直接回到右上角」原本的位置
              if (elephantGroundFoods) {
                // 根據食物種類，自動送回原有的 Y 軸固定高度位置
                let originalY = 120; // 預設肉的 y
                if (fedFood.includes("🥩")) originalY = 120;
                if (fedFood.includes("🐟")) originalY = 240;
                if (fedFood.includes("🎋")) originalY = 300;
                
                elephantGroundFoods.push({
                  x: width - 50,
                  y: originalY,
                  type: fedFood, 
                  size: 40
                });
              }
            }
            return; 
          }
        }
        
        // 情況 C：如果拿著食物點到空地 ➔ 一律也直接「送回右上角」原本的位置
        if (elephantGroundFoods) {
          let originalY = 120;
          if (elephantHeldFood.includes("🥩")) originalY = 120;
          if (elephantHeldFood.includes("🌿")) originalY = 180;
          if (elephantHeldFood.includes("🐟")) originalY = 240;
          if (elephantHeldFood.includes("🎋")) originalY = 300;
          
          elephantGroundFoods.push({
            x: width - 50,
            y: originalY,
            type: elephantHeldFood,
            size: 40
          });
          elephantHeldFood = null;
        }
      }
    }
  }
}
function updateMusic() {
  // 如果在標題畫面或地圖，播 zoo.mp3
  if (currentScene === 'title' || currentScene === 'map') {
    if (!bgMusic.isPlaying()) {
      bgMusic.loop();
      for (let key in parkMusics) { parkMusics[key].stop(); }
    }
  } 
  // 如果在園區，播對應音樂
  else if (parkMusics[currentScene]) {
    if (!parkMusics[currentScene].isPlaying()) {
      parkMusics[currentScene].loop();
      bgMusic.stop(); 
      for (let key in parkMusics) {
        if (key !== currentScene) { parkMusics[key].stop(); }
      }
    }
  }
}