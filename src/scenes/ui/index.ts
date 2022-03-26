import { Scene } from 'phaser';
import { GameData } from 'src/storageTypes';
import { CharacterInfo } from '../../classes/ui/characterInfo';

export class UIScene extends Scene {
    private characterInfo!: CharacterInfo;
    private gameData!: GameData;

    constructor() {
        super('ui-scene');
    }

    init(gameData: GameData) {
        this.gameData = gameData;
    }

    create(): void {
        this.characterInfo = new CharacterInfo(this, this.gameData.playerConfig, 20, 7, 7);
    }

}
