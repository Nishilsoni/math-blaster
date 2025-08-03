import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import GameCanvasComponent from './components/GameCanvas';
import GameUI from './components/GameUI';
import useGameLogic from './hooks/useGameLogic';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
`;

const WelcomeScreen = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

const WelcomeTitle = styled.h1`
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
  
  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 16px;
  padding: 20px 40px;
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 18px;
  }
`;

const Instructions = styled.div`
  margin-top: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  max-width: 500px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 24px;
  }
`;

const ControlsSection = styled.div`
  margin-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  max-width: 500px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 16px;
  }
`;

const SoundToggleButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 101;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
  }
`;

const ControlItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 8px 0;
  
  .key {
    background: rgba(99, 102, 241, 0.3);
    border: 1px solid rgba(99, 102, 241, 0.5);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 240px;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    width: 180px;
    margin-bottom: 24px;
  }
`;

const OperationDropdown = styled.select`
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 18px;
  border-radius: 8px;
  border: 1.5px solid #6366f1;
  background: #181826;
  color: #fff;
  outline: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99,102,241,0.08);
  appearance: none;
  transition: border 0.2s;
  &:focus {
    border: 2px solid #8b5cf6;
  }
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 36px 10px 12px;
  }
`;

const DropdownArrow = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 20px;
  color: #8b5cf6;
`;

const App = () => {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [operation, setOperation] = React.useState('multiplication');
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  
  const {
    gameState,
    highScore,
    settings,
    canvasRef,
    handleAnswerClick,
    handleRestart,
    handleCanvasClick,
    toggleSettings,
    togglePause,
    toggleSound,
    currentAnswers
  } = useGameLogic(operation);

  // Handle sound toggle for main screen
  const handleMainSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    // Also update the game's sound setting
    if (toggleSound) {
      toggleSound();
    }
  };

  // Sync main screen sound state with game sound state
  React.useEffect(() => {
    if (settings && settings.soundEnabled !== undefined) {
      setSoundEnabled(settings.soundEnabled);
    }
  }, [settings?.soundEnabled]);

  const handleStartGame = () => {
    setGameStarted(true);
  };



  if (!gameStarted) {
    return (
      <AppContainer>
        <SoundToggleButton
          onClick={handleMainSoundToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </SoundToggleButton>
        <WelcomeScreen
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DropdownWrapper>
            <OperationDropdown
              value={operation}
              onChange={e => setOperation(e.target.value)}
            >
              <option value="division">Division</option>
              <option value="multiplication">Multiplication</option>
              <option value="addition">Addition</option>
              <option value="subtraction">Subtraction</option>
            </OperationDropdown>
            <DropdownArrow>▼</DropdownArrow>
          </DropdownWrapper>
          <WelcomeTitle>Math Blaster</WelcomeTitle>
          <WelcomeSubtitle>
            Defend your space station by solving math problems! 
            Target asteroids and choose the correct answer before they reach you.
          </WelcomeSubtitle>
          <StartButton
            onClick={handleStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </StartButton>
          <Instructions>
            <p>• Solve math problems to destroy asteroids</p>
            <p>• Click the correct answer before asteroids reach maximum size</p>
            <p>• You have 3 lives - use them wisely!</p>
            <p>• High score is saved automatically</p>
            <p>• Speed increases with each point scored!</p>
          </Instructions>
          <ControlsSection>
            <h3>Controls:</h3>
            <ControlItem>
              <span className="key">1</span>
              <span className="key">2</span>
              <span className="key">3</span>
              <span className="key">4</span>
              <span>Answer buttons (desktop)</span>
            </ControlItem>
            <ControlItem>
              <span className="key">ESC</span>
              <span>Pause/Resume</span>
            </ControlItem>
            <ControlItem>
              <span>Click/Touch buttons (mobile)</span>
            </ControlItem>
          </ControlsSection>
        </WelcomeScreen>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GameCanvasComponent
        ref={canvasRef}
        gameState={gameState}
        onCanvasClick={handleCanvasClick}
      >
        <GameUI
          gameState={{ ...gameState, highScore }}
          settings={settings}
          onAnswerClick={handleAnswerClick}
          onRestart={handleRestart}
          onToggleSettings={toggleSettings}
          onTogglePause={togglePause}
          onToggleSound={toggleSound}
          answers={currentAnswers}
        />
      </GameCanvasComponent>
    </AppContainer>
  );
};

export default App; 