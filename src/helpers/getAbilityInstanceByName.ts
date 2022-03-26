import { AbilityName } from "../storageTypes";
import { Ability ,FlashJump, Magic, Punch, Shoot, Slash } from "../classes/abilities"
import { Player } from "../classes/player";
import { TrainingGround } from "../scenes";

export const getAbilityInstanceByName = (abilityName: AbilityName, keyCode: string, player: Player, scene: TrainingGround): Ability | undefined => {
    switch (abilityName) {
        case AbilityName.FlashJump: 
            return new FlashJump(keyCode, player, scene);
        case AbilityName.Punch: 
            return new Punch(keyCode, player, scene);
        case AbilityName.Slash: 
            return new Slash(keyCode, player, scene);
        case AbilityName.Magic: 
            return new Magic(keyCode, player, scene);
        case AbilityName.Shoot: 
            return new Shoot(keyCode, player, scene);
        default:
            return undefined;
    }
}