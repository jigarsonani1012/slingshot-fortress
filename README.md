# 🏹 Slingshot Fortress: Smash the Towers 💥

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas%202D-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Planck.js Physics](https://img.shields.io/badge/Physics-Planck.js%20(Box2D)-red.svg)](https://github.com/shakiba/planck.js)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio-Procedural-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Zero Build Setup](https://img.shields.io/badge/Setup-Zero%20Build-brightgreen.svg)]()

> Pull back your slingshot, adjust your angle and launch power, deploy specialized ammo types, and demolish fortified enemy structures in **Slingshot Fortress** — a feature-rich, 2D physics-based destruction game built with HTML5 Canvas, Planck.js (Box2D engine), procedural Web Audio API sound synthesis, and multiple game modes.

---

## 🌟 Key Features

### 🏹 Physics-Driven Slingshot & Projectile Mechanics
- **Realistic 2D Rigidbody Physics**: Powered by `Planck.js` (Box2D JavaScript port) with mass, impulse, restitution, friction, and structural integrity calculations.
- **Dynamic Aiming & Elastic Drag**: Smooth touch and mouse drag controls with visual trajectory predictor dots.
- **Specialized Ammo Types & In-Flight Abilities**:
  - 🪨 **Standard Stone**: High-density base projectile.
  - 💥 **TNT Bomb**: In-flight tap to detonate a high-impulse explosion clearing surrounding blocks.
  - 🪓 **Cluster Splitter**: Tap mid-flight to split into 3 flying projectiles covering wide spread.
  - ⚡ **Shuriken Piercer**: Aerodynamic projectile that cuts through wooden beams and ice blocks with high speed.
  - 🚀 **Homing Missile**: In-flight tap activates thrusters to lock onto nearest enemy creatures.
  - 🪨 **Heavy Boulder**: Massive stone ball capable of crushing fortified stone bases.

### 🏰 Structure Demolition & Material Mechanics
- **Varied Structural Materials**:
  - **Wood**: Balanced durability, vulnerable to sharp projectiles and fire.
  - **Stone**: Heavy and sturdy base material, weak against heavy impact.
  - **Ice / Glass**: Brittle material with high bounce, shatters easily upon impact.
  - **TNT Crate**: Explosive chain-reaction blocks.
  - **Balloons & Floating Platforms**: Suspended air fortresses held up by destroyable hot-air balloons.
- **Structural Integrity & Destruction Meter**: Real-time damage calculation, combo multipliers, pop-up points, and screen shake.

### 🎮 Multiple Game Modes
- 🗺️ **Campaign Mode**: Multi-world progression through Forest, Desert Canyon, Tundra, Volcano, and Sky Temple.
- 📅 **Daily Fortress Challenge**: Unique daily challenge fortress generated from the UTC calendar date.
- ⚔️ **Local 2-Player PvP Mode**: Turn-based head-to-head battle on opposite fortresses (Red vs Blue).
- 🛒 **Slingshot Shop**: Earn coins through gameplay to unlock custom slingshots (Classic, Heavy Golden, Multi-Shot, Precision).
- 📖 **Interactive Field Guide**: In-game guide detailing weapon statistics, material weaknesses, and demolition tactics.

### 🎵 Procedural Web Audio Engine
- **Zero External MP3 Assets**: All audio effects synthesized dynamically using Web Audio API oscillators and noise buffers.
- **Dynamic Acoustics**: Elastic band stretch tension, launch swoosh, material collision thuds, glass shatters, explosive booms, star chimes, and background melody.

---

## 🎮 How to Play & Controls

### Aiming & Shooting
1. **Pull Back**: Touch or click and drag the loaded stone on the slingshot pouch.
2. **Aim**: Adjust your pull distance and launch angle. Trajectory dots guide your arc.
3. **Release**: Let go to launch the projectile towards the fortress.
4. **Activate Ability**: Tap anywhere on the screen while the projectile is in flight to trigger special powers (split, explode, boost).

### Touch & Mouse Shortcuts
- **Drag Canvas**: Pan view across the battlefield when not dragging the slingshot.
- **Pinch / Scroll**: Zoom in and out to inspect fortress weak points.
- **HUD Buttons**: Fast restart, pause menu, field guide, and inspection toggle.

---

## 🏗️ Technical Architecture

```
slingshot-fortress/
├── index.html        # Game HUD, modal screens, SVG graphics & canvas setup
├── style.css         # Playful cartoon styling, CSS variables & responsive layout
├── script.js         # Planck.js Box2D integration, slingshot physics, rendering & sound engine
├── README.md         # Comprehensive project documentation
├── LICENSE           # MIT License file
└── .gitignore        # Git ignore rules
```

### Core Architecture Highlights
- **Planck.js Integration**: Translates Box2D meters/radians physics coordinates into Canvas 2D pixels seamlessly.
- **Particle System**: Lightweight custom particle manager for wood splinters, stone dust, glass shards, explosion shockwaves, and smoke trails.
- **Local Persistence**: Saves level stars, high scores, coins, unlocked slingshots, and daily challenge records via `localStorage`.

---

## 🚀 Quick Start & Running Locally

Because **Slingshot Fortress** is built with clean Vanilla JS and HTML5 Canvas, no node build pipeline is required:

### 1. Clone the repository
```bash
git clone https://github.com/jigarsonani1012/slingshot-fortress.git
cd slingshot-fortress
```

### 2. Launch in Browser
- **Option A**: Open `index.html` directly in your favorite web browser.
- **Option B**: Run with a local HTTP server:
  ```bash
  # Using Python
  python -m http.server 8000

  # Using Node.js npx
  npx serve .
  ```
- Navigate to `http://localhost:8000`.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
