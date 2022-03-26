import { GameObjects } from "phaser";
import eventsCenter from '../../helpers/EventsCenter';
import { EVENTS_NAME } from '../../consts';
import { Scaling } from "../scaling";
import { PlayerConfig } from "../../storageTypes";

export class CharacterInfo {
    
    private scene: Phaser.Scene;
    private padding: number;
    private barHeight: number;
    private nameText: GameObjects.BitmapText;
    private levelText: GameObjects.BitmapText;
    private currentLevel: number;
    private currentExp: number;
    private expToNextLevel: number;
    private bar: Phaser.GameObjects.Graphics;
    private container: Phaser.GameObjects.Container;
    private cornerRadius: number;

    constructor(scene: Phaser.Scene, playerConfig: PlayerConfig, height: number, padding: number, cornerRadius: number) {
        this.scene = scene;
        this.barHeight = height;
        this.padding = padding;
        this.currentLevel = playerConfig.level;
        this.currentExp = playerConfig.exp;
        this.expToNextLevel = Scaling.expToNextLevel(playerConfig.level);
        this.cornerRadius = cornerRadius;
        
        this.container = new Phaser.GameObjects.Container(scene);
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.levelText = new GameObjects.BitmapText(scene, 0, 0, 'dogicapixel', `Lv${this.currentLevel}`, 8);
        this.nameText = new GameObjects.BitmapText(scene, 0, 0, 'dogicapixel', playerConfig.name, 16);
        this.drawBackGroundAndBar();
        this.container.add([this.bar, this.levelText, this.nameText]);
        this.scene.add.existing(this.container);
        this.levelText.setOrigin(0.5, 1);
        this.nameText.setOrigin(0.5, 1);
        this.setPositions();

        scene.scale.on('resize', this.setPositions, this);
        eventsCenter.on(EVENTS_NAME.ExpAcquired, this.addExp, this);
    }

    private setPositions(): void {
        this.drawBackGroundAndBar();
        this.levelText.setPosition(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - this.barHeight - (this.padding * 2)
        );
        this.nameText.setPosition(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - this.barHeight - (this.padding * 3) - this.levelText.height
        );
    }

    public addExp(value: number): void {
        this.currentExp += value;
        if (this.currentExp >= this.expToNextLevel) {
            eventsCenter.emit('level-up', this.currentLevel + 1);
            this.currentExp = this.currentExp % this.expToNextLevel;
            this.currentLevel++;
            this.expToNextLevel = Scaling.expToNextLevel(this.currentLevel);
            this.levelText.setText(`Lv${this.currentLevel}`);
        }
        this.drawBackGroundAndBar();
    }

    public drawBackGroundAndBar(): void {
        let camWidth = this.scene.cameras.main.width;
        let camHeight = this.scene.cameras.main.height;

        let x = this.padding;
        let y = camHeight - this.barHeight - this.padding;
        let width = camWidth - (2 * this.padding);
        this.bar.clear();

        //  Background
        this.bar.fillStyle(0x000000, 0.7);
        this.bar.fillRoundedRect(x, y, width, this.barHeight, this.cornerRadius);
        let textWidth = Math.max(this.nameText.width, this.levelText.width) + this.padding * 2 + 20;
        let textHeight = this.nameText.height + this.levelText.height + this.padding * 3;
        this.bar.fillRoundedRect(
            (camWidth - textWidth) / 2,
            camHeight - this.barHeight - textHeight - this.padding,
            textWidth,
            textHeight,
            { tl: this.cornerRadius, tr: this.cornerRadius, bl: 0, br: 0 });

        let leftCurve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2((camWidth - textWidth) / 2 - this.cornerRadius, y),
            new Phaser.Math.Vector2((camWidth - textWidth) / 2, y),
            new Phaser.Math.Vector2((camWidth - textWidth) / 2, y - this.cornerRadius)
        );
        this.bar.fillPoints([...leftCurve.getPoints(), new Phaser.Math.Vector2((camWidth - textWidth) / 2, y)], true);
        let rightCurve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2((camWidth + textWidth) / 2 + this.cornerRadius, y),
            new Phaser.Math.Vector2((camWidth + textWidth) / 2, y),
            new Phaser.Math.Vector2((camWidth + textWidth) / 2, y - this.cornerRadius)
        );
        this.bar.fillPoints([...rightCurve.getPoints(), new Phaser.Math.Vector2((camWidth + textWidth) / 2, y)], true);

        //  Experience
        this.bar.fillStyle(0xFFFF00);
        let fillAmount = Math.floor((this.currentExp / this.expToNextLevel) * (width - 4));
        if (fillAmount) {
            this.bar.fillRoundedRect(x + 2, y + 2, fillAmount, this.barHeight - 4, this.cornerRadius);
        }
    }
}