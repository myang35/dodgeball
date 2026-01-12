import { clamp } from '../_utils/clamp';
import type { Ball } from './ball';
import type { Game } from './game';
import { GameObject } from './game-object';

type PlayArea = { top: number; right: number; bottom: number; left: number };

type Controls = {
	up: string;
	down: string;
	left: string;
	right: string;
	throw: string;
};

type throwDirection = {
	x: number;
	y: number;
};

export class Player extends GameObject {
	static DEFAULT_SIZE = 50;

	initialPosition = {
		x: this.x,
		y: this.y
	};

	color: string;
	controls: Controls;
	playArea: PlayArea;
	throwDirection: throwDirection;
	throwPower: number;
	speed: number = 50;
	maxVelocity: number = 800;
	xVelocity: number = 0;
	yVelocity: number = 0;
	drag: number = 0.05; // 0-100 percentage
	holdingBall: Ball | null = null;
	isDead: boolean = false;
	keys = {
		up: {
			isPressing: false
		},
		down: {
			isPressing: false
		},
		left: {
			isPressing: false
		},
		right: {
			isPressing: false
		}
	};
	eventListeners: {
		keydown: (event: KeyboardEvent) => void;
		keyup: (event: KeyboardEvent) => void;
	};

	constructor(params: {
		game: Game;
		x: number;
		y: number;
		color: string;
		controls: Controls;
		playArea: PlayArea;
		throwDirection: throwDirection;
	}) {
		super({
			game: params.game,
			x: params.x,
			y: params.y,
			width: Player.DEFAULT_SIZE,
			height: Player.DEFAULT_SIZE
		});
		this.color = params.color;
		this.controls = params.controls;
		this.playArea = params.playArea;
		this.throwDirection = params.throwDirection;
		this.throwPower = this.game.field.width;
		this.eventListeners = {
			keydown: (event) => {
				if (this.isDead) return;

				switch (event.key) {
					case this.controls.up:
						this.keys.up.isPressing = true;
						break;
					case this.controls.down:
						this.keys.down.isPressing = true;
						break;
					case this.controls.left:
						this.keys.left.isPressing = true;
						break;
					case this.controls.right:
						this.keys.right.isPressing = true;
						break;
					case this.controls.throw:
						if (!this.holdingBall) return;

						this.holdingBall.throw(
							this.xVelocity + this.throwPower * this.throwDirection.x,
							this.yVelocity + this.throwPower * this.throwDirection.y
						);
						this.holdingBall = null;
						break;
				}
			},
			keyup: (event) => {
				switch (event.key) {
					case this.controls.up:
						this.keys.up.isPressing = false;
						break;
					case this.controls.down:
						this.keys.down.isPressing = false;
						break;
					case this.controls.left:
						this.keys.left.isPressing = false;
						break;
					case this.controls.right:
						this.keys.right.isPressing = false;
						break;
				}
			}
		};
	}

	addKeyboardListeners() {
		window.addEventListener('keydown', this.eventListeners.keydown);
		window.addEventListener('keyup', this.eventListeners.keyup);
	}

	removeKeyboardListeners() {
		window.removeEventListener('keydown', this.eventListeners.keydown);
		window.removeEventListener('keyup', this.eventListeners.keyup);
	}

	update(deltaTime: number) {
		if (this.isDead) return;

		const xDirection = (this.keys.right.isPressing ? 1 : 0) - (this.keys.left.isPressing ? 1 : 0);
		const yDirection = (this.keys.down.isPressing ? 1 : 0) - (this.keys.up.isPressing ? 1 : 0);

		this.xVelocity += xDirection * this.speed;
		this.yVelocity += yDirection * this.speed;

		this.xVelocity = clamp(this.xVelocity, -this.maxVelocity, this.maxVelocity);
		this.yVelocity = clamp(this.yVelocity, -this.maxVelocity, this.maxVelocity);

		this.x += this.xVelocity * deltaTime;
		this.y += this.yVelocity * deltaTime;

		this.x = clamp(this.x, this.playArea.left, this.playArea.right - this.width);
		this.y = clamp(this.y, this.playArea.top, this.playArea.bottom - this.height);

		this.xVelocity *= clamp(1 - this.drag, 0, 1);
		this.yVelocity *= clamp(1 - this.drag, 0, 1);

		this.game.balls.forEach((ball) => {
			if (this.collidesWith(ball)) {
				if (!ball.thrower && !this.holdingBall) {
					ball.setThrower(this);
				} else if (ball.thrower && ball.thrower !== this) {
					this.isDead = true;
				}
			}
		});
	}

	render(context: CanvasRenderingContext2D) {
		if (this.isDead) {
			context.fillStyle = '#555555';
		} else {
			context.fillStyle = this.color;
		}
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	reset() {
		this.x = this.initialPosition.x;
		this.y = this.initialPosition.y;
		this.isDead = false;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.holdingBall = null;
	}
}
