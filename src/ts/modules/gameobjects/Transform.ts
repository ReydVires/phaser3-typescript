import { ScreenUtilController } from "../screenutility/ScreenUtilController";

type Gameobject = Phaser.GameObjects.RenderTexture | Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Rectangle;

export class Transform {

	private _gameObject: Gameobject;

	constructor (gameObject: Gameobject) {
		this._gameObject = gameObject;
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
		this.setDisplayWidth(ScreenUtilController.getInstance().width, matchHeightToAspectRatio);
	}

	setDisplayHeight (height: number, matchWidthToAspectRatio = false): void {
		this._gameObject.displayHeight = height;
		if (matchWidthToAspectRatio) {
			this.setDisplayWidthToAspectRatio();
		}
	}

	setDisplayHeightAsScreenHeight (matchWidthToAspectRatio = false): void {
		this.setDisplayHeight(ScreenUtilController.getInstance().height, matchWidthToAspectRatio);
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

	setToScreenPercentage (percentage = ScreenUtilController.getInstance().screenPercentage): void {
		this.setDisplayWidth(percentage * this._gameObject.width, true);
	}

	getDisplayPositionFromCoordinate (x: number, y: number): Phaser.Math.Vector2 {
		return new Phaser.Math.Vector2(
			this._gameObject.x + ((x - this._gameObject.originX) * this._gameObject.displayWidth),
			this._gameObject.y + ((y - this._gameObject.originY) * this._gameObject.displayHeight)
		);
	}

}