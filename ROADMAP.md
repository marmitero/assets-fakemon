# Roadmap de Produção — Sprites Fakemon (Gen V / 96×96)

Plano de execução para gerar os sprites animados dos **21 fakemon** e montar os
**63 GIFs** (front, back, shiny) mantendo 100% de compatibilidade com o loader
da PokeAPI (mesma estrutura de pastas / naming / canvas 96×96).

## 1. Números-chave

| Item | Valor |
|---|---|
| Criaturas | 21 |
| Variantes por criatura | 3 principais (`front`, `back`, `shiny`) + `backshiny` (shiny de costas, opcional/aditiva) |
| Frames por variante | 4 (loop idle) |
| **Imagens a gerar (núcleo)** | **21 × 3 × 4 = 252** |
| **GIFs finais (núcleo)** | **21 × 3 = 63** |
| **Etapas de geração** | **26** (25 lotes de 10 + 1 resto de 2) |
| Extra | `backshiny` (→ `animated/back/shiny/{id}.gif`) é gerado sob demanda, fora das 26 etapas |
| Canvas final | 96×96 px (origem gerada em alta resolução, downscale *nearest-neighbor*) |
| Fundo na geração | **magenta sólido `#FF00FF`** (NÃO transparente) |
| Fundo no GIF final | transparente (removido por *chroma key* do magenta) |

## 2. Regra obrigatória: fundo MAGENTA em TODAS as imagens

Toda imagem/frame sai da IA com **fundo liso magenta puro `#FF00FF` (R255 G0 B255)**,
preenchendo o quadro ponta a ponta — sem cenário, sem chão, sem sombra projetada,
sem gradiente no fundo.

- O magenta é a *chroma key*: depois o fundo é removido por cor, virando transparência.
- Nenhuma criatura usa `#FF00FF` na paleta (os rosas/violetas mais próximos são
  `#FF6688`, `#6B2A8B`, etc. — distintos do magenta puro).
- Nos frames derivados (edições) o fundo magenta deve ser **preservado exatamente
  igual** ao frame âncora.
- Após o *keying*, recomenda-se *de-spill* (remoção do halo magenta nas bordas).

## 3. Fluxo de produção (totalmente automatizado, por etapa)

Não há mais checkpoint manual para remoção de fundo — a esteira roda sozinha ao
final de cada etapa:

```
(1) GERAR (IA)          (2) REMOVER FUNDO          (3) VALIDAR FRAMES      (4) CRIAR GIF            (5) VALIDAR GIF        (6) COMMIT+PUSH
etapa (≤10 imgs)   →    keyout-magenta.mjs   →     frames sobre branco →  pipeline.mjs       →     GIF sobre branco   →   ver §10
frames-raw/.../fN.png   magenta #FF00FF → alpha    (checar 1 cabeça,      96px nearest,             (checar loop/alinh/
fundo MAGENTA           frames/.../fN.png           poses, franja limpa)   loop, transparente        transparência)
```

Cada etapa gera os PNGs magenta (`frames-raw/`), o `keyout-magenta.mjs` faz o chroma
key para `frames/`, valida-se no branco, o `pipeline.mjs` monta os GIFs em
`output/`, valida-se o GIF no branco, e então **commita + faz push** (ver §10).

### Consistência entre frames (frame âncora)
Dentro de cada criatura:
- `front/frame1` → gerado por **texto** (é o sprite de referência / âncora).
- `front/frame2..4` → **edições do frame1** (mesmo personagem, só muda a pose).
- `back/frame1` → **edição do front/frame1** (mesmo personagem, visão traseira).
- `back/frame2..4` → edições do `back/frame1`.
- `shiny/frame1` → **edição do front/frame1** (só troca a paleta).
- `shiny/frame2..4` → edições do `shiny/frame1`.

Isso trava desenho/paleta/posição entre os 4 frames (evita que a criatura "mude"
entre frames).

## 4. Prompt-base (versão magenta)

Usado em todas as gerações (substituir `[SUBJECT]`, `[POSE]` e o modificador de variante):

```
Pixel art game sprite, Nintendo DS Generation V Black/White 2010 era style,
crisp chunky pixels, limited palette (~16 colors), no anti-aliasing,
dithering only on shadows (Bayer), dark-tinted outline (not pure black),
clean readable silhouette, character anchored bottom-center occupying
~70-80% of the frame.
[SUBJECT]
[POSE]
BACKGROUND: completely flat solid magenta #FF00FF filling the entire canvas
edge to edge, plain studio chroma-key backdrop, no scenery, no ground,
no shadow, no gradient, no vignette.
```

