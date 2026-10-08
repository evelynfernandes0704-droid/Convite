import { Dish } from '../types/wedding';

export const MAIN_DISHES: Dish[] = [
  {
    id: 'filet-mignon-porto',
    name: 'Tournedos de Filé Mignon ao Porto & Frutas Negras',
    category: 'carne',
    shortDesc: 'Medalhão alto grelhado na manteiga clarificada com redução aveludada de vinho do Porto Tawny e amoras silvestres negras.',
    detailedDesc: 'Corte nobre e suculento de filé mignon selado com precisão, servido sob um glacê espesso e aromático de vinho do Porto português reduzido com amoras da floresta negra e pimenta-da-jamaica. Acompanha suntuoso aligot de batatas trufado com queijo da Serra da Canastra e cogumelos Paris frescos salteados no tomilho.',
    ingredients: [
      'Filé Mignon Angus 220g',
      'Redução de Vinho do Porto Tawny',
      'Amoras & Mirtilos Silvestres',
      'Aligot Artesanal Trufado',
      'Cogumelos Paris Flambados',
      'Mini Cenouras Glaciadas'
    ],
    pairing: 'Vinho Tinto Cabernet Sauvignon Reserva ou Syrah Encorpado',
    badge: 'Escolha dos Noivos',
    dietaryTags: ['Sem Glúten', 'Contém Lactose'],
    chefNote: 'O prato ícone da noite, combinando a intensidade das frutas escuras com a maciez impecável da carne.',
    iconName: 'Utensils'
  },
  {
    id: 'salmao-ervas-negras',
    name: 'Lombo de Salmão em Crosta de Ervas Negras & Romã',
    category: 'peixe',
    shortDesc: 'Salmão fresco com crosta negra crocante de gergelim e ervas finas, servido com risoto de arroz negro venere e aspargos grelhados.',
    detailedDesc: 'Lombo de salmão fresco do Atlântico Norte com crosta crocante de gergelim preto torrado, carvão vegetal ativado e ervas provençais. Acompanha risoto cremoso de arroz negro italiano (Riso Venere), aspargos frescos salteados no azeite extravirgem e um delicado coulis agridoce de romãs imperiais.',
    ingredients: [
      'Lombo de Salmão Premium 200g',
      'Crosta de Ervas Finas & Gergelim Preto',
      'Arroz Negro Italiano Venere',
      'Aspargos Verdes Frescos',
      'Redução de Romã Imperial',
      'Azeite Trufado Extra Virgem'
    ],
    pairing: 'Vinho Branco Chardonnay Amadeirado ou Pinot Noir Leve',
    badge: 'Sofisticação Marinha',
    dietaryTags: ['Sem Glúten', 'Sem Lactose (sob solicitação)'],
    chefNote: 'Visual gótico impressionante proporcionado pelo arroz negro e contraste rubi vibrante da romã.',
    iconName: 'Fish'
  },
  {
    id: 'risotto-tartufo-nero',
    name: 'Risotto Al Tartufo Nero & Cogumelos Silvestres',
    category: 'vegetariano',
    shortDesc: 'Arroz arbóreo mantecato com manteiga de trufas negras de Norcia, cogumelos porcini e shimeji negro com crocante de parmesão 24 meses.',
    detailedDesc: 'Clássico risotto de arroz arbóreo italiano lentamente cozido em caldo aromático de legumes e cogumelos silvestres desidratados. Enriquecido com manteiga de trufas negras importadas, cogumelos porcini frescos, shimeji negro e lâminas douradas de queijo Parmigiano Reggiano maturado por 24 meses.',
    ingredients: [
      'Arroz Arbóreo Italiano D.O.P.',
      'Trufas Negras de Norcia',
      'Cogumelos Porcini & Shimeji Negro',
      'Vinho Branco Seco',
      'Parmesão Reggiano 24 Meses',
      'Brotos Orgânicos Escuros'
    ],
    pairing: 'Vinho Tinto Italiano Chianti Clássico ou Brunello di Montalcino',
    badge: 'Vegetariano Gourmet',
    dietaryTags: ['Vegetariano', 'Sem Glúten'],
    chefNote: 'Aroma inebriante e terra molhada que traduz perfeitamente a essência mística da celebração.',
    iconName: 'Sparkles'
  },
  {
    id: 'confit-pato-amarenas',
    name: 'Confit de Pato com Glacê de Cerejas Negras Amarenas',
    category: 'ave',
    shortDesc: 'Coxa de pato lentamente confitada por 12 horas em gordura nobre de ervas, servida sobre mousseline de mandioquinha defumada.',
    detailedDesc: 'Receita nobre da clássica culinária francesa: coxa e sobrecoxa de pato marinadas em vinho tinto, tomilho e zimbro, cozidas lentamente por 12 horas até desfiar ao toque. Servida com glacê denso de cerejas negras amarenas italianas e especiarias antigas, sobre mousseline aveludada de mandioquinha defumada na lenha.',
    ingredients: [
      'Coxa e Sobrecoxa de Pato Confitada',
      'Cerejas Negras Amarenas Italianas',
      'Mousseline de Mandioquinha Defumada',
      'Especiarias Medievais (Zimbro, Canela & Anis)',
      'Crispy de Alho-Poró'
    ],
    pairing: 'Vinho Tinto Merlot Gran Reserva ou Carménère',
    badge: 'Tradição Nobre',
    dietaryTags: ['Sem Glúten'],
    chefNote: 'Sabor profundo, quente e envolvente para noites elegantes sob a luz de velas.',
    iconName: 'Crown'
  },
  {
    id: 'ravioli-negro-vegano',
    name: 'Ravioli Negro Artesanal de Abóbora Cabotiá & Sálvia',
    category: 'vegano',
    shortDesc: 'Massa fresca artesanal com carvão vegetal ativado, recheada de cabotiá caramelizada, manteiga vegetal de sálvia e nozes tostadas.',
    detailedDesc: 'Massa artesanal elaborada com sêmola de grano duro e tingida naturalmente com carvão vegetal ativado grau culinário, conferindo um tom preto ônix absoluto. Recheada com purê de abóbora cabotiá assada na brasa com toque de noz-moscada fresca. Salteada em manteiga de castanhas com folhas de sálvia crocante e pecãs tostadas.',
    ingredients: [
      'Massa Artesanal com Carvão Ativado Vegetal',
      'Abóbora Cabotiá Assada na Brasa',
      'Manteiga Vegetal de Castanha de Caju',
      'Sálvia Fresca Crocante',
      'Nozes Pecan Caramelizadas',
      'Flor de Sal Negra do Chipre'
    ],
    pairing: 'Vinho Branco Sauvignon Blanc ou Espumante Brut Nature',
    badge: '100% Vegano & Artesanal',
    dietaryTags: ['Vegano', 'Sem Lactose', '100% Plant-Based'],
    chefNote: 'Equilíbrio primoroso entre a doçura da abóbora, a rusticidade das nozes e o visual gótico impactante.',
    iconName: 'Leaf'
  }
];

