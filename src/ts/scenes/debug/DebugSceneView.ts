import { IBaseView } from "../../modules/core/IBaseView";
import { Rectangle } from "../../modules/gameobjects/Rectangle";
import { Text } from "../../modules/gameobjects/Text";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { DebugDraggableContainer } from "./dragable/DebugDraggableContainer";
import { FontAsset } from "../../library/AssetFont";
import { Button } from "../../modules/gameobjects/Button";

export const enum EventNames {
	onCreateFinish = "onCreateFinish",
};

export class DebugSceneView implements IBaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _bg: Rectangle;
	private _headerLabelText: Text;
	private _debugText: Text;
	private _container: Phaser.GameObjects.Container;
	private _isShowDebugPanel: boolean;
	private _debugPanelGameObjects: Phaser.GameObjects.GameObject[];
	private _toggleKey: Phaser.Input.Keyboard.Key;

	private _draggableContainer: DebugDraggableContainer;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
	}

	create (): void {
		this._isShowDebugPanel = false;
		this._toggleKey = this._scene.input.keyboard.addKey("F2");
		this._container = this._scene.add.container(0, 0);

		this._bg = new Rectangle(this._scene, 0, 0, this.screenUtility.width, this.screenUtility.height, 0x2e3131);
		this._bg.gameObject.setOrigin(0, 0).setAlpha(0.85).setInteractive();

		const debugTemplateTextContent = "[DEBUG LOG: F2]";
		this._headerLabelText = new Text(this._scene, this.screenUtility.width * 0.025, this.screenUtility.height * 0.015, debugTemplateTextContent, {
			wordWrap: { width: this.screenUtility.width * 0.95 },
			fontFamily: FontAsset.arial.key,
			fontSize: `${42 * this.screenUtility.screenPercentage}px`
		});

		const debugTextPos = this._headerLabelText.transform.getDisplayPositionFromCoordinate(0, 1);
		this._debugText = new Text(this._scene, debugTextPos.x, debugTextPos.y, "", {
			wordWrap: { width: this.screenUtility.width * 0.95 },
			fontFamily: FontAsset.arial.key,
			fontSize: `${42 * this.screenUtility.screenPercentage}px`
		});
		const debugTextMask = this.createMask(this._debugText.gameObject);

		const buttonDebugStyle = <Phaser.GameObjects.TextStyle> {
			fontSize: `${32 * this.screenUtility.screenPercentage}px`,
			color: 'black',
			fontFamily: FontAsset.arial.key,
		};
		const buttonSize = {
			height: this._headerLabelText.gameObject.displayHeight,
			width: 138 * this.screenUtility.screenPercentage,
			radius: 10 * this.screenUtility.screenPercentage
		};
		const toggleBtn = this.createToggleButton(buttonSize, buttonDebugStyle);
		const clearBtn = this.createClearButton(buttonSize, buttonDebugStyle);

		const draggableContent = [
			this._debugText.gameObject,
		];
		this._draggableContainer = new DebugDraggableContainer(this._scene, 0, this._headerLabelText.gameObject.getBottomLeft().y, this.screenUtility.width - toggleBtn.transform.displayWidth, this.screenUtility.height - this._headerLabelText.transform.displayHeight);
		this._draggableContainer.add(draggableContent).resetContentPosition();

		this._container.add([
			this._bg.gameObject,
			this._headerLabelText.gameObject,
			toggleBtn.gameObject.container,
			clearBtn.gameObject.container,
		]);

		this._debugPanelGameObjects = [
			this._container,
			this._draggableContainer,
			debugTextMask,
		];

		const minimizePosY = (this.screenUtility.height - this._headerLabelText.gameObject.getBottomLeft().y);
		this._debugPanelGameObjects.forEach((go) => (go as Phaser.GameObjects.RenderTexture).setY(minimizePosY));

		this.event.emit(EventNames.onCreateFinish, this._container);
	}

	private createMask (target: Phaser.GameObjects.Components.Mask & Phaser.GameObjects.Components.GetBounds): Phaser.GameObjects.Graphics {
		const graphicsMask = this._scene.add.graphics().setVisible(false);
		const containerMask = graphicsMask.createGeometryMask();
		target.setMask(containerMask);
		graphicsMask.clear();
		graphicsMask.fillStyle(0xffffff, 1);
		graphicsMask.fillRect(
			0,
			target.getTopLeft().y,
			this.screenUtility.width,
			this.screenUtility.height - (target.getTopLeft().y)
		);
		return graphicsMask;
	}

	createToggleButton (size: object, style: Phaser.GameObjects.TextStyle): Button {
		const button = new Button(this._scene, 0, 0, "Toggle", style, size);

		const marginRight = 1.15 * this._bg.transform.displayToOriginalWidthRatio;
		const marginTop = 1.25 * this._bg.transform.displayToOriginalHeightRatio;
		const position = this._bg.gameObject.getTopRight().clone().add(
			new Phaser.Math.Vector2(
				-button.transform.displayWidth/2 * marginRight,
				button.transform.displayHeight/2 * marginTop
			)
		);
		button.gameObject.container.setPosition(position.x, position.y);

		button.gameObject.click.on(() => {
			(this._isShowDebugPanel) ? this.hideDebugPanel() : this.showDebugPanel();
		});
		return button;
	}

	createClearButton (size: object, style: Phaser.GameObjects.TextStyle): Button {
		const button = new Button(this._scene, 0, 0, "Clear", style, size);

		const marginRight = 1.15 * this._bg.transform.displayToOriginalWidthRatio;
		const marginBottom = 1.25 * this._bg.transform.displayToOriginalHeightRatio;
		const position = this._bg.gameObject.getBottomRight().clone().add(
			new Phaser.Math.Vector2(
				-button.transform.displayWidth/2 * marginRight,
				-button.transform.displayHeight/2 * marginBottom,
			)
		);
		button.gameObject.container.setPosition(position.x, position.y);

		button.gameObject.click.on(() => this.clearDebugText());
		return button;
	}

	showDebugPanel (): void {
		this._isShowDebugPanel = true;
		this._scene.tweens.add({
			targets: this._debugPanelGameObjects,
			props: {
				y: { getEnd: () => 0 }
			},
			duration: 200,
			ease: Phaser.Math.Easing.Quadratic.Out,
			onComplete: () => {}
		});
	}

	private hideDebugPanel (): void {
		this._isShowDebugPanel = false;
		const minimizePosY = (this.screenUtility.height - this._headerLabelText.gameObject.getBottomLeft().y);
		this._scene.tweens.add({
			onStart: () => {},
			targets: this._debugPanelGameObjects,
			props: {
				y: { getStart: () => 0, getEnd: () => minimizePosY }
			},
			duration: 200,
			ease: Phaser.Math.Easing.Quadratic.Out,
		});
	}

	update (time: number, dt: number): void {
		if (!this._scene.scene.isVisible()) return;
		if (Phaser.Input.Keyboard.JustDown(this._toggleKey)) {
			(this._isShowDebugPanel) ? this.hideDebugPanel() : this.showDebugPanel();
		}
	}

	updateDebugText (text: string): void {
		this._debugText.gameObject.text += (text + "\n");

		let contentHeight = 0;
		const viewport = this.screenUtility.height;
		this._draggableContainer.getAll().forEach((child) => {
			contentHeight += (child as Phaser.GameObjects.RenderTexture).displayHeight;
		});
		if (contentHeight < viewport) return;
		const deltaHeight = contentHeight - viewport;
		this._draggableContainer.setThresholdY(deltaHeight);
	}

	clearDebugText (): void {
		this._debugText.gameObject.setText("");
		this._draggableContainer.resetContentPosition();
	}

}
