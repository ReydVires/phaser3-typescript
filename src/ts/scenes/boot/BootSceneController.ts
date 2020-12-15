import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { LoaderHelper } from "../../helper/LoaderHelper";
import { AudioController } from "../../modules/audio/AudioController";
import { SceneInfo } from "../../info/SceneInfo";
import { FontList } from "../../library/AssetFont";

export class BootSceneController extends Phaser.Scene {

	constructor () {
		super({key: SceneInfo.BOOT.key});
	}

	init (): void {}

	create (): void {
		Promise.all([
			ScreenUtilController.getInstance().init(this),
			AudioController.getInstance().init(this),
			LoaderHelper.LoadFonts(FontList()),
		]).then(() => {
			this.scene.launch(SceneInfo.LOADING.key);
		}).catch((error) => Error("Bootscene::\n" + error));
	}

}