import { CustomTypes } from "../../types/custom";

declare const CONFIG: CustomTypes.CONFIG;
const _CONFIG = CONFIG;
export { _CONFIG as CONFIG };

export const enum GameState {
	PREPARING,
	PLAYING,
	PAUSE,
	GAMEOVER,
}

export const enum CameraKeyList {
	MAIN = 'main',
	BACKGROUND = 'bg',
	UI = 'ui',
};