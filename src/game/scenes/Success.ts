import { EventBus } from '../EventBus';
import { speedrunTimer } from '../timer';

export class Success extends Phaser.Scene {
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super('Success');
    }

    create() {
        this.camera = this.cameras.main

        const screenWidth = this.cameras.main.width;

        const centerX = screenWidth / 2;

        const spacing = screenWidth / 6;

        for (let i = 0; i < 6; i++) {
            const x = spacing * i + spacing / 2;
            const y = 100;
            const img = this.add.image(x, y, `level${i+1}can`).setOrigin(0.5).setScale(0.2);

            // Wobble animation: angle left and right
            this.tweens.add({
                targets: img,
                angle: { from: -15, to: 15 },
                duration: 600,
                yoyo: true,
                repeat: -1,
                delay: i * 100, // stagger for a fun effect
                ease: 'Sine.easeInOut'
            });
        }


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

        this.add.text(centerX, 550, 
            "Time: " + speedrunTimer.getFormatted(), 
            {
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.anims.create({
            key: 'moon_happy',
            frames: [
                { key: 'moonhappy1' },
                { key: 'moonhappy' },
                { key: 'moonhappy1' },
                { key: 'moonhappy2' },
            ],
            frameRate: 10,
            repeat: -1
        });


        const moon = this.add.sprite(100, 600, 'moonhappy1').setOrigin(0.5).setScale(3)
        moon.play('moon_happy');
        // Add a button to return to main menu
        const menuButton = this.add.text(centerX, 670, 'Return to Main Menu', {
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