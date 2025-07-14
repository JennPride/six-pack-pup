import { BaseLevel } from './BaseLevel';

export class Level1 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
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
        // Set collision between tile 1 and 2 - grass and leafpile
        this.groundLayer.setCollisionBetween(1,2)

        // Create player with physics
        this.player = this.physics.add.sprite(100, 600, 'moon1');
        this.player.setScale(1.3)

        // Setup camera to follow player
        this.setupCamera();

        this.ingredients = this.physics.add.group();
        // Create ingredients at specific positions with bounce enabled
        this.ingredients.create(300, 0, 'orange');
        this.ingredients.create(700, 0, 'pineCone');
        this.ingredients.create(1200, 0, 'leaf');
        
        // Enable bounce for all ingredients
        this.ingredients.getChildren().forEach((ingredient) => {
            if (ingredient instanceof Phaser.Physics.Arcade.Sprite) {
                ingredient.setBounce(0.4);
                ingredient.setCollideWorldBounds(true);
            }
        });

        this.setupPlayerCollision();
        this.setupPlayerAnimation();
        
        this.physics.add.collider(this.ingredients, this.groundLayer);

        // Create ingredient icons for the UI
        const ingredientIcons = [
            { key: 'orange', x: 260, y: 175 },
            { key: 'pineCone', x: 325, y: 175 },
            { key: 'leaf', x: 390, y: 175 }
        ];

        ingredientIcons.forEach((icon) => {
            // Create blacked out version (placeholder)
            const placeholder = this.add.sprite(icon.x, icon.y, icon.key);
            placeholder.setTint(0x000000);
            placeholder.setScrollFactor(0);
            placeholder.setDepth(999);
            
            if (!this.ingredientPlaceholders) {
                this.ingredientPlaceholders = {};
            }
            this.ingredientPlaceholders[icon.key] = placeholder;
        });

        // Update ingredients count when collecting items
        this.physics.add.overlap(
            this.player,
            this.ingredients,
            (_, obj2) => {
                if (obj2 instanceof Phaser.Physics.Arcade.Sprite) {
                    obj2.disableBody(true, true);
                    this.gatheredIngredients.push(obj2.texture.key);
                    this.ingredientPlaceholders[obj2.texture.key].setTint(0xffffff)
                }
            }
        );

        this.setupControls()

        // Render the gathered ingredients UI last to ensure it's on top
        this.renderGatheredIngredients()

        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement()

        if (this.gatheredIngredients.length === 3) {
            const niceText = this.add.text(625, 375, 'Nice!', {
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
            }).setOrigin(0.5).setDepth(1000).setAlpha(0)

            // Add a tween to make the text fade in with a bounce
            this.tweens.add({
                targets: niceText,
                alpha: 1,
                duration: 10000,
                ease: 'Linear'
            });
            this.time.delayedCall(5000, () => {
                this.scene.start('Level2');
            });
        }
    }
} 