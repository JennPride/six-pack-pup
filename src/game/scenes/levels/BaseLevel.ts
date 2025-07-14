import { EventBus } from '../../EventBus';

export abstract class BaseLevel extends Phaser.Scene {
    protected player: Phaser.Physics.Arcade.Sprite | null;
    protected cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    protected canJump: boolean;
    protected groundLayer: Phaser.Tilemaps.TilemapLayer;
    protected hearts: number;
    protected gatheredIngredients: string[]
    protected ingredientPlaceholders: { [key: string]: Phaser.GameObjects.Sprite }

    constructor(sceneKey: string) {
        super(sceneKey);
        this.player = null;
        this.cursors = null;
        this.canJump = false;
        this.hearts = 3;
        this.gatheredIngredients = [];
        this.ingredientPlaceholders = {};
    }

    protected renderGatheredIngredients() {
        const backgroundRect = this.add.rectangle(325, 175, 200, 75, 0xffffff, 1.0).setAlpha(0.5)
        backgroundRect.setScrollFactor(0);
        backgroundRect.setRounded(5);
        backgroundRect.setStrokeStyle(2, 0x000000);

    }

    protected reduceHearts() {
        if (this.hearts > 0) {
            this.hearts--;
            
            if (this.player) {
                this.player.setTintFill(0xff0000); // Make player solid red
                this.time.delayedCall(500, () => {
                    if (this.player) {
                        this.player.clearTint(); // Revert to normal
                    }
                });
            }
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

    protected handlePlayerMovement() {
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
            this.player.setVelocityX(0);
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
} 