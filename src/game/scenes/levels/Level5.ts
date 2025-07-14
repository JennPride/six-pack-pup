import { BaseLevel } from './BaseLevel';

export class Level5 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    clouds: Phaser.Physics.Arcade.Group;
    cloudCoords: { x: number, y: number }[];

    constructor() {
        super('Level5');
        this.player = null;
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
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level5_background').setAlpha(0.2);
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
        
        this.groundLayer.setCollisionBetween(5,5)


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
            { x: 300, y: 300, key: 'lime' },
            { x: 700, y: 100, key: 'sunglasses' },
            { x: 1200, y: 400, key: 'salt' }
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
            { key: 'lime', x: 260, y: 175 },
            { key: 'sunglasses', x: 325, y: 175 },
            { key: 'salt', x: 390, y: 175 }
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

        this.physics.add.overlap(this.player, this.groundLayer, (player, tile) => {
            if (tile instanceof Phaser.Tilemaps.Tile && (tile.index === 4 || tile.index === 6)) {
                this.reduceHearts();
                if (player instanceof Phaser.Physics.Arcade.Sprite) {
                    player.setPosition(500, 450)
                }   
            }
        });

        this.setupControls()
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
    }

}