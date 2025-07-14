import { BaseLevel } from './BaseLevel';

export class Level3 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;

    constructor() {
        super('Level3');
        this.player = null;
        this.cursors = null;
    }

    create() {
        this.cameras.main.setBackgroundColor('#67dae0');
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level3_background').setAlpha(0.2);
        this.background.setOrigin(0, 0);

        this.map = this.make.tilemap({ key: 'level3_tilemap' });
        
        const levelTileset = this.map.addTilesetImage('spritemap', 'spritesheet');

        if (!levelTileset) {
            throw new Error('Failed to create level 3 tileset')
        }

        const groundLayer = this.map.createLayer('Ground Layer', levelTileset);

        if (!groundLayer) {
            throw new Error('Failed to create ground layer');
        }

        this.groundLayer = groundLayer;
        
        this.groundLayer.setCollisionBetween(5,5)


        this.ingredients = this.physics.add.group();
        

        this.setupPlayerAnimation();
        this.player = this.physics.add.sprite(100, 450, 'moon1');
        this.player.setScale(1.3)
        
        this.physics.world.setBounds(0, -1000, 1250, 1750);
        this.player.setCollideWorldBounds(true);
      
        this.setupCamera();
        this.player.setPosition(100, 450);

        this.setupPlayerCollision()

        this.physics.add.overlap(this.player, this.groundLayer, (_, tile) => {
            if (tile instanceof Phaser.Tilemaps.Tile && (tile.index === 4 || tile.index === 6)) {
                this.reduceHearts();
            }
        });

        this.setupControls()

        // Render the gathered ingredients UI last to ensure it's on top
        this.renderGatheredIngredients()

        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement();
    }

} 