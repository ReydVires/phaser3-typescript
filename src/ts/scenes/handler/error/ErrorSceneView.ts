import { Assets } from "../../../library/AssetError";
import { FontAsset } from "../../../library/AssetFont";
import { IBaseView } from "../../../modules/core/IBaseView";
import { Image } from "../../../modules/gameobjects/Image";
import { Sprite } from "../../../modules/gameobjects/Sprite";
import { Text } from "../../../modules/gameobjects/Text";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

export const enum EventNames {
	onClickRetry = "onClickRetry",
};

export class ErrorSceneView implements IBaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _uiView: Phaser.GameObjects.Container;
	private _errorText: Text;
	private _confirmBtn: Sprite;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
	}

	create (): void {
		this._scene.scene.bringToTop();
		this.createErrorPanel();
	}

	private createErrorPanel (): void {
		const UI_DEPTH = 100;

		this._uiView = this._scene.add.container(0, 0).setDepth(UI_DEPTH);

		const screenOverlay = this._scene.add.rectangle(0, 0, this.screenUtility.width, this.screenUtility.height, 0x00000, 1);
		screenOverlay.setOrigin(0).setAlpha(0.4).setDepth(UI_DEPTH).setInteractive();

		const { centerX: panelPosX, centerY: panelPosY, screenPercentage } = this.screenUtility;
		const panel = new Image(this._scene, panelPosX, panelPosY, Assets.error_panel.key);
		panel.transform.setToScaleDisplaySize(screenPercentage);

		const errorPosText = panel.transform.getDisplayPositionFromCoordinate(0.5, 0.38);
		const errorMessage = "Error message here!";
		this._errorText = new Text(this._scene, errorPosText.x, errorPosText.y, errorMessage, {
			fontFamily: FontAsset.roboto.key,
			fontSize: `${32 * panel.transform.displayToOriginalHeightRatio}px`,
			wordWrap: { width: panel.transform.displayWidth * 0.675 },
			align: 'center',
			color: '#82381e'
		});
		this._errorText.gameObject.setOrigin(0.5, 0);

		const confirmPosBtn = panel.transform.getDisplayPositionFromCoordinate(0.5, 0.82);
		const btnProps = {
			ON_CLICK: 'onclick',
			UP: 'pointerup',
			DOWN: 'pointerdown',
			OUT: 'pointerout',
		};
		this._confirmBtn = new Sprite(this._scene, confirmPosBtn.x, confirmPosBtn.y, Assets.ok_btn.key, 0);
		this._confirmBtn.transform.setToScaleDisplaySize(panel.transform.displayToOriginalHeightRatio);
		this._confirmBtn.gameObject.setInteractive({ useHandCursor: true }).setData(btnProps.ON_CLICK, false)
			.on(btnProps.DOWN, () => this._confirmBtn.gameObject.setData(btnProps.ON_CLICK, true).setFrame(1))
			.on(btnProps.OUT, () => this._confirmBtn.gameObject.setData(btnProps.ON_CLICK, false).setFrame(0))
			.on(btnProps.UP, () => {
				if (!this._confirmBtn.gameObject.getData(btnProps.ON_CLICK)) return;

				this._confirmBtn.gameObject.setData(btnProps.ON_CLICK, false);
				this._scene.time.delayedCall(60, () => {
					this._confirmBtn.gameObject.disableInteractive();
					this._uiView.setVisible(false);
					this.event.emit(EventNames.onClickRetry, this._errorText.gameObject.text);
				});
			});

		this._uiView.add([
			screenOverlay,
			panel.gameObject,
			this._errorText.gameObject,
			this._confirmBtn.gameObject]
		);
		this._uiView.setScrollFactor(0).setVisible(false);
	}

	showPanel (): void {
		this._confirmBtn.gameObject.setInteractive();
		this._uiView.setVisible(true);
	}

	hidePanel (): void {
		this._uiView.setVisible(false);
	}

	updateErrorMessage (message: string): void {
		this._errorText.gameObject.setText(message);
	}

}