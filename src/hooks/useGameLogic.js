import { useState, useEffect, useRef, useCallback } from 'react';

const useGameLogic = (operation = 'multiplication') => {
  const [gameState, setGameState] = useState({
    damage: 0,
    score: 0,
    paused: false,
    lives: 3,
    shakeFrame: -1,
    asteroids: [],
    answers: [],
    aimJammed: false,
    drawGameOver: false
  });

  const [settings, setSettings] = useState({
    soundEnabled: true,
    showSettings: false
  });

  const [highScore, setHighScore] = useState(
    localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0
  );

  const gameConfig = useRef({
    fps: 30,
    asteroidsMaximumSize: 700,
    scalingFactor: 1.002, // Slower initial speed
    framesToShake: 7,
    aimSize: 60,
    speedIncreasePerPoint: 0.0005, // Speed increase per point
    baseSpeed: 1.002
  });

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const imageAsteroidRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  // Load asteroid image
  useEffect(() => {
    const imageAsteroid = new Image();
    imageAsteroid.src = '/asteroid.svg';
    imageAsteroidRef.current = imageAsteroid;
  }, []);

  // Load and setup audio
  useEffect(() => {
    const audio = new Audio('/soundtrack.ogg');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Start playing if sound is enabled
    if (settings.soundEnabled) {
      audio.play().catch(err => console.log('Audio autoplay blocked:', err));
    }
  }, []);

  // Helper function to play sound effects
  const playSoundEffect = useCallback((frequency, duration, type = 'ascending') => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    try {
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'ascending') {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(frequency * 1.25, audioContext.currentTime + duration * 0.5);
      } else if (type === 'descending') {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(frequency * 0.75, audioContext.currentTime + duration * 0.5);
      } else if (type === 'triple') {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(frequency * 0.83, audioContext.currentTime + duration * 0.33);
        oscillator.frequency.setValueAtTime(frequency * 0.67, audioContext.currentTime + duration * 0.67);
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Sound effect failed:', error);
    }
  }, [settings.soundEnabled]);

  // Handle audio state changes
  useEffect(() => {
    if (audioRef.current) {
      if (settings.soundEnabled) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [settings.soundEnabled]);

  // Initialize canvas when ref is available
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
    }
  }, [canvasRef.current]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState.paused || gameState.asteroids.length === 0) return;

      const key = e.key;
      const targetAsteroid = gameState.asteroids[0];
      
      if (!targetAsteroid || gameState.aimJammed) return;

      let selectedAnswer = null;
      
      switch(key) {
        case '1':
          selectedAnswer = targetAsteroid.answers[0];
          break;
        case '2':
          selectedAnswer = targetAsteroid.answers[1];
          break;
        case '3':
          selectedAnswer = targetAsteroid.answers[2];
          break;
        case '4':
          selectedAnswer = targetAsteroid.answers[3];
          break;
        case 'Escape':
          setGameState(prev => ({ ...prev, paused: !prev.paused }));
          break;
        default:
          return;
      }

      if (selectedAnswer !== null) {
        handleAnswerClick(selectedAnswer);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.paused, gameState.asteroids, gameState.aimJammed]);

  // Handle answer click
  const handleAnswerClick = useCallback((selectedAnswer) => {
    if (gameState.paused || gameState.asteroids.length === 0) return;

    const targetAsteroid = gameState.asteroids[0];
    
    if (targetAsteroid.number === selectedAnswer && !gameState.aimJammed) {
      // Correct answer
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        asteroids: prev.asteroids.filter(asteroid => asteroid !== targetAsteroid)
      }));
      
      // Play correct answer sound
      playSoundEffect(800, 0.2, 'ascending');
    } else {
      // Wrong answer - jam aim
      setGameState(prev => ({ ...prev, aimJammed: true }));
      setTimeout(() => {
        setGameState(prev => ({ ...prev, aimJammed: false }));
      }, 1000);
      
      // Play wrong answer sound
      playSoundEffect(200, 0.3, 'descending');
    }
     }, [gameState.paused, gameState.asteroids, gameState.aimJammed, playSoundEffect]);

  // Touch event handling for mobile - only prevent zooming on canvas
  useEffect(() => {
    const handleCanvasTouch = (e) => {
      // Only prevent default on canvas to avoid zooming during gameplay
      if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
      }
    };

    // Add touch event listeners only to canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });
      canvas.addEventListener('touchmove', handleCanvasTouch, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', handleCanvasTouch);
        canvas.removeEventListener('touchmove', handleCanvasTouch);
      }
    };
  }, [canvasRef.current]);



  // Generate mathematical operations based on selected operation
  const generateMathProblem = useCallback(() => {
    let text = '';
    let number = 0;
    let answers = [];
    const numberArr = [2, 3, 4, 5, 6, 7, 8, 9];
    let firstNum, secondNum;

    switch (operation) {
      case 'addition':
        firstNum = Math.floor(Math.random() * 50) + 1;
        secondNum = Math.floor(Math.random() * 50) + 1;
        text = `${firstNum} + ${secondNum}`;
        number = firstNum + secondNum;
        answers = [number];
        while (answers.length < 4) {
          let wrong = number + Math.floor(Math.random() * 21) - 10;
          if (wrong !== number && !answers.includes(wrong) && wrong > 0) answers.push(wrong);
        }
        break;
      case 'subtraction':
        firstNum = Math.floor(Math.random() * 100) + 1;
        secondNum = Math.floor(Math.random() * firstNum); // ensure non-negative
        text = `${firstNum} - ${secondNum}`;
        number = firstNum - secondNum;
        answers = [number];
        while (answers.length < 4) {
          let wrong = number + Math.floor(Math.random() * 21) - 10;
          if (wrong !== number && !answers.includes(wrong) && wrong >= 0) answers.push(wrong);
        }
        break;
      case 'division':
        secondNum = Math.floor(Math.random() * 12) + 2;
        number = Math.floor(Math.random() * 12) + 2;
        firstNum = secondNum * number;
        text = `${firstNum} ÷ ${secondNum}`;
        answers = [number];
        while (answers.length < 4) {
          let wrong = number + Math.floor(Math.random() * 11) - 5;
          if (wrong !== number && !answers.includes(wrong) && wrong > 0) answers.push(wrong);
        }
        break;
      case 'multiplication':
      default:
        firstNum = numberArr[Math.floor(Math.random() * numberArr.length)];
        secondNum = Math.floor(Math.random() * 13);
        text = `${firstNum} × ${secondNum}`;
        number = firstNum * secondNum;
        answers = [number];
        while (answers.length < 4) {
          let wrong = number + Math.floor(Math.random() * 21) - 10;
          if (wrong !== number && !answers.includes(wrong) && wrong >= 0) answers.push(wrong);
        }
        break;
    }
    // Shuffle answers
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return { text, number, answers };
  }, [operation]);

  // Create asteroid
  const createAsteroid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not available');
      return null;
    }
    const { text, number, answers } = generateMathProblem();
    let line1 = '', line2 = '';
    if (operation === 'multiplication' || operation === 'division') {
      const parts = text.split(/[×÷]/);
      line1 = ' ' + parts[0].trim();
      line2 = (operation === 'multiplication' ? '×' : '÷') + parts[1].trim();
    } else if (operation === 'addition' || operation === 'subtraction') {
      const parts = text.split(/[+-]/);
      line1 = ' ' + parts[0].trim();
      line2 = text.includes('+') ? '+' + parts[1].trim() : '-' + parts[1].trim();
    }
    // Asteroid size and aim size
    const asteroidSize = 50;
    const aimSize = gameConfig.current.aimSize;
    // Calculate safe spawn area based on screen size
    const isMobile = window.innerWidth <= 768;
    const maxAsteroidSize = isMobile ? Math.min(400, canvas.width * 0.8) : gameConfig.current.asteroidsMaximumSize;
    const safeAreaWidth = canvas.width - maxAsteroidSize - 100; // Extra padding
    const safeAreaHeight = Math.min(canvas.height * 0.5, canvas.height - maxAsteroidSize - 100);
    
    // Ensure minimum safe area
    const minSafeWidth = Math.max(100, safeAreaWidth);
    const minSafeHeight = Math.max(100, safeAreaHeight);
    
    const x = Math.random() * minSafeWidth + 50;
    const y = Math.random() * minSafeHeight + 50;
    
    const asteroid = {
      image: imageAsteroidRef.current,
      size: asteroidSize,
      x,
      y,
      scalingFactor: gameConfig.current.scalingFactor + Math.random() * 0.001,
      text,
      number,
      answers,
      line1,
      line2,
      maxSize: maxAsteroidSize // Store max size for this asteroid
    };
    return asteroid;
  }, [generateMathProblem, operation]);

  // Create initial asteroids
  const createInitialAsteroids = useCallback(() => {
    const initialAsteroids = [];
    for (let i = 0; i < 3; i++) {
      const asteroid = createAsteroid();
      if (asteroid) {
        initialAsteroids.push(asteroid);
      }
    }
    return initialAsteroids;
  }, [createAsteroid]);

  // Draw functions
  const drawAsteroid = useCallback((ctx, asteroid) => {
    if (asteroid.image && asteroid.image.complete) {
      ctx.drawImage(asteroid.image, asteroid.x, asteroid.y, asteroid.size, asteroid.size);
    }
  }, []);

  const drawAim = useCallback((ctx, closestAsteroid) => {
    if (!closestAsteroid) return;

    const aimX = closestAsteroid.x + closestAsteroid.size / 2;
    const aimY = closestAsteroid.y + closestAsteroid.size / 2;

    ctx.beginPath();
    ctx.arc(aimX, aimY, gameConfig.current.aimSize, 0, 2 * Math.PI, false);
    
    if (gameState.aimJammed) {
      ctx.fillStyle = 'rgba(200,0,0,0.25)';
      ctx.strokeStyle = 'red';
    } else {
      ctx.fillStyle = 'rgba(0,100,0,0.25)';
      ctx.strokeStyle = 'green';
    }
    
    ctx.fill();
    
    // Draw aim ticks
    ctx.lineWidth = 5;
    ctx.moveTo(aimX - 60, aimY);
    ctx.lineTo(aimX - 45, aimY);
    ctx.moveTo(aimX + 60, aimY);
    ctx.lineTo(aimX + 45, aimY);
    ctx.moveTo(aimX, aimY - 60);
    ctx.lineTo(aimX, aimY - 45);
    ctx.moveTo(aimX, aimY + 60);
    ctx.lineTo(aimX, aimY + 45);
    ctx.stroke();
    
    // Draw operation
    ctx.font = `bold ${gameConfig.current.aimSize / 2}px 'Courier New'`;
    ctx.fillStyle = gameState.aimJammed ? 'DarkRed' : 'DarkGreen';
    ctx.fillText(closestAsteroid.line1, aimX - 30, aimY);
    ctx.fillText(closestAsteroid.line2, aimX - 30, aimY + 25);
  }, [gameState.aimJammed]);

  // Game update function
  const updateGame = useCallback(() => {
    setGameState(prevState => {
      const newState = { ...prevState };
      
      // Increase speed based on score
      const speedIncrease = prevState.score * gameConfig.current.speedIncreasePerPoint;
      gameConfig.current.scalingFactor = gameConfig.current.baseSpeed + speedIncrease;

      if (!prevState.paused) {
        // Check if there are remaining lives
        if (prevState.lives <= 0) {
          // Check if current score is higher than high score
          if (prevState.score > highScore) {
            const newHighScore = prevState.score;
            setHighScore(newHighScore);
            localStorage.setItem('highScore', newHighScore);
          }
          
          newState.drawGameOver = true;
          newState.paused = true;
          return newState;
        }

        // Update asteroids
        newState.asteroids = prevState.asteroids.map(asteroid => {
          const updatedAsteroid = { ...asteroid };
          updatedAsteroid.size *= updatedAsteroid.scalingFactor;
          
                   if (updatedAsteroid.size > updatedAsteroid.maxSize) {
           // Remove asteroid and damage player
           newState.damage += 1;
           newState.shakeFrame = gameConfig.current.framesToShake;
           newState.lives -= 1;
           
                       // Play life lost sound
            playSoundEffect(300, 0.4, 'triple');
           
           return null;
         }
          
          return updatedAsteroid;
        }).filter(Boolean);

        // Create new asteroids if needed
        if (newState.asteroids.length < 3) {
          const newAsteroid = createAsteroid();
          if (newAsteroid) {
            newState.asteroids.push(newAsteroid);
            console.log('Added asteroid, total:', newState.asteroids.length);
          }
        }

        // Update shake frame
        if (newState.shakeFrame > 0) {
          newState.shakeFrame -= 1;
        }
      }

             return newState;
     });
   }, [highScore, createAsteroid, playSoundEffect]);

  // Draw function
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply shake effect
    if (gameState.shakeFrame >= 0) {
      ctx.save();
      const dx = Math.random() * 20;
      const dy = Math.random() * 20;
      ctx.translate(dx, dy);
    }

    // Draw asteroids
    gameState.asteroids.forEach(asteroid => {
      drawAsteroid(ctx, asteroid);
    });

    // Draw aim on closest asteroid
    if (gameState.asteroids.length > 0) {
      const closestAsteroid = gameState.asteroids[0];
      drawAim(ctx, closestAsteroid);
    }

    // Reset shake effect
    if (gameState.shakeFrame >= 0) {
      ctx.restore();
    }
  }, [gameState.asteroids, gameState.shakeFrame, drawAsteroid, drawAim]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      drawGame();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    if (!gameState.paused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateGame, drawGame, gameState.paused]);

  // Initialize game with asteroids when canvas is ready
  useEffect(() => {
    if (canvasRef.current && gameState.asteroids.length === 0 && !gameState.paused) {
      const initialAsteroids = createInitialAsteroids();
      if (initialAsteroids.length > 0) {
        setGameState(prev => ({
          ...prev,
          asteroids: initialAsteroids
        }));
        console.log('Initialized with', initialAsteroids.length, 'asteroids');
      }
    }
  }, [canvasRef.current, gameState.paused, createInitialAsteroids]);

  // Handle restart
  const handleRestart = useCallback(() => {
    setGameState({
      damage: 0,
      score: 0,
      paused: false,
      lives: 3,
      shakeFrame: -1,
      asteroids: [],
      answers: [],
      aimJammed: false,
      drawGameOver: false
    });
    gameConfig.current.scalingFactor = gameConfig.current.baseSpeed;
  }, []);

  // Handle canvas click/touch for game over restart
  const handleCanvasClick = useCallback(() => {
    if (gameState.drawGameOver) {
      handleRestart();
    }
  }, [gameState.drawGameOver, handleRestart]);

  // Handle settings
  const toggleSettings = useCallback(() => {
    setSettings(prev => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings(prev => {
      const newSoundEnabled = !prev.soundEnabled;
      
      // Control audio playback
      if (audioRef.current) {
        if (newSoundEnabled) {
          audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        } else {
          audioRef.current.pause();
        }
      }
      
      return { ...prev, soundEnabled: newSoundEnabled };
    });
  }, []);

  // Get current answers
  const currentAnswers = gameState.asteroids.length > 0 
    ? gameState.asteroids[0].answers 
    : [];

  return {
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
  };
};

export default useGameLogic; 