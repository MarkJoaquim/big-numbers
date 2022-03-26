import { EquipmentConfig } from ".";

 
export interface ItemConfig {
    name: string,
    quantity: number,
    equipmentConfig?: EquipmentConfig
}