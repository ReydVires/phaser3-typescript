import { Transform } from "./components/Transform";

export class Text {

	private _gameObject: Phaser.GameObjects.Text;
	private _transform: Transform;

	constructor (private _scene: Phaser.Scene, x: number, y: number, text: string, style?: Phaser.Types.GameObjects.Text.TextStyle) {
		this._gameObject = _scene.add.text(x, y, text, style);
		this._transform = new Transform(_scene, this._gameObject);
	}

	get gameObject (): Phaser.GameObjects.Text { return this._gameObject; }

	get transform (): Transform { return this._transform; }

}