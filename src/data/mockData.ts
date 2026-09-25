import { Product, MoodCollection, Hotspot } from '../types';

export const MOOD_COLLECTIONS: MoodCollection[] = [
  {
    id: 'modern-luxe',
    title: 'Modern Luxe',
    subtitle: 'Clean lines • soft neutrals',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
    accent: '#8b6b4d'
  },
  {
    id: 'cozy-warm',
    title: 'Cozy & Warm',
    subtitle: 'Layers • lamps • comfort',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
    accent: '#173c2d'
  },
  {
    id: 'boho-natural',
    title: 'Boho & Natural',
    subtitle: 'Greens • texture • calm',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    accent: '#8a9b82'
  },
  {
    id: 'dreamy-bedroom',
    title: 'Dreamy Bedroom',
    subtitle: 'Soft • serene • personal',
    image: 'https://images.unsplash.com/photo-1615874694520-474822f81a41?auto=format&fit=crop&w=1000&q=85',
    accent: '#8b6b4d'
  },
  {
    id: 'workspace-refresh',
    title: 'Workspace Refresh',
    subtitle: 'Focus • function • beauty',
    image: 'https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1000&q=85',
    accent: '#173c2d'
  },
  {
    id: 'minimal-clean',
    title: 'Minimal & Clean',
    subtitle: 'Less clutter • more calm',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=85',
    accent: '#8a9b82'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'soft-linen-bedding',
    name: 'Soft Linen Bedding Set',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85',
    category: 'Bedding',
    mood: 'dreamy-bedroom',
    description: 'Washed French flax linen duvet set with stone-washed softness that gets cozier with every wash. Includes 1 duvet cover and 2 pillow shams.',
    inStock: true,
    material: '100% Pre-washed Organic Flax Linen',
    dimensions: 'Queen (90" x 92")',
    features: ['Breathable all-season comfort', 'Hidden wooden button closure', 'Hypoallergenic & OEKO-TEX certified'],
    badge: 'Bestseller'
  },
  {
    id: 'warm-fairy-lights',
    name: 'Warm Amber Fairy Lights',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 218,
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=85',
    category: 'Lighting',
    mood: 'cozy-warm',
    description: '10-meter bendable micro-copper wire with 100 warm 2400K LED drops. Creates a magical, Pinterest-worthy atmospheric golden glow.',
    inStock: true,
    material: 'Ultra-thin insulated copper wire',
    dimensions: '10 meters (33 ft) with USB & battery option',
    features: ['8 lighting ambiance modes', 'Remote control with 6hr timer', 'Safe touch low-voltage'],
    badge: 'Popular'
  },
  {
    id: 'botanical-wall-prints',
    name: 'Botanical Wall Prints (Trio)',
    price: 749,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85',
    category: 'Wall Art',
    mood: 'boho-natural',
    description: 'Curated gallery trio featuring minimalist eucalyptus, sage olive foliage, and warm architectural earth tones on textured archival matte art paper.',
    inStock: true,
    material: '300 GSM Archival Textured Matte Paper',
    dimensions: 'A3 Size (11.7" x 16.5" each)',
    features: ['FSC-certified sustainable paper', 'Fade-resistant pigment inks', 'Fits standard gallery frames'],
    badge: 'Trending'
  },
  {
    id: 'minimal-planter-set',
    name: 'Minimal Ceramic Planters (Set of 2)',
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=85',
    category: 'Décor',
    mood: 'minimal-clean',
    description: 'Matte ivory terracotta indoor pots with drainage holes and built-in bamboo saucers for clean tabletop styling.',
    inStock: true,
    material: 'Kiln-fired earthenware with bamboo saucers',
    dimensions: 'Small: 5.5" dia × 5", Medium: 7" dia × 6.2"',
    features: ['Internal drainage hole & plug', 'Natural bamboo water catcher', 'Velvet bottom pads to prevent scratches'],
    badge: 'Eco Pick'
  },
  {
    id: 'ribbed-table-lamp',
    name: 'Fluted Ceramic Accent Lamp',
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85',
    category: 'Lighting',
    mood: 'modern-luxe',
    description: 'Sculptural fluted ceramic base paired with an oatmeal linen drum shade. Casts a warm, diffused ambient glow across bedside tables and study desks.',
    inStock: true,
    material: 'Handcrafted stoneware ceramic & natural linen',
    dimensions: 'Height 14.5" | Base diameter 6"',
    features: ['3-way touch dimming switch', 'Includes warm LED vintage filament bulb', 'Braided textile power cable'],
    badge: 'New'
  },
  {
    id: 'boucle-throw-blanket',
    name: 'Textured Bouclé Throw Blanket',
    price: 1299,
    originalPrice: 1699,
    rating: 4.8,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=85',
    category: 'Bedding',
    mood: 'cozy-warm',
    description: 'Cloud-soft looped bouclé knit in warm oatmeal cream. Drape effortlessly over your reading chair or foot of your bed for instant Pinterest texture.',
    inStock: true,
    material: 'Hypoallergenic organic cotton-wool blend',
    dimensions: '50" × 65" with tassel ends',
    features: ['Non-shedding weave', 'Machine washable on delicate', 'Breathable warmth for all seasons'],
  },
  {
    id: 'amber-glass-candle',
    name: 'Cedar & Amber Botanical Candle',
    price: 499,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 176,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85',
    category: 'Décor',
    mood: 'cozy-warm',
    description: 'Hand-poured 100% natural soy wax candle in an apothecary amber glass jar with a crackling wooden wick. Notes of cedarwood, warm amber, and smoked vanilla.',
    inStock: true,
    material: 'Natural soy wax & essential oil infusions',
    dimensions: '250g | 55+ hour clean burn',
    features: ['Crackling organic wood wick', 'Reusable apothecary vessel with lid', 'Phthalate and paraben-free'],
    badge: 'Favorite'
  },
  {
    id: 'woven-jute-basket',
    name: 'Woven Seagrass & Jute Basket',
    price: 799,
    originalPrice: 1099,
    rating: 4.7,
    reviewsCount: 53,
    image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=85',
    category: 'Décor',
    mood: 'boho-natural',
    description: 'Hand-braided natural seagrass belly basket with fold-down handles. Perfect for storing rolled throws, magazines, or as a bohemian indoor plant sleeve.',
    inStock: true,
    material: '100% Sustainable harvested seagrass & natural jute',
    dimensions: '12" diameter × 13" height',
    features: ['Collapsible top half into bowl shape', 'Sturdy reinforced carrying handles', 'Artisan-crafted fair trade'],
  }
];

