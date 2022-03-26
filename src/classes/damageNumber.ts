import { GameObjects } from 'phaser';

export class DamageNumber extends GameObjects.BitmapText {
  private fadingOut: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, value: string) {
    super(scene, x, y, 'damage', value);
    //this.setFontSize(16)
    
    
    this.setOrigin(0.5, 0.1);
    scene.add.existing(this);
    this.addToUpdateList();
    scene.time.delayedCall(200, () => { this.fadingOut = true });
    scene.time.delayedCall(300, this.destroy);
  }
  
  public preUpdate(delta: number, time: number): void {
      this.y -= 0.5;
      if (this.fadingOut) {
          this.setAlpha(this.alpha - 0.04);
      }
  }
}
