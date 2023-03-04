import { GameObjects } from "phaser";
import { TrainingGround } from "../../scenes";
import { Ability } from "./ability";
import { Player } from "../player";
import { AbilityBinding, WeaponType } from "../../storageTypes";

export class FlashJump extends Ability {

    constructor(abilityBinding: AbilityBinding, player: Player, scene: TrainingGround) {
        super(abilityBinding, player, scene, 250, WeaponType.Any);
        this.initAnimations();
    }

    public cast() {
        if (!this.player.getBody().blocked.down
            && !this.player.isCasting
            && this.player.flashJumpCountSinceLastGroundTouch <= 2
            && this.offCooldown()) {

            this.animation(this.player.x, this.player.y, !this.player.facingRight);
            this.player.flashJumpCountSinceLastGroundTouch++;
            this.lastUsed = this.scene.time.now;
            
            this.player.applyForce(250, -100, true);
        }
    }

    private animation(x: number, y: number, flip: boolean): void {
        if (flip) {
            x += 24;
        } else {
            x -= 24;
        }
        let sprite = new GameObjects.Sprite(this.scene, x, y, 'flash-jump')
        sprite.setScale(this.player.scaleFactor);
        sprite.setFlipX(flip);
        sprite.play('flash-jump');
        sprite.on('animationcomplete', () => { sprite.destroy() });
        this.scene.add.existing(sprite);
    }

    private initAnimations() {
        this.scene.anims.create({
            key: 'flash-jump',
            frames: this.scene.anims.generateFrameNames('flash-jump', {
                prefix: 'flash-jump-',
                end: 3,
            }),
            frameRate: 16,
        });
    }
}