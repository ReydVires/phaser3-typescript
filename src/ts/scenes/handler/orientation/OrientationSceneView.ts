import { Assets } from "../../../library/AssetOrientation";
import { BaseView } from "../../../modules/core/BaseView";
import { Image } from "../../../modules/gameobjects/Image";
import { Rectangle } from "../../../modules/gameobjects/Rectangle";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

export const enum EventNames {
	onCreateFinish = "onCreateFinish",
	onInitializeOrientation = "onInitializeOrientation",
	onOrientationWarningShow = "onOrientationWarningShow",
	onOrientationWarningHide = "onOrientationWarningHide",
};

export const enum DataProperty {
	initialize = "OrientationSceneView#initialize",
	initOnLandscape = "OrientationSceneView#initOnLandscape"
};

export class OrientationSceneView implements BaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _scenePlugin: Phaser.Scenes.ScenePlugin;
	private _screenOverlay: Rectangle;
	private _warningOrientation: Image;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();

		this._scenePlugin = this._scene.scene;
	}

	create (): void {
		this.createScreenOverlay();
		this.createWarningOrientation();
		this.event.emit(EventNames.onCreateFinish);
	}

	private createScreenOverlay (): void {
		this._screenOverlay = new Rectangle(this._scene, 0, 0, this.screenUtility.width, this.screenUtility.height, 0x181818);
		this._screenOverlay.transform.setMinPreferredDisplaySize(this.screenUtility.width, this.screenUtility.height);
		this._screenOverlay.gameObject.setInteractive().setOrigin(0);
	}

	private createWarningOrientation (): void {
		this._warningOrientation = new Image(this._scene, this.screenUtility.centerX, this.screenUtility.centerY, Assets.warning_orientation.key);
		this._warningOrientation.transform.setMaxPreferredDisplaySize(this.screenUtility.width, this.screenUtility.height);
	}

	showWarning (): void {
		this._scenePlugin.bringToTop();
		this.event.emit(EventNames.onOrientationWarningShow);
	}

	hideWarning (): void {
		this._scenePlugin.setActive(false).setVisible(false);
		this.event.emit(EventNames.onOrientationWarningHide);
	}

	update (time: number, dt: number): void {
		const isInitialized = this._scene.registry.get(DataProperty.initialize);
		if (isInitialized) return;
		this.event.emit(EventNames.onInitializeOrientation);
	}

}
