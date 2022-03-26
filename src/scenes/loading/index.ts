import { Scene } from 'phaser';
import { AbilityName, GameData, PlayerConfig } from '../../storageTypes';

export class LoadingScene extends Scene {
    private gameData!: GameData;

    constructor() {
        super('loading-scene');
    }

    preload(): void {
        this.gameData = this.loadData()
        this.load.baseURL = 'assets/';

        // PLAYER LOADING
        // Load Bodies
        this.load.atlas('player-body-white', 'spritesheets/player-body-white.png', 'spritesheets/player-body.json');
        this.load.atlas('player-body-black', 'spritesheets/player-body-black.png', 'spritesheets/player-body.json');
        this.load.atlas('player-body-brown', 'spritesheets/player-body-brown.png', 'spritesheets/player-body.json');
        this.load.atlas('player-body-blackish', 'spritesheets/player-body-blackish.png', 'spritesheets/player-body.json');
        
        // Load Heads
        this.load.atlas('head-blonde', 'spritesheets/head-blonde.png', 'spritesheets/head.json');
        this.load.atlas('head-brown', 'spritesheets/head-brown.png', 'spritesheets/head.json');
        this.load.atlas('head-black', 'spritesheets/head-black.png', 'spritesheets/head.json');
        this.load.atlas('head-blonde-long', 'spritesheets/head-blonde-long.png', 'spritesheets/head.json');

        // Load Equipment
        this.load.atlas('sword', 'spritesheets/sword.png', 'spritesheets/sword.json');
        this.load.atlas('staff', 'spritesheets/staff.png', 'spritesheets/staff.json');
        this.load.atlas('bow', 'spritesheets/bow.png', 'spritesheets/bow.json');

        // Damage Loading
        this.load.bitmapFont('damage', 'fonts/damage.png', 'fonts/damage.xml');

        // Char Info Loading
        this.load.bitmapFont('dogicapixel', 'fonts/dogicapixel.png', 'fonts/dogicapixel.xml');

        // Skills Loading
        this.load.atlas('flash-jump', 'spritesheets/flash-jump.png', 'spritesheets/flash-jump.json');

        // MAP LOADING
        this.load.image({ key: 'tiles', url: 'tilemaps/tiles/simple-map.png' });
        this.load.tilemapTiledJSON('simple-map', 'tilemaps/json/simple-map.json');

        // Mob Loading
        this.load.atlas('raccoon', 'spritesheets/raccoon.png', 'spritesheets/raccoon.json');
    }

    create(): void {
        if (!this.gameData) {
            this.scene.start('character-creation');
        } else {
            this.scene.start('training-ground-scene', this.gameData);
            this.scene.start('ui-scene', this.gameData);
        }
    }

    private loadData(): GameData {
        const storedGameData = localStorage.getItem('gameData');
        return storedGameData ? JSON.parse(storedGameData) : undefined;
    }
}
