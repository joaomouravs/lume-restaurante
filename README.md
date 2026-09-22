# Lume — Cozinha de Fogo

Site institucional de um restaurante de cozinha contemporânea brasileira, construído com **Astro 7**, CSS com design tokens e TypeScript vanilla. Sem framework de UI: o HTML é gerado de forma estática e o JavaScript só é carregado onde há interação.

## Como rodar

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:4321
npm run build     # build de produção em ./dist
npm run preview   # serve o build de produção localmente
```

**Produção (Vercel):** https://lume-restaurante-bice.vercel.app — projeto `joaomouravs-projects/lume-restaurante`. Deploy de preview com `vercel`, produção com `vercel --prod`.

> O primeiro `build` gera cerca de 430 variações de imagem (AVIF, WebP e fallback) e leva uns 2 minutos. Os builds seguintes usam cache.

## Páginas

| Rota        | Conteúdo |
|-------------|----------|
| `/`         | Hero dividido, manifesto, pratos assinatura, chef, prévia do cardápio, experiências, galeria, depoimentos, visite e reserva rápida |
| `/cardapio` | Cardápio completo com navegação fixa (scroll-spy), filtros alimentares, Menu Fogo e informações úteis |
| `/reservas` | Reserva em 3 etapas com horários gerados a partir do funcionamento real, validação acessível, resumo e exportação `.ics` |
| `404`       | Página de erro no mesmo tom visual |

## Estrutura

```
src/
├── assets/images/        # fotos originais (otimizadas no build)
├── components/
│   ├── layout/           # Header (menu em tela cheia) e Footer
│   ├── menu/             # MenuItemRow, reutilizado na home e no cardápio
│   ├── sections/         # uma seção por arquivo
│   └── ui/               # Icon, Media (imagem otimizada), Logo, SectionHeader
├── data/                 # conteúdo: site.ts, menu.ts, content.ts
├── layouts/BaseLayout    # <head>, SEO, JSON-LD, header/footer
├── pages/                # rotas
├── scripts/              # comportamentos isolados em módulos TS
└── styles/               # tokens.css (design system) e global.css
```

**Todo o conteúdo editável fica em `src/data/`**: horários, endereço, contatos, pratos, preços, experiências, depoimentos e galeria. Os horários alimentam ao mesmo tempo o indicador "aberto agora", a tabela de horários, o JSON-LD e os horários disponíveis na reserva.

## Decisões técnicas

- **Imagens**: `Media.astro` gera `<picture>` com AVIF e WebP, `srcset` e `sizes` reais. Imagens abaixo da dobra usam lazy loading; as do hero usam `fetchpriority="high"`.
- **Fontes**: Cormorant (display) e Manrope (texto), servidas pelo próprio site via Fontsource, com preload do subset latino.
- **Animações**: revelação por IntersectionObserver, parallax com *scroll-driven animations* do CSS (onde o navegador suporta) e transições nativas entre páginas (`@view-transition`). Tudo respeita `prefers-reduced-motion`.
- **Acessibilidade**: link para pular ao conteúdo, landmarks, abas WAI-ARIA com navegação por setas, menu com foco preso e fechamento por Esc, lightbox em `<dialog>`, carrossel de depoimentos pausável, erros de formulário associados aos campos e contraste AA.
- **SEO**: title e description por página, canonical, Open Graph e Twitter Cards, JSON-LD `Restaurant` com horários, `sitemap-index.xml` e `robots.txt`.

## Pendências para produção

1. **Envio da reserva**: o envio hoje é simulado (`src/scripts/reservation.ts`, no bloco de submit). Ligar a um backend, a um serviço de reservas ou a um webhook.
2. **Newsletter**: mesma situação (`Footer.astro`).
3. **Conteúdo real**: nome, textos, preços, contatos e redes sociais são fictícios.
4. **Domínio**: na Vercel, canonical, sitemap, robots.txt e imagens de compartilhamento usam automaticamente a URL de produção do projeto. Ao conectar um domínio próprio, defina a variável de ambiente `SITE_URL` (ex.: `https://lumerestaurante.com.br`).
5. **Fotos**: as fotos são do Unsplash (licença gratuita, uso comercial permitido) e representam o conceito. O ideal é substituí-las por um ensaio próprio do restaurante, mantendo os mesmos nomes de arquivo.

As imagens de referência visual estão em `docs/referencias/`.
