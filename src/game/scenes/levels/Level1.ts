import { BaseLevel } from './BaseLevel';

export class Level1 extends BaseLevel {
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;


    constructor() {
        super('Level1');
        this.player = null;
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
            {x: 600, y: 450}, // Start position
            {
                'orange': { x: 300, y: 0 },
                'pineCone': { x: 700, y: 0 },
                'leaf': { x: 1200, y: 0 }
            },
            true // Enable graviry for ingredients
        )
        // Set collision between tile 1 and 2 - grass and leafpile
        // this.groundLayer.setCollisionBetween(1,2)

        // Create player with physics
        // this.player = this.physics.add.sprite(100, 600, 'moon1');
        // this.player.setScale(1.3)

        // Setup camera to follow player
        // this.setupCamera();

        // this.ingredients = this.physics.add.group();
        // // Create ingredients at specific positions with bounce enabled
        // this.ingredients.create(300, 0, 'orange');
        // this.ingredients.create(700, 0, 'pineCone');
        // this.ingredients.create(1200, 0, 'leaf');
        
        // Enable bounce for all ingredients
        // this.ingredients.getChildren().forEach((ingredient) => {
        //     if (ingredient instanceof Phaser.Physics.Arcade.Sprite) {
        //         ingredient.setBounce(0.4);
        //         ingredient.setCollideWorldBounds(true);
        //     }
        // });

        // this.setupPlayerCollision();
        // this.setupPlayerAnimation();
        
        // this.physics.add.collider(this.ingredients, this.groundLayer);

        // // Create ingredient icons for the UI
        // const ingredientIcons = [
        //     { key: 'orange', x: 260, y: 175 },
        //     { key: 'pineCone', x: 325, y: 175 },
        //     { key: 'leaf', x: 390, y: 175 }
        // ];

        // ingredientIcons.forEach((icon) => {
        //     // Create blacked out version (placeholder)
        //     const placeholder = this.add.sprite(icon.x, icon.y, icon.key);
        //     placeholder.setTint(0x000000);
        //     placeholder.setScrollFactor(0);
        //     placeholder.setDepth(999);
            
        //     if (!this.ingredientPlaceholders) {
        //         this.ingredientPlaceholders = {};
        //     }
        //     this.ingredientPlaceholders[icon.key] = placeholder;
        // });

        // Update ingredients count when collecting items
        // this.physics.add.overlap(
        //     this.player,
        //     this.ingredients,
        //     (_, obj2) => {
        //         if (obj2 instanceof Phaser.Physics.Arcade.Sprite) {
        //             obj2.disableBody(true, true);
        //             this.gatheredIngredients.push(obj2.texture.key);
        //             this.ingredientPlaceholders[obj2.texture.key].setTint(0xffffff)
        //         }
        //     }
        // );

        // this.setupControls()

        // this.renderGatheredIngredients()

        // this.renderLives()

        // this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement()

        if (this.gatheredIngredients.length === 0) {
            this.successNextScene('Level2', 'level1can');
        }
    }
} 