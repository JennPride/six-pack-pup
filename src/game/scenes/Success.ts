import { EventBus } from '../EventBus';

export class Success extends Phaser.Scene {
    constructor() {
        super('Success');
    }

    create() {
        // Add success screen elements
        this.add.text(400, 300, 'Congratulations!\nYou completed all levels!', {
            fontSize: '32px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Add a button to return to main menu
        const menuButton = this.add.text(400, 400, 'Return to Menu', {
            fontSize: '24px',
            color: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Emit event to let React know this scene is ready
        EventBus.emit('current-scene-ready', this);
    }
} 