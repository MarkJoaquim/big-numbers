import { Input, Physics, Scene } from 'phaser';
import { EVENTS_NAME } from '../consts';
import eventsCenter from '../helpers/eventsCenter';
import { getAbilityInstanceByBinding } from '../helpers/getAbilityInstanceByBinding';
import { TrainingGround } from '../scenes';
import { AbilityBinding, PlayerConfig, Stats, WeaponType } from '../storageTypes';
import { Ability } from './abilities/ability';
import { Cosmetic } from './cosmetic';
import { Equipment } from './equipment';
import { Scaling } from './scaling';

export class Player extends Phaser.GameObjects.Container {
	public abilities: Ability[] = [];
	public scaleFactor: number = 1;
	public isCasting: boolean = false;
	public flashJumpCountSinceLastGroundTouch: number = 0;
	public facingRight: boolean = true;
	private cosmetics: Cosmetic[];
	private equipment: Equipment[];
	private weapons: Equipment[];
	private playerData: PlayerConfig;
	private xOffset: number = -4;
	private yOffset: number = -8;
	private cursor: {
		up: Input.Keyboard.Key,
		down: Input.Keyboard.Key,
		left: Input.Keyboard.Key,
		right: Input.Keyboard.Key,
		space: Input.Keyboard.Key,
		shift: Input.Keyboard.Key
	};

	constructor(scene: Scene, config: PlayerConfig) {
		super(scene, 100, 100);
		this.playerData = config;

		this.cosmetics = this.playerData.cosmetics.map(c => new Cosmetic(this.scene, c.texture));
		this.equipment = this.playerData.equipment.map(e => new Equipment(this.scene, e));
		this.weapons = this.playerData.weapons.map(w => new Equipment(this.scene, w));
		this.weapons.map(w => w.setVisible(false));
		this.cosmetics.push(...this.equipment, ...this.weapons);
		this.add(this.cosmetics);

		// Input
		this.cursor = this.scene.input.keyboard.createCursorKeys();
		this.abilities = this.playerData.abilityBindings
			.filter(ab => ab.keyCode !== undefined)
			.map(ab => getAbilityInstanceByBinding(ab, this, this.scene as TrainingGround))
			.filter(i => i !== undefined) as Ability[]; // remove abilities which failed to be constructed

		// Physics
		scene.physics.add.existing(this);

		this.getBody().setSize(8, 16);
		this.getBody().setOffset(this.xOffset, this.yOffset);
		this.setScale(this.scaleFactor);

		this.getBody().setAllowGravity(true);
		this.getBody().setGravityY(3000);
		this.getBody().setCollideWorldBounds(true);

		// Animations
		this.initAnimations();

		// Events
		eventsCenter.on(EVENTS_NAME.LevelUp, this.levelUp, this);
		eventsCenter.on(EVENTS_NAME.BindingAltered, this.alterAbilityBinding, this)
		scene.input.keyboard.on('keydown', (event: any) => this.abilities.find(a => a.keyCode === event.keyCode)?.cast());

		// Add to scene
		scene.add.existing(this);
	}

	update(): void {
		const maxSpeed = this.getMaxSpeed();
		const jump = this.getJump();
		const accel = maxSpeed / 5;
		const airAccel = accel / 5;

		if (this.getBody().blocked.down) this.flashJumpCountSinceLastGroundTouch = 0;

		if (!this.isCasting) {
			if (this.getBody().blocked.down) {
				// Cap the speed upon touching the ground
				if (Math.abs(this.getBody().velocity.x) > maxSpeed) this.slowToMaxSpeed();

				// If touching the ground and space -> jump
				if (this.cursor.space.isDown) {
					this.getBody().velocity.y = jump;
					this.setCosmeticFrame('jump');
				}

				// ground acceleration
				if (this.cursor.left?.isDown != this.cursor.right?.isDown) {
					this.playCosmeticAnim('walk', true);
					this.setFacingRight(this.cursor.right.isDown);
					this.getBody().velocity.x = this.cursor.right.isDown ?
						Math.min(maxSpeed, this.getBody().velocity.x + accel) :
						Math.max(-maxSpeed, this.getBody().velocity.x - accel)
				} else if (this.cursor.down.isDown) {
					this.setCosmeticFrame('duck');
					this.decelerate();
				} else {
					this.setCosmeticFrame('idle');
					this.decelerate();
				}
			} else {
				this.setCosmeticFrame('jump');

				if (this.cursor.left?.isDown) {
					this.getBody().velocity.x = Math.min(this.getBody().velocity.x, Math.max(-maxSpeed * 0.5, this.getBody().velocity.x - airAccel));
					this.setFacingRight(false);
				} else if (this.cursor.right?.isDown) {
					this.getBody().velocity.x = Math.max(this.getBody().velocity.x, Math.min(maxSpeed * 0.5, this.getBody().velocity.x + airAccel));
					this.setFacingRight(true);
				}
			}
		} else {
			this.decelerate()
		}
	}

