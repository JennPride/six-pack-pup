import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');
        // Load backgrounds
        this.load.image('level1_background', 'backgrounds/level1_bg.png');
        this.load.image('level2_background', 'backgrounds/level2_bg.png');
        this.load.image('level3_background', 'backgrounds/level3_bg.png');
        this.load.image('level4_background', 'backgrounds/level4_bg.png');
        // this.load.image('level5_background', 'backgrounds/level5_bg.png');
        this.load.image('level6_background', 'backgrounds/level6_bg.png');

        // Load maps
        this.load.tilemapTiledJSON('level1_tilemap', 'maps/level1map.json');
        this.load.tilemapTiledJSON('level2_tilemap', 'maps/level2map.json');
        this.load.tilemapTiledJSON('level3_tilemap', 'maps/level3map.json');
        // Level 4 doesn't need a map because all tiles are dynamic
        this.load.tilemapTiledJSON('level5_tilemap', 'maps/level5map.json');
        this.load.tilemapTiledJSON('level6_tilemap', 'maps/level6map.json');

        this.load.image('cloud', 'backgrounds/cloud.png');

        // Load spritesheet
        this.load.image('spritesheet', 'maps/art_of_troegs_spritesheet.png')

        // Load ingredients
        this.load.image('leaf', 'ingredients/level1/leaf.png');
        this.load.image('pineCone', 'ingredients/level1/pineCone.png');
        this.load.image('orange', 'ingredients/level1/orange.png');
        this.load.image('magnifyingglass', 'ingredients/level2/magnifyingglass.png');
        this.load.image('melon', 'ingredients/level2/melon.png');
        this.load.image('pear', 'ingredients/level2/pear.png');
        this.load.image('lime', 'ingredients/level3/lime.png');
        this.load.image('sunglasses', 'ingredients/level3/sunglasses.png');
        this.load.image('salt', 'ingredients/level3/salt.png');
        this.load.image('star', 'ingredients/level4/star.png');
        this.load.image('pineapple', 'ingredients/level4/pineapple.png');
        this.load.image('grapefruit', 'ingredients/level4/grapefruit.png');

        // Load enemies
        this.load.image('bee1', 'enemies/bee1.png');
        this.load.image('bee2', 'enemies/bee2.png');
        this.load.image('fallingstar', 'enemies/fallingstar.png');

        // Load Moon sprites and animations
        this.load.image('moon1', 'moon/moon1.png');
        this.load.image('moon2', 'moon/moon2.png');
        this.load.image('moon3', 'moon/moon3.png');
        this.load.image('moon4', 'moon/moon4.png');
        this.load.image('moon5', 'moon/moon5.png');
        this.load.image('moon6', 'moon/moon6.png');
        this.load.image('moon7', 'moon/moon7.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start('MainMenu');
        this.scene.start('Level4');
    }
}
