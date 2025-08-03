import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Settings, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const UIOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`;

const ScoreContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
  }
`;

const ScoreCard = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  min-width: 120px;
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    min-width: 100px;
  }
`;

const LivesContainer = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    gap: 4px;
  }
`;

const LifeHeart = styled(motion.div)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isAlive ? '#ef4444' : 'rgba(255, 255, 255, 0.3)'};
  filter: ${props => props.isAlive ? 'drop-shadow(0 0 8px #ef4444)' : 'none'};
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const SpeedIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 16px;
  color: #ffffff;
  font-weight: 500;
  font-size: 12px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    top: 15px;
    padding: 6px 12px;
    font-size: 10px;
  }
`;

const GameArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  pointer-events: auto;
  
  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }
`;

const ControlsContainer = styled(motion.div)`
  display: flex;
  gap: 16px;
  pointer-events: auto;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ControlButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    gap: 6px;
  }
`;

const AnswerButtonsContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  pointer-events: auto;
  
  @media (max-width: 768px) {
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    max-width: 350px;
  }
`;

const AnswerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const AnswerButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  color: #ffffff;
  font-weight: 600;
  font-size: 24px;
  cursor: pointer;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.6);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    font-size: 20px;
    min-height: 70px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 18px;
    min-height: 60px;
  }
`;

const KeyboardIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(99, 102, 241, 0.8);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const GameOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
`;

const GameOverContent = styled.div`
  text-align: center;
  color: #ffffff;
`;

const GameOverTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const GameOverScore = styled.p`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const RestartButton = styled(motion.button)`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 16px;
  }
`;

const SettingsIcon = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 140px;
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
  pointer-events: auto;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 120px;
    width: 40px;
    height: 40px;
  }
`;

const SettingsModal = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 20;
`;

const SettingsContent = styled.div`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  color: #ffffff;
`;

const SettingsTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SettingsButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 24px;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.6);
    transform: translateY(-2px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.6);
    transform: scale(1.1);
  }
`;

const GameUI = ({ 
  gameState, 
  settings,
  onAnswerClick, 
  onRestart,
  onToggleSettings,
  onTogglePause,
  onToggleSound,
  answers 
}) => {
  const { lives, score, highScore, paused, drawGameOver } = gameState;

  // Calculate speed percentage
  const speedPercentage = Math.round((score * 0.05 + 1) * 100);

  return (
    <UIOverlay>
      <GameArea>
        {/* Top Bar */}
        <TopBar>
          {/* Score and High Score */}
          <ScoreContainer
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ScoreCard>
              <Trophy size={16} />
              <span>Score: {score}</span>
            </ScoreCard>
            <ScoreCard>
              <Trophy size={16} />
              <span>Best: {highScore}</span>
            </ScoreCard>
          </ScoreContainer>

          {/* Speed Indicator */}
          <SpeedIndicator
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Speed: {speedPercentage}%
          </SpeedIndicator>

          {/* Lives */}
          <LivesContainer
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[1, 2, 3].map((life) => (
              <LifeHeart
                key={life}
                isAlive={life <= lives}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: life * 0.1 }}
              >
                <Heart size={life <= lives ? 24 : 20} fill={life <= lives ? '#ef4444' : 'none'} />
              </LifeHeart>
            ))}
          </LivesContainer>
        </TopBar>

        {/* Settings Icon */}
        <SettingsIcon
          onClick={onToggleSettings}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Settings size={24} />
        </SettingsIcon>

        {/* Bottom Bar */}
        <BottomBar>
          {/* Answer Buttons */}
          <AnimatePresence>
            {!drawGameOver && (
              <AnswerButtonsContainer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <AnswerGrid>
                  {answers.map((answer, index) => (
                    <AnswerButton
                      key={index}
                      onClick={() => onAnswerClick(answer)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {answer}
                      <KeyboardIndicator>
                        {index + 1}
                      </KeyboardIndicator>
                    </AnswerButton>
                  ))}
                </AnswerGrid>
              </AnswerButtonsContainer>
            )}
          </AnimatePresence>

          {/* Controls */}
          <ControlsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ControlButton onClick={() => window.location.reload()}>
              <Settings size={16} />
              Restart
            </ControlButton>
          </ControlsContainer>
        </BottomBar>
      </GameArea>

      {/* Game Over Screen */}
      <AnimatePresence>
        {drawGameOver && (
          <GameOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameOverContent>
              <GameOverTitle>Game Over</GameOverTitle>
              <GameOverScore>Final Score: {score}</GameOverScore>
              <RestartButton
                onClick={onRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </RestartButton>
            </GameOverContent>
          </GameOverlay>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {settings.showSettings && (
          <SettingsModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsContent>
              <CloseButton
                onClick={onToggleSettings}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ×
              </CloseButton>
              <SettingsTitle>Settings</SettingsTitle>
              
              <SettingsButton
                onClick={onTogglePause}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {paused ? <Play size={20} /> : <Pause size={20} />}
                {paused ? 'Resume Game' : 'Pause Game'}
              </SettingsButton>
              
              <SettingsButton
                onClick={onToggleSound}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                {settings.soundEnabled ? 'Sound On' : 'Sound Off'}
              </SettingsButton>
            </SettingsContent>
          </SettingsModal>
        )}
      </AnimatePresence>
    </UIOverlay>
  );
};

export default GameUI; 