import { CategoryId, Language, OrderStatus } from '../types';

export const CATEGORY_LABELS: Record<CategoryId, { en: string; hi: string; subtitleEn: string; subtitleHi: string }> = {
  'fancy-lights': {
    en: 'Fancy Lights',
    hi: 'फैंसी लाइट्स',
    subtitleEn: 'Pendant clusters & ambient glass',
    subtitleHi: 'पेंडेंट और आधुनिक ग्लास लाइट्स',
  },
  chandeliers: {
    en: 'Chandeliers',
    hi: 'झूमर',
    subtitleEn: 'K9 crystal & grand hall tiers',
    subtitleHi: 'क्रिस्टल और भव्य लिविंग रूम झूमर',
  },
  'wall-lights': {
    en: 'Wall Lights',
    hi: 'वॉल लाइट्स',
    subtitleEn: 'Brushed brass & alabaster sconces',
    subtitleHi: 'ब्रास और मार्बल दीवार लाइट्स',
  },
  'home-decor': {
    en: 'Home Decor',
    hi: 'होम डेकोर',
    subtitleEn: 'Sculptures, vases & console accents',
    subtitleHi: 'मूर्तियाँ, वास और टेबल डेकोर',
  },
  'wall-clocks': {
    en: 'Wall Clocks',
    hi: 'दीवार घड़ियाँ',
    subtitleEn: 'Silent-sweep architectural timepieces',
    subtitleHi: 'आधुनिक गोल्ड और मेटल घड़ियाँ',
  },
  'gifts-more': {
    en: 'Gifts & More',
    hi: 'गिफ्ट्स और अन्य',
    subtitleEn: 'Table lamps, lanterns & gift sets',
    subtitleHi: 'टेबल लैंप, लालटेन और उपहार सेट',
  },
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, { en: string; hi: string }> = {
  Pending: { en: 'Pending', hi: 'प्रतीक्षारत' },
  Confirmed: { en: 'Confirmed', hi: 'कन्फर्म हो गया' },
  Packed: { en: 'Packed', hi: 'पैक हो गया' },
  'Out for Delivery': { en: 'Out for Delivery', hi: 'डिलीवरी के लिए निकला' },
  Delivered: { en: 'Delivered', hi: 'डिलीवर हो गया' },
  Cancelled: { en: 'Cancelled', hi: 'रद्द किया गया' },
};

export const UI_COPY: Record<Language, {
  nav: {
    home: string;
    catalog: string;
    trackOrder: string;
    contact: string;
    admin: string;
    bag: string;
  };
  hero: {
    eyebrow: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  home: {
    searchPlaceholder: string;
    allCategories: string;
    popularCategories: string;
    categoriesSubtitle: string;
    featuredProducts: string;
    featuredSubtitle: string;
    latestArrivals: string;
    latestSubtitle: string;
    viewAll: string;
    noSearchMatches: string;
    clearSearch: string;
    showroomTitle: string;
    showroomBody: string;
    visitShowroom: string;
  };
  product: {
    inStock: string;
    lowStock: string;
    outOfStock: string;
    addToCart: string;
    added: string;
    selectSize: string;
    selectColor: string;
    quantity: string;
    backToShop: string;
    sku: string;
    codAvailable: string;
    safePackaging: string;
    viewDetails: string;
    quickAdd: string;
    featuredTag: string;
    newTag: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterFeatured: string;
    filterLatest: string;
    filterInStock: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    itemsFound: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    browseCollection: string;
    subtotal: string;
    delivery: string;
    free: string;
    freeShippingNote: string;
    total: string;
    proceedCheckout: string;
    remove: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    customerName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes: string;
    notesPlaceholder: string;
    paymentTitle: string;
    codTitle: string;
    codDesc: string;
    orderSummary: string;
    placeOrder: string;
    validationError: string;
    backToCatalog: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    orderNumber: string;
    paymentMethod: string;
    codLabel: string;
    deliveryTo: string;
    itemsOrdered: string;
    trackThisOrder: string;
    continueShopping: string;
  };
  tracking: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    recentOrders: string;
    noOrderFound: string;
    placedOn: string;
    orderTotal: string;
    deliveryAddress: string;
    statusTimeline: string;
  };
  contact: {
    title: string;
    subtitle: string;
    addressLabel: string;
    hoursLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    callNow: string;
    chatWhatsapp: string;
    openMap: string;
    editPlaceholderBtn: string;
    saveDetailsBtn: string;
    cancelEditBtn: string;
    savedToast: string;
    editableHint: string;
  };
  admin: {
    title: string;
    subtitle: string;
    tabProducts: string;
    tabOrders: string;
    tabSettings: string;
    addProduct: string;
    editProduct: string;
    deleteProduct: string;
    confirmDelete: string;
    saveProduct: string;
    cancel: string;
    productNameEn: string;
    productNameHi: string;
    category: string;
    price: string;
    originalPrice: string;
    stock: string;
    sizes: string;
    descriptionEn: string;
    descriptionHi: string;
    imageSelect: string;
    featuredFlag: string;
    latestFlag: string;
    ordersCount: string;
    updateStatus: string;
    saveSettings: string;
    resetDemo: string;
    settingsSaved: string;
    shopNameLabel: string;
    taglineEnLabel: string;
    taglineHiLabel: string;
    promoEnLabel: string;
    promoHiLabel: string;
    deliveryChargeLabel: string;
    freeThresholdLabel: string;
  };
  footer: {
    rights: string;
    quickLinks: string;
    visitUs: string;
  };
}> = {
  en: {
    nav: {
      home: 'Home',
      catalog: 'Collection',
      trackOrder: 'Track Order',
      contact: 'Contact',
      admin: 'Admin',
      bag: 'Bag',
    },
    hero: {
      eyebrow: 'Signature Lighting & Architectural Decor',
      ctaPrimary: 'Explore Collection',
      ctaSecondary: 'Visit Showroom',
    },
    home: {
      searchPlaceholder: 'Search chandeliers, wall lights, clocks, decor...',
      allCategories: 'All',
      popularCategories: 'Popular Categories',
      categoriesSubtitle: 'Curated lighting fixtures and statement accents for modern Indian homes.',
      featuredProducts: 'Featured Collection',
      featuredSubtitle: 'Handpicked centrepieces finished in brushed brass, crystal, and warm obsidian.',
      latestArrivals: 'Latest Arrivals',
      latestSubtitle: 'Newly added designs just unboxed at the Yasmin showroom.',
      viewAll: 'View All',
      noSearchMatches: 'No matching lighting or decor items found.',
      clearSearch: 'Clear Search',
      showroomTitle: 'Experience Warm Gold Illumination in Person',
      showroomBody: 'Every piece at Yasmin Lights & Home Decor is selected for warm 2700K–3000K ambience, enduring brass finishes, and timeless home styling.',
      visitShowroom: 'Showroom & Timings',
    },
    product: {
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      addToCart: 'Add to Cart',
      added: 'Added to Bag',
      selectSize: 'Select Size / Dimension',
      selectColor: 'Select Finish / Colour',
      quantity: 'Quantity',
      backToShop: 'Back to Collection',
      sku: 'Model Code',
      codAvailable: 'Cash on Delivery available',
      safePackaging: 'Breakage-safe foam & crate packaging',
      viewDetails: 'View Details',
      quickAdd: 'Add',
      featuredTag: 'Featured',
      newTag: 'New Arrival',
    },
    catalog: {
      title: 'Complete Collection',
      subtitle: 'Filter by category, availability, or sort to find the ideal piece for your space.',
      filterAll: 'All Items',
      filterFeatured: 'Featured',
      filterLatest: 'Latest Arrivals',
      filterInStock: 'In Stock Only',
      sortFeatured: 'Sort: Curated',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      itemsFound: 'items',
    },
    cart: {
      title: 'Your Shopping Bag',
      emptyTitle: 'Your bag is currently empty',
      emptyBody: 'Explore chandeliers, fancy lights, wall clocks, and curated home accents.',
      browseCollection: 'Browse Collection',
      subtotal: 'Subtotal',
      delivery: 'Delivery Charges',
      free: 'Free',
      freeShippingNote: 'Free delivery on orders of',
      total: 'Estimated Total',
      proceedCheckout: 'Proceed to Checkout',
      remove: 'Remove',
    },
    checkout: {
      title: 'Checkout & Delivery',
      subtitle: 'Simple Cash on Delivery checkout — verify your address and phone number.',
      customerName: 'Full Name',
      phone: 'Mobile Number (10 digits)',
      address: 'Complete Delivery Address (House No., Street, Area)',
      city: 'City / Town',
      pincode: 'Pincode',
      notes: 'Landmark / Delivery Instructions (Optional)',
      notesPlaceholder: 'e.g., Near City Centre, call before arrival',
      paymentTitle: 'Payment Method',
      codTitle: 'Cash on Delivery (COD)',
      codDesc: 'Pay in cash or UPI directly when your order arrives safely at your doorstep.',
      orderSummary: 'Order Summary',
      placeOrder: 'Confirm COD Order',
      validationError: 'Please enter your name, valid 10-digit phone number, address, city, and 6-digit pincode.',
      backToCatalog: 'Continue Shopping',
    },
    confirmation: {
      title: 'Order Confirmed',
      subtitle: 'Thank you for choosing Yasmin Lights & Home Decor. Our team is preparing your items.',
      orderNumber: 'Order ID',
      paymentMethod: 'Payment Mode',
      codLabel: 'Cash on Delivery',
      deliveryTo: 'Delivering To',
      itemsOrdered: 'Items Summary',
      trackThisOrder: 'Track Order Status',
      continueShopping: 'Continue Shopping',
    },
    tracking: {
      title: 'Track Your Order',
      subtitle: 'Enter your Order ID (e.g. YL-1042) or registered mobile number to check live progress.',
      searchPlaceholder: 'Enter Order ID or Mobile Number...',
      searchButton: 'Check Status',
      recentOrders: 'Recent Orders',
      noOrderFound: 'No matching order found. Please verify your Order ID or phone number.',
      placedOn: 'Placed on',
      orderTotal: 'Total Payable (COD)',
      deliveryAddress: 'Delivery Address',
      statusTimeline: 'Order Progress',
    },
    contact: {
      title: 'Visit Our Showroom',
      subtitle: 'Reach out on WhatsApp, call for custom lighting advice, or visit us in person.',
      addressLabel: 'Showroom Address',
      hoursLabel: 'Opening Hours',
      phoneLabel: 'Phone Number',
      whatsappLabel: 'WhatsApp Desk',
      callNow: 'Call Showroom',
      chatWhatsapp: 'Chat on WhatsApp',
      openMap: 'Open in Google Maps',
      editPlaceholderBtn: 'Edit Placeholder Details',
      saveDetailsBtn: 'Save Shop Details',
      cancelEditBtn: 'Cancel',
      savedToast: 'Shop details updated successfully.',
      editableHint: 'Placeholder showroom details are pre-filled and can be customized here or in the Admin Panel.',
    },
    admin: {
      title: 'Store Admin Panel',
      subtitle: 'Manage products, update prices and stock, track customer orders, and customize shop details.',
      tabProducts: 'Products',
      tabOrders: 'Orders',
      tabSettings: 'Shop Details',
      addProduct: 'Add New Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete',
      confirmDelete: 'Confirm Delete?',
      saveProduct: 'Save Product',
      cancel: 'Cancel',
      productNameEn: 'Product Name (English)',
      productNameHi: 'Product Name (Hindi)',
      category: 'Category',
      price: 'Selling Price (₹)',
      originalPrice: 'MRP / Original Price (₹, optional)',
      stock: 'Available Stock',
      sizes: 'Available Sizes (comma separated)',
      descriptionEn: 'Description (English)',
      descriptionHi: 'Description (Hindi)',
      imageSelect: 'Product Photography',
      featuredFlag: 'Show in Featured',
      latestFlag: 'Show in Latest Arrivals',
      ordersCount: 'Total Orders',
      updateStatus: 'Order Status',
      saveSettings: 'Save Shop Details',
      resetDemo: 'Reset Sample Data',
      settingsSaved: 'Shop settings saved.',
      shopNameLabel: 'Brand / Shop Name',
      taglineEnLabel: 'Tagline (English)',
      taglineHiLabel: 'Tagline (Hindi)',
      promoEnLabel: 'Promo Banner (English)',
      promoHiLabel: 'Promo Banner (Hindi)',
      deliveryChargeLabel: 'Standard Delivery Charge (₹)',
      freeThresholdLabel: 'Free Delivery Above (₹)',
    },
    footer: {
      rights: 'All rights reserved.',
      quickLinks: 'Navigation',
      visitUs: 'Showroom & Hours',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      catalog: 'कलेक्शन',
      trackOrder: 'ऑर्डर ट्रैक',
      contact: 'संपर्क',
      admin: 'एडमिन',
      bag: 'बैग',
    },
    hero: {
      eyebrow: 'प्रीमियम लाइटिंग और होम डेकोर बुटीक',
      ctaPrimary: 'कलेक्शन देखें',
      ctaSecondary: 'शोरूम जानकारी',
    },
    home: {
      searchPlaceholder: 'झूमर, वॉल लाइट्स, घड़ियाँ या डेकोर खोजें...',
      allCategories: 'सभी',
      popularCategories: 'लोकप्रिय श्रेणियाँ',
      categoriesSubtitle: 'आपके आधुनिक घर के लिए चुनिंदा लाइटिंग और सजावटी कलेक्शन।',
      featuredProducts: 'विशेष कलेक्शन',
      featuredSubtitle: 'ब्रश्ड ब्रास, क्रिस्टल और वार्म गोल्ड फिनिश में हमारे खास डिज़ाइन।',
      latestArrivals: 'नए आगमन',
      latestSubtitle: 'यास्मीन शोरूम में आए बिल्कुल नए और आधुनिक डिज़ाइन।',
      viewAll: 'सभी देखें',
      noSearchMatches: 'आपकी खोज से मिलता कोई प्रोडक्ट नहीं मिला।',
      clearSearch: 'खोज साफ़ करें',
      showroomTitle: 'वार्म गोल्ड लाइटिंग का अनुभव हमारे शोरूम में करें',
      showroomBody: 'यास्मीन लाइट्स एंड होम डेकोर का हर उत्पाद आपके घर को सुंदर, गर्मजोश और प्रीमियम लुक देने के लिए चुना गया है।',
      visitShowroom: 'शोरूम का पता और समय',
    },
    product: {
      inStock: 'स्टॉक में उपलब्ध',
      lowStock: 'सीमित स्टॉक',
      outOfStock: 'स्टॉक समाप्त',
      addToCart: 'कार्ट में जोड़ें',
      added: 'बैग में जोड़ा गया',
      selectSize: 'साइज चुनें',
      selectColor: 'रंग / फिनिश चुनें',
      quantity: 'मात्रा',
      backToShop: 'कलेक्शन पर वापस जाएं',
      sku: 'मॉडल कोड',
      codAvailable: 'कैश ऑन डिलीवरी उपलब्ध',
      safePackaging: 'सुरक्षित और मजबूत पैकेजिंग',
      viewDetails: 'विवरण देखें',
      quickAdd: 'जोड़ें',
      featuredTag: 'विशेष',
      newTag: 'नया',
    },
    catalog: {
      title: 'पूरा कलेक्शन',
      subtitle: 'अपनी पसंद की श्रेणी, स्टॉक और कीमत के अनुसार आसानी से चुनें।',
      filterAll: 'सभी उत्पाद',
      filterFeatured: 'विशेष उत्पाद',
      filterLatest: 'नए आगमन',
      filterInStock: 'केवल उपलब्ध स्टॉक',
      sortFeatured: 'क्रम: चुनिंदा',
      sortPriceAsc: 'कीमत: कम से ज्यादा',
      sortPriceDesc: 'कीमत: ज्यादा से कम',
      itemsFound: 'उत्पाद',
    },
    cart: {
      title: 'आपका शॉपिंग बैग',
      emptyTitle: 'आपका बैग अभी खाली है',
      emptyBody: 'झूमर, फैंसी लाइट्स, दीवार घड़ियाँ और सुंदर होम डेकोर देखें।',
      browseCollection: 'कलेक्शन देखें',
      subtotal: 'कुल कीमत',
      delivery: 'डिलीवरी शुल्क',
      free: 'मुफ़्त',
      freeShippingNote: 'मुफ़्त डिलीवरी इस राशि से ऊपर:',
      total: 'कुल देय राशि',
      proceedCheckout: 'चेकआउट पर जाएं',
      remove: 'हटाएं',
    },
    checkout: {
      title: 'डिलीवरी और चेकआउट',
      subtitle: 'आसान कैश ऑन डिलीवरी ऑर्डर — कृपया अपना पता और मोबाइल नंबर दर्ज करें।',
      customerName: 'पूरा नाम',
      phone: 'मोबाइल नंबर (10 अंक)',
      address: 'पूरा पता (मकान नंबर, गली, इलाका)',
      city: 'शहर / कस्बा',
      pincode: 'पिनकोड',
      notes: 'लैंडमार्क / डिलीवरी निर्देश (वैकल्पिक)',
      notesPlaceholder: 'जैसे: मुख्य बाज़ार के पास, आने से पहले कॉल करें',
      paymentTitle: 'भुगतान का तरीका',
      codTitle: 'कैश ऑन डिलीवरी (COD)',
      codDesc: 'ऑर्डर आपके घर सुरक्षित पहुंचने पर नकद या UPI से भुगतान करें।',
      orderSummary: 'ऑर्डर सारांश',
      placeOrder: 'ऑर्डर कन्फर्म करें',
      validationError: 'कृपया सही नाम, 10 अंकों का मोबाइल नंबर, पूरा पता, शहर और 6 अंकों का पिनकोड भरें।',
      backToCatalog: 'शॉपिंग जारी रखें',
    },
    confirmation: {
      title: 'आपका ऑर्डर कन्फर्म हो गया है',
      subtitle: 'यास्मीन लाइट्स एंड होम डेकोर को चुनने के लिए धन्यवाद। हमारी टीम आपका ऑर्डर तैयार कर रही है।',
      orderNumber: 'ऑर्डर नंबर',
      paymentMethod: 'भुगतान माध्यम',
      codLabel: 'कैश ऑन डिलीवरी',
      deliveryTo: 'डिलीवरी का पता',
      itemsOrdered: 'ऑर्डर किए गए आइटम',
      trackThisOrder: 'ऑर्डर की स्थिति देखें',
      continueShopping: 'शॉपिंग जारी रखें',
    },
    tracking: {
      title: 'अपना ऑर्डर ट्रैक करें',
      subtitle: 'ऑर्डर की ताज़ा स्थिति देखने के लिए ऑर्डर नंबर (जैसे YL-1042) या मोबाइल नंबर दर्ज करें।',
      searchPlaceholder: 'ऑर्डर नंबर या मोबाइल नंबर लिखें...',
      searchButton: 'स्थिति देखें',
      recentOrders: 'हाल के ऑर्डर',
      noOrderFound: 'कोई ऑर्डर नहीं मिला। कृपया ऑर्डर नंबर या मोबाइल नंबर दोबारा जांचें।',
      placedOn: 'ऑर्डर दिनांक',
      orderTotal: 'कुल राशि (COD)',
      deliveryAddress: 'डिलीवरी पता',
      statusTimeline: 'ऑर्डर प्रगति',
    },
    contact: {
      title: 'हमारे शोरूम पर आएं',
      subtitle: 'किसी भी उत्पाद की जानकारी या कस्टम ऑर्डर के लिए कॉल या व्हाट्सएप करें।',
      addressLabel: 'शोरूम का पता',
      hoursLabel: 'खुलने का समय',
      phoneLabel: 'फ़ोन नंबर',
      whatsappLabel: 'व्हाट्सएप संपर्क',
      callNow: 'कॉल करें',
      chatWhatsapp: 'व्हाट्सएप पर बात करें',
      openMap: 'Google Maps पर देखें',
      editPlaceholderBtn: 'दुकान की जानकारी बदलें',
      saveDetailsBtn: 'जानकारी सेव करें',
      cancelEditBtn: 'रद्द करें',
      savedToast: 'दुकान की जानकारी अपडेट हो गई है।',
      editableHint: 'यहाँ दी गई प्लेसहोल्डर जानकारी को आप यहीं या एडमिन पैनल से कभी भी बदल सकते हैं।',
    },
    admin: {
      title: 'एडमिन पैनल',
      subtitle: 'प्रोडक्ट्स जोड़ें या बदलें, कीमत और स्टॉक अपडेट करें, और ग्राहकों के ऑर्डर संभालें।',
      tabProducts: 'प्रोडक्ट्स',
      tabOrders: 'ऑर्डर्स',
      tabSettings: 'दुकान की जानकारी',
      addProduct: 'नया प्रोडक्ट जोड़ें',
      editProduct: 'प्रोडक्ट बदलें',
      deleteProduct: 'हटाएं',
      confirmDelete: 'पक्का हटाएं?',
      saveProduct: 'प्रोडक्ट सेव करें',
      cancel: 'रद्द करें',
      productNameEn: 'प्रोडक्ट का नाम (English)',
      productNameHi: 'प्रोडक्ट का नाम (हिन्दी)',
      category: 'श्रेणी',
      price: 'बिक्री मूल्य (₹)',
      originalPrice: 'अधिकतम मूल्य / MRP (₹, वैकल्पिक)',
      stock: 'उपलब्ध स्टॉक',
      sizes: 'उपलब्ध साइज (कॉमा से अलग लिखें)',
      descriptionEn: 'विवरण (English)',
      descriptionHi: 'विवरण (हिन्दी)',
      imageSelect: 'प्रोडक्ट की तस्वीर चुनें',
      featuredFlag: 'विशेष कलेक्शन में दिखाएं',
      latestFlag: 'नए आगमन में दिखाएं',
      ordersCount: 'कुल ऑर्डर',
      updateStatus: 'ऑर्डर स्थिति',
      saveSettings: 'दुकान जानकारी सेव करें',
      resetDemo: 'सैंपल डेटा रीसेट करें',
      settingsSaved: 'दुकान की जानकारी सेव हो गई।',
      shopNameLabel: 'दुकान / ब्रांड का नाम',
      taglineEnLabel: 'टैगलाइन (English)',
      taglineHiLabel: 'टैगलाइन (हिन्दी)',
      promoEnLabel: 'प्रमोशनल बैनर (English)',
      promoHiLabel: 'प्रमोशनल बैनर (हिन्दी)',
      deliveryChargeLabel: 'डिलीवरी शुल्क (₹)',
      freeThresholdLabel: 'मुफ़्त डिलीवरी सीमा (₹)',
    },
    footer: {
      rights: 'सर्वाधिकार सुरक्षित।',
      quickLinks: 'त्वरित लिंक',
      visitUs: 'शोरूम पता और समय',
    },
  },
};
