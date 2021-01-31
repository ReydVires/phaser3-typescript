import { EventNames, TitleSceneView } from "./TitleSceneView";
import { SceneInfo } from "../../info/SceneInfo";
import { AudioController } from "../../modules/audio/AudioController";
import { Audios } from "../../library/AssetAudio";

type OnCreateFinish = (...args: unknown[]) => void;

export class TitleSceneController extends Phaser.Scene {

	view: TitleSceneView;
	audioController: AudioController;

	constructor () {
		super({key:SceneInfo.TITLE.key});
	}

	init (): void {
		this.view = new TitleSceneView(this);
		this.audioController = AudioController.getInstance();

		this.onClickPlay(() => this.scene.start(SceneInfo.GAMEPLAY.key));
		this.onClickMute(() => {
			(this.audioController.isMuted()) ? this.audioController.mute() : this.audioController.unmute();
		});
		this.onCreateFinish(() => {
			this.playBGMWhenReady();
		});
	}

	create (): void {
		this.view.create();
	}

	playBGMWhenReady (): void {
		if (!this.sound.locked) {
			this.audioController.playBGM(Audios.bgm_title.key, false);
			return;
		}
		// This will wait for 'unlocked' to fire and then play
		this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
			this.audioController.playBGM(Audios.bgm_title.key);
		});
	}

	update (time: number, dt: number): void {}

	onClickPlay (events: Function): void {
		this.view.event.on(EventNames.onClickPlay, events);
	}

	onClickMute (events: Function): void {
		this.view.event.on(EventNames.onClickMute, events);
	}

	onCreateFinish (events: OnCreateFinish): void {
		this.view.event.once(EventNames.onCreateFinish, events);
	}

}