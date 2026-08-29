# AI_STATE — Estado do projeto Fakemon (ponto de retomada)

> **Leia este arquivo primeiro.** Ele diz ONDE o projeto parou, O QUE falta e COMO continuar,
> sem alterar estilo nem regras. Regras completas de arte/geração: `docs/DIRECAO-DE-ARTE.md`.
> Design de cada criatura e substituição: `docs/REFERENCIAS-FAKEMON.md`.
> Atualizado ao final de cada etapa (após commit/push).

**Última atualização:** Etapa 10 em andamento — 094 Grinshade **concluído (4/4)**; 095 Tunnelspine com front/back prontos.
**Branch de trabalho (fixa):** `arena/01a04978-assets-fakemon`
**Remoto:** https://github.com/marmitero/assets-fakemon.git

---

## 1. Objetivo (resumo)

Gerar sprites de batalha **animados em estilo Gen-V (Pokémon Black/White)** para **21 fakemon**, cada um com **4 variantes × 4 frames**, empacotados como **GIFs** que substituem os sprites da estrutura PokeAPI. Toda imagem é gerada com fundo **MAGENTA `#FF00FF`**, depois removida por chroma key.

Saída por criatura (em `sprite-pipeline/output/sprites/pokemon/versions/generation-v/black-white/`):
- `animated/{id}.gif` (front) · `animated/back/{id}.gif` (costas)
- `animated/shiny/{id}.gif` (shiny de frente) · `animated/back/shiny/{id}.gif` (shiny de costas)

GIFs **96×96**, bottom-center, `-dispose Background -loop 0`, delay por criatura (ver `manifest.mjs`).

## 2. Onde fica tudo

- `sprite-pipeline/manifest.mjs` — lista das 21 criaturas (id, nome, delay), variantes e caminhos. **Fonte de verdade do roadmap.**
- `sprite-pipeline/keyout-magenta.mjs` — remove o fundo magenta (`frames-raw/` → `frames/`).
- `sprite-pipeline/pipeline.mjs` — `frames/` → GIFs 96×96 (só gera GIF com 4 frames; remove parciais).
- `sprite-pipeline/frames-raw/{id3}/{variante}/frame1..4.png` — imagens brutas COM magenta.
- `sprite-pipeline/frames/{id3}/{variante}/frame1..4.png` — mesmas imagens com fundo transparente.
- `sprite-pipeline/output/...` — GIFs finais. `sprite-pipeline/_preview/` — previews (transparência e `-BRANCO.gif`).
- `docs/` — estes três documentos.

Toolchain: **Node v22 + sharp** e **ImageMagick 6** (`convert`).

## 3. ⚠️ Restauração de ambiente (pode acontecer entre sessões)

O checkout local PODE ser reiniciado para o `main` (só com o README). Se faltar `sprite-pipeline/`, `docs/` ou o histórico:

```bash
cd assets-fakemon
git fetch origin arena/01a04978-assets-fakemon
git reset --hard FETCH_HEAD
git update-ref refs/remotes/origin/arena/01a04978-assets-fakemon FETCH_HEAD
cd sprite-pipeline && npm install          # reinstala sharp (node_modules não é persistido)
node -e "require('sharp'); console.log('sharp OK')"
```

Sempre trabalhar/commit/push na branch `arena/01a04978-assets-fakemon`.

## 4. Progresso atual

**34 GIFs gerados e commitados.** Criaturas **completas (4/4): 8** — ids **1, 4, 6, 7, 9, 25, 74, 94**.
A id **95 Tunnelspine está em andamento**: front ✅ e back ✅ (GIFs prontos); **shiny tem só frame1 e frame2**; **backshiny não iniciado**. Demais (12) não iniciadas.

| id | Nome | Ref. Pokémon | front | back | shiny | backshiny |
|----|------|--------------|:---:|:---:|:---:|:---:|
| 1 | Sporewalker | Bulbasaur | ✅ | ✅ | ✅ | ✅ |
| 4 | Emberpup | Charmander | ✅ | ✅ | ✅ | ✅ |
| 6 | Pyrewyrm | Charizard | ✅ | ✅ | ✅ | ✅ |
| 7 | Cascalope | Squirtle | ✅ | ✅ | ✅ | ✅ |
| 9 | Aquacaster | Blastoise | ✅ | ✅ | ✅ | ✅ |
| 25 | Voltifox | Pikachu | ✅ | ✅ | ✅ | ✅ |
| 74 | Cobblepunch | Geodude | ✅ | ✅ | ✅ | ✅ |
| 94 | Grinshade | Gengar | ✅ | ✅ | ✅ | ✅ |
| 95 | Tunnelspine | Onix | ✅ | ✅ | 🚧 f1,f2 | ⬜ |
| 120,121,130,131,133,148,149,150,197,282,384,448 | (ver docs) | — | ⬜ | ⬜ | ⬜ | ⬜ |

Commits recentes: docs em `68a1755`; antes `e4cd703` (094 front/back/shiny), `01868c0` (074 completo), `612cdf9` (025 completo).

## 5. ➡️ PRÓXIMAS AÇÕES (ordem exata)

**Fechar 095 Tunnelspine** (paleta/poses em `docs/REFERENCIAS-FAKEMON.md`):

