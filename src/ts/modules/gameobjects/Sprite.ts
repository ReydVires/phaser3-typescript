import { Transform } from "./components/Transform";

export class Sprite {

	private _gameObject: Phaser.GameObjects.Sprite;
	private _transform: Transform;

	constructor (private _scene: Phaser.Scene, x: number, y: number, texture: string, frame = 0) {
		this._gameObject = _scene.add.sprite(x, y, texture, frame);
		this._transform = new Transform(_scene, this._gameObject);
	}

	get gameObject (): Phaser.GameObjects.Sprite { return this._gameObject; }

	get transform (): Transform { return this._transform; }

}