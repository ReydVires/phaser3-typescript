import { Transform } from "./components/Transform";
import { GraphicsButton, TextureInfo } from "./components/GraphicsButton";

export class Button {

	private _gameObject: GraphicsButton;
	private _transform: Transform;

	constructor (private _scene: Phaser.Scene, x: number, y: number, label: string, style?: Phaser.Types.GameObjects.Text.TextStyle, textureInfo?: TextureInfo) {
		this._gameObject = new GraphicsButton(_scene, x, y, label, style, textureInfo);
		this._transform = new Transform(_scene, this._gameObject.sprite);
	}

	get gameObject (): GraphicsButton {
		return this._gameObject;
	}

	get transform (): Transform {
		return this._transform;
	}

}