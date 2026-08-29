# AI_STATE — Estado do projeto Fakemon (ponto de retomada)

> **Leia este arquivo primeiro.** Ele diz ONDE o projeto parou, O QUE falta e COMO continuar,
> sem alterar estilo nem regras. Regras completas de arte/geração: `docs/DIRECAO-DE-ARTE.md`.
> Design de cada criatura e substituição: `docs/REFERENCIAS-FAKEMON.md`.
> Atualizado ao final de cada etapa (após commit/push).

**Última atualização:** etapa de documentação (após fechar 074 e deixar 094 em 3/4).
**Branch de trabalho (fixa):** `arena/01a04978-assets-fakemon`
**Remoto:** https://github.com/marmitero/assets-fakemon.git

---

## 1. Objetivo (resumo)

Gerar sprites de batalha **animados em estilo Gen-V (Pokémon Black/White)** para **21 fakemon**, cada um com **4 variantes × 4 frames = 16 imagens**, e empacotar como **GIFs** que substituem os sprites da estrutura PokeAPI. Toda imagem é gerada com fundo **MAGENTA `#FF00FF`**, depois removida por chroma key.

Saída por criatura (em `sprite-pipeline/output/sprites/pokemon/versions/generation-v/black-white/`):
- `animated/{id}.gif` (front)
- `animated/back/{id}.gif` (costas)
- `animated/shiny/{id}.gif` (shiny de frente)
- `animated/back/shiny/{id}.gif` (shiny de costas)

GIFs são **96×96**, bottom-center, `-dispose Background -loop 0`, delay por criatura (ver manifest).

## 2. Onde fica tudo

- `sprite-pipeline/manifest.mjs` — lista das 21 criaturas (id, nome, delay), variantes e caminhos. **Fonte de verdade do roadmap.**
- `sprite-pipeline/keyout-magenta.mjs` — remove o fundo magenta (`frames-raw/` → `frames/`).
- `sprite-pipeline/pipeline.mjs` — `frames/` → GIFs 96×96 (só gera GIF com 4 frames; trava parciais).
- `sprite-pipeline/frames-raw/{id3}/{variante}/frame1..4.png` — imagens brutas COM magenta.
- `sprite-pipeline/frames/{id3}/{variante}/frame1..4.png` — mesmas imagens com fundo transparente.
- `sprite-pipeline/output/...` — GIFs finais.
- `sprite-pipeline/_preview/` — GIFs (transparência e versão `-BRANCO.gif` para inspeção).
- `docs/` — estes três documentos.

Toolchain: **Node v22 + sharp** e **ImageMagick 6** (`convert`).

## 3. ⚠️ Restauração de ambiente (acontece entre sessões)

O checkout local PODE ser reiniciado para o `main` (só com o README). Se faltar `sprite-pipeline/` ou o histórico:

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

**31 GIFs gerados e commitados.** Criaturas **completas (4/4 variantes): 7** — ids **1, 4, 6, 7, 9, 25, 74**.
A id **94 está 3/4** (front/back/shiny prontos; **backshiny só tem o frame1**). Demais (13) não iniciadas.

| id | Nome | Ref. Pokémon | front | back | shiny | backshiny |
|----|------|--------------|:---:|:---:|:---:|:---:|
| 1 | Sporewalker | Bulbasaur | ✅ | ✅ | ✅ | ✅ |
| 4 | Emberpup | Charmander | ✅ | ✅ | ✅ | ✅ |
| 6 | Pyrewyrm | Charizard | ✅ | ✅ | ✅ | ✅ |
| 7 | Cascalope | Squirtle | ✅ | ✅ | ✅ | ✅ |
| 9 | Aquacaster | Blastoise | ✅ | ✅ | ✅ | ✅ |
| 25 | Voltifox | Pikachu | ✅ | ✅ | ✅ | ✅ |
| 74 | Cobblepunch | Geodude | ✅ | ✅ | ✅ | ✅ |
| 94 | Grinshade | Gengar | ✅ | ✅ | ✅ | 🚧 **só frame1** |
| 95 | Tunnelspine | Onix | ⬜ | ⬜ | ⬜ | ⬜ |
| 120,121,130,131,133,148,149,150,197,282,384,448 | (ver docs) | — | ⬜ | ⬜ | ⬜ | ⬜ |

Commits recentes: `e4cd703` (094 front/back/shiny + backshiny f1), `01868c0` (074 completo), `612cdf9` (025 completo).

## 5. ➡️ PRÓXIMAS AÇÕES (ordem exata)

