# Minecraft 3D Game 🎮

A browser-based, 3D Minecraft-style game built with Three.js. Play directly in your browser with block placement, destruction, and local storage!

## ✨ Features

- 🎮 **Full 3D Gameplay** - Explore an infinite-like world
- 🧱 **5 Block Types** - Grass, Dirt, Stone, Wood, Sand
- 🏗️ **Build & Destroy** - Place and remove blocks freely
- 💾 **Local Storage** - Save and load your worlds
- 🎯 **Realistic Physics** - Gravity, jumping, collision detection
- 📊 **Live Stats** - Track position, blocks placed/destroyed
- 🌍 **Procedural Terrain** - Randomly generated landscape

## 🎮 Controls

| Control | Action |
|---------|--------|
| **W/A/S/D** | Move forward/left/back/right |
| **Space** | Jump |
| **Shift** | Move down |
| **Left Click** | Place block |
| **Right Click** | Destroy block |
| **Scroll Wheel** | Change selected block |
| **1-5 Keys** | Select block from inventory |

## 🚀 Quick Start

### Option 1: Online Play
1. Visit: [https://github.com/muntasirahamad/minecraft-3d-game](https://github.com/muntasirahamad/minecraft-3d-game)
2. Open `index.html` in your browser
3. Start building!

### Option 2: Local Setup
```bash
# Clone the repository
git clone https://github.com/muntasirahamad/minecraft-3d-game.git
cd minecraft-3d-game

# Open with a local server (Python)
python -m http.server 8000

# Or use Node.js http-server
npx http-server

# Visit http://localhost:8000
```

## 📁 Project Structure

```
minecraft-3d-game/
├── index.html          # Main HTML file with UI
├── game.js             # Game logic and Three.js implementation
├── README.md           # This file
└── LICENSE             # MIT License
```

## 🛠️ Technology Stack

- **Three.js** - 3D graphics library
- **WebGL** - Graphics rendering
- **HTML5/CSS3** - UI and styling
- **JavaScript (ES6)** - Game logic
- **localStorage API** - Data persistence

## 🎨 Block Types

| Block | Color | Use |
|-------|-------|-----|
| 🟩 Grass | Green | Surface building |
| 🟫 Dirt | Brown | Underground |
| ⬜ Stone | Gray | Mining |
| 🟨 Wood | Yellow | Construction |
| 🟡 Sand | Yellow/Orange | Desert areas |

## 💾 Save System

### Automatic Saving
Click the "💾 Save World" button to save your world to browser's local storage.

### Loading Worlds
Previously saved worlds will automatically load when you revisit the game.

### Data Storage
Worlds are stored in `localStorage` with key: `minecraftWorld`

```javascript
// View your save in browser console
JSON.parse(localStorage.getItem('minecraftWorld'))
```

## 🎯 Gameplay Tips

1. **Start Building** - The world has pre-generated terrain. Add your own blocks!
2. **Use Different Blocks** - Mix block types for visual interest
3. **Save Often** - Don't lose your progress! Click Save regularly
4. **Explore** - Walk around to see the procedurally generated landscape
5. **Build Vertically** - Create towers and structures
6. **Terraform** - Remove natural blocks and reshape the landscape

## 🐛 Known Limitations

- Collision detection is simplified (can walk through some blocks)
- Performance may vary on older devices with large worlds
- No multiplayer functionality
- Draw distance is limited for performance
- No mobs or NPCs (yet)

## 🚀 Future Features

- [ ] More block types (glass, lava, water, etc.)
- [ ] Crafting system
- [ ] Inventory management
- [ ] Animals/mobs
- [ ] Day/night cycle
- [ ] Weather effects
- [ ] Sound effects
- [ ] Multiplayer support
- [ ] Mobile touch controls

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

**Mobile:** Limited support (works on mobile browsers but controls are tricky)

## 📄 License

MIT License - Feel free to fork, modify, and use!

## 🙏 Credits

- Built with [Three.js](https://threejs.org/)
- Inspired by Minecraft
- Created by [@muntasirahamad](https://github.com/muntasirahamad)

## 📞 Support

Have issues or suggestions? 
- Open an issue on GitHub
- Check the console for error messages
- Clear browser cache and reload

---

**Happy Building! 🏗️** Start creating your own Minecraft world today!
