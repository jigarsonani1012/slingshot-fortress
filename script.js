(function () {
'use strict';
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let gameplayRng = Math.random;
function gameRandom() { return gameplayRng(); }

/* ---------------- icons ---------------- */
const STAR = '<svg viewBox="0 0 48 48"><path class="f" d="M24 3.5l6.1 12.9 14.1 1.8-10.4 9.8 2.7 14L24 35.1 11.5 42l2.7-14L3.8 18.2l14.1-1.8z" stroke="#4a2a10" stroke-width="3.4" stroke-linejoin="round"/></svg>';
const I = {
  pause: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" rx="1.6" fill="#fff" stroke="#8a4f00" stroke-width="1.4"/><rect x="14" y="4" width="5" height="16" rx="1.6" fill="#fff" stroke="#8a4f00" stroke-width="1.4"/></svg>',
  restart: '<svg viewBox="0 0 24 24"><path d="M12 3.5A8.5 8.5 0 1 0 19.8 8l2.7-.8L16.5 2 13 8.2l2.6 1.2A4.8 4.8 0 1 1 12 7.2Z" fill="#fff" stroke="#103e72" stroke-width="1.4" stroke-linejoin="round"/><path d="M5.5 12A6.5 6.5 0 0 1 9.5 6.2" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5l13 7.5-13 7.5z" fill="#fff" stroke="#1f6a12" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M5 4.5l10 7.5-10 7.5z" fill="#fff" stroke="#1f6a12" stroke-width="1.4" stroke-linejoin="round"/><rect x="16" y="4.5" width="3.4" height="15" rx="1" fill="#fff" stroke="#1f6a12" stroke-width="1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><g fill="#fff" stroke="#8a4f00" stroke-width="1.2"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></g></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" stroke="#8a4f00" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" stroke="#8a4f00" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
  musicOn: '<svg viewBox="0 0 24 24"><path d="M9 17V5l11-2v12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3" fill="#fff" stroke="#8a4f00" stroke-width="1.2"/><circle cx="17.5" cy="15.5" r="3" fill="#fff" stroke="#8a4f00" stroke-width="1.2"/></svg>',
  musicOff: '<svg viewBox="0 0 24 24"><path d="M9 17V5l11-2v12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" opacity=".55"/><circle cx="6.5" cy="17.5" r="3" fill="#fff" opacity=".55"/><circle cx="17.5" cy="15.5" r="3" fill="#fff" opacity=".55"/><path d="M3 3l18 18" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
  lock: '<svg class="lk" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.4" fill="#fff" stroke="#5a544c" stroke-width="1.4"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="12" cy="15.4" r="1.7" fill="#5a544c"/></svg>',
  hand: '<svg viewBox="0 0 64 80"><path d="M22 9c0-5.2 8.2-5.2 8.2 0v25.5l1.4-.4c.4-4.6 7.8-4.6 8.2.2l.1 1.6c.9-4.1 7.6-3.9 8 .6l.1 2.1c1.2-3.5 7.4-3 7.4 1.4v15.8C55.4 69 48.2 76 38 76h-3.4c-7.4 0-11.4-3.2-15.6-9.3L7.6 50.2c-2.8-4.2 2.4-8.6 6.2-5l8.2 7.8z" fill="#fff" stroke="#2a1d10" stroke-width="3.2" stroke-linejoin="round"/></svg>',
  inspect: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15 15l6 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="10.5" cy="10.5" r="2.2" fill="#fff"/></svg>'
};
$('bPause').innerHTML = I.pause; $('bRestart').innerHTML = I.restart; $('bInspect').innerHTML = I.inspect;
$('bPLevels').innerHTML = I.menu; $('bPRestart').innerHTML = I.restart; $('bResume').innerHTML = I.play;
$('bWLevels').innerHTML = I.menu; $('bWReplay').innerHTML = I.restart; $('bWNext').innerHTML = I.next;
$('bFLevels').innerHTML = I.menu; $('bFRetry').innerHTML = I.restart;
$('bPvMenu').innerHTML = I.menu; $('bPvAgain').innerHTML = I.restart;
$('bLvBack').innerHTML = I.back; $('hand').innerHTML = I.hand;
['hs1', 'hs2', 'hs3'].forEach((id) => { $(id).innerHTML = STAR; });
[...$('winStars').children].forEach((s) => { s.innerHTML = STAR; });

/* ---------------- save ---------------- */
const SAVE_KEY = 'slingshot-fortress';
const save = { unlocked: 1, endlessUnlocked: 1, stars: {}, best: {}, coins: 0, sling: 'classic', owned: ['classic'], sound: true, music: true, seen: {}, seenTap: {}, fails: {}, chapterRewards: {}, daily: { date: '', best: 0, stars: 0, claimed: false, clears: 0, lastClear: '' } };
try {
  const stored = localStorage.getItem(SAVE_KEY) || localStorage.getItem('slingshot-fortress-save');
  if (stored) Object.assign(save, JSON.parse(stored));
} catch (e) { /* storage unavailable */ }
save.endlessUnlocked = Math.max(1, save.endlessUnlocked || 1);
save.seenTap = save.seenTap || {}; save.fails = save.fails || {}; if (typeof save.music !== 'boolean') save.music = true;
save.chapterRewards = save.chapterRewards || {};
save.daily = Object.assign({ date: '', best: 0, stars: 0, claimed: false, clears: 0, lastClear: '' }, save.daily || {});
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* storage unavailable */ } }

