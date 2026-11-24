import { CategoryId, Order, Product, ShopSettings } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_luxury_showroom_1795536116892.jpg';

export const ASSET_GALLERY: { label: string; url: string }[] = [
  { label: 'Crystal Tier Chandelier', url: '/src/assets/images/prod_crystal_chandelier_1795536116962.jpg' },
  { label: 'Smoked Glass Fancy Pendants', url: '/src/assets/images/prod_fancy_pendant_1795536117533.jpg' },
  { label: 'Alabaster & Brass Wall Sconce', url: '/src/assets/images/prod_brass_wall_sconce_1795536117392.jpg' },
  { label: 'Gold Sculpture & Marble Decor', url: '/src/assets/images/prod_luxury_home_decor_1795536117961.jpg' },
  { label: 'Architectural Gold Wall Clock', url: '/src/assets/images/prod_gold_wall_clock_1795536118030.jpg' },
  { label: 'Brushed Brass Table Lamp & Tray', url: '/src/assets/images/prod_gift_table_lamp_1795536119608.jpg' },
  { label: 'Filigree Lantern & LED Halo', url: '/src/assets/images/prod_royal_lantern_decor_1795536119330.jpg' },
  { label: 'Showroom Luxury Interior', url: '/src/assets/images/hero_luxury_showroom_1795536116892.jpg' },
];

export const CATEGORY_IMAGES: Record<CategoryId, string> = {
  'fancy-lights': '/src/assets/images/prod_fancy_pendant_1795536117533.jpg',
  chandeliers: '/src/assets/images/prod_crystal_chandelier_1795536116962.jpg',
  'wall-lights': '/src/assets/images/prod_brass_wall_sconce_1795536117392.jpg',
  'home-decor': '/src/assets/images/prod_luxury_home_decor_1795536117961.jpg',
  'wall-clocks': '/src/assets/images/prod_gold_wall_clock_1795536118030.jpg',
  'gifts-more': '/src/assets/images/prod_gift_table_lamp_1795536119608.jpg',
};

