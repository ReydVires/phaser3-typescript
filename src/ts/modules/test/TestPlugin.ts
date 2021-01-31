export class TestPlugin extends Phaser.Plugins.BasePlugin {

	constructor (pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);
	}

	init (): void {
		console.log("TestPlugin is live!");
	}

	/**
	 * Create method test
	 */
	createMethod (): void {
		console.log("call createMethod()");
	}

}