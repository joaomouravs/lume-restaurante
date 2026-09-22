/**
 * Remove o esmaecimento de borda (.scroll-fade) quando a barra chega ao fim
 * ou quando não há o que rolar.
 */
export function initScrollFade() {
  document.querySelectorAll<HTMLElement>('.scroll-fade').forEach((el) => {
    const update = () => el.classList.toggle('is-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    el.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
}
