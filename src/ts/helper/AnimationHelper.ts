import { CustomTypes } from "../../types/custom";

export class AnimationHelper {

	static AddAnimation (scene: Phaser.Scene, animationObject: CustomTypes.Asset.AnimationInfoType): Phaser.Animations.Animation | false {
		const frames = scene.anims.generateFrameNumbers(animationObject.spritesheetRef, {
			start: animationObject.start,
			end: animationObject.end
		});
		return scene.anims.create({
			key: animationObject.key,
			frames: frames,
			frameRate: animationObject.frameSpeed,
			repeat: animationObject.loop ? -1 : 0
		});
	}

	static AddAnimationList (scene: Phaser.Scene, animationObjects: CustomTypes.Asset.AnimationAsset): void {
		for (const animKey in animationObjects) {
			const animationObject = animationObjects[animKey];
			this.AddAnimation(scene, animationObject);
		}
	}

}