import type { CharacterDefinition } from './hero';
import { buildFighterCharacter, rect, type FighterActionSpec } from './fighterCharacter';

export const SAKURA_FIGHTER_CHARACTER_ID = 'sakura-fighter';

const SAKURA_FIGHTER_ACTIONS: FighterActionSpec[] = [
  {
    action: 'idle',
    label: 'Idle',
    file: 'idle.png',
    frames: 12,
    frameRate: 8,
    repeat: -1,
    defaultVisual: rect(74, 28, 108, 204)
  },
  {
    action: 'walk-forward',
    label: 'Walk Forward',
    file: 'walk-forward.png',
    frames: 8,
    frameRate: 10,
    repeat: -1,
    defaultVisual: rect(68, 28, 120, 204)
  },
  {
    action: 'walk-backward',
    label: 'Walk Backward',
    file: 'walk-backward.png',
    frames: 8,
    frameRate: 8,
    repeat: -1,
    defaultVisual: rect(70, 28, 116, 204)
  },
  {
    action: 'crouch',
    label: 'Crouch',
    file: 'crouch.png',
    frames: 5,
    frameRate: 10,
    repeat: 0,
    defaultVisual: rect(70, 96, 116, 134)
  },
  {
    action: 'jump',
    label: 'Jump',
    file: 'jump.png',
    frames: 8,
    frameRate: 10,
    repeat: 0,
    defaultVisual: rect(68, 16, 120, 206)
  },
  {
    action: 'block-high',
    label: 'Block High',
    file: 'block-high.png',
    frames: 4,
    frameRate: 10,
    repeat: 0,
    defaultVisual: rect(74, 28, 108, 204),
    guard: rect(58, 40, 140, 120)
  },
  {
    action: 'block-low',
    label: 'Block Low',
    file: 'block-low.png',
    frames: 4,
    frameRate: 10,
    repeat: 0,
    defaultVisual: rect(70, 96, 116, 134),
    guard: rect(58, 104, 140, 126)
  },
  {
    action: 'hit-high',
    label: 'Hit High',
    file: 'hit-high.png',
    frames: 6,
    frameRate: 12,
    repeat: 0,
    defaultVisual: rect(70, 28, 116, 204)
  },
  {
    action: 'light-punch',
    label: 'Light Punch',
    file: 'light-punch.png',
    frames: 6,
    frameRate: 14,
    repeat: 0,
    defaultVisual: rect(56, 28, 136, 204),
    attack: { frames: [2, 3], bounds: rect(12, 80, 88, 50) }
  },
  {
    action: 'heavy-kick',
    label: 'Heavy Kick',
    file: 'heavy-kick.png',
    frames: 10,
    frameRate: 12,
    repeat: 0,
    defaultVisual: rect(44, 20, 160, 212),
    attack: { frames: [3, 4, 5, 6], bounds: rect(8, 70, 110, 80) }
  },
  {
    action: 'special-charge',
    label: 'Special Charge',
    file: 'special-charge.png',
    frames: 5,
    frameRate: 14,
    repeat: 0,
    defaultVisual: rect(60, 84, 136, 146)
  },
  {
    action: 'special',
    label: 'Haru Ichiban',
    file: 'special.png',
    frames: 12,
    frameRate: 16,
    repeat: 0,
    defaultVisual: rect(24, 60, 208, 172),
    attackSpans: [
      { frames: [2], bounds: rect(10, 80, 160, 100) },
      { frames: [5], bounds: rect(10, 80, 160, 100) },
      { frames: [8], bounds: rect(10, 80, 160, 100) },
      { frames: [10], bounds: rect(10, 80, 160, 100) }
    ]
  },
  {
    action: 'knockdown',
    label: 'Knockdown',
    file: 'knockdown.png',
    frames: 10,
    frameRate: 10,
    repeat: 0,
    defaultVisual: rect(36, 140, 184, 90)
  }
];

export const SAKURA_FIGHTER_CHARACTER: CharacterDefinition = buildFighterCharacter({
  id: SAKURA_FIGHTER_CHARACTER_ID,
  label: 'Sakura',
  assetRoot: '/assets/sakura-fighter',
  anchorUsage: 'schoolgirl karate martial artist west-facing high-fidelity anchor',
  actions: SAKURA_FIGHTER_ACTIONS
});
