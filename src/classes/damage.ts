import { DamageNumber } from './damageNumber';
import { Mob } from './mob';

export class Damage {
    public scene: Phaser.Scene;
    private location: Phaser.Math.Vector2;

    constructor(enemy: Mob, numbers: number[]) {
        this.location = enemy.getTopCenter()
        this.scene = enemy.scene;
        this.showDamage(numbers);
    }

    private showDamage(numbers: number[]) {
        for (let i = 0; i < numbers.length; i++) {
            this.scene.time.delayedCall(i*75, () => { new DamageNumber(this.scene, this.location.x, this.location.y - (i * 16), numbers[i].toString()) });
        }
    }
}
