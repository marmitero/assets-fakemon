// Manifesto oficial dos Fakemon — fonte de verdade para o roadmap e o pipeline.
// Ordem de produção = ordem desta lista. Cada criatura = 3 variantes x 4 frames = 12 imagens.

export const VARIANTS = ['front', 'back', 'shiny'];
// Variante extra (opcional): shiny visto de costas — equivale ao back/shiny da PokeAPI.
export const EXTRA_VARIANTS = ['backshiny'];
export const ALL_VARIANTS = [...VARIANTS, ...EXTRA_VARIANTS];
export const FRAMES_PER_VARIANT = 4;

// Caminho de saída replicando a estrutura da PokeAPI.
export const VARIANT_PATH = {
  front: 'animated',
  back: 'animated/back',
  shiny: 'animated/shiny',
  backshiny: 'animated/back/shiny',
};

// delay em centésimos de segundo (15 = 150ms). Batido com a doc.
export const FAKEMON = [
  { id: 1,   name: 'Sporewalker',     delay: 15 },
  { id: 4,   name: 'Emberpup',        delay: 15 },
  { id: 6,   name: 'Pyrewyrm',        delay: 12 },
  { id: 7,   name: 'Cascalope',       delay: 15 },
  { id: 9,   name: 'Aquacaster',      delay: 12 },
  { id: 25,  name: 'Voltifox',        delay: 15 },
  { id: 74,  name: 'Cobblepunch',     delay: 10 },
  { id: 94,  name: 'Grinshade',       delay: 8  },
  { id: 95,  name: 'Tunnelspine',     delay: 10 },
  { id: 120, name: 'Tidalgleam',      delay: 8  },
  { id: 121, name: 'Prismgleam',      delay: 8  },
  { id: 130, name: 'MaelstromEel',    delay: 10 },
  { id: 131, name: 'GlacierKelpie',   delay: 15 },
  { id: 133, name: 'Mimicub',         delay: 15 },
  { id: 148, name: 'ZephyrosSerpent', delay: 12 },
  { id: 149, name: 'ZephyrosTitan',   delay: 10 },
  { id: 150, name: 'VoidArchon',      delay: 8  },
  { id: 197, name: 'Nocturnyx',       delay: 12 },
  { id: 282, name: 'Veilancer',       delay: 12 },
  { id: 384, name: 'SkyveilWyrm',     delay: 8  },
  { id: 448, name: 'Aurastrider',     delay: 8  },
];

export const padId = (id) => String(id).padStart(3, '0');

// Lista plana e ordenada de todos os frames a gerar.
export function buildFrameList() {
  const list = [];
  let n = 0;
  for (const c of FAKEMON) {
    for (const variant of VARIANTS) {
      for (let f = 1; f <= FRAMES_PER_VARIANT; f++) {
        n += 1;
        // Define de qual imagem este frame deriva (para consistência via edições).
        let base = null;       // null = geração por texto (text-to-image)
        if (variant === 'front') {
          base = f === 1 ? null : 'front/frame1';
        } else if (variant === 'back') {
          base = f === 1 ? 'front/frame1' : 'back/frame1';
        } else { // shiny
          base = f === 1 ? 'front/frame1' : 'shiny/frame1';
        }
        list.push({
          n,
          id: c.id,
          pad: padId(c.id),
          name: c.name,
          variant,
          frame: f,
          base,
          path: `frames-raw/${padId(c.id)}/${variant}/frame${f}.png`,
        });
      }
    }
  }
  return list;
}

// Agrupa em etapas de no máximo 10 gerações.
export function buildStages(perStage = 10) {
  const frames = buildFrameList();
  const stages = [];
  for (let i = 0; i < frames.length; i += perStage) {
    stages.push({ stage: stages.length + 1, items: frames.slice(i, i + perStage) });
  }
  return stages;
}
