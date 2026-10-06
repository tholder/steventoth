export interface Neighbourhood {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  intro: string[];
  highlights: string[];
  housing: string;
  goodFor: string[];
  nearby: string[];
}

export const neighbourhoods: Neighbourhood[] = [
  {
    slug: 'kitsilano',
    name: 'Kitsilano',
    tagline: 'Beaches, West 4th and the mountains on your doorstep.',
    summary:
      'Steven’s home neighbourhood. Kits Beach, character homes, walkable shopping and an easy hop downtown.',
    intro: [
      'Kitsilano is where Steven lives with his family, so this is the neighbourhood he knows street by street. It runs from Burrard Street west to Alma, and from the beaches of English Bay south to roughly 16th Avenue.',
      'Kits has a relaxed, active feel: joggers on Point Grey Road, volleyball on Kits Beach, and a steady stream of people heading to the cafés, bakeries and shops on West 4th Avenue and West Broadway. It’s also close to downtown, Granville Island and UBC.',
    ],
    highlights: [
      'Kitsilano Beach and Kits Pool, the long outdoor saltwater pool beside English Bay',
      'West 4th Avenue and West Broadway shops, restaurants and grocers',
      'Vanier Park, the Museum of Vancouver and Bard on the Beach in summer',
      'The Arbutus Greenway and seaside cycling routes',
      'Rapid transit on Broadway, with the Broadway Subway extending the Millennium Line to Arbutus',
    ],
    housing:
      'Low-rise condos and older walk-ups, character houses converted into strata suites, townhomes, and detached homes on the quieter streets toward Point Grey and Arbutus.',
    goodFor: ['First-time buyers', 'Young families', 'Active, beach-loving lifestyles', 'Downsizers who want walkability'],
    nearby: ['point-grey', 'fairview', 'arbutus-ridge'],
  },
  {
    slug: 'point-grey',
    name: 'Point Grey',
    tagline: 'Jericho, Spanish Banks and a village feel on West 10th.',
    summary: 'Leafy streets, big views and some of the city’s best beaches, just east of UBC.',
    intro: [
      'West Point Grey sits between Kitsilano and the University Endowment Lands. It’s quieter and greener than Kits, with tree-lined streets and many homes that look north to the water and the North Shore mountains.',
      'Day-to-day life centres on the West 10th Avenue village and the shops along Broadway, with Jericho, Locarno and Spanish Banks beaches a short walk or bike ride away.',
    ],
    highlights: [
      'Jericho, Locarno and Spanish Banks beaches',
      'Jericho Beach Park and the sailing centre',
      'West 10th Avenue village shops and cafés',
      'Close to UBC and Pacific Spirit Regional Park',
    ],
    housing:
      'Mostly detached homes, from classic 1920s–40s character houses to newer builds, plus a selection of low-rise condos and townhomes near the commercial streets.',
    goodFor: ['Families', 'UBC faculty and staff', 'Buyers who want space and quiet'],
    nearby: ['kitsilano', 'dunbar', 'arbutus-ridge'],
  },
  {
    slug: 'dunbar',
    name: 'Dunbar–Southlands',
    tagline: 'Big lots, Pacific Spirit Park and a true neighbourhood high street.',
    summary: 'A family-oriented community bordering Pacific Spirit Park, with a classic main street on Dunbar.',
    intro: [
      'Dunbar–Southlands is one of the Westside’s most established family neighbourhoods. Dunbar Street has a small-town high street, with independent shops, a community centre and local restaurants.',
      'To the west is Pacific Spirit Regional Park, with hundreds of hectares of forest trails. Down the hill, Southlands has a semi-rural feel, with equestrian properties, golf courses and the Fraser River.',
    ],
    highlights: [
      'Pacific Spirit Regional Park trails',
      'Dunbar Street village and Dunbar Community Centre',
      'Southlands equestrian area and nearby golf courses',
      'Well-regarded public and independent schools nearby',
    ],
    housing: 'Predominantly detached homes on generous lots, with some newer infill and laneway homes.',
    goodFor: ['Growing families', 'Nature lovers', 'Buyers looking for a long-term family home'],
    nearby: ['point-grey', 'kerrisdale', 'arbutus-ridge'],
  },
  {
    slug: 'kerrisdale',
    name: 'Kerrisdale',
    tagline: 'A polished village on West 41st with everything within walking distance.',
    summary: 'Established, convenient and calm, with a lively shopping village and quick access to the Arbutus Greenway.',
    intro: [
      'Kerrisdale is built around the West 41st Avenue village: boutiques, bakeries, banks, grocers and restaurants, all walkable from the surrounding residential streets.',
      'It’s popular with families for its schools and parks, and with downsizers who want to stay on the Westside in a well-kept condo close to shops and services.',
    ],
    highlights: [
      'West 41st Avenue shopping village',
      'Kerrisdale Community Centre, arena and library',
      'Arbutus Greenway for walking and cycling',
      'Quick drive to the airport and Richmond',
    ],
    housing:
      'A mix of mid-rise and low-rise condos near 41st, and detached homes on quiet tree-lined streets around the village.',
    goodFor: ['Downsizers', 'Families', 'Buyers who want village convenience'],
    nearby: ['arbutus-ridge', 'dunbar', 'shaughnessy'],
  },
  {
    slug: 'arbutus-ridge',
    name: 'Arbutus Ridge',
    tagline: 'Quiet, central and right on the Arbutus Greenway.',
    summary: 'A peaceful residential pocket between Kits, Kerrisdale and Shaughnessy, with easy access to everything.',
    intro: [
      'Arbutus Ridge is a calm, mostly residential neighbourhood in the middle of the Westside. You’re minutes from Kitsilano’s beaches, Kerrisdale’s village and South Granville’s shops.',
      'The Arbutus Greenway runs right through it, giving you a car-free route north to the water or south toward the Fraser River.',
    ],
    highlights: [
      'Arbutus Greenway',
      'Quilchena Park and nearby golf courses',
      'Central location between Kits, Kerrisdale and Shaughnessy',
      'Future Broadway Subway station at Arbutus',
    ],
    housing: 'Mostly detached homes and townhomes, with some newer low-rise developments along the main corridors.',
    goodFor: ['Families', 'Commuters', 'Buyers who want quiet without being remote'],
    nearby: ['kitsilano', 'kerrisdale', 'shaughnessy'],
  },
  {
    slug: 'shaughnessy',
    name: 'Shaughnessy',
    tagline: 'Heritage estates, grand trees and winding crescents.',
    summary: 'One of Vancouver’s most prestigious addresses, known for heritage homes and large, private lots.',
    intro: [
      'Shaughnessy was planned in the early 1900s as an exclusive residential enclave. Today its curving streets, mature trees and stately homes make it one of the most distinctive neighbourhoods in the city.',
      'Much of First Shaughnessy is a heritage conservation area, which shapes what can be built and renovated. If you’re buying or selling here, that’s something to understand early.',
    ],
    highlights: [
      'Heritage character homes and estate properties',
      'The Crescent and Douglas Park',
      'Close to South Granville galleries and dining',
      'Short drive to downtown and the airport',
    ],
    housing:
      'Large detached homes and estates, with some heritage homes converted into multiple suites, and a small number of townhomes and condos at the edges.',
    goodFor: ['Luxury buyers', 'Heritage enthusiasts', 'Families seeking privacy'],
    nearby: ['arbutus-ridge', 'kerrisdale', 'fairview'],
  },
  {
    slug: 'fairview',
    name: 'Fairview & South Granville',
    tagline: 'False Creek, Granville Island and the South Granville strip.',
    summary: 'Central, walkable condo living between False Creek and Broadway, minutes from downtown.',
    intro: [
      'Fairview runs from False Creek up the slope to 16th Avenue, between Burrard and Cambie. On the waterfront, South False Creek has seawall paths, small parks and Granville Island next door.',
      'Up the hill, South Granville is known for galleries, design shops and restaurants. Broadway is a major employment and medical corridor, including Vancouver General Hospital.',
    ],
    highlights: [
      'False Creek seawall and Granville Island',
      'South Granville galleries, shops and restaurants',
      'Broadway corridor and future Broadway Subway stations',
      'Easy walk or bike to downtown',
    ],
    housing: 'Mostly condos and townhomes, from 1970s–80s False Creek co-ops and strata to newer mid-rise buildings.',
    goodFor: ['First-time buyers', 'Professionals', 'Medical staff', 'Car-light living'],
    nearby: ['kitsilano', 'mount-pleasant', 'shaughnessy'],
  },
  {
    slug: 'mount-pleasant',
    name: 'Mount Pleasant',
    tagline: 'Main Street, breweries, murals and creative energy.',
    summary: 'One of Vancouver’s oldest neighbourhoods, now one of its liveliest, centred on Main Street.',
    intro: [
      'Mount Pleasant mixes heritage houses with new condos and converted industrial spaces. Main Street is lined with independent shops, coffee and restaurants, and the Brewery Creek area has a cluster of craft breweries.',
      'It’s close to downtown, the Olympic Village and False Creek, and it’s well served by transit.',
    ],
    highlights: [
      'Main Street shops, cafés and restaurants',
      'Brewery Creek craft breweries',
      'Olympic Village and the False Creek seawall',
      'Annual mural festival and arts scene',
    ],
    housing: 'Condos and townhomes, character houses split into suites, and some detached homes on the residential side streets.',
    goodFor: ['First-time buyers', 'Creatives', 'Investors', 'Buyers who want an urban feel'],
    nearby: ['fairview', 'kitsilano'],
  },
  {
    slug: 'downtown',
    name: 'Downtown, Yaletown & West End',
    tagline: 'Seawall, Stanley Park and city living at its best.',
    summary: 'High-rise views, Stanley Park and English Bay, with everything you need within walking distance.',
    intro: [
      'Downtown Vancouver gives you a car-optional lifestyle with the seawall, Stanley Park and some of the city’s best restaurants close by. Yaletown has converted warehouses and a waterfront marina. The West End has tree-lined residential streets beside English Bay.',
      'Downtown condo buildings vary a lot. Strata health, depreciation reports and building amenities matter as much as the unit itself, and that’s where Steven’s condo training comes in.',
    ],
    highlights: [
      'Stanley Park and the seawall',
      'English Bay and Sunset Beach',
      'Yaletown dining and the Roundhouse',
      'SkyTrain and Canada Line access',
    ],
    housing: 'Predominantly high-rise and mid-rise condos, with some townhomes and a handful of heritage buildings in the West End.',
    goodFor: ['Professionals', 'Investors', 'Downsizers', 'Pied-à-terre buyers'],
    nearby: ['fairview', 'kitsilano'],
  },
];

export const neighbourhoodBySlug = Object.fromEntries(neighbourhoods.map((n) => [n.slug, n]));
