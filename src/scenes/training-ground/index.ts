import { GameObjects, Scene, Tilemaps } from 'phaser';

import { Player } from '../../classes/player';
import { Mob } from '../../classes/mob';
import { gameObjectsToObjectPoints } from '../../helpers/gameobject-to-object-point';
import { setDirectionalCollisionByProperty } from '../../helpers/setDirectionalCollisionByProperty';
import { SpawnPoint } from '../../classes/spawnPoint';
import { GameData } from 'src/storageTypes';

export class TrainingGround extends Scene {
    private gameData!: GameData;
    private player!: Player;
    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private decorationLayer!: Tilemaps.TilemapLayer;
    private backgroundLayer!: Tilemaps.TilemapLayer;
    private platformLayer!: Tilemaps.TilemapLayer;
    private spawnPoints!: SpawnPoint[];
    private spawnPeriod!: number;
    private spawnNumber!: number;

    constructor() {
        super('training-ground-scene');
    }

    init(data: GameData) {
        this.gameData = data;
    }

    create(): void {
        this.initMap();
        this.initPlayer();
        this.initSpawnPoints();
        this.initCamera();
    }

    update(): void {
        this.player.update();
        this.getMobs().map(m => m.update());
    }

    public getMobs(): Mob[] {
        return this.spawnPoints.reduce((prev: Mob[], curr: SpawnPoint) => {
            prev.push(...curr.getMobs());
            return prev;
        }, [])
    }

    private initPlayer(): void {
        this.player = new Player(this, this.gameData.playerConfig);
        
        this.physics.add.collider(this.player, this.platformLayer);
    }

    private initMap(): void {

        this.map = this.make.tilemap({ key: this.gameData.mapName, tileWidth: 16, tileHeight: 16 });
        this.tileset = this.map.addTilesetImage(this.gameData.mapName, 'tiles');
        this.backgroundLayer = this.map.createLayer('Background', this.tileset, 0, 0);
        this.decorationLayer = this.map.createLayer('Decoration', this.tileset, 0, 0);
        this.platformLayer = this.map.createLayer('Platforms', this.tileset, 0, 0);
        
        this.platformLayer = setDirectionalCollisionByProperty(this.platformLayer, {'top-collides': true}, false, false, true, false);
        this.physics.world.setBounds(0, 0, this.platformLayer.width, this.platformLayer.height);
    }

    private initSpawnPoints(): void {
        let spawnPointsLayer = this.map.getObjectLayer('SpawnPoints');
        let points = gameObjectsToObjectPoints(spawnPointsLayer.objects);
        
        this.spawnPeriod = (spawnPointsLayer.properties as any[]).find((p: any) => p.name === 'basePeriod').value;
        this.spawnNumber = (spawnPointsLayer.properties as any[]).find((p: any) => p.name === 'baseSpawnNumber').value;

        this.spawnPoints = points.map(point => new SpawnPoint(this, point, 'raccoon', this.player, this.platformLayer));

        this.time.delayedCall(50, this.triggerSpawn, undefined, this);
    }

    private triggerSpawn(): void {
        this.spawnPoints.map(sp => {
            sp.spawn(this.determineNumberToSpawn(sp.point.id, this.spawnNumber, this.spawnPoints.length));
        })

        this.time.delayedCall(this.spawnPeriod, this.triggerSpawn, undefined, this);
    }

    private determineNumberToSpawn(pointId: number, totalToSpawn: number, totalPoints: number): number {
        return Math.floor(totalToSpawn / totalPoints) + (totalToSpawn % totalPoints >= pointId ? 1 : 0);
    }

    private initCamera(): void {
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.setBounds(0, 0, this.platformLayer.width, this.platformLayer.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(3);
    }

    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.platformLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    }
}
