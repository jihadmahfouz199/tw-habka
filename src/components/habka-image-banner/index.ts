import { css, html, LitElement, nothing } from 'lit';
import type { ImageBannerConfig, LocalizedText } from './types';

export default class HabkaImageBanner extends LitElement {
  static properties = {
    config: { type: Object },
  };

  declare config?: ImageBannerConfig;

  static styles = css`
    :host {
      display: block;
      max-inline-size: 100%;
      overflow: hidden;
    }

    .banner,
    .banner__image {
      display: block;
      inline-size: 100%;
    }

    .banner__image {
      block-size: auto;
    }
  `;

  private localized(value: LocalizedText | undefined): string {
    if (!value) return '';
    if (typeof value === 'string') return value;

    const lang = document.documentElement.lang?.split('-')[0] || 'ar';
    return value[lang] || value.ar || value.en || Object.values(value)[0] || '';
  }

  render() {
    const image = this.config?.image;
    if (!image) return nothing;

    return html`
      <section class="banner">
        <img
          class="banner__image"
          src=${image}
          alt=${this.localized(this.config?.alt_text)}
          loading="lazy"
          decoding="async"
        >
      </section>
    `;
  }
}
