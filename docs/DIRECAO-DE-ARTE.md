# Direção de Arte & Regras de Geração — Fakemon (sprites Gen-V)

> Documento de referência canônico do **estilo visual** e das **regras de geração** das imagens.
> Todo sprite novo DEVE seguir este documento. Não mudar o estilo sem decisão explícita.
> Para o andamento do projeto, ver `AI_STATE.md`. Para o design de cada criatura, ver `REFERENCIAS-FAKEMON.md`.

---

## 1. Objetivo e estilo alvo

Produzir sprites de batalha animados que **replicam o estilo dos sprites de Pokémon da 5ª geração (Black/White)**, para substituir os sprites da estrutura da PokeAPI.

Características obrigatórias do estilo:

- **Pixel art** limpa, com outline escuro definido em volta de toda a criatura.
- **Canvas final 96×96** px, com a criatura **ancorada em bottom-center** (pés/base alinhados ao fundo do quadro).
- **Paleta enxuta** (~16 cores por sprite): sombreamento em blocos de cor, **dither apenas em sombras**, nunca no preenchimento principal.
- **Fundo totalmente transparente** no produto final (PNG com alpha e GIF com `-dispose Background`).
- Visual de sprite de batalha: corpo inteiro (`full body`), centrado, legível em tamanho pequeno.
- Sem texto, sem molduras, sem grid, sem "character sheet", sem múltiplas cópias da criatura na mesma imagem.

## 2. O que é gerado (4 variantes × 4 frames)

Cada fakemon tem **4 variantes**, cada uma com **4 frames** de animação (loop de idle em 4 tempos):

| Variante | Caminho de saída (PokeAPI gen-V black-white) | Preenchimento do canvas |
|---|---|---|
| `front` | `animated/{id}.gif` | 0.90 |
| `back` | `animated/back/{id}.gif` | 1.00 |
| `shiny` | `animated/shiny/{id}.gif` | 0.90 |
| `backshiny` | `animated/back/shiny/{id}.gif` | 1.00 |

- `front`/`back`: forma normal, de frente e de costas.
- `shiny`: forma cromática (recolor da frente).
- `backshiny`: forma cromática de costas (equivale ao `back/shiny` da PokeAPI — variante aditiva).

Os PNGs intermediários seguem:
- Raw (com fundo): `sprite-pipeline/frames-raw/{id3}/{variante}/frame{1..4}.png`
- Keyed (sem fundo): `sprite-pipeline/frames/{id3}/{variante}/frame{1..4}.png`
- GIF final: `sprite-pipeline/output/sprites/pokemon/versions/generation-v/black-white/...` (tabela acima)

`{id3}` = id com 3 dígitos (ex.: `001`, `025`, `074`).

## 3. Regra DO FUNDO (crítica)

- **TODA** imagem gerada (text-to-image ou edição) deve usar **fundo MAGENTA sólido `#FF00FF`**.
- O magenta é removido depois pelo chroma key (`keyout-magenta.mjs`).
- **A criatura NUNCA pode conter rosa, magenta-vivo, nem qualquer decoração na cor do fundo.** Esses tons são removidos pelo keying e somem do sprite final.
  - **Evitar:** brilho/glow rosa, chamas rosas, plasma rosa, nariz rosa, aros mágicos magenta.
  - **Cores seguras para elementos mágicos:** dourado/âmbar, ciano, teal, verde, vermelho-laranja/lava (com azul baixo).
  - Lição registrada: o shiny do Voltifox com plasma **rosa** teve o plasma apagado pelo keying; foi refeito em **dourado**. Brilho de lava **vermelho** (ex.: Cobblepunch) sobrevive porque o azul é baixo.
- Sempre incluir no prompt, literalmente: `Solid MAGENTA background #FF00FF` E `NO pink / NO magenta on the creature`.

## 4. Animação (loop de 4 frames)

Ritmo padrão de idle (o f4 costuma ser igual ao f1 para fechar o loop):

- **frame 1 — neutro:** pose de repouso (âncora).
- **frame 2 — antecipação / "bob-up":** sobe levemente no hover, infla/alonga um pouco; elemento aceno (orelhas abrem, cauda enrola, brilho sobe um tom).
- **frame 3 — pico de ação:** frame mais energético — brilho no **máximo**, boca/olhos abrem no auge, elemento dispara (faíscas, vapor, brasas, jato), cauda/asa chicoteia.
- **frame 4 — retorno ao neutro:** na prática usa-se `cp frame1.png frame4.png` (ver §7).

O `delay` (em centésimos de segundo) é por criatura e está no `manifest.mjs` (ex.: 15 = 150 ms por frame; 8 = 80 ms, mais rápido). GIF: `-delay {delay} -loop 0`.

## 5. Regras de consistência (as mais importantes)

1. **Mesmo personagem nos 4 frames.** Não variar design, forma, proporções nem paleta entre frames de uma variante.
2. **Regra de âncora:** o **frame 1** de cada variante é gerado primeiro (e idealmente validado) antes dos demais. Os frames f2/f3 são **edições que referenciam o frame1** via `images` (nunca text-to-image solto, que cria um personagem novo).
3. **Nunca disparar edições que referenciam uma âncora no mesmo lote em que a âncora é criada** — ela ainda não existe em disco para o lote seguinte.
4. **Costas (`back`/`backshiny`):** UMA cabeça só, sempre no mesmo lado nos 4 frames; **sem rosto** (sem olhos/boca quando a traseira não os mostra); costas devem parecer a MESMA criatura da frente (mesma cor, placas, cauda).
5. **Shiny é um recolor** da forma normal (mesma silhueta/pose), com paleta distinta mas harmoniosa; trocam-se as cores do corpo E dos efeitos mágicos, preservando brancos/dentes quando fizer sentido.

