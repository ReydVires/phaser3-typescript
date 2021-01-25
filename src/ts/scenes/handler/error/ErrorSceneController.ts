import { SceneInfo } from "../../../info/SceneInfo";
import { ErrorSceneView, EventNames } from "./ErrorSceneView";

type OnClickRetry = (data: string) => void;

export class ErrorSceneController extends Phaser.Scene {

	view: ErrorSceneView;

	constructor () {
		super({ key: SceneInfo.ERROR.key });
	}

	init (): void {
		this.view = new ErrorSceneView(this);
	}

	create (): void {
		this.view.create();
	}

	showErrorPanel (show: boolean, errorMessage: string, onClickRetry?: OnClickRetry): Function {
		const selfBinding = this.showErrorPanel.bind(this, show, errorMessage, onClickRetry) as Function;
		if (!show) {
			this.view.hidePanel();
			return selfBinding;
		}

		this.view.updateErrorMessage(errorMessage);

		if (typeof onClickRetry !== "undefined") this.view.event.once(EventNames.onClickRetry, onClickRetry);

		this.view.showPanel();
		return selfBinding;
	}

	update (time: number, dt: number): void {}

}