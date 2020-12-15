import { Assets } from "./AssetLoading";
import { AssetType } from "../info/AssetType";

export const Animations = {

	loading_text: {
		key: 'loading_text',
		type: AssetType.ANIMATION,
		spritesheetRef: Assets.loading_text.key,
		start: 0,
		end: 3,
		frameSpeed: 4,
		loop: true
	},

};