type Container = { top: number; right: number; bottom: number; left: number };

type Controls = {
	up: string;
	down: string;
	left: string;
	right: string;
};

export class Player {
	static DEFAULT_SIZE = 50;

	x: number;
	y: number;
	color: string;
	controls: Controls;
	container: Container;
	size: number = Player.DEFAULT_SIZE;
	speed: number = 50;
	maxVelocity: number = 800;
	xVelocity: number = 0;
	yVelocity: number = 0;
	dead: boolean = false;
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
		x: number;
		y: number;
		color: string;
		controls: Controls;
		container: Container;
	}) {
		this.x = params.x;
		this.y = params.y;
		this.color = params.color;
		this.controls = params.controls;
		this.container = params.container;
		this.eventListeners = {
			keydown: (event) => {
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

	start() {
		window.addEventListener('keydown', this.eventListeners.keydown);
		window.addEventListener('keyup', this.eventListeners.keyup);
	}

	stop() {
		window.removeEventListener('keydown', this.eventListeners.keydown);
		window.removeEventListener('keyup', this.eventListeners.keyup);
	}

	update(deltaTime: number) {
		if (this.dead) return;

		const xDirection = (this.keys.right.isPressing ? 1 : 0) - (this.keys.left.isPressing ? 1 : 0);
		const yDirection = (this.keys.down.isPressing ? 1 : 0) - (this.keys.up.isPressing ? 1 : 0);

		this.xVelocity += xDirection * this.speed;
		this.yVelocity += yDirection * this.speed;

		this.xVelocity = this.clamp(this.xVelocity, -this.maxVelocity, this.maxVelocity);
		this.yVelocity = this.clamp(this.yVelocity, -this.maxVelocity, this.maxVelocity);

		this.x += this.xVelocity * deltaTime;
		this.y += this.yVelocity * deltaTime;

		this.x = this.clamp(this.x, this.container.left, this.container.right - this.size);
		this.y = this.clamp(this.y, this.container.top, this.container.bottom - this.size);

		this.xVelocity *= 0.95;
		this.yVelocity *= 0.95;
	}

	render(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.size, this.size);
	}

	private clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}
}
