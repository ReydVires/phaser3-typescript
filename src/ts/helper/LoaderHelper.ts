import { CustomTypes } from "../../types/custom";
import { CONFIG } from "../info/GameInfo";
import { AssetType } from "../info/AssetType";

export class LoaderHelper {

	static LoadImage (scene: Phaser.Scene, ...imagesInfo: CustomTypes.Asset.AssetInfoType[]): void {
		for (const imageInfo of imagesInfo) {
			if (imageInfo.type !== AssetType.STATIC) continue;
			scene.load.image(imageInfo.key, CONFIG.BASE_ASSET_URL + imageInfo.url);
		}
	}

	static LoadSpritesheet (scene: Phaser.Scene, ...spritesheetsInfo: CustomTypes.Asset.AssetInfoType[]): void {
		for (const spritesheetInfo of spritesheetsInfo) {
			if (spritesheetInfo.type !== AssetType.SPRITESHEET) continue;
			scene.load.spritesheet(spritesheetInfo.key, CONFIG.BASE_ASSET_URL + spritesheetInfo.url, {
				frameWidth: spritesheetInfo.width as number,
				frameHeight: spritesheetInfo.height
			});
		}
	}

	static LoadAudio (scene: Phaser.Scene, ...audiosInfo: CustomTypes.Asset.AssetInfoType[]): void {
		for (const audioInfo of audiosInfo) {
			if (audioInfo.type !== AssetType.AUDIO) continue;
			if (Array.isArray(audioInfo.url)) {
				const audioPath = audioInfo.url.map((path) => CONFIG.BASE_ASSET_URL + path);
				scene.load.audio(audioInfo.key, audioPath);
				continue;
			}
			scene.load.audio(audioInfo.key, CONFIG.BASE_ASSET_URL + audioInfo.url);
		}
	}

	static LoadFonts (fonts: CustomTypes.Asset.AssetInfoType[]): Promise<any[]> {
		return Promise.all(fonts.map((v) => LoaderHelper.LoadFont(v.key, v.url as string)));
	}

	static LoadFont (key: string, url: string | null): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!url) return resolve();
			const path = CONFIG.BASE_ASSET_URL + url;
			const styles = `@font-face {font-family: "${key}"; src: url("${path}")}`;
			const element = document.createElement('style');
			element.innerHTML = styles;
			document.head.appendChild(element);

			document.fonts.load('10pt "' + key + '"')
				.then(() => resolve())
				.catch(() => reject(Error('Load font error: ' + path)));
		});
	}

	static LoadAssets (scene: Phaser.Scene, assets: CustomTypes.Asset.ObjectAsset): void {
		let assetInfo: CustomTypes.Asset.AssetInfoType;
		for (const key in assets) {
			assetInfo = assets[key];
			if (assetInfo.type === AssetType.STATIC) {
				scene.load.image(assetInfo.key, CONFIG.BASE_ASSET_URL + assetInfo.url);
			}
			else if (assetInfo.type === AssetType.SPRITESHEET) {
				scene.load.spritesheet(assetInfo.key, CONFIG.BASE_ASSET_URL + assetInfo.url, {
					frameWidth: assetInfo.width as number,
					frameHeight: assetInfo.height
				});
			}
			else if (assetInfo.type === AssetType.AUDIO) {
				if (Array.isArray(assetInfo.url)) {
					const audioPath = assetInfo.url.map((path: string) => CONFIG.BASE_ASSET_URL + path);
					scene.load.audio(assetInfo.key, audioPath);
					continue;
				}
				scene.load.audio(assetInfo.key, CONFIG.BASE_ASSET_URL + assetInfo.url);
			}
			else {
				// eslint-disable-next-line no-console
				console.warn("Asset type is undefined:", assetInfo);
			}
		}
	}

}