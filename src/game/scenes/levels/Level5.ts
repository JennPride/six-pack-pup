import { BaseLevel } from './BaseLevel';

export class Level5 extends BaseLevel {
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    clouds: Phaser.Physics.Arcade.Group;
    cloudCoords: { x: number, y: number }[];
    scarecrows: Phaser.Physics.Arcade.Group;

    constructor() {
        super('Level5');
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
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level5_background').setAlpha(0.3);
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
        
        this.setupLevel(
            {x: 100, y: 450}, // Start position
            {
                'pumpkin': { x: 300, y: 200 },
                'vanilla': { x: 700, y: 100 },
                'cinnamon': { x: 1200, y: 400 }
            },
        )

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

    // Create a group for scarecrows
    this.scarecrows = this.physics.add.group();

    const scarecrowPositions = [
        { x: 100, y: 300 },
        { x: 400, y: 200 },
        { x: 900, y: 400 },
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
        if (this.gatheredIngredients.length === 3) {
            this.successNextScene('Level5', 'Level6', 'level5can');
        }
    }

}