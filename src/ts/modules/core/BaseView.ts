import { ScreenUtilController } from "../screenutility/ScreenUtilController";

export interface BaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	create (sceneData?: object): void;

}