export const LOOK_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs1',
    x: 45,
    y: 38,
    productId: 'soft-linen-bedding',
    title: 'Soft Linen Bedding',
    price: 1899,
    description: 'French washed flax in oatmeal cream'
  },
  {
    id: 'hs2',
    x: 66,
    y: 55,
    productId: 'botanical-wall-prints',
    title: 'Botanical Wall Prints',
    price: 749,
    description: 'Set of 3 minimalist botanical foliage'
  },
  {
    id: 'hs3',
    x: 25,
    y: 70,
    productId: 'warm-fairy-lights',
    title: 'Warm Fairy Lights',
    price: 599,
    description: '100 LED ambient warm copper wire'
  }
];

export const BENEFITS = [
  {
    symbol: '◌',
    title: 'Stylish Décor',
    desc: 'Curated pieces that feel effortlessly beautiful and Pinterest-inspired.'
  },
  {
    symbol: '⌂',
    title: 'Easy to Install',
    desc: 'Simple upgrades without complicated renovation projects or tools.'
  },
  {
    symbol: '♡',
    title: 'Affordable Luxury',
    desc: 'Premium-looking details without the astronomical boutique price tag.'
  },
  {
    symbol: '✦',
    title: 'Room Transformations',
    desc: 'Small details that completely shift how you feel inside your space.'
  },
  {
    symbol: '❧',
    title: 'Eco-Minded',
    desc: 'Thoughtful, sustainable materials designed for mindful living.'
  }
];