/* ---------------- audio (procedural) ---------------- */
const audio = {
  ctx: null, out: null, nb: null, last: {},
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try {
      this.ctx = new AC(); this.out = this.ctx.createGain(); this.out.gain.value = 0.6; this.out.connect(this.ctx.destination);
      const n = Math.floor(this.ctx.sampleRate * 1.2); this.nb = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = this.nb.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { this.ctx = null; }
  },
  ok(key, gap) { if (!this.ctx || !save.sound) return false; if (key) { const t = performance.now(); if (this.last[key] && t - this.last[key] < (gap || 60)) return false; this.last[key] = t; } return true; },
  tone(f, dur, o) {
    o = o || {}; const c = this.ctx, t = c.currentTime + (o.when || 0);
    const os = c.createOscillator(), g = c.createGain(); os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t);
    if (o.to) os.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    os.connect(g); g.connect(this.out); os.start(t); os.stop(t + dur + 0.05);
  },
  noise(dur, o) {
    o = o || {}; const c = this.ctx, t = c.currentTime + (o.when || 0);
    const s = c.createBufferSource(); s.buffer = this.nb; s.playbackRate.value = o.rate || 1;
    const f = c.createBiquadFilter(); f.type = o.type || 'lowpass'; f.frequency.setValueAtTime(o.freq || 1200, t); if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur); f.Q.value = o.q || 0.8;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.a || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  },
  stretch(p) { if (!this.ok('stretch', 90)) return; this.noise(0.09, { type: 'bandpass', freq: 500 + p * 1400, q: 6, vol: 0.12 }); this.tone(160 + p * 260, 0.08, { type: 'sawtooth', vol: 0.03 }); },
  launch() { if (!this.ok()) return; this.noise(0.35, { type: 'bandpass', freq: 600, to: 2600, q: 1.2, vol: 0.22 }); this.tone(120, 0.12, { type: 'triangle', vol: 0.25, to: 60 }); },
  hit(mat, E) {
    if (!this.ok('hit' + mat, 55)) return; const v = clamp(0.05 + E * 0.012, 0.05, 0.32);
    if (mat === 'stone') { this.tone(420 + Math.random() * 120, 0.09, { type: 'triangle', vol: v }); this.noise(0.07, { type: 'highpass', freq: 1800, vol: v * 0.7 }); }
    else if (mat === 'ice') { this.tone(1600 + Math.random() * 500, 0.14, { type: 'sine', vol: v * 0.7 }); this.noise(0.08, { type: 'highpass', freq: 3500, vol: v * 0.6 }); }
    else if (mat === 'enemy') { this.tone(520, 0.12, { type: 'sine', vol: v, to: 780 }); }
    else { this.tone(170 + Math.random() * 50, 0.12, { type: 'triangle', vol: v * 1.3, to: 110 }); this.noise(0.08, { freq: 700, vol: v * 0.8 }); }
  },
  brk(mat) {
    if (!this.ok('brk' + mat, 45)) return;
    if (mat === 'ice') { this.noise(0.4, { type: 'highpass', freq: 2500, vol: 0.28 }); for (let k = 0; k < 4; k++) this.tone(1800 + Math.random() * 1800, 0.18, { vol: 0.06, when: k * 0.03 }); }
    else if (mat === 'stone') { this.noise(0.35, { freq: 900, to: 300, vol: 0.34 }); this.tone(140, 0.2, { type: 'triangle', vol: 0.2, to: 70 }); }
    else { this.noise(0.3, { type: 'bandpass', freq: 900, to: 400, q: 1.5, vol: 0.32 }); this.tone(210, 0.15, { type: 'square', vol: 0.05, to: 90 }); }
  },
  boom() { if (!this.ok('boom', 90)) return; this.noise(1.1, { freq: 1400, to: 90, vol: 0.6, a: 0.005 }); this.tone(70, 0.6, { type: 'sine', vol: 0.5, to: 30 }); },
  pop() { if (!this.ok('pop', 40)) return; this.tone(380, 0.16, { type: 'square', vol: 0.08, to: 1300 }); this.noise(0.12, { type: 'bandpass', freq: 2000, vol: 0.2, when: 0.1 }); this.tone(900, 0.1, { vol: 0.15, when: 0.12, to: 300 }); },
  balloon() { if (!this.ok('bal', 40)) return; this.noise(0.12, { type: 'highpass', freq: 1500, vol: 0.4 }); this.tone(300, 0.08, { vol: 0.12, to: 120 }); },
  chime() { if (!this.ok('chime', 60)) return; [1318, 1760, 2093].forEach((f, k) => this.tone(f, 0.22, { type: 'triangle', vol: 0.09, when: k * 0.06 })); },
  ability() { if (!this.ok()) return; this.tone(600, 0.15, { type: 'square', vol: 0.06, to: 1400 }); this.noise(0.2, { type: 'bandpass', freq: 3000, vol: 0.12 }); },
  missile() { if (!this.ok()) return; this.noise(0.9, { type: 'bandpass', freq: 800, to: 2400, q: 0.8, vol: 0.3 }); },
  star(k) { if (!this.ok()) return; this.tone([880, 1175, 1568][k], 0.3, { type: 'triangle', vol: 0.16 }); this.tone([1760, 2349, 3136][k], 0.25, { vol: 0.05, when: 0.02 }); },
  bonus() { if (!this.ok('bonus', 50)) return; this.tone(988, 0.12, { type: 'square', vol: 0.06 }); this.tone(1319, 0.14, { type: 'square', vol: 0.06, when: 0.07 }); },
  win() { if (!this.ok()) return; [523, 659, 784, 1047].forEach((f, k) => this.tone(f, 0.28, { type: 'square', vol: 0.06, when: k * 0.11 })); [1047, 1319, 1568].forEach((f) => this.tone(f, 0.8, { type: 'triangle', vol: 0.1, when: 0.46 })); },
  fail() { if (!this.ok()) return; [392, 349, 311, 262].forEach((f, k) => this.tone(f, 0.32, { type: 'triangle', vol: 0.16, when: k * 0.17 })); },
  click() { if (!this.ok()) return; this.tone(700, 0.05, { type: 'square', vol: 0.05 }); },
  /* light procedural background music (its own on/off switch) */
  mg: null, mt: 0, ms: 0, key: 0,
  startMusic() {
    if (!this.ctx || this.mg) return;
    this.mg = this.ctx.createGain(); this.mg.gain.value = save.music ? 1 : 0.0001; this.mg.connect(this.out);
    this.mt = this.ctx.currentTime + 0.15; this.ms = 0;
  },
  setMusic(on) { if (this.mg) this.mg.gain.setTargetAtTime(on ? 1 : 0.0001, this.ctx.currentTime, 0.25); },
  mnote(f, t, dur, type, vol) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.mg); o.start(t); o.stop(t + dur + 0.05);
  },
  tickMusic() {
    if (!this.ctx || !this.mg) return;
    const now = this.ctx.currentTime;
    if (!save.music || this.ctx.state !== 'running') { this.mt = now + 0.05; return; }
    const e8 = 60 / 100 / 2;
    if (this.mt < now) this.mt = now + 0.05;
    while (this.mt < now + 0.3) { this.mstep(this.ms++, this.mt); this.mt += e8; }
  },
  mstep(s, t) {
    const PROG = [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]];
    const bar = Math.floor(s / 8) % 4, pos = s % 8, ch = PROG[bar], root = 261.63 * Math.pow(2, this.key / 12);
    const f = (semi, oct) => root * Math.pow(2, semi / 12 + (oct || 0));
    if (pos === 0 || pos === 4) this.mnote(f(ch[0], -2), t, 0.5, 'sine', 0.09);
    if (pos === 2 || pos === 6) this.mnote(f(ch[0], -1), t, 0.12, 'triangle', 0.022);
    const ARP = [0, 1, 2, 1, 2, 0, 1, 2], alt = Math.floor(s / 32) % 2;
    if (!(alt && (pos === 3 || pos === 7))) this.mnote(f(ch[ARP[pos]], alt && pos === 5 ? 1 : 0), t, 0.22, 'triangle', 0.032);
    if (s % 16 === 0) this.mnote(f(ch[2], 1), t + 0.01, 0.7, 'sine', 0.016);
  },
  load() { if (!this.ok('load', 80)) return; this.tone(300, 0.08, { type: 'triangle', vol: 0.12, to: 520 }); }
};

