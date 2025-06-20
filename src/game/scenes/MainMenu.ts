import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    title: GameObjects.Text;
    startText: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        this.startText = this.add.text(625, 500, 'Play Game', {
            fontFamily: 'Knewave',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
            padding: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100
            }
        }).setOrigin(0.5).setDepth(100).setInteractive();

        // Add click handler
        this.startText.on('pointerdown', () => {
            this.changeScene();
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Level1'); 
    }

}
