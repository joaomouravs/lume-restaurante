/**
 * Camada de movimento do site (GSAP + ScrollTrigger + SplitText + Lenis).
 *
 * - Rolagem suave (Lenis) apenas em ponteiros finos; toque usa rolagem nativa.
 * - Títulos [data-split] revelados palavra a palavra.
 * - Pausa a rolagem quando <body> recebe .is-locked (menu, lightbox).
 * - Com prefers-reduced-motion nada disso é ativado: o site mantém as
 *   revelações simples em CSS e a rolagem nativa.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;
let started = false;

export function getLenis() {
  return lenis;
}

export function initMotion() {
  if (started) return;
  started = true;
  if (reducedMotion()) return;

  document.documentElement.classList.add('has-motion');

  if (finePointer()) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -80 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Menu e lightbox travam a página: a rolagem suave também para
    new MutationObserver(() => {
      if (document.body.classList.contains('is-locked')) lenis?.stop();
      else lenis?.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  splitHeadings();

  // Recalcula posições depois que fontes e imagens definem a altura final
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/**
 * Pontuação logo após um elemento (ex.: `<em>fogo</em>,`) viraria uma "palavra"
 * separada e poderia quebrar sozinha no início da linha. Move a pontuação
 * para dentro do elemento anterior antes de dividir o título.
 */
function gluePunctuation(root: HTMLElement) {
  root.querySelectorAll('*').forEach((el) => {
    const next = el.nextSibling;
    if (next?.nodeType !== Node.TEXT_NODE) return;
    const match = next.textContent?.match(/^[,.;:!?…)»”]+/);
    if (!match) return;
    el.append(match[0]);
    next.textContent = next.textContent!.slice(match[0].length);
  });
  // Une nós de texto adjacentes ("fogo" + ",") para formarem uma única palavra
  root.normalize();
}

/** Títulos que sobem palavra por palavra, de dentro de uma máscara por linha */
function splitHeadings() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    gluePunctuation(el);
    SplitText.create(el, {
      type: 'lines,words',
      mask: 'lines',
      linesClass: 'split-mask',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 110,
          rotate: 3,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });
}

export { gsap, ScrollTrigger };
