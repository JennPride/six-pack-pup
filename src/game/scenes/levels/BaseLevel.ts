import { EventBus } from '../../EventBus';

export abstract class BaseLevel extends Phaser.Scene {
    protected player: Phaser.Physics.Arcade.Sprite | null;
    protected cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    protected canJump: boolean;
    protected groundLayer: Phaser.Tilemaps.TilemapLayer;

    constructor(sceneKey: string) {
        super(sceneKey);
        this.player = null;
        this.cursors = null;
        this.canJump = false;
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