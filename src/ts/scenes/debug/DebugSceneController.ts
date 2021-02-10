import { DebugSceneView, EventNames } from "./DebugSceneView";
import { SceneInfo } from "../../info/SceneInfo";

type OnCreateFinish = (...args: unknown[]) => void;

export class DebugSceneController extends Phaser.Scene {

	view: DebugSceneView;

	constructor () {
		super({key: SceneInfo.DEBUG.key});
	}

	init (): void {
		this.view = new DebugSceneView(this);

		this.onCreateFinish(() => {
			this.scene.scene.input.enabled = false;
			this.scene.setVisible(false);
			this.scene.sendToBack();
		});
	}

	create (): void {
		this.view.create();
	}

	update (time: number, dt: number): void {
		if (!this.scene.isVisible()) return;
		if (Phaser.Input.Keyboard.JustDown(this.view.toggleKey)) {
			(this.view.isShowDebugPanel) ? this.view.hideDebugPanel() : this.view.showDebugPanel();
		}
	}

	clearDebugText (): void {
		this.view.clearDebugText();
	}

	show (): void {
		this.view.showDebugPanel();
	}

	hide (): void {
		this.view.hideDebugPanel();
	}

	updateDebugText (text: string): void {
		this.view.updateDebugText(text);
	}

	onCreateFinish (events: OnCreateFinish): void {
		this.view.event.once(EventNames.onCreateFinish, events);
	}

}