## 6. Regras de prompt (checklist literal)

Toda geração deve pedir, em inglês:
- `Pixel-art Gen-5 Pokemon style sprite` + nome/tipo da criatura.
- `full body, centered`, pose e vista (`3/4 view facing left` para frente; `symmetric back view` para costas).
- `Solid MAGENTA background #FF00FF`.
- `ONE single creature only, NOT a character sheet, no grid, no panels, no close-ups, no text`.
- Cores exatas em hex quando a paleta for crítica; ex.: `deep indigo-navy #1B1A33 ... glowing lemon-yellow eyes #FFE34D`.
- `NO pink and NO hot-magenta on the creature` (+ `NO red/NO yellow` quando a variante shiny tiver paleta fria, para evitar vazamento de cor).

Se o gerador devolver ficha/contact-sheet (várias cópias), reforçar: `ONE single creature only ... NOT a character sheet`.

## 7. Pipeline técnico (cadeia obrigatória por lote)

Toolchain: **Node v22 + sharp**, **ImageMagick 6** (`/usr/bin/convert`). Rodar tudo a partir de `sprite-pipeline/`.

1. **Gerar** os PNGs com fundo magenta em `frames-raw/{id3}/{variante}/`.
2. **Chroma key** (remove magenta → PNG transparente em `frames/`):
   ```
   node keyout-magenta.mjs            # tudo
   node keyout-magenta.mjs --id 94    # só uma criatura
   ```
   - `KEY_TOL=150` (magenta vira transparente), `SPILL_TOL=215` (de-spill da franja).
   - Regra `hotPink`: remove halo rosa/magenta (vermelho alto com **azul bem acima do verde**, `b-g>30` e `b>100`), preservando lava vermelha (g≈b baixos), dourado/tan (g>b) e lavanda/violeta legítimos (r baixo / r<b).
3. **Validar sobre BRANCO** (nunca confiar no fundo magenta):
   - Frame: `convert frames/.../frameN.png -background white -flatten -resize 240x out.png`
   - GIF: `convert "gif[0]" -background white -flatten -filter point -resize 200x out.png`
   - `montage ... -tile 4x1 -geometry +3+3 -background gray30` e inspecionar visualmente.
4. **Construir GIFs**:
   ```
   node pipeline.mjs                   # build completo (todas as criaturas/variantes)
   node pipeline.mjs --id 74 --variant front
   ```
   - **Trava de qualidade:** só gera GIF com **4 frames**; variantes incompletas são puladas (e qualquer GIF parcial é removido com `fs.rmSync`).
   - sharp faz **auto-crop pela UNIÃO dos 4 frames** + pad 2% + **resize NEAREST** para ~96 e ancora **bottom-center**.
   - ImageMagick empilha: `-dispose Background -delay {cs} -loop 0`.
5. **Validar o GIF** sobre branco (passo 3) — conferir loop, consistência e ausência de franja rosa.
6. **f4 de retorno teimoso:** se a edição não devolver um neutro convincente, usar `cp frames-raw/{id}/{var}/frame1.png frames-raw/{id}/{var}/frame4.png` antes do keyout.

## 8. Workflow de uma etapa (limite de 10 gerações)

- **Máximo de 10 gerações de imagem por turno/etapa.** Ao atingir, parar e continuar no próximo ciclo.
- Ordem recomendada para fechar uma criatura usando ≤10 gerações:
  1. **front f1** (âncora por texto) → keyout → validar.
  2. **front f2, f3** (edições sobre front f1).
  3. **back f1** (âncora por texto, costas) e **shiny f1** (recolor sobre front f1).
  4. **back f2, f3** (sobre back f1) e **shiny f2, f3** (sobre shiny f1).
  5. **backshiny f1** (recolor sobre back f1).
  6. No ciclo seguinte: **backshiny f2, f3** (sobre backshiny f1).
  7. `f4 = cp do f1` para as 4 variantes; keyout; pipeline; validar; commit.
- Contagem típica: ~10 gerações para front+back+shiny completos (f4 por cópia) e o backshiny f1; backshiny f2/f3 fecham no ciclo seguinte (+2).

## 9. Regras de commit/entrega

- **Ao final de cada etapa, commitar e enviar TUDO** (frames raw/keyed, GIFs, previews e docs).
- Branch fixa: **`arena/01a04978-assets-fakemon`** (nunca trabalhar em outra branch).
  ```
  git add -A
  git commit -m "<etapa>: <criatura> ..."
  git push origin arena/01a04978-assets-fakemon
  ```
- Antes de dar uma etapa por encerrada: rodar `node pipeline.mjs` (build completo) e confirmar que **todos os GIFs construíveis a partir dos frames existentes foram gerados** (nenhum "sem frames" inesperado para criaturas dadas como prontas).
- **Atualizar `AI_STATE.md`** ao final de cada etapa.

## 10. Previews

- Os GIFs finais (transparência) vão para `sprite-pipeline/_preview/{id}-{variante}.gif`.
- A versão para inspeção sobre fundo branco:
  ```
  convert SRC.gif -coalesce -background white -alpha remove -layers optimize-plus _preview/{id}-{variante}-BRANCO.gif
  ```
  (Usar `-alpha remove`/`optimize-plus`, NÃO `-flatten`, para o GIF animado.)
