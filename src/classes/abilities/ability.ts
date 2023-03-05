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

    protected filterMobsByPolygon (hitbox: Geom.Polygon) {
        return this.scene.getMobs().filter((mob: Mob) => {
                return hitbox.contains(mob.body.center.x, mob.body.center.y);
        });
    }

    protected getNearestMob(mobs: Mob[]) {
        const playerCenter = this.player.getBody().center;
        return mobs.reduce((nearest: Mob | undefined, curr: Mob) => {
            if (!nearest) return curr;
            const distNearest = playerCenter.distance(nearest.body.center);
            const distCurr = playerCenter.distance(curr.body.center);
            return distNearest < distCurr ? nearest : curr;
        }, undefined)
    }

    protected offCooldown() {
        return this.lastUsed + this.cooldown * this.player.getCooldownMultiplier() < this.scene.time.now;
    }
}