/* ---------------- boot ---------------- */
function setLoad(p, m) { $('ldFill').style.width = Math.round(p * 100) + '%'; if (m !== undefined) $('ldMsg').textContent = m; }
function boot() {
  setLoad(0.4);
  if (window.planck) { start(); return; }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/planck@1.0.0/dist/planck.min.js';
  s.onload = () => (window.planck ? start() : setLoad(0.4, 'Could not load the physics engine. Please reload.'));
  s.onerror = () => setLoad(0.4, 'Could not load the physics engine. Check your connection and reload.');
  document.head.appendChild(s);
}

function start() {
const pl = window.planck, Vec2 = pl.Vec2;
setLoad(0.7);

/* =====================================================================
   CONSTANTS & DATA
   ===================================================================== */
const STEP = 1 / 60, MAXPULL = 1.75, LAUNCH_K = 12.8, REST_Y = 2.3, MOUND_H = 0.5;
const MAX_PHYSICS_STEPS = 8;
const MAT = {
  wood:  { density: 0.7, friction: 0.75, rest: 0.05, hp: 55,  resist: 1.0, pts: 300, chip: ['#dca062', '#a8692f', '#7a4a22'] },
  stone: { density: 2.2, friction: 0.85, rest: 0.02, hp: 130, resist: 0.4, pts: 400, chip: ['#b4bcc5', '#8a939c', '#5f6770'] },
  ice:   { density: 0.85, friction: 0.22, rest: 0.1, hp: 30,  resist: 1.5, pts: 300, chip: ['#eefaff', '#b6e4fb', '#7cc2ea'] }
};
const PROJ = {
  rock:     { name: 'STONE', r: 0.3, density: 6, rest: 0.25, vs: { wood: 1, stone: 1, ice: 1 }, desc: 'A trusty stone. Aim for weak spots!' },
  bomb:     { name: 'BOMB', r: 0.36, density: 5, rest: 0.2, vs: { wood: 0.8, stone: 0.8, ice: 1 }, desc: 'Tap while flying to EXPLODE!', hint: 'TAP TO EXPLODE!' },
  shuriken: { name: 'ICE SHURIKEN', r: 0.25, density: 5.5, rest: 0.1, vs: { wood: 1.6, stone: 0.45, ice: 2.2 }, desc: 'Tap while flying to SPLIT into 3! Slices wood and ice.', hint: 'TAP TO SPLIT!' },
  missile:  { name: 'MISSILE', r: 0.27, density: 6, rest: 0.1, vs: { wood: 1.3, stone: 1.3, ice: 1.3 }, desc: 'Tap while flying to BOOST straight ahead. Reach far targets!', hint: 'TAP TO BOOST!' },
  mini:     { name: 'SHARD', r: 0.2, density: 5, rest: 0.1, vs: { wood: 1.6, stone: 0.45, ice: 2.2 } }
};
const SLINGS = [
  { id: 'classic', name: 'CLASSIC', price: 0, desc: 'Reliable all-rounder.', bonus: {}, wood: '#8a5328', dark: '#4e2c12', band: '#6b1f1a' },
  { id: 'oak', name: 'OAK', price: 150, desc: '+60% damage to WOOD.', bonus: { wood: 1.6 }, wood: '#c99552', dark: '#6e4a1c', band: '#2e6b1a' },
  { id: 'frost', name: 'FROST', price: 250, desc: '+60% damage to ICE.', bonus: { ice: 1.6 }, wood: '#8fd4f2', dark: '#3a7fa8', band: '#1d5d8a' },
  { id: 'granite', name: 'GRANITE', price: 300, desc: '+60% damage to STONE.', bonus: { stone: 1.6 }, wood: '#9aa2ab', dark: '#4f565e', band: '#3a3a3a' },
  { id: 'royal', name: 'ROYAL', price: 800, desc: '+30% damage to EVERYTHING.', bonus: { wood: 1.3, stone: 1.3, ice: 1.3 }, wood: '#f2c230', dark: '#9a6a00', band: '#b3122a' }
];
const THEMES = [
  { name: 'FOREST', sky: ['#5cbcf5', '#c9efff'], far: '#9fcfd8', farSnow: null, mid: '#6fbf5a', midDark: '#4f9e41', grass: '#61b83d', grassDark: '#3f8a28', dirt: '#8a5a33', dirtDark: '#5e3a1e', deco: 'tree' },
  { name: 'CANYON', sky: ['#ff9f5a', '#ffe3b0'], far: '#e9a878', farSnow: null, mid: '#d98a4e', midDark: '#b86d36', grass: '#e9c47a', grassDark: '#c99b4e', dirt: '#c07a44', dirtDark: '#8e5226', deco: 'cactus' },
  { name: 'TUNDRA', sky: ['#8fcff7', '#effaff'], far: '#c5dff0', farSnow: '#ffffff', mid: '#a9cfe6', midDark: '#86b3d0', grass: '#f5fbff', grassDark: '#cfe6f5', dirt: '#8aaec6', dirtDark: '#5f87a3', deco: 'pine' },
  { name: 'VOLCANO', sky: ['#1c0505', '#6b1208', '#e64a19', '#ff9a3c'], far: '#3a130f', farSnow: '#ff6a2a', mid: '#280c09', midDark: '#140403', grass: '#4a1410', grassDark: '#ff5722', dirt: '#240806', dirtDark: '#0e0302', deco: 'volcano' }
];

/* =====================================================================
   LEVELS (64 Handcrafted Campaign Milestones & 16-Archetype Endless Engine)
   ===================================================================== */
const LEVELS = [
  /* ===================================================================
     🌲 REALM 1: FOREST (Levels 1 - 16) · Oak Timber & Verdant Ridges
     =================================================================== */
  // Level 1: First Shot - Basic wooden tower
  { w: 0, ammo: ['rock', 'rock', 'rock'], build(b) { b.fort(15, 0, [{ w: 2.4, h: 1.3, in: 'e' }], 'e'); } },
  // Level 2: Double Perch - Two wooden towers & cake reward
  { w: 0, ammo: ['rock', 'rock', 'rock'], build(b) { b.fort(13.5, 0, [{ w: 2.2, h: 1.3, in: 'e' }]); b.fort(17.5, 0, [{ w: 2.2, h: 1.3, in: 'cake' }, { w: 2.2, h: 1.2, in: 'e' }]); } },
  // Level 3: TNT Chain Reaction
  { w: 0, ammo: ['rock', 'bomb', 'rock'], build(b) { b.fort(16, 0, [{ w: 3.4, h: 1.3, in: ['e', 'tnt', 'e'], mid: true, mat: 'wood' }, { w: 2.4, h: 1.2, in: 'e' }], 'gem'); } },
  // Level 4: Raised Ridge - Stone foundation on elevated terrain
  { w: 0, ammo: ['rock', 'rock', 'bomb'], build(b) { b.ground(14, 20, 1.4); b.fort(16, 1.4, [{ w: 2.2, h: 1.3, in: 'e', mat: 'stone', beam: 'wood' }]); b.fort(18.8, 1.4, [{ w: 2, h: 1.3, in: 'e' }, { w: 2, h: 1.1, in: 'cake' }]); } },

})();
