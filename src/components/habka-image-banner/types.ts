export type LocalizedText = string | Record<string, string>;

export interface ImageBannerConfig {
  image?: string;
  alt_text?: LocalizedText;
}