1. **Próximo ciclo (2 gerações):**
   - `frames-raw/095/shiny/frame3.png` = **edição sobre `frames-raw/095/shiny/frame1.png`** (que existe e está aprovada): pose "defensive spike flare" — corpo arqueia, placas de arenito dourado se fecham e os **espinhos eriçam/ficam maiores**, cabeça encolhe, garras cravam, **respingo de terra/pedregulhos** nos pés. Cores aretino-dourado/bronze + creme + garras brancas; SEM rosa/vermelho/magenta; fundo magenta.
   - `frames-raw/095/backshiny/frame1.png` = **recolor sobre `frames-raw/095/back/frame1.png`**: costas (sem rosto) com placas/espinhos em arenito-dourado/bronze, pelo creme, garras brancas; vista traseira 3/4, uma cabeça.
   - Depois: `cp frames-raw/095/shiny/frame1.png frames-raw/095/shiny/frame4.png` → keyout → pipeline → deve gerar `animated/shiny/95.gif` (total **35 GIFs**). Validar sobre branco.
   - (backshiny fica 1/4 — ainda sem GIF.)
2. **Ciclo seguinte (2 gerações):**
   - `frames-raw/095/backshiny/frame2.png` (digging scoot) e `frame3.png` (spike flare + terra) como **edições sobre `backshiny/frame1.png`**; `cp .../frame1.png .../frame4.png`; keyout; pipeline → gera `animated/back/shiny/95.gif` (total **36 GIFs**) → **095 completo 4/4**. Validar + previews.
3. **Etapa 11 — 120 Tidalgleam (ref. Staryu, delay 8 cs).** Conceito-sugestão em `REFERENCIAS-FAKEMON.md` (estrela-do-mar/criatura marinha que brilha, corpo aquático translúcido com núcleo luminoso — evitar rosa/magenta). Começar SEMPRE pelo `front/frame1` por texto, validar, e então derivar (workflow em `DIRECAO-DE-ARTE.md` §8).
4. Depois seguir o manifest: 121 Prismgleam → 130 MaelstromEel → 131 GlacierKelpie → 133 Mimicub → 148 ZephyrosSerpent → 149 ZephyrosTitan → 150 VoidArchon → 197 Nocturnyx → 282 Veilancer → 384 SkyveilWyrm → 448 Aurastrider.
5. **Ao fim de cada etapa:** atualizar este `AI_STATE.md` (§4 e §5) e, se o design de uma criatura for confirmado, `REFERENCIAS-FAKEMON.md`; depois `git add -A && commit && push`.

## 6. Comandos-padrão (cadeia por lote)

```bash
cd assets-fakemon/sprite-pipeline
# 1) gerar imagens (ferramenta de geração) -> frames-raw/...  (fundo magenta)
node keyout-magenta.mjs            # remove magenta (ou --id N)
# validar frame sobre branco:
convert frames/{id3}/{var}/frameN.png -background white -flatten -resize 240x /tmp/x.png
node pipeline.mjs                  # constrói TODOS os GIFs (ou --id N --variant v)
find output -name '*.gif' | wc -l  # conferir contagem
# validar cada frame do GIF sobre branco (montage) antes de commitar
```
Preview branco do GIF:
```bash
convert output/.../X.gif -coalesce -background white -alpha remove -layers optimize-plus _preview/X-BRANCO.gif
```

## 7. REGRAS DE OURO (não violar)

- **Máximo 10 gerações de imagem por turno/ciclo.** Ao bater o limite, parar, commitar o que deu e continuar no próximo ciclo. Se `generate_image` retornar "limit reached", NADA foi criado — confirme em disco com `ls frames-raw/...`.
- **Fundo sempre magenta `#FF00FF`; criatura SEM rosa/magenta** (o keying apaga). Efeitos mágicos usam dourado/âmbar/ciano/teal/verde/vermelho-lava — nunca rosa. (Lição: shiny rosa do Voltifox foi perdido; refizemos em dourado.)
- **Aguardar o frame1** de cada variante antes dos outros; f2/f3 são **edições que referenciam o frame1 via `images`**. Não editar uma âncora no mesmo lote em que ela é criada.
- **Mesmo personagem/paleta nos 4 frames**; costas com **uma cabeça, sem rosto, lado consistente** (vista por trás: a lateral direita do animal aparece à esquerda de quem vê).
- **Só gerar/commitar GIF completo (4 frames).** O pipeline já remove parciais.
- **Validar sobre BRANCO** antes de commitar. f4 teimoso → `cp frame1.png frame4.png`.
- Trabalhar e responder em **Português**.

## 8. Notas/armadilhas conhecidas

- O keyer (`keyout-magenta.mjs`) tem a regra `hotPink` que remove halo magenta (vermelho alto com **azul bem acima do verde**, `b-g>30` e `b>100`), preservando lava vermelha (g≈b baixos), dourado/tan (g>b) e lavanda/violeta legítimos (r baixo / r<b). Se uma cor legítima sumir, revise essa regra.
- Shiny do Grinshade tem uma fina aura pervinca/violeta clara nos wisps (b≫r) — é arte da IA, não magenta, e foi aceita.
- Frames "explosivos" (ex.: f3 do Grinshade) podem expandir/deslocar a silhueta; o pipeline corta pela **união** dos 4 frames e ancora bottom-center, então o f3 pode parecer um pouco menor — isso é normal se o loop ficar coerente.
- Frames do gerador vêm grandes (~1400px); o pipeline faz auto-crop pela união + nearest + bottom-center automaticamente.
- Se vier "character sheet"/várias cópias, reforçar no prompt: `ONE single creature only, NOT a character sheet, no grid`.
