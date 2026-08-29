# Referências dos Fakemon — mapeamento para Pokémon e design

> Cada fakemon ocupa o **slot (número da Pokédex) do Pokémon original** no dataset da PokeAPI.
> A substituição futura é direta: trocar os arquivos do id abaixo pelos GIFs gerados, mantendo os
> mesmos caminhos (`animated/{id}.gif`, `animated/back/{id}.gif`, `animated/shiny/{id}.gif`,
> `animated/back/shiny/{id}.gif`) em `.../generation-v/black-white/`.
>
> **Status:** ✅ concluído (4 variantes) · 🚧 em andamento · ⬜ não iniciado (conceito-sugestão).
> Paletas e poses das criaturas ✅/🚧 refletem o que foi de fato gerado; as ⬜ são propostas a confirmar na etapa.

---

## ✅ 001 — Sporewalker  →  referência: **Bulbasaur (nº 1)**
- **Tipo temático:** planta/cogumelo (substitui o slot do Bulbasaur, inicial de planta).
- **Design:** tartaruga-quadrúpede baixa e robusta; casco em forma de **cogumelo/esporos** verde-musgo (`verde` vivo no topo, corpo **teal/verde-azulado**, barriga e mandíbula **creme/marfim**). Olhos vermelhos redondos, focinho curto de tartaruga, perninhas curtas.
- **Shiny:** corpo **lavanda/lilás** com casco **dourado** (mantém olhos azuis/escuros). Substitui o slot do Bulbasaur shiny.
- **Animação:** caminhada/idle pesado (pernas alternam, casco balança); f3 solta pequenos esporos.
- **Arquivos a substituir:** id `1` (front/back/shiny/backshiny).

## ✅ 004 — Emberpup  →  referência: **Charmander (nº 4)**
- **Tipo temático:** fogo (inicial de fogo).
- **Design:** filhote **bípede** (filhote de cachorro/salamandra), corpo **terracota/laranja-avermelhado**, barriga **creme**, **coleira/juba de brasas laranja** no pescoço e cauda com **chama** (ponta em brasa). Olhos âmbar, orelhinhas caídas.
- **Shiny:** corpo **carvão/cinza-escuro** com crina/juba **cobalto/azul-fogo** (chama azul).
- **Animação:** respiração de filhote; f2 jubas eriçam; f3 chama da cauda cresce + brilho.
- **Arquivos:** id `4`.

## ✅ 006 — Pyrewyrm  →  referência: **Charizard (nº 6)**
- **Tipo temático:** fogo/voador (evolução do inicial de fogo).
- **Design:** **wyvern/dragão** esguio e bípede, corpo **vinho/vermelho-escuro**, ventre **creme**, asas de membrana **laranja-avermelhada**, chifres, cauda longa terminando em **três pontas de chama**.
- **Shiny:** corpo **esmeralda/verde** com asas e detalhes **roxo/violeta**.
- **Animação:** asas abrem/fecham; f3 asas abertas no máximo + chamas da cauda brilham.
- **Arquivos:** id `6`.

## ✅ 007 — Cascalope  →  referência: **Squirtle (nº 7)**  *(tartaruga/água)*
- **Tipo temático:** água (inicial de água; mantém o slot do Squirtle apesar do corpo de cervo).
- **Design:** **cervo/veado** esguio quadrúpede, corpo **turquesa/teal**, barriga/marfim; grandes **chifres em espiral de náutilo/perolados (creme)** no lugar de galhadas; dorso com uma **concha/carapaço arredondada perolada (lavanda-clara)**.
- **Shiny:** corpo **lilás** com chifres/concha **champanhe/dourado-claro**.
- **Animação:** galope/idle elegante; chifres e concha brilham no f3.
- **Arquivos:** id `7`.

## ✅ 009 — Aquacaster  →  referência: **Blastoise (nº 9)**
- **Tipo temático:** água (evolução do inicial de água).
- **Design:** **caranguejo-eremita** bípede/robusto, corpo **azul-marinho (`#1A2A5E`)**, grande **concha espiral dourada (`#8B6A3A`)** nas costas e **dois canhões** (um de cada lado da concha) com pontas de **latão/cobre (`#B87333`)**. Garras de crustáceo.
- **Shiny:** corpo **esmeralda (`#1A5E3A`)** com concha e canhões **cobre (`#B85C1A`)**.
- **Animação:** f2 solta vapor; f3 pressuriza (canhões brilham) e pinga gota; f4 assenta.
- **Arquivos:** id `9`.

