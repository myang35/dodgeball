import { Player } from './player';

export class Game {
	canvas: HTMLCanvasElement;
	field: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	players: Player[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.field = {
			x: this.canvas.width * 0.1,
			y: this.canvas.height * 0.1,
			width: this.canvas.width * 0.8,
			height: this.canvas.height * 0.8
		};

		this.players.push(
			new Player({
				x: this.field.x + 100,
				y: this.field.y + this.field.height / 2 - Player.DEFAULT_SIZE / 2,
				color: 'red',
				controls: { up: 'w', down: 's', left: 'a', right: 'd' },
				container: {
					top: this.field.y,
					right: this.field.x + this.field.width / 2 - 2,
					bottom: this.field.y + this.field.height,
					left: this.field.x
				}
			})
		);
		this.players.push(
			new Player({
				x: this.field.x + this.field.width - 100 - Player.DEFAULT_SIZE,
				y: this.field.y + this.field.height / 2 - Player.DEFAULT_SIZE / 2,
				color: 'blue',
				controls: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
				container: {
					top: this.field.y,
					right: this.field.x + this.field.width,
					bottom: this.field.y + this.field.height,
					left: this.field.x + this.field.width / 2 + 2
				}
			})
		);
	}

	get context() {
		return this.canvas.getContext('2d')!;
	}

	start() {
		this.players.forEach((player) => player.start());
		this.run();
	}

	stop() {
		this.players.forEach((player) => player.stop());
	}

	private run(currentTime: number = 0, lastTime: number = 0) {
		if (currentTime === 0) {
			window.requestAnimationFrame((newTime) => this.run(newTime));
			return;
		}

		if (lastTime === 0) {
			lastTime = currentTime;
		}

		const deltaTime = (currentTime - lastTime) / 1000;

		this.update(deltaTime);
		this.render();

		window.requestAnimationFrame((newTime) => this.run(newTime, currentTime));
	}

	private update(deltaTime: number) {
		this.players.forEach((player) => player.update(deltaTime));
	}

	private render() {
		this.renderBackground();
		this.renderField();
		this.players.forEach((player) => player.render(this.context));

		// this.context.fillStyle = 'white';
		// this.context.font = '48px sans-serif';
		// this.context.fillText('Hello, Svelte!', 50, 100);
	}

	private renderBackground() {
		this.context.fillStyle = '#020202';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private renderField() {
		this.context.fillStyle = '#101828';
		this.context.fillRect(this.field.x, this.field.y, this.field.width, this.field.height);

		this.context.strokeStyle = '#374151';
		this.context.lineWidth = 4;
		this.context.strokeRect(
			this.field.x - 2,
			this.field.y - 2,
			this.field.width + 4,
			this.field.height + 4
		);
		this.context.moveTo(this.field.x + this.field.width / 2, this.field.y);
		this.context.lineTo(this.field.x + this.field.width / 2, this.field.y + this.field.height);
		this.context.stroke();
	}
}
