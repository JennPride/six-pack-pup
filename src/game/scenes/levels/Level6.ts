import { BaseLevel } from './BaseLevel';

export class Level6 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;

    constructor() {
        super('Level6');
        this.player = null;
        this.cursors = null;
    }

    create() {
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level6_background').setAlpha(0.2);
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
    }

}