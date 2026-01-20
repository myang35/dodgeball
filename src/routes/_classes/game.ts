import { Ball } from './ball';
import { Player } from './player';

export class Game {
	canvas: HTMLCanvasElement;
	players: Player[] = [];
	balls: Ball[] = [];
	countDown: number = 0;
	eventListeners: {
		keydown: (event: KeyboardEvent) => void;
	} = {
		keydown: (event) => {
			if (event.key === 'r') {
				this.reset();
			}
		}
	};

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.canvas.width = canvas.clientWidth;
		this.canvas.height = canvas.clientHeight;

		this.players.push(
			new Player({
				game: this,
				x: 100,
				y: this.canvas.height / 2 - Player.DEFAULT_SIZE / 2,
				color: 'red',
				controls: { up: 'w', down: 's', left: 'a', right: 'd', throw: ' ' },
				playArea: {
					top: 0,
					right: this.canvas.width / 2 - 2,
					bottom: this.canvas.height,
					left: 0
				},
				throwDirection: { x: 1, y: 0 }
			})
		);
		this.players.push(
			new Player({
				game: this,
				x: this.canvas.width - 100 - Player.DEFAULT_SIZE,
				y: this.canvas.height / 2 - Player.DEFAULT_SIZE / 2,
				color: 'blue',
				controls: {
					up: 'ArrowUp',
					down: 'ArrowDown',
					left: 'ArrowLeft',
					right: 'ArrowRight',
					throw: 'Enter'
				},
				playArea: {
					top: 0,
					right: this.canvas.width,
					bottom: this.canvas.height,
					left: this.canvas.width / 2 + 2
				},
				throwDirection: { x: -1, y: 0 }
			})
		);

		this.balls.push(
			new Ball({
				game: this,
				x: this.canvas.width * 0.5 - Ball.DEFAULT_SIZE * 0.5,
				y: this.canvas.height * 0.25 - Ball.DEFAULT_SIZE * 0.5
			}),
			new Ball({
				game: this,
				x: this.canvas.width * 0.5 - Ball.DEFAULT_SIZE * 0.5,
				y: this.canvas.height * 0.5 - Ball.DEFAULT_SIZE * 0.5
			}),
			new Ball({
				game: this,
				x: this.canvas.width * 0.5 - Ball.DEFAULT_SIZE * 0.5,
				y: this.canvas.height * 0.75 - Ball.DEFAULT_SIZE * 0.5
			})
		);
		this.render();
	}

	get context() {
		return this.canvas.getContext('2d')!;
	}

	start() {
		this.startCountDown();
		window.addEventListener('keydown', this.eventListeners.keydown);

		this.players.forEach((player) => player.addKeyboardListeners());
		this.run();
	}

	stop() {
		this.players.forEach((player) => player.removeKeyboardListeners());
		window.removeEventListener('keydown', this.eventListeners.keydown);
	}

	reset() {
		this.players.forEach((player) => player.reset());
		this.balls.forEach((ball) => ball.reset());
		this.startCountDown();
	}

	private startCountDown() {
		this.countDown = 3;
		const interval = setInterval(() => {
			this.countDown -= 1;
			if (this.countDown <= 0) {
				clearInterval(interval);
			}
		}, 1000);
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

		if (this.countDown <= 0) {
			this.update(deltaTime);
		}
		this.render();

		window.requestAnimationFrame((newTime) => this.run(newTime, currentTime));
	}

	private update(deltaTime: number) {
		this.players.forEach((player) => player.update(deltaTime));
		this.balls.forEach((ball) => ball.update(deltaTime));
	}

	private render() {
		this.renderBackground();
		this.renderField();
		this.players.forEach((player) => player.render(this.context));
		this.balls.forEach((ball) => ball.render(this.context));

		if (this.countDown > 0) {
			this.renderCountDown();
		}

		if (this.players.find((player) => player.isDead)) {
			const winner = this.players.find((player) => !player.isDead);
			if (winner) {
				const playerName = winner.color.charAt(0).toUpperCase() + winner.color.slice(1);
				this.renderGameOver(`${playerName} wins`, winner.color);
			} else {
				this.renderGameOver('Tied', 'gray');
			}
		}
	}

	private renderBackground() {
		this.context.fillStyle = '#020202';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private renderField() {
		this.context.fillStyle = '#101828';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.strokeStyle = '#374151';
		this.context.lineWidth = 4;
		this.context.strokeRect(2, 2, this.canvas.width - 2, this.canvas.height - 2);
		this.context.beginPath();
		this.context.moveTo(this.canvas.width / 2, 0);
		this.context.lineTo(this.canvas.width / 2, this.canvas.height);
		this.context.stroke();
	}

	private renderCountDown() {
		this.context.textAlign = 'center';
		this.context.fillStyle = 'white';
		this.context.font = '96px sans-serif';
		this.context.fillStyle = 'rgba(230, 230, 230, 0.9)';
		this.context.fillText(`Starting in ${this.countDown}`, this.canvas.width / 2, 100);
		this.context.strokeStyle = '#d8d8d8';
		this.context.lineWidth = 2;
		this.context.strokeText(`Starting in ${this.countDown}`, this.canvas.width / 2, 100);
	}

	private renderGameOver(message: string, color: string) {
		this.context.textAlign = 'center';
		this.context.font = '96px sans-serif';
		this.context.fillStyle = 'rgba(230, 230, 230, 0.9)';
		this.context.fillText(`${message}`, this.canvas.width / 2, 100);
		this.context.strokeStyle = color;
		this.context.lineWidth = 2;
		this.context.strokeText(`${message}`, this.canvas.width / 2, 100);

		this.context.font = '48px sans-serif';
		this.context.fillStyle = 'rgba(230, 230, 230, 0.9)';
		this.context.fillText(`Press R to Restart`, this.canvas.width / 2, 175);
		this.context.strokeStyle = '#555555';
		this.context.lineWidth = 2;
		this.context.strokeText(`Press R to Restart`, this.canvas.width / 2, 175);
	}
}
