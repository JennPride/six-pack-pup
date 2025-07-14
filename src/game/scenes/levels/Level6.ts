import { BaseLevel } from './BaseLevel';

export class Level6 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    startPosition: { x: number, y: number };
    chaser: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super('Level6');
        this.player = null;
        this.cursors = null;
    }

    create() {
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level6_background').setAlpha(0.5);
        this.background.setOrigin(0, 0);

        this.map = this.make.tilemap({ key: 'level6_tilemap' });
        
        const levelTileset = this.map.addTilesetImage('spritemap', 'spritesheet');

        if (!levelTileset) {
            throw new Error('Failed to create level 6 tileset')
        }

        const groundLayer = this.map.createLayer('Ground Layer', levelTileset);

        if (!groundLayer) {
            throw new Error('Failed to create ground layer');
        }

        this.groundLayer = groundLayer;
        
        this.groundLayer.setCollisionBetween(0, 20)

        this.ingredients = this.physics.add.group();
        
        this.setupPlayerAnimation();
        this.startPosition = { x: 600, y: 450 };
        this.player = this.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'moon1');
        this.player.setScale(1.3)
        
        this.physics.world.setBounds(0, -1000, 1250, 1750);
      
        this.setupCamera();

        this.ingredients = this.physics.add.group();

        const ingredientPositions = [
            { x: 200, y: 100, key: 'cherries' },
            { x: 625, y: 100, key: 'honey' },
            { x: 1050, y: 100, key: 'mistletoe' }
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
            { key: 'cherries', x: 260, y: 175 },
            { key: 'honey', x: 325, y: 175 },
            { key: 'mistletoe', x: 390, y: 175 }
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
        this.player.setDrag(50, 0); 

        const fallingStars = this.physics.add.group();

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
                body.gameObject.destroy(); 
            }
        });

        // Enable collision between the player and falling stars
        this.physics.add.overlap(this.player, fallingStars, (_, star) => {
            if (star instanceof Phaser.Physics.Arcade.Sprite) {
                star.destroy(); 
            }
            this.reduceHearts();
        });

        this.renderLives()

        this.emitSceneReady()

        // Add the chaser sprite
        this.spawnChaser();

        // Add collision between the chaser and the player
        this.physics.add.collider(this.player, this.chaser, () => {
            console.log('Chaser hit the player!');
            this.reduceHearts(); // Reduce player's hearts on collision

            // Destroy the chaser and respawn it after 2 seconds
            this.chaser.destroy();
            this.time.delayedCall(2000, () => {
                this.spawnChaser();
            });
        });
    }

    spawnChaser() {
        // Spawn the chaser at a random position
        const x = Phaser.Math.Between(100, 1150); 
        const y = Phaser.Math.Between(100, 300);
        this.chaser = this.physics.add.sprite(x, y, 'madelf'); 
        this.chaser.setCollideWorldBounds(true); 

        // Re-add collision between the player and the new chaser
        this.physics.add.collider(this.player, this.chaser, () => {
            console.log('Chaser hit the player!');
            this.reduceHearts(); // Reduce player's hearts on collision

            // Destroy the chaser and respawn it after 2 seconds
            this.chaser.destroy();
            this.time.delayedCall(2000, () => {
                this.spawnChaser();
            });
        });
    }

    update() {
        this.handlePlayerMovement(true);

        // Check if the player falls below the screen
        if (this.player && this.player.y > this.physics.world.bounds.height) {
            this.reduceHearts();
            if (this.player instanceof Phaser.Physics.Arcade.Sprite) {
                this.player.setPosition(this.startPosition.x, this.startPosition.y);
                this.canJump = true;
            }
        }

        // Make the chaser follow the player
        if (this.player && this.chaser && this.chaser.body) {
            this.physics.moveToObject(this.chaser, this.player, 100); // Adjust speed as needed
        }
    }

}