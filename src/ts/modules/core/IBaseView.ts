import { ScreenUtilController } from "../screenutility/ScreenUtilController";

export interface IBaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	create (sceneData?: object): void;

}