import { GameObjects, Geom, Input, Scene } from "phaser";
import { AbilityBinding } from "../../storageTypes";
import eventsCenter from '../../helpers/eventsCenter';
import { EVENTS_NAME } from "../../consts";

export class UIAbilityBinding extends GameObjects.Container {
    private abilityBinding: AbilityBinding;
    private cardBox: Geom.Rectangle;
    private card: GameObjects.Graphics;
    private thumbnail: GameObjects.Image;
    private text: GameObjects.BitmapText;
    private boundKeyText: GameObjects.BitmapText;
    private stroke: GameObjects.Graphics;
    private cardColour: number = 0x333333;
    private listener!: Input.Keyboard.KeyboardPlugin;

    constructor(scene: Scene, abilityBinding: AbilityBinding) {
        super(scene);
        this.abilityBinding = abilityBinding;
        this.card = new GameObjects.Graphics(this.scene, { fillStyle: { color: 0x333333, alpha: 0.8 }});
        this.cardBox = new Geom.Rectangle(0, 0, 390, 24);
        this.draw();
        this.thumbnail = new GameObjects.Image(this.scene, 8, 4, 'ability-thumbnails', abilityBinding.abilityName);
        this.thumbnail.setOrigin(0, 0);
        this.text = new GameObjects.BitmapText(this.scene, 32, 4, 'dogicapixel', abilityBinding.abilityName, 16);
        this.boundKeyText = new GameObjects.BitmapText(this.scene, 385, 4, 'dogicapixel', abilityBinding.keyName, 16, 0.5);
        this.boundKeyText.setOrigin(1, 0);
        this.stroke = new GameObjects.Graphics(this.scene, {lineStyle: { width: 2, color: 0x999999 }});
        this.stroke.strokeRoundedRect(this.cardBox.x, this.cardBox.y, this.cardBox.width, this.cardBox.height, 4);
        this.stroke.setVisible(false);
        this.add([this.card, this.thumbnail, this.text, this.boundKeyText, this.stroke]);
        this.setInteractive(new Geom.Rectangle(0, 0, 390, 24), Geom.Rectangle.Contains);

        this.on('pointerover', () => this.draw(true));
        this.on('pointerout', () => this.draw())
        this.on('pointerup', () => this.alterBinding())
        eventsCenter.on(EVENTS_NAME.CancelActiveBinding, this.cancelAlterBinding, this);
    }
    
    private draw(hovered?: boolean): void {
        this.card.clear();
        this.card.fillStyle(hovered ? this.cardColour + 0x333333 : this.cardColour);
        this.card.fillRoundedRect(this.cardBox.x, this.cardBox.y, this.cardBox.width, this.cardBox.height, 4);
    }
    
    private alterBinding(): void {
        eventsCenter.emit(EVENTS_NAME.CancelActiveBinding, this.abilityBinding.abilityName);
        this.stroke.setVisible(true);
        this.listener = this.scene.input.keyboard.once('keydown', (event: any) => {
            this.abilityBinding.keyCode = event.keyCode;
            this.abilityBinding.keyName = event.key;
            this.boundKeyText.text = event.key;
            eventsCenter.emit(EVENTS_NAME.BindingAltered, this.abilityBinding);
            this.stroke.setVisible(false);
        });
    }

    public cancelAlterBinding(except?: string): void {
        if (except !== this.abilityBinding.abilityName) {
            this.stroke.setVisible(false);
            if (this.listener) {
                this.listener.removeAllListeners();
            }
        }
    }
}