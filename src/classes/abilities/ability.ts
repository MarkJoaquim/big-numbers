import { Geom } from "phaser";
import { WeaponType } from "../../storageTypes";
import { TrainingGround } from "../../scenes";
import { Mob } from "../mob";
import { Player } from "../player";

export class Ability {
    public keyCode: string;
    protected player: Player;
    protected scene: TrainingGround;
    protected cooldown: number;
    protected lastUsed: number = 0;
    protected weaponType: WeaponType;

    constructor(keyCode: string, player: Player, scene: TrainingGround, cooldown: number, weaponType?: WeaponType) {
        this.keyCode = keyCode;
        this.player = player;
        this.scene = scene;
        this.cooldown = cooldown;
        this.weaponType = weaponType ? weaponType : WeaponType.Any;
        this.scene.input.keyboard.on(`keydown-${keyCode}`, this.cast, this);
    }

    public updateKeyCode(keyCode: string): void {
        this.keyCode = keyCode;
        this.scene.input.keyboard.removeListener(`keydown-${this.keyCode}`);
        this.scene.input.keyboard.on(`keydown-${keyCode}`, this.cast, this);
    }

    public cast(): void {}

    protected getDamageArray(skillPower: number, lines: number): number[] {
        const dmgArray = [];
        for (let i = 0; i < lines; i++) {
            dmgArray.push(Math.floor(this.player.getRandomPower() * skillPower));
        }
        return dmgArray;
    }

    protected filterMobsByHitbox (hitbox: Geom.Rectangle) {
        return this.scene.getMobs().filter((mob: Mob) => {
                return Phaser.Geom.Rectangle.Overlaps(mob.getBounds(), hitbox);
        });
    }

    protected offCooldown() {
        return this.lastUsed + this.cooldown * this.player.getCooldownMultiplier() < this.scene.time.now;
    }
}