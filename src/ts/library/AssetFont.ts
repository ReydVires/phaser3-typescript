import { AssetType } from "../info/AssetType";
import { CustomTypes } from "../../types/custom";

export const FontAsset = {
	arial:{
		key: 'arial',
		path: null,
		type: AssetType.FONT
	},
	roboto:{
		key: 'roboto',
		path: 'fonts/Roboto-Regular.ttf',
		type: AssetType.FONT
	},
};

export function FontList(): CustomTypes.Asset.AssetInfoType[]
{ return Object.values(FontAsset).map((asset) => { return {key: asset.key, url: asset.path}; }) as CustomTypes.Asset.AssetInfoType[]; }