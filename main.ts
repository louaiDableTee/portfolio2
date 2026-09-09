// main.ts — add your TypeScript code here
// Note: browsers do not run TypeScript directly. Compile with tsc or a bundler for production.

class DeviceMockup extends HTMLElement {
  protected readonly kind: 'laptop' | 'phone' | 'tablet';

  constructor(kind: 'laptop' | 'phone' | 'tablet') {
    super();
    this.kind = kind;
  }

  connectedCallback() {
    const image = this.getAttribute('image') ?? '';
    const video = this.getAttribute('video') ?? '';
    const alt = this.getAttribute('alt') ?? 'Project interface preview';
    const source = video || image;
    const filename = source.split('/').pop() ?? 'media';
    const media = video
      ? `<video src="${video}" muted autoplay loop playsinline preload="metadata"></video>`
      : `<img src="${image}" alt="" loading="lazy" />`;
    const videoChrome = video && this.kind === 'laptop'
      ? `<div class="device-windowbar" aria-hidden="true"><span></span><span></span><span></span><i>worku.tn</i></div>`
      : '';
    const videoDock = video && this.kind === 'laptop'
      ? `<div class="device-dock" aria-hidden="true"><div class="device-dock__apps"><span class="dock-app dock-app--finder"></span><span class="dock-app dock-app--safari"></span><span class="dock-app dock-app--mail"></span><span class="dock-app dock-app--calendar">31</span><span class="dock-app dock-app--notes"></span><span class="dock-app dock-app--messages"></span><span class="dock-app dock-app--store">A</span><span class="dock-app dock-app--terminal">&gt;_</span><span class="dock-app dock-app--vscode">&lt;&gt;</span><span class="dock-app dock-app--figma"></span><span class="dock-separator"></span><span class="dock-app dock-app--trash"></span></div></div>`
      : '';
    const frameClass = `${this.kind}-mockup${video ? ' laptop-mockup--video' : ''}`;

    this.setAttribute('role', 'img');
    this.setAttribute('aria-label', alt);
    this.innerHTML = `
      <div class="${frameClass}">
        <div class="mockup-screen">
          ${videoChrome}
          <div class="mockup-media">${media}</div>
          ${videoDock}
          <span class="mockup-placeholder">Image placeholder<br>${filename}</span>
        </div>
      </div>`;

    const screen = this.querySelector<HTMLElement>('.mockup-screen');
    const preview = this.querySelector<HTMLImageElement | HTMLVideoElement>('img, video');
    if (!screen || !preview) return;

    const showPlaceholder = () => screen.classList.add('is-empty');
    preview.addEventListener('error', showPlaceholder, { once: true });
    preview.addEventListener('load', () => screen.classList.remove('is-empty'), { once: true });
  }
}

class LaptopMockup extends DeviceMockup {
  constructor() { super('laptop'); }
}

class PhoneMockup extends DeviceMockup {
  constructor() { super('phone'); }
}

class TabletMockup extends DeviceMockup {
  constructor() { super('tablet'); }
}

customElements.define('laptop-mockup', LaptopMockup);
customElements.define('phone-mockup', PhoneMockup);
customElements.define('tablet-mockup', TabletMockup);
