import type { Category, Product } from './types';

type RawProduct = {
  id: string | number;
  category?: Category;
  type?: Category;
  name?: string;
  title?: string;
  priceRegular?: number;
  fullPrice?: number;
  price?: number;
  priceDiscount?: number;
  year?: number;
  capacity?: string;
  capacityAvailable?: string[];
  color?: string;
  colorsAvailable?: string[];
  images?: string[];
  image?: string;
  description?: string;
  screen?: string;
  resolution?: string;
  processor?: string;
  ram?: string;
  camera?: string;
  zoom?: string;
  cell?: string[];
};

const API_URL = import.meta.env.DEV
  ? '/api/products.json'
  : '/react_phone-catalog/api/products.json';

const normalizeImage = (image: string) => {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return image.replace(/^\/+/, '');
};

const normalizeProduct = (raw: RawProduct): Product => {
  const regularPrice = raw.priceRegular ?? raw.fullPrice ?? raw.price ?? 0;

  const discountPrice = raw.priceDiscount ?? raw.price ?? regularPrice;

  const images =
    Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : raw.image
        ? [raw.image]
        : [];

  return {
    id: String(raw.id),
    category: raw.category ?? raw.type ?? 'phones',
    name: raw.name ?? raw.title ?? 'Product',
    priceRegular: regularPrice,
    priceDiscount: discountPrice,
    year: raw.year ?? 0,
    capacity: raw.capacity ?? '',
    capacityAvailable: raw.capacityAvailable ?? [],
    color: raw.color ?? '',
    colorsAvailable: raw.colorsAvailable ?? [],
    images: images.map(normalizeImage),
    description: raw.description ?? '',
    screen: raw.screen ?? '',
    resolution: raw.resolution ?? '',
    processor: raw.processor ?? '',
    ram: raw.ram ?? '',
    camera: raw.camera ?? '',
    zoom: raw.zoom ?? '',
    cell: raw.cell ?? [],
  };
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Unable to load products: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Products API returned invalid data');
  }

  return data.map(product => normalizeProduct(product as RawProduct));
}

export async function getProductsByCategory(
  category: Category,
): Promise<Product[]> {
  const allProducts = await getProducts();

  return allProducts.filter(product => product.category === category);
}

export async function getProductById(
  productId: string,
): Promise<Product | null> {
  const allProducts = await getProducts();

  return allProducts.find(product => product.id === productId) || null;
}

export async function getSuggestedProducts(
  currentProductId: string,
): Promise<Product[]> {
  const allProducts = await getProducts();

  return allProducts
    .filter(product => product.id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}
