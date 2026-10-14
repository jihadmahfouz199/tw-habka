export type LocalizedText = string | Record<string, string>;

export interface SelectOption {
  label: string;
  value: 'forward' | 'reverse';
  key: string;
}

export interface MarqueeConfig {
  text?: LocalizedText;
  separator?: LocalizedText;
  speed?: number | string;
  direction?: 'forward' | 'reverse' | SelectOption[];
  pause_on_hover?: boolean;
  background_color?: string;
  text_color?: string;
}
