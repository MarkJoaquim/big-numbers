import { AbilityBinding, CosmeticConfig, EquipmentConfig, ItemConfig } from ".";

export interface PlayerConfig {
    name: string,
    level: number,
    exp: number,
    cosmetics: CosmeticConfig[],
    equipment: EquipmentConfig[],
    weapons: EquipmentConfig[],
    abilityBindings: AbilityBinding[],
    inventory: ItemConfig[]
}