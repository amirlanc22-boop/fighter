import * as Phaser from 'phaser';

const UI_BUTTON_SIZE = { width: 320, height: 60 };
const UI_PANEL_SIZE = { width: 520, height: 420 };
const PLAYER_SIZE = { width: 42, height: 54 };

export interface GeneratedTextureAsset {
  id: string;
  kind: 'generated-texture';
  width: number;
  height: number;
  usage: string;
}

export const GENERATED_TEXTURE_ASSETS: GeneratedTextureAsset[] = [
  generated('ui-button', UI_BUTTON_SIZE.width, UI_BUTTON_SIZE.height, 'menu button background'),
  generated('ui-button-active', UI_BUTTON_SIZE.width, UI_BUTTON_SIZE.height, 'selected menu button background'),
  generated('ui-panel', UI_PANEL_SIZE.width, UI_PANEL_SIZE.height, 'settings panel background'),
  generated('sample-actor', PLAYER_SIZE.width, PLAYER_SIZE.height, 'neutral starter actor'),
  generated('sample-platform', 180, 38, 'neutral starter platform tile'),
  generated('sample-pickup', 28, 28, 'neutral starter collectible'),
  generated('sample-exit', 70, 112, 'neutral starter level exit'),
  generated('sample-hazard', 56, 30, 'neutral starter hazard'),
  generated('sample-bg-sky', 1280, 720, 'generated sky/background layer'),
  generated('sample-bg-far', 1280, 720, 'generated far parallax layer'),
  generated('sample-bg-mid', 1280, 720, 'generated mid parallax layer'),
  generated('rooftop-twilight-stage', 1774, 887, 'generated rooftop twilight fighting stage'),
  generated('rooftop-sunset-stage', 2048, 768, 'generated rooftop sunset fighting stage'),
  generated('mode-card-1v1', 480, 360, 'generated mode select card for 1v1'),
  generated('mode-card-1vcpu', 480, 360, 'generated mode select card for 1vCPU')
];

function generated(
  id: string,
  width: number,
  height: number,
  usage: string
): GeneratedTextureAsset {
  return {
    id,
    kind: 'generated-texture',
    width,
    height,
    usage
  };
}

function generateRectangleTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  fillColor: number,
  strokeColor = 0x0f172a
): void {
  if (scene.textures.exists(key)) {
    return;
  }

  const graphics = scene.add.graphics();

  graphics.fillStyle(fillColor, 1);
  graphics.fillRect(0, 0, width, height);
  graphics.lineStyle(3, strokeColor, 1);
  graphics.strokeRect(1.5, 1.5, width - 3, height - 3);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
}

function generatePickupTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists('sample-pickup')) {
    return;
  }

  const graphics = scene.add.graphics();
  graphics.fillStyle(0xfacc15, 1);
  graphics.fillCircle(14, 14, 13);
  graphics.lineStyle(3, 0xfef3c7, 1);
  graphics.strokeCircle(14, 14, 11);
  graphics.generateTexture('sample-pickup', 28, 28);
  graphics.destroy();
}

function generateBackgroundTexture(
  scene: Phaser.Scene,
  key: string,
  baseColor: number,
  accentColor: number
): void {
  if (scene.textures.exists(key)) {
    return;
  }

  const graphics = scene.add.graphics();
  graphics.fillStyle(baseColor, 1);
  graphics.fillRect(0, 0, 1280, 720);

  for (let index = 0; index < 10; index += 1) {
    graphics.fillStyle(accentColor, 0.08 + index * 0.01);
    graphics.fillRect(index * 140 - 60, 380 + (index % 3) * 42, 260, 260);
  }

  graphics.generateTexture(key, 1280, 720);
  graphics.destroy();
}

