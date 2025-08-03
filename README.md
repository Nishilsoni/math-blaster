# Math Blaster - Modern Educational Math Game

A stunning, modern React-based math game designed to help players improve their math skills through interactive gameplay with beautiful animations and sleek UI.

## ✨ Features

- **🎮 Interactive Math Challenges**: Solve math problems to destroy asteroids
- **🚀 Dynamic Difficulty**: Game speed increases as you progress
- **🎯 Visual Feedback**: Advanced aim system with color-coded targeting
- **🏆 Score Tracking**: High score system with local storage persistence
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎨 Modern UI**: Beautiful glassmorphism design with smooth animations
- **⚡ React Performance**: Built with React hooks and optimized rendering
- **🎭 Framer Motion**: Smooth animations and transitions throughout
- **🎵 Audio Support**: Background soundtrack for immersive experience
- **⚙️ Settings Panel**: Pause/resume and sound controls

## 🎮 How to Play

1. **🎯 Target Asteroids**: The game automatically targets the closest asteroid
2. **🧮 Solve Math Problems**: Each asteroid displays a math problem
3. **✅ Choose Correct Answer**: Click the button with the correct answer
4. **💥 Avoid Collisions**: Solve problems before asteroids reach maximum size
5. **📊 Track Progress**: Monitor your score and lives remaining

## 🎛️ Game Controls

- **Answer Buttons**: Click to select your answer
- **Toggle Position**: Move answer buttons between bottom and center
- **ESC Key**: Pause/unpause the game
- **Settings Icon**: Click to access game settings
- **Click After Game Over**: Restart the game

## 🛠️ Technical Stack

- **React 18**: Latest React with hooks and modern patterns
- **Styled Components**: CSS-in-JS for component styling
- **Framer Motion**: Advanced animations and transitions
- **Canvas API**: High-performance game rendering
- **Local Storage**: Persistent high score tracking
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Quick Start
1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Game Mechanics

- **❤️ Lives**: Start with 3 lives, lose one when an asteroid hits
- **🏆 Scoring**: +1 point for each correctly solved problem
- **⚡ Difficulty**: Asteroids grow faster as the game progresses
- **🎯 Aiming**: Green aim indicates ready to shoot, red indicates jammed
- **💫 Visual Effects**: Screen shake and particle effects for feedback

## 🎨 Design Features

- **Glassmorphism UI**: Modern frosted glass effect design
- **Gradient Backgrounds**: Beautiful space-themed gradients
- **Smooth Animations**: 60fps animations with Framer Motion
- **Responsive Layout**: Adapts to any screen size
- **Dark Theme**: Easy on the eyes with space aesthetics
- **Icon Integration**: Lucide React icons for better UX

## 📱 Mobile Support

- **Touch Controls**: Optimized for touch devices
- **Responsive Buttons**: Large, easy-to-tap buttons
- **Adaptive Layout**: Automatically adjusts to screen size
- **Performance Optimized**: Smooth 60fps on mobile devices

## 🔧 Customization

The game is built with modular components, making it easy to customize:
- Modify game difficulty in `useGameLogic.js`
- Change UI styling in component files
- Add new game modes or features
- Customize animations and effects

## 🎵 Audio

The game includes background soundtrack support (currently disabled by default). To enable:
1. Uncomment the audio code in the game logic
2. Ensure the soundtrack.ogg file is in the public folder

## 🏆 High Scores

Your best score is automatically saved to local storage and displayed during gameplay. Challenge yourself to beat your personal best!

## 🚀 Performance

- **Optimized Rendering**: Canvas-based game loop for smooth 60fps
- **Memory Efficient**: Proper cleanup and state management
- **Fast Loading**: Minimal bundle size with code splitting
- **Smooth Animations**: Hardware-accelerated animations

Enjoy the game and improve your math skills with this modern, beautiful educational experience! 