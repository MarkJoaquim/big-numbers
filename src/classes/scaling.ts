
export class Scaling {
    private static expJumpPerLevel = 0.03;
    private static expJumpPerTenLevels = 0.10;
    private static powerPerLevel = 10;
    private static powerPerTenLevels = 100;

    public static expToNextLevel(currentLevel: number) {
        return Math.ceil(
            50
            * Math.pow(1 + this.expJumpPerLevel, currentLevel)
            * Math.pow(1 + this.expJumpPerTenLevels, this.tens(currentLevel))
        )
    }

    public static basePowerByLevel(currentLevel: number) {
        return 50
            + (currentLevel * this.powerPerLevel)
            + (this.tens(currentLevel) * this.powerPerTenLevels)
    }

    public static baseMoveSpeed(currentLevel: number): number {
        return 100;
    }

    public static baseJump(currentLevel: number): number {
        return -600;
    }

    private static tens(number: number): number {
        return Math.floor(number / 10)
    }    
}