Negativo (evita o que estraga o *keying* e o estilo):
```
anti-aliasing, smooth shading, gradients, blurry, soft edges, 3d render, CGI,
photorealistic, watercolor, sketch, jpeg artifacts, bloom, text, watermark,
multiple creatures, extra limbs, deformed, disfigured, transparent background,
checkerboard background, detailed background, scenery, ground shadow
```
> `"transparent background"` e `"white/black background"` entram no negativo para
> forçar o magenta; `"background color"` genérico foi retirado do negativo original
> porque agora o fundo tem cor definida de propósito.

## 5. Cronograma das etapas (lotes de 10)

Legenda: `front f1–4` = 4 frames idle; `back f1–4` = 4 frames traseiros;
`shiny f1–4` = 4 frames paleta shiny.

| Etapa | Imgs | Conteúdo |
|---|---|---|
| **01** | 10 | **001 Sporewalker** — front f1–4, back f1–4, shiny f1–2 |
| **02** | 10 | 001 shiny f3–4 · **004 Emberpup** — front f1–4, back f1–4 |
| **03** | 10 | 004 shiny f1–4 · **006 Pyrewyrm** — front f1–4, back f1–2 |
| **04** | 10 | 006 back f3–4, shiny f1–4 · **007 Cascalope** — front f1–4 |
| **05** | 10 | 007 back f1–4, shiny f1–4 · **009 Aquacaster** — front f1–2 |
| **06** | 10 | 009 front f3–4, back f1–4, shiny f1–4 |
| **07** | 10 | **025 Voltifox** — front f1–4, back f1–4, shiny f1–2 |
| **08** | 10 | 025 shiny f3–4 · **074 Cobblepunch** — front f1–4, back f1–4 |
| **09** | 10 | 074 shiny f1–4 · **094 Grinshade** — front f1–4, back f1–2 |
| **10** | 10 | 094 back f3–4, shiny f1–4 · **095 Tunnelspine** — front f1–4 |
| **11** | 10 | 095 back f1–4, shiny f1–4 · **120 Tidalgleam** — front f1–2 |
| **12** | 10 | 120 front f3–4, back f1–4, shiny f1–4 |
| **13** | 10 | **121 Prismgleam** — front f1–4, back f1–4, shiny f1–2 |
| **14** | 10 | 121 shiny f3–4 · **130 Maelstrom Eel** — front f1–4, back f1–4 |
| **15** | 10 | 130 shiny f1–4 · **131 Glacier Kelpie** — front f1–4, back f1–2 |
| **16** | 10 | 131 back f3–4, shiny f1–4 · **133 Mimicub** — front f1–4 |
| **17** | 10 | 133 back f1–4, shiny f1–4 · **148 Zephyros Serpent** — front f1–2 |
| **18** | 10 | 148 front f3–4, back f1–4, shiny f1–4 |
| **19** | 10 | **149 Zephyros Titan** — front f1–4, back f1–4, shiny f1–2 |
| **20** | 10 | 149 shiny f3–4 · **150 Void Archon** — front f1–4, back f1–4 |
| **21** | 10 | 150 shiny f1–4 · **197 Nocturnyx** — front f1–4, back f1–2 |
| **22** | 10 | 197 back f3–4, shiny f1–4 · **282 Veilancer** — front f1–4 |
| **23** | 10 | 282 back f1–4, shiny f1–4 · **384 Skyveil Wyrm** — front f1–2 |
| **24** | 10 | 384 front f3–4, back f1–4, shiny f1–4 |
| **25** | 10 | **448 Aurastrider** — front f1–4, back f1–4, shiny f1–2 |
| **26** | 2  | 448 shiny f3–4 *(resto final)* |

> A lista frame-a-frame (qual frame deriva de qual âncora) está em
> `sprite-pipeline/manifest.mjs`, que também alimenta o script de GIF.

## 6. Árvore de arquivos