## ✅ 025 — Voltifox  →  referência: **Pikachu (nº 25)**
- **Tipo temático:** elétrico (mascote/rosto da leva).
- **Design:** raposa-**fennec bípede**, pelagem **âmbar/milho dourado**, barriga/focinho **creme**; orelhões em forma de folha eretos com **pontas violeta**; **marcas triangulares azul-elétrico** nas bochechas; olhões pretos com brilho; cauda **bífida** com **duas gotas de plasma ciano**. Vista 3/4 para a esquerda.
- **Shiny (atenção à cor):** pelagem **prata-platina (`#E8ECF0`)** com sombra azul-clara, barriga branca; pontas de orelha, marcas de bochecha, plasma da cauda e arco de faíscas todos **DOURADOS (`#FFD24A`)** com núcleo amarelo-claro. **NÃO usar rosa** (o keying apaga).
- **Animação (15 cs):** f2 sobe/peito estufa e orelhas abrem; f3 **arco elétrico** entre as orelhas + plasma no brilho máximo; f4 cauda balança com gotas para o lado oposto.
- **Arquivos:** id `25`.

## ✅ 074 — Cobblepunch  →  referência: **Geodude (nº 74)**
- **Tipo temático:** pedra/lutador (substitui o slot do Geodude).
- **Design:** golem de **rocha-cristal flutuante**; corpo é um grande bloco **hexagonal facetado de obsidiana (`#2A2830`)** com faces de **basalto (`#4A4858`)**; **rachaduras finas âmbar-laranja (`#FF8C00`)** brilham como veios de rocha derretida; dois **braços musculosos de basalto** com **punhos cerrados de seixo** em postura de guarda; rosto escavado na frente = **duas fendas de olho horizontais âmbar** + boca trapézio talhada (sem lábios/nariz). Flutua no ar (espaço embaixo), 3/4 para a esquerda.
- **Shiny:** granito **azul-ardósia/ferro (`#34404E`/faces `#4C5A6E`)** com veios, olhos e juntas em **ciano-gelo (`#4FD8E8`)** (núcleo quase branco). Sem vermelho/rosa.
- **Animação (10 cs):** f1 neutro; f2 bloco sobe no hover (punhos sobem); f3 **desce e tensiona**, veios no brilho **máximo** com brasas/lava vermelha e faíscas âmbar; f4 neutro.
- **Costas:** sem rosto, uma cabeça só (bloco hexagonal no topo), brações pendendo.
- **Arquivos:** id `74`.

