export class DraggableContainer {

	private _originY: number;
	private _originX: number;
	private _hitArea: Phaser.Geom.Rectangle;
	private _container: Phaser.GameObjects.Container;

	constructor (private _scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		this._container = _scene.add.container(x, y);
		this._container.setSize(width, height);
		this.init();
		this.registerInteractive();
		this.refreshHitArea();
	}

	private init (): void {
		this._originX = this._container.x;
		this._originY = this._container.y;
		this._hitArea = new Phaser.Geom.Rectangle(
			(this._container.width / 2) + this._originX,
			(this._container.height / 2) + this._originY,
			this._container.width + this._originX,
			this._container.height + this._originY
		);
	}

	private registerInteractive (): void {
		this._container.setInteractive({ draggable: true }) // Set drag enable
			.on("drag", this.onDrag.bind(this));
	}

	refreshHitArea (): void {
		this._hitArea.height = this._container.getBounds().height - this._originY;
		this._container.input.hitArea = this._hitArea;
	}

	private onDrag (p: Phaser.Input.Pointer, dragX: number, dragY: number): void {
		const deltaHeight = this._container.getBounds().height - this._container.height + this._originY;
		if (deltaHeight <= 0) return; // Is over viewport
		let virtualY = dragY;
		if (virtualY < -deltaHeight) {
			virtualY = -deltaHeight;
		}
		else if (virtualY > this._originY) {
			virtualY = this._originY;
		}
		this._container.setY(virtualY);
	}

	get gameObject (): Phaser.GameObjects.Container { return this._container; }

	add (child: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]): void {
		this._container.add(child);
		this.refreshHitArea();
	}

}