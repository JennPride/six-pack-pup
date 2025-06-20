import { EventBus } from '../../EventBus';

export class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    create() {
        // Add your level 2 game objects and logic here
        this.add.text(400, 300, 'Level 2', { fontSize: '32px', color: '#fff' });

        // Emit event to let React know this scene is ready
        EventBus.emit('current-scene-ready', this);
    }

    update() {
        // Add your level 2 update logic here
    }
} 