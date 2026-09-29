import { useEffect, useState } from 'react';

import {
  getProductById,
  getProductVariant,
  getSuggestedProducts,
} from '../../shared/api';
import { getAssetUrl } from '../../shared/asset';
import { useShop } from '../../shared/context/ShopContext';

import type { Product } from '../../shared/types';

import Breadcrumbs from '../../components/Breadcrumbs';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import ProductsSlider from '../../components/ProductsSlider';

import styles from './ProductDetails.module.scss';

type Props = {
  productId: string;
  navigate: (to: string) => void;
};

const categoryNames = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

export default function ProductDetails({ productId, navigate }: Props) {
  const { addToCart, removeFromCart, isInCart, toggleFavorite, isFavorite } =
    useShop();

  const [product, setProduct] = useState<Product | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);

  const [suggested, setSuggested] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [capacity, setCapacity] = useState('');

  const [color, setColor] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);

    Promise.all([getProductById(productId), getSuggestedProducts(productId)])
      .then(([current, recommendations]) => {
        setProduct(current);
        setSelectedVariant(current);
        setSuggested(recommendations);

        if (current) {
          setCapacity(current.capacity);

          setColor(current.color);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!product || !capacity || !color) {
      return;
    }

    getProductVariant(
      product.namespaceId,
      product.category,
      capacity,
      color,
    ).then(variant => {
      if (variant) {
        setSelectedVariant(variant);
        setSelectedImage(0);
      }
    });
  }, [product, capacity, color]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <EmptyState
        text="Product was not found"
        action="Back to home"
        onAction={() => navigate('/')}
      />
    );
  }

  const displayedProduct = selectedVariant || product;

  const inCart = isInCart(product.id);
  const favorite = isFavorite(product.id);

  const currentPrice = displayedProduct.priceRegular;

  const handleCartClick = () => {
    if (inCart) {
      removeFromCart(product.id);

      return;
    }

    addToCart({
      ...displayedProduct,
      id: product.id,
      name: product.name,
      category: product.category,
      namespaceId: product.namespaceId,
      year: product.year,
      capacity,
      color,
      priceRegular: currentPrice,
      priceDiscount: currentPrice,
    });
  };

  const handleCapacityChange = (value: string) => {
    setCapacity(value);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
  };

  return (
    <section className={styles.page}>
      <Breadcrumbs
        items={[
          {
            label: 'Home',
            onClick: () => navigate('/'),
          },
          {
            label: categoryNames[product.category],
            onClick: () => navigate(`/${product.category}`),
          },
          {
            label: product.name,
          },
        ]}
      />

      <button
        className={styles.back}
        type="button"
        onClick={() => window.history.back()}
      >
        ← Back
      </button>

      <div className={styles.details}>
        <div>
          <div className={styles.mainImage}>
            <img
              src={getAssetUrl(displayedProduct.images[selectedImage])}
              alt={displayedProduct.name}
            />
          </div>

          <div className={styles.thumbs}>
            {displayedProduct.images.map((image, index) => (
              <button
                type="button"
                key={image}
                className={
                  index === selectedImage ? styles.thumbActive : styles.thumb
                }
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={getAssetUrl(image)}
                  alt={`${displayedProduct.name} ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <h1>{product.name}</h1>

          <div className={styles.price}>
            <strong>${currentPrice}</strong>
          </div>

          <div className={styles.option}>
            <strong>Capacity: {capacity}</strong>

            <div className={styles.radioRow}>
              {product.capacityAvailable.map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="capacity"
                    checked={capacity === value}
                    onChange={() => handleCapacityChange(value)}
                  />

                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.option}>
            <strong>Color: {color}</strong>

            <div className={styles.radioRow}>
              {product.colorsAvailable.map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="color"
                    checked={color === value}
                    onChange={() => handleColorChange(value)}
                  />

                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.cartButton} ${
                inCart ? styles.cartButtonAdded : ''
              }`}
              onClick={handleCartClick}
            >
              {inCart ? 'Added to cart' : 'Add to cart'}
            </button>

            <button
              type="button"
              className={favorite ? styles.favoriteActive : styles.favorite}
              onClick={() => toggleFavorite(product.id)}
            >
              {favorite ? '♥' : '♡'}
            </button>
          </div>

          <div className={styles.specs}>
            <div>
              <span>Screen</span>
              <b>{displayedProduct.screen}</b>
            </div>

            <div>
              <span>Resolution</span>
              <b>{displayedProduct.resolution}</b>
            </div>

            <div>
              <span>Processor</span>
              <b>{displayedProduct.processor}</b>
            </div>

            <div>
              <span>RAM</span>
              <b>{displayedProduct.ram}</b>
            </div>

            <div>
              <span>Camera</span>
              <b>{displayedProduct.camera}</b>
            </div>

            <div>
              <span>Zoom</span>
              <b>{displayedProduct.zoom}</b>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.about}>
        <div>
          <h2>About</h2>

          <h3>{product.name}</h3>

          <p>{displayedProduct.description}</p>
        </div>

        <div>
          <h2>Tech specs</h2>

          {displayedProduct.cell.map(item => (
            <div className={styles.techRow} key={item}>
              <span>•</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <ProductsSlider
        title="You may also like"
        products={suggested}
        navigate={navigate}
        showDiscount={false}
      />
    </section>
  );
}
