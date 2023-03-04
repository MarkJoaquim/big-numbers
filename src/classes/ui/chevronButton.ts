import { GameObjects, Geom, Scene } from "phaser"

export class ChevronButton extends GameObjects.Graphics{
    private polygon: Geom.Polygon;
    private colour: number = 0x888888;

    constructor(scene: Scene, x: number, y: number, height: number, right: boolean, callback: () => void, context?: any) {
        super(scene);
        this.polygon = this.initPolygon(x, y, height, right);
        this.draw();
        this.setInteractive(this.polygon, Geom.Polygon.Contains);
        this.on('pointerover', () => this.draw(true));
        this.on('pointerout', () => this.draw());
        this.on('pointerdown', callback, context);
        
        scene.add.existing(this);
    }

    private draw(hovered?: boolean): void {
        this.clear();
        this.fillStyle(hovered ? this.colour + 0x444444 : this.colour);
        this.fillPoints(this.polygon.points, true);
    }

    private initPolygon(x: number, y: number, height: number, right: boolean): Geom.Polygon {
        const xDiff = right ? -height/2 : height/2;
        let points = [
            x, y,
            x + xDiff, y - height/2,
            x + 2*xDiff, y - height/2,
            x + xDiff, y,
            x + 2*xDiff, y + height/2,
            x + xDiff, y + height/2
        ];
        return new Geom.Polygon(points);
    }
}