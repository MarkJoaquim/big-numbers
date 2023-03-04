import { Geom } from "phaser";
import { AbilityBinding, AbilityName, WeaponType } from "../../storageTypes";
import { TrainingGround } from "../../scenes";
import { Mob } from "../mob";
import { Player } from "../player";

export class Ability {
    public keyCode: number;
    public abilityName: AbilityName;
    protected player: Player;
    protected scene: TrainingGround;
    protected cooldown: number;
    protected lastUsed: number = 0;
    protected weaponType: WeaponType;

    constructor(abilityBinding: AbilityBinding, player: Player, scene: TrainingGround, cooldown: number, weaponType?: WeaponType) {
        this.keyCode = abilityBinding.keyCode!;
        this.abilityName = abilityBinding.abilityName;
        this.player = player;
        this.scene = scene;
        this.cooldown = cooldown;
        this.weaponType = weaponType ? weaponType : WeaponType.Any;
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