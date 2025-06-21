import { EventBus } from '../../EventBus';

export abstract class BaseLevel extends Phaser.Scene {
    protected player: Phaser.Physics.Arcade.Sprite | null;
    protected cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    protected canJump: boolean;
    protected groundLayer: Phaser.Tilemaps.TilemapLayer;
    protected hearts: number;
    protected gatheredIngredients: string[]
    protected ingredientPlaceholders: Phaser.GameObjects.Sprite[]

    constructor(sceneKey: string) {
        super(sceneKey);
        this.player = null;
        this.cursors = null;
        this.canJump = false;
        this.hearts = 3;
        this.gatheredIngredients = [];
        this.ingredientPlaceholders = [];
    }

    protected renderGatheredIngredients() {
        const backgroundRect = this.add.rectangle(10, 10, 200, 80, 0xffffff, 0.8).setOrigin(0, 0)
        backgroundRect.setScrollFactor(0); 
        backgroundRect.setDepth(999);
        backgroundRect.setStrokeStyle(2, 0x000000);       
    }

    protected reduceHearts() {
        if (this.hearts > 0) {
            this.hearts--;
            
            if (this.player) {
                this.tweens.add({
                    targets: this.player,
                    tint: 0xff0000,
                    duration: 300,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        if (this.player) {
                            this.player.clearTint();
                        }
                    }
                });
            }
        }
        if (this.hearts === 0) {
            this.scene.start('GameOver');
        }
    }

    protected handlePlayerMovement() {
        if (!this.player || !this.cursors) return;

        // Handle movement left right
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-180);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(180);
        } else {
            this.player.setVelocityX(0);
        }

        // Handle jumping
        if (this.cursors.up.isDown && this.canJump) {
            this.canJump = false;
            this.player.setVelocityY(-330);
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

    protected setupControls() {
        this.cursors = this.input.keyboard?.createCursorKeys() || null;
    }

    protected emitSceneReady() {
        EventBus.emit('current-scene-ready', this);
    }
} 