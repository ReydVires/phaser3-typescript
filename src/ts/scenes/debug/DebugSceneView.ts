import { FontAsset } from "../../library/AssetFont";
import { BaseView } from "../../modules/core/BaseView";
import { Button } from "../../modules/gameobjects/Button";
import { Rectangle } from "../../modules/gameobjects/Rectangle";
import { Text } from "../../modules/gameobjects/Text";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";

export const enum EventNames {
	onCreateFinish = "onCreateFinish",
};

export const enum DataProps {
	isInTransition = "isInTransition",
	isShowDebugPanel = "isShowDebugPanel",
}

export class DebugSceneView implements BaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _bg: Rectangle;
	private _headerLabelText: Text;
	private _debugText: Text;
	private _toggleBtn: Button;
	private _clearBtn: Button;
	private _debugTextMask: Phaser.GameObjects.Graphics;
	private _draggableContainer: Phaser.GameObjects.Container;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
	}

	get isShowDebugPanel (): boolean {
		return this._bg.gameObject.getData(DataProps.isShowDebugPanel);
	}

	get toggleKey (): Phaser.Input.Keyboard.Key {
		return this._scene.input.keyboard.addKey("F2");
	}

	create (): void {
		this.createBackground();
		this.createHeaderLabelText();
		this.createDebugText();
		this.createButtons();
		this.createDraggableContainer();
		this.event.emit(EventNames.onCreateFinish);
	}

	private createBackground (): void {
		const { width, height } = this.screenUtility;

		this._bg = new Rectangle(this._scene, 0, 0, width, height, 0x2e3131);
		this._bg.gameObject.setOrigin(0, 0).setAlpha(0.85).setInteractive();

		this._bg.gameObject.setData(DataProps.isInTransition, false);
		this._bg.gameObject.setData(DataProps.isShowDebugPanel, true);
	}

	private createHeaderLabelText (): void {
		const { width, height, screenPercentage: displayPercentage } = this.screenUtility;
		const debugTemplateTextContent = "[DEBUG LOG: F2]";

		this._headerLabelText = new Text(this._scene, width * 0.025, height * 0.015, debugTemplateTextContent, {
			wordWrap: { width: width * 0.95 },
			fontFamily: FontAsset.arial.key,
			fontStyle: "bold",
			fontSize: `${42 * displayPercentage}px`
		});
	}

	private createDebugText ():void {
		const { width, screenPercentage: displayPercentage } = this.screenUtility;
		const position = this._headerLabelText.transform.getDisplayPositionFromCoordinate(0, 1);
		const templateContent = `Text debug here!\nSeek device pixel ratio: ${window.devicePixelRatio}\n`;

		this._debugText = new Text(this._scene, position.x, position.y, templateContent, {
			wordWrap: { width: width * 0.95 },
			fontFamily: FontAsset.arial.key,
			fontSize: `${42 * displayPercentage}px`
		});

		this._debugText.gameObject.setOrigin(0);

		this.createMask();
	}

	private createMask (): void {
		const { width, height } = this.screenUtility;
		const graphics = this._scene.add.graphics().setVisible(false);
		const mask = graphics.createGeometryMask();
		const target = this._debugText.gameObject;

		target.setMask(mask);
		graphics.clear();
		graphics.fillStyle(0xffffff, 1);

		const position = target.getTopLeft();
		graphics.fillRect(
			position.x,
			position.y,
			width - (position.x * 2),
			height - (position.y * 2)
		);

		this._debugTextMask = graphics;
	}

	private createButtons (): void {
		const { screenPercentage: displayPercentage } = this.screenUtility;

		const size = {
			height: this._headerLabelText.gameObject.displayHeight,
			width: 138 * displayPercentage,
			radius: 10 * displayPercentage
		};

		const style = <Phaser.GameObjects.TextStyle> {
			fontSize: `${32 * displayPercentage}px`,
			color: 'black',
			fontFamily: FontAsset.arial.key,
		};

		this.createToggleButton(size, style);
		this.createClearButton(size, style);
	}

	private createToggleButton (size: object, style: Phaser.GameObjects.TextStyle): void {
		const label = "Toggle";
		this._toggleBtn = new Button(this._scene, 0, 0, label, style, size);

		const marginRight = 1.15 * this._bg.transform.displayToOriginalWidthRatio;
		const marginTop = 1.25 * this._bg.transform.displayToOriginalHeightRatio;
		const position = this._bg.gameObject.getTopRight().clone().add(
			new Phaser.Math.Vector2(
				-this._toggleBtn.transform.displayWidth/2 * marginRight,
				this._toggleBtn.transform.displayHeight/2 * marginTop
			)
		);

		this._toggleBtn.gameObject.container.setPosition(position.x, position.y);

		this._toggleBtn.gameObject.click.on(() => {
			if (!this._bg.gameObject.getData(DataProps.isShowDebugPanel)) {
				this.showDebugPanel();
				return;
			}
			this.hideDebugPanel();
		});
	}

	private createClearButton (size: object, style: Phaser.GameObjects.TextStyle): void {
		const label = "Clear";
		this._clearBtn = new Button(this._scene, 0, 0, label, style, size);

		const marginRight = 1.15 * this._bg.transform.displayToOriginalWidthRatio;
		const marginBottom = 1.25 * this._bg.transform.displayToOriginalHeightRatio;
		const position = this._bg.gameObject.getBottomRight().clone().add(
			new Phaser.Math.Vector2(
				-this._clearBtn.transform.displayWidth/2 * marginRight,
				-this._clearBtn.transform.displayHeight/2 * marginBottom,
			)
		);

		this._clearBtn.gameObject.container.setPosition(position.x, position.y);

		this._clearBtn.gameObject.click.on(() => this.clearDebugText());
	}

	private createDraggableContainer (): void {
		const { width, height, screenPercentage } = this.screenUtility;
		const { x: headerX, y: headerY } = this._headerLabelText.gameObject.getBottomLeft();
		const content = this._debugText.gameObject;
		const hitArea = new Phaser.Geom.Rectangle(
			(width / 2) + headerX,
			(height / 2) + headerY,
			width - (headerX * 2),
			height - (headerY * 2)
		);

		this._draggableContainer = this._scene.add
			.container(0, 0, content)
			.setSize(width, height)
			.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

		const inputPlugin = this._scene.input;
		inputPlugin.setDraggable(this._draggableContainer);
		inputPlugin.dragDistanceThreshold = 32 * screenPercentage;

		const props = {
			INITIAL_CONTENT_POS: "initialContentPos",
			ON_REFRESH_CONTENT_POS: "onRefreshContentPos",
			THRESHOLD_CONTENT_POS: "thresholdContentPos",
		};

		this._draggableContainer.setData(props.INITIAL_CONTENT_POS, new Phaser.Math.Vector2(
			content.x,
			content.y,
		));

		const onDragRefresh: Function = () => {
			const { x, y } = content;
			const getX = Math.round(x);
			const getY = Math.round(y);
			this._draggableContainer.setData(props.ON_REFRESH_CONTENT_POS, new Phaser.Math.Vector2(getX, getY));

			this._draggableContainer.setData(props.THRESHOLD_CONTENT_POS, new Phaser.Math.Vector2(
				hitArea.width,
				content.displayHeight - (headerY + hitArea.height),
			));
		};

		const onDrag: Function = (p: Phaser.Input.Pointer, dragX: number, dragY: number) => {
			const getDragX = Math.round(dragX);
			const getDragY = Math.round(dragY);

			const initialContentPos = this._draggableContainer.getData(props.INITIAL_CONTENT_POS) as Phaser.Math.Vector2;
			const onRefreshContentPos = this._draggableContainer.getData(props.ON_REFRESH_CONTENT_POS) as Phaser.Math.Vector2;
			const thresholdContentPos = this._draggableContainer.getData(props.THRESHOLD_CONTENT_POS) as Phaser.Math.Vector2;

			const currentContentPos = onRefreshContentPos.clone()
				.add(new Phaser.Math.Vector2(getDragX, getDragY));

			const stopScrollToTop = currentContentPos.y > initialContentPos.y;
			const stopScrollToDown = currentContentPos.y < -(thresholdContentPos.y);
			const onStopScroll = stopScrollToTop || stopScrollToDown;

			(stopScrollToTop) && content.setPosition(initialContentPos.x, initialContentPos.y);

			// Note: To disable scroll content, set axis to onRefreshContentPos
			(!onStopScroll) && content.setPosition(onRefreshContentPos.x, currentContentPos.y);
		};

		this._draggableContainer.on("dragstart", onDragRefresh)
			.on("drag", onDrag)
			.on("dragend", onDragRefresh);
	}

	showDebugPanel (): void {
		if (this._bg.gameObject.getData(DataProps.isInTransition)) return;
		if (this._bg.gameObject.getData(DataProps.isShowDebugPanel)) return;

		this._bg.gameObject.setData(DataProps.isInTransition, true);
		this._bg.gameObject.setData(DataProps.isShowDebugPanel, true);

		const targets = [
			this._bg.gameObject,
			this._headerLabelText.gameObject,
			this._toggleBtn.gameObject.container,
			this._clearBtn.gameObject.container,
			this._draggableContainer,
			this._debugTextMask
		];
		const maximizePosY = (this._bg.gameObject.getBottomLeft().y - this._headerLabelText.gameObject.getBottomLeft().y);

		this._scene.tweens.add({
			targets: targets,
			y: `-=${maximizePosY}`,
			duration: 200,
			ease: Phaser.Math.Easing.Quadratic.Out,
			onComplete: () => {
				this._bg.gameObject.setData(DataProps.isInTransition, false);
			}
		});
	}

	hideDebugPanel (): void {
		if (this._bg.gameObject.getData(DataProps.isInTransition)) return;
		if (!this._bg.gameObject.getData(DataProps.isShowDebugPanel)) return;

		this._bg.gameObject.setData(DataProps.isInTransition, true);
		this._bg.gameObject.setData(DataProps.isShowDebugPanel, false);

		const targets = [
			this._bg.gameObject,
			this._headerLabelText.gameObject,
			this._toggleBtn.gameObject.container,
			this._clearBtn.gameObject.container,
			this._draggableContainer,
			this._debugTextMask
		];
		const minimizePosY = (this._bg.gameObject.getBottomLeft().y - this._headerLabelText.gameObject.getBottomLeft().y);

		this._scene.tweens.add({
			targets: targets,
			y: `+=${minimizePosY}`,
			duration: 200,
			ease: Phaser.Math.Easing.Quadratic.Out,
			onComplete: () => {
				this._bg.gameObject.setData(DataProps.isInTransition, false);
			}
		});
	}

	updateDebugText (text: string): void {
		this._debugText.gameObject.text += (text + "\n");
	}

	clearDebugText (): void {
		this._debugText.gameObject.setText("");
		// Reset pos
		this._debugText.gameObject.y = this._headerLabelText.gameObject.getBottomLeft().y;
	}

}