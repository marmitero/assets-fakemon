# AI_STATE — Estado do projeto Fakemon (ponto de retomada)

> **Leia este arquivo primeiro.** Ele diz ONDE o projeto parou, O QUE falta e COMO continuar,
> sem alterar estilo nem regras. Regras completas de arte/geração: `docs/DIRECAO-DE-ARTE.md`.
> Design de cada criatura e substituição: `docs/REFERENCIAS-FAKEMON.md`.
> Atualizado ao final de cada etapa (após commit/push).

**Última atualização:** Etapa 15 em andamento — **133 Mimicub: front f1 ✅** (âncora validada; sem GIF ainda). **52 GIFs, 13 criaturas completas.** Próximo: f2/f3 do front + back/shiny/backshiny do 133.
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

**52 GIFs gerados.** Criaturas **completas (4/4): 13** — ids **1, 4, 6, 7, 9, 25, 74, 94, 95, 120, 121, 130, 131**.
**133 Mimicub em andamento:** só `front/frame1` (âncora validada, sem GIF). Demais (7) não iniciadas.

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
| 120 | Tidalgleam | Staryu | ✅ | ✅ | ✅ | ✅ |
| 121 | Prismgleam | Starmie | ✅ | ✅ | ✅ | ✅ |
| 130 | MaelstromEel | Gyarados | ✅ | ✅ | ✅ | ✅ |
| 131 | GlacierKelpie | Lapras | ✅ | ✅ | ✅ | ✅ |
| 133 | Mimicub | Eevee | 🚧 só f1 | ⬜ | ⬜ | ⬜ |
| 148,149,150,197,282,384,448 | (ver docs) | — | ⬜ | ⬜ | ⬜ | ⬜ |

**Fluxo especial para criatura com glow mágico sem roxo na paleta (ex.: 120):** `keyout-magenta` → **`node fix-glow-cyan.mjs --id N`** → `pipeline`. NÃO re-rodar o keyout depois do fix (ele apaga a correção). Ver §8.

Commit mais recente: 131 GlacierKelpie fechado 4/4 (52 GIFs). Antes: front do 131 + shiny f1 (`9dd28e2`, 49 GIFs); 130 MaelstromEel (`92ccbe3`, 48 GIFs); 121 Prismgleam (`71b1930`, 44 GIFs).

## 5. ➡️ PRÓXIMA AÇÃO — continuar Etapa 15: 133 Mimicub (ref. Eevee, delay 15 cs)

**Já feito:** `front/frame1` por texto, keyado e **validado** (filhote creme/tan com gola fofa, orelhas/cauda canela, mecha ciano na cauda, heterocromia ciano/âmbar; design/paleta no `REFERENCIAS-FAKEMON.md`).

**Próximo ciclo (≤10 gerações):**
1. `front/frame2`,`frame3` = edições sobre `front/frame1` (f2 orelhas/cauda mexem + corpo sobe; f3 sorri/late alegre ou pisca, talvez patinha dianteira levantando — pico fofo).
2. `back/frame1` = EDIÇÃO do `front/frame1` virando costas: uma criatura só, nuca/gola fofa por trás, orelhas grandes por trás (sem rosto), a cauda fofa com ponta canela/mecha ciano visível; fixar "ONE single creature, NOT two/NOT a pair, back of the head only, NO face".
3. `shiny/frame1` = recolor do front f1 (sugestão: pelagem prata-acinzentada fria com pontas azul-petróleo e gola branca; olhos podem ficar âmbar/ciano — SEM roxo/magenta).
4. `back/frame2`,`frame3` + `shiny/frame2`,`frame3` + `backshiny/frame1` (recolor do back f1).
5. Ciclo seguinte: `backshiny/frame2`,`frame3`; `cp frame1 frame4` por variante; keyout → (`fix-glow-cyan --id 133` se houver franja violeta — paleta creme/canela/ciano não tem roxo) → pipeline; validar os 4 GIFs frame-a-frame sobre branco; previews; commit. Total ao fechar 133: **56 GIFs** (14 criaturas 4/4). Atualizar docs.

Fluxo-padrão de geração (referência):
1. ~~`front/frame1` por texto~~ ✅ feito.
2. `front/frame2`,`frame3` (edições sobre f1) + `back/frame1` (EDIÇÃO do front virando costas — fixar pose da cauda/orelhas; uma criatura só) + `shiny/frame1` (recolor sobre front f1; paleta sem magenta).
3. `back/frame2`,`frame3` + `shiny/frame2`,`frame3` + `backshiny/frame1` (recolor do back f1).
4. Ciclo seguinte: `backshiny/frame2`,`frame3`.
5. `cp frame1 frame4` por variante; `keyout-magenta` → (se franja violeta espúria e paleta sem roxo: `fix-glow-cyan --id N`) → `pipeline`; **validar os 4 GIFs frame-a-frame sobre branco** (uma criatura/quadro, sem deformidade/duplicata, paleta consistente); previews; commit. Total ao fechar 133: **56 GIFs**.

Depois: 148 ZephyrosSerpent (Dragonair, 12cs) → 149 ZephyrosTitan (Dragonite, 10cs) → 150 VoidArchon (Mewtwo, 8cs; violeta LEGÍTIMO — NÃO usar fix-glow-cyan) → 197 Nocturnyx (Umbreon, 12cs) → 282 Veilancer (Gardevoir, 12cs) → 384 SkyveilWyrm (Rayquaza, 8cs) → 448 Aurastrider (Lucario, 8cs).

**Lições consolidadas:** (a) costas por TEXTO vêm duplicadas ("par") — gerar `back/frame1` como EDIÇÃO do front; em criaturas de pescoço LONGO (131) a edição pode arquear o pescoço por cima do corpo — fixar no prompt "neck straight/short on the side, head at the top corner, do NOT arch over the body; back of the head only, NO face". (b) Frames com glow/aura grande: regenerar pedindo SEM aura/halo (só faíscas) antes de mexer em cor. (c) `fix-glow-cyan` age SÓ na borda (franjas violetas finas); não atinge azure/vermelho/ciano/índigo-ardósia legítimos — e NUNCA usar em Grinshade/VoidArchon (roxo de propósito). (d) Shiny pode espelhar a referência quando icônica (Gyarados vermelho; 131 = índigo + gelo dourado para evitar magenta). (e) Após cada fechamento, validar os 4 GIFs em montage 4x4 sobre branco antes do commit.

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
