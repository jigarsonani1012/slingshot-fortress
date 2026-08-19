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
  // Level 5: Pyramid of Oak
  { w: 0, ammo: ['bomb', 'rock', 'rock', 'rock'], build(b) { b.pyramid('wood', 16.5, 0, 5, 0.75, ['e', 'e', 'e']); b.item('cake', 16.5, 3.75); } },
  // Level 6: Ice Shuriken Slice - Fragile ice pillars
  { w: 0, ammo: ['bomb', 'rock', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2, h: 1.3, in: 'e', mat: 'ice' }, { w: 2, h: 1.2, in: 'e', mat: 'ice' }]); b.fort(17.5, 0, [{ w: 2, h: 1.3, in: 'gem', mat: 'ice' }, { w: 2, h: 1.2, in: 'e', mat: 'ice' }], 'e'); } },
  // Level 7: Airborne Balloon Nest
  { w: 0, ammo: ['rock', 'bomb', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.4, h: 1.3, in: 'e' }]); b.balloonPlat(19, 5.6, 2.4, 'wood', 1.6, ['e']); b.fort(19, 0, [{ w: 2.2, h: 1.2, in: 'tnt' }]); } },
  // Level 8: Woodland Bastion - Wide 3-tier fort
  { w: 0, ammo: ['rock', 'bomb', 'bomb', 'rock'], build(b) { b.ground(13.5, 21.5, 0.8); b.fort(17.5, 0.8, [{ w: 4.6, h: 1.3, in: ['e', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 3.4, h: 1.3, in: ['e', 'gem'], mid: true }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }], 'cake'); } },
  // Level 9: Twin Treehouses - Two high watchtowers connected by crossbeam
  { w: 0, ammo: ['bomb', 'bomb', 'rock'], build(b) { const t1 = b.fort(14, 0, [{ w: 2.0, h: 1.5, in: 'e', mat: 'wood' }, { w: 2.0, h: 1.3, in: 'tnt', mat: 'wood' }]); const t2 = b.fort(20, 0, [{ w: 2.0, h: 1.5, in: 'h', mat: 'wood' }, { w: 2.0, h: 1.3, in: 'cake', mat: 'ice' }]); const by = Math.min(t1, t2) - 0.15; b.beam('wood', 13.5, 20.5, by, 0.3); b.enemy(17, by + 0.3); b.item('gem', 17, by + 1.1); } },
  // Level 10: Timber Viaduct - High bridge with rolling boulder
  { w: 0, ammo: ['missile', 'rock', 'bomb'], build(b) { b.ground(13, 21, 1.0); b.col('stone', 14.5, 1.0, 2.8, 0.5); b.col('stone', 19.5, 1.0, 2.8, 0.5); b.beam('wood', 13.8, 20.2, 3.8, 0.35); b.enemy(17, 3.8 + 0.35, true); b.boulder(15.2, 4.15, 0.5); b.fort(17, 1.0, [{ w: 2.4, h: 1.3, in: ['e', 'tnt'], mid: true, mat: 'wood' }], 'cake'); } },
  // Level 11: Rolling Oak Run - Angled boulder atop roof
  { w: 0, ammo: ['rock', 'bomb', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.6, h: 1.4, in: ['h', 'e'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.2, in: 'tnt', mat: 'wood' }]); b.fort(19.5, 0, [{ w: 3.0, h: 1.3, in: ['e', 'cake'], mid: true, mat: 'wood' }]); b.boulder(14, 2.6, 0.55); } },
  // Level 12: Triple Canopy Nests - Staggered balloon platforms
  { w: 0, ammo: ['bomb', 'bomb', 'missile'], build(b) { b.balloonPlat(14, 4.8, 2.0, 'wood', 1.3, ['e']); b.balloonPlat(18, 6.2, 2.2, 'wood', 1.4, ['h', 'gem']); b.balloonPlat(22, 5.0, 2.0, 'ice', 1.3, ['e']); b.fort(18, 0, [{ w: 2.6, h: 1.2, in: 'tnt', mat: 'wood' }], 'cake'); } },
  // Level 13: Oak Citadel - Multi-room fortress
  { w: 0, ammo: ['bomb', 'bomb', 'missile', 'rock'], build(b) { b.ground(13.5, 22.5, 0.6); b.fort(18, 0.6, [{ w: 5.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 3.6, h: 1.3, in: ['e', 'cake'], mid: true, mat: 'wood' }, { w: 2.0, h: 1.2, in: 'e', mat: 'ice' }], 'gem'); } },
  // Level 14: Drawbridge Keep - Twin towers with raised bridge
  { w: 0, ammo: ['missile', 'bomb', 'bomb'], build(b) { b.ground(12.5, 16, 1.2); b.fort(14.25, 1.2, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }]); b.ground(19, 23.5, 2.2); b.fort(21.25, 2.2, [{ w: 2.4, h: 1.4, in: ['e', 'tnt'], mid: true, mat: 'wood' }, { w: 2.0, h: 1.2, in: 'h' }], 'cake'); } },
  // Level 15: Glacier Ridge - Ice & wood on high ridge
  { w: 0, ammo: ['bomb', 'bomb', 'missile', 'rock'], build(b) { b.ground(14, 21, 1.6); b.fort(17.5, 1.6, [{ w: 4.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'ice', beam: 'stone' }, { w: 2.6, h: 1.2, in: 'gem', mat: 'wood' }], 'h'); b.boulder(20.5, 1.6, 0.55); } },
  // Level 16: FOREST BOSS KEEP - Chapter 1 Climax Fortress
  { w: 0, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 27, 0.6); b.fort(15.5, 0.6, [{ w: 3.2, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.3, in: 'h', mat: 'wood' }], 'cake'); b.fort(20.5, 0.6, [{ w: 4.8, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.6, h: 1.4, in: ['h', 'gem'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'wood' }], 'gem'); b.fort(25.5, 0.6, [{ w: 2.6, h: 1.4, in: ['h', 'e'], mid: true, mat: 'wood' }], 'e'); b.boulder(18.5, 0.6, 0.6); b.boulder(22.5, 0.6, 0.6); } },

  /* ===================================================================
     🏜️ REALM 2: CANYON (Levels 17 - 32) · Red Sandstone & Desert Mesas
     =================================================================== */
  // Level 17: Desert Ridge
  { w: 1, ammo: ['rock', 'bomb', 'rock'], build(b) { b.ground(14, 19, 1); b.fort(16.5, 1, [{ w: 3.6, h: 1.3, in: ['e', 'tnt', 'h'], mid: true, mat: 'stone' }]); b.boulder(19.6, 0, 0.55); } },
  // Level 18: Chasm Jump
  { w: 1, ammo: ['missile', 'rock', 'missile'], build(b) { b.ground(11, 14, 1.2); b.fort(12.5, 1.2, [{ w: 2, h: 1.2, in: 'e' }]); b.ground(24, 29, 3.2); b.fort(26.5, 3.2, [{ w: 2.6, h: 1.3, in: 'h', mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.1, in: 'gem' }], 'e'); } },
  // Level 19: Terracotta Arch
  { w: 1, ammo: ['bomb', 'bomb', 'rock'], build(b) { const t1 = b.fort(14, 0, [{ w: 1.8, h: 1.6, in: 'h', mat: 'stone' }, { w: 1.8, h: 1.4, in: 'cake' }]); b.fort(20, 0, [{ w: 1.8, h: 1.6, in: 'e', mat: 'stone' }, { w: 1.8, h: 1.4, in: 'tnt' }]); b.beam('wood', 13.1, 20.9, t1); b.enemy(17, t1 + 0.3, true); b.enemy(15.8, t1 + 0.3); } },
  // Level 20: Desert Zeppelins
  { w: 1, ammo: ['rock', 'missile', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.balloonPlat(18, 5.2, 2.2, 'wood', 1.4, ['e']); b.balloonPlat(22.5, 6.4, 2.2, 'ice', 1.6, ['e', 'gem']); } },
  // Level 21: Sandstone Bunker
  { w: 1, ammo: ['bomb', 'bomb', 'missile'], build(b) { b.ground(14, 22, 0.6); b.fort(18, 0.6, [{ w: 5, h: 1.4, in: ['e', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.6, h: 1.3, in: ['cake', 'e'], mid: true, mat: 'wood' }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }], 'e'); } },
  // Level 22: Triple Dynamite Pillars
  { w: 1, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.fort(14.5, 0, [{ w: 2.2, h: 1.2, in: 'tnt' }, { w: 2.2, h: 1.2, in: 'e', mat: 'stone' }]); b.fort(18, 0, [{ w: 2.2, h: 1.2, in: 'h', mat: 'stone' }, { w: 2.2, h: 1.2, in: 'tnt' }]); b.fort(21.5, 0, [{ w: 2.2, h: 1.2, in: 'tnt' }, { w: 2.2, h: 1.2, in: 'e', mat: 'stone' }], 'gem'); } },
  // Level 23: Ascending Mesas
  { w: 1, ammo: ['missile', 'bomb', 'bomb'], build(b) { b.ground(13, 16, 1); b.fort(14.5, 1, [{ w: 2, h: 1.3, in: 'e' }]); b.ground(18, 21.5, 2.2); b.fort(19.75, 2.2, [{ w: 2.2, h: 1.3, in: 'h', mat: 'ice' }, { w: 2.2, h: 1.1, in: 'cake', mat: 'ice' }]); b.ground(23.5, 27, 3.4); b.fort(25.25, 3.4, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); } },
  // Level 24: Redrock Fortress
  { w: 1, ammo: ['rock', 'bomb', 'missile', 'bomb'], build(b) { b.ground(13, 25, 0.5); b.fort(16, 0.5, [{ w: 3.4, h: 1.4, in: ['h', 'e'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'tnt' }], 'e'); b.fort(22, 0.5, [{ w: 3.4, h: 1.4, in: ['e', 'gem'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'h', mat: 'wood' }], 'cake'); b.boulder(19, 0.5, 0.5); } },
  // Level 25: Quarry Vault - Heavy sandstone bunker with narrow slit
  { w: 1, ammo: ['bomb', 'missile', 'rock'], build(b) { b.ground(14, 21, 1.2); b.fort(17.5, 1.2, [{ w: 4.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.6, h: 1.2, in: 'gem', mat: 'stone' }], 'h'); b.boulder(20.5, 1.2, 0.6); } },
  // Level 26: Grand Viaduct - High sandstone aqueduct
  { w: 1, ammo: ['missile', 'bomb', 'rock', 'bomb'], build(b) { b.col('stone', 14, 0, 3.4, 0.6); b.col('stone', 19, 0, 3.4, 0.6); b.col('stone', 24, 0, 3.4, 0.6); b.beam('stone', 13.2, 24.8, 3.4, 0.4); b.enemy(16.5, 3.8, true); b.enemy(21.5, 3.8, true); b.boulder(14, 3.8, 0.55); b.fort(19, 0, [{ w: 2.4, h: 1.3, in: ['tnt', 'h'], mid: true, mat: 'wood' }], 'cake'); } },
  // Level 27: Sandstone Ziggurat - 5-level stepped pyramid
  { w: 1, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.pyramid('stone', 17.5, 0, 5, 0.78, ['h', 'tnt', 'h']); b.enemy(17.5, 4.0, true); b.item('gem', 17.5, 4.6); b.boulder(14.2, 0, 0.55); b.boulder(20.8, 0, 0.55); } },
  // Level 28: Twin Mesa Towers - Two high altitude sniper perches
  { w: 1, ammo: ['missile', 'missile', 'bomb', 'rock'], build(b) { b.ground(13, 17, 2.4); b.fort(15, 2.4, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.0, h: 1.2, in: 'cake' }], 'h'); b.ground(21, 26, 3.6); b.fort(23.5, 3.6, [{ w: 2.4, h: 1.4, in: ['tnt', 'h'], mid: true, mat: 'stone' }], 'gem'); } },
  // Level 29: Gondola Aerial Trap - Floating platform over TNT
  { w: 1, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.balloonPlat(15, 6.0, 2.4, 'stone', 1.5, ['h']); b.balloonPlat(21, 6.8, 2.4, 'wood', 1.6, ['h', 'tnt']); b.fort(21, 0, [{ w: 3.4, h: 1.3, in: ['h', 'cake'], mid: true, mat: 'stone' }], 'gem'); } },
  // Level 30: Terracotta Colosseum - 3-tier castle
  { w: 1, ammo: ['bomb', 'bomb', 'missile', 'rock'], build(b) { b.ground(13.5, 24.5, 0.6); b.fort(19, 0.6, [{ w: 5.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'cake'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }], 'gem'); b.boulder(16.5, 0.6, 0.55); b.boulder(21.5, 0.6, 0.55); } },
  // Level 31: Canyon Snipers - Staggered long range redoubt
  { w: 1, ammo: ['missile', 'bomb', 'missile', 'rock'], build(b) { b.ground(12.5, 16.5, 1.4); b.fort(14.5, 1.4, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.ground(18, 22.5, 2.8); b.fort(20.25, 2.8, [{ w: 2.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.0, h: 1.1, in: 'gem' }]); b.ground(24, 28.5, 4.0); b.fort(26.25, 4.0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 32: CANYON CITADEL BOSS - Chapter 2 Climax Fortress
  { w: 1, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 27, 0.6); b.fort(15.5, 0.6, [{ w: 3.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); b.fort(20.5, 0.6, [{ w: 5.2, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'gem'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'wood' }], 'gem'); b.fort(25.5, 0.6, [{ w: 2.8, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.2, in: 'h' }], 'e'); b.boulder(18.5, 0.6, 0.65); b.boulder(22.5, 0.6, 0.65); } },

  /* ===================================================================
     ❄️ REALM 3: TUNDRA (Levels 33 - 48) · Nordic Slate & Sapphire Glaciers
     =================================================================== */
  // Level 33: Frozen Foundation
  { w: 2, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.fort(15, 0, [{ w: 3.6, h: 1.4, in: ['h', 'e'], mid: true, mat: 'ice' }, { w: 2.4, h: 1.3, in: 'gem', mat: 'ice' }], 'e'); b.fort(19.6, 0, [{ w: 2, h: 1.4, in: 'h', mat: 'ice' }]); } },
  // Level 34: Avalanche Slope
  { w: 2, ammo: ['rock', 'bomb', 'bomb'], build(b) { b.ground(14, 17.5, 3); b.boulder(16.9, 3, 0.6); b.boulder(15.5, 3, 0.5); b.fort(19.5, 0, [{ w: 2.8, h: 1.3, in: ['h', 'e'], mid: true, mat: 'ice' }]); b.fort(23, 0, [{ w: 2, h: 1.3, in: 'h', mat: 'wood' }], 'cake'); } },
  // Level 35: Permafrost Spire
  { w: 2, ammo: ['missile', 'bomb', 'rock'], build(b) { b.fort(17, 0, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone', beam: 'ice' }, { w: 2.4, h: 1.3, in: 'tnt', mat: 'ice' }, { w: 2.4, h: 1.3, in: 'h', mat: 'ice' }, { w: 2.4, h: 1.2, in: 'gem', mat: 'ice' }], 'h'); } },
  // Level 36: Arctic Balloon Fleet
  { w: 2, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.balloonPlat(15.5, 5.2, 2.2, 'ice', 1.4, ['h']); b.balloonPlat(19.5, 6.6, 2.2, 'wood', 1.5, ['e', 'cake']); b.balloonPlat(23.5, 5.4, 2.2, 'ice', 1.4, ['h']); b.fort(19.5, 0, [{ w: 2.2, h: 1.2, in: 'tnt', mat: 'ice' }]); } },
  // Level 37: Glacial Step
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.fort(13, 0, [{ w: 2, h: 1.3, in: 'h', mat: 'ice' }]); b.ground(18.5, 21.5, 1.6); b.fort(20, 1.6, [{ w: 2.2, h: 1.3, in: 'e', mat: 'stone', beam: 'ice' }, { w: 2.2, h: 1.1, in: 'gem', mat: 'ice' }]); b.fort(27, 0, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.4, h: 1.2, in: 'h', mat: 'ice' }]); } },
  // Level 38: Ice Palace
  { w: 2, ammo: ['rock', 'rock', 'bomb'], build(b) { b.ground(14, 23, 0.7); b.fort(18.5, 0.7, [{ w: 5.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.3, in: 'gem', mat: 'ice' }], 'e'); } },
  // Level 39: Subzero Zeppelin
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.fort(14.5, 0, [{ w: 2.2, h: 1.3, in: 'tnt', mat: 'ice' }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }]); b.balloonPlat(19, 6, 2.4, 'stone', 1.5, ['e', 'tnt']); b.fort(23.5, 0, [{ w: 2.2, h: 1.3, in: 'e', mat: 'stone' }, { w: 2.2, h: 1.2, in: 'cake', mat: 'ice' }], 'h'); } },
  // Level 40: Frostbite Bastion
  { w: 2, ammo: ['rock', 'bomb', 'bomb', 'missile'], build(b) { b.ground(13, 27, 0.6); b.fort(16, 0.6, [{ w: 3.4, h: 1.4, in: ['e', 'tnt'], mid: true, mat: 'stone', beam: 'ice' }, { w: 2.2, h: 1.3, in: 'h', mat: 'ice' }], 'gem'); b.fort(21, 0.6, [{ w: 4.2, h: 1.5, in: ['h', 'h', 'tnt'], mid: true, mat: 'stone' }, { w: 3.2, h: 1.4, in: ['e', 'cake'], mid: true, mat: 'wood' }, { w: 2.2, h: 1.2, in: 'e', mat: 'ice' }], 'h'); b.fort(25.5, 0.6, [{ w: 2, h: 1.4, in: 'h', mat: 'ice' }]); } },
  // Level 41: Sapphire Ziggurat - Solid ice pyramid
  { w: 2, ammo: ['bomb', 'bomb', 'missile'], build(b) { b.pyramid('ice', 17.5, 0, 5, 0.8, ['h', 'tnt', 'h']); b.enemy(17.5, 4.2, true); b.item('gem', 17.5, 4.8); b.fort(13, 0, [{ w: 2.0, h: 1.3, in: 'h', mat: 'stone' }]); b.fort(22, 0, [{ w: 2.0, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 42: Frozen Aqueduct
  { w: 2, ammo: ['missile', 'bomb', 'rock', 'bomb'], build(b) { b.col('ice', 14, 0, 3.6, 0.5); b.col('stone', 19, 0, 3.6, 0.6); b.col('ice', 24, 0, 3.6, 0.5); b.beam('stone', 13.2, 24.8, 3.6, 0.4); b.boulder(16.5, 4.0, 0.6); b.boulder(21.5, 4.0, 0.6); b.enemy(19, 4.0, true); b.fort(19, 0, [{ w: 2.6, h: 1.3, in: ['tnt', 'h'], mid: true, mat: 'ice' }], 'cake'); } },
  // Level 43: Glacier Vault
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.ground(14, 21, 1.0); b.fort(17.5, 1.0, [{ w: 4.8, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'ice', beam: 'stone' }, { w: 3.2, h: 1.3, in: ['h', 'cake'], mid: true, mat: 'stone' }], 'gem'); b.boulder(20.5, 1.0, 0.55); } },
  // Level 44: Twin Ice Spires
  { w: 2, ammo: ['bomb', 'bomb', 'bomb', 'missile'], build(b) { b.fort(14, 0, [{ w: 1.8, h: 1.6, in: 'h', mat: 'ice' }, { w: 1.8, h: 1.4, in: 'tnt', mat: 'ice' }, { w: 1.8, h: 1.2, in: 'h', mat: 'ice' }]); b.fort(21, 0, [{ w: 1.8, h: 1.6, in: 'h', mat: 'ice' }, { w: 1.8, h: 1.4, in: 'gem', mat: 'ice' }, { w: 1.8, h: 1.2, in: 'h', mat: 'ice' }]); b.balloonPlat(17.5, 6.2, 2.2, 'ice', 1.4, ['h', 'cake']); } },
  // Level 45: Snowy Crags - 3 tiered slate pillboxes
  { w: 2, ammo: ['missile', 'bomb', 'bomb', 'rock'], build(b) { b.ground(12, 16, 1.2); b.fort(14, 1.2, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.ground(17.5, 22, 2.6); b.fort(19.75, 2.6, [{ w: 2.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'ice' }, { w: 2.0, h: 1.1, in: 'gem' }]); b.ground(23.5, 28, 4.0); b.fort(25.75, 4.0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 46: Permafrost Pendulum
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.balloonPlat(15, 6.2, 2.4, 'ice', 1.5, ['h', 'tnt']); b.balloonPlat(21, 6.6, 2.4, 'stone', 1.6, ['h', 'gem']); b.fort(18, 0, [{ w: 4.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'ice' }], 'cake'); } },
  // Level 47: Blizzard Fortress
  { w: 2, ammo: ['bomb', 'missile', 'bomb', 'rock'], build(b) { b.ground(13.5, 25.5, 0.8); b.fort(16, 0.8, [{ w: 3.2, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'ice', beam: 'stone' }, { w: 2.2, h: 1.2, in: 'h', mat: 'stone' }], 'cake'); b.fort(21, 0.8, [{ w: 4.6, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.2, h: 1.3, in: ['h', 'gem'], mid: true, mat: 'ice', beam: 'stone' }], 'gem'); b.boulder(18.5, 0.8, 0.6); } },
  // Level 48: TUNDRA FROST CITADEL BOSS - Chapter 3 Climax Fortress
  { w: 2, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 27, 0.6); b.fort(15, 0.6, [{ w: 3.0, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.3, in: 'h', mat: 'ice' }], 'cake'); b.fort(20, 0.6, [{ w: 5.4, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'h'], mid: true, mat: 'ice', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(25, 0.6, [{ w: 3.0, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'ice' }, { w: 2.2, h: 1.2, in: 'h', mat: 'stone' }], 'e'); b.balloonPlat(20, 7.0, 2.4, 'ice', 1.5, ['h', 'gem']); b.boulder(17.5, 0.6, 0.65); b.boulder(22.5, 0.6, 0.65); } },

  /* ===================================================================
     🌋 REALM 4: VOLCANO (Levels 49 - 64) · Basalt Magma Rock & Obsidian Citadel
     =================================================================== */
  // Level 49: Magma Ridge
  { w: 3, ammo: ['bomb', 'rock', 'missile'], build(b) { b.ground(14, 21, 1.2); b.fort(17.5, 1.2, [{ w: 3.8, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'cake', mat: 'wood' }], 'h'); b.boulder(20.5, 1.2, 0.6); } },
  // Level 50: Molten Chasm
  { w: 3, ammo: ['missile', 'bomb', 'rock'], build(b) { b.ground(12, 16, 1.5); b.fort(14, 1.5, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.ground(21, 28, 2.8); b.fort(24.5, 2.8, [{ w: 4.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.6, h: 1.2, in: 'gem' }], 'h'); } },
  // Level 51: Basalt Bridge
  { w: 3, ammo: ['bomb', 'bomb', 'missile'], build(b) { const t1 = b.fort(14.5, 0, [{ w: 2.2, h: 1.6, in: 'h', mat: 'stone' }, { w: 2.2, h: 1.3, in: 'tnt' }]); const t2 = b.fort(22.5, 0, [{ w: 2.2, h: 1.6, in: 'h', mat: 'stone' }, { w: 2.2, h: 1.3, in: 'cake' }]); b.beam('stone', 13.5, 23.5, Math.min(t1, t2), 0.35); b.enemy(18.5, Math.min(t1, t2) + 0.35, true); b.item('gem', 18.5, Math.min(t1, t2) + 1.2); } },
  // Level 52: Flying Ash Armada
  { w: 3, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.balloonPlat(15, 5.8, 2.4, 'stone', 1.5, ['h']); b.balloonPlat(20, 6.8, 2.4, 'wood', 1.6, ['h', 'tnt']); b.balloonPlat(25, 5.4, 2.2, 'ice', 1.4, ['gem']); b.fort(20, 0, [{ w: 3.4, h: 1.3, in: ['h', 'h'], mid: true, mat: 'stone' }], 'cake'); } },
  // Level 53: Pyramid of Ash
  { w: 3, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.pyramid('stone', 17.5, 0, 5, 0.8, ['h', 'tnt', 'h']); b.enemy(17.5, 4.2, true); b.item('gem', 17.5, 4.8); b.boulder(14.5, 0, 0.55); b.boulder(20.5, 0, 0.55); } },
  // Level 54: Caldera Steps
  { w: 3, ammo: ['missile', 'bomb', 'bomb'], build(b) { b.ground(13, 16.5, 1.8); b.fort(14.75, 1.8, [{ w: 2.2, h: 1.3, in: 'h', mat: 'wood' }]); b.ground(18.5, 22.5, 3.2); b.fort(20.5, 3.2, [{ w: 2.4, h: 1.4, in: ['tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'gem' }]); b.ground(24.5, 28.5, 1.0); b.fort(26.5, 1.0, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.4, h: 1.2, in: 'cake', mat: 'wood' }], 'h'); } },
  // Level 55: Magma Forge
  { w: 3, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.6, h: 1.4, in: ['tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.6, h: 1.3, in: 'h', mat: 'stone' }]); b.balloonPlat(19.5, 6.2, 2.6, 'stone', 1.6, ['h', 'tnt']); b.fort(25, 0, [{ w: 2.6, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.6, h: 1.3, in: ['h', 'gem'], mid: true, mat: 'wood' }], 'cake'); b.boulder(19.5, 0, 0.7); } },
  // Level 56: Obsidian Colosseum
  { w: 3, ammo: ['rock', 'bomb', 'bomb', 'missile'], build(b) { b.ground(13, 27, 0.6); b.fort(15.5, 0.6, [{ w: 3.2, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(20.5, 0.6, [{ w: 4.8, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.6, h: 1.4, in: ['h', 'cake'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'wood' }], 'gem'); b.fort(25.5, 0.6, [{ w: 2.6, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.2, in: 'cake' }], 'e'); b.boulder(18.5, 0.6, 0.6); b.boulder(22.5, 0.6, 0.6); } },
  // Level 57: Magma Vault - Heavy basalt bunker
  { w: 3, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.ground(14, 21.5, 1.4); b.fort(17.75, 1.4, [{ w: 5.0, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.4, h: 1.3, in: ['h', 'gem'], mid: true, mat: 'stone' }], 'h'); b.boulder(14.8, 1.4, 0.65); b.boulder(20.6, 1.4, 0.65); } },
  // Level 58: Twin Basalt Spires
  { w: 3, ammo: ['missile', 'bomb', 'missile', 'rock'], build(b) { b.col('stone', 14.5, 0, 4.2, 0.65); b.col('stone', 21.5, 0, 4.2, 0.65); b.beam('stone', 13.6, 22.4, 4.2, 0.4); b.enemy(14.5, 4.6, true); b.enemy(21.5, 4.6, true); b.enemy(18, 4.6, true); b.boulder(18, 5.2, 0.6); b.fort(18, 0, [{ w: 2.8, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }], 'cake'); } },
  // Level 59: Caldera Viaduct
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'rock'], build(b) { b.ground(13, 16.5, 1.0); b.col('stone', 14.75, 1.0, 3.2, 0.6); b.ground(21.5, 25, 1.0); b.col('stone', 23.25, 1.0, 3.2, 0.6); b.beam('stone', 14, 24, 4.2, 0.4); b.enemy(19, 4.6, true); b.boulder(16.5, 4.6, 0.55); b.boulder(21.5, 4.6, 0.55); b.fort(19, 0, [{ w: 3.2, h: 1.3, in: ['h', 'tnt'], mid: true, mat: 'stone' }], 'gem'); } },
  // Level 60: Obsidian Spire
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'rock'], build(b) { b.fort(17, 0, [{ w: 2.6, h: 1.5, in: 'h', mat: 'stone' }, { w: 2.4, h: 1.4, in: 'tnt', mat: 'stone' }, { w: 2.2, h: 1.3, in: 'h', mat: 'stone' }, { w: 2.0, h: 1.2, in: 'h', mat: 'ice' }], 'gem'); b.balloonPlat(13, 5.2, 2.0, 'stone', 1.4, ['h']); b.balloonPlat(21, 5.2, 2.0, 'stone', 1.4, ['h', 'cake']); } },
  // Level 61: Volcanic Trench
  { w: 3, ammo: ['bomb', 'bomb', 'missile', 'bomb'], build(b) { b.ground(13, 26, 0.8); b.fort(16, 0.8, [{ w: 3.6, h: 1.5, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'h', mat: 'stone' }], 'cake'); b.fort(22.5, 0.8, [{ w: 4.2, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.6, h: 1.2, in: 'gem', mat: 'stone' }], 'h'); b.boulder(19.2, 0.8, 0.7); } },
  // Level 62: Ash Catapult
  { w: 3, ammo: ['missile', 'bomb', 'missile', 'bomb'], build(b) { b.ground(12.5, 17, 1.8); b.fort(14.75, 1.8, [{ w: 2.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }], 'h'); b.ground(19, 24, 3.4); b.fort(21.5, 3.4, [{ w: 3.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }], 'gem'); b.ground(25.5, 29, 2.0); b.fort(27.25, 2.0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 63: Molten Redoubt
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13.5, 26.5, 0.6); b.fort(16, 0.6, [{ w: 3.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(21.5, 0.6, [{ w: 4.8, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.2, h: 1.3, in: ['h', 'cake'], mid: true, mat: 'stone' }], 'h'); b.balloonPlat(21.5, 6.8, 2.4, 'stone', 1.5, ['h', 'gem']); b.boulder(18.5, 0.6, 0.65); } },
  // Level 64: THE VOLCANIC MEGA-CITADEL (FINAL CAMPAIGN BOSS)
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 28, 0.7); b.fort(15.5, 0.7, [{ w: 3.6, h: 1.5, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); b.fort(20.5, 0.7, [{ w: 5.6, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 4.2, h: 1.5, in: ['h', 'h'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.8, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(25.5, 0.7, [{ w: 3.6, h: 1.5, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.balloonPlat(15.5, 6.8, 2.2, 'stone', 1.5, ['h']); b.balloonPlat(25.5, 6.8, 2.2, 'stone', 1.5, ['h']); b.boulder(18, 0.7, 0.7); b.boulder(23, 0.7, 0.7); } }
];

function obstaclesNow() {
  const list = [];
  for (const t of terrain) list.push((x, y) => x >= t.x0 && x <= t.x1 && y <= t.h);
  for (const e of ents) {
    if (e.kind !== 'block' && e.kind !== 'tnt' && e.kind !== 'item') continue;
    const p = e.body.getPosition(), a = e.body.getAngle(), c = Math.cos(a), s = Math.sin(a);
    if (e.round) list.push((x, y) => (x - p.x) ** 2 + (y - p.y) ** 2 <= e.r * e.r);
    else list.push((x, y) => {
      const dx = x - p.x, dy = y - p.y;
      return Math.abs(dx * c + dy * s) <= e.w / 2 && Math.abs(-dx * s + dy * c) <= e.h / 2;
    });
  }
  return list;
}
function shotClear(target, side = 0) {
  const obs = obstaclesNow();
  const tp = target.body.getPosition(), tr = target.r + 0.3;
  const dir = side ? -1 : 1, { x: restX, y: restY } = restPos(side), h = 1 / 30;
  for (let deg = 6; deg <= 84; deg += 6) {
    for (const m of [0.5, 0.85, 1.2, 1.5, 1.75]) {
      const th = deg * Math.PI / 180, ux = Math.cos(th) * dir, uy = Math.sin(th);
      let x = restX - ux * m, y = restY - uy * m;
      if (y < 0.75) continue;
      let vx = ux * m * LAUNCH_K, vy = uy * m * LAUNCH_K;
      for (let k = 0; k < 150; k++) {
        vy -= 10 * h;
        x += vx * h; y += vy * h;
        if (y < 0) break;
        if ((x - tp.x) ** 2 + (y - tp.y) ** 2 < tr * tr) return true;
        if (obs.some(o => o(x, y))) break;
      }
    }
  }
  return false;
}
function dropEnemy(e) {
  world.destroyBody(e.body);
  ents = ents.filter(x => x !== e);
}
function perchCandidates() {
  const structure = [], ground = [];
  for (const e of ents) {
    if (e.kind !== 'block' || e.round || Math.abs(e.body.getAngle()) > 0.1 || e.w < 0.6) continue;
    const p = e.body.getPosition(), top = p.y + e.h / 2;
    for (const f of [0.3, 0.7]) structure.push({ x: p.x - e.w / 2 + e.w * f, y: top });
  }
  for (const t of terrain) {
    if (t.h < 0.5 || t.x0 < 7) continue;
    const w = t.x1 - t.x0;
    if (w >= 1.2) for (const f of [0.3, 0.7]) structure.push({ x: t.x0 + w * f, y: t.h });
    for (const x of [t.x0 - 1.4, t.x1 + 1.4]) ground.push({ x, y: 0.05 });
  }
  return { structure, ground };
}
function pickPerch(perches, rng) {
  const pool = perches.structure.length && (rng() < 0.92 || !perches.ground.length) ? perches.structure : perches.ground;
  return pool.length ? pool[Math.floor(rng() * pool.length)] : null;
}
function pruneUnreachable() {
  const kept = [];
  for (const e of ents.filter(x => x.kind === 'enemy')) {
    const p = e.body.getPosition();
    const crowded = kept.some(o => Math.hypot(o.body.getPosition().x - p.x, o.body.getPosition().y - p.y) < 1.1);
    if (p.y < 0 || crowded || !shotClear(e)) dropEnemy(e);
    else kept.push(e);
  }
}
let procAttempt = 0;

/* ---------------- 16-Archetype Infinite Procedural Siege Engine ---------------- */
function generateProceduralLevel(idx) {
  const seed = stringSeed('fortress-proc-' + (idx + 1));
  let rng = mulberry32(seed);
  const worldIndex = (Math.floor(idx / 16)) % 4;
  const archetype = idx % 16;
  const endlessNum = idx >= 64 ? (idx - 63) : 1;
  const difficulty = idx >= 64 ? (1 + Math.floor(endlessNum / 3)) : (1 + Math.max(0, Math.floor((idx - 28) / 4)));
  const enemyCount = clamp(3 + Math.floor(difficulty * 0.45), 3, 10);
  const tough = clamp(0.2 + (difficulty - 1) / 14, 0.2, 0.95);
  const pick = () => (rng() < tough ? 'h' : 'e');

  const ammo = ['rock'];
  if (archetype === 0) ammo.push('bomb', 'rock', 'bomb');
  else if (archetype === 1) ammo.push('bomb', 'bomb', 'rock');
  else if (archetype === 2) ammo.push('bomb', 'missile', 'bomb');
  else if (archetype === 3) ammo.push('bomb', 'bomb', 'rock');
  else if (archetype === 4) ammo.push('rock', 'missile', 'bomb');
  else if (archetype === 5) ammo.push('missile', 'bomb', 'rock');
  else if (archetype === 6) ammo.push('bomb', 'bomb', 'missile', 'rock');
  else if (archetype === 7) ammo.push('rock', 'bomb', 'rock', 'bomb');
  else if (archetype === 8) ammo.push('bomb', 'missile', 'bomb');
  else if (archetype === 9) ammo.push('rock', 'bomb', 'rock', 'missile');
  else if (archetype === 10) ammo.push('bomb', 'bomb', 'missile');
  else if (archetype === 11) ammo.push('missile', 'bomb', 'bomb', 'rock');
  else if (archetype === 12) ammo.push('bomb', 'missile', 'bomb', 'bomb');
  else if (archetype === 13) ammo.push('bomb', 'bomb', 'missile', 'bomb');
  else if (archetype === 14) ammo.push('missile', 'missile', 'bomb', 'rock');
  else ammo.push('bomb', 'missile', 'bomb', 'bomb', 'rock');

  if (difficulty >= 3 && ammo.length < 4) ammo.push('rock');
  if (difficulty >= 6 && ammo.length < 4) ammo.push('bomb');
  if (difficulty >= 10 && ammo.length < 4) ammo.push('missile');

  return {
    w: worldIndex,
    procedural: true,
    levelNum: idx + 1,
    ammo: ammo.slice(0, 4),
    build(b) {
      rng = mulberry32(seed + procAttempt * 7919);
      const matMain = worldIndex === 2 ? 'ice' : worldIndex === 1 ? 'stone' : worldIndex === 3 ? 'stone' : 'wood';
      const matAlt = worldIndex === 2 ? 'stone' : worldIndex === 1 ? 'wood' : worldIndex === 3 ? 'ice' : 'stone';
      const center = 16.5 + (rng() - 0.5) * 2.2;
      let left = enemyCount;
      const jit = () => (rng() - 0.5) * 0.25;

      if (archetype === 0) {
        // Twin Citadel & High Drawbridge
        const h1 = b.fort(center - 3.2, 0, [{ w: 2.2 + jit(), h: 1.4, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: 'tnt', mat: matAlt }], pick());
        const h2 = b.fort(center + 3.2, 0, [{ w: 2.2 + jit(), h: 1.4, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: 'cake', mat: matAlt }], pick());
        const bridgeY = Math.min(h1, h2);
        b.beam(matMain, center - 3.2, center + 3.2, bridgeY, 0.35);
        b.enemy(center, bridgeY + 0.35, true);
        b.item('gem', center, bridgeY + 1.15);
      } else if (archetype === 1) {
        // Terraced Mountain Redoubt with Rolling Boulder
        b.ground(center - 4.0, center + 4.0, 1.0);
        b.fort(center, 1.0, [
          { w: 4.8 + jit(), h: 1.5, in: [pick(), 'tnt', pick()], mid: true, mat: 'stone' },
          { w: 3.4, h: 1.3, in: [pick(), 'cake'], mid: true, mat: matMain },
          { w: 2.2, h: 1.2, in: 'h', mat: matAlt }
        ], pick());
        b.boulder(center + 2.2, 1.0, 0.5);
        b.boulder(center - 2.2, 1.0, 0.5);
      } else if (archetype === 2) {
        // Airborne Zeppelin Bastions
        b.fort(center, 0, [{ w: 3.4, h: 1.4, in: [pick(), 'tnt'], mid: true, mat: matMain }], pick());
        b.balloonPlat(center - 3.0, 5.8, 2.2, matAlt, 1.4, [pick()]);
        b.balloonPlat(center + 3.0, 6.4, 2.2, matMain, 1.5, [pick(), 'gem']);
      } else if (archetype === 3) {
        // Ziggurat of Peril
        b.pyramid(matMain, center, 0, 5, 0.78, [pick(), 'tnt', pick()]);
        b.item('cake', center, 3.9);
        b.enemy(center, 4.3, true);
      } else if (archetype === 4) {
        // High Guard Columns & Heavy Spanning Truss
        b.ground(center - 1.8, center + 1.8, 1.8);
        const colTop = b.col('stone', center, 1.8, 3.2, 0.65);
        b.beam(matMain, center - 3.6, center + 3.6, colTop, 0.35);
        const beamTop = colTop + 0.35;
        b.enemy(center - 2.4, beamTop, rng() < tough);
        b.enemy(center + 2.4, beamTop, rng() < tough);
        b.enemy(center, beamTop, true);
        b.boulder(center - 3.0, beamTop, 0.45);
        b.boulder(center + 3.0, beamTop, 0.45);
      } else if (archetype === 5) {
        // Pillbox Bunker & Satellite Watchtower
        b.fort(center, 0, [
          { w: 4.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' },
          { w: 3.0, h: 1.3, in: 'cake', mat: 'ice', beam: 'ice' }
        ], 'gem');
        b.fort(center + 4.5, 0, [{ w: 2.2, h: 1.3, in: pick(), mat: matMain }]);
      } else if (archetype === 6) {
        // Triple Bastion Colosseum
        b.fort(center - 3.6, 0, [{ w: 2.2, h: 1.3, in: pick(), mat: matMain }], pick());
        b.fort(center, 0, [{ w: 2.6, h: 1.4, in: ['tnt', pick()], mid: true, mat: 'stone' }], 'h');
        b.fort(center + 3.6, 0, [{ w: 2.2, h: 1.3, in: pick(), mat: matAlt }], 'cake');
      } else if (archetype === 7) {
        // Ascending Triple Staircase Plateau
        b.ground(center - 8.5, center - 5.0, 0.8);
        b.fort(center - 6.75, 0.8, [{ w: 2.2, h: 1.3, in: pick(), mat: matMain }]);
        b.ground(center - 2.8, center + 1.2, 2.0);
        b.fort(center - 0.8, 2.0, [{ w: 2.4, h: 1.4, in: [pick(), 'tnt'], mid: true, mat: matAlt }], pick());
        b.ground(center + 3.2, center + 7.5, 3.4);
        b.fort(center + 5.35, 3.4, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }], 'gem');
      } else if (archetype === 8) {
        // Twin Pyramids Flanking Boulder Chasm
        b.pyramid(matMain, center - 3.8, 0, 3, 0.72, [pick()]);
        b.pyramid(matAlt, center + 3.8, 0, 3, 0.72, [pick()]);
        b.boulder(center - 0.7, 0, 0.55);
        b.boulder(center + 0.7, 0, 0.55);
        b.item('cake', center, 1.2);
      } else if (archetype === 9) {
        // 4-Floor Skyscraper Spire
        b.fort(center, 0, [
          { w: 3.2, h: 1.4, in: pick(), mat: matMain },
          { w: 2.6, h: 1.3, in: 'tnt', mat: matAlt },
          { w: 2.0, h: 1.2, in: pick(), mat: matMain },
          { w: 1.6, h: 1.1, in: 'gem', mat: matAlt }
        ], 'h');
        b.boulder(center - 2.6, 0, 0.5);
        b.boulder(center + 2.6, 0, 0.5);
      } else if (archetype === 10) {
        // 3-Step Balloon Armada Climbing in Altitude
        b.balloonPlat(center - 3.6, 5.0, 2.0, matMain, 1.3, [pick()]);
        b.balloonPlat(center, 6.2, 2.2, matAlt, 1.4, [pick(), 'tnt']);
        b.balloonPlat(center + 3.6, 7.4, 2.0, matMain, 1.5, [pick(), 'gem']);
      } else if (archetype === 11) {
        // Wide Bridge with Centered Command Post
        const t1 = b.fort(center - 3.8, 0, [{ w: 2.2, h: 1.5, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: pick(), mat: matAlt }]);
        const t2 = b.fort(center + 3.8, 0, [{ w: 2.2, h: 1.5, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: 'cake', mat: matAlt }]);
        const bridgeY = Math.min(t1, t2);
        b.beam('stone', center - 3.8, center + 3.8, bridgeY, 0.38);
        b.enemy(center, bridgeY + 0.38, true);
      } else if (archetype === 12) {
        // Honeycomb Labyrinth Citadel
        b.ground(center - 4.2, center + 4.2, 0.7);
        b.fort(center, 0.7, [
          { w: 5.2, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' },
          { w: 3.8, h: 1.4, in: ['h', 'cake'], mid: true, mat: matMain, beam: 'stone' },
          { w: 2.4, h: 1.2, in: 'gem', mat: matAlt }
        ], 'h');
        b.boulder(center - 2.8, 0.7, 0.5);
        b.boulder(center + 2.8, 0.7, 0.5);
      } else if (archetype === 13) {
        // Suspended Pendulum Trap over Basalt Base
        b.fort(center - 3.2, 0, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }]);
        b.fort(center + 3.2, 0, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }]);
        b.balloonPlat(center, 6.4, 2.4, matMain, 1.5, ['h', 'tnt']);
        b.item('gem', center, 0.4);
      } else if (archetype === 14) {
        // High Altitude Sniper Fortress & Boulder Launchpad
        b.ground(center - 4.5, center + 4.5, 2.4);
        b.fort(center, 2.4, [
          { w: 4.6, h: 1.5, in: ['h', 'tnt', 'h'], mat: 'stone' },
          { w: 2.8, h: 1.3, in: 'cake', mat: matMain }
        ], 'gem');
        b.boulder(center - 3.0, 2.4, 0.55);
        b.boulder(center + 3.0, 2.4, 0.55);
      } else {
        // The Boss Megafortress - Supreme 3-Tower Bastion
        b.ground(center - 5.5, center + 5.5, 0.8);
        b.fort(center - 3.6, 0.8, [{ w: 2.6, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.0, h: 1.2, in: 'h', mat: matAlt }], 'cake');
        b.fort(center, 0.8, [{ w: 4.8, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.4, h: 1.4, in: ['h', 'gem'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.2, h: 1.2, in: 'h', mat: matMain }], 'gem');
        b.fort(center + 3.6, 0.8, [{ w: 2.6, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.0, h: 1.2, in: 'h', mat: matAlt }], 'h');
        b.boulder(center - 1.8, 0.8, 0.55);
        b.boulder(center + 1.8, 0.8, 0.55);
      }
    }
  };
}

function getLevel(idx) {
  if (idx < LEVELS.length) return LEVELS[idx];
  return generateProceduralLevel(idx);
}

const TUT = { 1: 'DRAG BACK & RELEASE!' };

/* =====================================================================
   CANVAS
   ===================================================================== */
const cv = $('c'); let ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.25);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  fitCamera(true);
  buildVignette();
  if (typeof checkRotate === 'function') checkRotate();
}

/* ---------------- procedural material patterns ---------------- */
const PX = 64;
function makePat(draw) { const c = document.createElement('canvas'); c.width = c.height = 128; draw(c.getContext('2d'), 128); return ctx.createPattern(c, 'repeat'); }

function getThemeIndex() {
  if (typeof G !== 'undefined' && G && G.theme) {
    const idx = THEMES.indexOf(G.theme);
    if (idx >= 0) return idx;
  }
  if (typeof G !== 'undefined' && typeof G.levelIdx === 'number' && G.levelIdx < 64) {
    return Math.floor(G.levelIdx / 16);
  }
  return 0;
}

const THEME_OUTL = [
  { wood: '#6b3d17', stone: '#4c535b', ice: '#4d98c2' }, // 0: Forest
  { wood: '#6d2e0a', stone: '#5c2410', ice: '#8c4e20' }, // 1: Canyon
  { wood: '#4a3e35', stone: '#344757', ice: '#18749e' }, // 2: Tundra
  { wood: '#3c1812', stone: '#240a08', ice: '#421622' }  // 3: Volcano
];

const THEME_PAT = [
  // 0: FOREST (Lush golden-oak timber, mossy cobblestone, turquoise glacier)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(7); g.fillStyle = '#c98a4b'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3 + r() * 5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(122,74,34,.35)' : 'rgba(240,190,120,.35)';
        g.lineWidth = 1 + r() * 1.6; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 1.5);
        g.stroke();
      }
      for (let k = 0; k < 2; k++) {
        const x = r() * s, y = r() * s;
        g.strokeStyle = 'rgba(100,55,20,.55)'; g.lineWidth = 1.5;
        g.beginPath(); g.ellipse(x, y, 5, 2.5, 0, 0, 6.28); g.stroke();
      }
    }),
    stone: makePat((g, s) => {
      const r = mulberry32(11); g.fillStyle = '#9aa4ae'; g.fillRect(0, 0, s, s);
      for (let k = 0; k < 40; k++) {
        const x = r() * s, y = r() * s, rr = 4 + r() * 14;
        g.fillStyle = r() < 0.4 ? 'rgba(255,255,255,.08)' : r() < 0.8 ? 'rgba(40,50,60,.09)' : 'rgba(90,140,50,.14)';
        g.beginPath(); g.arc(x, y, rr, 0, 6.28); g.fill();
      }
      for (let k = 0; k < 150; k++) {
        g.fillStyle = r() < 0.5 ? 'rgba(60,66,74,.35)' : 'rgba(230,236,240,.35)';
        g.fillRect(r() * s, r() * s, 1.5, 1.5);
      }
    }),
    ice: makePat((g, s) => {
      const gr = g.createLinearGradient(0, 0, s, s);
      gr.addColorStop(0, '#dff6ff'); gr.addColorStop(0.5, '#aee2fa'); gr.addColorStop(1, '#c9eefe');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48, s); g.lineTo(k * 48 + s, 0); g.stroke(); }
      g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.2;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48 + 12, s); g.lineTo(k * 48 + 12 + s, 0); g.stroke(); }
    })
  },

  // 1: CANYON (Sunbaked desert cedar, terracotta red sandstone, sun-glassed amber quartz)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(19); g.fillStyle = '#d68344'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3 + r() * 4.5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(145,55,18,.42)' : 'rgba(255,185,120,.38)';
        g.lineWidth = 1 + r() * 1.7; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.06 + y) * 1.8);
        g.stroke();
      }
    }),
    stone: makePat((g, s) => {
      const r = mulberry32(23); g.fillStyle = '#b85c36'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 4 + r() * 6) {
        g.fillStyle = r() < 0.5 ? 'rgba(240,140,90,.22)' : 'rgba(100,35,15,.28)';
        g.fillRect(0, y, s, 2 + r() * 4);
      }
      for (let k = 0; k < 120; k++) {
        g.fillStyle = r() < 0.5 ? 'rgba(75,25,10,.35)' : 'rgba(255,200,160,.28)';
        g.fillRect(r() * s, r() * s, 1.6, 1.6);
      }
    }),
    ice: makePat((g, s) => {
      const gr = g.createLinearGradient(0, 0, s, s);
      gr.addColorStop(0, '#fffae8'); gr.addColorStop(0.5, '#f7cca0'); gr.addColorStop(1, '#e89e68');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2.8;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48, s); g.lineTo(k * 48 + s, 0); g.stroke(); }
    })
  },

  // 2: TUNDRA (Frosted Nordic birch, frostbitten slate, deep sapphire ice)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(31); g.fillStyle = '#c5b7a5'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3 + r() * 5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(80,68,58,.36)' : 'rgba(245,238,228,.48)';
        g.lineWidth = 1 + r() * 1.5; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 1.2);
        g.stroke();
      }

})();
