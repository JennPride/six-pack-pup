import { BaseLevel } from './BaseLevel';

export class Level3 extends BaseLevel {
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    clouds: Phaser.Physics.Arcade.Group;
    cloudCoords: { x: number, y: number }[];

    constructor() {
        super('Level3');
        this.cursors = null;
        this.cloudCoords = [
            // Groups of 3 on the lower side
            { x: 300, y: 600 },
            { x: 350, y: 600 },
            { x: 400, y: 600 },
            { x: 600, y: 600 },
            { x: 650, y: 600 },
            { x: 700, y: 600 },
            { x: 900, y: 600 },
            { x: 950, y: 600 },
            { x: 1000, y: 600 },
            { x: 1200, y: 600 },
            { x: 1250, y: 600 },

            // Groups of 2 higher up
            { x: 400, y: 470 },
            { x: 450, y: 470 },
            { x: 700, y: 480 },
            { x: 750, y: 480 },
            { x: 1000, y: 430 },
            { x: 1050, y: 430 },
            { x: 1200, y: 450 },
            { x: 1250, y: 450 },

            // Single clouds high up
            { x: 500, y: 300 },
            { x: 800, y: 280 },
            { x: 1100, y: 250 },
            { x: 600, y: 200 },
            { x: 900, y: 350 },
            { x: 1300, y: 200 }
        ];
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
        

        this.setupLevel(
            {x: 100, y: 450}, // Start position
            {
                'lime': { x: 300, y: 300 },
                'sunglasses': { x: 700, y: 100 },
                'salt': { x: 1200, y: 400 }
            }
        )
        
        this.clouds = this.physics.add.group();

        this.cloudCoords.forEach((coord) => {
            const cloud = this.clouds.create(coord.x, coord.y, 'cloud');
            cloud.body.setAllowGravity(false); // Disable gravity for clouds
            cloud.setImmovable(true); // Make clouds immovable

            // Enable one-way collision: only collide from the top
            cloud.body.checkCollision.down = false;
            cloud.body.checkCollision.left = false;
            cloud.body.checkCollision.right = false;
        });

        // Enable collision between the player and the clouds
        this.physics.add.collider(this.player, this.clouds, () => {
            if (this.player?.body?.blocked.down) {
                this.canJump = true; // Allow the player to jump again after landing on a cloud
            }
        });

        this.map.setTileIndexCallback(4, () => {
            this.player?.setPosition(450, 600);
            this.reduceHearts();
        }, this, this.groundLayer);
        this.map.setTileIndexCallback(6, () => {
            this.player?.setPosition(450, 600);
            this.reduceHearts();
        }, this, this.groundLayer);


        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement();

        this.clouds.getChildren().forEach((cloud) => {
            if (cloud instanceof Phaser.Physics.Arcade.Sprite) {
                cloud.x -= 0.5; // Move clouds to the left slowly
                if (cloud.x < -100) {
                    cloud.x = 1350; // Reset cloud position when it moves out of view
                }
            }
        });

        if (this.gatheredIngredients.length === 3) {
            this.successNextScene('Level3', 'Level4', 'level3can');
        }
    }

}