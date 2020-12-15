export class ScreenUtilController {

	static instance: ScreenUtilController;

	private _scene: Phaser.Scene;
	private _defaultWidth: number = 1080;
	private _defaultHeight: number = 1920;

	private constructor () {}

	static getInstance (): ScreenUtilController {
		if (!ScreenUtilController.instance) {
			ScreenUtilController.instance = new ScreenUtilController();
		}
		return ScreenUtilController.instance;
	}

	init (scene: Phaser.Scene, defaultWidth = 1080, defaultHeight = 1920): Promise<any> {
		return new Promise((resolve) => {
			this._scene = scene;
			this.setDefaultScreenSize(defaultWidth, defaultHeight);
			resolve();
		});
	}

	get width (): number { return this._scene.cameras.main.width; }

	get height (): number { return this._scene.cameras.main.height; }

	get ratio (): number { return this.width / this.height; }

	get centerX (): number { return this.width * 0.5; }

	get centerY (): number { return this.height * 0.5; }

	get screenPercentage (): number { return this.width / this._defaultWidth; }

	get defaultScreenSize (): Object {
		return {
			width: this._defaultWidth,
			height: this._defaultHeight
		};
	}

	setDefaultScreenSize (width: number, height: number): void {
		this._defaultWidth = width;
		this._defaultHeight = height;
	}

}