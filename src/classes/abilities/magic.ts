import { Ability } from "./ability";
import { Player } from "../player";
import { TrainingGround } from "../../scenes";
import { WeaponType } from "../../storageTypes";

export class Magic extends Ability {

    constructor(keyCode: string, player: Player, scene: TrainingGround) {
        super(keyCode, player, scene, 100, WeaponType.Magic);
    }

    public cast() {
      if (this.player.isCasting === false && this.offCooldown() && this.player.setWeapon(this.weaponType)) {  
        this.player.isCasting = true;
        this.lastUsed = this.scene.time.now;
        this.player.playCosmeticAnim('magic', true);

        this.player.bodyAnimOnce('animationcomplete', (animation: Phaser.Animations.Animation, frame: string) => {
            if (animation.key === 'magic') {
                const hitbox = new Phaser.Geom.Rectangle(this.player.x - 24, this.player.y - 24, 48, 48);
                const affectedMob = this.filterMobsByHitbox(hitbox)[0];
                const dmgArray = this.getDamageArray(1.5, 1);
                if (affectedMob) affectedMob.damage(dmgArray);
                this.player.setCosmeticFrame('idle');
                this.player.isCasting = false;
            }
          }, this);
      }
    }
}