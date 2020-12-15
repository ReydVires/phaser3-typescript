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
		this.view.update(time, dt);
	}

	clearDebugText (): void {
		this.view.clearDebugText();
	}

	show (): void {
		this.view.showDebugPanel();
	}

	updateDebugText (text: string): void {
		this.view.updateDebugText(text);
	}

	onCreateFinish (events: OnCreateFinish): void {
		this.view.event.once(EventNames.onCreateFinish, events);
	}

}