import { BaseLevel } from './BaseLevel';

export class Level2 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    bees: Phaser.Physics.Arcade.Group;
    angle: number;
    bee_orbits: { x: number, y: number }[];

    constructor() {
        super('Level2');
        this.player = null;
        this.cursors = null;
        this.angle = 0;
        this.bee_orbits = [
            {
                x: 200,
                y: 200,
            },
            {
                x: 700,
                y: 600,
            },
            {
                x: 600,
                y: 200,
            }
        ]
    }

    create() {
        this.cameras.main.setBackgroundColor('#67dae0');
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level2_background').setAlpha(0.2);
        this.background.setOrigin(0, 0);

        this.map = this.make.tilemap({ key: 'level2_tilemap' });
        
        const levelTileset = this.map.addTilesetImage('spritemap', 'spritesheet');

        if (!levelTileset) {
            throw new Error('Failed to create level 2 tileset')
        }

        const groundLayer = this.map.createLayer('Ground Layer', levelTileset);

        if (!groundLayer) {
            throw new Error('Failed to create ground layer');
        }

        this.groundLayer = groundLayer;
        
        this.groundLayer.setCollisionBetween(0, 10)

        // Create player with physics
        this.player = this.physics.add.sprite(100, 600, 'moon1');
        this.player.setScale(1.3)

        // Setup camera to follow player
        this.setupCamera();

        this.ingredients = this.physics.add.group();

        this.ingredients.create(300, 0, 'magnifyingglass');
        this.ingredients.create(700, 0, 'melon');
        this.ingredients.create(1100, 0, 'pear');

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
            { key: 'magnifyingglass', x: 260, y: 175 },
            { key: 'melon', x: 325, y: 175 },
            { key: 'pear', x: 390, y: 175 }
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

        // Create bees
        this.anims.create({
            key: 'bee_flap',
            frames: [
                {
                    key: 'bee1',
                },
                {
                    key: 'bee2',
                }
            ],
            frameRate: 15,
            repeat: -1,
        })

        this.bees = this.physics.add.group()
        
        this.bee_orbits.forEach((orbit) => {
            this.bees.create(orbit.x, orbit.y, 'bee1')
        })

        this.bees.getChildren().forEach((bee) => {
            if (bee instanceof Phaser.Physics.Arcade.Sprite) {
                bee.setCollideWorldBounds(false);
                bee.setGravity(0, -1000)
                bee.setRotation(-.8);
                bee.play('bee_flap');
            }
        });

        this.physics.add.overlap(
            this.player,
            this.bees,
            (player, bee) => {
                if (bee instanceof Phaser.Physics.Arcade.Sprite && player instanceof Phaser.Physics.Arcade.Sprite) {
                    this.reduceHearts();
                    
                    // Temporarily disable the bee to prevent multiple collisions
                    bee.disableBody(true, false);
                    
                    // Re-enable the bee after 2 seconds
                    this.time.delayedCall(2000, () => {
                        bee.enableBody(true, bee.x, bee.y, true, true);
                    });
                    
                }
            }
        );

        this.setupControls()

        // Render the gathered ingredients UI last to ensure it's on top
        this.renderGatheredIngredients()

        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement();
        this.angle += .05;
        this.bees.getChildren().forEach((bee, index) => {
            if (bee instanceof Phaser.Physics.Arcade.Sprite) {
                const orbit = this.bee_orbits[index];
                const radius = 100;
    
                const newX = orbit.x + radius * Math.cos(this.angle);
                const newY = orbit.y + radius * Math.sin(this.angle);

                bee.setPosition(newX, newY);

            }
        });
    }

} 