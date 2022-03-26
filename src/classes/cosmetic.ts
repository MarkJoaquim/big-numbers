import { GameObjects, Scene } from "phaser";

export class Cosmetic extends GameObjects.Sprite {
    protected textureName: string;

    constructor(scene: Scene, texture: string) {
        super(scene, 0, 0, texture)

        this.scene.add.existing(this);
        this.textureName = texture;
    }

    public playAnim(key: string, ignoreIfPlaying?: boolean) {
        if (this.anims.get(key)) {
            this.play(key, ignoreIfPlaying);
        }
    }

    public setFrameFromPlayer(frame: string): void {
        this.setFrame(frame)
    }

    public currentAnimIsWalk(): boolean {
        return this.anims.currentAnim && this.anims.currentAnim.key === 'walk';
    }

    public initAnimations(): void {
        this.anims.create({
            key: `walk`,
            frames: this.scene.anims.generateFrameNames(this.textureName, {
                prefix: `walk-`,
                end: 3,
            }),
            frameRate: 8,
        });
        this.anims.create({
            key: `sword`,
            frames: this.scene.anims.generateFrameNames(this.textureName, {
                prefix: `sword-`,
                end: 3,
            }),
          frameRate: 8,
        });
        this.anims.create({
            key: `punch`,
            frames: this.scene.anims.generateFrameNames(this.textureName, {
                prefix: `punch-`,
                end: 1,
            }),
            frameRate: 8,
        });
        this.anims.create({
            key: `bow`,
            frames: this.scene.anims.generateFrameNames(this.textureName, {
                prefix: `bow-`,
                end: 2,
            }),
          frameRate: 8,
        });
        this.anims.create({
            key: `magic`,
            frames: this.scene.anims.generateFrameNames(this.textureName, {
                prefix: `magic-`,
                end: 2,
            }),
            frameRate: 8,
        });
    }
}