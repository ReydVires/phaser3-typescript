const BASE_COLOR = 0xfafafa;
const BASE_WIDTH = 128;
const BASE_HEIGHT = 64;
const BASE_RADIUS = 10;
const BASE_STYLE_COLOR = "#000";
const BASE_STYLE_CUSTOM = "bold";
const BASE_STYLE_ALIGN = "center";
const BASE_STYLE_FONT_SIZE = `${32}px`;

const enum EventNames {
	onClick = "onClick",
};

const enum DataProps {
	onToggle = "onToggle",
}

type ToggleFunction = (isOn: boolean) => void;

type Callback<T> = (callback: T) => void;

type ActionEvent = {
	on: Callback<Function>,
	once: Callback<Function>,
	toggle: Callback<ToggleFunction>,
	off: Callback<Function>
};

export type TextureInfo = {
	width?: number,
	height?: number,
	color?: number,
	radius?: number,
}

export class GraphicsButton {

	private _sprite: Phaser.GameObjects.Image;
	private _label: Phaser.GameObjects.Text;
	private _container: Phaser.GameObjects.Container;
	private _textureKey: string;
	private _actionEvent: ActionEvent;

	constructor (private _scene: Phaser.Scene, x: number, y: number, label: string, style?: Phaser.Types.GameObjects.Text.TextStyle, textureInfo?: TextureInfo) {
		this.generateTexture(textureInfo)
			.createSprite()
			.createTextLabel(label, style)
			.createContainer(x, y)
			.setInteractive()
			.setActionEvent();
	}

	get click (): ActionEvent {
		return this._actionEvent;
	}

	get container (): Phaser.GameObjects.Container {
		return this._container;
	}

	get sprite (): Phaser.GameObjects.Image {
		return this._sprite;
	}

	get label ():Phaser.GameObjects.Text {
		return this._label;
	}

	private randomStringKey (): string {
		return (+new Date * Math.random()).toString(36).substring(2, 7).toUpperCase();
	}

	private generateTexture (textureInfo?: TextureInfo): this {
		const textureInfoLocal = <TextureInfo> {
			width: textureInfo?.width || BASE_WIDTH,
			height: textureInfo?.height || BASE_HEIGHT,
			color: textureInfo?.color || BASE_COLOR,
			radius: Math.ceil(textureInfo?.radius || BASE_RADIUS),
		};

		this._textureKey = "BUTTON_TEXTURE_" + this.randomStringKey();

		this._scene.make.graphics({ x: 0, y: 0, add: false})
			.fillStyle(textureInfoLocal.color!, 1)
			.fillRoundedRect(0, 0, textureInfoLocal.width!, textureInfoLocal.height!, textureInfoLocal.radius)
			.generateTexture(this._textureKey, textureInfoLocal.width, textureInfoLocal.height);

		return this;
	}

	private createSprite (): this {
		this._sprite = this._scene.add.image(0, 0, this._textureKey);
		this._sprite.setOrigin(0.5);
		return this;
	}

	private createTextLabel (text: string, style?: Phaser.Types.GameObjects.Text.TextStyle): this {
		const padding = this._sprite.displayWidth * 0.925;
		const labelStyle = <Phaser.Types.GameObjects.Text.TextStyle> {
			color: style?.color || BASE_STYLE_COLOR,
			fontStyle: style?.fontStyle || BASE_STYLE_CUSTOM,
			fontSize: style?.fontSize || BASE_STYLE_FONT_SIZE,
			align: style?.align || BASE_STYLE_ALIGN,
			wordWrap: { width: padding }
		};

		this._label = this._scene.add.text(0, 0, text, labelStyle);
		this._label.setOrigin(0.5);

		return this;
	}

	private createContainer (x: number, y: number): this {
		this._container = this._scene.add.container(x, y);
		this._container.add([this._sprite, this._label]);
		return this;
	}

	private setEffects (): Phaser.Tweens.Tween[] {
		const targets = this._container;
		const { alpha: getAlpha } = this._sprite;

		const alphaTween = this._scene.tweens.create({
			targets: targets,
			props: {
				alpha: { getStart: () => getAlpha, getEnd: () => (getAlpha * 0.85) }
			},
			yoyo: true,
			duration: 45,
		});

		const scaleTween = this._scene.tweens.create({
			targets: targets,
			props: {
				scale: { getStart: () => 1, getEnd: () => 0.925 }
			},
			yoyo: true,
			duration: 45,
			onComplete: () => this._sprite.emit(EventNames.onClick),
		});

		return [alphaTween, scaleTween];
	}

	private setInteractive (): this {
		const tweenEffects = this.setEffects();

		this._sprite.setInteractive({ useHandCursor: true });
		this._sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
			tweenEffects.forEach((tween) => tween.play());
		});

		return this;
	}

	private setActionEvent (): void {
		this._actionEvent = {
			on: (callback) => {
				this._sprite.on(EventNames.onClick, callback);
			},
			once: (callback) => {
				this._sprite.once(EventNames.onClick, () => {
					this._sprite.disableInteractive();
					callback();
				});
			},
			toggle: (callback) => {
				this._sprite.on(EventNames.onClick, () => {
					const isOn: boolean = this._sprite.getData(DataProps.onToggle) ?? false;
					callback(isOn);
					this._sprite.setData(DataProps.onToggle, !isOn);
				});
			},
			off: (callback) => {
				this._sprite.off(EventNames.onClick, callback);
				this._sprite.removeInteractive();
			},
		};
	}

}