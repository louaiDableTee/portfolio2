/**
 * Portfolio runtime.
 *
 * Deliberately small: three device mockups, a proof-image slot that degrades to a
 * labelled placeholder when the real screenshot is not in the repo yet, a
 * click-to-load video, a lightbox and the mobile nav.
 *
 * Rule this file enforces: nothing here ever invents a visual. A missing file
 * renders as a visible "proof needed" slot naming the file it is waiting for.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fileOf = (path: string) => path.split('/').pop() ?? 'media';

/* ------------------------------------------------------------------ *
 * Device mockups (laptop / tablet / phone)
 * ------------------------------------------------------------------ */

class DeviceMockup extends HTMLElement {
  protected readonly kind: 'laptop' | 'phone' | 'tablet';

  constructor(kind: 'laptop' | 'phone' | 'tablet') {
    super();
    this.kind = kind;
  }

  connectedCallback() {
    const image = this.getAttribute('image') ?? '';
    const video = this.getAttribute('video') ?? '';
    const poster = this.getAttribute('poster') ?? '';
    const alt = this.getAttribute('alt') ?? 'Project interface preview';
    const filename = fileOf(video || image);

    // A recording can be tens of megabytes. With a poster we show a real frame
    // and only fetch the file when someone asks for it. Without one we fall
    // back to loading lazily as the element nears the viewport.
    const media = video
      ? poster
        ? `<img class="mockup-poster" src="${esc(poster)}" alt="" loading="lazy" decoding="async" />
           <button class="mockup-play" type="button" data-src="${esc(video)}">
             <span class="video-play" aria-hidden="true"></span>
             <span class="video-label">Play recording</span>
           </button>`
        : `<video data-src="${esc(video)}" muted loop playsinline preload="none"></video>`
      : `<img src="${esc(image)}" alt="" loading="lazy" />`;

    const videoChrome =
      video && this.kind === 'laptop'
        ? `<div class="device-windowbar" aria-hidden="true"><span></span><span></span><span></span><i>worku.tn</i></div>`
        : '';

    const videoDock =
      video && this.kind === 'laptop'
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
          <span class="mockup-placeholder">Proof needed<br>${esc(filename)}</span>
        </div>
      </div>`;

    const screen = this.querySelector<HTMLElement>('.mockup-screen');
    const preview = this.querySelector<HTMLImageElement | HTMLVideoElement>('img, video');
    if (!screen || !preview) return;

    preview.addEventListener('error', () => screen.classList.add('is-empty'), { once: true });
    preview.addEventListener('load', () => screen.classList.remove('is-empty'), { once: true });

    if (preview instanceof HTMLVideoElement) {
      preview.addEventListener('loadeddata', () => screen.classList.remove('is-empty'), { once: true });
      lazyVideo(preview);
    }

    // Poster mode: fetch the recording only when the visitor asks for it.
    const play = this.querySelector<HTMLButtonElement>('.mockup-play');
    play?.addEventListener('click', () => {
      const src = play.dataset.src;
      if (!src) return;
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('aria-label', alt);
      this.querySelector('.mockup-poster')?.remove();
      play.replaceWith(v);
      v.play().catch(() => {
        /* the controls are there if autoplay is refused */
      });
    });
  }
}

/** Attach src and start playback only once the video is near the viewport. */
function lazyVideo(video: HTMLVideoElement) {
  const src = video.dataset.src;
  if (!src) return;

  const start = () => {
    if (video.src) return;
    video.src = src;
    video.play().catch(() => {
      /* autoplay refused; the poster frame stays, which is fine */
    });
  };

  if (!('IntersectionObserver' in window)) {
    start();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        start();
        io.disconnect();
      }
    },
    { rootMargin: '250px' },
  );
  io.observe(video);
}

class LaptopMockup extends DeviceMockup {
  constructor() {
    super('laptop');
  }
}
class PhoneMockup extends DeviceMockup {
  constructor() {
    super('phone');
  }
}
class TabletMockup extends DeviceMockup {
  constructor() {
    super('tablet');
  }
}

customElements.define('laptop-mockup', LaptopMockup);
customElements.define('phone-mockup', PhoneMockup);
customElements.define('tablet-mockup', TabletMockup);

/* ------------------------------------------------------------------ *
 * <proof-shot> — a screenshot slot that never fakes anything
 *
 *   src      path to the screenshot
 *   alt      required, describes what the screenshot shows
 *   caption  short dated caption, e.g. "GSC sitemaps — Success, 14 pages"
 *   chrome   optional browser-bar label, e.g. "search.google.com/search-console"
 *   pending  present = the file has not been supplied yet
 * ------------------------------------------------------------------ */

class ProofShot extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src') ?? '';
    const alt = this.getAttribute('alt') ?? '';
    const caption = this.getAttribute('caption') ?? '';
    const chrome = this.getAttribute('chrome');
    const pending = this.hasAttribute('pending') || !src;

    // Intrinsic size, so the browser reserves the right box before the file
    // arrives and the page does not jump.
    const w = this.getAttribute('width');
    const h = this.getAttribute('height');
    const size = w && h ? ` width="${esc(w)}" height="${esc(h)}"` : '';

    const bar =
      chrome !== null
        ? `<div class="browser-bar" aria-hidden="true"><span></span><span></span><span></span><i>${esc(chrome)}</i></div>`
        : '';

    const missing = `
      <div class="proof-missing">
        <b>[TODO: proof needed]</b>
        <code>${esc(src || 'file name to be decided')}</code>
        <span>${esc(alt || 'Screenshot pending')}</span>
      </div>`;

    const picture = pending
      ? missing
      : `<button class="proof-zoom" type="button" aria-label="Enlarge: ${esc(alt)}">
           <img src="${esc(src)}" alt="${esc(alt)}"${size} loading="lazy" decoding="async" />
           <span class="proof-zoom__hint" aria-hidden="true">Enlarge</span>
         </button>${missing}`;

    this.innerHTML = `
      <figure class="proof${pending ? ' is-pending' : ''}">
        <div class="proof-frame">${bar}<div class="proof-body">${picture}</div></div>
        ${caption ? `<figcaption class="proof-caption">${esc(caption)}</figcaption>` : ''}
      </figure>`;

    if (pending) return;

    const fig = this.querySelector('.proof');
    const img = this.querySelector('img');
    // If the file is absent on disk, fall back to the labelled slot.
    img?.addEventListener('error', () => fig?.classList.add('is-pending'), { once: true });
  }
}

customElements.define('proof-shot', ProofShot);

/* ------------------------------------------------------------------ *
 * <proof-video> — click to load, so a heavy file costs nothing up front
 *
 *   src / poster / label / caption
 * ------------------------------------------------------------------ */

class ProofVideo extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src') ?? '';
    const poster = this.getAttribute('poster') ?? '';
    const label = this.getAttribute('label') ?? 'Play recording';
    const caption = this.getAttribute('caption') ?? '';
    const pending = this.hasAttribute('pending') || !src;

    if (pending) {
      this.innerHTML = `
        <figure class="proof is-pending video-proof">
          <div class="proof-frame"><div class="proof-body">
            <div class="proof-missing">
              <b>[TODO: proof needed]</b>
              <code>${esc(src || 'screen recording')}</code>
              <span>${esc(label)}</span>
            </div>
          </div></div>
          ${caption ? `<figcaption class="proof-caption">${esc(caption)}</figcaption>` : ''}
        </figure>`;
      return;
    }

    this.innerHTML = `
      <figure class="proof video-proof">
        <div class="proof-frame"><div class="proof-body">
          <button class="video-poster" type="button">
            ${poster ? `<img src="${esc(poster)}" alt="" loading="lazy" />` : '<span class="video-poster__bg" aria-hidden="true"></span>'}
            <span class="video-play" aria-hidden="true"></span>
            <span class="video-label">${esc(label)}</span>
          </button>
        </div></div>
        ${caption ? `<figcaption class="proof-caption">${esc(caption)}</figcaption>` : ''}
      </figure>`;

    const button = this.querySelector<HTMLButtonElement>('.video-poster');
    button?.addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.className = 'video-player';
      video.setAttribute('aria-label', label);
      button.replaceWith(video);
      video.play().catch(() => {
        /* user can press play */
      });
      video.focus();
    });
  }
}

customElements.define('proof-video', ProofVideo);

/* ------------------------------------------------------------------ *
 * Lightbox
 * ------------------------------------------------------------------ */

function initLightbox() {
  let dialog: HTMLDialogElement | null = null;

  const ensure = () => {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
      <img alt="" />
      <p class="lightbox-caption"></p>`;
    dialog.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t === dialog || t.classList.contains('lightbox-close')) dialog?.close();
    });
    document.body.append(dialog);
    return dialog;
  };

  document.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('.proof-zoom');
    if (!button) return;

    const source = button.querySelector('img');
    if (!source) return;

    const box = ensure();
    const target = box.querySelector('img');
    const caption = box.querySelector('.lightbox-caption');
    if (target) {
      target.src = source.src;
      target.alt = source.alt;
    }
    if (caption) {
      caption.textContent =
        button.closest('.proof')?.querySelector('.proof-caption')?.textContent ?? '';
    }
    box.showModal();
  });
}

/* ------------------------------------------------------------------ *
 * Mobile navigation
 * ------------------------------------------------------------------ */

function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const menu = document.querySelector<HTMLElement>('.nav-menu');
  if (!toggle || !menu) return;

  const set = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') set(false);
  });
}

/* ------------------------------------------------------------------ *
 * Reveal on scroll
 *
 * The CSS only hides [data-reveal] under html.js, so without JavaScript
 * everything renders normally. Elements already in view on load are
 * revealed immediately rather than waiting for a scroll that never comes.
 * ------------------------------------------------------------------ */

function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  items.forEach((el) => io.observe(el));
}

initLightbox();
initNav();
initReveal();
