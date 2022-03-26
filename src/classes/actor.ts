import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
  public facingRight: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.facingRight = true;

    this.fadeIn();
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setAllowGravity(true);
    this.getBody().setGravityY(3000);
    this.getBody().setCollideWorldBounds(true);
  }

  protected checkFlip(): void {
    this.setFlipX(!this.facingRight);
  }

  protected fadeIn(): void {
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      duration: 250,
      alpha: 1
    });
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
