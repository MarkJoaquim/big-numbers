import { Ability } from "./ability";
import { Player } from "../player";
import { Arrow } from "../projectiles/arrow"
import { TrainingGround } from "../../scenes";
import { AbilityBinding, WeaponType } from "../../storageTypes";
import { Geom, Math } from "phaser";

export class Shoot extends Ability {
	private xRange = 300;
	private yRange = 50;

    constructor(abilityBinding: AbilityBinding, player: Player, scene: TrainingGround) {
        super(abilityBinding, player, scene, 100, WeaponType.Bow);
    }

    public cast() {
      if (this.player.isCasting === false && this.offCooldown() && this.player.setWeapon(this.weaponType)) {  
        this.player.isCasting = true;
        this.lastUsed = this.scene.time.now;
        this.player.playCosmeticAnim('bow', true);

        this.player.bodyAnimOnce('animationcomplete', (animation: Phaser.Animations.Animation, frame: string) => {
            if (animation.key === 'bow') {
                new Arrow(
					this.scene,
					new Math.Vector2(this.player.getBody().center),
					this.getDestination(),
					this.getDamageArray(1.5, 1)
				);
                this.player.setCosmeticFrame('idle');
                this.player.isCasting = false;
            }
          }, this);
      }
    }

	private getDestination(): Phaser.Math.Vector2 {
		const direction = this.player.facingRight ? 1 : -1;
		const hitbox = this.getHitBox(this.player.getBody().center, direction);
		const affectedMob = this.getNearestMob(this.filterMobsByPolygon(hitbox));
		if (affectedMob) {
			return new Math.Vector2(affectedMob.body.center);
		}

		const source = this.player.body.position
		return new Math.Vector2(source.x + (this.xRange * direction), source.y);
	}

	private getHitBox(position: Math.Vector2, direction: 1 | -1): Phaser.Geom.Polygon {
		const nearTop = new Math.Vector2(position).add(new Math.Vector2(0, -10));
		const nearBot = new Math.Vector2(position).add(new Math.Vector2(0, 10));
		const midTop = new Math.Vector2(position).add(new Math.Vector2(this.xRange / 2 * direction, -this.yRange));
		const midBot = new Math.Vector2(position).add(new Math.Vector2(this.xRange / 2 * direction, this.yRange));
		const farTop = new Math.Vector2(position).add(new Math.Vector2(this.xRange * direction, -this.yRange));
		const farBot = new Math.Vector2(position).add(new Math.Vector2(this.xRange * direction, this.yRange));
		return new Geom.Polygon([
			nearTop,
			midTop,
			farTop,
			farBot,
			midBot,
			nearBot,
		]);
	}
}