export const DIETARY_OPTIONS = [
  { id: 'sem-gluten', label: 'Sem Glúten' },
  { id: 'sem-lactose', label: 'Sem Lactose' },
  { id: 'vegetariano', label: 'Vegetariano' },
  { id: 'vegano', label: 'Vegano' },
  { id: 'frutos-do-mar', label: 'Alergia a Frutos do Mar' },
  { id: 'nozes-castanhas', label: 'Alergia a Nozes/Castanhas' },
  { id: 'diabetico', label: 'Sem Açúcar / Diabético' }
];

export const WEDDING_INFO = {
  couple: 'Felipe & Evelyn',
  bride: 'Evelyn',
  groom: 'Felipe',
  date: '31 de Outubro de 2026',
  dateIso: '2026-10-31T19:30:00',
  time: '19:30',
  ceremonyVenue: 'Catedral de São Dimas — Altar da Penumbra',
  ceremonyAddress: 'Praça das Rosas Negras, 1313 - Bairro Gótico, São Paulo - SP',
  receptionVenue: 'Palácio dos Espelhos Negros & Jardim Noturno',
  receptionAddress: 'Av. das Brumas Eternas, 660 - São Paulo - SP',
  dressCode: 'Gothic Black Tie & Dark Romance Elegance',
  dressCodeDetails: 'Traje de gala refinado. Cores recomendadas: Preto nobre, Borgonha/Vinho tinto, Verde esmeralda profundo, Azul meia-noite e Dourado envelhecido.',
  rsvpDeadline: '10 de Outubro de 2026',
  quote: 'Nas sombras encontramos a nossa luz, e na eternidade selamos o nosso amor.'
};
