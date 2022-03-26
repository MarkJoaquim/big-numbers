import { Game, Scale, Types, WEBGL } from 'phaser';

import { TrainingGround, LoadingScene, UIScene } from './scenes';
import { CharacterCreationScene } from './scenes/character-creation';

type GameConfigExtended = Types.Core.GameConfig & {
  winScore: number;
};

export const gameConfig: GameConfigExtended = {
  title: 'big-numbers',
  type: WEBGL,
  parent: 'game',
  backgroundColor: '#333',
  scale: {
    mode: Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged();
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, CharacterCreationScene, TrainingGround, UIScene],
  winScore: 40,
};

window.sizeChanged = () => {
  if (window.game.isBooted) {
    setTimeout(() => {
      window.game.scale.resize(window.innerWidth, window.innerHeight);

      window.game.canvas.setAttribute(
        'style',
        `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
      );
    }, 100);
  }
};

window.onresize = () => window.sizeChanged();

window.game = new Game(gameConfig);
