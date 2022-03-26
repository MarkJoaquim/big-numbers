import { GameObjects, Geom, Scene } from 'phaser';
import { Cosmetic } from '../../classes/cosmetic';
import random from '../../helpers/random';
import { AbilityName, EquipmentType, GameData, WeaponType } from '../../storageTypes';

export class CharacterCreationScene extends Scene {
    private model!: Phaser.GameObjects.Container;
    private name!: Phaser.GameObjects.BitmapText;
    private allBodyNames: string[] = ['player-body-white', 'player-body-brown', 'player-body-blackish', 'player-body-black'];
    private allHeadNames: string[] = ['head-blonde', 'head-brown', 'head-black', 'head-blonde-long'];
    private currentCosmeticSelection!: {
        body: number,
        head: number
    };
    private graphics!: GameObjects.Graphics;
    private buttons!: {
        polygon: Geom.Polygon,
        click: () => void
    }[]

    constructor() {
        super('character-creation');
    }

    create() {
        this.initModel();
        this.initName();
        this.initCamera();
        this.initButtons();
        this.input.keyboard.on('keydown', this.handleKey, this);
        this.input.on('pointerdown', this.handleClick, this);
    }

    update() {
        
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        const x = this.input.activePointer.worldX;
        const y = this.input.activePointer.worldY;
        this.drawButtons(x, y);
        
    }

    private initName(): void {
        this.name = new GameObjects.BitmapText(this, 0, 200, 'dogicapixel', '', 32, 0.5);
        this.add.existing(this.name);
    }

    private initModel(): void {
        this.model = new GameObjects.Container(this, 0, 0);
        this.add.existing(this.model);
        this.model.setScale(20);
        this.randomizeCosmetics();
    }
    
    private initCamera(): void {
        this.cameras.main.startFollow(this.model, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
    }

    private initButtons(): void {
        this.graphics = new GameObjects.Graphics(this)
        this.add.existing(this.graphics);
        this.buttons = [
            { polygon: new Geom.Polygon([-250, 100, -200, 75, -200, 125]), click: () => this.currentCosmeticSelection.body-- },
            { polygon: new Geom.Polygon([250, 100, 200, 75, 200, 125]), click: () => this.currentCosmeticSelection.body++ },
            { polygon: new Geom.Polygon([-250, -100, -200, -75, -200, -125]), click: () => this.currentCosmeticSelection.head-- },
            { polygon: new Geom.Polygon([250, -100, 200, -75, 200, -125]), click: () => this.currentCosmeticSelection.head++ }
        ]
        this.drawButtons();
    }

    private drawButtons(x?: number, y?: number): void {
        this.buttons.map(b => {
            if (x && y && b.polygon.contains(x, y)) {
                this.graphics.fillStyle(0xAAAAAA);
            } else {
                this.graphics.fillStyle(0x888888);
            }
            this.graphics.fillPoints(b.polygon.points, true)
        });
    }

    private handleKey(event: any): void {
        if (event.keyCode === 8 && this.name.text.length > 0) {
            this.name.text = this.name.text.slice(0, this.name.text.length - 1);
        } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
            this.name.text += event.key;
        } else if (event.key === 'Enter' && this.name.text.length > 0) {
            const gameData = this.createStartingGameData()
            this.scene.start('training-ground-scene', gameData);
            this.scene.start('ui-scene', gameData);
        }
        this.name.x = -this.name.width/2;
    }

    private handleClick(pointer: Phaser.Input.Pointer): void {
        this.buttons.find(b => b.polygon.contains(pointer.worldX, pointer.worldY))?.click()
        this.currentCosmeticSelection.body = (this.currentCosmeticSelection.body + this.allBodyNames.length) % this.allBodyNames.length;
        this.currentCosmeticSelection.head = (this.currentCosmeticSelection.head + this.allHeadNames.length) % this.allHeadNames.length;
        this.updateModel();
    }

    private randomizeCosmetics(): void {
        this.currentCosmeticSelection = {
            head: random.between(0, this.allHeadNames.length - 1),
            body: random.between(0, this.allBodyNames.length - 1)
        }
        this.updateModel();
    }

    private updateModel(): void {
        this.model.removeAll(true);
        this.model.add([
            new Cosmetic(this, this.allBodyNames[this.currentCosmeticSelection.body]),
            new Cosmetic(this, this.allHeadNames[this.currentCosmeticSelection.head])
        ]);
    }

    private createStartingGameData(): GameData {
        return {
            mapName: 'simple-map',
            playerConfig: {
                name: this.name.text,
                level: 1,
                exp: 0,
                cosmetics: [
                    {
                        texture: this.allBodyNames[this.currentCosmeticSelection.body]
                    },
                    {
                        texture: this.allHeadNames[this.currentCosmeticSelection.head]
                    }
                ],
                equipment: [],
                weapons: [
                    {
                        texture: 'staff',
                        type: EquipmentType.Weapon,
                        weaponType: WeaponType.Magic,
                        upgradeSlots: 5,
                        successfulUpgrades: 0,
                        baseStats: {
                            power: 10,
                            critChance: 0,
                            moveSpeed: 0,
                            jumpSpeed: 0,
                            dodgeChance: 0,
                            cooldownReduction: 0,
                            additionalHitboxSize: 0,
                            additionalMobsHit: 0
                        },
                        upgradeStats: {},
                        bonusStats: []
                    },
                    {
                        texture: 'sword',
                        type: EquipmentType.Weapon,
                        weaponType: WeaponType.Sword,
                        upgradeSlots: 5,
                        successfulUpgrades: 0,
                        baseStats: {
                            power: 10,
                            critChance: 0,
                            moveSpeed: 0,
                            jumpSpeed: 0,
                            dodgeChance: 0,
                            cooldownReduction: 0,
                            additionalHitboxSize: 0,
                            additionalMobsHit: 0
                        },
                        upgradeStats: {},
                        bonusStats: []
                    },
                    {
                        texture: 'bow',
                        type: EquipmentType.Weapon,
                        weaponType: WeaponType.Bow,
                        upgradeSlots: 5,
                        successfulUpgrades: 0,
                        baseStats: {
                            power: 10,
                            critChance: 0,
                            moveSpeed: 0,
                            jumpSpeed: 0,
                            dodgeChance: 0,
                            cooldownReduction: 0,
                            additionalHitboxSize: 0,
                            additionalMobsHit: 0
                        },
                        upgradeStats: {},
                        bonusStats: []
                    }
                ],
                abilityBindings: [
                    {
                        keyCode: 'Q',
                        abilityName: AbilityName.Punch
                    },
                    {
                        keyCode: 'W',
                        abilityName: AbilityName.Slash
                    },
                    {
                        keyCode: 'E',
                        abilityName: AbilityName.Shoot
                    },
                    {
                        keyCode: 'R',
                        abilityName: AbilityName.Magic
                    },
                    {
                        keyCode: 'SPACE',
                        abilityName: AbilityName.FlashJump
                    }
                ],
                inventory: []
            }
        }
    }
}
