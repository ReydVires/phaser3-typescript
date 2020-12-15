import { DataProperty, EventNames, OrientationSceneView } from "./OrientationSceneView";
import { SceneInfo } from "../../../info/SceneInfo";

type OnCreateFinish = (...args: unknown[]) => void;

export class OrientationSceneController extends Phaser.Scene {

	view: OrientationSceneView;

	constructor () {
		super({key:SceneInfo.ORIENTATION.key});
	}

	init (): void {
		this.view = new OrientationSceneView(this);

		this.onCreateFinish(() => this.registerOrientationEvent());

		this.onInitializeOrientation(() => {
			this.registry.set(DataProperty.initialize, true);
			this.registry.set(DataProperty.initOnLandscape, this.isLandscape());
			this.landscapeHandler();
		});
		this.onOrientationWarningShow(() => {
			this.unRegisterOrientationEvent();
			this.scene.start();
		});
		this.onOrientationWarningHide(() => {
			const isInitOnLandscape = this.registry.get(DataProperty.initOnLandscape);
			if (!isInitOnLandscape) return;
			location.reload();
		});
	}

	create (): void {
		this.view.create();
	}

	isLandscape (): boolean {
		if (/Windows/i.test(navigator.userAgent)) return false;
		const cssPortraitOrientation = window.matchMedia('(orientation: portrait)').matches;
		const deviceDimension = window.innerHeight > window.innerWidth;
		const isPortrait = cssPortraitOrientation || deviceDimension;
		return !isPortrait;
	}

	landscapeHandler (): void {
		(this.isLandscape()) ? this.view.showWarning() : this.view.hideWarning();
	}

	registerOrientationEvent (): void {
		this.scale.on("resize", this.landscapeHandler, this);
	}

	unRegisterOrientationEvent (): void {
		this.scale.off("resize", this.landscapeHandler, this);
	}

	update (time: number, dt: number): void {
		this.view.update(time, dt);
	}

	//#region Event method
	onCreateFinish (events: OnCreateFinish): void {
		this.view.event.once(EventNames.onCreateFinish, events);
	}

	onInitializeOrientation (events: Function): void {
		this.view.event.once(EventNames.onInitializeOrientation, events);
	}

	onOrientationWarningShow (events: Function): void {
		this.view.event.on(EventNames.onOrientationWarningShow, events);
	}

	onOrientationWarningHide (events: Function): void {
		this.view.event.on(EventNames.onOrientationWarningHide, events);
	}
	//#endregion

}