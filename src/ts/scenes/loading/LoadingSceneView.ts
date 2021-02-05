import { BaseView } from "../../modules/core/BaseView";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { Text } from "../../modules/gameobjects/Text";
import { Assets } from "../../library/AssetLoading";
import { AnimationHelper } from "../../helper/AnimationHelper";
import { Animations } from "../../library/AssetAnimation";
import { Sprite } from "../../modules/gameobjects/Sprite";
import { CustomTypes } from "../../../types/custom";

export class LoadingSceneView implements BaseView {

	private _progressText: Text;
	private _bar: Sprite;
	private _progressBar: Phaser.GameObjects.Graphics;

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
	}

	create (): void {
		this.createBackground();
		this.createLoadingComponents();
	}

	private createBackground (): void {
		const sprite = new Sprite(this._scene, this.screenUtility.centerX, this.screenUtility.centerY, Assets.loading_bg.key);
		sprite.transform.setMinPreferredDisplaySize(this.screenUtility.width, this.screenUtility.height);
	}

	private createLoadingComponents (): void {
		const frame = new Sprite(this._scene, this.screenUtility.centerX, this.screenUtility.centerY, Assets.loading_frame.key);
		frame.transform.setToScaleDisplaySize(this.screenUtility.screenPercentage);
		frame.gameObject.setOrigin(0.5)
			.setDepth(1)
			.setAlpha(1);

		const loadingTextAnim = new Sprite(this._scene, 0, 0, Assets.loading_text.key);
		loadingTextAnim.transform.setToScaleDisplaySize(frame.transform.displayToOriginalWidthRatio);
		loadingTextAnim.gameObject.setOrigin(0.5, 1)
			.setPosition(frame.transform.getDisplayPositionFromCoordinate(0.5, 0).x, frame.transform.getDisplayPositionFromCoordinate(0.5, 0).y);

		AnimationHelper.AddAnimation(this._scene, Animations.loading_text as CustomTypes.Asset.AnimationInfoType);
		loadingTextAnim.gameObject.play(Animations.loading_text.key);

		const offsetFrameY = 12.25 * frame.transform.displayToOriginalHeightRatio;
		this._bar = new Sprite(this._scene, frame.gameObject.x, frame.gameObject.y - offsetFrameY, Assets.loading_bar.key);
		this._bar.transform.setToScaleDisplaySize(frame.transform.displayToOriginalHeightRatio);
		this._bar.gameObject.setOrigin(0.5)
			.setDepth(2)
			.setAlpha(1);

		this._progressText = new Text(this._scene, frame.gameObject.x, frame.gameObject.getBottomCenter().y + (16 * frame.transform.displayToOriginalHeightRatio), '0%', { color: '#ffd561', fontStyle: 'bold', align: 'center' });
		this._progressText.gameObject
			.setOrigin(0.5, 0)
			.setFontSize(48 * frame.transform.displayToOriginalHeightRatio);

		this._progressBar = this._scene.add.graphics().setVisible(false);
	}

	updateLoading (value: number): void {
		const mask = this._progressBar.createGeometryMask();
		this._bar.gameObject.setMask(mask);

		const percent = Math.round(value * 100).toString() + " %";
		this._progressText.gameObject.setText(percent);

		this._progressBar.clear();
		this._progressBar.fillStyle(0xffffff, 1);

		const height = this._bar.gameObject.displayHeight;
		const width = this._bar.gameObject.displayWidth;
		this._progressBar.fillRect(
			this._bar.gameObject.getTopLeft().x,
			this._bar.gameObject.getTopLeft().y,
			value * width,
			height
		);
	}

}