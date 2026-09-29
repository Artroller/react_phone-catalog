import type { Category, Product } from './types';

type RawListProduct = {
  id: string | number;
  category: Category;
  itemId?: string;
  name: string;
  fullPrice: number;
  price: number;
  screen?: string;
  capacity?: string;
  color?: string;
  ram?: string;
  year: number;
  image?: string;
};

type DescriptionBlock = {
  title: string;
  text: string[];
};

type RawDetailedProduct = {
  id: string;
  category: Category;
  namespaceId: string;
  name: string;

  capacityAvailable: string[];
  capacity: string;

  priceRegular: number;
  priceDiscount: number;

  colorsAvailable: string[];
  color: string;

  images: string[];

  description: DescriptionBlock[];

  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera: string;
  zoom: string;
  cell: string[];
};

const API_BASE = import.meta.env.BASE_URL;

const getApiUrl = (path: string) => {
  return `${API_BASE}api/${path}`;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(getApiUrl(path));

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json() as Promise<T>;
}

const getListProducts = () => {
  return getJson<RawListProduct[]>('products.json');
};

const getCategoryProducts = (category: Category) => {
  return getJson<RawDetailedProduct[]>(`${category}.json`);
};

const createDescription = (blocks: DescriptionBlock[]) => {
  return blocks
    .map(block => {
      const text = block.text.join(' ');

      return `${block.title}\n${text}`;
    })
    .join('\n\n');
};

const normalizeProduct = (
  product: RawDetailedProduct,
  listProduct?: RawListProduct,
): Product => {
  return {
    id: product.id,
    category: product.category,
    namespaceId: product.namespaceId,

    name: product.name,

    priceRegular: product.priceRegular ?? listProduct?.fullPrice ?? 0,

    priceDiscount: product.priceDiscount ?? listProduct?.price ?? 0,

    year: listProduct?.year ?? 0,

    capacity: product.capacity,
    capacityAvailable: product.capacityAvailable,

    color: product.color,
    colorsAvailable: product.colorsAvailable,

    images: product.images,

    description: createDescription(product.description),

    screen: product.screen,
    resolution: product.resolution,
    processor: product.processor,
    ram: product.ram,
    camera: product.camera,
    zoom: product.zoom,
    cell: product.cell,
  };
};

export async function getProducts(): Promise<Product[]> {
  const [listProducts, phones, tablets, accessories] = await Promise.all([
    getListProducts(),
    getCategoryProducts('phones'),
    getCategoryProducts('tablets'),
    getCategoryProducts('accessories'),
  ]);

  const detailedProducts = [...phones, ...tablets, ...accessories];

  return detailedProducts.map(product => {
    const listProduct = listProducts.find(item => item.name === product.name);

    return normalizeProduct(product, listProduct);
  });
}

export async function getProductsByCategory(
  category: Category,
): Promise<Product[]> {
  const [listProducts, detailedProducts] = await Promise.all([
    getListProducts(),
    getCategoryProducts(category),
  ]);

  return detailedProducts.map(product => {
    const listProduct = listProducts.find(item => item.name === product.name);

    return normalizeProduct(product, listProduct);
  });
}

export async function getProductById(
  productId: string,
): Promise<Product | null> {
  const products = await getProducts();

  return products.find(product => product.id === productId) || null;
}

export async function getSuggestedProducts(
  currentProductId: string,
): Promise<Product[]> {
  const products = await getProducts();

  return products
    .filter(product => product.id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}
