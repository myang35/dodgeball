import type { Game } from './game';

export abstract class GameObject {
	game: Game;
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(params: { game: Game; x: number; y: number; width: number; height: number }) {
		this.game = params.game;
		this.x = params.x;
		this.y = params.y;
		this.width = params.width;
		this.height = params.height;
	}

	collidesWith(object: GameObject): boolean {
		return !(
			this.x + this.width < object.x ||
			this.x > object.x + object.width ||
			this.y + this.height < object.y ||
			this.y > object.y + object.height
		);
	}
}
