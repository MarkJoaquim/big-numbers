import { GameObjects, Input, Scene } from 'phaser';
import { TextButton, CharacterInfo, KeyBindingWindow } from '../../classes/ui';
import { GameData } from '../../storageTypes';

export class UIScene extends Scene {
    private characterInfo!: CharacterInfo;
    private gameData!: GameData;
    private escKey!: Input.Keyboard.Key;
    private escButton!: TextButton;
    private bindingWindow!: KeyBindingWindow;

    constructor() {
        super('ui-scene');
    }

    init(gameData: GameData) {
        this.gameData = gameData;
    }

    create(): void {
        this.characterInfo = new CharacterInfo(this, this.gameData.playerConfig, 20, 7, 7);
        this.escButton = new TextButton(this, 0, 0, 'Keys', 16, () => this.toggleKeyBindings());
        this.escKey = this.input.keyboard.addKey('ESC');
        this.escKey.on('down', this.toggleKeyBindings, this);
        this.bindingWindow = new KeyBindingWindow(this, this.gameData.playerConfig.abilityBindings);
    }

    toggleKeyBindings(): void {
        this.bindingWindow.toggleActive();
    }
}