export const INITIAL_SHOP_SETTINGS: ShopSettings = {
  shopName: 'Yasmin Lights & Home Decor',
  tagline: {
    en: 'Light Your Home, Beautify Your Life.',
    hi: 'अपने घर को रोशन करें, अपने जीवन को सुंदर बनाएं।',
  },
  promoBanner: {
    en: 'Complimentary safe delivery on orders above ₹4,999 · Cash on Delivery available',
    hi: '₹4,999 से ऊपर के ऑर्डर पर मुफ़्त सुरक्षित डिलीवरी · कैश ऑन डिलीवरी उपलब्ध',
  },
  address: {
    en: 'Shop No. 14, Noor Market Main Road, Near City Centre (Edit with your exact showroom address)',
    hi: 'शॉप नंबर 14, नूर मार्केट मेन रोड, सिटी सेंटर के पास (अपना सटीक पता यहाँ बदलें)',
  },
  openingHours: {
    en: 'Mon – Sun: 10:30 AM – 9:00 PM (Open all 7 days)',
    hi: 'सोमवार – रविवार: सुबह 10:30 – रात 9:00 बजे (सभी दिन खुला)',
  },
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  mapUrl: 'https://maps.google.com/?q=Yasmin+Lights+Home+Decor',
  deliveryCharge: 199,
  freeDeliveryThreshold: 4999,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'YL-CH-401',
    name: {
      en: 'Noor 4-Tier K9 Crystal Halo Chandelier',
      hi: 'नूर 4-टियर K9 क्रिस्टल हेलो झूमर',
    },
    category: 'chandeliers',
    price: 18499,
    originalPrice: 22999,
    description: {
      en: 'Hand-assembled K9 bevelled crystal prisms framed in brushed champagne gold rings. Integrated 3-mode warm/neutral/cool LED driver with remote dimming for living rooms and double-height foyers.',
      hi: 'ब्रश्ड शैंपेन गोल्ड रिंग्स में जड़े हाथ से तराशे K9 क्रिस्टल प्रिज्म। लिविंग रूम और हॉल के लिए रिमोट डिमिंग और 3-मोड LED लाइट के साथ।',
    },
    images: [
      '/src/assets/images/prod_crystal_chandelier_1795536116962.jpg',
      '/src/assets/images/hero_luxury_showroom_1795536116892.jpg',
    ],
    sizes: ['60 cm (Single Ring)', '80 cm (3-Tier)', '100 cm (4-Tier)'],
    colors: [
      { name: { en: 'Brushed Gold', hi: 'ब्रश्ड गोल्ड' }, hex: '#D4AF37' },
      { name: { en: 'Antique Brass', hi: 'एंटीक ब्रास' }, hex: '#9C7A32' },
    ],
    stock: 6,
    featured: true,
    latest: false,
  },
  {
    id: 'prod-2',
    sku: 'YL-FL-208',
    name: {
      en: 'Amber Smoke Trio Pendant Cluster',
      hi: 'अंबर स्मोक ट्रायो पेंडेंट लाइट सेट',
    },
    category: 'fancy-lights',
    price: 6499,
    originalPrice: 7999,
    description: {
      en: 'Three mouth-blown smoked amber glass globes suspended from matte black braided cords with solid brass sockets. Ideal over dining tables, kitchen islands, and staircase corners.',
      hi: 'ब्रास सॉकेट और मैट ब्लैक कॉर्ड के साथ तीन हाथ से बने स्मोक्ड अंबर ग्लास पेंडेंट। डाइनिंग टेबल और किचन आइलैंड के लिए बेहतरीन।',
    },
    images: ['/src/assets/images/prod_fancy_pendant_1795536117533.jpg'],
    sizes: ['3-Light Cluster', 'Single Pendant'],
    colors: [
      { name: { en: 'Smoked Amber', hi: 'स्मोक्ड अंबर' }, hex: '#B47B38' },
      { name: { en: 'Charcoal Smoke', hi: 'चारकोल स्मोक' }, hex: '#3D3D42' },
    ],
    stock: 11,
    featured: true,
    latest: true,
  },
  {
    id: 'prod-3',
    sku: 'YL-WL-115',
    name: {
      en: 'Alabaster Wing Hammered Brass Wall Sconce',
      hi: 'अलाबास्टर विंग हैमर्ड ब्रास वॉल लाइट',
    },
    category: 'wall-lights',
    price: 3899,
    originalPrice: 4699,
    description: {
      en: 'Natural veined alabaster stone panels framed in hand-hammered antique gold brass. Casts a warm bi-directional wash across textured bedroom and hallway walls.',
      hi: 'असली अलाबास्टर स्टोन और हाथ से बने एंटीक गोल्ड फ्रेम वाली दीवार लाइट। बेडरूम और कॉरिडोर की दीवारों पर खूबसूरत सुनहरी रोशनी फैलाती है।',
    },
    images: ['/src/assets/images/prod_brass_wall_sconce_1795536117392.jpg'],
    sizes: ['32 cm Height', '45 cm Height'],
    colors: [
      { name: { en: 'Hammered Gold', hi: 'हैमर्ड गोल्ड' }, hex: '#C9A23F' },
      { name: { en: 'Matte Black & Brass', hi: 'ब्लैक और ब्रास' }, hex: '#262420' },
    ],
    stock: 14,
    featured: true,
    latest: false,
  },
  {
    id: 'prod-4',
    sku: 'YL-HD-502',
    name: {
      en: 'Aurelia Interlocking Brass Console Sculpture',
      hi: 'ऑरेलिया इंटरलॉकिंग ब्रास कंसोल मूर्ति',
    },
    category: 'home-decor',
    price: 4299,
    originalPrice: 5199,
    description: {
      en: 'Fluid abstract ribbon sculpture cast in solid brushed brass resting on a polished black marble plinth. Designed to anchor console tables, bookshelves, and entryway sideboards.',
      hi: 'काले मार्बल बेस पर सजी ब्रश्ड ब्रास की आधुनिक एब्स्ट्रैक्ट मूर्ति। कंसोल टेबल, बुकशेल्फ और लिविंग रूम शोकेस के लिए खास।',
    },
    images: ['/src/assets/images/prod_luxury_home_decor_1795536117961.jpg'],
    sizes: ['Medium (34 cm)', 'Large (46 cm)'],
    colors: [
      { name: { en: 'Satin Gold', hi: 'सैटिन गोल्ड' }, hex: '#D4AF37' },
      { name: { en: 'Burnished Bronze', hi: 'बर्निश्ड ब्रॉन्ज़' }, hex: '#7A5C38' },
    ],
    stock: 9,
    featured: true,
    latest: true,
  },
  {
    id: 'prod-5',
    sku: 'YL-WC-309',
    name: {
      en: 'Sovereign Geometric Roman Wall Clock',
      hi: 'सॉवरेन जियोमेट्रिक रोमन दीवार घड़ी',
    },
    category: 'wall-clocks',
    price: 5299,
    originalPrice: 6499,
    description: {
      en: 'Architectural matte black wrought-iron dial accented with brushed gold compass points and raised Roman numerals. Equipped with an ultra-silent Japanese sweep movement.',
      hi: 'मैट ब्लैक और ब्रश्ड गोल्ड रोमन अंकों वाली भव्य धातु की दीवार घड़ी। बिल्कुल शांत (साइलेंट-स्वीप) मशीन के साथ।',
    },
    images: ['/src/assets/images/prod_gold_wall_clock_1795536118030.jpg'],
    sizes: ['60 cm Diameter', '80 cm Statement'],
    colors: [
      { name: { en: 'Obsidian & Gold', hi: 'ब्लैक और गोल्ड' }, hex: '#1F1F24' },
      { name: { en: 'Champagne Brass', hi: 'शैंपेन ब्रास' }, hex: '#D8B968' },
    ],
    stock: 7,
    featured: true,
    latest: false,
  },
  {
    id: 'prod-6',
    sku: 'YL-GM-712',
    name: {
      en: 'Cordless Brass Dome Lamp & Hammered Gift Tray',
      hi: 'कॉर्डलेस ब्रास डोम लैंप और गिफ्ट ट्रे सेट',
    },
    category: 'gifts-more',
    price: 3499,
    originalPrice: 4299,
    description: {
      en: 'Rechargeable touch-dimming brushed brass mushroom table lamp paired with a handcrafted hammered brass serving tray. Arrives in velvet-lined festive gift packaging.',
      hi: 'टच-डिमिंग रिचार्जेबल ब्रास टेबल लैंप और हाथ से बनी हैमर्ड ब्रास ट्रे का प्रीमियम कॉम्बो। शादी, गृह-प्रवेश और त्योहार के उपहार के लिए उत्तम।',
    },
    images: ['/src/assets/images/prod_gift_table_lamp_1795536119608.jpg'],
    sizes: ['Lamp + Tray Gift Set', 'Lamp Only'],
    colors: [
      { name: { en: 'Brushed Brass', hi: 'ब्रश्ड ब्रास' }, hex: '#CFA849' },
      { name: { en: 'Rose Gold', hi: 'रोज़ गोल्ड' }, hex: '#C88D74' },
    ],
    stock: 15,
    featured: false,
    latest: true,
  },
  {
    id: 'prod-7',
    sku: 'YL-GM-724',
    name: {
      en: 'Royal Filigree Lantern & Halo LED Table Light',
      hi: 'रॉयल जालीदार लालटेन और हेलो LED टेबल लैंप',
    },
    category: 'gifts-more',
    price: 2999,
    originalPrice: 3699,
    description: {
      en: 'Laser-cut Moroccan gold filigree lantern with flameless warm candle glow or sculptural LED ring table ornament. Creates rich shadow play on dining and coffee tables.',
      hi: 'बारीक सुनहरी जालीदार डिज़ाइन वाली लालटेन और चमकदार LED हेलो टेबल लाइट। त्योहारों और शाम की सजावट के लिए मनमोहक रोशनी।',
    },
    images: ['/src/assets/images/prod_royal_lantern_decor_1795536119330.jpg'],
    sizes: ['Lantern (36 cm)', 'Halo Lamp (30 cm)', 'Combo Pair'],
    colors: [
      { name: { en: 'Royal Gold', hi: 'रॉयल गोल्ड' }, hex: '#E0BA53' },
    ],
    stock: 12,
    featured: true,
    latest: true,
  },
  {
    id: 'prod-8',
    sku: 'YL-CH-418',
    name: {
      en: 'Imperial Crystal Oval Dining Chandelier',
      hi: 'इम्पीरियल क्रिस्टल ओवल डाइनिंग झूमर',
    },
    category: 'chandeliers',
    price: 14999,
    originalPrice: 17999,
    description: {
      en: 'Elongated brushed brass frame lined with precision-cut clear crystals, crafted specifically for 6-to-8 seater dining tables and luxury lounge ceilings.',
      hi: '6 से 8 सीटर डाइनिंग टेबल और लॉबी के लिए खास डिज़ाइन किया गया ओवल ब्रास और क्रिस्टल झूमर।',
    },
    images: ['/src/assets/images/hero_luxury_showroom_1795536116892.jpg'],
    sizes: ['90 cm Oval', '120 cm Grand Oval'],
    colors: [
      { name: { en: 'Warm Gold', hi: 'वार्म गोल्ड' }, hex: '#D4AF37' },
    ],
    stock: 3,
    featured: false,
    latest: true,
  },
  {
    id: 'prod-9',
    sku: 'YL-HD-519',
    name: {
      en: 'Matte Obsidian Ceramic Vase & Candle Trio',
      hi: 'मैट ब्लैक सिरेमिक वास और सुगंधित मोमबत्ती सेट',
    },
    category: 'home-decor',
    price: 2499,
    originalPrice: 2999,
    description: {
      en: 'Minimalist stoneware vase in velvety matte charcoal paired with an amber-oud scented soy candle and reed diffuser for bedrooms and coffee tables.',
      hi: 'मैट ब्लैक सिरेमिक फ्लावर वास, सुगंधित कैंडल और रीड डिफ्यूज़र का आधुनिक होम डेकोर सेट।',
    },
    images: ['/src/assets/images/prod_luxury_home_decor_1795536117961.jpg'],
    sizes: ['3-Piece Console Set'],
    colors: [
      { name: { en: 'Matte Obsidian', hi: 'मैट ब्लैक' }, hex: '#1B1B1E' },
    ],
    stock: 18,
    featured: false,
    latest: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'YL-1041',
    createdAt: '2026-11-22T14:20:00.000Z',
    customerName: 'Aarav Verma',
    phone: '9876501234',
    address: 'Flat 402, Gulmohar Residency, Station Road',
    city: 'Lucknow',
    pincode: '226001',
    notes: 'Call 15 mins before delivery',
    paymentMethod: 'COD',
    items: [
      {
        productId: 'prod-5',
        name: {
          en: 'Sovereign Geometric Roman Wall Clock',
          hi: 'सॉवरेन जियोमेट्रिक रोमन दीवार घड़ी',
        },
        image: '/src/assets/images/prod_gold_wall_clock_1795536118030.jpg',
        price: 5299,
        quantity: 1,
        selectedSize: '60 cm Diameter',
        selectedColor: 'Obsidian & Gold',
      },
    ],
    subtotal: 5299,
    deliveryFee: 0,
    total: 5299,
    status: 'Out for Delivery',
  },
  {
    id: 'YL-1042',
    createdAt: '2026-11-23T18:45:00.000Z',
    customerName: 'Zoya Khan',
    phone: '9811223344',
    address: 'House 28, Civil Lines, Near Park Avenue',
    city: 'Prayagraj',
    pincode: '211001',
    paymentMethod: 'COD',
    items: [
      {
        productId: 'prod-2',
        name: {
          en: 'Amber Smoke Trio Pendant Cluster',
          hi: 'अंबर स्मोक ट्रायो पेंडेंट लाइट सेट',
        },
        image: '/src/assets/images/prod_fancy_pendant_1795536117533.jpg',
        price: 6499,
        quantity: 1,
        selectedSize: '3-Light Cluster',
        selectedColor: 'Smoked Amber',
      },
      {
        productId: 'prod-3',
        name: {
          en: 'Alabaster Wing Hammered Brass Wall Sconce',
          hi: 'अलाबास्टर विंग हैमर्ड ब्रास वॉल लाइट',
        },
        image: '/src/assets/images/prod_brass_wall_sconce_1795536117392.jpg',
        price: 3899,
        quantity: 2,
        selectedSize: '32 cm Height',
        selectedColor: 'Hammered Gold',
      },
    ],
    subtotal: 14297,
    deliveryFee: 0,
    total: 14297,
    status: 'Confirmed',
  },
];
