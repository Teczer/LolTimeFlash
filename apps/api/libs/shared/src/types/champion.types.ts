/**
 * Champion and Skin Types
 * Used for fetching champion splash arts from Data Dragon API
 */

export type ChampionName = string;

export interface SkinData {
  skinName: string;
  skinImageUrl: string;
}

export interface AllSkinsSplashArts {
  championName: ChampionName;
  splashArts: SkinData[];
}
