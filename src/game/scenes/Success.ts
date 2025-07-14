import { EventBus } from '../EventBus';

export class Success extends Phaser.Scene {
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super('Success');
    }

    create() {
        this.camera = this.cameras.main

        const centerX = this.cameras.main.width / 2;
        // Add success screen elements
        this.add.text(centerX, 300, 'Congratulations!', {
            fontFamily: 'VT323',
            fontSize: '100px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, 450, "You and Moon have completed the\nperfect six pack!", {
            fontFamily: 'VT323',
            fontSize: '60px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Add a button to return to main menu
        const menuButton = this.add.text(centerX, 600, 'Return to Main Menu', {
            fontFamily: 'VT323',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#000',
        }).setOrigin(0.5).setInteractive();

        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });


        menuButton.on('pointerover', () => {
            menuButton.setStyle({ color: '#ffcc00' }); // Change text color on hover
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ color: '#ffffff' }); // Revert text color when not hovering
        });

        // Emit event to let React know this scene is ready
        EventBus.emit('current-scene-ready', this);
    }
} 