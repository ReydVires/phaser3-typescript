type GameObject = (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.ComputedSize & Phaser.GameObjects.Components.Origin & Phaser.GameObjects.Components.Transform) | Phaser.GameObjects.Rectangle;

export class Transform {

	private _gameObject: GameObject;
	private _cameraRef: Phaser.Cameras.Scene2D.Camera;

	constructor (scene: Phaser.Scene, gameObject: GameObject) {
		this._gameObject = gameObject;
		this._cameraRef = scene.cameras.main;
	}

	get position (): Phaser.Math.Vector2 { return new Phaser.Math.Vector2(this._gameObject.x, this._gameObject.y); }

	get displayWidth (): number { return this._gameObject.displayWidth; }

	get displayHeight (): number { return this._gameObject.displayHeight; }

	get widthAspectRatio (): number { return this._gameObject.width / this._gameObject.height; }

	get heightAspectRatio (): number { return this._gameObject.height / this._gameObject.width; }

	get displayToOriginalWidthRatio (): number { return this._gameObject.displayWidth / this._gameObject.width; }

	get displayToOriginalHeightRatio (): number { return this._gameObject.displayHeight / this._gameObject.height; }

	setDisplayWidth (width: number, matchHeightToAspectRatio = false): void {
		this._gameObject.displayWidth = width;
		if (matchHeightToAspectRatio) {
			this.setDisplayHeightToAspectRatio();
		}
	}

	setDisplayWidthAsScreenWidth (matchHeightToAspectRatio = false): void {
		this.setDisplayWidth(this._cameraRef.width, matchHeightToAspectRatio);
	}

	setDisplayHeight (height: number, matchWidthToAspectRatio = false): void {
		this._gameObject.displayHeight = height;
		if (matchWidthToAspectRatio) {
			this.setDisplayWidthToAspectRatio();
		}
	}

	setDisplayHeightAsScreenHeight (matchWidthToAspectRatio = false): void {
		this.setDisplayHeight(this._cameraRef.height, matchWidthToAspectRatio);
	}

	setDisplayHeightToAspectRatio (): void {
		this._gameObject.displayHeight = this._gameObject.displayWidth * this.heightAspectRatio;
	}

	setDisplayWidthToAspectRatio (): void {
		this._gameObject.displayWidth = this._gameObject.displayHeight * this.widthAspectRatio;
	}

	setDisplaySize (width: number, height: number): void {
		this._gameObject.displayWidth = width;
		this._gameObject.displayHeight = height;
	}

	setToOriginalDisplaySize (): void {
		this.setDisplaySize(this._gameObject.width, this._gameObject.height);
	}

	setToScaleDisplaySize (percent: number): void {
		this.setDisplaySize(percent * this._gameObject.width, percent * this._gameObject.height);
	}

	setMaxPreferredDisplaySize (maxWidth: number, maxHeight: number): void {
		if (maxWidth * this.heightAspectRatio > maxHeight) {
			this.setDisplayHeight(maxHeight, true);
		}
		else {
			this.setDisplayWidth(maxWidth, true);
		}
	}

	setMinPreferredDisplaySize (minWidth: number, minHeight: number): void {
		if (minWidth * this.heightAspectRatio < minHeight) {
			this.setDisplayHeight(minHeight, true);
		}
		else {
			this.setDisplayWidth(minWidth, true);
		}
	}

	setToScreenPercentage (percentage?: number): void {
		const DEFAULT_SCREEN_WIDTH = 1080;
		const value = percentage || (this._cameraRef.width / DEFAULT_SCREEN_WIDTH);
		this.setDisplayWidth(value * this._gameObject.width, true);
	}

	getDisplayPositionFromCoordinate (x: number, y: number): Phaser.Math.Vector2 {
		return new Phaser.Math.Vector2(
			this._gameObject.x + ((x - this._gameObject.originX) * this._gameObject.displayWidth),
			this._gameObject.y + ((y - this._gameObject.originY) * this._gameObject.displayHeight)
		);
	}

}