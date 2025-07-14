import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.gameOverText = this.add.text(centerX, centerY, 'Game Over', {
            fontFamily: 'VT323', fontSize: 64, color: '#ffffff', 
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(centerX, centerY + 100, 'Press Enter to Restart', {
            fontFamily: 'Jersey 25', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const enterKey = this.input.keyboard?.addKey('ENTER');
        enterKey?.on('down', () => {
            this.changeScene();
        });

        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
