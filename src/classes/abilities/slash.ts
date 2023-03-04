import { Ability } from "./ability";
import { Player } from "../player";
import { TrainingGround } from "../../scenes";
import { AbilityBinding, WeaponType } from "../../storageTypes";

export class Slash extends Ability {

    constructor(abilityBinding: AbilityBinding, player: Player, scene: TrainingGround) {
        super(abilityBinding, player, scene, 100, WeaponType.Sword);
    }

    public cast() {
      if (this.player.isCasting === false && this.offCooldown() && this.player.setWeapon(this.weaponType)) {  
        this.player.isCasting = true;
        this.lastUsed = this.scene.time.now;
        this.player.playCosmeticAnim('sword', true);

        this.player.bodyAnimOnce('animationcomplete', (animation: Phaser.Animations.Animation, frame: string) => {
            if (animation.key === 'sword') {
                const hitbox = new Phaser.Geom.Rectangle(this.player.x - 24, this.player.y - 24, 48, 48);
                const affectedMob = this.filterMobsByHitbox(hitbox)[0];
                const dmgArray = this.getDamageArray(1, 2);
                if (affectedMob) affectedMob.damage(dmgArray);
                this.player.setCosmeticFrame('idle');
                this.player.isCasting = false;
            }
          }, this);
      }
    }
}