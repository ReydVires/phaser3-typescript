const enum DataProps {
	originalPosY = "originalPosY"
}

export class DraggableContainer {

	private _hitArea: Phaser.Geom.Rectangle;
	private _container: Phaser.GameObjects.Container;

	constructor (private _scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		this.init(x, y, width, height)
			.setInteractive()
			.refreshHitArea();
	}

	get gameObject (): Phaser.GameObjects.Container {
		return this._container;
	}

	private init (x: number, y: number, width: number, height: number): this {
		this._container = this._scene.add.container(x, y);
		this._container.setSize(width, height);
		this._container.setData(DataProps.originalPosY, y);

		this._hitArea = new Phaser.Geom.Rectangle(
			(this._container.width / 2) + x,
			(this._container.height / 2) + y,
			this._container.width + x,
			this._container.height + y
		);

		return this;
	}

	private setInteractive (): this {
		this._container.setInteractive({ draggable: true }) // Set drag enable
			.on("drag", this.onDrag.bind(this));

		return this;
	}

	private onDrag (p: Phaser.Input.Pointer, dragX: number, dragY: number): void {
		const originalPosY = this._container.getData(DataProps.originalPosY) as number;
		const deltaHeight = this._container.getBounds().height - this._container.height + originalPosY;
		if (deltaHeight <= 0) return; // Is over viewport

		let virtualY = dragY;
		if (virtualY < -deltaHeight) {
			virtualY = -deltaHeight;
		}
		else if (virtualY > originalPosY) {
			virtualY = originalPosY;
		}

		this._container.setY(virtualY);
	}

	refreshHitArea (): void {
		const originalPosY = this._container.getData(DataProps.originalPosY) as number;
		this._hitArea.height = this._container.getBounds().height - originalPosY;
		this._container.input.hitArea = this._hitArea;
	}

	add (child: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]): void {
		this._container.add(child);
		this.refreshHitArea();
	}

}