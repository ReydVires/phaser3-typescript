import { Transform } from "./components/Transform";

export class Image {

	private _gameObject: Phaser.GameObjects.Image;
	private _transform: Transform;

	constructor (private _scene: Phaser.Scene, x: number, y: number, texture: string, frame = 0) {
		this._gameObject = _scene.add.image(x, y, texture, frame);
		this._transform = new Transform(_scene, this._gameObject);
	}

	get gameObject (): Phaser.GameObjects.Image { return this._gameObject; }

	get transform (): Transform { return this._transform; }

}