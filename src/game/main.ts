import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Success } from './scenes/Success';
import { Level1 } from './scenes/levels/Level1';
import { Level2 } from './scenes/levels/Level2';
// Import other levels here

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1250,
    height: 750,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 350 },
            debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Level1,
        Level2,
        // Add other levels here
        GameOver,
        Success
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
