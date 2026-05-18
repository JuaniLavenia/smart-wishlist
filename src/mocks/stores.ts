export interface Store {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
}

export interface PriceResult {
  id: string;
  storeId: string;
  storeName: string;
  productName: string;
  price: number;
  originalPrice?: number;
  url: string;
  freeShipping: boolean;
  interestFree: boolean;
  installments?: number;
  inStock: boolean;
}

export const mockStores: Store[] = [
  {
    id: "mercadolibre",
    name: "Mercadolibre.com.ar",
    logo: "https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/7.28.0/mercadolibre/logo_large_plus@2x.webp",
    enabled: true,
  },
  {
    id: "fravega",
    name: "Fravega",
    logo: "https://www.fravega.com/static/manifest/icons/icon-192x192.png",
    enabled: true,
  },
  {
    id: "cetrogar",
    name: "Cetrogar",
    logo: "https://cetrogar.vtexassets.com/assets/vtex.file-manager-graphql/images/0195a44a-31d8-4925-871c-789c757786f6___2404c1d24902b87e4473b04ee66907a9.svg?width=320&aspect=true&quality=8",
    enabled: true,
  },
  {
    id: "oncity",
    name: "On City",
    logo: "https://www.oncity.com.ar/favicon.ico",
    enabled: true,
  },
  {
    id: "megatone",
    name: "Megatone",
    logo: "https://www.megatone.com.ar/img/logo-megatone.png",
    enabled: true,
  },
  {
    id: "whirlpool",
    name: "Whirlpool",
    logo: "https://www.whirlpool.com.ar/favicon.ico",
    enabled: true,
  },
];

// Generate mock price results for a product search
export function generateMockPrices(query: string): PriceResult[] {
  const basePrice = Math.random() * 50000 + 5000;

  return mockStores.map((store, index) => {
    const variance = (Math.random() - 0.5) * 0.3; // -15% to +15%
    const price = Math.round(basePrice * (1 + variance));

    return {
      id: `${store.id}-${Date.now()}-${index}`,
      storeId: store.id,
      storeName: store.name,
      productName: query,
      price,
      originalPrice: Math.random() > 0.7 ? Math.round(price * 1.2) : undefined,
      url: `https://${store.id}.com/search?q=${encodeURIComponent(query)}`,
      freeShipping: Math.random() > 0.5,
      interestFree: Math.random() > 0.6,
      installments:
        Math.random() > 0.5 ? Math.floor(Math.random() * 12) + 3 : undefined,
      inStock: Math.random() > 0.1,
    };
  });
}
