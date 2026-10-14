import { css, html, LitElement } from 'lit';
import type { MarqueeConfig, LocalizedText } from './types';

export default class HabkaMarquee extends LitElement {
  static properties = {
    config: { type: Object },
  };

  declare config?: MarqueeConfig;

  static styles = css`
    :host {
      --marquee-background: var(--color-primary, #111827);
      --marquee-color: var(--color-primary-reverse, #ffffff);
      --marquee-duration: 22s;
      --marquee-distance: -50%;
      display: block;
      max-inline-size: 100%;
      overflow: hidden;
      font-family: var(--font-main, inherit);
    }

    .marquee {
      position: relative;
      overflow: hidden;
      color: var(--marquee-color);
      background: var(--marquee-background);
      isolation: isolate;
    }

    .marquee::before,
    .marquee::after {
      position: absolute;
      inset-block: 0;
      z-index: 1;
      width: clamp(1.5rem, 5vw, 5rem);
      content: '';
      pointer-events: none;
    }

    .marquee::before {
      inset-inline-start: 0;
      background: linear-gradient(to right, var(--marquee-background), transparent);
    }

    .marquee::after {
      inset-inline-end: 0;
      background: linear-gradient(to left, var(--marquee-background), transparent);
    }

    .marquee[dir='rtl'] {
      --marquee-distance: 50%;
    }

    .marquee[dir='rtl']::before {
      background: linear-gradient(to left, var(--marquee-background), transparent);
    }

    .marquee[dir='rtl']::after {
      background: linear-gradient(to right, var(--marquee-background), transparent);
    }

    .track {
      display: flex;
      width: max-content;
      animation: marquee-scroll var(--marquee-duration) linear infinite;
      will-change: transform;
    }

    .track.reverse {
      animation-direction: reverse;
    }

    .marquee.pause-on-hover:hover .track,
    .marquee.pause-on-hover:focus-within .track {
      animation-play-state: paused;
    }

    .group {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-around;
      min-width: 100vw;
      padding-block: clamp(0.7rem, 1.6vw, 1rem);
    }

    .item {
      display: inline-flex;
      align-items: center;
      padding-inline: clamp(1rem, 3vw, 2.5rem);
      font-size: clamp(0.875rem, 1.5vw, 1.05rem);
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }

    .separator {
      margin-inline-start: clamp(1.25rem, 3vw, 3rem);
      color: currentColor;
      opacity: 0.65;
    }

    @keyframes marquee-scroll {
      to {
        transform: translate3d(var(--marquee-distance), 0, 0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .track {
        width: 100%;
        animation: none;
      }

      .group {
        width: 100%;
        min-width: 100%;
        justify-content: center;
      }

      .group[aria-hidden='true'],
      .item:not(:first-child) {
        display: none;
      }
    }
  `;

  private localized(value: LocalizedText | undefined, fallback: string): string {
    if (!value) return fallback;
    if (typeof value === 'string') return value;

    const lang = document.documentElement.lang?.split('-')[0] || 'ar';
    return value[lang] || value.ar || value.en || Object.values(value)[0] || fallback;
  }

  private get duration(): number {
    const speed = Number(this.config?.speed);
    return Number.isFinite(speed) ? Math.min(60, Math.max(8, speed)) : 22;
  }

  private get direction(): 'forward' | 'reverse' {
    const direction = this.config?.direction;
    if (Array.isArray(direction)) return direction[0]?.value || 'forward';
    return direction || 'forward';
  }

  private get textDirection(): 'rtl' | 'ltr' {
    const documentDirection = document.documentElement.dir?.toLowerCase();
    if (documentDirection === 'rtl' || documentDirection === 'ltr') {
      return documentDirection;
    }

    const language = document.documentElement.lang?.split('-')[0].toLowerCase();
    return ['ar', 'fa', 'he', 'ur'].includes(language) ? 'rtl' : 'ltr';
  }

  private renderGroup(text: string, separator: string, hidden = false) {
    return html`
      <span class="group" aria-hidden=${hidden ? 'true' : 'false'}>
        ${Array.from({ length: 4 }, () => html`
          <span class="item">
            ${text}<span class="separator" aria-hidden="true">${separator}</span>
          </span>
        `)}
      </span>
    `;
  }

  render() {
    const text = this.localized(this.config?.text, 'اكتشف أحدث منتجاتنا وعروضنا المميزة');
    const separator = this.localized(this.config?.separator, '✦');
    const background = this.config?.background_color || 'var(--color-primary, #111827)';
    const color = this.config?.text_color || 'var(--color-primary-reverse, #ffffff)';
    const directionClass = this.direction === 'reverse' ? 'reverse' : '';
    const pauseClass = this.config?.pause_on_hover === false ? '' : 'pause-on-hover';

    return html`
      <section
        class="marquee ${pauseClass}"
        dir=${this.textDirection}
        style=${`--marquee-duration:${this.duration}s;--marquee-background:${background};--marquee-color:${color}`}
        aria-label=${text}
      >
        <div class="track ${directionClass}">
          ${this.renderGroup(text, separator)}
          ${this.renderGroup(text, separator, true)}
        </div>
      </section>
    `;
  }
}
