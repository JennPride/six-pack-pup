import { GameObjects, Scene } from 'phaser';
import { speedrunTimer } from '../timer';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    title: GameObjects.Text;
    description: GameObjects.Text;
    startText: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        this.title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, 'Six Pack Pup', {
            fontSize: '150px',
            fontFamily: 'VT323',
            align: 'center',
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        }).setOrigin(0.5).setDepth(100);

        this.description = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 
            'Help Moon collect all the ingredients needed for \n a perfect Troegs six pack!'
        , {
            fontSize: '50px',
            fontFamily: 'VT323',
            align: 'center',
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        }).setOrigin(0.5).setDepth(100);
        
        this.startText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Play Game', {
            fontSize: '100px',
            fontFamily: 'VT323',
            align: 'center',
            padding: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100
            }
        }).setOrigin(0.5).setDepth(100).setInteractive();

        this.anims.create({
            key: 'moon_wait',
            frames: [
                { key: 'moon1' },
                { key: 'moonwag1'},
                { key: 'moonwag2'},
                { key: 'moonwag1'}
            ],
            frameRate: 10,
            repeat: -1
        })


        const moon = this.add.sprite(150, 600, 'moon1').setOrigin(0.5).setScale(3)
        moon.play('moon_wait');

        // Add hover effect
        this.startText.on('pointerover', () => {
            this.startText.setStyle({ color: '#ffcc00' }); // Change text color on hover
        });

        this.startText.on('pointerout', () => {
            this.startText.setStyle({ color: '#ffffff' }); // Revert text color when not hovering
        });

        // Add click handler
        this.startText.on('pointerdown', () => {
            this.changeScene();
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        speedrunTimer.reset(); // Reset the timer when starting a new game
        this.scene.start('Level1'); 
    }

}
