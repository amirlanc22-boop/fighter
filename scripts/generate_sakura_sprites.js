import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

const OUT_DIR = './public/assets/sakura-fighter';
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Colors for Sakura
const C = {
  skin: '#f8c890',
  skinShade: '#f09858',
  skinHighlight: '#ffe0b8',
  hair: '#702808',
  hairShade: '#481804',
  hairHighlight: '#984010',
  headband: '#f8f8f8',
  headbandShade: '#c0c8d0',
  sailorWhite: '#f4f6fa',
  sailorWhiteShade: '#c8d0dc',
  navy: '#123068',
  navyShade: '#0a1c40',
  navyLight: '#1e4c9c',
  yellowRibbon: '#f8d020',
  yellowRibbonShade: '#c89808',
  gloveRed: '#dc2020',
  gloveRedShade: '#981010',
  gloveRedLight: '#f44848',
  gloveWhite: '#ffffff',
  sockWhite: '#e8edf4',
  shoeRed: '#dc2020',
  shoeWhite: '#ffffff',
  shoeDark: '#303030',
  outline: '#1a1412',
  petalPink: '#ffb7c5',
  petalDark: '#e87890'
};

/**
 * Draw Sakura Kasugano character model with parametric skeleton
 */
function drawSakura(ctx, opts) {
  const {
    cx = 128,          // Center X
    groundY = 232,     // Ground Y
    crouch = 0,        // 0 to 1
    tilt = 0,          // Body angle in rad
    headTurn = 0,      // Head turn
    facing = -1,       // -1 is facing left/west (standard player 1 facing west/east)
    breathe = 0,       // -1 to 1 breathing offset
    leftArm = { angle: 0, elbow: 0, punch: 0 },
    rightArm = { angle: 0, elbow: 0, punch: 0 },
    leftLeg = { hip: 0, knee: 0, ankle: 0 },
    rightLeg = { hip: 0, knee: 0, ankle: 0 },
    headbandFlutter = 0,
    skirtFlutter = 0,
    specialAura = 0,
    spinAngle = 0,
    jumpY = 0,
    isKnockdown = false,
    kdFrame = 0,
    hurt = 0,
    guard = 0
  } = opts;

  ctx.save();
  ctx.translate(cx, groundY - jumpY);
  ctx.scale(facing, 1);

  if (isKnockdown) {
    drawKnockdown(ctx, kdFrame);
    ctx.restore();
    return;
  }

  // Aura for special
  if (specialAura > 0) {
    ctx.save();
    ctx.globalAlpha = 0.4 * specialAura;
    const grad = ctx.createRadialGradient(0, -90, 20, 0, -90, 110);
    grad.addColorStop(0, '#ffb7c5');
    grad.addColorStop(0.5, '#f8d020');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, -90, 110, 0, Math.PI * 2);
    ctx.fill();

    // Sakura blossoms
    for (let p = 0; p < 6; p++) {
      const px = Math.sin(specialAura * 10 + p * 1.2) * 80;
      const py = -90 + Math.cos(specialAura * 8 + p * 1.5) * 70;
      ctx.fillStyle = p % 2 === 0 ? C.petalPink : C.petalDark;
      ctx.beginPath();
      ctx.ellipse(px, py, 8, 4, p + specialAura * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const hipY = -78 + crouch * 38 + breathe * 2;
  const chestY = hipY - 38;
  const neckY = chestY - 18;
  const headY = neckY - 26;

  // Back Arm (Right arm if facing -1)
  drawArm(ctx, chestY, rightArm, true);

  // Back Leg (Right leg)
  drawLeg(ctx, hipY, rightLeg, true);

  // Torso / Skirt
  drawTorsoAndSkirt(ctx, hipY, chestY, neckY, crouch, tilt, skirtFlutter, breathe);

  // Front Leg (Left leg)
  drawLeg(ctx, hipY, leftLeg, false);

  // Head and Face
  drawHead(ctx, headY, neckY, headTurn, headbandFlutter, hurt);

  // Front Arm (Left arm)
  drawArm(ctx, chestY, leftArm, false, guard);

  ctx.restore();
}

function drawHead(ctx, headY, neckY, headTurn, flutter, hurt) {
  ctx.save();
  ctx.translate(0, headY);

  // Neck
  ctx.fillStyle = C.skinShade;
  ctx.fillRect(-6, 12, 12, 16);

  // Head base (Hair back)
  ctx.fillStyle = C.hairShade;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  // Headband tails (Back fluttering)
  ctx.save();
  ctx.fillStyle = C.headband;
  ctx.strokeStyle = C.headbandShade;
  ctx.lineWidth = 1.5;
  const tailWave1 = Math.sin(flutter) * 12;
  const tailWave2 = Math.cos(flutter * 1.2) * 15;
  ctx.beginPath();
  ctx.moveTo(-16, -6);
  ctx.bezierCurveTo(-30, -10 + tailWave1, -45, -5 + tailWave2, -60, -8 + tailWave1);
  ctx.lineTo(-58, -1);
  ctx.bezierCurveTo(-45, 1 + tailWave2, -30, -2 + tailWave1, -16, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-16, -4);
  ctx.bezierCurveTo(-28, -2 + tailWave2, -42, 6 + tailWave1, -55, 4 + tailWave2);
  ctx.lineTo(-53, 10);
  ctx.bezierCurveTo(-40, 11 + tailWave1, -28, 4 + tailWave2, -16, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Face (Skin)
  ctx.fillStyle = C.skin;
  ctx.beginPath();
  ctx.ellipse(3 + headTurn, 2, 17, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheek blush
  ctx.fillStyle = 'rgba(240, 120, 120, 0.4)';
  ctx.beginPath();
  ctx.ellipse(10 + headTurn, 6, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Headband band around forehead
  ctx.fillStyle = C.headband;
  ctx.fillRect(-16, -12, 34, 7);
  ctx.fillStyle = C.headbandShade;
  ctx.fillRect(-16, -5, 34, 1.5);

  // Eyes
  if (hurt > 0) {
    // Hurt eye >_<
    ctx.strokeStyle = C.outline;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4 + headTurn, 0);
    ctx.lineTo(12 + headTurn, 3);
    ctx.lineTo(4 + headTurn, 6);
    ctx.stroke();
  } else {
    // Large anime eye
    ctx.fillStyle = C.outline;
    ctx.beginPath();
    ctx.ellipse(9 + headTurn, 2, 4.5, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Iris highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8 + headTurn, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    // Eyelash line
    ctx.strokeStyle = C.outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(9 + headTurn, 0, 6, -Math.PI * 0.8, -Math.PI * 0.1);
    ctx.stroke();
  }

  // Mouth
  ctx.strokeStyle = C.hairShade;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (hurt > 0) {
    ctx.arc(8 + headTurn, 11, 4, 0, Math.PI); // Open hurt mouth
  } else {
    ctx.arc(7 + headTurn, 9, 3, 0.2, Math.PI * 0.8); // Confident smirk
  }
  ctx.stroke();

  // Spiky Hair Front (Bangs)
  ctx.fillStyle = C.hair;
  ctx.beginPath();
  ctx.moveTo(-17, -10);
  ctx.lineTo(-8, -24);
  ctx.lineTo(2, -26);
  ctx.lineTo(14, -22);
  ctx.lineTo(21, -10);
  ctx.lineTo(18, 0);
  ctx.lineTo(14, -4);
  ctx.lineTo(10, 4); // Bang 1
  ctx.lineTo(6, -6);
  ctx.lineTo(1, 6);  // Bang 2
  ctx.lineTo(-4, -6);
  ctx.lineTo(-9, 4);  // Bang 3
  ctx.lineTo(-14, -4);
  ctx.closePath();
  ctx.fill();

  // Hair highlights
  ctx.fillStyle = C.hairHighlight;
  ctx.beginPath();
  ctx.arc(4, -18, 8, -Math.PI * 0.7, -Math.PI * 0.2);
  ctx.lineTo(0, -20);
  ctx.fill();

  ctx.restore();
}

function drawTorsoAndSkirt(ctx, hipY, chestY, neckY, crouch, tilt, flutter, breathe) {
  ctx.save();

  // White sailor top
  ctx.fillStyle = C.sailorWhite;
  ctx.beginPath();
  ctx.moveTo(-14, chestY - 10);
  ctx.lineTo(14, chestY - 10);
  ctx.lineTo(12 + breathe, hipY - 8);
  ctx.lineTo(-12, hipY - 8);
  ctx.closePath();
  ctx.fill();

  // Shadow on white shirt
  ctx.fillStyle = C.sailorWhiteShade;
  ctx.beginPath();
  ctx.moveTo(-14, chestY + 5);
  ctx.lineTo(10, chestY + 5);
  ctx.lineTo(12, hipY - 8);
  ctx.lineTo(-12, hipY - 8);
  ctx.closePath();
  ctx.fill();

  // Navy sailor collar
  ctx.fillStyle = C.navy;
  ctx.beginPath();
  ctx.moveTo(-16, chestY - 12);
  ctx.lineTo(16, chestY - 12);
  ctx.lineTo(10, chestY + 6);
  ctx.lineTo(0, chestY + 12);
  ctx.lineTo(-10, chestY + 6);
  ctx.closePath();
  ctx.fill();

  // White stripes on collar
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-13, chestY - 10);
  ctx.lineTo(0, chestY + 9);
  ctx.lineTo(13, chestY - 10);
  ctx.stroke();

  // Yellow tie / ascot / ribbon
  ctx.fillStyle = C.yellowRibbon;
  ctx.beginPath();
  ctx.moveTo(-4, chestY - 2);
  ctx.lineTo(4, chestY - 2);
  ctx.lineTo(6, chestY + 16);
  ctx.lineTo(0, chestY + 20);
  ctx.lineTo(-6, chestY + 16);
  ctx.closePath();
  ctx.fill();

  // Knot of ribbon
  ctx.fillStyle = C.yellowRibbonShade;
  ctx.fillRect(-3, chestY, 6, 5);

  // Red bloomers underneath skirt
  ctx.fillStyle = C.gloveRedShade;
  ctx.fillRect(-10, hipY - 4, 20, 10);

  // Navy Pleated Skirt
  const skirtWave = Math.sin(flutter) * 6;
  ctx.fillStyle = C.navy;
  ctx.beginPath();
  ctx.moveTo(-14, hipY - 6);
  ctx.lineTo(14, hipY - 6);
  ctx.lineTo(22 + skirtWave, hipY + 20);
  ctx.lineTo(-18 - skirtWave, hipY + 20);
  ctx.closePath();
  ctx.fill();

  // Skirt pleat lines
  ctx.strokeStyle = C.navyShade;
  ctx.lineWidth = 1.5;
  for (let p = -14; p <= 14; p += 7) {
    ctx.beginPath();
    ctx.moveTo(p, hipY - 4);
    ctx.lineTo(p * 1.4 + skirtWave * 0.5, hipY + 20);
    ctx.stroke();
  }

  // White belt / waistband
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, hipY - 8, 26, 3);

  ctx.restore();
}

function drawArm(ctx, shoulderY, arm, isBack, guard = 0) {
  const { angle = 0, elbow = 0, punch = 0 } = arm;
  ctx.save();
  ctx.translate(isBack ? -8 : 6, shoulderY);
  ctx.rotate(angle);

  // Shoulder sleeve (White puffed sleeve with navy cuff)
  ctx.fillStyle = C.sailorWhite;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.navy;
  ctx.fillRect(-8, 3, 16, 3);

  // Upper arm (Skin)
  ctx.fillStyle = isBack ? C.skinShade : C.skin;
  ctx.fillRect(-4, 4, 8, 22);

  // Forearm & Hand / Glove
  ctx.save();
  ctx.translate(0, 24 + punch);
  ctx.rotate(elbow);

  // Forearm (Skin & white wrist wrap)
  ctx.fillStyle = isBack ? C.skinShade : C.skin;
  ctx.fillRect(-4, 0, 8, 14);

  // White wrist wrap
  ctx.fillStyle = C.gloveWhite;
  ctx.fillRect(-5, 12, 10, 5);

  // Red Karate / Sparring Glove
  ctx.fillStyle = isBack ? C.gloveRedShade : C.gloveRed;
  ctx.beginPath();
  ctx.roundRect(-7, 16, 15, 16, [4, 4, 6, 6]);
  ctx.fill();

  // Glove thumb and padding detail
  ctx.fillStyle = isBack ? C.gloveRedShade : C.gloveRedLight;
  ctx.fillRect(-5, 18, 11, 6);
  ctx.fillStyle = C.outline;
  ctx.fillRect(-6, 26, 13, 2);

  ctx.restore();
  ctx.restore();
}

function drawLeg(ctx, hipY, leg, isBack) {
  const { hip = 0, knee = 0, ankle = 0 } = leg;
  ctx.save();
  ctx.translate(isBack ? -8 : 6, hipY + 12);
  ctx.rotate(hip);

  // Thigh (Skin)
  ctx.fillStyle = isBack ? C.skinShade : C.skin;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 34, 4);
  ctx.fill();

  // Lower Leg (Shin / Knee)
  ctx.save();
  ctx.translate(0, 32);
  ctx.rotate(knee);

  // Shin (Skin)
  ctx.fillStyle = isBack ? C.skinShade : C.skin;
  ctx.fillRect(-5, 0, 10, 36);

  // White Crew Sock (folded)
  ctx.fillStyle = C.sockWhite;
  ctx.fillRect(-6, 22, 12, 16);
  ctx.fillStyle = C.sailorWhiteShade;
  ctx.fillRect(-6, 22, 12, 3); // Sock ribbing

  // Red Sneaker (Converse / High-top style)
  ctx.save();
  ctx.translate(0, 38);
  ctx.rotate(ankle);

  // Shoe main body
  ctx.fillStyle = isBack ? C.shoeRed : C.gloveRed;
  ctx.beginPath();
  ctx.moveTo(-7, -4);
  ctx.lineTo(8, -4);
  ctx.lineTo(16, 12);
  ctx.lineTo(-8, 12);
  ctx.closePath();
  ctx.fill();

  // White toe cap
  ctx.fillStyle = C.shoeWhite;
  ctx.beginPath();
  ctx.arc(10, 8, 6, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.fill();

  // White sole
  ctx.fillStyle = C.shoeWhite;
  ctx.fillRect(-9, 10, 27, 4);
  ctx.fillStyle = C.shoeDark;
  ctx.fillRect(-9, 13, 27, 1);

  // White laces
  ctx.fillStyle = C.shoeWhite;
  ctx.fillRect(0, -2, 5, 2);
  ctx.fillRect(2, 2, 5, 2);
  ctx.fillRect(4, 6, 5, 2);

  ctx.restore();
  ctx.restore();
  ctx.restore();
}

function drawKnockdown(ctx, frame) {
  // 10 frames of knockdown: airborne arc, hitting floor, bouncing, lying down, recovery push-up
  const progress = frame / 9;
  const ky = frame < 4 ? -80 + frame * 18 : (frame === 4 ? -10 : -5);
  const rot = frame < 4 ? -Math.PI * 0.4 - frame * 0.2 : (frame < 7 ? -Math.PI * 0.5 : -Math.PI * 0.2 * (9 - frame) / 2);

  ctx.save();
  ctx.translate(0, ky);
  ctx.rotate(rot);

  // Simplified body for knockdown
  ctx.fillStyle = C.sailorWhite;
  ctx.fillRect(-12, -20, 24, 40);
  ctx.fillStyle = C.navy;
  ctx.fillRect(-14, 10, 28, 20);

  // Head
  ctx.fillStyle = C.skin;
  ctx.beginPath();
  ctx.arc(0, -32, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.hair;
  ctx.beginPath();
  ctx.arc(0, -34, 18, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.headband;
  ctx.fillRect(-14, -36, 28, 6);

  // Legs & Arms sprawled
  ctx.fillStyle = C.skin;
  ctx.fillRect(-8, 28, 7, 36);
  ctx.fillRect(1, 28, 7, 36);
  ctx.fillStyle = C.gloveRed;
  ctx.fillRect(-22, -10, 12, 12);
  ctx.fillRect(10, -10, 12, 12);

  ctx.restore();
}

/**
 * Generate a full spritesheet grid (1280 wide, 256 tall per row, 5 cols)
 */
async function buildSpritesheet(filename, frameCount, frameGenerator) {
  const cols = 5;
  const rows = Math.ceil(frameCount / cols);
  const width = cols * 256;
  const height = rows * 256;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;

  for (let i = 0; i < frameCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const fx = col * 256;
    const fy = row * 256;

    ctx.save();
    ctx.beginPath();
    ctx.rect(fx, fy, 256, 256);
    ctx.clip();

    ctx.translate(fx, fy);
    frameGenerator(ctx, i, frameCount);
    ctx.restore();
  }

  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUT_DIR, filename), buf);
  console.log(`Created ${filename} (${width}x${height}, ${frameCount} frames)`);
}

async function main() {
  console.log('Generating high fidelity Sakura Fighter sprites...');

  // 1. Idle (12 frames, 1280x768)
  await buildSpritesheet('idle.png', 12, (ctx, f, total) => {
    const t = (f / total) * Math.PI * 2;
    const bounce = Math.sin(t);
    const breathe = Math.sin(t * 2);
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      breathe: breathe * 2,
      crouch: Math.max(0, -bounce * 0.08),
      headTurn: Math.sin(t) * 1.5,
      headbandFlutter: t,
      skirtFlutter: t,
      leftArm: {
        angle: -0.3 + Math.sin(t) * 0.08,
        elbow: -1.6 + Math.cos(t) * 0.1
      },
      rightArm: {
        angle: -0.2 + Math.sin(t + 1) * 0.08,
        elbow: -1.4 + Math.cos(t + 1) * 0.1
      },
      leftLeg: {
        hip: 0.15 + bounce * 0.04,
        knee: -0.3 - bounce * 0.06,
        ankle: 0.15
      },
      rightLeg: {
        hip: -0.25 - bounce * 0.04,
        knee: 0.35 + bounce * 0.06,
        ankle: -0.1
      }
    });
  });

  // 2. Walk Forward (8 frames, 1280x512)
  await buildSpritesheet('walk-forward.png', 8, (ctx, f, total) => {
    const t = (f / total) * Math.PI * 2;
    const stride = Math.sin(t);
    const lift = Math.abs(Math.cos(t));
    drawSakura(ctx, {
      cx: 128,
      groundY: 232 - lift * 5,
      tilt: -0.1,
      headbandFlutter: t * 2,
      skirtFlutter: t * 2,
      leftArm: {
        angle: -stride * 0.6 - 0.2,
        elbow: -1.2 + Math.abs(stride) * 0.4
      },
      rightArm: {
        angle: stride * 0.6 - 0.2,
        elbow: -1.2 + Math.abs(stride) * 0.4
      },
      leftLeg: {
        hip: stride * 0.55,
        knee: stride < 0 ? -0.5 * Math.abs(stride) : 0.2,
        ankle: -stride * 0.2
      },
      rightLeg: {
        hip: -stride * 0.55,
        knee: stride > 0 ? -0.5 * Math.abs(stride) : 0.2,
        ankle: stride * 0.2
      }
    });
  });

  // 3. Walk Backward (8 frames, 1280x512)
  await buildSpritesheet('walk-backward.png', 8, (ctx, f, total) => {
    const t = (f / total) * Math.PI * 2;
    const stride = Math.sin(t);
    const lift = Math.abs(Math.cos(t));
    drawSakura(ctx, {
      cx: 128,
      groundY: 232 - lift * 4,
      tilt: 0.08,
      headbandFlutter: t * 1.5,
      skirtFlutter: t * 1.5,
      leftArm: {
        angle: -0.3 + stride * 0.2,
        elbow: -1.8
      },
      rightArm: {
        angle: -0.1 - stride * 0.2,
        elbow: -1.6
      },
      leftLeg: {
        hip: -stride * 0.4,
        knee: stride > 0 ? -0.4 : 0.1,
        ankle: 0.1
      },
      rightLeg: {
        hip: stride * 0.4,
        knee: stride < 0 ? -0.4 : 0.1,
        ankle: -0.1
      }
    });
  });

  // 4. Crouch (5 frames, 1280x256)
  await buildSpritesheet('crouch.png', 5, (ctx, f, total) => {
    const depth = Math.min(1, f / 3);
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      crouch: depth,
      headbandFlutter: f * 0.5,
      leftArm: {
        angle: -0.4 + depth * 0.3,
        elbow: -1.8 - depth * 0.4
      },
      rightArm: {
        angle: -0.2 + depth * 0.3,
        elbow: -1.6 - depth * 0.4
      },
      leftLeg: {
        hip: 0.4 * depth,
        knee: -1.2 * depth,
        ankle: 0.8 * depth
      },
      rightLeg: {
        hip: -0.3 * depth,
        knee: -1.1 * depth,
        ankle: 0.7 * depth
      }
    });
  });

  // 5. Jump (8 frames, 1280x512)
  await buildSpritesheet('jump.png', 8, (ctx, f, total) => {
    // 0: compress, 1-3: rising, 4: apex, 5-6: falling, 7: landing
    const jumps = [
      { y: 0, crouch: 0.6, leg: 0.5 },
      { y: 35, crouch: 0, leg: -0.2 },
      { y: 65, crouch: 0, leg: -0.5 },
      { y: 85, crouch: 0, leg: -0.6 },
      { y: 92, crouch: 0, leg: -0.5 },
      { y: 70, crouch: 0, leg: -0.3 },
      { y: 40, crouch: 0, leg: 0 },
      { y: 0, crouch: 0.5, leg: 0.4 }
    ];
    const j = jumps[f];
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      jumpY: j.y,
      crouch: j.crouch,
      headbandFlutter: f * 1.5,
      skirtFlutter: f * 1.5,
      leftArm: {
        angle: -0.6 - j.y * 0.01,
        elbow: -1.4
      },
      rightArm: {
        angle: -0.4 - j.y * 0.01,
        elbow: -1.2
      },
      leftLeg: {
        hip: j.leg,
        knee: -j.leg * 1.4,
        ankle: 0.2
      },
      rightLeg: {
        hip: -j.leg * 0.6,
        knee: -j.leg * 1.2,
        ankle: -0.2
      }
    });
  });

  // 6. Block High (4 frames, 1280x256)
  await buildSpritesheet('block-high.png', 4, (ctx, f) => {
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      guard: 1,
      leftArm: {
        angle: -0.9,
        elbow: -2.2
      },
      rightArm: {
        angle: -0.7,
        elbow: -2.0
      },
      leftLeg: { hip: 0.2, knee: -0.3, ankle: 0.1 },
      rightLeg: { hip: -0.3, knee: 0.4, ankle: -0.1 }
    });
  });

  // 7. Block Low (4 frames, 1280x256)
  await buildSpritesheet('block-low.png', 4, (ctx, f) => {
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      crouch: 0.8,
      guard: 1,
      leftArm: {
        angle: 0.2,
        elbow: -2.4
      },
      rightArm: {
        angle: 0.4,
        elbow: -2.2
      },
      leftLeg: { hip: 0.4, knee: -1.2, ankle: 0.8 },
      rightLeg: { hip: -0.3, knee: -1.1, ankle: 0.7 }
    });
  });

  // 8. Hit High (6 frames, 1280x512)
  await buildSpritesheet('hit-high.png', 6, (ctx, f, total) => {
    const hits = [0.3, 0.9, 1.0, 0.7, 0.4, 0.1];
    const h = hits[f];
    drawSakura(ctx, {
      cx: 128 - h * 16,
      groundY: 232,
      tilt: h * 0.35,
      hurt: h,
      headTurn: -h * 4,
      headbandFlutter: f * 2,
      leftArm: {
        angle: 0.4 * h - 0.3,
        elbow: -1.2 - h * 0.8
      },
      rightArm: {
        angle: 0.5 * h - 0.2,
        elbow: -1.0 - h * 0.8
      },
      leftLeg: { hip: 0.1 - h * 0.2, knee: -0.2, ankle: 0.1 },
      rightLeg: { hip: -0.2 - h * 0.3, knee: 0.3, ankle: -0.1 }
    });
  });

  // 9. Light Punch (6 frames, 1280x512)
  await buildSpritesheet('light-punch.png', 6, (ctx, f) => {
    // 0: windup, 1: strike start, 2-3: active hit, 4: retracting, 5: recover
    const ext = [0.1, 0.6, 1.0, 0.9, 0.4, 0.05][f];
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      tilt: -ext * 0.15,
      leftArm: {
        angle: -1.55 * ext - 0.3 * (1 - ext),
        elbow: -0.1 * ext - 1.6 * (1 - ext),
        punch: ext * 24
      },
      rightArm: {
        angle: -0.2,
        elbow: -1.8
      },
      leftLeg: { hip: 0.2 + ext * 0.15, knee: -0.3 - ext * 0.1, ankle: 0.1 },
      rightLeg: { hip: -0.3 - ext * 0.2, knee: 0.4, ankle: -0.1 }
    });
  });

  // 10. Special Charge (5 frames, 1280x256)
  await buildSpritesheet('special-charge.png', 5, (ctx, f, total) => {
    const charge = f / (total - 1);
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      crouch: 0.6 + charge * 0.3,
      specialAura: charge,
      headbandFlutter: f * 2,
      skirtFlutter: f * 2,
      leftArm: {
        angle: -0.8 + charge * 0.4,
        elbow: -2.2
      },
      rightArm: {
        angle: -0.4 + charge * 0.6,
        elbow: -2.0
      },
      leftLeg: { hip: 0.4, knee: -1.2, ankle: 0.8 },
      rightLeg: { hip: -0.3, knee: -1.1, ankle: 0.7 }
    });
  });

  // 11. Special (Haru Ichiban hurricane kicks - 12 frames, 1280x768)
  await buildSpritesheet('special.png', 12, (ctx, f, total) => {
    const t = (f / total) * Math.PI * 4; // Two full spins
    const spinLeg = Math.sin(t);
    const spinArm = Math.cos(t);
    const riseY = f >= 2 && f <= 9 ? Math.sin(((f - 2) / 7) * Math.PI) * 45 : 0;
    const aura = 1.0;

    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      jumpY: riseY,
      specialAura: aura,
      headbandFlutter: f * 3,
      skirtFlutter: f * 3,
      tilt: Math.sin(t) * 0.2,
      leftArm: {
        angle: spinArm * 1.2 - 0.4,
        elbow: -0.8
      },
      rightArm: {
        angle: -spinArm * 1.2 - 0.4,
        elbow: -0.8
      },
      leftLeg: {
        hip: spinLeg * 1.3,
        knee: -0.2,
        ankle: 0.2
      },
      rightLeg: {
        hip: -spinLeg * 1.3,
        knee: -0.2,
        ankle: -0.2
      }
    });
  });

  // 12. Knockdown (10 frames, 1280x512)
  await buildSpritesheet('knockdown.png', 10, (ctx, f) => {
    drawSakura(ctx, {
      cx: 128,
      groundY: 232,
      isKnockdown: true,
      kdFrame: f
    });
  });

  console.log('All Sakura Fighter spritesheets built successfully!');
}

main().catch(console.error);
