import { DebugSceneController } from "../../debug/DebugSceneController";
import { SceneInfo } from "../../../info/SceneInfo";

export class DebugController {

	private _debugSceneController: DebugSceneController;
	private _scenePlugin: Phaser.Scenes.ScenePlugin;

	constructor (private _scene: Phaser.Scene) {
		this._scenePlugin = _scene.scene;
	}

	init (): void {
		this._debugSceneController = this._scenePlugin.get(SceneInfo.DEBUG.key) as DebugSceneController;
	}

	private isActive (): boolean {
		return this._debugSceneController?.scene.isActive();
	}

	isVisible (): boolean {
		return this._debugSceneController.scene.isVisible();
	}

	show (minimize?: boolean): void {
		if (!this.isActive() || this._debugSceneController.scene.isVisible()) return;
		this._debugSceneController.scene.setVisible(true);
		this._debugSceneController.scene.bringToTop();
		this._debugSceneController.input.enabled = true;
		if (minimize) {
			this._debugSceneController.hide();
			return;
		}
		this._debugSceneController.show();
	}

	hide (): void {
		if (!this.isActive()) return;
		this._debugSceneController.scene.setVisible(false);
		this._debugSceneController.scene.sendToBack();
		this._debugSceneController.input.enabled = false;
	}

	log (text: string): void {
		if (!this.isActive()) return;
		this._debugSceneController.updateDebugText(text);
	}

	clearText (): void {
		if (!this.isActive()) return;
		this._debugSceneController.clearDebugText();
	}

}