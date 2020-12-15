import { Transform } from "../Transform";
import { Text } from "../Text";

type GraphicsInfo = {
	width?: number,
	height?: number,
	fill?: number,
	alpha?: number,
	radius?: number,
};

type LabelData = {
	content: string,
	style?: Phaser.Types.GameObjects.Text.TextStyle
};

type ToggleFunction = (isOn: boolean) => void;
type ButtonEvent = {
	on: Function,
	once: Function,
	toggle: (callback: ToggleFunction) => void,
	off: Function
};

const enum EventNames {
	onClick = "onClick",
};

const enum Props {
	onToggle = "onToggle",
};

export class GraphicsButton {

	click: ButtonEvent;

	private readonly _textureKey: string;
	private _event: Phaser.Events.EventEmitter;

	private _graphicsInfo: GraphicsInfo;
	private _labelData: LabelData;

	private _transform: Transform;
	private _sprite: Phaser.GameObjects.Image;
	private _label: Text;
	private _gameObject: Phaser.GameObjects.Container;

	constructor (private _scene: Phaser.Scene, x: number, y: number, label = "", style?: Phaser.Types.GameObjects.Text.TextStyle, graphicsInfo?: GraphicsInfo) {
		this._event = new Phaser.Events.EventEmitter();
		this._textureKey = "BUTTON_TEXTURE_" + this.randomStringKey();

		this._graphicsInfo = {
			width: (graphicsInfo?.width) ?? 128,
			height: (graphicsInfo?.height) ?? 64,
			fill: (graphicsInfo?.fill) ?? 0xfafafa,
			alpha: (graphicsInfo?.alpha) ?? 1,
			radius: (graphicsInfo?.radius) ?? 10
		};
		this._labelData = { content: label, style: style };
		this._gameObject = this._scene.add.container(x, y);

		this.generateTexture()
			.create()
			.setInteractive()
			.clickActionEvent();
	}

	private randomStringKey (): string {
		return (+new Date * Math.random()).toString(36).substring(2, 7).toUpperCase();
	}

	private generateTexture (): this {
		this._scene.make.graphics({ x: 0, y: 0, add: false})
			.fillStyle(this._graphicsInfo.fill!, this._graphicsInfo.alpha)
			.fillRoundedRect(0, 0, this._graphicsInfo.width!, this._graphicsInfo.height!, this._graphicsInfo.radius)
			.generateTexture(this._textureKey, this._graphicsInfo.width, this._graphicsInfo.height);

		return this;
	}

	private create (): this {
		this._sprite = this._scene.add.image(0, 0, this._textureKey);
		this._transform = new Transform(this._sprite);

		this._label = new Text(this._scene, 0, 0, this._labelData.content, this._labelData.style);
		this._label.gameObject.setOrigin(0.5);

		this._gameObject.add([this._sprite, this._label.gameObject]);
		return this;
	}

	private setInteractive (): this {
		const alphaTween = this._scene.tweens.create({
			targets: this._gameObject,
			props: {
				alpha: { getStart: () => this._graphicsInfo.alpha, getEnd: () => this._graphicsInfo.alpha! * 0.8 }
			},
			yoyo: true,
			duration: 45,
		});
		const scaleTween = this._scene.tweens.create({
			targets: this._gameObject,
			props: {
				scale: { getStart: () => 1, getEnd: () => 0.9 }
			},
			yoyo: true,
			duration: 45,
			onComplete: () => this._event.emit(EventNames.onClick),
		});
		this._sprite.setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
			alphaTween.play();
			scaleTween.play();
		});
		return this;
	}

	private clickActionEvent (): void {
		this.click = {
			on: (callback: Function) => {
				this._event.on(EventNames.onClick, callback);
			},
			once: (callback: Function) => {
				this._event.once(EventNames.onClick, () => {
					this._sprite.disableInteractive();
					callback();
				});
			},
			toggle: (callback: (isOn: boolean) => void) => {
				this._event.on(EventNames.onClick, () => {
					const isOn: boolean = this._sprite.getData(Props.onToggle) ?? false;
					callback(isOn);
					this._gameObject.setAlpha(isOn ? 1 : 0.65);
					this._sprite.setData(Props.onToggle, !isOn);
				});
			},
			off: (callback: Function) => {
				this._event.off(EventNames.onClick, callback);
				this._sprite.removeInteractive();
			}
		};
	}

	get gameObject (): Phaser.GameObjects.Container { return this._gameObject; }

	get transform (): Transform { return this._transform; }

	get sprite (): Phaser.GameObjects.Image { return this._sprite; }

	get label (): Text { return this._label; }

	/**
	 * @param x The x origin position of this Game Object.
	 * @param y The y origin position of this Game Object. If not set it will use the x.
	 * @param force Apply to the Game Object position instead of it's origin. Default false.
	 */
	setOrigin (x: number, y: number = x, force = false): void {
		const localX = this._sprite.displayWidth * x;
		const localY = this._sprite.displayHeight * y;
		const targetPos = (new Phaser.Math.Vector2(localX, localY)).add(this._sprite.getTopLeft());
		const deltaPos = (new Phaser.Math.Vector2(this._gameObject.x, this._gameObject.y)).subtract(targetPos);
		const pos = (new Phaser.Math.Vector2(this._sprite.x, this._sprite.y)).add(deltaPos);
		if (force) {
			this._gameObject.setPosition(pos.x, pos.y);
			return;
		}
		this._sprite.setPosition(pos.x, pos.y);
		this._label.gameObject.setPosition(this._sprite.x, this._sprite.y);
	}

}