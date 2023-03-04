import { Ability } from "./ability";
import { Player } from "../player";
import { TrainingGround } from "../../scenes";
import { AbilityBinding, WeaponType } from "../../storageTypes";

export class Punch extends Ability {

    constructor(abilityBinding: AbilityBinding, player: Player, scene: TrainingGround) {
        super(abilityBinding, player, scene, 100, WeaponType.Any);
    }

    public cast() {
      if (this.player.isCasting === false && this.offCooldown() && this.player.setWeapon()) {  
        this.player.isCasting = true;
        this.lastUsed = this.scene.time.now;
        this.player.playCosmeticAnim('punch', true);

        this.player.bodyAnimOnce('animationcomplete', (animation: Phaser.Animations.Animation, frame: string) => {
            if (animation.key === 'punch') {
                const hitbox = new Phaser.Geom.Rectangle(this.player.x - 24, this.player.y - 24, 48, 48);
                const affectedMob = this.filterMobsByHitbox(hitbox)[0];
                const dmgArray = this.getDamageArray(0.5, 1);
                if (affectedMob) affectedMob.damage(dmgArray);
                this.player.setCosmeticFrame('idle');
                this.player.isCasting = false;
            }
          }, this);
      }
    }
}