	public levelUp(level: number) {
		if (level === this.playerData.level + 1) {
			this.playerData.level = level;
		}
	}

	public alterAbilityBinding(ab: AbilityBinding) {
		const alteredBinding = this.abilities.find(a => a.abilityName === ab.abilityName);
		if (alteredBinding) {
			alteredBinding.keyCode = ab.keyCode!;
		}
	}

	public setWeapon(type?: WeaponType): boolean {
		this.weapons.map(w => w.setVisible(false));

		if (!type) {
			return true;
		} else {
			const weapon = this.weapons.find(w => w.getConfig().weaponType === type);
			if (weapon) {
				weapon.setVisible(true);
				return true;
			}
			return false;
		}

	}

	public getRandomPower(): number {
		const totalPower = this.getPower();
		const randomAmount = Phaser.Math.RND.between(-totalPower / 10, totalPower / 10);
		return totalPower + randomAmount;
	}

	public getBody(): Physics.Arcade.Body {
		return this.body as Physics.Arcade.Body;
	}

	public getMaxSpeed(): number {
		return Scaling.baseMoveSpeed(this.playerData.level) + this.equipment.reduce((prev: number, curr: Equipment) => prev + curr.getSpeed(), 0);
	}

	public getJump(): number {
		return Scaling.baseJump(this.playerData.level) + this.equipment.reduce((prev: number, curr: Equipment) => prev + curr.getJump(), 0);
	}

	public getPower(): number {
		return Scaling.basePowerByLevel(this.playerData.level)
			+ this.equipment.reduce((prev: number, curr: Equipment) => prev + curr.getPower(), 0)
			+ this.equipment.reduce((prev: number, curr: Equipment) => prev * curr.getPowerMultiplier(), 1);
	}

	public getCooldownMultiplier(): number {
		return this.equipment.reduce((prev: number, curr: Equipment) => prev * curr.getCooldownMultiplier(), 1);
	}

	public applyForce(x: number, y: number, forwardBackward?: boolean) {
		if (forwardBackward) {
			this.getBody().velocity.x += this.facingRight ? x : -1 * x;
		}
		this.getBody().velocity.y += y;
	}

	private slowToMaxSpeed(): void {
		const xVel = this.getBody().velocity.x;
		let direction = xVel === 0 ? 0 : xVel / Math.abs(xVel);

		this.getBody().velocity.x = Math.abs(this.getMaxSpeed()) * direction;
	}

	private decelerate(): void {
		let absVelocity = Math.abs(this.getBody().velocity.x)
		if (absVelocity !== 0) {
			let direction = this.getBody().velocity.x / absVelocity;
			this.getBody().setVelocityX(direction * Math.max(0, absVelocity - 30));
		}
	}

	protected checkFlip(): void {
		[...this.cosmetics, ...this.weapons].map(c => c.setFlipX(!this.facingRight));
	}

	private setFacingRight(facingRight: boolean): void {
		this.facingRight = facingRight;
		this.checkFlip();
		if (facingRight) {
			this.getBody().setOffset(this.xOffset, this.yOffset);
		} else {
			this.getBody().setOffset(this.xOffset, this.yOffset);
		}
	}

	public bodyAnimOnce(event: string, callback: (animation: Phaser.Animations.Animation, frame: string) => void, context: any): void {
		this.getAt(0).once(event, callback, context);
	}

	public playCosmeticAnim(key: string, ignoreIfPlaying?: boolean) {
		this.cosmetics.map(c => c.playAnim(key, ignoreIfPlaying));
	}

	public setCosmeticFrame(frame: string) {
		this.cosmetics.map(c => c.setFrameFromPlayer(frame));
	}

	private initAnimations(): void {
		[...this.cosmetics, ...this.weapons].map(c => c.initAnimations());
	}
}
