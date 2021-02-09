const BASE_COLOR = 0xfafafa;
const BASE_WIDTH = 480;
const BASE_HEIGHT = 72;
const BASE_RADIUS = 20;
const BASE_STYLE_FONT_SIZE = `${27}px`;
const BASE_STYLE_FONT_COLOR = "#34495e";
const BASE_STROKE_COLOR = 0x34495e;
const BASE_DEPTH = 100;

export class Toast {

	private _container: Phaser.GameObjects.Container;
	private _lable: Phaser.GameObjects.Text;
	private _sprite: Phaser.GameObjects.Image;
	private _textureKey: string;
	private _tweenEffect: Phaser.Tweens.Tween;

	constructor (private _scene: Phaser.Scene, textureInfo?: Partial<Phaser.Toast.TextureInfo>) {
		this.generateTextureKey()
			.generateTexture(textureInfo)
			.createSprite()
			.createText()
			.setupContainer();
	}

	private generateTextureKey (): this {
		const baseKey = "TEXTURE";
		const randomKey = (+new Date * Math.random()).toString(36).substring(2, 7).toUpperCase();
		this._textureKey = `${baseKey}_${randomKey}`;
		return this;
	}

	private generateTexture (textureInfo?: Partial<Phaser.Toast.TextureInfo>): this {
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
		return this;
	}

	private createSprite (): this {
		this._sprite = this._scene.add.image(0, 0, this._textureKey);
		this._sprite.setOrigin(0.5);
		return this;
	}

	private createText (): this {
		this._lable = this._scene.add.text(0, 0, "", <Phaser.Types.GameObjects.Text.TextStyle> {
			align: "center",
			color: BASE_STYLE_FONT_COLOR,
			fontSize: BASE_STYLE_FONT_SIZE,
			fontFamily: "arial",
		});
		this._lable.setOrigin(0.5);
		return this;
	}

	private setupContainer (): void {
		const children = [
			this._sprite,
			this._lable
		];
		this._container = this._scene.add.container(0, 0, children);
		this._container.setVisible(false).setDepth(BASE_DEPTH);
	}

	private setPosition (position?: Phaser.Toast.Position): void {
		const { width: screenWidth, height: screenHeight } = this._scene.cameras.main;

		const margin = {
			bottom: 10,
			top: 10,
			right: 10,
			left: 10,
		};

		const bottom = screenHeight - ((this._sprite.displayHeight * 0.5) - margin.bottom);
		const middle = screenHeight * 0.5;
		const top = (this._sprite.displayHeight * 0.5) + margin.top;

		const left = (this._sprite.displayWidth * 0.5) + margin.left;
		const right = screenWidth - ((this._sprite.displayWidth * 0.5) + margin.right);
		const center = screenWidth * 0.5;

		switch (position) {
		case Phaser.Toast.Position.BOTTOM_LEFT:
			this._container.setPosition(left, bottom);
			break;
		case Phaser.Toast.Position.BOTTOM_RIGHT:
			this._container.setPosition(right, bottom);
			break;
		case Phaser.Toast.Position.BOTTOM_CENTER:
			this._container.setPosition(center, bottom);
			break;

		case Phaser.Toast.Position.MIDDLE_LEFT:
			this._container.setPosition(left, middle);
			break;
		case Phaser.Toast.Position.MIDDLE_RIGHT:
			this._container.setPosition(right, middle);
			break;
		case Phaser.Toast.Position.MIDDLE_CENTER:
			this._container.setPosition(center, middle);
			break;

		case Phaser.Toast.Position.TOP_LEFT:
			this._container.setPosition(left, top);
			break;
		case Phaser.Toast.Position.TOP_RIGHT:
			this._container.setPosition(right, top);
			break;
		default: // TOP_CENTER
			this._container.setPosition(center, top);
			break;
		}
	}

	private fadeIn (position?: Phaser.Toast.Position, config?: Partial<Phaser.Toast.Config>): void {
		const isOnTop = position && (position <= 2); // Top enum is around: 0-2

		// FIXME: Duration of onComplete is messed up when doubled call (use Pooling)
		if (this._tweenEffect?.isPlaying()) this._tweenEffect.stop();
		this._tweenEffect = this._scene.tweens.create({
			onStart: () => {
				this._container.setVisible(true);
			},
			targets: this._container,
			props: {
				alpha: { getStart: () => 0, getEnd: () => 1 },
				y: {
					getStart: () => (isOnTop ? -(this._sprite.getBottomCenter().y) : this._container.y),
					getEnd: () => this._container.y
				},
			},
			duration: 100,
			completeDelay: config?.showDuration || 600,
			onComplete: () => {
				if (config?.manualClose) return;
				this.hide();
			}
		});
		this._tweenEffect.play();
	}

	private fadeOut (): void {
		this._scene.tweens.add({
			targets: this._container,
			props: {
				alpha: { getStart: () => 1, getEnd: () => 0 }
			},
			duration: 150,
			onComplete: () => {
				this._container.setVisible(false);
			}
		});
	}

	show (message: string, position?: Phaser.Toast.Position, config?: Partial<Phaser.Toast.Config>): void {
		this._lable.setText(message);
		this.setPosition(position);
		this.fadeIn(position, config);
	}

	hide (): void {
		this.fadeOut();
	}

	destroy (): void {}

}