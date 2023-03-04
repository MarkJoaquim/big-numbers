import { GameObjects, Scene } from "phaser";


export class TextInput extends GameObjects.Group {
    private graphics: GameObjects.Graphics;
    private text: GameObjects.BitmapText;
    private enterCallback: (text: string) => any;
    private x: number;
    private minWidth: number = 200;
    private padding: number = 10;
    private bgColour: number = 0x222222;

    constructor(scene: Scene, x: number, y: number, size: number, enterCallback: (text: string) => any) {
        super(scene);
        this.x = x;
        this.graphics = scene.add.graphics();
        this.text = new GameObjects.BitmapText(scene, x, y, 'dogicapixel', '', size, 0.5);
        scene.add.existing(this.text);
        this.enterCallback = enterCallback;
        scene.input.keyboard.on('keydown', this.handleKey, this);

        this.draw();
    }

    public getText(): string {
        return this.text.text;
    }
    
    private draw(): void {
        this.text.x = this.x - this.text.width/2;
        this.graphics.clear();
        this.graphics.fillStyle(this.bgColour);
        this.graphics.fillRect(
            Math.min(-this.minWidth/2, this.text.x - this.padding),
            this.text.y - this.padding,
            Math.max(this.text.width + this.padding*2, this.minWidth),
            this.text.fontSize + 2*this.padding
        );
    }

    private handleKey(event: any): void {
        if (event.keyCode === 8 && this.text.text.length > 0) {
            this.text.text = this.text.text.slice(0, this.text.text.length - 1);
        } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
            this.text.text += event.key;
        } else if (event.key === 'Enter') {
            this.enterCallback(this.text.text);
        }
        this.draw();
    }
}