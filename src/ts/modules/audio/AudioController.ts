export class AudioController {

	static instance: AudioController;

	private _scene: Phaser.Scene;
	private _bgm: Phaser.Sound.BaseSound;
	private _bgmKey: string;
	private _enableAudio: boolean;
	private _sfxCache: Map<string, Phaser.Sound.BaseSound>;
	private _isInitialize: boolean;

	private constructor () {}

	static getInstance (): AudioController {
		if (!AudioController.instance) {
			AudioController.instance = new AudioController();
		}
		return AudioController.instance;
	}

	init (scene: Phaser.Scene): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this._isInitialize) reject();
			this._scene = scene;
			this._sfxCache = new Map<string, Phaser.Sound.BaseSound>();
			this._enableAudio = true;
			this._isInitialize = true;

			this._scene.sound.pauseOnBlur = false;
			this.registerVisibilityChangeEvent();
			resolve();
		});
	}

	private registerVisibilityChangeEvent (): void {
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") {
				if (this._enableAudio) this.unmute();
			}
			if (!document.hidden) return;
			this.pauseBGM();
		});
	}

	playBGM (key: string, restart: boolean = true, config?: Phaser.Types.Sound.SoundConfig): void {
		if (!restart && this._bgm?.isPlaying) return;
		this.stopBGM();

		if (!this._enableAudio) return;

		const bgmConfig = config ?? { loop: true };
		if (this._bgmKey === key) {
			this._bgm.play(bgmConfig);
		}
		else {
			this._bgmKey = key;
			this._bgm = this._scene.sound.add(key, bgmConfig);
			this._bgm.play();
		}
	}

	stopBGM (): void {
		if (this._bgm?.isPlaying) this._bgm.stop();
	}

	pauseBGM (): void {
		if (this._bgm?.isPlaying) this._bgm.pause();
	}

	resumeBGM (): void {
		if (this._bgm?.isPaused) this._bgm.resume();
	}

	setBGMVolume (volume: number): void {
		if (this._bgm instanceof Phaser.Sound.WebAudioSound) this._bgm.setVolume(volume);
	}

	playSFX (key: string, config?: Phaser.Types.Sound.SoundConfig, force: boolean = true): void {
		if (!this._enableAudio) return;
		if (!this._sfxCache.has(key)) {
			const sfx = this._scene.sound.add(key, config);
			sfx.play();
			this._sfxCache.set(key, sfx);
		}
		else {
			if (!force && this._sfxCache.get(key)?.isPlaying) return;
			this._sfxCache.get(key)?.play(config);
		}
	}

	unmute (): void {
		this._enableAudio = true;
		this.resumeBGM();
	}

	mute (): void {
		this._enableAudio = false;
		this.pauseBGM();
	}

	isMuted (): boolean {
		return this._enableAudio;
	}

	clearSFXCache (): void {
		for (let [key, sfx] of this._sfxCache) {
			sfx.destroy();
		}
		this._sfxCache.clear();
	}

}