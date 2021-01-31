import { TestPlugin } from "../ts/modules/test/TestPlugin";

export {};

declare global {

	namespace Phaser {

		interface Scene {
			testPlugin: TestPlugin
		}

	}

}