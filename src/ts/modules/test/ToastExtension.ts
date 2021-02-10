const POSITION = {
	TOP_LEFT: 0,
	TOP_CENTER: 1,
	TOP_RIGHT: 2,
	MIDDLE_LEFT: 3,
	MIDDLE_CENTER: 4,
	MIDDLE_RIGHT: 5,
	BOTTOM_LEFT: 6,
	BOTTOM_CENTER: 7,
	BOTTOM_RIGHT: 8,
};

function injectExtension (): void {
	const extensionKey = "Toast";
	Object.defineProperty(Phaser, extensionKey, {
		value: {
			Position: POSITION
		},
		writable: false
	});
}

export { injectExtension };