# AI_STATE — Estado do projeto Fakemon (ponto de retomada)

> **Leia este arquivo primeiro.** Ele diz ONDE o projeto parou, O QUE falta e COMO continuar,
> sem alterar estilo nem regras. Regras completas de arte/geração: `docs/DIRECAO-DE-ARTE.md`.
> Design de cada criatura e substituição: `docs/REFERENCIAS-FAKEMON.md`.
> Atualizado ao final de cada etapa (após commit/push).

**Última atualização:** Etapa 10 concluída — 095 Tunnelspine **4/4** (36 GIFs, 9 criaturas completas). Etapa 11 (120 Tidalgleam) foi iniciada e **os frames foram descartados** por um problema de cor no brilho (ver §5/§8); o design está confirmado e deve ser **regenerado** no próximo ciclo.
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

**36 GIFs gerados e commitados.** Criaturas **completas (4/4): 9** — ids **1, 4, 6, 7, 9, 25, 74, 94, 95**.
Demais (12) não iniciadas.

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
| 95 | Tunnelspine | Onix | ✅ | ✅ | ✅ | ✅ |
| 120,121,130,131,133,148,149,150,197,282,384,448 | (ver docs) | — | ⬜ | ⬜ | ⬜ | ⬜ |

Commit mais recente: `4eba5d3`-series (095 Tunnelspine fechado; 094 Grinshade fechado).

## 5. ➡️ PRÓXIMA AÇÃO — Etapa 11: 120 Tidalgleam (ref. Staryu, delay 8 cs) — REGENERAR

O design já foi **definido e aprovado visualmente**, mas os frames foram descartados (ver armadilha no §8). **Regenerar do zero** seguindo o workflow padrão (workflow completo em `DIRECAO-DE-ARTE.md` §8), em ciclos de ≤10 gerações:

**Design confirmado (usar exatamente):**
- **Normal (front/back):** estrela-do-mar viva flutuante de **5 braços**, corpo **teal/aqua** (`#2E8FA8` → azul-marinho `#1F6E8C`) com reflexos **perolados brancos** (`#CFEFFF`) ao longo dos braços; gotas d'água nas pontas; **gem central grande ciano-pérola brilhante** (`#BFF6FF`, núcleo branco-ciano) montada num **anel fino dourado** (`#E8C766`) — homenagem ao núcleo do Staryu. Bolhas/faíscas **somente ciano/teal/branco**.
- **Back:** costas teal da estrela, **sem gem e sem anel dourado** (ficam na frente), textura levemente rugosa de estrela, sem rosto; bolhas ciano.
- **Shiny:** corpo da estrela **dourado/âmbar** (`#E8B84A` / sombra `#B8862E`) com reflexos creme-pérola (`#FFF3D0`); a gem continua **ciano-pérola** mas o anel vira **prata-branco** (`#E8EEF2`); gotas/bolhas ciano/branco.
- **Animação (8 cs):** f1 neutro flutuando; f2 sobe e abre os braços (mais bolhas); f3 os braços abrem e a **gem brilha no máximo** com burst de luz/bolhas — **o brilho TEM de ser ciano/aqua/branco, NUNCA roxo/violeta** (a IA insiste em pôr roxo; ver §8); f4 neutro.

**Correção do brilho roxo (fazer do jeito certo):** se o f3 (ou bolhas) sair com glow violeta, NÃO mexer no `frames-raw/`. Gerar normal → `keyout-magenta.mjs` (fundo já removido, alpha=0 fora da criatura) → editar o `frames/{id}/{var}/frameN.png` convertendo pixels violeta (b domina, r>g, ex.: r 120–200, g<r, b>200) para ciano (zerar/reduzir r, manter g/b altos) → depois `pipeline.mjs`. Assim o fundo transparente nunca é atingido.

Procedimento por ciclo:
1. **front/frame1** por texto → `node keyout-magenta.mjs --id 120` → **validar sobre branco** (montage).
2. front f2, f3 (edições sobre front f1); back f1 (texto, costas); shiny f1 (recolor sobre front f1).
3. back f2/f3 (sobre back f1); shiny f2/f3 (sobre shiny f1); backshiny f1 (recolor sobre back f1).
4. Ciclo seguinte: backshiny f2/f3 (sobre backshiny f1).
5. Cada variante: `cp frame1.png frame4.png` antes do keyout; `node pipeline.mjs`; validar cada GIF sobre branco; previews `-BRANCO.gif`; commit/push; atualizar este arquivo e o `REFERENCIAS-FAKEMON.md` com o design confirmado.

Depois, seguir o manifest: **121 Prismgleam (Starmie)** → 130 MaelstromEel (Gyarados) → 131 GlacierKelpie (Lapras) → 133 Mimicub (Eevee) → 148 ZephyrosSerpent (Dragonair) → 149 ZephyrosTitan (Dragonite) → 150 VoidArchon (Mewtwo) → 197 Nocturnyx (Umbreon) → 282 Veilancer (Gardevoir) → 384 SkyveilWyrm (Rayquaza) → 448 Aurastrider (Lucario).

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
- Frames "explosivos" (ex.: f3 do Grinshade) podem expandir/deslocar a silhueta; o pipeline corta pela **união** dos 4 frames e ancora bottom-center, então o f3 pode parecer um pouco menor — normal se o loop ficar coerente.
- Frames do gerador vêm grandes (~1400px); o pipeline faz auto-crop pela união + nearest + bottom-center automaticamente.
- Se vier "character sheet"/várias cópias, reforçar no prompt: `ONE single creature only, NOT a character sheet, no grid`.
- **NÃO fazer correções de cor por script sobre os `frames-raw/` (fundo magenta):** um script que troca violeta→ciano atingiu o próprio magenta (255,0,255) e transformou o FUNDO em ciano antes do keying, corrompendo o frame (fundo colorido em vez de transparente). Qualquer ajuste de cor deve ser aplicado **sobre os `frames/` já keyados** (fora da criatura é alpha=0) ou via nova geração.
- **Glow roxo teimoso:** a IA frequentemente colore brilhos mágicos "energéticos" de violeta (mesmo pedindo ciano). Para criaturas sem roxo legítimo na paleta, corrige-se convertendo violeta→ciano **após o keying** (ver §5 do Tidalgleam). Atenção: isso só vale onde o roxo NÃO é parte da paleta (ex.: NÃO fazer em Grinshade/VoidArchon/etc. que usam violeta de propósito).
