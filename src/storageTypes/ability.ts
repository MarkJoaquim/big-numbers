
export enum AbilityName {
    FlashJump = 'flashjump',
    Punch = 'punch',
    Slash = 'slash',
    Magic = 'magic',
    Shoot = 'shoot'
}

export interface AbilityBinding {
    abilityName: AbilityName,
    keyCode?: number,
    keyName?: string
}