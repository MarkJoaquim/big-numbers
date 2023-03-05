import { GameObjects, Math, Scene, Types } from "phaser";
import { TrainingGround } from "src/scenes";
import { Mob } from "../mob";

export class Arrow extends GameObjects.PathFollower {
    private speed = 1/3;
    private damage: number[];

    constructor(scene: TrainingGround, start: Math.Vector2, finish: Math.Vector2, damage: number[]) {
        const controlPt = new Phaser.Math.Vector2((start.x + finish.x)/2, (start.y + finish.y)/2 - 20);
        const curve = new Phaser.Curves.QuadraticBezier(start, controlPt, finish);
        const path = new Phaser.Curves.Path(start.x, start.y).add(curve);

        super(scene, path, start.x, start.y, 'arrow', 'basic');
        this.damage = damage;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const duration = path.getLength() / this.speed;
        this.startFollow({
            duration,
            yoyo: false,
            repeat: 0,
            rotateToPath: true,
        });

        scene.time.addEvent({
          delay: duration,
          callback: () => this ? this.destroy() : null,
        })

        scene.physics.add.collider(this, scene.getMobs(), Arrow.hit)
    }

    public getDamage() {
        return this.damage;
    }

    private static hit(arrow: Types.Physics.Arcade.GameObjectWithBody, mob: Types.Physics.Arcade.GameObjectWithBody): void {
        (mob as Mob).damage((arrow as Arrow).getDamage());
        arrow.destroy();
    }
}