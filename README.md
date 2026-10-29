# Lume — Cozinha de Fogo

Site institucional de um restaurante de cozinha contemporânea brasileira, construído com **Astro 7**, CSS com design tokens e TypeScript vanilla. Sem framework de UI: o HTML é gerado de forma estática e o JavaScript só é carregado onde há interação.

**No ar:** https://lume-restaurante-bice.vercel.app

> **English:** a site for a fictional contemporary Brazilian restaurant, built with Astro 7,
> CSS design tokens and vanilla TypeScript. Pages are static HTML and JavaScript loads only
> where there is interaction. Opening hours live in one data file that drives the "open now"
> badge, the hours table, the `Restaurant` JSON-LD and the time slots of a three-step
> reservation flow with `.ics` export. The producers map is computed at build time from
> coordinates, every photo goes through one color-grading script, and with
> `prefers-reduced-motion` the GSAP/Lenis motion is replaced by simple CSS reveals.

## Como rodar

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:4321
npm run build     # build de produção em ./dist
npm run preview   # serve o build de produção localmente
npm run photos    # reaplica o tratamento de cor às fotos (photos/originals → src/assets/images)
```

**Produção (Vercel):** https://lume-restaurante-bice.vercel.app — projeto `joaomouravs-projects/lume-restaurante`. Deploy de preview com `vercel`, produção com `vercel --prod`.

> O primeiro `build` gera cerca de 430 variações de imagem (AVIF, WebP e fallback) e leva uns 2 minutos. Os builds seguintes usam cache.

## Páginas

| Rota        | Conteúdo |
|-------------|----------|
| `/`         | Hero com vídeo da brasa e transição ao rolar, manifesto, pratos assinatura, chef, mapa dos produtores, prévia do cardápio, jornada do Menu Fogo (rolagem horizontal fixada), experiências, galeria, depoimentos, visite e reserva rápida |
| `/cardapio` | Cardápio completo com navegação fixa (scroll-spy), filtros alimentares, Menu Fogo e informações úteis |
| `/reservas` | Reserva em 3 etapas com horários gerados a partir do funcionamento real, validação acessível, resumo e exportação `.ics` |
| `404`       | Página de erro no mesmo tom visual |

## Estrutura

```
photos/originals/         # fotos originais, sem tratamento (fonte do `npm run photos`)
public/video/             # vídeo do hero (1280 e 720 px, H.264)
scripts/grade-photos.mjs  # direção de arte: tratamento de cor único para todas as fotos
scripts/build-map.mjs     # gera o mapa do Brasil (Natural Earth) usado na seção de produtores
src/
├── assets/images/        # fotos já tratadas (otimizadas no build)
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
- **Direção de arte**: todas as fotos passam pela mesma receita de cor (`scripts/grade-photos.mjs`: saturação contida, balanço quente, sombras âmbar e vinheta; ajustes por foto em `OVERRIDES`). O grão de filme é aplicado via CSS para não pesar nos arquivos. Para trocar uma foto, coloque o original em `photos/originals/` com o mesmo nome e rode `npm run photos`.
- **Vídeo do hero**: loop de 8 s sem emenda (crossfade do fim para o início), tratado com a mesma paleta. Carrega só depois da página (`load` + ocioso), nunca com Save-Data ou movimento reduzido, pausa fora da tela e tem botão de pausa. A capa (`hero-fire-poster.jpg`) é o primeiro quadro do loop.
- **Movimento** (`src/scripts/motion.ts`): GSAP + ScrollTrigger + SplitText e rolagem suave com Lenis (apenas mouse/trackpad). Transição do hero, jornada horizontal fixada, títulos revelados palavra por palavra e foto que segue o cursor no cardápio. Com `prefers-reduced-motion`, nada disso é ativado: o site mantém revelações simples em CSS, rolagem nativa e a jornada vira um carrossel de deslizar.
- **Mapa dos produtores** (`src/data/producers.ts`): pontos, rotas em arco até a cozinha e distâncias calculados no build a partir de latitude/longitude, sobre um mapa gerado de dados do Natural Earth (domínio público). Para adicionar um produtor, inclua-o em `producers.ts` com as coordenadas do município. A lista de produtores é o controle acessível principal; os pontos do mapa são um atalho para mouse e toque.
- **Transição entre páginas** (`src/scripts/transitions.ts`): cortina com o logo ao sair de uma página e ao chegar na seguinte, com pré-carregamento das páginas no hover. Âncoras, links externos, nova aba e movimento reduzido seguem a navegação comum; uma trava em CSS abre a cortina sozinha se o JavaScript falhar.
- **Acessibilidade**: link para pular ao conteúdo, landmarks, abas WAI-ARIA com navegação por setas, menu com foco preso e fechamento por Esc, lightbox em `<dialog>`, carrossel de depoimentos pausável, erros de formulário associados aos campos e contraste AA.
- **SEO**: title e description por página, canonical, Open Graph e Twitter Cards, JSON-LD `Restaurant` com horários, `sitemap-index.xml` e `robots.txt`.

## Pendências para produção

1. **Envio da reserva**: o envio hoje é simulado (`src/scripts/reservation.ts`, no bloco de submit). Ligar a um backend, a um serviço de reservas ou a um webhook.
2. **Newsletter**: mesma situação (`Footer.astro`).
3. **Conteúdo real**: nome, textos, preços, contatos e redes sociais são fictícios.
4. **Domínio**: na Vercel, canonical, sitemap, robots.txt e imagens de compartilhamento usam automaticamente a URL de produção do projeto. Ao conectar um domínio próprio, defina a variável de ambiente `SITE_URL` (ex.: `https://lumerestaurante.com.br`).
5. **Fotos e vídeo**: as fotos são do Unsplash e o vídeo do hero é do Mixkit (ambos com licença gratuita que permite uso comercial) e representam o conceito. O ideal é substituí-las por um ensaio próprio do restaurante, mantendo os mesmos nomes de arquivo.

As imagens de referência visual estão em `docs/referencias/`.