```
sprite-pipeline/
├── manifest.mjs            # ids, nomes, delays, lista de 252 frames (fonte de verdade)
├── pipeline.mjs            # FASE B: downscale 96 (nearest) + monta os GIF
├── keyout-magenta.mjs      # utilitário: remove magenta (fallback/QA do keying manual)
├── package.json
├── frames-raw/             # FASE A: PNGs da IA COM FUNDO MAGENTA (meu output)
│   └── 001/{front,back,shiny}/frame1.png ...
├── frames/                 # CHECKPOINT: PNGs SEM FUNDO (devolvidos por você)
│   └── 001/{front,back,shiny}/frame1.png ...
└── output/sprites/pokemon/versions/generation-v/black-white/
    ├── animated/{id}.gif               # front
    ├── animated/back/{id}.gif          # back
    ├── animated/shiny/{id}.gif         # shiny (frente)
    └── animated/back/shiny/{id}.gif    # shiny de costas (extra)
```

## 7. FASE B — montagem dos GIF (spec)

- **Resize:** alta resolução → **96×96 com *nearest-neighbor*** (`sharp kernel:'nearest'`,
  ou ImageMagick `-filter point`). Sem interpolação (não borra o pixel).
- **GIF:** 4 frames, `loop=0` (infinito), `dispose=background`, fundo transparente.
- **Delay por frame (centésimos de s)** — vindo da doc:

| Criatura | delay | ms | | Criatura | delay | ms |
|---|---|---|---|---|---|---|
| 001 Sporewalker | 15 | 150 | | 131 Glacier Kelpie | 15 | 150 |
| 004 Emberpup | 15 | 150 | | 133 Mimicub | 15 | 150 |
| 006 Pyrewyrm | 12 | 120 | | 148 Zephyros Serpent | 12 | 120 |
| 007 Cascalope | 15 | 150 | | 149 Zephyros Titan | 10 | 100 |
| 009 Aquacaster | 12 | 120 | | 150 Void Archon | 8 | 80 |
| 025 Voltifox | 15 | 150 | | 197 Nocturnyx | 12 | 120 |
| 074 Cobblepunch | 10 | 100 | | 282 Veilancer | 12 | 120 |
| 094 Grinshade | 8 | 80 | | 384 Skyveil Wyrm | 8 | 80 |
| 095 Tunnelspine | 10 | 100 | | 448 Aurastrider | 8 | 80 |
| 120 Tidalgleam | 8 | 80 | | 121 Prismgleam | 8 | 80 |
| 130 Maelstrom Eel | 10 | 100 | | | | |

- **Back sprite:** escala ~+10 a +40% na hora de compor (âncora centro-inferior),
  como no jogo original.
- **Posição:** criatura ancorada em `bottom-center` (pés no fim do canvas).

## 8. Checkpoints de aprovação (QA)

1. **Etapa 1 (001)** serve de *prova de estilo*: aprovar pixel art, magenta e animação
   antes de seguir em massa.
2. Após cada variante com 4 frames retornados: gero o `.gif` e confiro loop/ancoragem.
3. Paleta shiny confere com a tabela de cores da doc antes de fechar a criatura.

## 9. Integração no jogo (zero refactor)

A pasta `output/` replica exatamente o caminho da PokeAPI. É só subir no CDN e trocar
a URL base:

```ts
// ANTES: https://raw.githubusercontent.com/PokeAPI/sprites/master
// DEPOIS: https://seu-cdn.com
const sprite = `${BASE}/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
```

## 10. Regra de fim de etapa — commit + push (OBRIGATÓRIO)

Ao **finalizar cada etapa** (depois de gerar, remover o fundo, validar no branco,
criar os GIFs e validá-los), e antes de iniciar a próxima:

1. `git add -A` (entram também os artefatos da etapa: `frames-raw/`, `frames/`,
   `output/` e `_preview/`).
2. `git commit -m "etapa N: ..."` — mensagem no padrão:
   `etapa <n>: <criaturas/IDs> — <variantes concluídas> (X GIFs)`.
3. `git push origin arena/01a04978-assets-fakemon` (sempre nesta branch).

Ou via o helper: `git commit -am "..." && git push`. Nada de acumular várias etapas
sem versionar. Em caso de correção no meio (ex.: frame regenerado), o commit da etapa
já captura o resultado final aprovado.

## 11. Variante extra: shiny de costas (`backshiny`)

Além das 3 variantes do núcleo, cada criatura pode ter o **shiny visto de costas**
(equivalente ao `back/shiny` da PokeAPI):
- frames em `frames-raw/{id}/backshiny/frame1..4.png` (e `frames/{id}/backshiny/...`);
- cada frame = paleta shiny aplicada sobre a pose do frame de costas correspondente
  (`back/frameN`), para o loop bater com o `back` normal;
- saída: `animated/back/shiny/{id}.gif`;
- é **aditiva e sob demanda** (não entra na contagem das 26 etapas).
