import { Scene } from 'phaser';
import eventsCenter from '../helpers/eventsCenter';
import { EVENTS_NAME } from '../consts';
import { Actor } from './actor';
import { Damage } from './damage';
import { Player } from './player';
import random from '../helpers/random';

export class Mob extends Actor {
  private target: Player;
  private health: number = 100;
  private expValue: number = 4;
  private speed: number = 50;
  private actionTimer!: Phaser.Time.TimerEvent;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.target = target;
    this.x -= this.width / 2;
    this.y -= this.height;
    
    this.initAnimations();
    this.updateAction();
  }

  update(): void {
    if (this.body.velocity.x < 0) this.facingRight = false;
    if (this.body.velocity.x > 0) this.facingRight = true;
    this.checkFlip();
    
    if (this.health <= 0) {
      this.actionTimer.destroy();
      this.destroy();
      eventsCenter.emit(EVENTS_NAME.ExpAcquired, this.expValue)
    }
  }

  public damage(dmgArray: number[]): void {
    let dmgTotal = dmgArray.reduce((prev, curr) => prev + curr, 0);
    new Damage(this, dmgArray);
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        this.health = this.health - dmgTotal;
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }

  private updateAction(): void {
    let choice = random.between(0,9);
    if (choice === 0) {
      this.setVelocityX(-this.speed);
      this.play(`${this.texture.key}-walk`, true);
    } else if (choice === 1) {
      this.setVelocityX(this.speed);
      this.play(`${this.texture.key}-walk`, true);
    } else if (choice === 2) {
      this.setVelocityX(0);
      this.anims.stop();
      this.play(`${this.texture.key}-blink`, true);
    } else {
      this.setVelocityX(0);
      this.anims.stop();
      this.setFrame('idle');
    }
    this.actionTimer = this.scene.time.delayedCall(random.between(500, 1500), this.updateAction, undefined, this);
  }


  private initAnimations(): void {  
    this.anims.create({
        key: `${this.texture.key}-walk`,
        frames: this.scene.anims.generateFrameNames(this.texture.key, {
          prefix: `walk-`,
          end: 3,
        }),
        repeat: -1,
        frameRate: 8,
    });
    this.anims.create({
      key: `${this.texture.key}-blink`,
      frames: this.scene.anims.generateFrameNames(this.texture.key, {
        prefix: `blink-`,
        end: 1,
      }),
      frameRate: 4,
    });
  }
}
