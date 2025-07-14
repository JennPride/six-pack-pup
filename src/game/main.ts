import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Success } from './scenes/Success';
import { Level1 } from './scenes/levels/Level1';
import { Level2 } from './scenes/levels/Level2';
import { Level3 } from './scenes/levels/Level3';

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
            debug: true
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
        // Add other levels here
        GameOver,
        Success
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
