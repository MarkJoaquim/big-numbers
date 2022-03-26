import { Tilemaps } from "phaser";
import { Mob } from "./mob";
import { Player } from "./player";


export class SpawnPoint {
    public point: ObjectPoint;
    private scene: Phaser.Scene;
    private player: Player;
    private platforms: Tilemaps.TilemapLayer;
    private mobName: string;
    private mobGroup: Phaser.GameObjects.Group;
    
    constructor(scene: Phaser.Scene, point: ObjectPoint, mobName: string, player: Player, platformLayer: Tilemaps.TilemapLayer) {
        this.scene = scene;
        this.point = point
        this.mobName = mobName;
        this.player = player;
        this.platforms = platformLayer;

        this.mobGroup = scene.add.group();
        scene.physics.add.collider(this.mobGroup, platformLayer);
    }

    public getMobs(): Mob[] {
        return this.mobGroup.getChildren() as Mob[];
    }

    public spawn(amount: number): void {
        for (let i = 0; i < amount - this.mobGroup.getLength(); i++) {
            this.mobGroup.add(new Mob(this.scene, this.point.x, this.point.y, this.mobName, this.player));
        }
    }
}