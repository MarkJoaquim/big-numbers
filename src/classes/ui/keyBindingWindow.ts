import { GameObjects, Scene } from "phaser";
import { EVENTS_NAME } from "../../consts";
import eventsCenter from "../../helpers/eventsCenter";
import { AbilityBinding, GameData } from "../../storageTypes";
import { UIAbilityBinding } from "./uiAbilityBinding";
import { UIWindow } from "./uiWindow";


export class KeyBindingWindow extends UIWindow {
    private abilityBindingData: AbilityBinding[];
    private abilityBindings!: GameObjects.Container[];

    constructor(scene: Scene, abilityBindings: AbilityBinding[]) {
        super(scene, 50, 50, 400, 400, 'Abilities');
        this.abilityBindingData = abilityBindings;

        this.abilityBindings = this.abilityBindingData.map(ab => new UIAbilityBinding(scene, ab));
        this.layout();
    }

    public toggleActive(): void {
        super.toggleActive();
        eventsCenter.emit(EVENTS_NAME.CancelActiveBinding);
    }

    private layout(): void {
        this.abilityBindings.forEach((c: GameObjects.Container, idx: number) => {
            if ((idx + 1) * 32 < 400) {
                this.add(c);
                c.x = this.x + 5;
                c.y = this.y + 30 + idx*32;
            }
        });
    }

}