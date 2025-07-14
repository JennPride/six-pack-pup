import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Success } from './scenes/Success';
import { Level1 } from './scenes/levels/Level1';
import { Level2 } from './scenes/levels/Level2';
import { Level3 } from './scenes/levels/Level3';
import { Level4 } from './scenes/levels/Level4';
import { Level5 } from './scenes/levels/Level5';
import { Level6 } from './scenes/levels/Level6';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1250,
    height: 750,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1000 },
        }
    },
    scale: {
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Level1,
        Level2,
        Level3,
        Level4,
        Level5,
        Level6,
        GameOver,
        Success
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
