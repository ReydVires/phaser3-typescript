import { CameraKeyList } from "../../../info/GameInfo";
import { Sprite } from "../../../modules/gameobjects/Sprite";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

type CameraGroup = {
	key: string,
	camera: Phaser.Cameras.Scene2D.Camera,
	group: Phaser.GameObjects.Group
};

type CameraObjectResultData = {
	inside : boolean,
	objectToCameraOffset : Phaser.Math.Vector2
};

export class CameraController {

	private _screenUtility: ScreenUtilController;
	private _cameraGroup: CameraGroup[];
	private _backgroundCamera: Phaser.Cameras.Scene2D.Camera;
	private _uiCamera: Phaser.Cameras.Scene2D.Camera;

	constructor (private _scene: Phaser.Scene) {
		this._screenUtility = ScreenUtilController.getInstance();
		this._cameraGroup = [];
	}

	init (): void {
		const mainGroup = this._scene.add.group().setName(CameraKeyList.MAIN);
		this._cameraGroup.push({
			key: CameraKeyList.MAIN,
			camera: this._scene.cameras.main,
			group: mainGroup
		});

		const bgGroup = this._scene.add.group();
		this._backgroundCamera = this._scene.cameras.add().setName(CameraKeyList.BACKGROUND);
		this._cameraGroup.push({
			key: CameraKeyList.BACKGROUND,
			camera: this._backgroundCamera,
			group: bgGroup
		});

		this._scene.cameras.cameras.reverse(); // Adjust camera order on array

		const uiGroup = this._scene.add.group();
		this._uiCamera = this._scene.cameras.add().setName(CameraKeyList.UI);
		this._cameraGroup.push({
			key: CameraKeyList.UI,
			camera: this._uiCamera,
			group: uiGroup
		});
	}

	get mainCamera (): Phaser.Cameras.Scene2D.Camera {
		return this._scene.cameras.main;
	}

	get uiCamera (): Phaser.Cameras.Scene2D.Camera {
		return this._uiCamera;
	}

	registerGameobjectInCamera (gameObject: Phaser.GameObjects.GameObject, key = CameraKeyList.MAIN): void {
		for (let i = 0, len = this._cameraGroup.length; i < len; i++) {
			const cg = this._cameraGroup[i];
			if (cg.key != key) {
				cg.camera.ignore(gameObject);
				continue;
			}
			cg.group.add(gameObject);
		}
	}

	getCameraRect = (key = CameraKeyList.MAIN): Phaser.Geom.Rectangle => {
		const camera = this._cameraGroup.find(v => v.key === key)?.camera;
		const leftTop = camera?.getWorldPoint(0, 0) ?? Phaser.Math.Vector2.ZERO;
		const rightTop = camera?.getWorldPoint(this._screenUtility.width, 0) ?? Phaser.Math.Vector2.ZERO;
		const leftBottom = camera?.getWorldPoint(0, this._screenUtility.height) ?? Phaser.Math.Vector2.ZERO;
		return new Phaser.Geom.Rectangle(leftTop.x, leftTop.y, rightTop.x - leftTop.x, leftBottom.y - leftTop.y);
	}

	getWorldPointFromCameraPoint (cameraPoint: Phaser.Math.Vector2, key = CameraKeyList.MAIN): Phaser.Math.Vector2 {
		const camera = this._cameraGroup.find(v => v.key === key)?.camera;
		return camera?.getWorldPoint(cameraPoint.x, cameraPoint.y) ?? Phaser.Math.Vector2.ZERO;
	}

	isSpriteInsideCamera (sprite: Sprite, key = CameraKeyList.MAIN): CameraObjectResultData {
		const { width, height } = this._screenUtility;
		const centerPoint = new Phaser.Math.Vector2(width * 0.5, height * 0.5);
		const cameraCenter = this.getWorldPointFromCameraPoint(centerPoint, key);
		const rect = this.getCameraRect(key);

		const gameObject = sprite.gameObject;
		const isInside = (
			rect.contains(gameObject.getTopLeft().x, gameObject.getTopLeft().y) ||
			rect.contains(gameObject.getTopRight().x, gameObject.getTopRight().y) ||
			rect.contains(gameObject.getBottomLeft().x, gameObject.getBottomLeft().y) ||
			rect.contains(gameObject.getBottomRight().x, gameObject.getBottomRight().y) ||
			rect.contains(gameObject.getCenter().x, gameObject.getCenter().y)
		);

		return {
			inside: isInside,
			objectToCameraOffset: new Phaser.Math.Vector2(gameObject.x - cameraCenter.x, gameObject.y - cameraCenter.y)
		};
	}

	update (time: number, dt: number): void {}

}