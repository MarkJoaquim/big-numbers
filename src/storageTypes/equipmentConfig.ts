import { CosmeticConfig, Stats } from "."

export enum WeaponType {
    Sword = 'sword',
    Bow = 'bow',
    Magic = 'magic',
    Any = 'any'
}

export enum EquipmentType {
    Weapon = 'weapon',
    Hat = 'hat',
    Overall = 'overall',
    Shoes = 'shoes'
}

export enum BonusStat {
    BossDmg,
    MobDmg,
    CritChance,
    Power,
    CooldownReduction
}

export interface EquipmentConfig extends CosmeticConfig {
    type: EquipmentType,
    weaponType?: WeaponType,
    upgradeSlots: number,
    successfulUpgrades: number,
    baseStats: Stats,
    upgradeStats: Stats,
    bonusStats: {
        stat: BonusStat,
        percent: number
    }[]
}
