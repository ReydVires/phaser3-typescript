import { DraggableButton, Props } from "./DraggableButton";

export class DebugDraggableContainer extends Phaser.GameObjects.Container {

	private _thresholdY: number;
	private _originY: number;
	private _dragY: number;

	private _isDragStart: boolean;
	private _isStopDragBottom: boolean;
	private _isStopDragTop: boolean;

	private _interactiveActive: boolean;

	constructor (scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.setSize(width, height);
		this.init();
	}

	private init (): void {
		this._thresholdY = 0;
		this._originY = this.y;
		this._dragY = -this._originY;
		this._interactiveActive = false;

		this.registerInteractive();
		this.scene.input.dragDistanceThreshold = 28;
		this.scene.add.existing(this);
	}

	private registerInteractive (): void {
		this.setInteractive({ draggable: true }) // Set drag enable
			.on("pointerdown", this.onPointerDown.bind(this))
			.on("drag", this.onDrag.bind(this))
			.on("pointerout", this.onPointerOut.bind(this));

		// Apply the drag interactive area
		this.input.hitArea = new Phaser.Geom.Rectangle(
			this.width / 2,
			(this.height / 2) + this._originY,
			this.width,
			this.height + this._originY
		);
		this.scene.input.on(Phaser.Input.Events.DRAG_START, () => {
			this._interactiveActive = false;
		});
	}

	private onPointerDown (p: Phaser.Input.Pointer): void {
		this._isDragStart = true;
		this._interactiveActive = true;
		this._dragY += Math.round(p.y);
	}

	private onDrag (p: Phaser.Input.Pointer): void {
		const deltaY = Math.round(p.y - this._dragY);
		let getVirtualY = deltaY;

		if (getVirtualY > this._originY) {
			getVirtualY = this._originY;
			this._isStopDragBottom = true;
		}
		else if (getVirtualY < this._thresholdY) {
			getVirtualY = this._thresholdY;
			this._isStopDragTop = true;
		}
		else {
			this._isStopDragBottom = (getVirtualY > this._originY);
			this._isStopDragTop = (getVirtualY < this._thresholdY);
		}
		this.refreshContentPosition(getVirtualY);
	}

	private onPointerOut (p: Phaser.Input.Pointer): void {
		if (!this._isDragStart) return;
		this._isDragStart = false;
		if (this._isStopDragBottom) {
			this._dragY = -this._originY;
		}
		else if (this._isStopDragTop) {
			this._dragY = -this._thresholdY;
		}
		else {
			this._dragY -= Math.round(p.y);
		}
		this.clickActionEvent(p.x, p.y);
	}

	private refreshContentPosition (y: number): void {
		let localY = y;
		this.getAll().forEach((child) => {
			const gameObject = child as Phaser.GameObjects.RenderTexture;
			gameObject.y = localY;
			localY = gameObject.getBottomLeft().y;
		});
	}

	private clickActionEvent (pointerX: number, pointerY: number): void {
		if (!this._interactiveActive) return;
		const children = this.getAll();
		for (const child of children) {
			const gameObject = child as Phaser.GameObjects.RenderTexture;
			const isContainObject = gameObject.getBounds().contains(pointerX, pointerY);
			const isDraggableButton = gameObject.getData(Props.typeOf) === DraggableButton;
			const hasInteractive = isContainObject && isDraggableButton;
			if (!hasInteractive) continue;
			const callback = gameObject.getData(Props.onClick) as Function;
			if (typeof callback === "function") callback(child); // Execute callback
		}
	}

	setThresholdY (height: number): void {
		this._thresholdY = (height <= 0 ? 0 : (height * -1));
	}

	resetContentPosition (): void {
		this._thresholdY = 0;
		this._dragY = -this._originY;
		this.refreshContentPosition(this._originY);
	}

}