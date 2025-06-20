import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('level1_background', 'assets/level1_bg.png');
        this.load.image('level3_background', 'assets/level3_bg.png');
        this.load.tilemapTiledJSON('level1_tilemap', 'assets/maps/level1.json');
        this.load.image('level1_tileset', 'assets/maps/level1.png')
        this.load.image('player', 'assets/player.png');
        this.load.image('leaf', 'assets/leaf.png');
        this.load.image('leafpile', 'assets/leafpile.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('pineCone', 'assets/pineCone.png');
        this.load.image('orange', 'assets/orange.png');
        this.load.image('bush', 'assets/bush.png');
        // this.load.image('level2_background', 'assets/bg_level2.png');
        // this.load.image('level3_background', 'assets/bg_level3.png');
        // this.load.image('level4_background', 'assets/bg_level4.png');
        // this.load.image('level5_background', 'assets/bg_level5.png');
        // this.load.image('level6_background', 'assets/bg_level6.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
