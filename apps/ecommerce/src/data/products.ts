import { Product } from "../store/useCartStore";

export const ALL_PRODUCTS: Product[] = [
  // ── CLOTHING ──────────────────────────────────────────────
  {
    id: "1",
    name: "Silk Evening Gown",
    price: 1200,
    image: "https://images.uzum.uz/d361bjfiub30vbrugdhg/original.jpg",
    category: "Clothing",
  },
  {
    id: "2",
    name: "Velvet Blazer",
    price: 950,
    image:
      "https://www.shophijabheaven.com/cdn/shop/files/050A5148r.png?v=1752179280&width=3840",
    category: "Clothing",
  },
  {
    id: "3",
    name: "Classic White Shirt",
    price: 480,
    image:
      "https://www.niswafashion.com/cdn/shop/files/209A9685.jpg?v=1773425459&width=1100",
    category: "Clothing",
  },
  {
    id: "4",
    name: "Ivory Knit Cape",
    price: 620,
    image:
      "https://hayacollections.pk/storage/2025/09/blue-butterfly-abaya-min.webp",
    category: "Clothing",
  },

  // ── BAGS ──────────────────────────────────────────────────
  {
    id: "5",
    name: "Structured Leather Tote",
    price: 850,
    image: "https://static-01.daraz.pk/p/49ec14b6e3d157eb302b2e98ed796c50.jpg",
    category: "Bags",
  },
  {
    id: "6",
    name: "Gold-Chain Shoulder Bag",
    price: 1200,
    image:
      "https://img.drz.lazcdn.com/static/pk/p/c6a877253537c322808bf8e74f286485.jpg_960x960q80.jpg_.webp",
    category: "Bags",
  },
  {
    id: "7",
    name: "Suede Crossbody",
    price: 680,
    image:
      "https://bellahijabs.com/cdn/shop/files/Myproject-13_1024x1024.png?v=1709490531",
    category: "Bags",
  },
  {
    id: "8",
    name: "Mini Leather Clutch",
    price: 450,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQASVPd0wZb9-qfk7YzHOwMTcyMkcXz5TRgN5xJOq_AKw&s",
    category: "Bags",
  },

  // ── SHOES ─────────────────────────────────────────────────
  {
    id: "9",
    name: "Nude Stilettos",
    price: 600,
    image:
      "https://www.niswafashion.com/cdn/shop/files/209A9452.jpg?v=1773203302&width=1100",
    category: "Clothing",
  },
  {
    id: "10",
    name: "Leather Ankle Boots",
    price: 750,
    image:
      "https://www.niswafashion.com/cdn/shop/files/209A9400.jpg?v=1773203393&width=1100",
    category: "Clothing",
  },
  {
    id: "11",
    name: "Platform Mules",
    price: 520,
    image:
      "https://www.mishah.co.za/cdn/shop/files/IMG_6657_2_1024x1024@2x.jpg?v=1741601107",
    category: "Clothing",
  },
  {
    id: "12",
    name: "Strappy Block Heels",
    price: 480,
    image:
      "https://i.etsystatic.com/57719709/r/il/d323fb/6850771270/il_570xN.6850771270_fz6l.jpg",
    category: "Clothing",
  },

  // ── JEWELRY ───────────────────────────────────────────────
  {
    id: "13",
    name: "Diamond Drop Earrings",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
    category: "Jewelry",
  },
  {
    id: "14",
    name: "Gold Cuff Bracelet",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
    category: "Jewelry",
  },
  {
    id: "15",
    name: "Pearl Strand Necklace",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1974&auto=format&fit=crop",
    category: "Jewelry",
  },
  {
    id: "16",
    name: "Diamond Pavé Ring",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1974&auto=format&fit=crop",
    category: "Jewelry",
  },

  // ── OUTERWEAR ─────────────────────────────────────────────
  {
    id: "17",
    name: "Camel Wool Overcoat",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1974&auto=format&fit=crop",
    category: "Outerwear",
  },
  {
    id: "18",
    name: "Cashmere Belted Coat",
    price: 1800,
    image:
      "https://tolavita.com/cdn/shop/files/BlackPaisleyModestMaxiDress_RelaxedFitLongSleeveDressforWomen_1.jpg?v=1771239162&width=3840",
    category: "Outerwear",
  },
  {
    id: "19",
    name: "Leather Trench Coat",
    price: 1350,
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1974&auto=format&fit=crop",
    category: "Outerwear",
  },
  {
    id: "20",
    name: "Structured Blazer",
    price: 1100,
    image:
      "https://assets0.mirraw.com/images/12702828/TEAL1_zoom.jpg?1721890270",
    category: "Outerwear",
  },
];

// Featured — one from each category for homepage showcase
export const FEATURED_PRODUCTS: Product[] = [
  ALL_PRODUCTS[0], // Silk Evening Gown
  ALL_PRODUCTS[4], // Structured Leather Tote
  ALL_PRODUCTS[8], // Nude Stilettos
  ALL_PRODUCTS[12], // Diamond Drop Earrings
  ALL_PRODUCTS[16], // Camel Wool Overcoat
  ALL_PRODUCTS[1], // Velvet Blazer
  ALL_PRODUCTS[5], // Gold-Chain Shoulder Bag
  ALL_PRODUCTS[9], // Leather Ankle Boots
];
