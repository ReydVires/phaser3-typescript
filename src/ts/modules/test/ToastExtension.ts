enum Position {
	TOP_LEFT,
	TOP_CENTER,
	TOP_RIGHT,
	MIDDLE_LEFT,
	MIDDLE_CENTER,
	MIDDLE_RIGHT,
	BOTTOM_LEFT,
	BOTTOM_CENTER,
	BOTTOM_RIGHT,
}

function injectExtension (): void {
	Object.defineProperty(Phaser, "Toast", {
		value: {
			Position: Position
		},
		writable: true,
		configurable: true
	});
}

export { injectExtension };