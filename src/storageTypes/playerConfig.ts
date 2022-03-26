import { AbilityName, CosmeticConfig, EquipmentConfig, ItemConfig } from ".";

export interface PlayerConfig {
    name: string,
    level: number,
    exp: number,
    cosmetics: CosmeticConfig[],
    equipment: EquipmentConfig[],
    weapons: EquipmentConfig[],
    abilityBindings: {
        abilityName: AbilityName,
        keyCode?: string
    }[],
    inventory: ItemConfig[]
}