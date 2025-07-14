import { BaseLevel } from './BaseLevel';

export class Level5 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    clouds: Phaser.Physics.Arcade.Group;
    cloudCoords: { x: number, y: number }[];
    scarecrows: Phaser.Physics.Arcade.Group;

    constructor() {
        super('Level5');
        this.player = null;
        this.cursors = null;
        this.cloudCoords = [
            // Grouped clouds
            { x: 200, y: 600 },
            { x: 250, y: 600 },

            // Scattered clouds
            { x: 400, y: 500 },
            { x: 600, y: 400 },
            { x: 550, y: 200 },
            { x: 1100, y: 500},

            // Another group of clouds
            { x: 800, y: 300 },
            { x: 850, y: 300 },
            { x: 900, y: 300 },

            // Scattered higher clouds
            { x: 1000, y: 300 },
            { x: 1200, y: 200 }
        ];
    }

    create() {
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level5_background').setAlpha(0.5);
        this.background.setOrigin(0, 0);

        this.map = this.make.tilemap({ key: 'level5_tilemap' });
        
        const levelTileset = this.map.addTilesetImage('spritemap', 'spritesheet');

        if (!levelTileset) {
            throw new Error('Failed to create level 5 tileset')
        }

        const groundLayer = this.map.createLayer('Ground Layer', levelTileset);

        if (!groundLayer) {
            throw new Error('Failed to create ground layer');
        }

        this.groundLayer = groundLayer;
        
        this.groundLayer.setCollisionBetween(0,20)

        this.ingredients = this.physics.add.group();
        

        this.setupPlayerAnimation();
        this.player = this.physics.add.sprite(100, 450, 'moon1');
        this.player.setScale(1.3)
        
        this.physics.world.setBounds(0, -1000, 1250, 1750);
        this.player.setCollideWorldBounds(true);
      
        this.setupCamera();
        this.player.setPosition(100, 450);

        this.ingredients = this.physics.add.group();
        // Create ingredients at specific positions with bounce enabled
        const ingredientPositions = [
            { x: 300, y: 200, key: 'pumpkin' },
            { x: 700, y: 100, key: 'vanilla' },
            { x: 1200, y: 400, key: 'cinnamon' }
        ];

        ingredientPositions.forEach((pos) => {
            const ingredient = this.ingredients.create(pos.x, pos.y, pos.key);
            ingredient.body.setAllowGravity(false); // Disable gravity for floating ingredients

            // Add a tween to make the ingredient float up and down
            this.tweens.add({
                targets: ingredient,
                y: pos.y - 20, // Move up by 20 pixels
                duration: 1000, // Duration of the tween
                yoyo: true, // Reverse the tween to move back down
                repeat: -1, // Repeat indefinitely
                ease: 'Sine.easeInOut' // Smooth easing for the floating effect
            });

        });

        const ingredientIcons = [
            { key: 'pumpkin', x: 260, y: 175 },
            { key: 'vanilla', x: 325, y: 175 },
            { key: 'cinnamon', x: 390, y: 175 }
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

        this.setupPlayerCollision()

        this.setupControls()
        this.clouds = this.physics.add.group();

        this.cloudCoords.forEach((coord) => {
            const cloud = this.clouds.create(coord.x, coord.y, 'darkcloud');
            cloud.body.setAllowGravity(false); // Disable gravity for clouds
            cloud.setImmovable(true); // Make clouds immovable

            // Enable one-way collision: only collide from the top
            cloud.body.checkCollision.down = false;
            cloud.body.checkCollision.left = false;
            cloud.body.checkCollision.right = false;
        });

        // Enable collision between the player and the clouds
        this.physics.add.collider(this.player, this.clouds, (player, cloud) => {
            if (cloud instanceof Phaser.Physics.Arcade.Sprite) {
                // Make the cloud slowly disappear
                this.tweens.add({
                    targets: cloud,
                    alpha: 0, // Fully transparent
                    duration: 1100, // Duration of fade-out
                    onComplete: () => {
                        // Disable collision when the cloud disappears
                        cloud.body.checkCollision.none = true;

                        // Reappear the cloud after a delay
                        this.time.delayedCall(2000, () => {
                            this.tweens.add({
                                targets: cloud,
                                alpha: 1, // Fully visible
                                duration: 300, // Duration of fade-in
                                onComplete: () => {
                                    // Re-enable collision when the cloud reappears
                                    cloud.body.checkCollision.none = false;
                                }
                            });
                        });
                    }
                });
            }

            if (this.player?.body?.blocked.down) {
                this.canJump = true; // Allow the player to jump again after landing on a cloud
            }
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

        // Render the gathered ingredients UI last to ensure it's on top
        this.renderGatheredIngredients()

    // Create a group for scarecrows
    this.scarecrows = this.physics.add.group();

    const scarecrowPositions = [
        { x: 100, y: 300 },
        { x: 600, y: 200 },
        { x: 900, y: 400 },
        { x: 500, y: 600 }
    ];

    scarecrowPositions.forEach((pos) => {
        const scarecrow = this.scarecrows.create(pos.x, pos.y, 'scarecrow');
        scarecrow.setCollideWorldBounds(true);
        scarecrow.setImmovable(true);
        scarecrow.body.setAllowGravity(false);

        // Horizontal float tween (left to right)
        this.tweens.add({
            targets: scarecrow,
            x: pos.x + 200,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Optional vertical bounce
        this.tweens.add({
            targets: scarecrow,
            y: pos.y + 20,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    });

    this.physics.add.collider(this.player, this.scarecrows, () => {
        this.player?.setPosition(100, 450);
        this.reduceHearts(); 
    });



    this.map.setTileIndexCallback(12, () => {
        this.player?.setPosition(100, 450);
        this.reduceHearts();
    }, this, this.groundLayer);

    this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement();
    }

}