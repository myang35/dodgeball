import type { Game } from './game';
import { GameObject } from './game-object';
import type { Player } from './player';

export class Ball extends GameObject {
	static DEFAULT_SIZE = 50;

	initialPosition = {
		x: this.x,
		y: this.y
	};
	container = {
		top: 0,
		right: this.game.canvas.width,
		bottom: this.game.canvas.height,
		left: 0
	};
	velocity = {
		x: 0,
		y: 0
	};
	drag = 0.008; // 0-1 percentage
	wallFriction = 0.5; // 0-1 percentage
	color: string = '#dddddd';
	thrower: Player | null = null;
	isThrown: boolean = false;

	constructor(params: { game: Game; x: number; y: number }) {
		super({
			game: params.game,
			x: params.x,
			y: params.y,
			width: Ball.DEFAULT_SIZE,
			height: Ball.DEFAULT_SIZE
		});
	}

	update(deltaTime: number) {
		this.velocity.x = this.velocity.x * (1 - this.drag);
		this.velocity.y = this.velocity.y * (1 - this.drag);

		this.x += this.velocity.x * deltaTime;
		this.y += this.velocity.y * deltaTime;

		if (this.x <= this.container.left) {
			this.x = this.container.left;
			this.velocity.x = -this.velocity.x * (1 - this.wallFriction);
			if (!this.thrower) {
				this.setThrowable();
			} else if (!this.thrower.holdingBall) {
				this.setThrowable();
			}
		}
		if (this.x + this.width >= this.container.right) {
			this.x = this.container.right - this.width;
			this.velocity.x = -this.velocity.x * (1 - this.wallFriction);
			if (!this.thrower) {
				this.setThrowable();
			} else if (!this.thrower.holdingBall) {
				this.setThrowable();
			}
		}
		if (this.y <= this.container.top) {
			this.y = this.container.top;
			this.velocity.y = -this.velocity.y * (1 - this.wallFriction);
		}
		if (this.y + this.height >= this.container.bottom) {
			this.y = this.container.bottom - this.height;
			this.velocity.y = -this.velocity.y * (1 - this.wallFriction);
		}

		if (this.thrower) {
			if (!this.isThrown) {
				this.x = this.thrower.x + this.thrower.width / 2 - this.width / 2;
				this.y = this.thrower.y + this.thrower.height / 2 - this.height / 2;
			} else {
				if (!this.isMoving()) {
					this.setThrowable();
				}
			}
		}
	}

	render(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
		context.fill();

		context.lineWidth = 4;
		if (this.thrower) {
			context.strokeStyle = this.thrower.color;
		} else {
			context.strokeStyle = '#888888';
		}
		context.stroke();
	}

	setThrowable() {
		this.thrower = null;
		this.isThrown = false;
	}

	setThrower(thrower: Player) {
		this.thrower = thrower;
		this.thrower.holdingBall = this;
		this.isThrown = false;
	}

	throw(x: number, y: number) {
		this.velocity.x += x;
		this.velocity.y += y;
		this.isThrown = true;
	}

	reset() {
		this.x = this.initialPosition.x;
		this.y = this.initialPosition.y;
		this.velocity = { x: 0, y: 0 };
		this.thrower = null;
		this.isThrown = false;
	}

	isMoving(): boolean {
		return (
			this.velocity.x > 100 ||
			this.velocity.x < -100 ||
			this.velocity.y > 100 ||
			this.velocity.y < -100
		);
	}
}
