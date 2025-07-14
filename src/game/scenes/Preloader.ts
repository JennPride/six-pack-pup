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
        this.load.image('level5_background', 'backgrounds/level5_bg.png');
        this.load.image('level6_background', 'backgrounds/level6_bg.png');

        // Load maps
        this.load.tilemapTiledJSON('level1_tilemap', 'maps/level1map.json');
        this.load.tilemapTiledJSON('level2_tilemap', 'maps/level2map.json');
        this.load.tilemapTiledJSON('level3_tilemap', 'maps/level3map.json');
        // Level 4 doesn't need a map because all tiles are dynamic
        this.load.tilemapTiledJSON('level5_tilemap', 'maps/level5map.json');
        this.load.tilemapTiledJSON('level6_tilemap', 'maps/level6map.json');

        this.load.image('cloud', 'backgrounds/cloud.png');
        this.load.image('darkcloud', 'backgrounds/darkcloud.png');

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
        this.load.image('pumpkin', 'ingredients/level5/pumpkin.png');
        this.load.image('vanilla', 'ingredients/level5/vanilla.png');
        this.load.image('cinnamon', 'ingredients/level5/cinnamon.png');
        this.load.image('cherries', 'ingredients/level6/cherries.png');
        this.load.image('mistletoe', 'ingredients/level6/mistletoe.png');
        this.load.image('honey', 'ingredients/level6/honey.png');

        // Load enemies
        this.load.image('bee1', 'enemies/bee1.png');
        this.load.image('bee2', 'enemies/bee2.png');
        this.load.image('fallingstar', 'enemies/fallingstar.png');
        this.load.image('scarecrow', 'enemies/scarecrow.png');
        this.load.image('madelf', 'enemies/madelf.png');

        // Load Moon sprites and animations
        // this.load.image('moon1', 'moon/moon1.png');
        // this.load.image('moon2', 'moon/moon2.png');
        // this.load.image('moon3', 'moon/moon3.png');
        // this.load.image('moon4', 'moon/moon4.png');
        // this.load.image('moon5', 'moon/moon5.png');
        // this.load.image('moon6', 'moon/moon6.png');
        // this.load.image('moon7', 'moon/moon7.png');
        this.load.image('moon1', 'moon/moonwalk1.png');
        this.load.image('moon2', 'moon/moonwalk2.png');
        this.load.image('moon3', 'moon/moonwalk3.png');
        this.load.image('moon4', 'moon/moonwalk4.png');
        this.load.image('moon5', 'moon/moonwalk5.png');
        this.load.image('moon6', 'moon/moonwalk6.png');
        this.load.image('moon7', 'moon/moonwalk7.png');
        this.load.image('moonwag', 'moon/moonwag.png');
        this.load.image('moonwag2', 'moon/moonwag2.png');
        this.load.image('fullheart', 'moon/fullheart.png');
        this.load.image('emptyheart', 'moon/emptyheart.png');

        this.load.image('level1can', 'levels/leafseeker.png')
        this.load.image('level2can', 'levels/fieldstudy.png');
        this.load.image('level3can', 'levels/sunshine.png');
        this.load.image('level4can', 'levels/hazecharmer.png');
        this.load.image('level5can', 'levels/pumpkins.png');
        this.load.image('level6can', 'levels/madelf.png');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
