import { injectExtension } from "./ToastExtension";

const BASE_COLOR = 0xfafafa;
const BASE_WIDTH = 480;
const BASE_HEIGHT = 72;
const BASE_RADIUS = 20;
const BASE_STYLE_FONT_SIZE = `${27}px`;
const BASE_STYLE_FONT_COLOR = "#34495e";
const BASE_STYLE_FONT_FAMILY = "arial";
const BASE_STROKE_COLOR = 0x34495e;
const BASE_DEPTH = 100;

type GameObjectTarget = Phaser.GameObjects.Container;

export class ToastPlugin extends Phaser.Plugins.BasePlugin {

	private _scene: Phaser.Scene;
	private _textureKey: string;

	constructor (pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);
	}

	init (): void {
		injectExtension();
	}

	private generateTextureKey (): void {
		const baseKey = "TOAST_TEXTURE";
		const randomKey = (+new Date * Math.random()).toString(36).substring(2, 7).toUpperCase();
		this._textureKey = `${baseKey}_${randomKey}`;
	}

	private generateTexture (textureInfo?: Partial<Phaser.Toast.TextureInfo>): void {
		const textureInfoLocal = <Phaser.Toast.TextureInfo> {
			width: textureInfo?.width || BASE_WIDTH,
			height: textureInfo?.height || BASE_HEIGHT,
			color: textureInfo?.color || BASE_COLOR,
			radius: Math.ceil(textureInfo?.radius || BASE_RADIUS),
		};

		const graphics = this._scene.make.graphics({ x: 0, y: 0, add: false});
		graphics.fillStyle(textureInfoLocal.color, 1);
		graphics.fillRoundedRect(0, 0, textureInfoLocal.width, textureInfoLocal.height, textureInfoLocal.radius);

		graphics.lineStyle(5, BASE_STROKE_COLOR, 1);
		graphics.strokeRoundedRect(0, 0, textureInfoLocal.width, textureInfoLocal.height, textureInfoLocal.radius);

		graphics.generateTexture(this._textureKey, textureInfoLocal.width, textureInfoLocal.height);
	}

	private createSprite (): Phaser.GameObjects.Image {
		const sprite = this._scene.add.image(0, 0, this._textureKey);
		sprite.setOrigin(0.5);
		return sprite;
	}

	private createLabelText (message: string, style?: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
		const text = this._scene.add.text(0, 0, message, <Phaser.Types.GameObjects.Text.TextStyle> {
			align: "center",
			color: BASE_STYLE_FONT_COLOR,
			fontSize: BASE_STYLE_FONT_SIZE,
			fontFamily: BASE_STYLE_FONT_FAMILY,
		});
		text.setStyle(style || {});
		text.setOrigin(0.5);
		return text;
	}

	private setupContainer (size: Phaser.GameObjects.Components.Size, children: Phaser.GameObjects.GameObject[], manualClose?: boolean): Phaser.GameObjects.Container {
		const container = this._scene.add.container(0, 0, children);
		container.setSize(size.displayWidth, size.displayHeight);
		container.setVisible(false).setDepth(BASE_DEPTH);

		if (!manualClose) return container;
		return container.setInteractive({useHandCursor: true}).on("pointerup", () => {
			container.disableInteractive();
			this.fadeOut(container);
		});
	}

	private setPosition (target: GameObjectTarget, position?: Phaser.Toast.Position): void {
		const { width: screenWidth, height: screenHeight } = this._scene.cameras.main;
		const { displayWidth: targetWidth, displayHeight: targetHeight } = target;

		const margin = {
			bottom: 10,
			top: 10,
			right: 10,
			left: 10,
		};

		const bottom = screenHeight - ((targetHeight * 0.5) - margin.bottom);
		const middle = screenHeight * 0.5;
		const top = (targetHeight * 0.5) + margin.top;

		const left = (targetWidth * 0.5) + margin.left;
		const right = screenWidth - ((targetWidth * 0.5) + margin.right);
		const center = screenWidth * 0.5;

		switch (position) {
		case Phaser.Toast.Position.BOTTOM_LEFT:
			target.setPosition(left, bottom);
			break;
		case Phaser.Toast.Position.BOTTOM_RIGHT:
			target.setPosition(right, bottom);
			break;
		case Phaser.Toast.Position.BOTTOM_CENTER:
			target.setPosition(center, bottom);
			break;

		case Phaser.Toast.Position.MIDDLE_LEFT:
			target.setPosition(left, middle);
			break;
		case Phaser.Toast.Position.MIDDLE_RIGHT:
			target.setPosition(right, middle);
			break;
		case Phaser.Toast.Position.MIDDLE_CENTER:
			target.setPosition(center, middle);
			break;

		case Phaser.Toast.Position.TOP_LEFT:
			target.setPosition(left, top);
			break;
		case Phaser.Toast.Position.TOP_RIGHT:
			target.setPosition(right, top);
			break;
		default: // TOP_CENTER
			target.setPosition(center, top);
			break;
		}
	}

	private fadeIn (target: GameObjectTarget, showDuration?: number, isManualClose?: boolean): void {
		const tweenEffect = this._scene.tweens.create({
			onStart: () => {
				target.setVisible(true);
			},
			targets: target,
			props: {
				alpha: { getStart: () => 0, getEnd: () => 1 },
			},
			duration: 100,
			completeDelay: showDuration ?? 600,
			onComplete: () => {
				if (isManualClose) return;
				this.fadeOut(target);
			}
		});
		tweenEffect.play();
	}

	private fadeOut (target: GameObjectTarget): void {
		this._scene.tweens.add({
			targets: target,
			props: {
				alpha: { getStart: () => 1, getEnd: () => 0 }
			},
			duration: 150,
			onComplete: () => {
				target.setVisible(false);
			}
		});
	}

	configure (scene: Phaser.Scene, textureInfo?: Partial<Phaser.Toast.TextureInfo>): void {
		this._scene = scene;
		this.generateTextureKey();
		this.generateTexture(textureInfo);
	}

	show (message: string, position?: Phaser.Toast.Position, config?: Partial<Phaser.Toast.Config>): void {
		const toastSprite = this.createSprite();
		const toastLabel = this.createLabelText(message, config?.textStyle);
		const toastContainer = this.setupContainer(toastSprite, [toastSprite, toastLabel], config?.manualClose);
		this.setPosition(toastContainer, position);
		this.fadeIn(toastContainer, config?.showDuration, config?.manualClose);
	}

}