function generateStageRooftopTwilight(scene: Phaser.Scene): void {
  const key = 'rooftop-twilight-stage';
  if (scene.textures.exists(key)) {
    return;
  }

  const width = 1774;
  const height = 887;
  const canvasTexture = scene.textures.createCanvas(key, width, height);
  if (!canvasTexture) {
    return;
  }
  const ctx = canvasTexture.context;

  // Twilight sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.75);
  skyGrad.addColorStop(0, '#070a1e');
  skyGrad.addColorStop(0.35, '#161334');
  skyGrad.addColorStop(0.7, '#35164a');
  skyGrad.addColorStop(1, '#652358');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 180; i += 1) {
    const sx = (Math.sin(i * 997) * 0.5 + 0.5) * width;
    const sy = (Math.cos(i * 613) * 0.5 + 0.5) * (height * 0.52);
    const size = i % 5 === 0 ? 2 : 1;
    ctx.globalAlpha = 0.35 + (i % 7) * 0.09;
    ctx.fillRect(sx, sy, size, size);
  }
  ctx.globalAlpha = 1.0;

  // Crescent Moon with soft glow
  ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
  ctx.beginPath();
  ctx.arc(width * 0.76, height * 0.18, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(width * 0.76, height * 0.18, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a0d24';
  ctx.beginPath();
  ctx.arc(width * 0.76 - 11, height * 0.18 - 7, 28, 0, Math.PI * 2);
  ctx.fill();

  let seed = 42;
  const rand = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Distant Skyline (Back layer)
  ctx.fillStyle = '#110f27';
  let curX = -10;
  while (curX < width + 100) {
    const bWidth = 45 + rand() * 95;
    const bHeight = 220 + rand() * 260;
    const by = height * 0.74 - bHeight;
    ctx.fillRect(curX, by, bWidth, bHeight);

    // Spire
    if (rand() > 0.65) {
      ctx.fillRect(curX + bWidth * 0.5 - 2, by - 40, 4, 40);
    }

    // Windows
    ctx.fillStyle = '#fef08a20';
    for (let wy = by + 20; wy < height * 0.74 - 20; wy += 14) {
      for (let wx = curX + 8; wx < curX + bWidth - 8; wx += 12) {
        if (rand() > 0.45) {
          ctx.fillRect(wx, wy, 4, 7);
        }
      }
    }
    ctx.fillStyle = '#110f27';
    curX += bWidth + rand() * 12;
  }

  // Mid Skyline (Closer layer with neon signs & antennas)
  ctx.fillStyle = '#1a1738';
  curX = -20;
  while (curX < width + 100) {
    const bWidth = 65 + rand() * 120;
    const bHeight = 150 + rand() * 210;
    const by = height * 0.76 - bHeight;
    ctx.fillRect(curX, by, bWidth, bHeight);

    // Neon beacon on roof
    if (rand() > 0.5) {
      ctx.fillStyle = rand() > 0.5 ? '#f43f5e' : '#38bdf8';
      ctx.fillRect(curX + bWidth * 0.5 - 2, by - 30, 4, 30);
      ctx.beginPath();
      ctx.arc(curX + bWidth * 0.5, by - 30, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Windows
    ctx.fillStyle = '#67e8f930';
    for (let wy = by + 16; wy < height * 0.76 - 15; wy += 16) {
      for (let wx = curX + 10; wx < curX + bWidth - 10; wx += 14) {
        if (rand() > 0.42) {
          ctx.fillRect(wx, wy, 6, 9);
        }
      }
    }
    ctx.fillStyle = '#1a1738';
    curX += bWidth + rand() * 18;
  }

  // Rooftop combat arena platform (y ~ 640 to 887)
  const floorTop = height * 0.72;

  // Background wall & safety railing
  ctx.fillStyle = '#262248';
  ctx.fillRect(0, floorTop - 45, width, 45);

  ctx.fillStyle = '#475569';
  for (let rx = 0; rx < width; rx += 28) {
    ctx.fillRect(rx, floorTop - 40, 4, 40);
  }
  ctx.fillRect(0, floorTop - 40, width, 4);
  ctx.fillRect(0, floorTop - 22, width, 3);

  // Warning beacon lights on railing
  for (let bx = 60; bx < width; bx += 240) {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(bx, floorTop - 42, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Concrete deck gradient
  const deckGrad = ctx.createLinearGradient(0, floorTop, 0, height);
  deckGrad.addColorStop(0, '#2d3748');
  deckGrad.addColorStop(0.2, '#1e2638');
  deckGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = deckGrad;
  ctx.fillRect(0, floorTop, width, height - floorTop);

  // Floor perspective grid lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  for (let tx = 0; tx < width; tx += 90) {
    ctx.beginPath();
    ctx.moveTo(tx, floorTop);
    ctx.lineTo(tx, height);
    ctx.stroke();
  }
  for (let ty = floorTop; ty < height; ty += 45) {
    ctx.beginPath();
    ctx.moveTo(0, ty);
    ctx.lineTo(width, ty);
    ctx.stroke();
  }

  // Atmospheric neon purple rim light on the fighting surface
  const rimGrad = ctx.createLinearGradient(0, floorTop, 0, floorTop + 80);
  rimGrad.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
  rimGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, floorTop, width, 80);

  canvasTexture.refresh();
}

function generateStageRooftopSunset(scene: Phaser.Scene): void {
  const key = 'rooftop-sunset-stage';
  if (scene.textures.exists(key)) {
    return;
  }

  const width = 2048;
  const height = 768;
  const canvasTexture = scene.textures.createCanvas(key, width, height);
  if (!canvasTexture) {
    return;
  }
  const ctx = canvasTexture.context;

  // Vibrant Sunset sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.78);
  skyGrad.addColorStop(0, '#1c0b28');
  skyGrad.addColorStop(0.3, '#701a38');
  skyGrad.addColorStop(0.62, '#b43818');
  skyGrad.addColorStop(0.85, '#e06612');
  skyGrad.addColorStop(1, '#fbb01e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Big glowing sunset sun
  const sunX = width * 0.62;
  const sunY = height * 0.42;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 160);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  sunGlow.addColorStop(0.4, 'rgba(251, 146, 60, 0.6)');
  sunGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 54, 0, Math.PI * 2);
  ctx.fill();

  let seed = 108;
  const rand = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Distant Skyline silhouettes backlit by the sun
  ctx.fillStyle = '#260c20';
  let curX = -10;
  while (curX < width + 100) {
    const bWidth = 50 + rand() * 110;
    const bHeight = 200 + rand() * 250;
    const by = height * 0.74 - bHeight;
    ctx.fillRect(curX, by, bWidth, bHeight);

    // Crane / antenna
    if (rand() > 0.7) {
      ctx.fillRect(curX + bWidth * 0.5 - 3, by - 45, 6, 45);
      ctx.fillRect(curX + bWidth * 0.5 - 25, by - 45, 50, 4);
    }

    // Windows reflecting golden sunset
    ctx.fillStyle = 'rgba(254, 215, 170, 0.25)';
    for (let wy = by + 20; wy < height * 0.74 - 20; wy += 15) {
      for (let wx = curX + 8; wx < curX + bWidth - 8; wx += 13) {
        if (rand() > 0.4) {
          ctx.fillRect(wx, wy, 5, 8);
        }
      }
    }
    ctx.fillStyle = '#260c20';
    curX += bWidth + rand() * 15;
  }

  // Mid Skyline & Industrial equipment
  ctx.fillStyle = '#341328';
  curX = -20;
  while (curX < width + 100) {
    const bWidth = 70 + rand() * 130;
    const bHeight = 140 + rand() * 190;
    const by = height * 0.76 - bHeight;
    ctx.fillRect(curX, by, bWidth, bHeight);

    // Windows
    ctx.fillStyle = 'rgba(253, 186, 116, 0.35)';
    for (let wy = by + 16; wy < height * 0.76 - 15; wy += 16) {
      for (let wx = curX + 10; wx < curX + bWidth - 10; wx += 15) {
        if (rand() > 0.42) {
          ctx.fillRect(wx, wy, 6, 9);
        }
      }
    }
    ctx.fillStyle = '#341328';
    curX += bWidth + rand() * 20;
  }

  // Rooftop combat arena platform (y ~ 570 to 768)
  const floorTop = height * 0.72;

  // Background wall & fence
  ctx.fillStyle = '#3f192b';
  ctx.fillRect(0, floorTop - 42, width, 42);

  ctx.fillStyle = '#582137';
  for (let rx = 0; rx < width; rx += 28) {
    ctx.fillRect(rx, floorTop - 38, 4, 38);
  }
  ctx.fillRect(0, floorTop - 38, width, 4);
  ctx.fillRect(0, floorTop - 20, width, 3);

  // Concrete deck gradient
  const deckGrad = ctx.createLinearGradient(0, floorTop, 0, height);
  deckGrad.addColorStop(0, '#381c2c');
  deckGrad.addColorStop(0.25, '#26121f');
  deckGrad.addColorStop(1, '#150912');
  ctx.fillStyle = deckGrad;
  ctx.fillRect(0, floorTop, width, height - floorTop);

  // Hazard warning stripe at deck top
  const stripeH = 10;
  for (let sx = 0; sx < width; sx += 30) {
    ctx.fillStyle = sx % 60 === 0 ? '#f59e0b' : '#1a0d16';
    ctx.fillRect(sx, floorTop, 30, stripeH);
  }

  // Floor perspective lines
  ctx.strokeStyle = '#4a243b';
  ctx.lineWidth = 2;
  for (let tx = 0; tx < width; tx += 95) {
    ctx.beginPath();
    ctx.moveTo(tx, floorTop + stripeH);
    ctx.lineTo(tx, height);
    ctx.stroke();
  }
  for (let ty = floorTop + stripeH; ty < height; ty += 40) {
    ctx.beginPath();
    ctx.moveTo(0, ty);
    ctx.lineTo(width, ty);
    ctx.stroke();
  }

  // Sunset amber glare across the arena floor
  const glareGrad = ctx.createLinearGradient(0, floorTop, 0, floorTop + 90);
  glareGrad.addColorStop(0, 'rgba(251, 146, 60, 0.35)');
  glareGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
  ctx.fillStyle = glareGrad;
  ctx.fillRect(0, floorTop, width, 90);

  canvasTexture.refresh();
}

function generateModeCard1v1(scene: Phaser.Scene): void {
  const key = 'mode-card-1v1';
  if (scene.textures.exists(key)) {
    return;
  }

  const width = 480;
  const height = 360;
  const canvasTexture = scene.textures.createCanvas(key, width, height);
  if (!canvasTexture) {
    return;
  }
  const ctx = canvasTexture.context;

  // Card background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Dual tone lightning glow
  const p1Glow = ctx.createRadialGradient(width * 0.25, height * 0.45, 10, width * 0.25, height * 0.45, 180);
  p1Glow.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
  p1Glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = p1Glow;
  ctx.fillRect(0, 0, width, height);

  const p2Glow = ctx.createRadialGradient(width * 0.75, height * 0.45, 10, width * 0.75, height * 0.45, 180);
  p2Glow.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
  p2Glow.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = p2Glow;
  ctx.fillRect(0, 0, width, height);

  // Cyber Grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Center VS clash icon (lightning slash)
  ctx.save();
  ctx.translate(width / 2, height / 2 - 20);

  // Left P1 badge
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(-70, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1P', -70, 0);

  // Right P2 badge
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(70, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.fillText('2P', 70, 0);

  // Center lightning slash
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-10, -45);
  ctx.lineTo(8, -8);
  ctx.lineTo(-6, 6);
  ctx.lineTo(10, 45);
  ctx.stroke();

  // VS text badge
  ctx.fillStyle = '#020617';
  ctx.fillRect(-22, -16, 44, 32);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.strokeRect(-22, -16, 44, 32);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('VS', 0, 0);

  ctx.restore();

  // Bottom caption
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TWO PLAYERS', width / 2, height - 60);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('LOCAL VERSUS MATCH', width / 2, height - 35);

  // Border frame
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  canvasTexture.refresh();
}

function generateModeCard1vCpu(scene: Phaser.Scene): void {
  const key = 'mode-card-1vcpu';
  if (scene.textures.exists(key)) {
    return;
  }

  const width = 480;
  const height = 360;
  const canvasTexture = scene.textures.createCanvas(key, width, height);
  if (!canvasTexture) {
    return;
  }
  const ctx = canvasTexture.context;

  // Card background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#064e3b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Cyan & Emerald AI Glow
  const aiGlow = ctx.createRadialGradient(width * 0.75, height * 0.45, 10, width * 0.75, height * 0.45, 180);
  aiGlow.addColorStop(0, 'rgba(52, 211, 153, 0.35)');
  aiGlow.addColorStop(1, 'rgba(52, 211, 153, 0)');
  ctx.fillStyle = aiGlow;
  ctx.fillRect(0, 0, width, height);

  // Cyber Grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Center icons
  ctx.save();
  ctx.translate(width / 2, height / 2 - 20);

  // Left Player badge
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(-70, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1P', -70, 0);

  // Right CPU badge
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(70, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.fillText('CPU', 70, 0);

  // Center VS badge
  ctx.fillStyle = '#020617';
  ctx.fillRect(-22, -16, 44, 32);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2;
  ctx.strokeRect(-22, -16, 44, 32);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('VS', 0, 0);

  ctx.restore();

  // Bottom caption
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SINGLE PLAYER', width / 2, height - 60);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('VERSUS CPU ARCADE', width / 2, height - 35);

  // Border frame
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  canvasTexture.refresh();
}

export function registerGeneratedAssets(scene: Phaser.Scene): void {
  generateRectangleTexture(
    scene,
    'ui-button',
    UI_BUTTON_SIZE.width,
    UI_BUTTON_SIZE.height,
    0x1e293b,
    0x7dd3fc
  );
  generateRectangleTexture(
    scene,
    'ui-button-active',
    UI_BUTTON_SIZE.width,
    UI_BUTTON_SIZE.height,
    0x334155,
    0xf8fafc
  );
  generateRectangleTexture(
    scene,
    'ui-panel',
    UI_PANEL_SIZE.width,
    UI_PANEL_SIZE.height,
    0x111827,
    0x475569
  );
  generateRectangleTexture(
    scene,
    'sample-actor',
    PLAYER_SIZE.width,
    PLAYER_SIZE.height,
    0x38bdf8,
    0xe0f2fe
  );
  generateRectangleTexture(scene, 'sample-platform', 180, 38, 0x475569, 0x94a3b8);
  generateRectangleTexture(scene, 'sample-exit', 70, 112, 0x14532d, 0x86efac);
  generateRectangleTexture(scene, 'sample-hazard', 56, 30, 0x7f1d1d, 0xfca5a5);
  generatePickupTexture(scene);
  generateBackgroundTexture(scene, 'sample-bg-sky', 0x12263a, 0x38bdf8);
  generateBackgroundTexture(scene, 'sample-bg-far', 0x0f3a3a, 0x22c55e);
  generateBackgroundTexture(scene, 'sample-bg-mid', 0x172554, 0xfacc15);
  generateStageRooftopTwilight(scene);
  generateStageRooftopSunset(scene);
  generateModeCard1v1(scene);
  generateModeCard1vCpu(scene);
}
