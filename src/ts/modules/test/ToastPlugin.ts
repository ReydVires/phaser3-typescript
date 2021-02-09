import { injectExtension } from "./ToastExtension";

export class ToastPlugin extends Phaser.Plugins.BasePlugin {

	constructor (pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);
	}

	init (): void {
		injectExtension();
	}

	/**
	 * Create method test
	 */
	createMethod (): void {
		console.log("call createMethod()");
	}

}