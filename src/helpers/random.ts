

class RandomHelper extends Phaser.Math.RandomDataGenerator {
    constructor() {
        super()
    }

    public chance(percentChance: number): boolean {
        return (this.realInRange(0, 100) <= percentChance);
    }
}

const random = new RandomHelper()

export default random;