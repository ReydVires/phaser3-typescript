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
		this.createPlayButton();
		this.createMuteButton();
		this.createLoadingAnimation();
		this.createDebugText();
		this.event.emit(EventNames.onCreateFinish);
	}

	private createPlayButton (): void {
		const { centerX, centerY, screenPercentage } = this.screenUtility;
		const label = "PLAY";
		const fontSize = 56;
		const style = <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: FontAsset.roboto.key,
			color: "black",
			fontStyle: "bold",
		};
		const size = {
			radius: 32 * screenPercentage,
			width: 256,
			height: 128
		};
		const button = new Button(this._scene, centerX, centerY * 1.3, label, style, size);
		button.transform.setToScaleDisplaySize(screenPercentage * 1.25);
		button.label.gameObject.setFontSize(fontSize * button.transform.displayToOriginalHeightRatio);
		button.click.once(() => this.event.emit(EventNames.onClickPlay));
	}

	private createMuteButton (): void {
		const { centerX, centerY, screenPercentage } = this.screenUtility;
		const label = "MUTE";
		const fontSize = 38;
		const style = <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: FontAsset.roboto.key,
			color: 'black',
		};
		const button = new Button(this._scene, centerX, centerY * 1.5, label, style, { radius: 15 * screenPercentage });
		button.transform.setToScaleDisplaySize(screenPercentage * 1.15);
		button.label.gameObject.setFontSize(fontSize * button.transform.displayToOriginalHeightRatio);
		button.click.on(() => this.event.emit(EventNames.onClickMute));
	}

	private createLoadingAnimation (): void {
		const { centerX, centerY, screenPercentage } = this.screenUtility;
		const radius = 64 * screenPercentage;
		const duration = 2500;
		this._retrieveLoadAnim = FactoryHelper.CreateLoading(this._scene, centerX, centerY, radius);
		this._scene.time.delayedCall(duration, () => {
			this.createText();
			this._retrieveLoadAnim.event.destroy();
		});
	}

	private createText (): void {
		const { centerX, centerY, width, screenPercentage } = this.screenUtility;
		const content = "A Quick Brown Fox Jumped Over The Lazy Dog's Back 1234567890";
		const fontSize = 45;
		const style = <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: FontAsset.roboto.key,
			color: "#fafafa",
			wordWrap: { width: width * 0.95 },
			align: "center",
		};
		const text = new Text(this._scene, centerX, centerY * 0.35, content, style);
		text.gameObject.setFontSize(fontSize * screenPercentage);
		text.gameObject.setOrigin(0.5);
	}

	private createDebugText (): void {
		const { height, screenPercentage } = this.screenUtility;
		const content = `v.${CONFIG.VERSION}\nMode: ${CONFIG.MODE}`;
		const fontSize = 32;
		const style = <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: FontAsset.roboto.key,
			color: "white",
		};
		const textPosition = new Phaser.Math.Vector2(16, height - (16 * screenPercentage));
		const text = new Text(this._scene, textPosition.x, textPosition.y, content, style);
		text.gameObject.setFontSize(fontSize * screenPercentage);
		text.gameObject.setOrigin(0, 1);
	}

	update (time: number, dt: number): void {}

}