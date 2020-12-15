import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { IBaseView } from "../../modules/core/IBaseView";
import { Text } from "../../modules/gameobjects/Text";
import { CONFIG } from "../../info/GameInfo";
import { GraphicsButton as Button } from "../../modules/gameobjects/ui/GraphicsButton";
import { FactoryHelper } from "../../helper/FactoryHelper";
import { FontAsset } from "../../library/AssetFont";

export const enum EventNames {
	onCreateFinish = "onCreateFinish",
	onClickPlay = "onClickPlay",
	onClickMute = "onClickMute",
};

export class TitleSceneView implements IBaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _retrieveLoadAnim: FactoryHelper.GameObjectsLoading;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
	}

	create (): void {
		const { centerX, centerY, screenPercentage, ratio, width } = this.screenUtility;
		const textContent = "The quick brown fox jump";
		const colorContent = "#fafafa";
		const fontSizeContent = `${45 * screenPercentage}px`;

		const defaultFont = new Text(this._scene, centerX, centerY, textContent, { fontSize: fontSizeContent, color: colorContent });
		defaultFont.gameObject.setOrigin(0.5);

		const arialFont = new Text(this._scene, centerX, defaultFont.gameObject.y + defaultFont.gameObject.height, textContent, { fontFamily: FontAsset.arial.key, fontSize: fontSizeContent, color: colorContent });
		arialFont.gameObject.setOrigin(0.5);

		const customFont = new Text(this._scene, centerX, arialFont.gameObject.y + arialFont.gameObject.height, textContent, { fontFamily: FontAsset.roboto.key, fontSize: fontSizeContent, color: colorContent });
		customFont.gameObject.setOrigin(0.5);

		const playText = new Text(this._scene, centerX, arialFont.gameObject.y + arialFont.gameObject.height * (5 * ratio), "Lorem Ipsum Dolor Sit Amet", { fontFamily: FontAsset.roboto.key, fontSize: fontSizeContent, color: colorContent });
		playText.transform.setMinPreferredDisplaySize(width * 0.7, playText.transform.heightAspectRatio);
		playText.gameObject.setOrigin(0.5);

		const modeText = new Text(this._scene, 16, 16, `MODE: ${CONFIG.MODE}`, { fontFamily: FontAsset.roboto.key, fontSize: `${38 * screenPercentage}px`, color: colorContent });
		modeText.gameObject.setOrigin(0);

		const versionText = new Text(this._scene, 0, this.screenUtility.height, `${CONFIG.VERSION}`, { fontFamily: FontAsset.roboto.key, fontSize: `${38 * screenPercentage}px`, color: colorContent });
		versionText.gameObject.setOrigin(0, 1);

		const playBtn = new Button(this._scene, centerX, playText.gameObject.y * 1.15, "PLAY", { color: 'black', fontFamily: FontAsset.roboto.key }, { radius: 15 });
		playBtn.transform.setToScaleDisplaySize(screenPercentage * 1.8);
		playBtn.label.gameObject.setFontSize(42 * playBtn.transform.displayToOriginalHeightRatio);
		playBtn.click.once(() => this.event.emit(EventNames.onClickPlay));

		const muteBtn = new Button(this._scene, centerX, playBtn.gameObject.y * 1.15, "MUTE", { color: 'black', fontFamily: FontAsset.roboto.key }, { radius: 15 });
		muteBtn.transform.setToScaleDisplaySize(screenPercentage * 1.25);
		muteBtn.label.gameObject.setFontSize(38 * muteBtn.transform.displayToOriginalHeightRatio);
		muteBtn.click.on(() => this.event.emit(EventNames.onClickMute));

		this._retrieveLoadAnim = FactoryHelper.CreateLoading(this._scene, centerX, centerY * 0.7, 64 * screenPercentage);
		this._scene.time.delayedCall(2500, () => this._retrieveLoadAnim.event.destroy());

		this.event.emit(EventNames.onCreateFinish);
	}

	update (time: number, dt: number): void {}

}