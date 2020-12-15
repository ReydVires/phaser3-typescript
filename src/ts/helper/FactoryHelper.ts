export namespace FactoryHelper {

	export type GameObjectsLoading = {
		gameObjects: Phaser.GameObjects.Group,
		event: { enable: Function, disable: Function, destroy: Function }
	};

}

export class FactoryHelper {

	static CreateLoading (scene: Phaser.Scene, x: number, y: number, radius = 32, widthBar = 5): FactoryHelper.GameObjectsLoading {
		const bars: Phaser.GameObjects.Group = scene.add.group();
		const height = radius * 0.5;
		const width = widthBar;
		// The center of the loading animation
		const cx = x;
		const cy = y;
		const depth = 30;

		let angle = -90; // Start at top
		for (let i = 0; i < 12; ++i) { // Create 12 bars each rotated and offset from the center
			const { x, y } = Phaser.Math.RotateAround({ x: cx, y: cy - (radius - (height * 0.5)) }, cx, cy, Phaser.Math.DEG_TO_RAD * angle);
			// Create each bar with position, rotation, and alpha
			const bar = scene.add.rectangle(x, y, width, height, 0xffffff, 1).setDepth(depth).setAngle(angle).setAlpha(0.2);
			bars.add(bar);
			angle += 30; // Increment by 30 degrees for next bar
		}

		let index = 0;
		const tweens: Phaser.Tweens.Tween[] = []; // Save created tweens for reuse
		const timeEvent = scene.time.addEvent({
			delay: 70,
			loop: true,
			callback: () => {
				// If we already have a tween then reuse it
				if (index < tweens.length) {
					const tween = tweens[index];
					tween.restart();
				}
				else {
					// Make a new tween for the current bar
					const bar = bars.getChildren()[index] as Phaser.GameObjects.Graphics;
					const tween = scene.tweens.add({
						targets: bar,
						alpha: 0.2,
						duration: 400,
						onStart: () => bar.setAlpha(1),
					});
					tweens.push(tween);
				}
				if (++index >= bars.getChildren().length) { index = 0; }
			}
		});

		// List of functions
		const enable = (): Phaser.GameObjects.Group => bars.setActive(true).setVisible(true);
		const disable = (): Phaser.GameObjects.Group => bars.setActive(false).setVisible(false);
		const destroy = (): void => {
			disable();
			timeEvent.destroy();
			bars.destroy();
		};

		return {
			gameObjects: bars,
			event: { enable: enable, disable: disable, destroy: destroy }
		};
	}

}