## ✅ 094 — Grinshade  →  referência: **Gengar (nº 94)**
- **Tipo temático:** fantasma/sombra (substitui o slot do Gengar).
- **Design:** espectro/**sombra sorridente** flutuante; corpo-redondo de **névoa índigo-navy (`#1B1A33`–`#2A2750`)** com wisps de borda **violeta (`#5A4AA8`)**, afunilando em cauda de névoa (sem pernas); **dois olhões enormes amarelo-limão brilhantes (`#FFE34D`)** com núcleo branco; **sorrisão enorme** cheio de dentinhos brancos pontudos; duas mãozinhas de sombra com garrinhas; faíscas violeta/amarelas.
- **Shiny:** sombra **teal/verde-marinho (`#0C2626`–`#103838`)** com wisps **teal (`#2FAFA0`)**, olhos **ciano-menta (`#7FF5E0`)**, dentes brancos (aura fria pervinca nos wisps é aceitável).
- **Animação (8 cs):** f1 neutro; f2 risada boba (olhos semicerram, cauda enrola); f3 **gargalhada** (boca aberta, olhos enormes, cauda chicoteia, explosão de faíscas); f4 neutro.
- **Costas:** domo liso de névoa **sem rosto e sem amarelo**; f3 explode névoa (violeta no normal, ciano-teal no shiny).
- **Shiny costas (backshiny):** domo teal sem rosto, garrinhas, cauda espiral; f2 bob-up com faíscas ciano, f3 explosão de névoa teal, f4 neutro.
- **Status:** **4/4 variantes concluídas** (front, back, shiny, backshiny).
- **Arquivos:** id `94`.

## ✅ 095 — Tunnelspine  →  referência: **Onix (nº 95)**
- **Tipo temático:** terra/pedra, escavador encouraçado (substitui o slot do Onix).
- **Design (confirmado):** quadrúpede baixo e pesado tipo **tatu/ankylossauro**; costado coberto por **placas de pedra sobrepostas cinza-ardósia (`#6E6A72` com sombra slate `#4E4A54`)** com uma fileira de **espinhos afiados de pedra** ao longo do dorso arqueado e da cauda couraçada curta; pelo **umber-marrom (`#6B4A2E`)**, barriga/focinho **tan (`#B8915C`)**, focinho couraçado, olhinhos de conta, **grandes garras de escavação claras (`#D8D2C0`)** nas patas. Vista 3/4 para a esquerda.
- **Shiny (confirmado):** placas e espinhos em **arenito dourado/bronze (`#C9A86A` com sombra `#8A6B3A`)**, pelo **creme-areia (`#E3CE9E`)**, barriga/focinho creme (`#F0E2C0`), garras brancas (`#F2ECDC`), olhos âmbar — brilho dourado quente nas placas.
- **Animação (10 cs):** f1 neutro agachado; f2 cava/afunda com as garras e levanta torrões/pedregulhos; f3 **arqueia o corpo e eriça os espinhos** (maiores), cabeça encolhe, com **respingo de terra**; f4 neutro.
- **Costas / backshiny:** placas com fileira de espinhos pelo dorso e cauda; sem rosto; f2/f3 cavam e eriçam com terra. O backshiny usa a paleta arenito/creme/garra-branca.
- **Status:** **4/4 variantes concluídas** (front, back, shiny, backshiny).
- **Arquivos:** id `95`.

## ⬜ 120 — Tidalgleam  →  referência: **Staryu (nº 120)**
- **Tipo temático:** água/estrela (substitui o slot do Staryu).
- **Conceito proposto:** estrela-do-marinha/criatura marinha que **brilha** ("gleam"); corpo translúcido aquático com núcleo luminoso.
- **Shiny:** a definir. **Arquivos:** id `120`.

## ⬜ 121 — Prismgleam  →  referência: **Starmie (nº 121)**
- **Tipo temático:** água/psíquico, evolução (substitui o slot do Starmie).
- **Conceito proposto:** evolução do Tidalgleam em forma **prismática** (cristal que refrata luz em várias cores), com núcleo tipo gema.
- **Shiny:** a definir. **Arquivos:** id `121`.

## ⬜ 130 — MaelstromEel  →  referência: **Gyarados (nº 130)**
- **Tipo temático:** água/sinistro, serpente marinha colossal (substitui o slot do Gyarados).
- **Conceito proposto:** enguia/serpente marinha enorme que evoca **redemoinho (maelstrom)**; corpo longo serpentino, boca ameaçadora, energia de vórtice.
- **Animação (10 cs):** corpo serpenteia; f3 invoca vórtice/onda. **Shiny:** a definir.
- **Arquivos:** id `130`.

## ⬜ 131 — GlacierKelpie  →  referência: **Lapras (nº 131)**
- **Tipo temático:** água/gelo, montaria marinha (substitui o slot do Lapras).
- **Conceito proposto:** **kelpie** (cavalo aquático) com tema de **geleira**; corpo de cavalo-marinho/plesiosauro com placas de gelo, cristais de gelo, pescoço longo.
- **Animação (15 cs):** idle suave de nado; f3 respiração gelada/vapor. **Shiny:** a definir.
- **Arquivos:** id `131`.

## ⬜ 133 — Mimicub  →  referência: **Eevee (nº 133)**
- **Tipo temático:** normal/transformação (substitui o slot do Eevee).
- **Conceito proposto:** filhote/pequeno mamífero **camaleônico/imitador** ("mimic" + cub), fofo e versátil, com pelagem fofa e cauda expressiva.
- **Animação (15 cs):** idle fofo. **Shiny:** a definir. **Arquivos:** id `133`.

## ⬜ 148 — ZephyrosSerpent  →  referência: **Dragonair (nº 148)**
- **Tipo temático:** dragão/vento (substitui o slot do Dragonair).
- **Conceito proposto:** serpente serpentina elegante do **vento (zéfiro)**; corpo longo e liso, flutua/voa, energia de ar.
- **Animação (12 cs):** corpo ondula; f3 brilho de vento. **Shiny:** a definir.
- **Arquivos:** id `148`.

## ⬜ 149 — ZephyrosTitan  →  referência: **Dragonite (nº 149)**
- **Tipo temático:** dragão/voador, evolução (substitui o slot do Dragonite).
- **Conceito proposto:** evolução robusta e titânica do ZephyrosSerpent; dragão do vento corpulento com asas.
- **Animação (10 cs):** asas/vento no f3. **Shiny:** a definir. **Arquivos:** id `149`.

## ⬜ 150 — VoidArchon  →  referência: **Mewtwo (nº 150)**
- **Tipo temático:** psíquico/sinistro, "lendário" (substitui o slot do Mewtwo).
- **Conceito proposto:** entidade/arquonte do **vazio**, humanóide imponente e austero, flutua, energia de buraco negro/void (evitar magenta — usar roxo-índigo escuro, ciano ou dourado para efeitos).
- **Animação (8 cs):** flutua; f3 energia do vazio explode. **Shiny:** a definir.
- **Arquivos:** id `150`.

## ⬜ 197 — Nocturnyx  →  referência: **Umbreon (nº 197)**
- **Tipo temático:** noturno/sombrio (substitui o slot do Umbreon).
- **Conceito proposto:** felino/criatura da noite ("nyx") com pelagem escura e anéis/marcas que brilham (evitar rosa; usar âmbar/dourado/ciano).
- **Animação (12 cs):** marcas brilham no f3. **Shiny:** a definir. **Arquivos:** id `197`.

## ⬜ 282 — Veilancer  →  referência: **Gardevoir (nº 282)**
- **Tipo temático:** fada/psíquico, lanceiro do véu (substitui o slot do Gardevoir).
- **Conceito proposto:** humanóide elegante com **véu/lança** de energia (evitar magenta; sugerir véu ciano/pérola/dourado). Postura graciosa.
- **Animação (12 cs):** véu esvoaça; f3 lança/energia brilha. **Shiny:** a definir.
- **Arquivos:** id `282`.

## ⬜ 384 — SkyveilWyrm  →  referência: **Rayquaza (nº 384)**
- **Tipo temático:** dragão/voador, "lendário" do céu (substitui o slot do Rayquaza).
- **Conceito proposto:** wyrm serpentino celestial envolto em **véu de nuvem/céu**; corpo longo, flutua alto (evitar magenta — usar verde-esmeralda/ciano/dourado).
- **Animação (8 cs):** serpenteia; f3 energia do céu. **Shiny:** a definir. **Arquivos:** id `384`.

## ⬜ 448 — Aurastrider  →  referência: **Lucario (nº 448)**
- **Tipo temático:** lutador/aura (substitui o slot do Lucario).
- **Conceito proposto:** humanóide atlético que **caminha sobre a aura** ("aura strider"), senso marcial, energia de aura visível (evitar rosa/magenta; usar azul-índigo/ciano/dourado).
- **Animação (8 cs):** pose de guarda; f3 aura explode. **Shiny:** a definir. **Arquivos:** id `448`.

---

## Tabela-resumo (ordem do manifest)

| id | Fakemon | Pokémon de referência (slot) | Tipo | Delay (cs) | Status |
|----|---------|------------------------------|------|-----------:|--------|
| 1 | Sporewalker | Bulbasaur | planta | 15 | ✅ 4/4 |
| 4 | Emberpup | Charmander | fogo | 15 | ✅ 4/4 |
| 6 | Pyrewyrm | Charizard | fogo/voador | 12 | ✅ 4/4 |
| 7 | Cascalope | Squirtle (slot água) | água | 15 | ✅ 4/4 |
| 9 | Aquacaster | Blastoise | água | 12 | ✅ 4/4 |
| 25 | Voltifox | Pikachu | elétrico | 15 | ✅ 4/4 |
| 74 | Cobblepunch | Geodude | pedra/lutador | 10 | ✅ 4/4 |
| 94 | Grinshade | Gengar | fantasma | 8 | ✅ 4/4 |
| 95 | Tunnelspine | Onix | terra/pedra | 10 | ✅ 4/4 |
| 120 | Tidalgleam | Staryu | água/estrela | 8 | ⬜ |
| 121 | Prismgleam | Starmie | água/psíquico | 8 | ⬜ |
| 130 | MaelstromEel | Gyarados | água/sinistro | 10 | ⬜ |
| 131 | GlacierKelpie | Lapras | água/gelo | 15 | ⬜ |
| 133 | Mimicub | Eevee | normal | 15 | ⬜ |
| 148 | ZephyrosSerpent | Dragonair | dragão/vento | 12 | ⬜ |
| 149 | ZephyrosTitan | Dragonite | dragão/voador | 10 | ⬜ |
| 150 | VoidArchon | Mewtwo | psíquico/sinistro | 8 | ⬜ |
| 197 | Nocturnyx | Umbreon | noturno | 12 | ⬜ |
| 282 | Veilancer | Gardevoir | fada/psíquico | 12 | ⬜ |
| 384 | SkyveilWyrm | Rayquaza | dragão/céu | 8 | ⬜ |
| 448 | Aurastrider | Lucario | lutador/aura | 8 | ⬜ |
