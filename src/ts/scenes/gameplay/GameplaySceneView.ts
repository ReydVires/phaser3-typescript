import { IBaseView } from "../../modules/core/IBaseView";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { Assets } from "../../library/AssetGameplay";
import { GraphicsButton } from "../../modules/gameobjects/ui/GraphicsButton";
import { Image } from "../../modules/gameobjects/Image";
import { FontAsset } from "../../library/AssetFont";

export const enum EventNames {
	onPlaySFXClick = "onPlaySFXClick",
	onClickLogo = "onClickLogo",
	onClickRestart = "onClickRestart",
	onCreateFinish = "onCreateFinish",
};

export class GameplaySceneView implements IBaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
	}

	create (): void {
		const uiView = this._scene.add.container();
		const { centerX, centerY, width, height } = this.screenUtility;

		let testInternalCounter = 0;
		const testSprite = new Image(this._scene, centerX, centerY * 0.5, Assets.phaser_logo.key);
		testSprite.transform.setMinPreferredDisplaySize(width * 0.3, height * 0.3);
		testSprite.gameObject.setInteractive().on("pointerup", () => this.event.emit(EventNames.onClickLogo, ++testInternalCounter));

		const restartBtn = new GraphicsButton(this._scene, 16, 16, "RESTART", { color: 'black', fontFamily: FontAsset.roboto.key }, { height: 50 });
		restartBtn.transform.setToScaleDisplaySize(testSprite.transform.displayToOriginalHeightRatio * 1.3);
		restartBtn.label.gameObject.setFontSize(28 * restartBtn.transform.displayToOriginalHeightRatio);
		restartBtn.setOrigin(0, 0, true);
		restartBtn.click.once(() => {
			this.event.emit(EventNames.onPlaySFXClick);
			this.event.emit(EventNames.onClickRestart);
		});

		uiView.add([
			testSprite.gameObject,
			restartBtn.gameObject,
		]);
		this.event.emit(EventNames.onCreateFinish, uiView);
	}

	update (time: number, dt: number): void {
		if (this._scene.input.keyboard.addKey('Z').isDown) {
			this.event.emit(EventNames.onClickRestart);
		}
	}

}