import { IBaseView } from "../../modules/core/IBaseView";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { Assets } from "../../library/AssetGameplay";
import { Button } from "../../modules/gameobjects/Button";
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

	private _uiView: Phaser.GameObjects.Container;
	private _restartKey: Phaser.Input.Keyboard.Key;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
	}

	get restartKey (): Phaser.Input.Keyboard.Key {
		return this._restartKey;
	}

	create (): void {
		this._uiView = this._scene.add.container();
		this._restartKey = this._scene.input.keyboard.addKey('R');
		this.createTestImage();
		this.createRestartButton();
		this.event.emit(EventNames.onCreateFinish, this._uiView);
	}

	private createTestImage (): void {
		const { centerX, centerY, width, height } = this.screenUtility;
		const props = {
			INTERNAL_COUNTER: "internalCounter",
		};

		const image = new Image(this._scene, centerX, centerY * 0.5, Assets.phaser_logo.key);
		image.transform.setMinPreferredDisplaySize(width * 0.3, height * 0.3);
		image.gameObject.setInteractive({useHandCursor: true}).setData(props.INTERNAL_COUNTER, 0);
		image.gameObject.on("pointerup", () => {
			const internalCounter = image.gameObject.getData(props.INTERNAL_COUNTER) as number;
			image.gameObject.setData(props.INTERNAL_COUNTER, internalCounter + 1);
			this.event.emit(EventNames.onClickLogo, image.gameObject.getData(props.INTERNAL_COUNTER));
		});

		this._uiView.add(image.gameObject);
	}

	private createRestartButton (): void {
		const { screenPercentage } = this.screenUtility;
		const label = "RESTART";
		const fontSize = 28;
		const style = <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: FontAsset.roboto.key,
		};
		const size = {
			radius: 12 * screenPercentage,
			height: 50
		};

		const button = new Button(this._scene, 0, 0, label, style, size);
		button.transform.setToScaleDisplaySize(screenPercentage * 1.45);

		const marginTopLeft = new Phaser.Math.Vector2(16, 16).multiply(new Phaser.Math.Vector2(screenPercentage));
		const position = button.gameObject.sprite.getBottomRight().clone().add(marginTopLeft);
		button.gameObject.container.setPosition(position.x, position.y);

		button.gameObject.label.setFontSize(fontSize * button.transform.displayToOriginalHeightRatio);
		button.gameObject.click.once(() => {
			this.event.emit(EventNames.onPlaySFXClick);
			this.event.emit(EventNames.onClickRestart);
		});

		this._uiView.add(button.gameObject.container);
	}

}