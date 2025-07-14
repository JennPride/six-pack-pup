import { EventBus } from '../../EventBus';

export abstract class BaseLevel extends Phaser.Scene {
    protected player: Phaser.Physics.Arcade.Sprite | null;
    protected cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    protected canJump: boolean;
    protected groundLayer: Phaser.Tilemaps.TilemapLayer;
    protected hearts: number;
    protected ingredients: Phaser.Physics.Arcade.Group;
    protected gatheredIngredients: string[]
    protected ingredientPlaceholders: { [key: string]: Phaser.GameObjects.Sprite }
    protected canGetHurt: boolean;
    protected transitioningLevel: boolean;

    constructor(sceneKey: string) {
        super(sceneKey);
        this.player = null;
        this.cursors = null;
        this.canJump = false;
        this.hearts = 3;
        this.gatheredIngredients = [];
        this.ingredientPlaceholders = {};
        this.canGetHurt = true;
        this.transitioningLevel = false
    }

    protected renderLives() {
        const heartSpacing = 10;
        const startX = 950;
        let heartCount = this.hearts;
        for (let i = 0; i < 3; i++) {
            const heartX = startX + (i * (32 + heartSpacing));
            const heartY = 150;
            if (i < heartCount) {
                this.add.image(heartX, heartY, 'fullheart').setScrollFactor(0);
            } else {
                this.add.image(heartX, heartY, 'emptyheart').setScrollFactor(0);
            }
        }
    }

    protected renderGatheredIngredients() {
        const backgroundRect = this.add.rectangle(325, 175, 200, 75, 0xffffff, 1.0).setAlpha(0.5)
        backgroundRect.setScrollFactor(0);
        backgroundRect.setRounded(5);
        backgroundRect.setStrokeStyle(2, 0x000000);

    }

    protected reduceHearts() {
        if (!this.canGetHurt) return;
        if (this.hearts > 0) {
            this.canGetHurt = false;
            this.time.delayedCall(100, () => {
                this.hearts--;
                
                if (this.player) {
                    this.player.setTintFill(0xff0000); // Make player solid red
                    this.time.delayedCall(500, () => {
                        if (this.player) {
                            this.player.clearTint(); // Revert to normal
                        }
                    });
                }
                this.renderLives();
                this.canGetHurt = true;
            })
        }
        if (this.hearts === 0) {
            this.scene.start('GameOver');
        }
    }

    protected setupPlayerAnimation() {
        this.anims.create({
            key: 'moon_walk',
            frames: [
                { key: 'moon1' },
                { key: 'moon2' },
                { key: 'moon3' },
                { key: 'moon4' },
                { key: 'moon5' },
                { key: 'moon6' },
                { key: 'moon7' }
            ],
            frameRate: 10,
            repeat: -1
        });
    }

    protected handlePlayerMovement(slippery=false) {
        if (!this.player || !this.cursors) return;

        // Handle movement left right
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
            if (this.canJump) {
                this.player.play('moon_walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
            if (this.canJump) {
                this.player.play('moon_walk', true);
            }
        } else {
            if (!slippery) {
                this.player.setVelocityX(0);
            }
            this.player.setTexture('moon1');
            this.player.anims.stop();
        }

        // Handle jumping
        if (this.cursors.up.isDown && this.canJump) {
            this.canJump = false;
            this.player.setVelocityY(-500);
            this.player.setTexture('moon6');
            this.player.anims.stop();
            
        }
    }

    protected setupPlayerCollision() {
        if (!this.player || !this.groundLayer) return;

        this.physics.add.collider(this.player, this.groundLayer, (player, _) => {
            if (player instanceof Phaser.Physics.Arcade.Sprite) {
                if (player?.body?.blocked.down) {
                    this.time.delayedCall(100, () => {
                        this.canJump = true;
                    });
                }
            }
        });
    }

    protected setupCamera() {
        if (!this.player) return;
        
        // Set camera to follow the player
        this.cameras.main.startFollow(this.player, true);
        
        // Set camera bounds to the world size (1250 x 750)
        this.cameras.main.setBounds(0, 0, 1250, 750);

        this.cameras.main.setZoom(1.4)
    }

    protected setupControls() {
        this.cursors = this.input.keyboard?.createCursorKeys() || null;
    }

    protected emitSceneReady() {
        EventBus.emit('current-scene-ready', this);
    }

    protected successNextScene(
        nextSceen: string,
        imgLabel: string,
    ) {
        if (this.transitioningLevel) return;
        this.transitioningLevel = true;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const can = this.add.image(centerX, -500, imgLabel).setOrigin(0.5, 0.5);
        can.setScrollFactor(0); // Ensure the image doesn't scroll with the camera 
        can.setScale(.7)

        // Bounce it up into view
        this.tweens.add({
            targets: can,
            y: centerY, // Final y position on screen
            ease: 'Bounce.easeOut', // Makes it bounce
            duration: 3000, // Time in ms
            delay: 200, // Optional: small delay before animation starts
        });

        this.time.delayedCall(5000, () => {
            can.destroy(); // Remove the image after the animation
            this.transitioningLevel = false;
            this.scene.start(nextSceen);
        });
    }

    protected setupLevel(
        startingLocation: { x: number, y: number } = { x: 100, y: 600 },
        ingredients: {
            [key: string]: { x: number, y: number }
        },
        gravityForIngredients: boolean = false
    ) {
        this.groundLayer.setCollisionBetween(0,20)
        this.player = this.physics.add.sprite(startingLocation.x, startingLocation.y, 'moon1');
        this.player.setScale(1.3);

        this.ingredients = this.physics.add.group();
        for (const [key, pos] of Object.entries(ingredients)) {
            const ingredient = this.ingredients.create(pos.x, pos.y, key);
            ingredient.body.setAllowGravity(gravityForIngredients);
            if (!gravityForIngredients) {
                this.tweens.add({
                    targets: ingredient,
                    y: pos.y - 20, // Move up by 20 pixels
                    duration: 1000, // Duration of the tween
                    yoyo: true, // Reverse the tween to move back down
                    repeat: -1 // Repeat indefinitely
                });
            } else {
                this.physics.add.collider(this.ingredients, this.groundLayer);
            }
        }
        
        const ingredientKeys = Object.keys(ingredients);

        const ingredientIcons = [
            { key: ingredientKeys[0], x: 260, y: 175 },
            { key: ingredientKeys[1], x: 325, y: 175 },
            { key: ingredientKeys[2], x: 390, y: 175 }
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

        this.setupCamera()
        this.setupPlayerCollision();
        this.setupPlayerAnimation();
        this.setupControls()
        this.renderGatheredIngredients()
        this.renderLives()

    }
} 