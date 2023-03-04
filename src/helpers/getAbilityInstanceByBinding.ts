import { AbilityBinding, AbilityName } from "../storageTypes";
import { Ability ,FlashJump, Magic, Punch, Shoot, Slash } from "../classes/abilities"
import { Player } from "../classes/player";
import { TrainingGround } from "../scenes";

export const getAbilityInstanceByBinding = (abilityBinding: AbilityBinding, player: Player, scene: TrainingGround): Ability | undefined => {
    switch (abilityBinding.abilityName) {
        case AbilityName.FlashJump: 
            return new FlashJump(abilityBinding, player, scene);
        case AbilityName.Punch: 
            return new Punch(abilityBinding, player, scene);
        case AbilityName.Slash: 
            return new Slash(abilityBinding, player, scene);
        case AbilityName.Magic: 
            return new Magic(abilityBinding, player, scene);
        case AbilityName.Shoot: 
            return new Shoot(abilityBinding, player, scene);
        default:
            return undefined;
    }
}