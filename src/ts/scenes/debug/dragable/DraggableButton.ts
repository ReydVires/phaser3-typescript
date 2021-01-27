import { Transform } from "../../../modules/gameobjects/components/Transform";

type OnClick = (gameObject: Phaser.GameObjects.Sprite) => void;

export const enum Props {
	onClick = "onClick",
	typeOf = "typeOf",
};

export class DraggableButton {

	private _gameObject: Phaser.GameObjects.Sprite;
	private _transform: Transform;

	constructor (private _scene: Phaser.Scene, x: number, y: number, texture: string, frame = 0) {
		this._gameObject = _scene.add.sprite(x, y, texture, frame).setData(Props.typeOf, DraggableButton);
		this._transform = new Transform(_scene, this._gameObject);
	}

	onClick (callback: OnClick): void {
		const localCallback = (go: Phaser.GameObjects.Sprite): void => {
			const scaleY = this._gameObject.scaleY;
			this._scene.tweens.add({
				targets: [this._gameObject],
				props: {
					scale: { getStart: () => scaleY, getEnd: () => scaleY * 0.9 }
				},
				yoyo: true,
				duration: 45,
				onComplete: () => callback(go),
			});
		};
		this._gameObject.setData(Props.onClick, localCallback);
	}

	get gameObject (): Phaser.GameObjects.Image { return this._gameObject; }

	get transform (): Transform { return this._transform; }

}