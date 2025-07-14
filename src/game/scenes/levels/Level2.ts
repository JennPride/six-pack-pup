import { BaseLevel } from './BaseLevel';

export class Level2 extends BaseLevel {
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    bees: Phaser.Physics.Arcade.Group;
    angle: number;
    bee_orbits: { x: number, y: number }[];

    constructor() {
        super('Level2');
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

        this.setupLevel(
            {x: 100, y: 600}, // Start position
            {
                'magnifyingglass': { x: 300, y: 0 },
                'melon': { x: 700, y: 0 },
                'pear': { x: 1100, y: 0 }
            },
            true // Enable gravity for ingredients
        )

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

        if (this.gatheredIngredients.length === 3) {
            this.successNextScene('Level3', 'level2can');
        }
    }

} 