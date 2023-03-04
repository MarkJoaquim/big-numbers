import { GameObjects, Scene } from 'phaser';
import { ChevronButton, TextButton, TextInput } from '../../classes/ui';
import { Cosmetic } from '../../classes/cosmetic';
import random from '../../helpers/random';
import { AbilityName, EquipmentType, GameData, WeaponType } from '../../storageTypes';

export class CharacterCreationScene extends Scene {
    private model!: Phaser.GameObjects.Container;
    private name!: TextInput;
    private allBodyNames: string[] = ['player-body-white', 'player-body-brown', 'player-body-blackish', 'player-body-black'];
    private allHeadNames: string[] = ['head-blonde', 'head-brown', 'head-black', 'head-blonde-long'];
    private currentCosmeticSelection!: {
        body: number,
        head: number
    };
    private buttons!: (GameObjects.GameObject|GameObjects.Group)[];

    constructor() {
        super('character-creation');
    }

    create() {
        this.initModel();
        this.initTextInput();
        this.initCamera();
        this.initButtons();
    }

    private initTextInput(): void {
        this.name = new TextInput(this, 0, 180, 32, (name) => this.createCharacter(name));
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
        const textButton = new TextButton(this, 0, 250, 'Create', 16, () => this.createCharacter(this.name.getText()))
        textButton.centerX(0);
        this.buttons = [
            new ChevronButton(this, 250, 100, 50, true, () => this.switchBody(1)),
            new ChevronButton(this, -250, 100, 50, false, () => this.switchBody(-1)),
            new ChevronButton(this, 250, -100, 50, true, () => this.switchHead(1)),
            new ChevronButton(this, -250, -100, 50, false, () => this.switchHead(-1)),
            textButton
        ];
    }

    private switchHead(amount: number): void {
        this.currentCosmeticSelection.head = (this.currentCosmeticSelection.head + amount + this.allHeadNames.length) % this.allHeadNames.length;
        this.updateModel();
    }

    private switchBody(amount: number): void {
        this.currentCosmeticSelection.body = (this.currentCosmeticSelection.body + amount + this.allBodyNames.length) % this.allBodyNames.length;
        this.updateModel();
    }

    private createCharacter(name: string): void {
        if (name) {
            const gameData = this.createStartingGameData(name)
            this.scene.start('training-ground-scene', gameData);
            this.scene.start('ui-scene', gameData);
        }
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

    private createStartingGameData(name: string): GameData {
        return {
            mapName: 'simple-map',
            playerConfig: {
                name: name,
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
                        keyCode: 81,
                        keyName: 'q',
                        abilityName: AbilityName.Punch
                    },
                    {
                        keyCode: 87,
                        keyName: 'w',
                        abilityName: AbilityName.Slash
                    },
                    {
                        keyCode: 69,
                        keyName: 'e',
                        abilityName: AbilityName.Shoot
                    },
                    {
                        keyCode: 82,
                        keyName: 'r',
                        abilityName: AbilityName.Magic
                    },
                    {
                        keyCode: 32,
                        keyName: ' ',
                        abilityName: AbilityName.FlashJump
                    }
                ],
                inventory: []
            }
        }
    }
}
