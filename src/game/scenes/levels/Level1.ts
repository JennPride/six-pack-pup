import { BaseLevel } from './BaseLevel';

export class Level1 extends BaseLevel {
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;


    constructor() {
        super('Level1');
        this.cursors = null;
        this.canJump = false;
    }

    create() {

        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level1_background');
        this.background.setOrigin(0, 0);
        
        this.map = this.make.tilemap({ key: 'level1_tilemap' });
        
        const levelTileset = this.map.addTilesetImage('spritesheet', 'spritesheet');

        if (!levelTileset) {
            throw new Error('Failed to create level 1 tileset')
        }

        const groundLayer = this.map.createLayer('Ground Layer', levelTileset);

        if (!groundLayer) {
            throw new Error('Failed to create ground layer');
        }

        this.groundLayer = groundLayer;

        this.setupLevel(
            {x: 100, y: 450}, // Start position
            {
                'orange': { x: 300, y: 0 },
                'pineCone': { x: 700, y: 0 },
                'leaf': { x: 1200, y: 0 }
            },
            true // Enable graviry for ingredients
        )

        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement()

        if (this.gatheredIngredients.length === 3) {
            this.successNextScene('Level2', 'level1can');
        }
    }
} 