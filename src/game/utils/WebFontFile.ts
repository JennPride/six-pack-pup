import Phaser from 'phaser';

export default class WebFontFile extends Phaser.Loader.File {
    private fontNames: string[];
    private service: string;

    constructor(loader: Phaser.Loader.LoaderPlugin, fontNames: string | string[], service = 'https://fonts.googleapis.com/css') {
        super(loader, {
            type: 'webfont',
            key: fontNames.toString()
        });

        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
        this.service = service;
    }

    load() {
        const config = {
            active: () => this.loader.nextFile(this, true),
            inactive: () => this.loader.nextFile(this, false),
            fontactive: () => {},
            fontinactive: () => {}
        };

        const WebFont = (window as any).WebFont;
        WebFont.load({
            google: {
                families: this.fontNames
            },
            ...config
        });
    }
}
