export class Game {
	canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	start() {
		const ctx = this.canvas.getContext('2d')!;

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = 'white';
		ctx.font = '48px sans-serif';
		ctx.fillText('Hello, Svelte!', 50, 100);
	}
}
