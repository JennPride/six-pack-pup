import { BaseLevel } from './BaseLevel';

const SPEED = 300;
const ANG_SPEED = 90;

export class Level2 extends BaseLevel {
    ingredients: Phaser.Physics.Arcade.Group;
    background: Phaser.GameObjects.TileSprite;
    map: Phaser.Tilemaps.Tilemap;
    gatheredIngredients: string[];
    bees: Phaser.Physics.Arcade.Group;

    constructor() {
        super('Level2');
        this.player = null;
        this.cursors = null;
        this.gatheredIngredients = [];
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFF');
        this.background = this.add.tileSprite(0, -200, 1250, 1250, 'level2_background').setAlpha(0.7);
        this.background.setOrigin(0, 0);

        this.player = this.physics.add.sprite(100, 450, 'player');
        this.physics.world.setBounds(0, -1000, 1250, 1750);
        this.player.setCollideWorldBounds(true);
        this.player.setPosition(100, 450);

        this.bees = this.physics.add.group()

        this.bees.create(200, 200, 'orange')

        this.bees.getChildren().forEach((bee) => {
            if (bee instanceof Phaser.Physics.Arcade.Sprite) {
                bee.setCollideWorldBounds(false);
                bee.setGravity(0, -350)
                bee.setAngularVelocity(ANG_SPEED)
                bee.setMaxVelocity(SPEED)
            }
        });

        this.setupPlayerCollision()

        this.setupControls()

        this.emitSceneReady()
    }

    update() {
        this.handlePlayerMovement();
        this.bees.getChildren().forEach((bee) => {
            if (bee instanceof Phaser.Physics.Arcade.Sprite) {
                this.physics.velocityFromRotation(bee.rotation, SPEED, bee.body?.velocity);
                this.physics.world.wrap(bee, 32);
            }
        });
    }

} 