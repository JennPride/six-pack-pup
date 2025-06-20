import { EventBus } from '../../EventBus';
import { BaseLevel } from './BaseLevel';

export class Level1 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    gatheredIngredients: string[];


    constructor() {
        super('Level1');
        this.player = null;
        this.cursors = null;
        this.canJump = false;
        this.gatheredIngredients = [];
    }

    create() {

        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level1_background');
        this.background.setOrigin(0, 0);
        
        this.map = this.make.tilemap({ key: 'level1_tilemap' });
        
        const levelTileset = this.map.addTilesetImage('Level1Tileset', 'level1_tileset');

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
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.physics.world.setBounds(0, -1000, 1250, 1750);
        this.player.setCollideWorldBounds(true);
        this.player.setPosition(100, 450);

        this.ingredients = this.physics.add.group();
        // Create ingredients at specific positions with bounce enabled
        this.ingredients.create(300, 0, 'orange');
        this.ingredients.create(900, 0, 'pineCone');
        this.ingredients.create(1200, 0, 'leaf');
        
        // Enable bounce for all ingredients
        this.ingredients.getChildren().forEach((ingredient) => {
            if (ingredient instanceof Phaser.Physics.Arcade.Sprite) {
                ingredient.setBounce(0.4);
                ingredient.setCollideWorldBounds(true);
            }
        });

        this.setupPlayerCollision()
        
        this.physics.add.collider(this.ingredients, this.groundLayer);
        

        // Create text to display ingredients
        const ingredientsText = this.add.text(25, 50, `Ingredients: ${this.gatheredIngredients.length}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        ingredientsText.setScrollFactor(0); // Keep text fixed on screen
        ingredientsText.setDepth(1000); // Set high depth to appear above everything
        


        // Update ingredients count when collecting items
        this.physics.add.overlap(
            this.player,
            this.ingredients,
            (_, obj2) => {
                if (obj2 instanceof Phaser.Physics.Arcade.Sprite) {
                    obj2.disableBody(true, true);
                    this.gatheredIngredients.push(obj2.texture.key);
                    ingredientsText.setText(`Ingredients: ${this.gatheredIngredients.length}`);
                }
            }
        );

        this.setupControls()

        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement()

        if (this.gatheredIngredients.length === 0) {
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