import { GameObjects, Geom, Scene } from "phaser";

export class TextButton extends GameObjects.Group {
    private bitmapText: GameObjects.BitmapText;
    private graphics: GameObjects.Graphics;
    private box: Geom.Rectangle;
    private colour: number = 0x888888;

    constructor(scene: Scene, x: number, y: number, text: string, size: number, callback: () => void, context?: any) {
        super(scene);
        const pad = Math.min(size/2, 10);
        this.graphics = new GameObjects.Graphics(scene);
        this.bitmapText = new GameObjects.BitmapText(scene, x + pad, y + pad, 'dogicapixel', text, size);
        this.add(this.graphics, true);
        this.add(this.bitmapText, true);
        this.box = new Geom.Rectangle(x, y, this.bitmapText.width + pad*2, this.bitmapText.height + pad*2);
        this.draw();
        this.graphics.setInteractive(this.box, Phaser.Geom.Rectangle.Contains);
        this.graphics.on('pointerover', () => this.draw(true));
        this.graphics.on('pointerout', () => this.draw());
        this.graphics.on('pointerdown', callback, context);
    }

    public centerX(x: number): void {
        this.box.x = x - this.box.width/2;
        this.bitmapText.setX(x - this.bitmapText.width/2);
        this.draw();
    }

    private draw(hovered?: boolean): void {
        this.graphics.clear();
        this.graphics.fillStyle(hovered ? this.colour + 0x444444 : this.colour);
        this.graphics.fillRectShape(this.box);
    }
}