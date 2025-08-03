import React, { useRef, useEffect, useState, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

const GameCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const StarsBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: twinkle 3s ease-in-out infinite alternate;
  
  @keyframes twinkle {
    0% { opacity: 0.3; }
    100% { opacity: 0.8; }
  }
`;

const GameCanvasComponent = forwardRef(({ 
  gameState, 
  onCanvasClick, 
  children 
}, ref) => {
  const backgroundCanvasRef = useRef(null);
  const gameCanvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Forward the ref to the game canvas
  React.useImperativeHandle(ref, () => gameCanvasRef.current);

  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasSize({ width, height });

      // Update background canvas
      const bgCanvas = backgroundCanvasRef.current;
      if (bgCanvas) {
        bgCanvas.width = width;
        bgCanvas.height = height;
        const bgCtx = bgCanvas.getContext('2d');
        
        // Clear and redraw stars
        bgCtx.clearRect(0, 0, width, height);
        bgCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let i = 1; i <= 200; i++) {
          bgCtx.fillRect(
            Math.random() * width, 
            Math.random() * height, 
            1, 
            1
          );
        }
      }

      // Update game canvas
      const gameCanvas = gameCanvasRef.current;
      if (gameCanvas) {
        gameCanvas.width = width;
        gameCanvas.height = height;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  return (
    <CanvasContainer>
      <StarsBackground />
      <BackgroundCanvas ref={backgroundCanvasRef} />
      <GameCanvas 
        ref={gameCanvasRef}
        onClick={onCanvasClick}
      />
      {children}
    </CanvasContainer>
  );
});

GameCanvasComponent.displayName = 'GameCanvasComponent';

export default GameCanvasComponent; 