import { GameObjects, Geom, Scene } from "phaser";


export class UIWindow extends GameObjects.Container {
    private background: GameObjects.Graphics;
    private draggableBar: GameObjects.Graphics;
    private nameText: GameObjects.BitmapText;

    constructor(scene: Scene, x: number, y: number, width: number, height: number, name: string) {
        super (scene, x, y)
        height = Math.max(height, 40);
        this.background = new GameObjects.Graphics(scene);
        this.background.fillStyle(0x444444, 0.8);
        this.background.fillRoundedRect(x, y + 24, width, height - 24, { tl: 0, tr: 0, bl: 10, br: 10 });
        this.draggableBar = new GameObjects.Graphics(scene);
        this.draggableBar.fillStyle(0x222222);
        this.draggableBar.fillRoundedRect(x, y, width, 24, { tl: 10, tr: 10, bl: 0, br: 0 })
        this.nameText = new GameObjects.BitmapText(scene, x + 4, y + 4, 'dogicapixel', name, 16);

        this.add([this.background, this.draggableBar, this.nameText]);
        this.setInteractive(new Geom.Rectangle(x, y, width, 24), Geom.Rectangle.Contains);
        scene.add.existing(this);
        scene.input.setDraggable(this);
        scene.input.on('drag', this.dragCallback, this);
    }

    public toggleActive(): void {
        this.setAlpha(this.alpha ? 0 : 1);
        this.setActive(this.active ? false : true);
    }

    private dragCallback(pointer: Phaser.Input.Pointer, gameObject: GameObjects.GameObject, x: number, y: number): void {
        if (gameObject = this.draggableBar) {
            this.x = x;
            this.y = y;
        }
    }
}