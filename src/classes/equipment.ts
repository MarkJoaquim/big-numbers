import { Scene } from "phaser";
import { EquipmentConfig, BonusStat, EquipmentType, WeaponType } from "../storageTypes";
import { Cosmetic } from "./cosmetic";


export class Equipment extends Cosmetic {
    private config: EquipmentConfig;
    public isWeapon: boolean;
    
    constructor(scene: Scene, config: EquipmentConfig) {
        super(scene, config.texture);

        this.isWeapon = config.type == EquipmentType.Weapon;
        this.config = config;
    }

    public static filterWeapons(equips: Equipment[]): Equipment[] {
        return equips.filter(e => e.config.type !== EquipmentType.Weapon);
    }

    public static findWeapon(equips: Equipment[], type: WeaponType): Equipment | undefined {
        return equips.find(e => e.config.type == EquipmentType.Weapon && e.config.weaponType == type)
    }

    public getConfig(): EquipmentConfig {
        return this.config;
    }
    public getSpeed(): number {
        return (this.config.baseStats.moveSpeed ?? 0) + (this.config.upgradeStats.moveSpeed ?? 0);
    }
    public getJump(): number {
        return (this.config.baseStats.jumpSpeed ?? 0) + (this.config.upgradeStats.jumpSpeed ?? 0);
    }
    public getPower(): number {
        return (this.config.baseStats.power ?? 0)
            + (this.config.upgradeStats.power ?? 0)
    }
    public getPowerMultiplier(): number {
        return this.getTotalBonusStat(BonusStat.Power);
    }
    public getCooldownMultiplier(): number {
        return (1 - (this.config.baseStats.cooldownReduction ?? 0))
            * (1 - (this.config.upgradeStats.cooldownReduction ?? 0))
            * this.getTotalBonusStat(BonusStat.CooldownReduction);
    }

    private getTotalBonusStat(stat: BonusStat): number {
        return this.config.bonusStats.filter(s => s.stat === stat).reduce((prev: number, s) => prev * (1 + s.percent), 1);
    }

    public initAnimations(): void {
        if (this.config.type === EquipmentType.Weapon) {
            this.initWeaponAnims(this.config.weaponType!);
        } else {
            super.initAnimations();
        }
    }

    private initWeaponAnims(weaponType: WeaponType): void {
        this.anims.create({
            key: `walk`,
            frames: this.scene.anims.generateFrameNames(this.textureName, {
                prefix: `walk-`,
                end: 3,
            }),
            frameRate: 8,
        });

        switch (weaponType) {
            case WeaponType.Sword: {
                this.anims.create({
                    key: `sword`,
                    frames: this.scene.anims.generateFrameNames(this.textureName, {
                        prefix: `sword-`,
                        end: 3,
                    }),
                  frameRate: 8,
                });
                break;
            }
            case WeaponType.Magic: {
                this.anims.create({
                    key: `magic`,
                    frames: this.scene.anims.generateFrameNames(this.textureName, {
                        prefix: `magic-`,
                        end: 2,
                    }),
                    frameRate: 8,
                });
                break;
            }
            case WeaponType.Bow: {
                this.anims.create({
                    key: `bow`,
                    frames: this.scene.anims.generateFrameNames(this.textureName, {
                        prefix: `bow-`,
                        end: 2,
                    }),
                    frameRate: 8,
                });
                break;
            }
        }
    }
}