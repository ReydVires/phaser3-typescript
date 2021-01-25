import { DebugSceneController } from "../scenes/debug/DebugSceneController";
import { BootSceneController } from "../scenes/boot/BootSceneController";
import { LoadingSceneController } from "../scenes/loading/LoadingSceneController";
import { OrientationSceneController } from "../scenes/handler/orientation/OrientationSceneController";
import { TitleSceneController } from "../scenes/title/TitleSceneController";
import { GameplaySceneController } from "../scenes/gameplay/GameplaySceneController";
import { ErrorSceneController } from "../scenes/handler/error/ErrorSceneController";

export const SceneInfo = {
	BOOT: {
		key: "BootScene",
		scene: BootSceneController
	},
	DEBUG: {
		key: "DebugScene",
		scene: DebugSceneController
	},
	ERROR: {
		key: "ErrorScene",
		scene: ErrorSceneController
	},
	LOADING: {
		key: "LoadingScene",
		scene: LoadingSceneController
	},
	ORIENTATION: {
		key: "OrientationScene",
		scene: OrientationSceneController
	},
	TITLE: {
		key: "TitleScene",
		scene: TitleSceneController
	},
	GAMEPLAY: {
		key: "GameplayScene",
		scene: GameplaySceneController
	},
};

export function SceneList(): Function[]
{ return Object.values(SceneInfo).map((info) => info.scene); }