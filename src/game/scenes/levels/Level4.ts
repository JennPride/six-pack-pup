import { BaseLevel } from './BaseLevel';

export class Level4 extends BaseLevel {
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    clouds: Phaser.Physics.Arcade.Group;
    cloudCoords: { x: number, y: number }[];
    staticCloud: Phaser.Physics.Arcade.Sprite | null;

    constructor() {
        super('Level4');
        this.cursors = null;
        this.cloudCoords = [
            // Groups of 3 on the lower side
            { x: 300, y: 600 },
            { x: 600, y: 600 },
            { x: 650, y: 600 },
            { x: 700, y: 600 },
            { x: 950, y: 600 },
            { x: 1000, y: 600 },
            { x: 1200, y: 600 },
            { x: 1250, y: 600 },

            // Groups of 2 higher up
            { x: 100, y: 470 },
            { x: 150, y: 470 },
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
        this.staticCloud = null;
    }

    create() {
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level4_background').setAlpha(0.2);
        this.background.setOrigin(0, 0);

        this.setupLevel(
            { x: 100, y: 450 }, // Start position
            {
                'star': { x: 200, y: 200 },
                'pineapple': { x: 600, y: 320 },
                'grapefruit': { x: 1100, y: 100 }
            },
            false // Disable gravity for ingredients
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

        // Add a static cloud at the bottom of the screen
        this.staticCloud = this.physics.add.sprite(100, 670, 'cloud'); 
        if (this.staticCloud?.body instanceof Phaser.Physics.Arcade.Body) {
            this.staticCloud.body.setAllowGravity(false); // Disable gravity for the static cloud
            this.staticCloud.setImmovable(true); // Make the static cloud immovable
        }

        // Enable collision between the player and the static cloud
        this.physics.add.collider(this.player, this.staticCloud, () => {
            if (this.player?.body?.blocked.down) {
                this.canJump = true; // Allow the player to jump again after landing on the static cloud
            }
        });

        // Group to manage falling stars
        const fallingStars = this.physics.add.group();

        // Timer to spawn stars periodically
        this.time.addEvent({
            delay: 1000, // Spawn a star every 1 second
            loop: true,
            callback: () => {
                const x = Phaser.Math.Between(50, 1200); // Random x position within screen width
                const star = fallingStars.create(x, 0, 'fallingstar'); // Create a star at the top of the screen
                const velocity = Phaser.Math.Between(50, 200); // Random falling speed
                const scale = Phaser.Math.FloatBetween(0.5, 1); // Random scale between 0.5 and 1.5
                star.setScale(scale); // Set random scale
                star.setVelocityY(velocity); // Set falling speed
                star.body.setAllowGravity(false)
                star.setCollideWorldBounds(false); // Allow the star to fall out of bounds
            }
        });

        // Remove stars once they are out of view
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
            if (fallingStars.contains(body.gameObject)) {
                body.gameObject.destroy(); // Remove the star from the scene
            }
        });

        // Enable collision between the player and falling stars
        this.physics.add.overlap(this.player, fallingStars, (_, star) => {
            if (star instanceof Phaser.Physics.Arcade.Sprite) {
                star.destroy(); // Remove the star from the scene
            }
            this.reduceHearts(); // Reduce hearts if the player is hit by a star
        });

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

        this.handleOffScreenFall()

        if (this.gatheredIngredients.length === 3) {
            this.successNextScene('Level5', 'level4can');
        }

    }

}