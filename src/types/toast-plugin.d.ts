import { ToastPlugin } from "../ts/modules/test/ToastPlugin";

export {};

declare global {

	namespace Phaser {

		interface Scene {
			toast: ToastPlugin
		}

		namespace Toast {

			enum Position {
				TOP_LEFT,
				TOP_CENTER,
				TOP_RIGHT,
				MIDDLE_LEFT,
				MIDDLE_CENTER,
				MIDDLE_RIGHT,
				BOTTOM_LEFT,
				BOTTOM_CENTER,
				BOTTOM_RIGHT,
			}

			type Config = {
				showDuration: number,
				manualClose: boolean
				textStyle: Phaser.Types.GameObjects.Text.TextStyle
			}

			type TextureInfo = {
				width: number,
				height: number,
				color: number,
				radius: number,
			}

		}

	}

}