1. **Fechar 094 Grinshade (backshiny)** — faltam 2 frames:
   - Gerar `frames-raw/094/backshiny/frame2.png` e `frame3.png` como **edições com `images`** apontando para `frames-raw/094/backshiny/frame1.png` (que já existe e está aprovado: domo teal sem rosto).
   - frame2 = "float bob-up" (sobe, wisps teal brilham, cauda enrola, faíscas ciano-menta); frame3 = "wisp burst" (incha, wisps teal explodem com faíscas ciano-menta, cauda chicoteia). Cores **somente dark-teal/teal/ciano-menta**; SEM rosto, SEM amarelo, SEM rosa/vermelho/magenta; fundo magenta.
   - `cp frames-raw/094/backshiny/frame1.png frames-raw/094/backshiny/frame4.png`
   - `node keyout-magenta.mjs --id 94` → validar sobre branco → `node pipeline.mjs` (deve gerar `animated/back/shiny/94.gif`; total vai a **32 GIFs**) → validar GIF → criar `_preview/094-backshiny(-BRANCO).gif` → commit/push.
2. **Etapa 10 — 095 Tunnelspine (ref. Onix, delay 10 cs).** Conceito e animação propostos em `docs/REFERENCIAS-FAKEMON.md` (tatu/toupeira encouraçada com placas de pedra e espinhos dorsais, pelo umber, garras de escavação; f2 arranha/afunda, f3 espinhos eriçam + respingo de terra). Começar SEMPRE pelo `front/frame1` por texto, validar, e só então derivar (workflow em `DIRECAO-DE-ARTE.md` §8).
3. Seguir a ordem do manifest para as demais: 120 Tidalgleam → 121 Prismgleam → 130 MaelstromEel → 131 GlacierKelpie → 133 Mimicub → 148 ZephyrosSerpent → 149 ZephyrosTitan → 150 VoidArchon → 197 Nocturnyx → 282 Veilancer → 384 SkyveilWyrm → 448 Aurastrider.
4. **Ao fim de cada etapa:** atualizar este `AI_STATE.md` (tabela do §4 e o §5), `git add -A && commit && push`.

## 6. Comandos-padrão (cadeia por lote)

```bash
cd assets-fakemon/sprite-pipeline
# 1) gerar imagens (ferramenta de geração) -> frames-raw/...  (fundo magenta)
node keyout-magenta.mjs            # remove magenta (ou --id N)
# validar frames sobre branco:
convert frames/{id3}/{var}/frameN.png -background white -flatten -resize 240x /tmp/x.png
node pipeline.mjs                  # constrói TODOS os GIFs (ou --id N --variant v)
find output -name '*.gif' | wc -l  # conferir contagem
# validar GIF (cada frame) sobre branco e com montage, antes de commitar
```
Preview branco do GIF:
```bash
convert output/.../X.gif -coalesce -background white -alpha remove -layers optimize-plus _preview/X-BRANCO.gif
```

## 7. REGRAS DE OURO (não violar)

- **Máximo 10 gerações de imagem por turno.** Ao bater o limite, parar, commitar o que deu e continuar no próximo ciclo. (O contador não reseta no meio do ciclo; se `generate_image` retornar "limit reached", NADA foi criado — confira em disco com `ls frames-raw/...`.)
- **Fundo sempre magenta `#FF00FF`; criatura SEM rosa/magenta** (o keying apaga). Efeitos mágicos usar dourado/âmbar/ciano/teal/verde/vermelho-lava — **nunca rosa**. (Lição: shiny rosa do Voltifox foi perdido; refizemos em dourado.)
- **Aguardar o frame1** de cada variante antes dos outros; f2/f3 são **edições que referenciam o frame1 via `images`**. Não editar uma âncora no mesmo lote em que ela é criada.
- **Mesmo personagem/paleta nos 4 frames**; costas com **uma cabeça, sem rosto, mesmo lado**.
- **Só gerar/commitar GIF completo (4 frames).** O pipeline já remove parciais.
- **Validar sobre BRANCO** antes de commitar. f4 teimoso → `cp frame1.png frame4.png`.
- Trabalhar e responder em **Português**.

## 8. Notas/armadilhas conhecidas

- O keyer (`keyout-magenta.mjs`) tem regra `hotPink` que remove halo magenta (vermelho alto com **azul bem acima do verde**, `b-g>30`), preservando lava vermelha (g≈b baixos), dourado/tan (g>b) e lavanda/violeta legítimos. Se uma cor legítima sumir, revise essa regra.
- Shiny do Grinshade tem uma fina aura pervinca/violeta clara nos wisps (b≫r) — é arte da IA, não magenta, e foi aceita.
- Frames do gerador vêm grandes (~1400px); o pipeline faz auto-crop pela união dos 4 frames + nearest + bottom-center automaticamente.
- Se vier "character sheet"/várias cópias, reforçar no prompt: `ONE single creature only, NOT a character sheet, no grid`.
